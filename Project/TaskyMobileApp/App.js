import React, {Component} from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {Root} from 'native-base';
// import moment from 'moment';
import {HeaderView, RootView} from './src/components/views';
import {Button, View} from 'react-native';
import {NavigationHelper, RootViewHelper, ServiceHelper} from './src/util/helpers';

class App extends Component {
  constructor() {
    super();

    // this.genericInitialization();
  }

  componentDidMount() {
    NavigationHelper.setNavigator(this.navigator);
  }

  // genericInitialization = async () => {
  //   const locale = require('moment/min/locales.min');
  //   moment.updateLocale(CONSTANTS.LANGUAGE, locale);
  // };

  render() {
    return (
      <View style={{flex: 1}}>
        <Root>
          <AppNavigation
            ref={nav => {
              this.navigator = nav;
            }}
          />
        </Root>
        <RootView />
      </View>
    );
  }
}

export default App;
