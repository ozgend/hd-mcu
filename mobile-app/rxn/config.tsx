import { Storage } from './storage';

const DefaultAppConfig: IAppConfig = { ownerName: 'do', appTitle: 'XL MCU', themeName: 'default', dataProvider: 'mock', pollMsVHC: 2000, pollMsTHE: 5000, pollMsSYS: 5000 };

export interface IAppConfig {
  themeName: string;
  dataProvider: string;
  ownerName: string;
  appTitle: string;
  pollMsVHC: number;
  pollMsTHE: number;
  pollMsSYS: number;
}

export enum AppConfigField {
  ThemeName = 'themeName',
  DataProvider = 'dataProvider',
  OwnerName = 'ownerName',
  AppTitle = 'appTitle',
  PollMsVHC = 'pollMsVHC',
  PollMsTHE = 'pollMsTHE',
  PollMsSYS = 'pollMsSYS',
}

export const getAppConfig = (): IAppConfig => {
  let appConfig: { [key: string]: string } = {};
  try {
    for (const key in DefaultAppConfig) {
      appConfig[key] = getAppConfigField(key);
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
    let value = Storage.getString(`appConfig.${fieldName}`) ?? (DefaultAppConfig[fieldName as keyof IAppConfig] as string);
    value = value?.toString()?.toLocaleLowerCase();
    // console.log(`++ getAppConfigField: ${fieldName}="${value}"`);
    return value;
  } catch (error) {
    console.error(`++ getAppConfigField: error [${fieldName}]`);
    console.error(error);
    return DefaultAppConfig[fieldName as keyof IAppConfig] as string;
  }
};

export const setAppConfigField = (fieldName: string, value: any) => {
  try {
    Storage.set(`appConfig.${fieldName}`, value?.toString().toLocaleLowerCase());
    // console.log(`++ writeAppConfigField: ${fieldName}="${value}"`);
  } catch (error) {
    console.error(`++ writeAppConfigField: error [${fieldName}]`);
    console.error(error);
  }
};
