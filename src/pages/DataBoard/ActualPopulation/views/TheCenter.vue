<template>
  <div class="center_wrap">
    <div class="pop_select">
      <el-dropdown trigger="click">
        <span>
          {{ activeDrop.label }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in dropItems"
                            :key="item.key"
                            @click.native="handleChangeSelect(item)">{{ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
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
// import icons from "@/common/icon.js";
// import RestApi from "@/utils/RestApi.js";
import CenterSun from "../components/TheCenterSun";
export default {
  name: "wrap",
  props: {},
  components: { CenterSun },
  data() {
    return {
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      activeDrop: {
        label: "全部人员",
        value: ""
      },
      dropItems: [
        { key: 1, title: "全部人员", value: "" },
        { key: 2, title: "居民", value: "residentAsahiChart" },
        { key: 3, title: "重点人员", value: "featureAsahiChart" },
        { key: 4, title: "实有力量", value: "strengthAsahiChart" }
      ],
      sunData: {},
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
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isOwn");
    this.handleGetSunData();
  },
  destroyed() {},
  beforeDestroy() {},
  deactivated() {},
  methods: {
    handleChangeSelect(item) {
      this.activeDrop = {
        label: item.title,
        value: item.value
      };
      this.handleGetSunData();
    },
    handleGetSunData() {
      this.sunData = {};
      if (!this.ShowAuthDisabled) return;
      Api.getSunData({ queryType: this.activeDrop.value })
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
      // 第一层
      let sun = {
        projectUuid: data.projectUuid,
        projectName: data.projectName,
        count: data.count,
        children: []
      };
      // 第二层
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
        // 第三层
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
      // 点击 旭日图 组织节点 传入 projectUUid
      this.$emit("refreshAll", val);
    },
    handleChangeOrg(val) {
      if (!this.ShowAuthDisabled) return;
      // 点击根节点和项目节点 传入 orgUuid
      this.$emit("refreshOrg", val);
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.el-dropdown-menu__item {
  text-align: left !important;
}
</style>
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
