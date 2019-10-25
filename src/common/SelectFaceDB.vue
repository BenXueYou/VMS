<template>
  <el-dialog width="760px"
             title="请选择人脸库"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :append-to-body="true"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <div class="content-left">
        <div class="block-left">
          <el-input class="search-input"
                    v-model="titleText"
                    size="small"
                    clearable
                    @change="onChangeInput"
                    placeholder="搜索人脸库">
            <img slot="prefix"
                 src="@/assets/images/search_s.png">
          </el-input>
          <div class="faceDB-list">
            <template v-for="(item, index) in faceDBList">
              <div :key="index"
                   class="faceDB-item"
                   @click="onClickItem(item)">
                <img src="@/assets/images/person_g.png"
                     width="11px"
                     height="11px">
                <div class="item-faceDB text-show text-style">{{item.faceLibraryName}}</div>
                <!-- <div class="item-name text-show text-style">{{item.staffName}}</div> -->
                <img class="check-img"
                     v-if="item.checked"
                     src="@/assets/images/checked_icon.png">
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="block-right">
          <div class="title-line">
            <div class="spot"></div>
            <div class="title title-text">已选的人脸库</div>
          </div>
          <div class="selected-faceDB">
            <template v-for="(item, index) in selectedList">
              <div :key="index"
                   class="faceDB-select-item">
                <div class="item-faceDB">
                  <img src="@/assets/images/person_g.png"
                       width="11px"
                       height="11px">
                  <span class="title-text text-show"
                        style="margin-left: 4px">{{item.faceLibraryName}}</span>
                </div>
                <div class="del-img"
                     @click="deleteItem(item)"
                     style="cursor: pointer;">
                  <img src="@/assets/images/delete_x.png"
                       width="13px"
                       height="13px">
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确定</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
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
    initSelectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCurrentShow: false,
      titleText: "",
      faceDBList: [],
      selectedList: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    formatData() {
      if (!this.faceDBList) {
        return;
      }
      for (let item of this.faceDBList) {
        this.$set(item, "checked", false);
        this.$set(item, "id", this.$common.genLocalId());
      }
    },
    getFacedbList() {
      this.$faceControlHttp
        .getFacedbList()
        .then(res => {
          let body = res.data;
          this.getFacedbListSuccess(body);
        })
    },
    getFacedbListSuccess(body) {
      this.faceDBList = body.data;
      this.formatData();
      this.setInitSelect();
    },
    setInitSelect() {
      this.initSelectData.forEach(v => {
        this.faceDBList.forEach(v2 => {
          if (v2.faceLibraryUuid === v.faceLibraryUuid) {
            v2.checked = true;
          }
        });
        this.selectedList.push(v);
      });
    },
    onClickItem(item) {
      for (let item2 of this.faceDBList) {
        if (item2.id === item.id) {
          this.$set(item2, "checked", !item2.checked);
          if (item2.checked) {
            this.selectedList.push(item2);
          } else {
            for (let [i, v] of this.selectedList.entries()) {
              if (v.id === item2.id) {
                this.selectedList.splice(i, 1);
              }
            }
          }
        }
      }
    },
    deleteItem(item) {
      for (let [i, v] of this.selectedList.entries()) {
        if (v.id === item.id) {
          this.selectedList.splice(i, 1);
        }
      }
      for (let item2 of this.faceDBList) {
        if (item2.id === item.id) {
          this.$set(item2, "checked", false);
        }
      }
    },
    onClickConfirm() {
      this.$emit("onConfirm", this.selectedList);
      this.resetFormData();
      this.$emit("onCancel");
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    resetFormData() {
      this.faceDBList = [];
      this.selectedList = [];
    },
    onChangeInput() {}
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val) {
        this.getFacedbList();
      }
    }
  }
};
</script>

<style lang="scss">
.block-left {
  .el-input__prefix {
    position: absolute;
    left: 36px;
    top: 7px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 28px;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  padding: 0 4% 4% 4%;
  height: 500px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .content-left {
    width: 50%;
    height: 100%;
    border: {
      width: 0 1px 1px 0;
      style: solid;
      color: rgba($color: #ffffff, $alpha: 0.06);
    }
    padding: 35px 20px;
    box-sizing: border-box;
    .block-left {
      width: 100%;
      height: 100%;
      margin-left: -10px;
      text-align: center;
      .search-input {
        width: 95%;
      }
      .faceDB-list {
        width: 100%;
        height: 90%;
        margin-top: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        .faceDB-item {
          height: 32px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: 0 2.5%;
          cursor: pointer;
          &:hover {
            background: rgba($color: #26d39d, $alpha: 0.15);
          }
          .item-faceDB {
            width: 34%;
            margin-left: 18px;
            text-align: left;
          }
          .item-name {
            width: 20%;
            margin-left: 30px;
            text-align: left;
          }
          .check-img {
            margin-left: auto;
            margin-right: 8px;
          }
        }
      }
    }
    .text-style {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #dddddd;
    }
  }
  .content-right {
    width: 50%;
    height: 100%;
    border: {
      width: 0 0 1px 0;
      style: solid;
      color: rgba($color: #ffffff, $alpha: 0.06);
    }
    padding: 15px 15px;
    box-sizing: border-box;
    .block-right {
      width: 100%;
      height: 100%;
      margin-left: 18px;
      text-align: center;
      .title-line {
        display: flex;
        align-items: center;
        .spot {
          width: 5px;
          height: 5px;
          background: #aaaaaa;
          border-radius: 1px;
        }
        .title {
          margin-left: 6px;
        }
      }
      .selected-faceDB {
        width: 100%;
        height: 95%;
        padding: 8px 0;
        box-sizing: border-box;
        margin-top: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        text-align: center;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        .faceDB-select-item {
          height: 36px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: 0 6px;
          box-sizing: border-box;
          background: rgba($color: #ffffff, $alpha: 0.03);
          border-radius: 3px;
          margin-bottom: 10px;
          margin-right: 10px;
          position: relative;
          .item-faceDB {
            text-align: left;
          }
          .item-name {
            width: 20%;
            margin-left: 30px;
            text-align: left;
          }
          .del-img {
            position: absolute;
            top: -5px;
            right: -5px;
          }
        }
      }
      .title-text {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #dddddd;
      }
    }
  }
}
.dialog-footer {
  padding: 0 4% 4% 0;
  box-sizing: border-box;
}
</style>
