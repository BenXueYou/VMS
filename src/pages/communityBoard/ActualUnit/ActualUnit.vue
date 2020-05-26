<template>
  <div class="ActualUnit">
    <div class="topDiv">
      <div class="leftDiv">
        <div>
          <span v-if="isLevelOne == 'levelTwo'">请选择小区：</span>
          <el-select v-model="activeProject"
                     clearable
                     @change="handleStreetChange"
                     v-if="isLevelOne == 'levelTwo'">
            <el-option v-for="item in selectData"
                       :label="item.childName"
                       :value="item.childUuid"
                       :key="item.childUuid"></el-option>
          </el-select>
        </div>
        <div>
          单位名称：
          <el-input v-model="unitName"></el-input>
        </div>
        <div>
          联系人：
          <el-input v-model="contactName"></el-input>
        </div>
        <el-button type="primary"
                   size="mini"
                   @click="queryBtnData">查询</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="resetBtnData">重置</el-button>
      </div>
      <el-button type="primary"
                 class="backBtnClass"
                 @click="goBack()">
        <img src="@/assets/images/ActualPopulation/back.png" />返回
      </el-button>
    </div>
    <div class="bodyBox"
         v-loading="isLoading">
      <div class="cardWrap"
           v-if="tableData.length">
        <div class="cardBox"
             v-for="(item, index) in tableData"
             :key="index">
          <actual-unit-card :data="item"
                            @actualUnitCardDetail="actualUnitCardDetail(item)" />
        </div>
      </div>
      <div v-else
           class="card_empty el-table__empty-text">暂无数据</div>
    </div>
    <div class="footer">
      <el-pagination background
                     layout="total, prev, pager, next, jumper"
                     :page-size="pageInfo.pageSize"
                     :current-page="pageInfo.currentPage"
                     @current-change="handleCurrentChange"
                     :total="pageInfo.total"></el-pagination>
    </div>
    <!-- 查看从业人员详情 -->
    <actual-unit-detail :visible.sync="isShow"
                        @onCancel="handleCloseDialog"
                        ref="companyInfo"></actual-unit-detail>
  </div>
</template>
<script>
import ActualUnitCard from "./components/ActualUnitCard.vue";
import ActualUnitDetail from "./components/ActualUnitDetail.vue";
import * as Api from "../utils/town";
export default {
  name: "",
  props: {},
  components: { ActualUnitCard, ActualUnitDetail },
  data() {
    return {
      activeProject: "",
      companyInfo: {},
      unitName: "",
      contactName: "",
      isLoading: false,
      pageInfo: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      isShow: false,
      tableData: [],
      selectData: []
    };
  },
  computed: {
    isLevelOne() {
      return this.$store.state.home.projectType.platformLevel;
    }
  },
  mounted() {
    this.isLevelOne === "levelTwo"
      ? this.handleGetAllProject()
      : this.handleGetUnit();
  },
  methods: {
    handleStreetChange() {
      this.handleGetUnit();
    },
    handleGetUnit() {
      this.isLoading = true;
      this.tableData = [];
      let params = {
        projectUuid: this.activeProject,
        companyName: this.unitName,
        companyType: "",
        chargePerson: this.contactName,
        infrastructureUuid: "",
        limit: this.pageInfo.pageSize,
        page: this.pageInfo.currentPage
      };
      params = this.$common.deleteEmptyString(params);
      this.$unitHttp
        .getDataBoardAllUnits(params, {
          modelName: "社区看板",
          type: "查看",
          detailContent: "查看实有单位"
        })
        .then(res => {
          let data = res.data.data;
          this.tableData = data.list;
          this.isLoading = false;
          this.pageInfo.total = data.total;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleGetAllProject() {
      Api.getStreetList({
        projectName: "",
        limit: 1000000,
        page: 1
      })
        .then(res => {
          let list = res.data.data.list;
          this.selectData = [...list];
          if (this.selectData.length) {
            this.activeProject = this.selectData[0].childUuid;
          } else {
            this.activeProject = "";
          }
          this.handleGetUnit();
        })
        .catch(err => {
          console.log(err);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.handleGetUnit();
    },
    formatData(row) {
      let infrastructureUuid = "";
      let infrastructureUri = "";
      if (row.infrastructure) {
        for (let item of row.infrastructure) {
          if (!infrastructureUuid) {
            infrastructureUuid = item.infrastructureUuid;
          } else {
            infrastructureUuid =
              infrastructureUuid + "," + item.infrastructureUuid;
          }
          if (!infrastructureUri) {
            infrastructureUri = item.infrastructureUri;
          } else {
            infrastructureUri =
              infrastructureUri + "," + item.infrastructureUri;
          }
        }
      }

      let infrastructure = {
        infrastructureUuid,
        infrastructureUri
      };
      return infrastructure;
    },
    actualUnitCardDetail(item) {
      this.$refs.companyInfo.infrastructureUuids = this.formatData(
        item
      ).infrastructureUuid;
      this.$refs.companyInfo.unitsName = item.companyName;
      this.$refs.companyInfo.companyUuid = item.companyUuid;
      this.$refs.companyInfo.projectUuid = this.activeProject;
      this.isShow = true;
    },
    handleResetPage() {
      this.pageInfo.currentPage = 1;
      this.pageInfo.pageSize = 10;
    },
    queryBtnData() {
      this.handleResetPage();
      this.handleGetUnit();
    },
    resetBtnData() {
      this.unitName = "";
      this.contactName = "";
      this.activeProject = "";
      this.handleResetPage();
      this.handleGetUnit();
    },
    handleCloseDialog() {
      this.isShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.ActualUnit {
  height: calc(100% - 60px);
  margin: 30px;
  padding: 20px 39px;
  padding-top: 0;
  position: relative;
  background: rgba(67, 251, 239, 0.07);
  border: 1px solid rgba(37, 210, 152, 0.3);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  box-sizing: border-box;
  >>> .el-button {
    width: 80px;
    height: 40px;
    padding: 0;
    text-align: center;
    line-height: 40px;
  }
  .topDiv {
    height: 90px;
    display: flex;
    justify-content: space-between;
    vertical-align: middle;
    align-items: center;
    .leftDiv {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;
      div {
        font-family: "PingFangSC-Regular";
        font-size: 16px;
        color: #dddddd;
        letter-spacing: 0;
        text-align: justify;
        margin-right: 50px;
      }
      >>> .el-input {
        width: 180px;
        height: 40px;
        .el-input__inner {
          height: 40px;
        }
      }
    }
    .backBtnClass {
      width: 100px;
      height: 42px;
      img {
        width: 14px;
        height: 16px;
        vertical-align: middle;
        margin-right: 8px;
      }
    }
  }
  .bodyBox {
    border-top: 1px dashed rgba(255, 255, 255, 0.25);
    height: calc(100% - 140px);
    overflow: auto;
    margin-bottom: 20px;
    .cardWrap {
      width: 100%;
      max-width: 1780px;
      padding-top: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    .cardBox {
      width: 320px;
      margin: 0 auto;
      &:nth-of-type(-n + 5) {
        margin-bottom: 34px;
      }
      &:not(:nth-of-type(5n)) {
        margin-right: 45px;
      }
    }
    .card_empty {
      margin: 0 auto;
      text-align: center;
    }
  }
  .footer {
    text-align: center;
    box-sizing: border-box;
  }
}
.ActualUnit::before {
  content: "";
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
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
