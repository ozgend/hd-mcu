import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IThemeColor {
  background: string;
  foreground: string;
  border: string;
}

export const AppThemeNames = {
  default: 'default',
  black: 'black',
  white: 'white',
};

const themeColors: { [key: string]: IThemeColor } = {
  default: {
    background: '#222',
    foreground: '#fa0',
    border: '#444',
  },
  black: {
    background: '#010101',
    foreground: '#f3f3f3',
    border: '#222',
  },
  white: {
    background: '#f3f3f3',
    foreground: '#010101',
    border: '#888',
  },
};

const getThemeColor = (themeName?: string): IThemeColor => {
  return themeColors[themeName ?? AppThemeNames.default];
};

export const getTabTheme = (themeName?: string) => {
  const themeColor = getThemeColor(themeName);

  return {
    dark: themeName !== AppThemeNames.white,
    colors: {
      primary: themeColor.foreground,
      background: themeColor.background,
      card: themeColor.background,
      text: themeColor.foreground,
      border: themeColor.border,
      notification: themeColor.foreground,
    },
  };
};

export const getStyleSheet = (themeName?: string) => {
  const themeColor = getThemeColor(themeName);

  console.log('++ getStyleSheet:', themeName);

  return StyleSheet.create({
    progressView: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: themeColor.background,
      height: 20,
    },
    container: {
      flex: 1,
      padding: 4,
      backgroundColor: themeColor.background,
      color: themeColor.foreground,
      textAlignVertical: 'center',
      textTransform: 'uppercase',
      verticalAlign: 'middle',
    },
    scrollContainer: {
      flex: 1,
      padding: 4,
      backgroundColor: themeColor.background,
      color: themeColor.foreground,
      textAlignVertical: 'center',
      textTransform: 'uppercase',
      verticalAlign: 'middle',
    },
    actionBarView: {
      paddingTop: 4,
      paddingBottom: 4,
      height: 50,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      verticalAlign: 'middle',
      textTransform: 'uppercase',
      textAlignVertical: 'center',
      backgroundColor: themeColor.background,
    },
    actionBarHeader: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'flex-end',
      alignItems: 'flex-end',
      fontSize: 30,
      color: themeColor.foreground,
      textAlign: 'left',
      fontWeight: '300',
      textTransform: 'uppercase',
    },
    actionBarButton: {
      borderCurve: 'continuous',
      backgroundColor: themeColor.background,
      borderColor: themeColor.foreground,
      borderWidth: 1,
      textAlign: 'right',
      color: themeColor.foreground,
      fontSize: 18,
      alignSelf: 'flex-end',
      alignContent: 'flex-end',
      alignItems: 'flex-end',
      textAlignVertical: 'center',
      textTransform: 'uppercase',
      verticalAlign: 'middle',
      width: 90,
      shadowColor: themeColor.foreground,
    },
    actionBarButtonRunning: {
      borderCurve: 'continuous',
      backgroundColor: themeColor.foreground,
      borderColor: themeColor.foreground,
      borderWidth: 1,
      textAlign: 'right',
      color: themeColor.background,
      fontSize: 18,
      alignSelf: 'flex-end',
      alignContent: 'flex-end',
      alignItems: 'flex-end',
      textAlignVertical: 'center',
      textTransform: 'uppercase',
      verticalAlign: 'top',
      width: 90,
    },
    redColor: {
      color: '#f22',
    },
    greenColor: {
      color: '#2f2',
    },
    actionBarStatusIcon: {
      backgroundColor: themeColor.background,
      fontSize: 26,
      textTransform: 'uppercase',
      marginHorizontal: 10,
      padding: 4,
    },
    button: {
      borderCurve: 'continuous',
      backgroundColor: themeColor.foreground,
      textAlign: 'right',
      color: themeColor.background,
      fontSize: 18,
      alignSelf: 'flex-end',
      alignContent: 'flex-end',
      alignItems: 'flex-end',
      textAlignVertical: 'center',
      textTransform: 'uppercase',
      verticalAlign: 'top',
    },
    centerContainer: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'flex-end',
      textAlign: 'right',
      backgroundColor: themeColor.background,
      verticalAlign: 'middle',
    },
    brand: {
      fontSize: 54,
      fontWeight: '300',
      color: themeColor.foreground,
      flexWrap: 'wrap',
      textTransform: 'uppercase',
      textAlign: 'right',
      marginVertical: 20,
      paddingVertical: 20,
      width: '100%',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'normal',
      color: themeColor.foreground,
      flexWrap: 'wrap',
      textTransform: 'uppercase',
      alignItems: 'flex-end',
      textAlign: 'right',
      alignContent: 'flex-end',
    },
    text: {
      fontSize: 22,
      fontWeight: '200',
      color: themeColor.foreground,
      textTransform: 'uppercase',
      alignItems: 'flex-end',
      textAlign: 'right',
      alignContent: 'flex-end',
    },
    textSmall: {
      fontSize: 14,
      color: themeColor.foreground,
      textTransform: 'uppercase',
      alignItems: 'flex-end',
      textAlign: 'right',
      alignContent: 'flex-end',
    },
    sensorItem: {
      padding: 12,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: themeColor.background,
      borderBottomColor: themeColor.border,
      textTransform: 'uppercase',
      borderBottomWidth: 1,
    },
    sensorTitle: {
      fontSize: 30,
      fontWeight: '200',
      textTransform: 'uppercase',
      minWidth: 100,
      color: themeColor.foreground,
    },
    sensorValue: {
      fontSize: 36,
      textTransform: 'uppercase',
      textAlign: 'right',
      fontWeight: 'normal',
      flexGrow: 1,
      color: themeColor.foreground,
    },
    deviceListItem: {
      padding: 10,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: themeColor.background,
      borderColor: themeColor.border,
      textTransform: 'uppercase',
      borderTopWidth: 1,
    },
    infoItem: {
      paddingHorizontal: 12,
      paddingVertical: 2,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: themeColor.background,
      borderColor: themeColor.border,
      textTransform: 'uppercase',
      borderTopWidth: 1,
    },
    infoTitle: {
      paddingHorizontal: 4,
      fontSize: 16,
      fontWeight: '200',
      textTransform: 'uppercase',
      textAlign: 'right',
      minWidth: 100,
      color: themeColor.foreground,
    },
    infoValue: {
      paddingHorizontal: 4,
      fontSize: 16,
      textTransform: 'uppercase',
      textAlign: 'left',
      fontWeight: 'normal',
      flexGrow: 1,
      color: themeColor.foreground,
    },
    sensorUnit: {
      fontSize: 18,
      fontWeight: '300',
      textAlign: 'right',
      textTransform: 'uppercase',
      minWidth: 50,
      color: themeColor.foreground,
    },
    statusText: {
      padding: 30,
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: themeColor.foreground,
    },
    infoItemVehicle: {
      padding: 12,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: themeColor.background,
      borderBottomColor: themeColor.border,
      textTransform: 'uppercase',
      borderBottomWidth: 1,
    },
    infoTitleVehicle: {
      paddingHorizontal: 4,
      fontSize: 16,
      fontWeight: '200',
      textTransform: 'uppercase',
      textAlign: 'left',
      minWidth: 140,
      color: themeColor.foreground,
    },
    infoValueVehicle: {
      fontSize: 22,
      textTransform: 'uppercase',
      textAlign: 'right',
      fontWeight: 'normal',
      flexGrow: 1,
      color: themeColor.foreground,
      margin: 0,
      padding: 0,
    },
    infoValueVehicleEditable: {
      fontSize: 22,
      textTransform: 'uppercase',
      textAlign: 'right',
      fontWeight: 'normal',
      flexGrow: 1,
      backgroundColor: themeColor.foreground,
      color: themeColor.background,
      margin: 0,
      padding: 0,
    },
  });
};

export const getIcon = (name: string, color: string): React.ReactNode => {
  console.log('++ getIcon:', name, color);
  return <MaterialCommunityIcons name={name} size={26} color={color} />;
};
