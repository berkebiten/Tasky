export default class FileHelper {
  static files = [];

  static getFiles = () => {
    return this.files;
  };

  static clearFiles = () => {
    this.files = [];
  };

  static getBase64 = (data, callback) => {
    let url = URL.createObjectURL(data);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var res = event.target.result;
        FileHelper.files.push({ name: data.name, data: res });
      };
      var file = this.response;
      reader.readAsDataURL(file);
    };
    xhr.send();
  };
}
