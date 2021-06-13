export default class TextHelper {
  static getSmallText = (text, maxLength) => {
    if (typeof text === "string") {
      console.log(text.length);
      console.log(maxLength);
      let follower = text.length > maxLength ? "..." : "";
      let smallText = text.substring(0, maxLength) + follower;
      return smallText;
    }
  };
}
