<template>
  <div class="center_wrap">
    <div class="pop_select"></div>
    <el-button type="primary"
               class="pop_back"
               @click="$router.go(-1)">
      <img src="@/assets/images/downTown/go-back.png" />
      <b>返回</b>
    </el-button>
    <CenterSun :sunData="sunData"
               @reFreshOut="handleRefreshOut"
               @changeOrg="handleChangeOrg"></CenterSun>
  </div>
</template>
<script>
import * as Api from "../../utils/town";
import CenterSun from "../components/TheCenterSun";
export default {
  name: "wrap",
  props: {},
  components: { CenterSun },
  data() {
    return {
      sunData: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      colors: [
        "#32C5FF",
        "#0091FF",
        "#0045FF",
        "#5F32FF",
        "#AF20E0",
        "#D60404",
        "#FF4545",
        "#FA6400",
        "#F7B500",
        "#FFF158",
        "#9FFF39",
        "#6DD400",
        "#008D51",
        "#00D440",
        "#25D293",
        "#32C5FF",
        "#0091FF",
        "#0045FF",
        "#5F32FF",
        "#AF20E0",
        "#D60404",
        "#FF4545",
        "#FA6400",
        "#F7B500",
        "#FFF158",
        "#9FFF39",
        "#6DD400"
      ]
    };
  },
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有房屋", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有房屋", "isOwn");
    this.handleGetSunData();
  },
  destroyed() {},
  beforeDestroy() {},
  deactivated() {},
  methods: {
    handleGetSunData() {
      if (!this.ShowAuthDisabled) return;
      this.sunData = {};
      Api.getSunData({ queryType: "" })
        .then(res => {
          let body = res.data.data;
          if (body) {
            this.handleFormatSunData(body);
          } else {
            this.sunData = {};
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleFormatSunData(data) {
      let sun = {
        projectUuid: data.projectUuid,
        projectName: data.projectName,
        count: data.count,
        children: []
      };
      let newData = data.childAsahiChartList;
      for (let index = 0; index < newData.length; index++) {
        let e = newData[index];
        let newColor = this.colors[index];
        e.name = `${e.count}人\n\n${e.projectName}`;
        e.value = e.count;
        e.children = e.childAsahiChartList;
        e.isOrg = true;
        e.itemStyle = {
          color: newColor
        };
        for (let iIndex = 0; iIndex < e.children.length; iIndex++) {
          let a = e.children[iIndex];
          let b = this.$common.copyObject(a);
          a.name = `${a.count}人`;
          a.value = a.count;
          b.name = b.projectName;
          b.value = b.count;
          a.itemStyle = {
            color: newColor
          };
          b.itemStyle = {
            color: newColor
          };
          a.children = [b];
        }
      }
      sun.children = newData;
      this.sunData = sun;
    },
    handleRefreshOut(val) {
      if (!this.ShowAuthDisabled) return;
      this.$emit("refreshAll", val);
    },
    handleChangeOrg(val) {
      if (!this.ShowAuthDisabled) return;
      this.$emit("refreshOrg", val);
    }
  },
  watch: {}
};
</script>
<style scoped lang="scss">
.center_wrap {
  flex: 1;
  width: 0;
  height: 100%;
  position: relative;
  .pop_select {
    position: absolute;
    left: 25px;
    top: 25px;
    z-index: 10;
    cursor: pointer;
    .el-dropdown {
      width: 120px;
      height: 32px;
      border: 1px solid rgba($color: #ffffff, $alpha: 0.2);
      border-radius: 2px;
      line-height: 32px;
      box-sizing: border-box;
      & > span {
        color: #ffffff;
        font-size: 14px;
        box-sizing: border-box;
      }
      .el-dropdown-selfdefine {
        display: flex;
        width: 100%;
        height: 100%;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
  .pop_back {
    padding: 0;
    width: 90px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border-radius: 3px;
    border: 1 solid rgba(37, 210, 152, 0.6);
    background: rgba(37, 210, 152, 0.15);
    position: absolute;
    right: 25px;
    top: 25px;
    z-index: 10;
    >>> span {
      display: flex;
      width: 100%;
      height: 100%;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 18px;
      height: 14px;
      margin-right: 5px;
    }
    b {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: justify;
      font-weight: normal;
    }
  }
}
</style>
