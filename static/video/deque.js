function CDeque() {
  this.m_count = 0;
  this.m_array = {};
  this.m_frontIndex = 0;
  this.n_num = [];
}
function geti64Time(buffer) {
  //   console.log(buffer.toString());
  var i64time = 0,
    data;
  data = buffer[0];
  i64time = i64time + data * 72057594037927940;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[1];
  i64time = i64time + data * 281474976710656;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[2];
  i64time = i64time + data * 1099511627776;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[3];
  i64time = i64time + data * 4294967296;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[4];
  i64time = i64time + data * 16777216;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[5];
  i64time = i64time + data * 65536;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[6];
  i64time = i64time + data * 256;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  data = buffer[7];
  i64time += data;
  // console.log(`buffer=${data}  -- i64tme=${i64time}`);
  return i64time;
}
/* 存储数据 */
CDeque.prototype.add = function(data, size) {
  var uint8 = new Uint8Array(data);
  // console.log(uint8);
  let ts = geti64Time(uint8.subarray(4, 12));
  let type = uint8.subarray(12, 13)[0]; // 0 1,1表示关键帧
  // if (type) {
  //   console.log(type);
  // }

  // let newBuffer = new ArrayBuffer(uint8.length - 13);
  // var uint8two = new Uint8Array(newBuffer);
  // let newArr = uint8.subarray(13, uint8.length).toString();
  // uint8two.set(newArr.split(","));
  // let vdata = uint8two.buffer; // 播放的buffer数据

  let newBuffer = data.slice(13, uint8.length);
  let vdata = newBuffer; // 播放的buffer数据

  // console.log(vdata);
  //   console.log(ts + "  " + type + "  " + "  " + size);
  // console.log(data);
  // console.log(uint8.subarray(14, uint8.length));
  // console.log(vdata);
  // debugger;

  //数据存储 => 时间戳 帧类型 原始数据 13字节之后的数据 数据大小
  // console.log(ts);
  let numData = {
    ts,
    type,
    data,
    vdata,
    size
  };
  this.n_num.push(numData);

  return numData;
};

CDeque.prototype.get = function() {
  // 取出数组中第一个数据，并且删除第一个数据
  let firstData = this.n_num.shift();
  // 如果队列就只有一条数据，就直接返回该数据
  // console.log(123);
  if (this.n_num.length < 2) {
    return firstData;
  }
  // 拿出数据中最后一条数据，跟第一条数据进行对比
  let lastData = this.n_num[this.n_num.length - 1];
  if (
    lastData.ts - firstData.ts >= 500 &&
    lastData.ts - firstData.ts <= 1000 &&
    !firstData.type
  ) {
    // console.log("丢帧了,数据如下");
    // console.log(firstData);
    while (1) {
      firstData = this.n_num.shift();
      if (lastData.ts - firstData.ts < 200 || this.n_num.length < 2) {
        break;
      }
    }
  } else if (lastData.ts - firstData.ts > 1000) {
    this.n_num = [];
  }
  // console.log(
  //   `队列长度：${this.n_num.length} -- ,队列首尾两帧间隔时间：${lastData.ts -
  //     firstData.ts}`
  // );
  // console.log(firstData.ts);
  // console.log(lastData.type + " -- " + firstData.type);
  // console.log(lastData.ts - firstData.ts);
  return firstData;
};
/* 尾插 */
CDeque.prototype.push_back = function(e) {
  this.m_array[this.m_count] = e;
  this.m_count++;
};

/* 头插 */
CDeque.prototype.push_front = function(e) {
  if (this.empty()) {
    //空队列
    this.push_back(e);
  } else if (this.m_frontIndex > 0) {
    //之前被删除，重新添加
    this.m_frontIndex--;
    this.m_array[this.m_frontIndex] = e;
  } // 正常头插 所有数据后移一位
  else {
    for (let i = this.m_count; i > 0; i--) {
      this.m_array[i] = this.m_array[i - 1];
    }
    this.m_count++;
    this.m_array[0] = e;
  }
};

/* 弹出队尾元素 */
CDeque.prototype.pop_back = function() {
  if (this.empty()) {
    return undefined;
  }
  this.m_count--;
  const e = this.m_array[this.m_count];
  delete this.m_array[this.m_count];
  return e;
};

/* 弹出队首元素 */
CDeque.prototype.pop_front = function() {
  if (this.empty()) {
    return undefined;
  }
  const e = this.m_array[this.m_frontIndex];
  delete this.m_array[this.m_frontIndex];
  this.m_frontIndex++;
  return e;
};

/* 查看队尾元素 */
CDeque.prototype.back = function() {
  if (this.empty()) {
    return undefined;
  }
  return this.m_array[this.m_count - 1];
};

/* 查看队首元素 */
CDeque.prototype.front = function() {
  if (this.empty()) {
    return undefined;
  }
  return this.m_array[this.m_frontIndex];
};

/* size */
CDeque.prototype.size = function() {
  return this.m_count - this.m_frontIndex;
};

/* 队列是否为空 */
CDeque.prototype.empty = function() {
  return this.size() === 0;
};

/* 清空队列 */
CDeque.prototype.clear = function() {
  this.m_count = 0;
  this.m_array = {};
  this.m_frontIndex = 0;
};
