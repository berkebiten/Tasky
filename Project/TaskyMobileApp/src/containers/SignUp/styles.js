import { Platform, StyleSheet } from "react-native";
import { Fonts, Metrics, Colors } from "../../res/styles";

const styles = StyleSheet.create({
  screenBg: {
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT
  },

  header: {
    backgroundColor: "transparent",
    height: 56,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {},
      android: {
        paddingTop: 10
      }
    }),
    elevation: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  left: {
    flex: 0.5,
    backgroundColor: "transparent"
  },
  backArrow: {
    width: 50,
    alignItems: "center"
  },
  body: {
    flex: 2,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  right: {
    flex: 0.5
  },
  logostyle: {
    alignSelf: "center",
    width: Metrics.WIDTH * 0.6,
    height: Metrics.WIDTH * 0.5,
    resizeMode: "contain",
  },
  container: {
    alignItems: "center"
  },

  buttondialogsignup: {
    backgroundColor: Colors.loginGreen,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 40,
    width: Metrics.WIDTH * 0.8,
    height: Metrics.HEIGHT * 0.07,
    justifyContent: "center",
  },

  formContainer: {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "white",
    width: Metrics.WIDTH * 0.8,
  },

  itememail: {
    alignSelf: "center",
    height: Metrics.HEIGHT * 0.08,
    justifyContent: "center"
  },

  input: {
    marginLeft: -5,
    fontFamily: Fonts.type.SFUIDisplayRegular,
  },

  buttonSignUp: {
    alignSelf: "center",
    fontSize: 15,
    fontFamily: Fonts.type.SFUIDisplaySemibold,
    color: "white"
  },
  buttontext: {
    fontFamily: Fonts.type.SFUIDisplayRegular,
    color: "white",
    fontSize: 17,
    backgroundColor: "transparent"
  },

  bottomTxtBg: {
    flexDirection: "row",
    width: Metrics.WIDTH,
    justifyContent: "center",
    marginTop: 20
  },

  signUpTxt: {
    paddingLeft: Metrics.WIDTH * 0.01
  }
});
export default styles;
