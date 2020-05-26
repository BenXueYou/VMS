<template>
  <div class="equipment">
    <div class="content">
      <div class="header">
        <div class="left">
          <div :class="isPower?'tab selected' : 'tab' " @click="switchTab('power')">实有力量</div>
          <div :class="!isPower?'tab selected' : 'tab' " @click="switchTab('equipment')">实有装备</div>
        </div>
        <div class="right">
          <div v-if="isLevelOne == 'levelTwo'">
          请选择小区：
          <el-select v-if="isLevelOne == 'levelTwo'"
          v-model="activeProject"
          clearable
          @change="handleStreetChange"
          >
          <el-option
          v-for="item in selectData"
          :label="item.childName"
          :value="item.childUuid"
          :key="item.childUuid"
          ></el-option>
          </el-select>
          </div>
          <el-button
            type="primary"
            :disabled="!ShowAuthDisabled"
            style="width: 100px;"
            class="search"
            @click="goBack()"
          >
            <img src="@/assets/images/ActualPopulation/back.png" />返回
          </el-button>
        </div>
      </div>
      <div class="statisticsCon" v-if="isPower">
        <the-leftmenu :activeProject="activeProject" :orgType="orgType" @changetab="changetab" ref="testTree" @clickNode="clickNode"></the-leftmenu>
      </div>
      <div class="statisticsCon" v-if="!isPower">
        <the-wrap
          :activeProject="activeProject"
          :tabName="tabName"
          :ShowAuthDisabled="ShowAuthDisabled"
          :OwnAuthDisabled="OwnAuthDisabled"
          @updateTree="updateTree"
        ></the-wrap>
      </div>
      <div class="contentMask1"></div>
      <div class="contentMask2"></div>
      <div class="contentMask3"></div>
      <div class="contentMask4"></div>
    </div>
  </div>
</template>

