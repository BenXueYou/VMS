import ShowBigImage from './src/main.js';

ShowBigImage.install = function (Vue) {
  Vue.directive('show-bigimage', ShowBigImage);
};

export default ShowBigImage;
