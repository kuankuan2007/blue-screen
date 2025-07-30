import { createI18n } from 'vue-i18n';
import messages, { langs } from 'virtual:k-i18n-config:main';
import storageRef from '@/util/storageRef';

const languageName = {
  _auto: computed(
    (): string => `Auto (${languageName[browserLanguage.value as keyof typeof languageName]})`
  ),
  'zh-cn': '简体中文',
  'en-us': 'English',
};

export const languageList = ['_auto', ...langs].map((i) => ({
  id: i,
  name: languageName[i as keyof typeof languageName],
}));

const LOCALSTORAGE_KEY = '_vue_i18n_main_locale';
function getBrowserLanguage() {
  const languages = (navigator?.languages || []).map((i) => i.toLowerCase());
  const _langsOnly = langs.map((i) => i.split('-')[0]);
  for (const i of languages) {
    if (langs.includes(i)) {
      return i;
    }
    if (_langsOnly.includes(i)) {
      return langs[_langsOnly.indexOf(i)];
    }
  }
  return langs[0];
}
const browserLanguage = ref(getBrowserLanguage());
export const localSettingLanguage = storageRef(LOCALSTORAGE_KEY, '_auto');
if (localSettingLanguage.value !== '_auto' && !langs.includes(localSettingLanguage.value)) {
  localSettingLanguage.value = '_auto';
}
export const language = computed({
  get: () => {
    browserLanguage.value;
    if (localSettingLanguage.value === '_auto') {
      return browserLanguage.value;
    }
    return localSettingLanguage.value;
  },
  set: (newValue) => {
    localSettingLanguage.value = newValue;
  },
});
watch(language, (value) => {
  i18n.global.locale.value = value;
});

export const i18n = createI18n({
  legacy: false,
  locale: language.value,
  fallbackLocale: 'en-us',
  messages,
});
console.log(messages)
window.addEventListener('languagechange', () => {
  browserLanguage.value = getBrowserLanguage();
});