<script>
import TheLeftmenu from "./views/TheLeftmenu";
import TheWrap from "./views/TheContent";
import * as Api from "../utils/town";
import { mapState } from "vuex";
export default {
  components: {
    TheLeftmenu,
    TheWrap
  },
  props: {},
  data() {
    return {
      data: "",
      tabName: "organiza",
      orgType: window.config.orgType,
      needType: "",
      tagType: window.config.tagType,
      ShowAuthDisabled: false,
      OwnAuthDisabled: false,
      isPower: true,
      activeProject: "",
      // selectData: [{
      //  authState: "",
      //   childName: "社区平台1",
      //   childUuid: "25a5de1b310c4067bfdfcbccf6c747ed"
      // }, {
      //  authState: "",
      //   childName: "社区平台2",
      //   childUuid: "2e70c2772ead493d81b83bf776aff757"
      // }, {
      //  authState: "",
      //   childName: "社区平台3",
      //   childUuid: "85353583b17d4895babf4873044e4745"
      // }, {
      //  authState: "",
      //   childName: "社区平台4",
      //   childUuid: "52cac8fb00ca4fbba5368187a72431a5"
      // }, {
      //  authState: "",
      //   childName: "社区平台5",
      //   childUuid: "b410b4f356c3459bab9edcdd625dca4d"
      // }],
      selectData: []
    };
  },
  created() {},
  computed: {
    ...mapState({
      count: state => {
        return state.equipment.count;
      }
    }),
    isLevelOne() {
      return this.$store.state.home.projectType.platformLevel;
    }
  },
  activated() {},
  mounted() {
    this.isLevelOne === "levelTwo"
      ? this.handleGetAllProject()
      : this.handleGetUnit();
    // const { commit, state, getters } = this.$store;
    // console.log(state.equipment.count);
    // commit("increment");
    // console.log(state.equipment.count);
    // console.log(getters.doubleCount);
    // console.log(this.count);
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("力量和装备", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("力量和装备", "isOwn");
    // this.ShowAuthDisabled = true;
    // this.OwnAuthDisabled = true;
    // this.handleGetAllProject();
  },
  methods: {
    handleGetUnit() {
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
    handleStreetChange() {
      // this.handleGetUnit();
      let data = "";
      if (this.isPower === true) {
        data = "power";
      } else {
        data = "equipment";
      }
      this.switchTab(data);
    },
    goBack() {
      this.$router.go(-1);
    },
    switchTab(data) {
      setTimeout(() => {
        if (data === "power") {
          this.isPower = true;
        } else if (data === "equipment") {
          this.isPower = false;
        }
      }, 300);
      console.log("data===", data);
      // if (data === "power") {
      //   this.isPower = true;
      // } else if (data === "equipment") {
      //   this.isPower = false;
      // }
    },
    updateTree(tagUuid) {
      this.$refs.testTree.getOrgTag(true, tagUuid);
    },
    clickNode(node) {
      console.log(node);
    },
    changetab(tab) {
      // 左边菜单的切换tab事件
      // this.tabName = tab.name;
      // console.log(tab);
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.equipment {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 30px;
  box-sizing: border-box;
}
.equipment .content {
  // background: rgba(67,251,239,0.07);
  background: #051211;
  border: 1px solid rgba(37, 210, 152, 0.3);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.equipment .content .header {
  width: 100%;
  height: 80px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.24);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-right: 30px;
  box-sizing: border-box;
}
.equipment .content .header .left {
  flex: 1;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #dddddd;
  text-align: justify;
}
.equipment .content .header .right {
  width: 450px;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: #ffffff;
}
.equipment .content .header .right .el-button--primary {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.equipment .content .header .right img {
  width: 14.2px;
  height: 16px;
  margin-right: 7.8px;
  position: relative;
  top: 3px;
}
.equipment .content .contentMask1 {
  width: 20px;
  height: 20px;
  // background: red;
  position: absolute;
  left: 0;
  top: 0;
}
.equipment .content .contentMask1:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left, #25d298, #25d298) left top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left top no-repeat;
  // linear-gradient(to left, #25D298, #25D298) right top no-repeat,
  // linear-gradient(to bottom, #25D298, #25D298) right top no-repeat,
  // linear-gradient(to left, #25D298, #25D298) left bottom no-repeat,
  // linear-gradient(to bottom, #25D298, #25D298) left bottom no-repeat,
  // linear-gradient(to left, #25D298, #25D298) right bottom no-repeat,
  // linear-gradient(to left, #25D298, #25D298) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  z-index: 0;
}
.equipment .content .contentMask2 {
  width: 20px;
  height: 20px;
  // background: red;
  position: absolute;
  right: 0;
  top: 0;
}
.equipment .content .contentMask2:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left, #25d298, #25d298) right top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) right top no-repeat;
  // linear-gradient(to left, #25D298, #25D298) left bottom no-repeat,
  // linear-gradient(to bottom, #25D298, #25D298) left bottom no-repeat,
  // linear-gradient(to left, #25D298, #25D298) right bottom no-repeat,
  // linear-gradient(to left, #25D298, #25D298) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  z-index: 0;
}
.equipment .content .contentMask3 {
  width: 20px;
  height: 20px;
  // background: red;
  position: absolute;
  left: 0;
  bottom: 0;
}
.equipment .content .contentMask3:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left bottom no-repeat;
  // linear-gradient(to left, #25D298, #25D298) right bottom no-repeat,
  // linear-gradient(to left, #25D298, #25D298) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  z-index: 0;
}
.equipment .content .contentMask4 {
  width: 20px;
  height: 20px;
  // background: red;
  position: absolute;
  right: 0;
  bottom: 0;
}
.equipment .content .contentMask4:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left, #25d298, #25d298) right bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  z-index: 0;
}
// .equipment .content:before {
//   content: "";
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   left: 0;
//   top: 0;
//   background: linear-gradient(to left, #25D298, #25D298) left top no-repeat,
//             linear-gradient(to bottom, #25D298, #25D298) left top no-repeat,
//             linear-gradient(to left, #25D298, #25D298) right top no-repeat,
//             linear-gradient(to bottom, #25D298, #25D298) right top no-repeat,
//             linear-gradient(to left, #25D298, #25D298) left bottom no-repeat,
//             linear-gradient(to bottom, #25D298, #25D298) left bottom no-repeat,
//             linear-gradient(to left, #25D298, #25D298) right bottom no-repeat,
//             linear-gradient(to left, #25D298, #25D298) right bottom no-repeat;
//   background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
//   z-index: 0;
// }
.equipment .content .header {
  width: 100%;
  height: 80px;
  border-bottom: 1px solid rgba(37, 210, 152, 0.4);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.equipment .content .header .tab {
  height: 30px;
  font-family: PingFangSC-Medium;
  font-size: 22px;
  color: #dddddd;
  letter-spacing: 0;
  text-align: justify;
}
.equipment .content .header .selected {
  color: #25d298;
}
.equipment .content .header .tab:first-child {
  padding: 0 31px 0 34px;
  border-right: 1px solid rgba(216, 216, 216, 0.3);
}
.equipment .content .header .tab:last-child {
  padding-left: 30px;
}
.equipment .content .statisticsCon {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
