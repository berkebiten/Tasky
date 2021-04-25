import Cookies from "js-cookie";

export default class SessionHelper {
  static saveUser = (user) => {
    var inFifteenMinutes = new Date(new Date().getTime() + 1 * 60 * 1000);
    Cookies.set("user", JSON.stringify(user), { expires: inFifteenMinutes });
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
