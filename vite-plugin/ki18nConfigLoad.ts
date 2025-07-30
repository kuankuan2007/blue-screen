import type { Plugin } from 'vite';
import fs from 'fs';
type I18nConfigItem = {
  [lang in string]: string;
};

type I18nConfig =
  | {
      [key in string]: I18nConfig;
    }
  | I18nConfigItem;

type I18nConfigResult = {
  [lang in string]: string | I18nConfigResult;
};

function transformConfig(config: I18nConfig) {
  const keys = Object.keys(config);

  const result: I18nConfigResult = {};
  if (keys.length === 0) {
    return result;
  }
  if (typeof config[keys[0]] === 'string') {
    const configItem = config as I18nConfigItem;
    for (const lang of keys) {
      result[lang] = configItem[lang];
    }
  } else {
    const configItem = config as { [key: string]: I18nConfig };
    for (const key of keys) {
      const subResult = transformConfig(configItem[key]);
      for (const lang in subResult) {
        if (!(lang in result)) {
          result[lang] = {};
        }
        (
          result[lang] as {
            [lang in string]: string | I18nConfigResult;
          }
        )[key] = subResult[lang];
      }
    }
  }
  return result;
}

export default function VitePluginKI18nConfigLoad({
  messages,
}: {
  messages: Record<string, string>;
}): Plugin {
  const configIds = Object.keys(messages).map((configId) => `virtual:k-i18n-config:${configId}`);
  const configPaths = Object.values(messages);
  
  const getConfig = async (id: string) => {
    if (id.endsWith('.json')) {
      return fs.promises.readFile(id, 'utf-8').then((data) => JSON.parse(data));
    }
    return import(id).then((module) => module.default);
  };
  
  return {
    name: 'vite-plugin-k-i18n-config-load',
    
    buildStart() {
      // 添加配置文件作为依赖，以便在它们变化时触发重新构建
      for (const configPath of configPaths) {
        this.addWatchFile(configPath);
      }
    },
    
    resolveId(id) {
      if (configIds.includes(id)) {
        return '\0' + id;
      }
    },
    
    async load(id) {
      if (id[0] === '\0' && configIds.includes(id.slice(1))) {
        const configId = id.replace(/^\0virtual:k-i18n-config:/, '');
        const configPath = messages[configId];
        
        // 确保每次加载时都添加文件依赖
        this.addWatchFile(configPath);
        
        const config = await getConfig(configPath);
        const transformedConfig = transformConfig(config.default || config);
        return `export default ${JSON.stringify(transformedConfig, null, 2)};export const langs = ${JSON.stringify(Object.keys(transformedConfig))};`;
      }
    },
  };
}
