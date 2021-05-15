import React, {Component} from 'react';
import {TouchableOpacity, Modal, View, Text, StyleSheet} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Metrics, Fonts, Colors} from '../../res/styles';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
  }

  createContent() {
    if (this.props.content) {
      return this.props.content;
    }
    return null;
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.isVisible}
        onShow={this.props.onShow ? this.props.onShow : null}>
        <View style={styles.modelMain}>
          <View
            style={
              this.props.fullScreen || this.props.fullScreenMode
                ? styles.modelCenterFullScreen
                : styles.modelCenter
            }>
            {!this.props.noHeader && !this.props.fullScreenMode && (
              <View style={styles.modelTopBar}>
                <Text style={styles.modelTitle}>{this.props.title}</Text>
                <View style={styles.close}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.toggleModal();
                    }}>
                    <EvilIcons name="close" size={30} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View
              style={[
                this.props.fullScreen
                  ? styles.modalContentFullScreen
                  : styles.modalContent,
                this.props.style,
                this.props.noHeader ? {maxHeight: Metrics.HEIGHT} : {},
              ]}>
              {this.createContent()}
            </View>
            {this.props.noHeader && !this.props.fullScreenMode && (
              <View
                style={{
                  alignItems: 'flex-end',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  margin: 15,
                }}>
                <View style={styles.close}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.toggleModal();
                    }}>
                    <EvilIcons name="close" size={30} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modelMain: {
    height: Metrics.FILL,
    width: Metrics.FILL,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000B',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
  },
  modelCenter: {
    borderRadius: 5,
    width: '90%',
    backgroundColor: 'white',
  },
  modelCenterFullScreen: {
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'white',
  },
  close: {
    alignItems: 'flex-end',
  },
  modelTopBar: {
    width: Metrics.FILL,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.silver,
    paddingHorizontal: 10,
  },
  modelTitle: {
    fontSize: Fonts.moderateScale(20),
    flex: 1,
  },
  modalContent: {
    width: Metrics.FILL,
    maxHeight: Metrics.HEIGHT * 0.67,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  modalContentFullScreen: {
    width: Metrics.FILL,
    maxHeight: Metrics.HEIGHT * 0.9,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
