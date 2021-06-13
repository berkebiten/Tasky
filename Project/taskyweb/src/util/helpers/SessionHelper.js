import Cookies from "js-cookie";

export default class SessionHelper {
  static saveUser = (user) => {
    let _user = { ...user, profileImage: null };
    if (user.profileImage) {
      localStorage.setItem("profileImage", user.profileImage);
    } else {
      // if(localStorage.getItem("profileImage")){
      localStorage.removeItem("profileImage");
      // }
    }
    Cookies.set("user", JSON.stringify(_user), { expires: 1 / 24 });
  };
  static loadUser = () => {
    let user = Cookies.get("user");
    let profileImage = localStorage.getItem("profileImage")
    if (user) {
      user = JSON.parse(user);
      if (profileImage) {
        user.profileImage = profileImage
      }
      return user;
    } else {
      return null;
    }
  };

  static removeUser = () => {
    Cookies.remove("user");
    localStorage.removeItem("profileImage");
  };

  static checkIsSessionLive = () => {
    if (SessionHelper.loadUser()) {
      return true;
    } else {
      return false;
    }
  };
}
