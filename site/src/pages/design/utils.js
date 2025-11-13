export function genAnchor(articleRef, catalog) {
  if (!articleRef.value) return;
  const articleContent = articleRef.value;
  const nodes = ['H2', 'H3'];
  const titles = [];
  articleContent.childNodes.forEach((e, index) => {
    if (nodes.includes(e.nodeName)) {
      const id = `header-${index}`;
      e.setAttribute('id', id);
      titles.push({
        id,
        title: e.innerHTML,
        level: Number(e.nodeName.substring(1, 2)),
        nodeName: e.nodeName,
        children: [],
      });
    }
  });

  const isEveryLevel3 = titles.every((t) => t.level === 3);
  catalog.value = titles.reduce((acc, curr) => {
    if (isEveryLevel3) {
      acc.push(curr);
    } else {
      if (curr.level === 2) {
        acc.push(curr);
      } else if (curr.level === 3) {
        acc[acc.length - 1].children.push(curr);
      }
    }
    return acc;
  }, []);
}
