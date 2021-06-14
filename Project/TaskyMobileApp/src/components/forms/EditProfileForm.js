import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import {Fonts, Metrics, Colors} from '../../res/styles';
import {ActionSheet, Label} from 'native-base';
import * as yup from 'yup';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

let elements = {
  firstName: yup.string().required('Required Field!'),
  lastName: yup.string().required('Required Field!'),
  image: yup.string(),
};

let schema = yup.object().shape(elements);

export default class EditProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.initialValues
        ? this.props.initialValues.profileImage
        : '',
    };
  }

  createImagePicker = () => {
    const onImageSelected = (images) => {
      if (images && images[0]) {
        this.setState({
          images: 'data:image/png;base64,' + images[0].data,
        });
      }
    };

    const openCamera = () => {
      ImagePicker.openCamera({
        includeBase64: true,
        cropping: true,
      }).then((image) => {
        onImageSelected([image]);
      });
    };

    const openPicker = () => {
      ImagePicker.openPicker({
        multiple: false,
        includeBase64: true,
        maxFiles: 1,
      }).then((images) => {
        onImageSelected([images]);
      });
    };

    const onAddButton = () => {
      const BUTTONS = ['Camera', 'Gallery', 'Cancel'];
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: 2,
          title: 'Select',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            openCamera();
          } else if (buttonIndex === 1) {
            openPicker();
          }
        },
      );
    };

    return (
      <View style={styles.imagePickerContainer}>
        {this.state.images ? (
          <View>
            <Image
              source={{uri: this.state.images}}
              style={styles.imagePickerImage}
            />
            <MaterialCommunityIcons
              name="close"
              size={18}
              style={styles.imagePickerImageRemove}
              color={Colors.lightGray}
              onPress={() => {
                this.setState({images: null});
              }}
            />
          </View>
        ) : (
          <Text style={styles.imagePickerPlaceholder}>
            Select Profile Image
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            onAddButton();
          }}>
          <View style={styles.imagePickerImageAdd}>
            <MaterialCommunityIcons name="plus" size={40} color={Colors.snow} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  createContent() {
    return (
      <Formik
        initialValues={this.props.initialValues ? this.props.initialValues : {}}
        onSubmit={(values) =>
          this.props.onSubmit({
            ...values,
            profileImage: this.state.images,
          })
        }
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
            <Label style={styles.label}>First Name</Label>
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
            />
            {errors.firstName && (touched.firstName || submitCount > 0) && (
              <Text style={styles.errorTxt}>{errors.firstName}</Text>
            )}
            <Label style={styles.label}>Last Name</Label>
            <TextInput
              style={styles.textInput}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
            />
            {errors.lastName && (touched.lastName || submitCount > 0) && (
              <Text style={styles.errorTxt}>{errors.lastName}</Text>
            )}
            <Label style={styles.label}>Profile Image</Label>
            {this.createImagePicker()}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonTxt}>Save</Text>
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
  imagePickerContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    height: Metrics.HEIGHT * 0.05,
    justifyContent: 'space-between',
  },
  imagePickerPlaceholder: {
    color: Colors.lightGray,
    alignSelf: 'center',
    marginLeft: Metrics.HEIGHT * 0.01,
    fontSize: Fonts.moderateScale(15),
  },
  imagePickerImage: {
    height: Metrics.HEIGHT * 0.05,
    width: Metrics.HEIGHT * 0.05,
  },
  imagePickerImageRemove: {
    position: 'absolute',
    end: 0,
    top: 0,
    backgroundColor: Colors.ricePaper,
  },
  imagePickerImageAdd: {
    backgroundColor: Colors.loginBlue,
    height: Metrics.HEIGHT * 0.05,
    width: 40,
    alignSelf: 'flex-end',
  },
});
