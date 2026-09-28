import { onMounted, ref } from 'vue';

export default function useAnchor() {
  const article = ref(null);
  const catalog = ref([]);

  function genAnchor() {
    if (!article.value) return;

    const nodes = ['H2', 'H3'];
    const titles = [];
    article.value.childNodes.forEach((element, index) => {
      if (!nodes.includes(element.nodeName)) return;

      const id = `header-${index}`;
      element.setAttribute('id', id);
      titles.push({
        id,
        title: element.innerHTML,
        level: Number(element.nodeName.substring(1, 2)),
        nodeName: element.nodeName,
        children: [],
      });
    });

    const isEveryLevel3 = titles.every((title) => title.level === 3);
    catalog.value = titles.reduce((result, current) => {
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
