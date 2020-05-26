import Vue from 'vue';
const StrategyObj = {
  checkedPhoneNumber: function (val) {
    const reg = /^1[3456789]\d{9}$/;
    return Boolean(val && reg.test(val)) || false;
  },
  checkedRoom: function (val) {
    return Boolean(val) || false;
  },
  checkedStaffName: (val) => {
    return Boolean(val) || false;
  },
  checkedStaffType: (val) => {
    return Boolean(val) || false;
  },
  checkedIdCardNum: (val) => {
    let common = Vue.prototype.$common;
    return val && common.isCredentialNo(val);
  },
  checkedStartTime: (val) => {
    return val || false;
  },
  checkedEndTime: (val) => {
    return val || false;
  },
};
