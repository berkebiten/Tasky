import AsyncStorage from '@react-native-community/async-storage';

export const saveLoginObject = async (loginObject) => {
  try {
    await AsyncStorage.setItem('LOGIN_OBJECT', loginObject);
  } catch (error) {
    console.log(error);
  }
};

export const loadLoginObject = async () => {
  try {
    const loginObject = await AsyncStorage.getItem('LOGIN_OBJECT');
    return loginObject;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem('USER', user);
  } catch (error) {
    console.log(error);
  }
};

export const loadUser = async () => {
  try {
    const user = await AsyncStorage.getItem('USER');
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
