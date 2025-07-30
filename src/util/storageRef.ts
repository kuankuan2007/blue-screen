const _record: Map<Storage, Record<string, Ref>> = new Map();

export default function storageRef(
  name: string,
  initValue: string | null = null,
  storage: Storage = localStorage
) {
  if (!_record.has(storage)) {
    _record.set(storage, {});
  }
  const _storageRecord = _record.get(storage)!;
  if (name in _storageRecord) {
    return _storageRecord[name];
  }
  if (localStorage.getItem(name) === null && initValue !== null) {
    localStorage.setItem(name, initValue);
  }
  const _ref = ref(localStorage.getItem(name));
  watch(_ref, (val) => {
    if (val !== null) {
      localStorage.setItem(name, val);
    } else {
      localStorage.removeItem(name);
    }
  });
  _storageRecord[name] = _ref;
  return _ref;
}

window.addEventListener('storage', (e) => {
  if (!e.storageArea || !e.key) {
    return;
  }
  const _storageRecord = _record.get(e.storageArea);
  if (!_storageRecord) {
    return;
  }
  if (e.key in _storageRecord) {
    _storageRecord[e.key].value = e.newValue;
  }
});
