<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :modal="false"
             :close-on-click-modal="false"
             :append-to-body="true"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c">
      <el-button class='addIcon'
                 type="primary"
                 @click="addReson"
                 size='small'>
        <img :src="icons.tianjia"
             alt="">
        添加
      </el-button>
      <div style="width:100%;max-height:300px;overflow:auto;"
           ref="table">
        <el-table :data="data"
                  style="width: 100%">
          <el-table-column prop="date"
                           label="序号"
                           width="80">
            <template slot-scope="scope">
              {{scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           :label="title">
            <template slot-scope="scope">
              <el-input v-model="data[scope.$index]"
                        style="width:180px;"
                        :placeholder="'请填写'+title"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address"
                           width="100"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         class="delete-button"
                         style="color: #FF5F5F;"
                         @click.stop="openDeleteDialog(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float:right;margin:15px 0px;">
        <el-button type="primary"
                   size="small"
                   :loading="loading"
                   @click="confirm"
                   class="saveBtn">
          保存
        </el-button>
        <el-button type="primary"
                   size="small"
                   @click="close"
                   class="saveBtn">
          取消
        </el-button>
      </div>

    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "480px";
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "新建标签";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      icons,
      TreechangeNameDialogVisible: false,
      data: [],
      loading: false
    };
  },
  mounted() {},
  methods: {
    addReson() {
      this.data.push("");
      this.$nextTick(() => {
        this.$refs.table.scrollTop = this.$refs.table.scrollHeight;
      });
    },
    openDeleteDialog(index, reson) {
      // alert(index);
      this.data.splice(index, 1);
      console.log(reson);
    },
    confirm() {
      if (this.loading) {
        return;
      }
      console.log(this.data);
      for (let i = 0, len = this.data.length; i < len; i++) {
        if (!this.data[i]) {
          this.$message.error(`请填写第${i + 1}个的${this.title}！`);
          return;
        }
      }
      this.loading = true;
      let data = this.data.map(val => {
        return { name: val };
      });
      console.log(data);
      if (this.title === "拜访事由") {
        api
          .UpdatevisitorReason(data, this.deviceUuid)
          .then(res => {
            if (res.data.success) {
              this.$emit("update:visible", false);
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      } else if (this.title === "携带物品") {
        api
          .UpdatetokeGoodl(data, this.deviceUuid)
          .then(res => {
            if (res.data.success) {
              this.$emit("update:visible", false);
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(this.tableData);
        this.loading = false;
        this.data = JSON.parse(JSON.stringify(this.tableData));
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
$labelwidth: 5em;
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
  .el-select {
    height: 30px;
    width: calc(100% - #{$labelwidth});
    .el-input {
      height: 30px;
      line-height: 30px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
$labelwidth: 5em;
.c {
  .addIcon {
    float: right;
    margin: 5px 0px;
    @include buttonnoborder;
  }
  padding: 20px 40px;
  box-sizing: border-box;
  overflow: hidden;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;

      .btn {
        height: 30px;
        padding: 7px 21px;
        background: rgba(40, 255, 187, 0.12);
        border: 1px solid rgba(40, 255, 187, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .form-item {
    margin: 0px auto;
    margin-top: 20px;
    &:first-child {
      margin-top: 50px;
    }
  }
}
</style>
