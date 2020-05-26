<template>
  <div class="bar_wrap">
    <ul>
      <li v-for="(item, index) in 10"
          :key="index">
        <div class="label">王二二</div>
        <div class="bar">
          <div class="inner_bar"
               :style="'width:'+290*((155-index*Math.random()*10)/(dayOrWeek==1?200:400))+'px'"></div>
          <div class="inner_text">沁园春/1号楼/3层/301室 上访人员</div>
        </div>
        <div class="tag">155次</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CardList",
  props: {
    sortType: {
      type: Number,
      default: 1
    },
    dayOrWeek: {
      type: Number,
      default: 1
    },
    ShowAuthDisabled: {
      type: Boolean,
      default: true
    },
    OwnAuthDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.bar_wrap {
  width: 100%;
  ul {
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    li {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
      .label {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #dddddd;
        margin-right: 10px;
      }
      .tag {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        margin-left: 10px;
      }
      .bar {
        width: 290px;
        height: 26px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(221, 221, 221, 0.08);
        border-radius: 3px;
        position: relative;
        .inner_bar {
          width: 0;
          height: 100%;
          transition: width 0.3s ease-in-out;
          background: rgba($color: #1ee3dd, $alpha: 0.25);
          border-radius: 3px;
        }
        .inner_text {
          width: 100%;
          height: 26px;
          line-height: 26px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #dddddd;
          text-indent: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
