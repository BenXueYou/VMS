<template>
  <div class="left-list">
    <el-scrollbar style="height: 95%;width: 100%;">
      <div class="left-list-main">
        <template v-for="(item, index) in listData">
          <div :key="index"
               class="list-item"
               :id="`${idFlag}_${index}`"
               @click="onClickItem(index)">
            <img :src="item.icon">
            <div style="margin-left: 10px;"> {{item.text}} </div>
            <el-dropdown trigger="click"
                         class="action-icon"
                         placement="bottom">
              <img :src="icons.more_action"
                   width="16px"
                   height="14px"
                   @click.stop="onClickMore(item)">
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>修改</el-dropdown-item>
                <el-dropdown-item>上移</el-dropdown-item>
                <el-dropdown-item>下移</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import icons from "@/common/icon.js";

export default {
  components: {},
  props: {
    idFlag: {
      type: String,
      default: ""
    },
    listData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      icons
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickItem(index) {
      if (!this.listData || this.listData.length === 0) {
        return;
      }
      this.listData.forEach((value, index2) => {
        let itemDom = document.getElementById(`${this.idFlag}_${index2}`);
        if (itemDom.classList.contains("list-item-select")) {
          itemDom.classList.remove("list-item-select");
        }
      });
      let itemDomSelect = document.getElementById(`${this.idFlag}_${index}`);
      itemDomSelect.classList.add("list-item-select");
    },
    onClickMore(item) {}
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.left-list {
  width: 100%;
  height: 100%;
  .left-list-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    .list-item {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #bbbbbb;
      cursor: pointer;
      padding: 0 10px;
      .action-icon {
        margin-left: auto;
        margin-right: 20px;
        cursor: pointer;
        display: none;
      }
      &:hover {
        background: rgba($color: #28ffbb, $alpha: 0.05);
        .action-icon {
          display: block;
        }
      }
    }
  }
}
.list-item-select {
  background: rgba($color: #28ffbb, $alpha: 0.05);
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #ffffff !important;
}
</style>
