import React, {Component} from 'react';
import codePush from 'react-native-code-push';
import HomeView from './components/HomeView';

class App extends Component {
  render() {
    return <HomeView />;
  }
}

export default codePush(App);
