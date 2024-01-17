import {StyleSheet} from 'react-native';

export const TabTheme = {
  dark: true,
  colors: {
    primary: '#222',
    background: '#222',
    card: '#222',
    text: '#fa0',
    border: '#444',
    notification: '#fa0',
  },
};

export default StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    verticalAlign: 'middle',
  },
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#222',
    color: '#fa0',
  },
  sensorItem: {
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#222',
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  sensorTitle: {
    fontSize: 30,
    fontWeight: '200',
    minWidth: 100,
    color: '#fa0',
  },
  sensorValue: {
    fontSize: 36,
    textAlign: 'right',
    fontWeight: 'normal',
    flexGrow: 1,
    color: '#fa0',
  },
  sensorUnit: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'right',
    minWidth: 50,
    color: '#fa0',
  },
});
