/**
 * 用于与客户端交互的js方法
 */

//获取token值 

// exports.getTokenFromQt = ()=>{
//   return QtSubmit.getLoginToken();
// }

// exports.gotoFromQt = ()=>{
//   return QtSubmit.getLoginToken();
// }



// 发起自选股列表请求
exports.GetOptionalStockcode = () => {
  QtSubmit.JSIGetOptionalStockcode() // eslint-disable-line
}

// 获取自选股列表
exports.PostOptionalStkToHtml = (callback) => {
  return QtSubmit.JSIPostOptionalStkToHtml.connect(function (str) {// eslint-disable-line
    callback(str)
    output("Received JSIPostOptionalStkToHtml from Qt: " + str)// eslint-disable-line
  }) // eslint-disable-line
}

// 股票右侧栏跳转
exports.JumpStockKline = (code) => {
  QtSubmit.JSIJumpStockKline(code) // eslint-disable-line
}
// 股票个股跳转
exports.JumpStockKlineNotOpt = (code) => {
  QtSubmit.JSIJumpStockKlineNotOpt(code) // eslint-disable-line
}

// 右侧栏显示和隐藏
exports.SetRightPanelVisible = (bool) => {
  QtSubmit.JSISetRightPanelVisible(bool) // eslint-disable-line
}

// 发起搜索
exports.GetSearchKeyFromHtml = (str) => {
  QtSubmit.JSIGetSearchKeyFromHtml(str) // eslint-disable-line
}

// 获取搜索返回数据
exports.PostMultiStockcodeToHtml = () => {
  return QtSubmit.JSIPostMultiStockcodeToHtml.connect(function (str) {// eslint-disable-line
      output("Received JSIPostMultiStockcodeToHtml from Qt: " + str) // eslint-disable-line
  }) // eslint-disable-line
}

// 是否禁用键盘
exports.BlockKeyboardSearch = (bool) => {
  QtSubmit.JSIBlockKeyboardSearch(bool) // eslint-disable-line
}

// 界面调整大小通知h5
exports.QuoteResized = () => {
  return QtSubmit.JSIQuoteResized.connect(function (str) { // eslint-disable-line
    output("Received JSIQuoteResized from Qt: " + str) // eslint-disable-line
  }) // eslint-disable-line
}
// 发送资金账号到h5
exports.SendCapitalaccountToH5 = () => {
  return QtSubmit.JSISendCapitalaccountToH5.connect(function (str) { // eslint-disable-line
    output("Received Capitalaccount from Qt: " + str) // eslint-disable-line
  }) // eslint-disable-line
}
