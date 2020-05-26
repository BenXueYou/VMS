<template>
  <div id="ActualEquipmentMenu" class="ActualEquipmentMenu">
    <div class="echartsWrap2">
      <div class="echartsDescrible">单位：个</div>
      <div id="canvasEquipment"></div>
    </div>
    <div class="contentWrap2">
      <div
        class="EquipmentListWrap2"
        v-loading="mainListLoading2"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div class="header">
          <div class="icon"></div>
          <div class="text">
            {{ $common.getEnumItemName("equip_type", currentType1) }}（{{
              pageInfo1.total
            }}）
          </div>
        </div>
        <div class="inforWrap2">
          <div
            class="singleEquipmentCell"
            id="singleEquipmentCell"
            v-for="(o, index) in tablePowerData"
            :key="index"
          >
            <div id="mainEquipmentImg" style="overflow: hidden;">
              <img
                class="mainEquipmentImg"
                id="mainEquipmentImg"
                :src="
                  tablePowerData.length > index
                    ? tablePowerData[tablePowerData.length - index - 1]
                        .equipmentPicture
                      ? WIamgeurl +
                        tablePowerData[tablePowerData.length - index - 1]
                          .equipmentPicture
                      : require('@/assets/images/user.png')
                    : require('@/assets/images/user.png')
                "
              />
            </div>
            <div class="textWrap2">
              <div class="singleText1">
                <img
                  class="euipNameIcon"
                  :src="require('@/assets/images/equipment1.png')"
                />
                <div
                  class="textContain"
                  @mouseover="mymouseover"
                  @mouseout="mymouseout"
                  @mousemove="mymousemove"
                >
                  装备名称：{{
                    tablePowerData.length > index
                      ? tablePowerData[tablePowerData.length - index - 1]
                          .equipmentName
                      : ""
                  }}
                </div>
              </div>
              <div class="singleText1">
                <img
                  class="locationNameIcon"
                  :src="require('@/assets/images/location.png')"
                />
                <div
                  class="textContain"
                  @mouseover="mymouseover"
                  @mouseout="mymouseout"
                  @mousemove="mymousemove"
                >
                  位置：
                  <span
                    v-if="
                      tablePowerData[tablePowerData.length - index - 1]
                        .longitude
                    "
                    >经度：</span
                  >
                  {{
                    tablePowerData.length > index
                      ? tablePowerData[tablePowerData.length - index - 1]
                          .longitude
                      : ""
                  }}
                  <span
                    v-if="
                      tablePowerData[tablePowerData.length - index - 1].latitude
                    "
                    >纬度：</span
                  >
                  {{
                    tablePowerData.length > index
                      ? tablePowerData[tablePowerData.length - index - 1]
                          .latitude
                      : ""
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer2">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :page-size="pageInfo1.pageSize"
          :current-page="pageInfo1.currentPage"
          @current-change="handleCurrentChange"
          :total="pageInfo1.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import icons from "@/common/icon.js";
import * as api from "../ajax";
import { mapState } from "vuex";
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  name: "leftmenu",
  components: {},
  props: {
    activeProject: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      WIamgeurl: RestApi.api.imageUrl,
      pageInfo1: {
        total: 0,
        pageSize: 20,
        currentPage: 1
      },
      tablePowerData: [],
      EquipmentTotal: [],
      changeTitle: "",
      addTitle: "",
      showOrgDialogVisible: false,
      isDeleteVisible: false,
      Treeparent: "",
      options: [],
      select: "",
      treeName: "tree1",
      activeName: "organiza",
      icons,
      searchText: "", // 搜索框的文本
      appendChildrenDialogVisible: false,
      appendTagDialogVisible: false,
      changeNameDialogVisible: false,
      node: "", // 用于存储当前的操作的节点
      nodeValue: "", // 值
      rankOrder: "",
      orgUuid: "", //
      version: "",
      tagIndex: 0, // 用来上下移动标签的时候记录
      data: [],
      data2: [],
      treenodeNums: [],
      selectId: "",
      parentOrgUuid: "",
      lastParentOrgUuid: "", // 更新
      lastParent: "",
      upData: {},
      downData: {},
      labelTotal1: [],
      labelTranslatTotal1: [],
      currentType1: "",
      listLabelName1: "",
      mainListLoading2: false,
      bar1: "",
      optionPower2: {},
      myChartw: ""
    };
  },
  mounted() {
    this.data = [];
    this.data2 = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    this.initData2();
    var dom1 = document.getElementById("canvasEquipment");
    this.bar1 = this.$echarts.init(dom1);
    this.bar1.setOption(this.optionPower2);
    /* 窗口变化时自适应 步骤一:监听窗口变化 */
    window.addEventListener("resize", this.resizeHandle3);
    window.addEventListener("resize", this.resizeHandle4);
    this.handleInitChart();
  },
  activated() {},
  destroyed() {
    /* 窗口变化时自适应 步骤三 组件被注销时，缩放函数是匿名函数，且仍然在事件监听列表中，
    因此匿名函数和匿名函数中用到的外部变量在组件注销后均不会被清理。
     所以要手动清理 */
    window.removeEventListener("resize", this.resizeHandle4);
    window.removeEventListener("resize", this.resizeHandle3);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandle4);
    window.removeEventListener("resize", this.resizeHandle3);
  },
  computed: {
    ...mapState({
      tagUuid: state => {
        return state.equipment.tagUuid;
      }
    })
  },
  methods: {
    handleInitChart() {
      var dom3 = document.getElementById("canvasEquipment");
      let myChartw = this.$echarts.init(dom3);
      this.myChartw = myChartw;
      let that = this;
      this.myChartw.on("click", function(params) {
        // 点击柱状图
        that.listLabelName1 = params.name;
        for (let i = 0; i < that.labelTranslatTotal1.length; i++) {
          if (that.labelTranslatTotal1[i] === params.name) {
            that.currentType1 = that.labelTotal1[i];
          }
        }
        if (that.currentType1) {
          that.pageInfo1.currentPage = 1;
          that.getPowerList1();
        }
      });
    },
    resizeHandle3() {
      this.bar1.resize();
    },
    resizeHandle4() {
      this.initImageWidth();
    },
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    },
    initImageWidth() {
      let length1 = document.getElementById("singleEquipmentCell").offsetWidth;
      let elems = document.querySelectorAll("#mainEquipmentImg");
      for (let index = 0; index < elems.length; index++) {
        elems[index].style.width = length1 + "px";
        elems[index].style.height = length1 + "px";
        console.log("length1==", Number(length1) + 60 + "px");
      }
      let elems2 = document.querySelectorAll("#contentWrap2");
      for (let index2 = 0; index2 < elems2.length; index2++) {
        // elems[index].style.width = length1 + "px";
        elems2[index2].style.height = Number(length1) + 100 + "px";
        console.log("length1==", Number(length1) + 60 + "px");
      }
    },
    handleCurrentChange(val) {
      this.pageInfo1.currentPage = val;
      this.getPowerList1();
    },
    // 获取实有装备统计数据
    initData2() {
      this.powerTotal = [];
      this.labelTotal1 = [];
      this.labelTranslatTotal1 = [];
      api
        .getEquipmentChart({ projectUuid: this.activeProject })
        .then(res => {
          if (res.data.success) {
            if (res.data && res.data.data) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.EquipmentTotal.push(res.data.data[i].count);
                this.labelTotal1.push(res.data.data[i].equipmentType);
                this.labelTranslatTotal1.push(
                  this.$common.getEnumItemName(
                    "equip_type",
                    res.data.data[i].equipmentType
                  )
                );
              }
              this.startPowerDraw1();
              this.currentType1 = this.labelTotal1[0];
              if (this.currentType1) {
                this.getPowerList1();
              }
            }
          }
        })
        .catch(err => {
          this.mainListLoading2 = false;
          console.log("请求错误：" + err);
        });
    },
    // 获取实有装备列表
    getPowerList1() {
      this.mainListLoading2 = true;
      // this.pageInfo1.total = 0;
      this.tableData = [];
      // this.listLabelName1 = "";
      let dada = {
        equipmentType: this.currentType1,
        page: this.pageInfo1.currentPage,
        limit: this.pageInfo1.pageSize,
        projectUuid: this.activeProject
      };
      let parms = {
        dada: dada
      };
      api
        .getEquipmentList(parms)
        .then(res => {
          if (res.data.success) {
            this.pageInfo1.total = res.data.data.total;
            this.tablePowerData = res.data.data.list;
            setTimeout(() => {
              this.initImageWidth();
            }, 0);
          }
          this.mainListLoading2 = false;
        })
        .catch(err => {
          this.mainListLoading2 = false;
          console.log("请求错误：" + err);
        });
    },
    startPowerDraw1() {
      this.$nextTick(() => {
        this.drawPie1();
      });
    },
    drawPie1() {
      this.optionPower2 = {
        color: ["#26D39D", "#E7A918"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //     data: ['直接访问','视频广告']
        // },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.labelTranslatTotal1,
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(255,255,255,0.8)", // 更改坐标轴文字颜色
                fontSize: 14 // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.1)" // 更改坐标轴颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(221,221,221,0.8)", // 更改坐标轴文字颜色
                fontSize: 14 // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.1)" // 更改坐标轴颜色
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["rgba(255,255,255,0.1)"],
                width: 1,
                type: "solid"
              }
            }
          }
        ],
        series: [
          {
            name: "装备",
            type: "bar",
            data: this.EquipmentTotal,
            barWidth: "40px",
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            }
          }
        ]
      };
      this.myChartw.setOption(this.optionPower2);
    }
  },
  watch: {
    searchText(val) {
      this.$refs[this.treeName].filter(this.searchText);
    },
    activeProject: {
      handler(val) {
        if (this.myChartw) {
          this.myChartw.clear();
        }
        this.EquipmentTotal = [];
        this.labelTotal1 = [];
        this.labelTranslatTotal1 = [];
        this.pageInfo1 = {
          total: 0,
          pageSize: 20,
          currentPage: 1
        };
        this.tablePowerData = [];
        this.currentType1 = [];
        this.initData2();
      }
    }
  }
};
</script>
<style>
.ActualEquipmentMenu {
  height: 100%;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.ActualEquipmentMenu .euipNameIcon {
  width: 13px;
  height: 12px;
  margin-right: 8px;
}
.ActualEquipmentMenu .locationNameIcon {
  width: 10px;
  height: 12px;
  margin-right: 10px;
}
.ActualEquipmentMenu .singleText1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.ActualEquipmentMenu .singleText1 .textContain {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ActualEquipmentMenu .contentWrap2 {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  justify-content: space-between;
}
.ActualEquipmentMenu .echartsWrap2 {
  width: 100%;
  height: 240px;
  /* height: 310px;*/
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  position: relative;
}
.ActualEquipmentMenu .echartsWrap2 #canvasEquipment {
  width: 100%;
  /*min-height: 290px;*/
  height: 100%;
}
.ActualEquipmentMenu .echartsWrap2 .echartsDescrible {
  position: absolute;
  left: 13px;
  /* top: 273px;*/
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #dddddd;
  letter-spacing: 0;
  text-align: justify;
  bottom: 5px;
}
.ActualEquipmentMenu .EquipmentListWrap2 {
  width: 100%;
  height: 100%;
}
.ActualEquipmentMenu .EquipmentListWrap2 .header {
  width: 100%;
  height: 58px;
  display: flex;
  flex-direction: row;
  /*: center;*/
  align-items: flex-end;
}
.ActualEquipmentMenu .EquipmentListWrap2 .header .icon {
  width: 4px;
  height: 18px;
  background: #26d39d;
  border-radius: 1px;
  margin-right: 11px;
}
.ActualEquipmentMenu .EquipmentListWrap2 .header .text {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
}
.ActualEquipmentMenu .EquipmentListWrap2 .inforWrap2 {
  width: 100%;
  /* padding-top: 20px;*/
}
.ActualEquipmentMenu .EquipmentListWrap2 .inforWrap2 .singleEquipmentCell {
  width: 7.95%;
  background: rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;
  float: left;
  margin-right: 2.25%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.ActualEquipmentMenu
  .EquipmentListWrap2
  .inforWrap2
  .singleEquipmentCell:nth-child(10n) {
  margin-right: 0;
}
.ActualEquipmentMenu .EquipmentListWrap2 .singleEquipmentCell .textWrap2 {
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #dddddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 5.5%;
  padding-top: 5px;
}
.ActualEquipmentMenu .EquipmentListWrap2 .singleEquipmentCell .textWrap2 div {
  width: 100%;
  text-align: left;
  line-height: 20px;
}
.ActualEquipmentMenu .footer2 {
  /*   margin-bottom: 3px;*/
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
</style>
