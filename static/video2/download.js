function CDownload(file)
{
    this.m_file = streamSaver.createWriteStream(file).getWriter();
}

CDownload.prototype.writeArray = function(data)
{
    // 8位二进制数据
    this.m_file.write(data);
}

CDownload.prototype.writeBlob = function(data)
{
    // blob
    var reader = new FileReader();
    var tmpThis = this;
    reader.addEventListener("loadend", function () {
        let arrayBuffer = reader.result;
        let t = new Uint8Array(arrayBuffer);
        tmpThis.m_file.write(t);
    });
    reader.readAsArrayBuffer(data);
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

/*
var downloadTextFile = function (name) {
    fileStream = streamSaver.createWriteStream(name);
    writer = fileStream.getWriter();

    //var a = new Uint8Array(10).fill(97);
    var a = "wtf";
    writer.write(stringToUint8Array(a));
    writer.close();
}
*/
