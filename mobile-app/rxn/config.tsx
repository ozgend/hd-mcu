import { Storage } from './storage';

const DefaultAppConfig: IAppConfig = { ownerName: 'do', appTitle: 'XL MCU', themeName: 'default', dataProvider: 'mock' };

export interface IAppConfig {
  themeName: string;
  dataProvider: string;
  ownerName: string;
  appTitle: string;
}

export enum AppConfigField {
  ThemeName = 'themeName',
  DataProvider = 'dataProvider',
  OwnerName = 'ownerName',
  AppTitle = 'appTitle',
}

export const getAppConfig = (): IAppConfig => {
  let appConfig: { [key: string]: string } = {};
  try {
    for (const key in DefaultAppConfig) {
      appConfig[key] = getAppConfigField(key).toLowerCase();
    }
    return appConfig as unknown as IAppConfig;
  } catch (error) {
    console.error('++ readAppConfig error', error);
    return { ...DefaultAppConfig };
  }
};

export const setAppConfig = (appConfig: IAppConfig) => {
  try {
    for (const key in appConfig) {
      setAppConfigField(key, appConfig[key as keyof IAppConfig]);
    }
  } catch (error) {
    console.error('++ writeAppConfig error', error);
  }
};

export const getAppConfigField = (fieldName: string): string => {
  try {
    const value = Storage.getString(`appConfig.${fieldName}`) ?? DefaultAppConfig[fieldName as keyof IAppConfig];
    // console.log(`++ getAppConfigField: ${fieldName}="${value}"`);
    return value;
  } catch (error) {
    console.error('++ readAppConfigField error', error);
    return DefaultAppConfig[fieldName as keyof IAppConfig];
  }
};

export const setAppConfigField = (fieldName: string, value: string) => {
  try {
    Storage.set(`appConfig.${fieldName}`, value.toString().toLowerCase());
    // console.log(`++ writeAppConfigField: ${fieldName}="${value}"`);
  } catch (error) {
    console.error('++ writeAppConfigField error', error);
  }
};
