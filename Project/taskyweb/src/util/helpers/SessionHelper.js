import Cookies from "js-cookie";

export default class SessionHelper {
  static saveUser = (user) => {
    Cookies.set("user", JSON.stringify(user), { expires: 1/24 });
  };
  static loadUser = () => {
    let user = Cookies.get("user");
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  };

  static removeUser = () => {
    Cookies.remove("user");
  };

  static checkIsSessionLive = () => {
    if (SessionHelper.loadUser()) {
      return true;
    } else {
      return false;
    }
  };
}
