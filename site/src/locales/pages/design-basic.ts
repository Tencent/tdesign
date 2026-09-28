export default {
  'zh-CN': {
    common: {
      copied: '复制成功',
    },
    values: {
      sections: {
        inclusiveness: {
          title: '包容',
          description:
            'TDesign 是具有包容性的设计体系，它强调为业务提供产品、服务等过程中，追求以人为本、人人受益的包容性，要求搭建过程中，了解业务底层，理解业务场景的多样性，并在繁杂的业务场景中寻找共性和特性，确保彼此能灵活地在同一个环境并存，既能满足当下需要，也能作用于更广泛的场景，为不同的产品保留定制空间，在保证不同产品能够体现自我特色的同时，TDesign 还可以为更广泛的产品提供适合的服务。',
        },
        diversity: {
          title: '多元',
          description:
            '在一个专业环境里，我们希望 TDesign 可以保持多元。我们意识到在世界中不可能单一化，所以作为设计体系需要不断纳入新鲜血液，适应未来的技术和体验变革，不断地进行多元化生长。TDesign 基于腾讯业务，同时也服务于业务，并伴随着业务的使用后获得业务的反哺，从而不断地得到多元内容补充。在保证价值观一致的基础上，洞察多个业务场景需求，赋能腾讯及生态中的不同业务类型，为 TDesign 探索更多的多元化机会点。',
        },
        evolution: {
          title: '进化',
          description:
            '进化是迄今为止最为人类理解和遵从的造物者法则，TDesign 的设计体系同样遵循进化。在设计上保持敏锐感，与趋势产生共鸣，推动整体风格不断进化。对当前对用户和产品友好基础上，保持其内核的坚定，用发展的眼光完善 TDesign 产品矩阵。在设计过程中考虑更多的可能性，为技术发展、体验模式变化、设计趋势、企业与产品的升级留有空间，同时保证迭代优化系统的延续性和持久性。',
        },
        connectivity: {
          title: '连接',
          description:
            '“连接一切”深深印刻在腾讯的基因中，在这个过程中，TDesign 作为腾讯生态基础服务，需要起到连接和开放的作用，不仅支持内部海量业务的稳定运营，还能提供领先的各行业解决方案，满足全场景生态能力的建设。TDesign 将会持续地涵盖腾讯的前沿技术、策略经验和物料资产开放、共享，用最大努力去连接赋能，连接用户、连接企业、连接生态，更连接未来。',
        },
      },
    },
    fonts: {
      summary: {
        title: '概述',
        description:
          '网页文字将与网页中的界面系统相结合，从而形成一个可供用户操作的产品系统，用户除了阅读，还需要完成一系列与界面系统产生的交互行为。因此，在网页设计中，文字系统是影响产品可用性的重要因素。',
        principles:
          'TDesign 秉承包容、多元、进化和连接的价值观，这将指引文字系统制定「好用」、「好记」和「美观」的字体设计原则，希望字体是有规律和韵律、实现像素对齐、可以拉开清晰明确的层次关系、具有和谐美观的大小对比效果。',
      },
      style: {
        title: '字体样式',
        description:
          '字体定义每个系统中所使用的字体，给到统一的字体规范，在 TDesign 当中，需要通过字体、字阶、行高、字重、字色几个维度去制定文字系统。',
      },
      family: {
        title: '字体',
        description:
          'font-family 是用于某个元素的字体族名称或/及类族名称的一个优先表。如果浏览器不支持第一个字体，则会尝试优先表中的下一个。不同主流的操作系统及浏览器的默认字体不尽相同。从西文到中文，分别对各个平台做一个基础的降级，这是针对系统字体规范 font-family 的基本思路。',
        note: '这里需要注意的是，不声明字体时，浏览器渲染的是「默认字体」，不一定是「系统字体」。例如：Windows 7 浏览器默认渲染的是中易宋体（Simsun），而非系统字体微软雅黑（Microsoft YaHei）。',
        stack:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
      },
      numberFont: {
        title: '数字字体',
        description:
          '在展示表格数据时，应该使用等距的表格数字。表格数字相比普通字体的数字能实现更好的对齐，在获取数据时用户能更快速便捷的扫描和对比。表格数字可以说是特殊字体，使用腾讯云数字字体，可以满足在缩放中保持稳定可见的粗细。',
        download: 'TCloud Number',
      },
      size: {
        title: '字阶',
        description: '字阶定义一级字阶和二级字阶，一级字阶常用于基础组件的设计中，二级字阶用于标题及特殊场景的应用。',
        primary:
          '第一字阶，每个字号的增长步数差距为 2px。桌面端中，Body 字号设置为 14px，Base 取 12px，桌面端的最小字号是 12px，而 10px 则作为移动端的 Base 字号，将桌面端与移动端字阶统一处理，让两端文字与设计系统更一致，更标准地调控。',
        secondary:
          '第二字阶，为了减少字阶区间里的步数，在这个范围中的文字，多为模块超大标题、展示型文案，以数字数据展示为主。通过 +4、+8、+12、+16 的步数增长规律，满足这个范围的字阶中，文字层级跨度大的展示诉求，也减少没有必要的小步数字号。',
        stepColumn: '字阶',
        sizeColumn: '字号',
        baseStep: '基础',
        primaryLabel: '第一字阶',
        secondaryLabel: '第二字阶',
        option: '{size}px',
        items: {
          mobileMinimum: '10px 移动端最小',
          desktopMinimum: '12px 桌面端最小',
          body: '14px 正文',
          tdesign16: '16px TDesign',
          tdesign20: '20px TDesign',
          tdesign: '{size}px TDesign',
        },
      },
      lineHeight: {
        title: '行高',
        standard:
          '关于文字的行高，CSS 属性中的 line-height，在国际无障碍网页使用标准中给出了明确指引：line-height = font size × 1.5。',
        problem:
          '在验证过程中发现，固定 1.5 倍的行高比例，在字号越大时行高也会越大，在大号文字的展示上信息的连贯明显出现割裂，尤其在多种字号及元素混排的场景中。',
        solution:
          '行高是为了让上一行和下一行文字之间有呼吸空间。基于呼吸空间一致，让不同字号之间的间距保持相同，通过逻辑得到公式「行高 = 字号 + n」。8 作为变量正好同时满足与 1.5 倍的「14px & 16px」常用字号行高保持一致，总体文字间隙稳定，得出计算公式「line-height = font size + 8」。',
        placeholder: '-请选择-',
        value: 'line-height: {value}px',
        formula: 'line-height = font size + n',
        variable: 'n = 8',
      },
      sample: '欢迎使用 TDesign',
      weight: {
        title: '字重',
        description: '字重是重要排版的变量，可以增强层次结构和重要内容区分。',
        platforms:
          '面对复杂的中后台场景，在 Windows 系统下 font-weight 如果使用小于 600 默认显示为常规体，而在 macOS 系统中可以使用 400、500、600 区分。综合考虑复杂场景显示效果，TDesign 共提供两种字重配置效果。',
        values:
          'font-weight: 400 和 font-weight: 600。字重 400 等于 Windows 和 macOS 系统下的 Regular 显示效果，字重 600 等于 Windows 系统下的 Bold 显示效果和 macOS 系统下的 Semibold 显示效果。',
        sample600: '欢迎使用 TDesign (600)',
        sample400: '欢迎使用 TDesign (400)',
      },
      color: {
        title: '字体颜色',
        description:
          'TDesign 文字和图标色彩系统采用透明度方向，期望更好地适配亮暗模式，让整个文字和图标色彩都更加具备包容性。',
        levels:
          '根据字体样式的设计原则，制定了简易好记的透明度数值区间，并且将该字色与界面系统的色彩系统结合，文字显示色彩对比满足至少 1:4.5（AA 级别）。且验证了其中的实用性，共分为亮暗两种模式、4 个色阶。',
        note: '注意：因为黑底白字的 Web AIM 值曲线和白底黑字不同，加了透明度之后辨识度比白底黑字高。为保证一致的通用文字阅读舒适性，暗色模式平衡了 AIM 值，略微降低透明度，确保 AIM 差值曲线均衡。',
        usage: '不同的字体色彩有不同功能用法，具体可以参考 Design Token 示意查看。',
        grayLabel: 'Font Gy{number}',
        whiteLabel: 'Font Wh{number}',
        grayValue: '#000000 {opacity}%',
        whiteValue: '#ffffff {opacity}%',
      },
    },
    dark: {
      summary: {
        title: '概述',
        description:
          '深色模式是一种夜间友好的颜色主题，主要侧重于 UI 界面中每个元素可读性所需的最小色彩对比度，以保证出色的阅读体验。',
        imageAlt: '深色模式起始示例',
      },
      principles: {
        title: '原则',
        items: {
          contentFirst: {
            title: '内容优先',
            description: '深色模式下应优先保证内容识别度。需要确保文本内容易于阅读，而不是无缘无故的花哨。',
          },
          readingComfort: {
            title: '阅读舒适度',
            description:
              '尽量避免使用高饱和度的颜色，因为在较暗的表面上观看时，高饱和度颜色具有视觉“抖动”效果。相反，使用低饱和度或稍微柔和的颜色会减少人眼的视觉疲劳，保证阅读舒适性。',
          },
          consistency: {
            title: '信息层级一致性',
            description: '浅色模式和深色模式下转换时应该保持信息层级一致性。',
          },
          wcag: {
            title: '符合 WCAG2.0 标准',
            description:
              '依据 WCAG2.0 设计标准，文本的视觉呈现以及文本图像至少要有 1:4.5 的对比度，以确保所有文字内容清晰易读、对比度足够。',
          },
        },
      },
      text: {
        title: '文字',
        description:
          '浅色文本出现在深色背景上时，正文文字和背景的对比度至少要有 1:4.5（AA 标准）。在 TDesign 中，除了保证文字识别度之外，希望不同梯度的文字在深浅模式切换后的视觉感知也能趋于一致，所以针对转换后的透明度进行了微调。',
        columns: {
          token: 'token',
          name: '名称',
          color: '色值',
        },
        rows: {
          title: '标题',
          secondary: '次要文字',
          placeholder: '占位符文字',
          disabled: '禁用状态文字',
        },
      },
      color: {
        title: '色彩',
        description:
          '在 TDesign 色彩系统中，在亮色的色彩算法基础上，经过运算得到深色模式的色板。色阶的制定同样采用了 CIElab、HSL 色彩空间结合插值的方法，保证色彩变化均匀，多色之间亮度均等。',
        paletteDescription: '色彩中提供了 8 套常用的基础色板，每个扩展色均为 10 级色阶。',
        basicPalette: '基础色板',
        colorLabel: '{family}{level}',
        families: {
          blue: 'Blue',
          cyan: 'Cyan',
          purple: 'Purple',
          pink: 'Pink',
          red: 'Red',
          orange: 'Orange',
          yellow: 'Yellow',
          green: 'Green',
        },
      },
    },
  },
  'en-US': {
    common: {
      copied: 'Copied',
    },
    values: {
      sections: {
        inclusiveness: {
          title: 'Inclusiveness',
          description:
            'TDesign is an inclusive design system that emphasizes a people-centric approach in providing products and services, ensuring that everyone benefits. It seeks commonalities and characteristics in diverse business scenarios so they can coexist flexibly, satisfy immediate needs, adapt to broader scenarios, and retain customization space for different products.',
        },
        diversity: {
          title: 'Diversity',
          description:
            'In a professional environment, we expect TDesign to maintain diversity. A design system must continually incorporate new perspectives and adapt to future technological and experiential changes. Through mutual feedback with business users, TDesign is enriched with diverse content while maintaining consistent values and empowering different business scenarios.',
        },
        evolution: {
          title: 'Evolution',
          description:
            "Evolution is a principle of creation that TDesign's design system also follows. It remains sensitive to design, resonates with trends, and continuously evolves its overall style. TDesign maintains its core while improving its product matrix and leaving room for technological developments, changing experience patterns, design trends, and product upgrades.",
        },
        connectivity: {
          title: 'Connectivity',
          description:
            '"Connecting everything" is deeply imprinted in Tencent\'s genes. As a basic service of Tencent\'s ecosystem, TDesign plays a connecting and open role by supporting internal businesses and providing leading industry solutions. It continues to open and share technology, experience, and assets to connect users, enterprises, the ecosystem, and the future.',
        },
      },
    },
    fonts: {
      summary: {
        title: 'Summary',
        description:
          "Webpage text is integrated with the webpage's interface system, forming a product system that users can interact with in addition to reading. Therefore, the text system is an important factor affecting product usability.",
        principles:
          'TDesign adheres to the values of inclusiveness, diversity, evolution, and connection. These guide font design principles that are easy to use, easy to remember, and beautiful, with rhythm, pixel alignment, clear hierarchy, and harmonious size contrast.',
      },
      style: {
        title: 'Font Style',
        description:
          'TDesign establishes a unified text system through font family, font size, line height, font weight, font color, and other dimensions.',
      },
      family: {
        title: 'Font',
        description:
          'Font-family is a prioritized list of font family names. If the browser does not support the first font, it tries the next one. Since default fonts differ between operating systems and browsers, each platform uses a basic fallback from English to Chinese.',
        note: 'When fonts are not declared, the browser renders its default font, which is not necessarily the system font. For example, Windows 7 browsers default to Simsun rather than Microsoft YaHei.',
        stack:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
      },
      numberFont: {
        title: 'Number Font',
        description:
          "Tabular figures are recommended for tabular data because their alignment helps users scan and compare data efficiently. Tencent's number font maintains stable thickness and visibility while scaling.",
        download: 'TCloud Number',
      },
      size: {
        title: 'Font Size',
        description:
          'Font sizes are divided into primary and secondary levels. Primary sizes are used in basic components, while secondary sizes are used for titles and special scenarios.',
        primary:
          'Primary font sizes increase in 2px steps. Desktop body text is 14px with a 12px base and minimum, while mobile uses a 10px base. This unifies font hierarchy across platforms.',
        secondary:
          'Secondary font sizes use +4, +8, +12, and +16 steps for large module titles, display text, and numerical data, supporting significant hierarchy differences without unnecessary increments.',
        stepColumn: 'Font Size',
        sizeColumn: 'Size',
        baseStep: 'base',
        primaryLabel: 'first font size',
        secondaryLabel: 'second font size',
        option: '{size}px',
        items: {
          mobileMinimum: '10px minimum in mobile',
          desktopMinimum: '12px minimum in desktop',
          body: '14px content',
          tdesign16: '16px TDesign',
          tdesign20: '20px TDesign',
          tdesign: '{size}px TDesign',
        },
      },
      lineHeight: {
        title: 'Line Height',
        standard: 'The international web accessibility standard defines line-height as font size × 1.5.',
        problem:
          'A fixed ratio of 1.5 increases line height with font size and can fragment information in large text, especially when multiple font sizes and elements are mixed.',
        solution:
          'Line height provides breathing space between lines. Keeping that space consistent produces the formula “line height = font size + n”. Setting n to 8 matches the common 14px and 16px sizes at 1.5 times their font size and maintains a stable rhythm.',
        placeholder: '-Please select-',
        value: 'line-height: {value}px',
        formula: 'line-height = font size + n',
        variable: 'n = 8',
      },
      sample: 'Welcome to use TDesign',
      weight: {
        title: 'Font Weight',
        description:
          'Font weight is an important typography variable that strengthens hierarchy, emphasizes content, and improves readability.',
        platforms:
          'In complex backend scenarios, Windows may display weights below 600 as regular, while macOS distinguishes 400, 500, and 600. TDesign therefore provides two font-weight configurations.',
        values:
          'Font weight 400 is equivalent to Regular on Windows and macOS. Font weight 600 resembles Bold on Windows and Semibold on macOS.',
        sample600: 'Welcome to use TDesign (600)',
        sample400: 'Welcome to use TDesign (400)',
      },
      color: {
        title: 'Font Color',
        description:
          'TDesign uses an opacity-based color system for fonts and icons to adapt to light and dark modes and make the palette more inclusive.',
        levels:
          'TDesign defines memorable opacity values integrated with the interface color system. Text contrast meets the 1:4.5 AA level, with four color grades for both light and dark modes.',
        note: 'Web AIM curves differ between white text on black and black text on white. Dark mode slightly reduces opacity to balance the difference and maintain comfortable, consistent readability.',
        usage:
          'Different font colors serve different functions. Refer to the Design Token illustrations for specific usage.',
        grayLabel: 'Font Gy{number}',
        whiteLabel: 'Font Wh{number}',
        grayValue: '#000000 {opacity}%',
        whiteValue: '#ffffff {opacity}%',
      },
    },
    dark: {
      summary: {
        title: 'Summary',
        description:
          'Dark mode is a night-friendly color theme focused on the minimum contrast required for readable UI elements and an excellent reading experience.',
        imageAlt: 'Dark mode starter example',
      },
      principles: {
        title: 'Principle',
        items: {
          contentFirst: {
            title: 'Content First',
            description:
              'Dark mode should prioritize content legibility. Text should be easy to read rather than needlessly flashy.',
          },
          readingComfort: {
            title: 'Reading Comfort',
            description:
              'Avoid highly saturated colors, which can visually vibrate on dark surfaces. Lower-saturation or softer colors reduce visual fatigue and improve reading comfort.',
          },
          consistency: {
            title: 'Maintain Consistency in Information',
            description: 'Maintain a consistent information hierarchy when switching between light and dark modes.',
          },
          wcag: {
            title: 'Meeting WCAG2.0 Standard',
            description:
              'According to WCAG2.0, text and its background should have a contrast ratio of at least 1:4.5 so all text remains clear and readable.',
          },
        },
      },
      text: {
        title: 'Text',
        description:
          'When light text appears on a dark background, body text and its background should have a contrast ratio of at least 1:4.5 (AA). TDesign also adjusts opacity so different text gradients retain consistent visual perception between light and dark modes.',
        columns: {
          token: 'token',
          name: 'name',
          color: 'value',
        },
        rows: {
          title: 'Title',
          secondary: 'Secondary Text',
          placeholder: 'Placeholder Text',
          disabled: 'Disabled Text',
        },
      },
      color: {
        title: 'Color',
        description:
          'The TDesign dark-mode palette is calculated from the light-color algorithm. Its gradients combine CIElab and HSL color spaces with interpolation to keep color changes uniform and brightness balanced.',
        paletteDescription: 'TDesign provides eight commonly used basic palettes, each with ten gradient levels.',
        basicPalette: 'Basic Palette',
        colorLabel: '{family}{level}',
        families: {
          blue: 'Blue',
          cyan: 'Cyan',
          purple: 'Purple',
          pink: 'Pink',
          red: 'Red',
          orange: 'Orange',
          yellow: 'Yellow',
          green: 'Green',
        },
      },
    },
  },
};
