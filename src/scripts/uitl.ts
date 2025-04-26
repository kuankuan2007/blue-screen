import Color from 'color';

export function getVisibleColor(bgColor: Color | string) {
  if (typeof bgColor === 'string') {
    bgColor = Color(bgColor);
  }
  return bgColor.isDark() ? Color('#fff') : Color('#000');
}
export function decodePageData(pageData: object, data?: string) {
  if (typeof data !== 'string') {
    return;
  }
  const _data = JSON.parse(data);
  if (typeof _data !== 'object') {
    return;
  }
  for (const key in _data) {
    if (key in pageData) {
      // @ts-expect-error 7053
      pageData[key] = _data[key];
    }
  }
}
export const copyText = (() => {
  if (navigator.clipboard) {
    return (text: string) => navigator.clipboard.writeText(text);
  }
  return (text: string) => {
    const ele = document.createElement('input');
    ele.value = text;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand('copy');
    document.body.removeChild(ele);
  };
})();
