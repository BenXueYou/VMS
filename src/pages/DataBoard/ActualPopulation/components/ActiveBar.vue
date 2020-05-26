<template>
  <div class="bar_wrap">
    <ul class="infinite-list" v-infinite-scroll="handleGetMore">
      <li
        v-for="(item, index) in barData.slice(0, 10 * current)"
        :key="index"
        class="infinite-list-item"
      >
        <el-tooltip :content="item.residentName" placement="top" effect="dark">
          <div class="label" style="width:50px">
            {{ item.residentName }}
          </div>
        </el-tooltip>
        <div class="bar">
          <div
            class="inner_bar"
            :style="'width:' + 290 * (item.appearCount / handleMaxData) + 'px'"
          ></div>
          <div class="inner_text">
            <el-tooltip :content="item.address" placement="top" effect="dark">
              <span class="address">{{ item.address }}</span>
            </el-tooltip>
            <p>
              <template v-for="(iItem, iIndex) in item.residentType">
                <el-tooltip
                  :content="$common.getEnumItemName('feature', iItem)"
                  placement="top"
                  effect="dark"
                  :key="iIndex"
                  v-if="iItem != 'ordinary'"
                >
                  <span style="margin-right:5px" v-if="iItem != 'ordinary'">{{
                    $common.getEnumItemName("feature", iItem)
                  }}</span>
                </el-tooltip>
              </template>
            </p>
          </div>
        </div>
        <div class="tag">{{ item.appearCount }}次</div>
      </li>
    </ul>
    <div class="empty" v-if="!barData.length">暂无数据</div>
  </div>
</template>

<script>
export default {
  name: "CardList",
  props: {
    barData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isChange: {
      type: Number,
      default: 0
    }
  },
  computed: {
    handleMaxData() {
      let newArr = this.barData;
      if (newArr.length) {
        return (
          // 取最大值计算宽度
          Math.max.apply(
            Math,
            newArr.map(function(o) {
              return o.appearCount;
            })
          ) + 5
        );
      }
    }
  },
  data() {
    return {
      current: 1
    };
  },
  mounted() {
    console.log(this.barData);
  },
  methods: {
    handleGetMore() {
      if (this.current > 9) {
        return false;
      } else {
        this.current += 1;
      }
    }
  },
  watch: {
    isChange: {
      handler() {
        this.current = 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bar_wrap {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
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
        width: 40px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #dddddd;
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tag {
        white-space: nowrap;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        flex: 1;
        width: 0;
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
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-start;
          .address {
            margin-right: 8px;
            display: block;
            width: 125px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p {
            flex: 1;
            width: 0;
            padding-right: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: normal;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #dddddd;
          }
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
