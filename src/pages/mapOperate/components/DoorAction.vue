<template>
  <el-dialog width="400px"
             title="门禁点"
             center
             top="25vh"
             :modal="false"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="true">
    <div class="dialog-content">
      <!--内容-->
      <div class="content-item">
        <span class="item-label">名称：</span>
        <span style="margin-left: 5px">{{itemData ? itemData.elementName : ""}}</span>
      </div>
      <div class="content-item">
        <span class="item-label">类型：</span>
        <span style="margin-left: 5px">{{itemData ? $common.getEnumItemName("chn", itemData.elementThirdType) : ""}}</span>
      </div>
      <div class="content-button">
        <el-button type="primary"
                  size="small"
                  @click="onClickHandleDoorStatus('close')"
                  v-if="isShowClose === 1">
          关门
        </el-button>
        <el-button type="primary"
                  size="small"
                  @click="onClickHandleDoorStatus('open')"
                  v-else>
          开门
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: () => null
    },
    moduleName: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      isCurrentShow: false,
      isShowClose: 0
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickHandleDoorStatus(action) {
      this.$emit("handleDoorStatus", {
        action: action,
        channelUuid: this.itemData.resourceUuid,
        name: this.itemData.elementName
      });
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    },
    itemData: {
      immediate: true,
      handler(val) {
        this.isShowClose = val && val.channelInfo.openDoorStatus === "open" ? 1 : 0;
      },
      deep: true,
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 2% 0 2% 25%;
  box-sizing: border-box;
  width: 100%;
  .content-item {
    display: flex;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #dddddd;
    margin-bottom: 25px;
    .item-label {
      text-align: right;
    }
  }
  .content-button {
   margin-left: 60px;
  }
}
</style>
