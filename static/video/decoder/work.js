onmessage=function(e){
  var data=e.data;
  postMessage(data);//将主线程发过来的数据发回到主线程
}