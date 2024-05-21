import { Storage } from './storage';

const appConfigPath: string = `app.config.json`;
export const DefaultAppConfig: IAppConfig = { ownerName: 'do', appTitle: 'XL MCU', themeName: 'default' };

export interface IAppConfig {
  ownerName: string;
  appTitle: string;
  themeName: string;
}

export const readAppConfig = (): IAppConfig => {
  let appConfig: { [key: string]: string } = {};
  try {
    for (const key in DefaultAppConfig) {
      appConfig[key] = (Storage.getString(`appConfig.${key}`) ?? DefaultAppConfig[key as keyof IAppConfig]).toLowerCase();
      console.log(`++ readAppConfig: ${key}="${appConfig[key]}"`);
    }
    return appConfig as unknown as IAppConfig;
  } catch (error) {
    console.error('++ readAppConfig error', error);
    return { ...DefaultAppConfig };
  }
};

export const writeAppConfigField = (fieldName: string, value: any) => {
  try {
    Storage.set(`appConfig.${fieldName}`, value.toString().toLowerCase());
    console.log(`++ writeAppConfigField: ${fieldName}="${value}"`);
  } catch (error) {
    console.error('++ writeAppConfigField error', error);
  }
};

export const writeAppConfig = (appConfig: IAppConfig) => {
  try {
    for (const key in appConfig) {
      writeAppConfigField(key, appConfig[key as keyof IAppConfig]);
    }
  } catch (error) {
    console.error('++ writeAppConfig error', error);
  }
};
