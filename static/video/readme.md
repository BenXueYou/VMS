# webplay控件使用手册(初稿)

## 1. 接口说明

此说明可快速了解webplay控件。

**播放视频**

```
video CVideoMgrSdk.play(jSignal, jMedia, url, protocol, action, canvas);
参数:
jSignal: 信令通道智能组件rule
jMedia: 媒体通道智能组件rule
url: 多媒体播放url
protocol: 多媒体播放协议 例:rtsp
action: 多媒体播放方式 例:preview playback
canvas: html画布

返回值:
video: 视频对象
```

**停止视频**

```
CVideoMgrSdk.stop(video);
参数:
video: 要停止的视频对象

CVideoMgrSdk.stopByCanvas(canvas);
参数:
canvas: 要停止的视频所在的画布
```

**暂停视频**

```
CVideoMgrSdk.pause(video);
参数:
video: 要暂停的视频对象
```

**恢复视频**

```
CVideoMgrSdk.resume(video);
参数：
video: 要恢复的视频对象
```

**倍速控制**

```
CVideoMgrSdk.speedControl(video, speed);
参数:
video: 要更改倍速的视频对象
speed: 倍速
```

**视频拖动**

```
CVideoMgrSdk.drag(video, position);
参数: 
video: 要拖动的视频对象
position: 要拖动到的时间点; 格式: YYYYMMDDHHMMSS/YYYYMMDDTHHMMSSZ
```

**本地录像**

```
CVideoMgrSdk.record(video);
参数: 
video: 要本地录像的视频对象
```

**停止本地录像**

```
CVideoMgrSdk.stopRecord(video);
参数:
video: 要停止本地录像的视频对象
```

**通过画布查找视频**

```
video CVideoMgrSdk.findVideo(canvas);
参数:
canvas: 要查找的视频所在的画布

返回值:
video: 找到的视频 为找到返回undefined
```

**视频中断回调**

```
CVideoMgrSdk.onStreamBreak(video);
参数:
video: 流中断的视频对象
```

## 2. 文件及模块简介

index.html： 示例html

app.js： 示例应用层，负责调度webplay

video_mgr_sdk.js： webplay接口js

video.js： webplay视频模块js，每一路视频即为一个video对象

session.js： webplay会话模块js，用以创建信令会话和媒体会话

decoder.js： webplay解码调度模块js，用以现阶段解码并渲染

## 3. 使用示例

详细请看app.js

## 4. 注意

1. 目前仅实现play、stop接口

2. 目前使用的解码和渲染方式还是demo版的

3. 本地录像、回放等接口敬请期待

------

4. 新增了pause、resume、speedControl、drag、record、stopRecord等功能