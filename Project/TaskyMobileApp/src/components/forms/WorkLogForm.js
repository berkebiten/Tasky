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
import * as yup from 'yup';

let elements = {
  duration: yup
    .string()
    .required('Required Field!')
    .matches(
      '\\d[hHmMdD]$',
      'Invalid time duration entered. (eg. 1d 2h 30m)',
    ),
  description: yup.string().required('Required Field!'),
};
let schema = yup.object().shape(elements);

export default class WorkLogForm extends Component {
  constructor(props) {
    super(props);
  }

  createContent() {
    return (
      <Formik
        initialValues={this.props.initialValues ? this.props.initialValues : {}}
        onSubmit={(values) => this.props.onSubmit(values)}
        validationSchema={schema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          submitCount,
        }) => (
          <View style={{flex: 1}}>
            <Label style={styles.label}>Duration</Label>
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('duration')}
              onBlur={handleBlur('duration')}
              value={values.duration}
            />
            {errors.duration && (touched.duration || submitCount > 0) && (
              <Text style={styles.errorTxt}>{errors.duration}</Text>
            )}
            <Label style={styles.label}>Description</Label>
            <TextInput
              style={{...styles.textInput, height: Metrics.HEIGHT * 0.15}}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline={true}
            />
            {errors.description && (touched.description || submitCount > 0) && (
              <Text style={styles.errorTxt}>{errors.description}</Text>
            )}
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

  errorTxt: {
    margin: 5,
    color: 'red',
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
