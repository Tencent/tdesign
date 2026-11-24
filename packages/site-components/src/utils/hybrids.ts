import { define as baseDefine, type Component } from 'hybrids';

export * from 'hybrids';

const ATTRIBUTE_VERSION = '__attributeVersion';
const explicitlySetProperties = new WeakMap<AttributeSyncHost, Set<string>>();

interface AttributeSyncHost extends HTMLElement {
  [ATTRIBUTE_VERSION]: number;
  [key: string]: unknown;
}

interface PropertyConfig {
  type: string;
}

function markPropertyAsExplicitlySet(host: AttributeSyncHost, key: string): void {
  let properties = explicitlySetProperties.get(host);
  if (!properties) {
    properties = new Set();
    explicitlySetProperties.set(host, properties);
  }
  properties.add(key);
}

function getWritableProperties(component: Component<unknown>): Map<string, PropertyConfig> {
  const properties = new Map<string, PropertyConfig>();

  Object.entries(component).forEach(([key, property]) => {
    if (key === 'tag' || key === 'render') return;

    if (typeof property !== 'object' || property === null) {
      if (typeof property !== 'function') properties.set(key, { type: typeof property });
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(property, 'value')) return;
    const value = (property as { value: unknown }).value;
    if (typeof value !== 'function' || value.length > 1) {
      properties.set(key, { type: typeof value });
    }
  });

  return properties;
}

function trackPropertySetters(tag: string, properties: Map<string, PropertyConfig>): void {
  const constructor = customElements.get(tag);
  if (!constructor) return;

  properties.forEach((_property, key) => {
    const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, key);
    if (!descriptor?.set) return;

    const setter = descriptor.set;
    Object.defineProperty(constructor.prototype, key, {
      ...descriptor,
      set(this: AttributeSyncHost, value: unknown) {
        markPropertyAsExplicitlySet(this, key);
        setter.call(this, value);
      },
    });
  });
}

function dashToCamelCase(value: string): string {
  return value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function syncAttribute(host: AttributeSyncHost, attributeName: string, property: PropertyConfig): void {
  const key = dashToCamelCase(attributeName);
  const attributeValue = host.getAttribute(attributeName);

  if (attributeValue === null) {
    host[key] = undefined;
  } else if (property.type === 'boolean') {
    host[key] = true;
  } else if (property.type === 'number') {
    host[key] = Number(attributeValue);
  } else {
    host[key] = attributeValue;
  }
}

function withAttributeSync<E>(component: Component<E>): Component<E> {
  const properties = getWritableProperties(component as Component<unknown>);
  const { tag, ...definition } = component;
  const render = component.render;
  const syncedRender =
    typeof render === 'function'
      ? (host: E & AttributeSyncHost) => {
          void host[ATTRIBUTE_VERSION];
          return render(host);
        }
      : render && {
          ...render,
          value: (host: E & AttributeSyncHost) => {
            void host[ATTRIBUTE_VERSION];
            return render.value(host);
          },
        };

  return {
    tag,
    [ATTRIBUTE_VERSION]: {
      value: 0,
      connect: (host: AttributeSyncHost) => {
        Array.from(host.attributes).forEach(({ name }) => {
          const key = dashToCamelCase(name);
          const property = properties.get(key);
          if (property && !explicitlySetProperties.get(host)?.has(key)) {
            syncAttribute(host, name, property);
          }
        });

        const observer = new MutationObserver((mutations) => {
          mutations.forEach(({ attributeName }) => {
            if (!attributeName) return;
            const property = properties.get(dashToCamelCase(attributeName));
            if (property) {
              syncAttribute(host, attributeName, property);
            } else if (attributeName.startsWith('data-')) {
              host[ATTRIBUTE_VERSION] += 1;
            }
          });
        });
        observer.observe(host, { attributes: true });

        return () => observer.disconnect();
      },
    },
    ...definition,
    ...(syncedRender ? { render: syncedRender } : {}),
  } as Component<E>;
}

export const define = Object.assign(
  <E>(component: Component<E>): Component<E> => {
    const properties = getWritableProperties(component as Component<unknown>);
    const definition = baseDefine(withAttributeSync(component));
    trackPropertySetters(component.tag, properties);
    return definition;
  },
  {
    compile: baseDefine.compile,
    from: baseDefine.from,
  },
);
