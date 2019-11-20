async function slot_createVideo()
{
    // 1. 创建canvas
    //<canvas id="canvas" width="1280" height="720"></canvas>
    var canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    //var canvas = document.getElementById("playCanvas");

    let url = document.getElementById("url").value;
    let ip = document.getElementById("ip").value;

    var action;
    let b = document.getElementsByName("action")[0].checked;
    if (b)
        action = "preview";
    else
        action = "playback";

    // 2. 调用video_mgr_sdk中接口 创建视频
    //var video = video_mgr.play('{"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "127.0.0.1", "port":"4400"}}}', '{"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "127.0.0.1", "port":"4401"}}}', "rtsp://admin:admin@192.168.9.121:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif", "rtsp", "preview", canvas);
    //var video = video_mgr.play('{"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.35", "port":"4400"}}}', '{"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.35", "port":"4401"}}}', "rtsp://admin:admin@192.168.9.121:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif", "rtsp", "preview", canvas);
    //var video = video_mgr.play('{"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.35", "port":"4400"}}}', '{"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.35", "port":"4401"}}}', "rtsp://admin:a88888888@192.168.9.114:554/Streaming/Channels/102?transportmode=unicast", "rtsp", "preview", canvas);
    //var video = video_mgr.play('{"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.199", "port":"4400"}}}', '{"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.199", "port":"4401"}}}', "rtsp://admin:a88888888@192.168.9.114/Streaming/Channels/102?transportmode=unicast", "rtsp", "preview", canvas);
    //var video = video_mgr.play('{"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.21", "port":"4400"}}}', '{"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "192.168.9.21", "port":"4401"}}}', "rtsp://admin:a88888888@192.168.9.114/Streaming/Channels/102?transportmode=unicast", "rtsp", "preview", canvas);
    let jSignal = {"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "port":"4400"}}};
    jSignal.param.location.ip = ip;
    let jMedia = {"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "port":"4401"}}};
    jMedia.param.location.ip = ip;

    // create video
    var video = await video_mgr.setup(JSON.stringify(jSignal), JSON.stringify(jMedia), url, "rtsp", action, 1, canvas);
    if (video != null)
        await video_mgr.play(video);
    
    document.getElementById("p").innerHTML = video_mgr.m_videoList.length;
    document.getElementById("div").appendChild(canvas);
    var t = {};
    t.canvas = canvas;
    t.video = video;
    t.action = action;
    video_list[video_list.length] = t;
}

async function slot_stopall()
{
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.stop(video);
        document.getElementById("div").removeChild(video_list[i].canvas);
    }
    video_list.splice(0, video_list.length);
    document.getElementById("p").innerHTML = 0;
}

async function slot_pauseall()
{
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.pause(video);
    }
}

async function slot_resumeall()
{
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.resume(video);
    }
}

async function slot_one_times()
{
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.speedControl(video, 1);
    }
}

async function slot_two_times()
{
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.speedControl(video, 2);
    }
}

async function slot_four_times()
{
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.speedControl(video, 4);
    }
}

async function slot_dragall()
{
    let start = document.getElementById("start").value;
    for (let i = 0; i < video_list.length; ++i)
    {
        let video = video_list[i].video;
        await video_mgr.drag(video, start);
    }
}
async function slot_download()
{
    //alert("not implement");
    let url = document.getElementById("url").value;
    let ip = document.getElementById("ip").value;
    let jSignal = {"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "port":"4400"}}};
    jSignal.param.location.ip = ip;
    let jMedia = {"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "port":"4401"}}};
    jMedia.param.location.ip = ip;

    // create video for download
    var video = await video_mgr.setup(JSON.stringify(jSignal), JSON.stringify(jMedia), url, "rtsp", "download", 4);
    if (video != null)
        video_mgr.play(video);
    
    var t = {};
    t.video = video;
    t.action = "download";
    video_list[video_list.length] = t;
}

function slot_record()
{
    if (video_list.length > 0)
    {
        let video = video_list[0].video;
        video_mgr.record(video);
    }
}

function slot_stopRecord()
{
    if (video_list.length > 0)
    {
        let video = video_list[0].video;
        video_mgr.stopRecord(video);
    }
}

function onStreamBreak(video)
{
    // 某一路视频中断
    for (let i = 0; i < video_list.length; ++i)
    {
        let tmp = video_list[i].video;
        if (tmp == video)
        {
            video_mgr.stop(tmp);
            if (video_list[i].action == "preview" || video_list[i].action == "playback")
            {
                document.getElementById("div").removeChild(video_list[i].canvas);
                document.getElementById("p").innerHTML = video_list.length - 1;
            }
            video_list.splice(i, 1);
            break;
        }
    }
}

var video_mgr = new CVideoMgrSdk(onStreamBreak);
var video_list = [];