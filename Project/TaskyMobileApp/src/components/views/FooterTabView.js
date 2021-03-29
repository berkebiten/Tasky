import React, {Component} from 'react';
import {Footer, FooterTab, Button, Icon, Text} from 'native-base';
export default class FooterTabView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Footer style={this.props.style}>
        {this.props.tabs && this.props.tabs.length > 0
          ? this.props.tabs.map((item, key) => {
              return (
                <FooterTab>
                  <Button
                    active={this.props.activeTab === item.title}
                    vertical
                    onPress={() => item.onPress()}>
                    <Icon active={true} name={item.iconName} />
                    <Text>{item.title}</Text>
                  </Button>
                </FooterTab>
              );
            })
          : null}
      </Footer>
    );
  }
}
