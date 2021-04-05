import React, {Component} from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import {Root} from 'native-base';
import {RootView} from './src/components/views';
import {View} from 'react-native';
import {NavigationHelper} from './src/util/helpers';

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    NavigationHelper.setNavigator(this.navigator);
  }

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
