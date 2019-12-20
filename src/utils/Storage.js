/**
 * 保存到本地的管理项
 */

export var Storage = {
  /**
   * 保存文件
   */
  save(key, value) {
    /* if (!value) {
      return;
    } */
    try {
      if (typeof value != "string") {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } else {
        window.sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * 保存到session当中
   */
  saveSession(key, value) {
    /* if (!value) {
      return;
    } */
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * 读取数据
   * @key 读取key
   */
  read(key) {
    let data = null;
    let jsonStr = window.sessionStorage.getItem(key);
    try {
      data = JSON.parse(jsonStr);
    } catch (error) {
      console.log(error);
    }
    return data;
  },
  /**
   * 从session当中读取数据
   */
  readSession(key) {
    let data = null;
    let jsonStr = window.sessionStorage.getItem(key);
    try {
      if (jsonStr !== "") {
        if (key !== "account" && key !== "userUuid") {
          data = JSON.parse(jsonStr);
        } else {
          data = jsonStr;
        }
      }
    } catch (error) {
      console.log(key);
      console.log(error);
    }
    return data;
  }
};
function install(Vue) {
  Vue.prototype.$storage = Storage;
}

export default install;
