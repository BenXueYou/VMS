var cache = new CDeque();
var player = new Player(1920, 1080);
var isStop = false;
setInterval(function(){
    // 缓存检查逻辑
    if (cache.size() > 1000 && !isStop)
    {
        // 缓存容量达到上限 并且 后端未停止送流
        // fix: 通知暂停
    }
    else if (cache.size() < 200 && isStop)
    {
        // 缓存容量降到下限 并且 后端已停止送流
        // fix: 通知恢复
    }

    // 缓存中有数据
    if (!cache.empty())
    {
        let ret = 0;
        var reader = new FileReader();
        var data = cache.pop_front();
        reader.addEventListener("loadend", function(){
            player.h264AVFrmaeData(reader.result, data.size);
        });
        reader.readAsArrayBuffer(data);
        if (ret != 0)
        {
            // 写入解码失败 头插入缓存
            cache.push_front(data);
        }
    }
}, 0);

onmessage = function(data)
{
    if (cache !== undefined && cache.empty())
    {
        // 缓存中无数据 写入解码
        let ret = 0;
        var reader = new FileReader();
        reader.addEventListener("loadend", function(){
            player.h264AVFrmaeData(reader.result, data.size);
        });
        reader.readAsArrayBuffer(data);
        if (ret != 0)
        {
            // 写入解码失败 尾插入缓存
            cache.push_back(data);
        }
    }
    else
    {
        // 缓存中有数据 尾插入缓存
        cache.push_back(data);
    }
}

function setCanvas(canvas)
{
    player.setCanvas(canvas);
}
