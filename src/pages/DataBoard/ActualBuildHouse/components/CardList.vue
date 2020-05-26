<template>
  <div class="card_wrap">
    <ul v-if="cardType == 1">
      <li v-for="(item, index) in tableData" :key="index">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583834573865&di=e7900d8f067b134049cda941951a792c&imgtype=0&src=http%3A%2F%2Fimg.yoyou.com%2Fuploadfile%2F2019%2F0417%2F20190417021749914.jpg"
          alt
        />
        <div class="info">
          <p>
            张三
            <span>重点关注度</span>
          </p>
          <span>沁园春/1号楼/2楼/204室</span>
          <span>消防人行通道</span>
          <span>2020-3-10 11:57:58</span>
        </div>
      </li>
    </ul>
    <ul v-if="cardType == 2">
      <li v-for="(item, index) in 9" :key="index">
        <img src="@/assets/images/projectImage.png" alt />
        <div class="info">
          <span
            >{{ tableData[index] }}/{{ Math.ceil(Math.random() * 8) }}号楼/{{
              index + 1
            }}楼/{{ index + 1 }}0{{ Math.ceil(Math.random() * 4) }}室</span
          >
          <span>频繁通过100+次</span>
          <span>2020-3-10 11:57:58</span>
          <p>
            <span style="margin-left:0">未解决</span>
          </p>
        </div>
      </li>
    </ul>
    <!-- <div class="empty" v-if="!tableData.length">
      暂无数据
    </div> -->
  </div>
</template>

<script>
export default {
  name: "CardList",
  props: {
    cardType: {
      type: Number,
      default: 1
    },
    dayOrWeek: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      tableData: [
        "同盛公寓",
        "嘉宝小区",
        "嘉宝新苑",
        "德华一村",
        "同盛公寓",
        "嘉宝小区",
        "嘉宝新苑",
        "同盛公寓",
        "嘉宝小区"
      ]
    };
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
  line-height: 1;
}
.card_wrap {
  width: 100%;
  height: 470px;
  overflow: auto;
  ul {
    width: 100%;
    padding: 0;
    li {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 12px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.05);
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 15px;
      img {
        display: block;
        width: 80px;
        height: 80px;
        margin-right: 15px;
      }
      .info {
        text-align: left;
        p {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #cccccc;
          margin-bottom: 5px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #ff4545;
            margin-left: 15px;
            line-height: 1.2;
          }
        }
        & > span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba($color: #dddddd, $alpha: 0.8);
          margin-bottom: 8px;
          display: block;
          line-height: 1.2;
        }
      }
    }
  }
  .empty {
    width: 100%;
    text-align: center;
    line-height: 60px;
    font-size: 14px;
    color: #909399;
  }
}
</style>
