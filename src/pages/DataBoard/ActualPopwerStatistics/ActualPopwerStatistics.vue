<template>
  <div class="equipment">
    <div class="content">
      <div class="header">
        <div class="border-bottom"></div>
        <div class="left">
          <div :class="isPower ? 'tab selected' : 'tab'"
               @click="switchTab('power')">
            实有力量
          </div>
          <div :class="!isPower ? 'tab selected' : 'tab'"
               @click="switchTab('equipment')">
            实有装备
          </div>
        </div>
        <div class="right">
          <div class="select">
            请选择小区：
            <el-select v-model="activeProject"
                       clearable>
              <el-option v-for="item in selectData"
                         :label="item.childName"
                         :value="item.childUuid"
                         :key="item.childUuid"></el-option>
            </el-select>
          </div>
          <el-button type="primary"
                     :disabled="!ShowAuthDisabled"
                     style="width: 100px;"
                     class="search"
                     @click="goBack()">
            <img src="@/assets/images/ActualPopulation/back.png" />返回
          </el-button>
        </div>
      </div>
      <div class="statisticsCon"
           v-if="isPower">
        <the-leftmenu :orgType="orgType"
                      :activeProject="activeProject"
                      @changetab="changetab"
                      ref="testTree"
                      @clickNode="clickNode"></the-leftmenu>
      </div>
      <div class="statisticsCon"
           v-if="!isPower">
        <the-wrap :activeProject="activeProject"
                  :tabName="tabName"
                  :ShowAuthDisabled="ShowAuthDisabled"
                  :OwnAuthDisabled="OwnAuthDisabled"
                  @updateTree="updateTree"></the-wrap>
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
import { mapState } from "vuex";
import * as Api from "../utils/town";
export default {
  components: {
    TheLeftmenu,
    TheWrap
  },
  props: {},
  data() {
    return {
      activeProject: "",
      data: "",
      tabName: "organiza",
      orgType: window.config.orgType,
      needType: "",
      tagType: window.config.tagType,
      ShowAuthDisabled: false,
      OwnAuthDisabled: false,
      isPower: true,
      selectData: []
    };
  },
  created() {},
  computed: {
    ...mapState({
      count: state => {
        return state.equipment.count;
      }
    })
  },
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("力量与设备", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("力量与设备", "isOwn");
    this.handleGetAllProject();
  },
  methods: {
    handleGetAllProject() {
      this.isLoading = true;
      Api.getStreetList({
        projectName: "",
        limit: 1000000,
        page: 1
      })
        .then(res => {
          let list = res.data.data.list;
          this.selectData = [...list];
          this.activeProject = this.selectData[0]
            ? this.selectData[0].childUuid
            : "";
        })
        .catch(err => {
          console.log(err);
        });
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
      this.activeProject = this.selectData[0]
        ? this.selectData[0].childUuid
        : "";
    },
    updateTree(tagUuid) {
      this.$refs.testTree.getOrgTag(true, tagUuid);
    },
    clickNode(node) {
      console.log(node);
    },
    changetab(tab) {}
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-right: 30px;
  box-sizing: border-box;
  .border-bottom {
    width: 100%;
    height: 1px;
    background-image: linear-gradient(
      90deg,
      rgba(37, 210, 152, 0.4) 5%,
      rgba(37, 210, 152, 0) 99%
    );
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.equipment .content .header .left {
  flex: 1;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 22px;
  color: #dddddd;
  letter-spacing: 0;
  text-align: justify;
  div {
    cursor: pointer;
  }
}
.equipment .content .header .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .select {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #dddddd;
    letter-spacing: 0;
    text-align: justify;
    margin-right: 35px;
    >>> .el-select {
      height: 40px;
      .el-input {
        height: 40px;
        .el-input__inner {
          height: 40px;
        }
      }
    }
  }
}
.equipment .content .header .right .el-button--primary {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 40px;
  line-height: 40px;
  padding: 0;
  text-align: center;
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
