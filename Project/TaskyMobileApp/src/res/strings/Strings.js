import I18n from 'react-native-i18n';
import en from './locales/en';
import tr from './locales/tr';

I18n.fallbacks = true;
I18n.defaultLocale = 'en';
I18n.translations = {
  tr,
  en,
};

class Strings {
  static t = (string, obj) => {
    return I18n.t(string, obj);
  };
}
export default Strings;
