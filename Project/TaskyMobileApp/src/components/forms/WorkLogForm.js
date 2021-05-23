import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Formik} from 'formik';
import {Fonts, Metrics, Colors} from '../../res/styles';
import {Label} from 'native-base';

export default class WorkLogForm extends Component {
  constructor(props) {
    super(props);
  }

  createContent() {
    return (
      <Formik
        initialValues={{email: ''}}
        onSubmit={(values) => this.props.onSubmit(values)}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View style={{flex: 1}}>
            <Label style={styles.label}>Duration</Label>
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('duration')}
              onBlur={handleBlur('duration')}
              value={values.duration}
            />
            <Label style={styles.label}>Description</Label>
            <TextInput
              style={{...styles.textInput, height: Metrics.HEIGHT * 0.15}}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonTxt}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    );
  }

  render() {
    return <View style={styles.container}>{this.createContent()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    height: Metrics.FILL,
  },

  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    padding: 10,
    alignSelf: 'center',
    width: Metrics.WIDTH * 0.84,
    fontSize: Fonts.moderateScale(16),
    height: Metrics.HEIGHT * 0.05,
    color: Colors.darktext,
  },

  label: {
    fontSize: Fonts.moderateScale(15),
    marginTop: Metrics.HEIGHT * 0.01,
    color: '#7c7b80',
  },

  button: {
    backgroundColor: '#3ace3a',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: Metrics.HEIGHT * 0.03,
    padding: 10,
    alignSelf: 'center',
    width: Metrics.WIDTH * 0.8,
    color: Colors.darktext,
  },

  buttonTxt: {
    fontSize: Fonts.moderateScale(20),
    textAlign: 'center',
    color: Colors.snow,
  },
});
