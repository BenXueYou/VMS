<template>
  <div class="FacultyList">
    <div class="flex_sbw topBox">
      <div class="leftBox">
        <div class="dateTimeBox">
          请选择时间段：
          <el-date-picker type="date"
                          format='yyyy-MM-dd'
                          value-format='yyyy-MM-dd'
                          placeholder="开始时间"
                          v-model="startTime"></el-date-picker>
          <span>-</span>
          <el-date-picker type="date"
                          format='yyyy-MM-dd'
                          value-format='yyyy-MM-dd'
                          placeholder="结束时间"
                          v-model="endTime"></el-date-picker>
        </div>
        <div class="radioGroupBox">
          <el-radio-group v-model="typeRadio"
                          @change="typeRadioChangeAct">
            <el-radio label="today">今日</el-radio>
            <el-radio label="lastday">昨日</el-radio>
            <el-radio label="thisWeek">本周</el-radio>
            <el-radio label="thisMonth">本月</el-radio>
          </el-radio-group>
        </div>
        <div class="divBox">
          姓名：
          <el-input v-model="staffName"
                    clearable></el-input>
        </div>
        <el-button @click="queryBtnAct">查询</el-button>
        <el-button @click="resetBtnAct">重置</el-button>
      </div>
      <div class="rightBox">
        <el-button type="primary"
                   class="backBtnClass"
                   @click="goBack()">
          <img style="margin-right:8px"
               src="@/assets/images/SchoolBoard/back.png" />返回
        </el-button>
      </div>
    </div>
    <div class="BodyClass">
      <div class="bodyBox">
        <template v-for="(item, index) in DataTable">
          <faculty-card class="cardClass"
                        :CardItem="item"
                        :class="!item.sign?'NoSignalCardClass':''"
                        :key="index"></faculty-card>
        </template>
      </div>
    </div>
    <div class="footBox">
      <el-pagination @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     layout="total,prev, pager, next,jumper"
                     :page-size="pageSize"
                     :total="total"
                     background></el-pagination>
    </div>
  </div>
</template>

<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import FacultyCard from "./components/FacultyCard.vue";
export default {
  components: { elPopverTree, FacultyCard },
  props: {},
  data() {
    return {
      ShowAuthDisabled: false,
      OwnAuthDisabled: false,
      startTime: "",
      endTime: "",
      typeRadio: "today",
      staffName: null,
      pageSize: 16,
      total: 0,
      currentPage: 1,
      DataTable: []
    };
  },
  created() {
    this.typeRadioChangeAct(this.typeRadio);
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("在岗安保人员", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("在岗安保人员", "isOwn");
    this.initData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    initData() {
      if (!this.ShowAuthDisabled) return;
      let isValite =
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime();
      if (isValite) {
        this.$message({ type: "warning", message: "开始时间不得早于结束时间" });
        return;
      }
      if (
        new Date(this.endTime).getMonth() === new Date().getMonth() &&
        new Date(this.endTime).getDate() > new Date().getDate()
      ) {
        this.$message({ type: "warning", message: "结束时间不得早于当天" });
        return;
      }
      let data = {
        staffName: this.staffName,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.currentPage,
        limit: this.pageSize
      };
      if (!data.staffName) data.staffName = null;
      this.$FacultyHttp
        .getFacultyApi(data)
        .then(res => {
          this.DataTable = [];
          this.total = 0;
          if (res.data.success && res.data.data) {
            this.DataTable = res.data.data.list || [];
            this.total = res.data.data.total;
          } else {
          }
        })
        .catch(() => {});
    },
    queryBtnAct() {
      this.currentPage = 1;
      this.initData();
    },
    resetBtnAct() {
      this.currentPage = 1;
      this.typeRadio = "today";
      this.typeRadioChangeAct(this.typeRadio);
      this.staffName = null;
    },
    typeRadioChangeAct(val) {
      let obj = this.$common.transSelectDate(val);
      console.log(obj);
      this.startTime = obj.startTime.split(" ")[0];
      this.endTime = obj.endTime.split(" ")[0];
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss">
.FacultyList {
  display: inline-block;
  width: calc(100% - 60px);
  margin: 30px;
  height: calc(100% - 64px);
  background: rgba(67, 251, 239, 0.07);
  border: 1px solid rgba(37, 210, 152, 0.3);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  padding: 30px;
  box-sizing: border-box;
  .el-input {
    display: inline-block;
  }
  .flex_sbw {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .topBox {
    font-family: "PingFangSC-Regular";
    font-size: 13px;
    color: #ffffff;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
    padding-bottom: 15px;
    .dateTimeBox {
      min-width: 500px;
      .el-input {
        width: 190px;
      }
      .el-input--suffix .el-input__inner {
        padding-right: 15px;
      }
      span {
        margin: 0 5px;
      }
    }
    .leftBox {
      display: flex;
      // flex-wrap: wrap;
      justify-content: flex-start;
      .radioGroupBox {
        min-width: 255px;
        margin: 0 2%;
        line-height: 40px;
        .el-radio {
          margin-right: 15px;
        }
      }
      .deviceBox {
        min-width: 260px;
      }
      .divBox {
        min-width: 205px;
        .el-input {
          width: 160px;
        }
      }
    }
    .rightBox {
      min-width: 165px;
    }
    .el-button {
      background: rgba(40, 255, 187, 0.08);
      border: 1px solid rgba(38, 211, 157, 0.8);
      border-radius: 2px;
      margin-left: 20px;
      height: 36px;
      padding: 6px 26px;
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
    }
  }
  .BodyClass {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 240px);
    overflow-y: auto;
    .bodyBox {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      .cardClass {
        margin: 20px 15px;
        width: 418px;
        box-sizing: border-box;
      }
      .NoSignalCardClass {
        background: rgba(0, 0, 0, 0.05);
        border: 1px dashed rgba(0, 216, 160, 0.25);
        border-radius: 2px;
      }
    }
  }
  .footBox {
    text-align: center;
  }
}
.FacultyList::before {
  content: "";
  min-width: calc(100% - 60px);
  min-height: calc(100% - 114px);
  display: inline-block;
  margin: 30px;
  padding: 30px;
  box-sizing: border-box;
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 50px;
  overflow-y: auto;
  background: linear-gradient(to left, #25d298, #25d298) left top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left top no-repeat,
    linear-gradient(to left, #25d298, #25d298) right top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) right top no-repeat,
    linear-gradient(to left, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
}
</style>
