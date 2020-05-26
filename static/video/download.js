function CDownload(file)
{
    console.log(file);
    let fs = streamSaver.createWriteStream(file);
    this.m_file = fs.getWriter();
}

CDownload.prototype.writeArray = function(data)
{
    // 8位二进制数据
    this.m_file.write(new Uint8Array(data));
    // tmpThis.m_file.write(data);
}

CDownload.prototype.writeBlob = function(data)
{
    // blob
    this.m_file.write(data);
}

CDownload.prototype.writeString = function(data)
{
    // 字符串
    this.m_file.write(string2int8Array(data));
}

CDownload.prototype.close = function()
{
    this.m_file.close();
}

function string2int8Array(str)
{
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i)
    {
        arr.push(str.charCodeAt(i));
    }

    return new Uint8Array(arr);
}

var downloadTextFile = function (name) {
    fileStream = streamSaver.createWriteStream(name);
    writer = fileStream.getWriter();

    var a = new Uint8Array(10).fill(97);
    // var a = "wtf";
    // writer.write(string2int8Array(a));
    writer.write(a);
    writer.close();
}
