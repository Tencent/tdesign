import { onMounted, ref } from 'vue';

export interface AnchorItem {
  id: string;
  title: string;
  level: number;
  nodeName: string;
  children: AnchorItem[];
}

export default function useAnchor() {
  const article = ref<HTMLElement | null>(null);
  const catalog = ref<AnchorItem[]>([]);

  function genAnchor() {
    if (!article.value) return;

    const nodes = ['H2', 'H3'];
    const titles: AnchorItem[] = [];
    article.value.childNodes.forEach((element, index) => {
      if (!(element instanceof HTMLElement) || !nodes.includes(element.nodeName)) return;

      const id = element.id || `header-${index}`;
      element.setAttribute('id', id);
      titles.push({
        id,
        title: element.textContent ?? '',
        level: Number(element.nodeName.substring(1, 2)),
        nodeName: element.nodeName,
        children: [],
      });
    });

    const isEveryLevel3 = titles.every((title) => title.level === 3);
    catalog.value = titles.reduce<AnchorItem[]>((result, current) => {
      if (isEveryLevel3 || current.level === 2) {
        result.push(current);
      } else if (current.level === 3) {
        result[result.length - 1]?.children.push(current);
      }
      return result;
    }, []);
  }

  onMounted(genAnchor);

  return {
    article,
    catalog,
    genAnchor,
  };
}
