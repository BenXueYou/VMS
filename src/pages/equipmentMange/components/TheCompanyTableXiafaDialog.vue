<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :modal="false"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='body'>
      <div class="title">
        <!-- <el-button type="primary"
                   class='researchbutton'
                   size="small"
                   @click="research"
                   icon="el-icon-search">重新搜索</el-button>  -->
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;height:300px;"
                max-height="300">
        <el-table-column width="80">
          <template slot-scope="scope">
            {{"0"+(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column prop="deviceName"
                         width='120'
                         label="设备名称">
        </el-table-column>

        <el-table-column prop="ipAddress"
                         label="IP地址">
        </el-table-column>
        <el-table-column prop="progress"
                         label="进度">
          <template slot-scope="scope">
            <el-progress v-if="scope.row.status!=-1 && (!scope.row.failedCount||scope.row.failedCount==0)"
                         :percentage="scope.row.progress"
                         color="#26D39D"></el-progress>

            <div v-else
                 class="rexiafa"
                 @click="rexiafa(scope.row)">
              重新下发
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="succeesTextColor"
                 v-if="scope.row.status==0">
              准备下发
            </div>
            <div class="succeesTextColor"
                 v-else-if="scope.row.status==100">
              下发成功
            </div>
            <div class="deleteText"
                 v-else-if="scope.row.status==-1">
              下发失败
            </div>
            <div class="succeesTextColor"
                 v-else>
              下发中
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot='footer'
         class='footer'>
      <el-button @click='cancel'
                 type="primary">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import * as api from "../ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "下发数据";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      icons,
      tableData: [],
      compareData: [],
      TreechangeNameDialogVisible: false,
      timer: null
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    // let arr = [];
    // for (let i = 0; i < 5; i++) {
    //   arr.push({
    //     ip: "192.128.1.1",
    //     devId: "123456789",
    //     devName: "VB510F",
    //     mac: "MAC地址",
    //     progress: ~~(Math.random() * 100),
    //     status: ~~(Math.random() * 3 + 1)
    //   });
    // }
    // this.tableData = arr;
  },
  methods: {
    getCompare() {
      api.getconfigissue().then(res => {
        console.log(res);
        if (res.data.success) {
          this.compareData = res.data.data || [];
          this.deal();
          this.loop();
        }
      });
    },
    deal() {
      let flag = false;
      for (let i = 0; i < this.tableData.length; i++) {
        flag = false;
        for (let j = 0; j < this.compareData.length; j++) {
          if (this.tableData[i].deviceUuid === this.compareData[j].deviceUuid) {
            flag = true;
            this.tableData[i].status = this.compareData[j].status;
            this.tableData[i].progress = parseInt(this.compareData[j].progress);
            break;
          }
        }
        if (!flag) {
          this.tableData[i].status = 100;
          this.tableData[i].progress = 100;
        }
      }
      this.tableData.concat();
    },
    getxiafalist() {
      api.getconfigissue().then(res => {
        // console.log(res);
        if (res.data.success) {
          this.tableData = res.data.data || [];
        }
      });
    },
    stopxiafa() {
      // this.compareData.forEach(item => {
      //   let deviceUuid = item.deviceUuid;
      //   let taskUuid = item.taskUuid;
      //   api.stopConfigIssue(deviceUuid, taskUuid).then(res => {
      //     if (res.data.success) {
      //     }
      //   });
      // });
      console.log(this.tableData);
      let num = [];
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        // 取消全部的下发
        // if (this.compareData[i].status === -1) {
        num.push(this.tableData[i]);
        // }
      }
      api.deleteFailTask(num).then(res => {});
    },
    research() {},
    handleSelectionChange() {},
    upodateItem() {},
    confirm() {
      this.$emit("confirm", this.name);
      this.$emit("update:visible", false);
    },
    cancel() {
      this.stopxiafa();
      this.close();
    },
    close() {
      // 点击取消，不是终止下发，只是关闭弹窗
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    rexiafa(row) {
      // 重新下发
      let deviceUuid = row.deviceUuid;
      let taskUuid = row.taskUuid;
      api.setReConfigIssue(deviceUuid, taskUuid).then(res => {
        if (res.data.success) {
          this.TheCompanyTableXiafaDialogVisible = true;
          this.getCompare();
          clearTimeout(this.timer);
          this.loop();
        }
      });
    },
    loop() {
      this.timer = setTimeout(() => {
        this.getCompare();
      }, 1000);
    }
  },
  watch: {
    visible(val) {
      this.TreechangeNameDialogVisible = this.visible;
      if (val) {
        this.getxiafalist();
        this.loop();
      } else {
        this.tableData = [];
        this.compareData = [];
        clearTimeout(this.timer);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
  padding: 10px 46px 30px;
  box-sizing: border-box;
}
.researchbutton {
  @include buttonnoborder;
}
.rexiafa {
  color: $add-text-color;
  cursor: pointer;
}
.body {
  @include padding;
  .title {
    height: 40px;
    line-height: 30px;
    @include font-s;
  }
  .righttips {
    float: right;
    .test {
      padding-right: 20px;
    }
    .refresh {
      cursor: pointer;
      img {
        display: inline-block;
        vertical-align: middle;
      }
      color: $add-text-color;
    }
  }
}
.selectFile {
  float: left;
  label {
    @include font-s;
  }
  .input {
    width: 300px;
  }
  .addIcon {
    @include buttonnoborder;
  }
}
.footer {
  @include padding;
  overflow: hidden;
  button {
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
</style>
