<template>
  <div id="equipLeftMenu"
       class="leftmenu">
    <div class="topCharts">
      <!--重点关注人员-->
      <div class="singleCharts specialCharts">
        <div class="title"
             style="margin-bottom: 0">
          <div class="icon"></div>
          <div class="text">重点关注人员</div>
        </div>
        <div class="progressWrap"
             style="height: 100%;">
          <div class="singleProgress"
               v-for="(item,index) in importantArr"
               :key="index">
            <span class="progressTitle">{{$common.getEnumItemName("feature",item.staffFeature)}}</span>
            <el-progress :percentage="item.percentage"></el-progress>
            <span class="progressText">{{item.count}}</span>
          </div>
          <!--       <div class="singleProgress">
            <span class="progressTitle">前科人员</span>
            <el-progress :percentage="50"></el-progress>
          </div>
          <div class="singleProgress">
            <span class="progressTitle">孤寡人员</span>
            <el-progress :percentage="50"></el-progress>
          </div>
          <div class="singleProgress">
            <span class="progressTitle">涉稳人员</span>
            <el-progress :percentage="50"></el-progress>
          </div>
          <div class="singleProgress">
            <span class="progressTitle">精神病人</span>
            <el-progress :percentage="50"></el-progress>
          </div>
          <div class="singleProgress">
            <span class="progressTitle">涉毒人员</span>
            <el-progress :percentage="50"></el-progress>
          </div> -->
        </div>
      </div>
      <!--人员类型-->
      <div class="singleCharts ">
        <div class="title">
          <div class="icon"></div>
          <div class="text">人员类型</div>
        </div>
        <div class="echartsWrap">
          <div id="canvasPieNew"></div>
        </div>
        <div class="echartsDetail">
          <div class="singleDetail"
               v-for="(item,index) in pieData"
               :key="index">
            <div class="squareIcon"
                 :style="{background:color[index]}"></div>
            <div class="text">{{item.name}}{{item.value||0}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomCharts singleCharts1" style="height: 550px;"
         id="bottomCharts">
      <!--人员总数-->
      <div class="singleCharts"
           id="singleBtmCharts" style="height: 550px;">
        <div class="title" style="position: relative;top: 18px;">
          <div class="icon"></div>
          <div class="text">人员总数</div>
        </div>
        <div class="statisticsWrap" style="position: relative;top: 18px;">
          <div class="singleStatistics">
            <div class="imgWrap"><img class="img1"
                   src="@/assets/images/ActualPopulation/totalPeopele.png" /></div>
            <div class="textWrap">
              <div class="name">人员总数</div>
              <div class="number">{{this.totalPeopleNumber}}</div>
            </div>
          </div>
          <div class="singleStatistics">
            <div class="imgWrap"><img class="img2"
                   src="@/assets/images/ActualPopulation/male.png" /></div>
            <div class="textWrap">
              <div class="name">男</div>
              <div class="number">{{this.maleTotalNumber}}</div>
            </div>
          </div>
          <div class="singleStatistics">
            <div class="imgWrap"><img class="img3"
                   src="@/assets/images/ActualPopulation/female.png" /></div>
            <div class="textWrap">
              <div class="name">女</div>
              <div class="number">{{this.femaleTotalNumber}}</div>
            </div>
          </div>
        </div>
        <div class="echartsWrap"
             id="echartsWrap">
          <div class="echartsDescrible">单位:个</div>
          <div id="canvasPieNew2"
               ref="bar111"></div>
        </div>
      </div>
      <!--门禁感知离开-->
      <div class="singleCharts singleCharts1" style="height: 550px;">
        <div class="titleWrap">
          <div class="title1">
            <div class="left">
              <div class="icon"></div>
              <div class="text">门禁感知离开</div>
            </div>
            <div class="right">
              <div class="icon">共{{perceptionTotal}}人</div>
              <div class="text"
                   style="margin-left:10px;">
                <span>连续</span>
                <el-input style="width: 40px;height: 30px;"
                          maxlength="2"
                          v-model="duration"
                          type="tel"
                          @keyup.native="handleInput($event)"></el-input>
                <span>天未出现</span>
              </div>
            </div>
          </div>
          <div class="title2">
            <div class="name">姓名</div>
            <div class="address">地址</div>
            <div class="event">事件</div>
          </div>
        </div>
        <div class="listWrap">
          <el-scrollbar style="height: 99%">
            <div class="singleList"
                 v-for="(item,index) in perceptionList"
                 :key="index">
              <div class="name">{{item.residentName}}</div>
              <div class="address">{{item.address.replace(/\／/g,"/")}}</div>
              <div class="event">{{item.event}}</div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import TreeAppendChildDialog from "@/common/TreeAppendChildDialog";
// import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
// import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
// import ConfirmDialog from "@/common/ConfirmDialog";
import icons from "@/common/icon.js";
// import * as api from "@/pages/equipmentMange/ajax.js";
// import orgDialog from "@/pages/equipmentMange/components/orgDialog";
// import { addTreeKey, copyTreeKey, remeberLast } from "@/utils/tree";
import * as api from "../ajax";
import { mapState } from "vuex";
export default {
  name: "leftmenu",
  components: {
    // TreeAppendChildDialog,
    // TreeChangeNameDialog,
    // TreeAppendTagDialog,
    // orgDialog,
    // ConfirmDialog
  },
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    orgType: {
      type: String,
      default() {
        return window.config.orgType;
      }
    },
    tagType: {
      type: String,
      default() {
        return window.config.tagType;
      }
    },
    needType: {
      type: String,
      default() {
        return "";
      }
    },
    activeProjectId: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      activeProject: "",
      isResize: true,
      perceptionTotal: "0",
      totalPeopleNumber: "",
      femaleTotalNumber: "",
      maleTotalNumber: "",
      maleTotal: [],
      femaleTotal: [],
      importantArr: [],
      importantNumber: "",
      perceptionList: [],
      duration: 8,
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
      data: [
        // {
        //   label: "华南区",
        //   icon: icons.folder,
        //   children: new Array(4).fill({
        //     label: "xxx分公司1",
        //     icon: icons.folder,
        //     children: [
        //       {
        //         label: "测试菜单展开1",
        //         icon: icons.folder
        //       }
        //     ]
        //   })
        // }
      ],
      data2: [
        // {
        //   label: "默认分组1",
        //   icon: icons.sign
        // }
      ],
      treenodeNums: [],
      selectId: "",
      parentOrgUuid: "",
      lastParentOrgUuid: "", // 更新
      lastParent: "",
      upData: {},
      downData: {},
      pieData: [
        { value: 0, name: "户籍人员" },
        { value: 0, name: "来沪人员" },
        { value: 0, name: "外籍人员" }
      ],
      color: ["#F05F75", "#5EF3FF", "#FFBA22"],
      searchDay: "8",
      bar: "",
      barOption: {}
    };
  },
  mounted() {
    this.data = [];
    this.data2 = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    // setTimeout(() => {
    //   this.getOrgTree(true);
    // }, 0);
    setTimeout(() => {
      this.initData1();
      this.initData2();
      this.initData3();
      this.initData4();
    }, 1000);
    // this.initData();
    // let that = this;
    // window.addEventListener("resize", function() {
    //   // let height =
    //   //   window.innerHeight ||
    //   //   document.documentElement.clientHeight ||
    //   //   document.body.clientHeight;
    //   let height = document.getElementById("bottomCharts").offsetHeight;
    //   // document.getElementById("echartsWrap").style.height = height-120 + "px";
    //   document.getElementById("canvasPieNew2").style.height = height - 120 + "px";
    //   console.log("height===", height);
    //   that.initData3();
    //   // console.log("height===", height)
    //   // var myChart = echarts.getInstanceByDom(document.getElementById(canvasPieNew2));
    //   // myChart.resize();
    //   // if (!that.isResize) return;
    //   //  document.getElementById("singleBtmCharts").style.height = height-120 + "px";
    //   // window.location.reload();
    // });
    // var twChart = echarts.init(document.getElementById('canvasPieNew2'));
    // twChart.setOption(option);
    // setTimeout(function (){
    //     window.onresize = function () {
    //       twChart.resize();
    //     }
    // },200)
    // this.bar = echarts.init(this.$refs.bar111)
    // this.bar.setOption(this.barOption)
    // var dom = document.getElementById("canvasPieNew2");
    // this.bar = this.$echarts.init(dom);
    // this.bar.setOption(this.barOption);
    // this.line = echarts.init(this.$refs.line)
    // this.line.setOption(this.lineOption)
    /* 窗口变化时自适应 步骤一:监听窗口变化 */
    // window.addEventListener("resize", this.resizeHandle);
  },
  destroyed() {
    /* 窗口变化时自适应 步骤三 组件被注销时，缩放函数是匿名函数，且仍然在事件监听列表中，
    因此匿名函数和匿名函数中用到的外部变量在组件注销后均不会被清理。
     所以要手动清理 */
    window.removeEventListener("resize", this.resizeHandle);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandle);
  },
  activated() {
    // this.isResize = true;
    // this.initData1();
    // this.initData2();
    // this.initData3();
    // this.initData4();
    // this.initData();
    // this.startDraw();
    // this.startDraw2();
  },
  computed: {
    ...mapState({
      tagUuid: state => {
        return state.equipment.tagUuid;
      }
    })
  },
  deactivated() {
    this.isResize = false;
  },
  methods: {
    /* 窗口变化时自适应 步骤二 调用echart的 resize() */
    resizeHandle() {
      this.bar.resize();
      console.log("resizeData==", this.isLastAdress);
    },
    handleInput(e) {
      // this.duration = this.duration.replace(/[^\.\d]/g, '');
      // this.duration = this.duration.replace('.', '');
      console.log(e.target.value);
      let flag = new RegExp("^[1-9]([0-9])*$").test(e.target.value);
      // console.log(flag);
      if (!flag) {
        // this.$message({
        //   showClose: true,
        //   message: "请输入正整数",
        //   type: "warning"
        // });
        this.duration = this.duration.replace("0", "8");
        return;
      }
      this.changeValue();
    },
    // 修改门禁感知天数
    changeValue() {
      console.log("天数====", this.duration);
      if (this.duration === "") {
        return;
      }
      this.initData4();
    },
    // 获取重点关注人员统计数据,图1
    initData1() {
      this.importantNumber = 0;
      this.importantArr = [];
      api.getMapChart1({projectUuid: this.activeProject}).then(res => {
        if (res.data.success) {
          console.log("获取重点关注人员===", res.data);
          this.importantArr = res.data.data;
          this.importantNumber = 0;
          for (let i = 0; i < res.data.data.length; i++) {
            this.importantNumber =
              Number(this.importantNumber) + Number(res.data.data[i].count);
          }
          if (this.importantNumber !== 0) {
            for (let j = 0; j < this.importantArr.length; j++) {
              let percentage = 0;
              percentage = parseInt(
                (Number(this.importantArr[j].count) /
                  Number(this.importantNumber)) *
                  100
              );
              console.log("percentage===", percentage);
              // debugger;
              this.importantArr[j].percentage = percentage;
              // this.importantArr[j].push(obj);
            }
          }
          console.log("总人数===", this.importantArr);
          // debugger;
          // this.addTagDialogVisible = !this.addTagDialogVisible;
          // console.log("居民标签添加成功", res.data);
          // this.getOrgTag("add");
        }
        // this.newTagName = "";
      });
    },
    // 获取门禁感知离开，图4
    initData4() {
      this.perceptionTotal = "0";
      this.perceptionList = [];
      let data1 = {
        duration: this.duration
      };
      let data2 = {
        projectUuid: this.activeProject
      };
      let data = {
        data1: data1,
        data2: data2
      };
      api
        .getMapChart4(data)
        .then(res => {
          if (res.data.success) {
            console.log("获取门禁感知离开===", res.data);
            if (res.data.data && res.data.data) {
              this.perceptionList = res.data.data.list;
              this.perceptionTotal = res.data.data.total
                ? res.data.data.total
                : "0";
            }

            // debugger;
            // this.addTagDialogVisible = !this.addTagDialogVisible;
            // console.log("居民标签添加成功", res.data);
            // this.getOrgTag("add");
          }
          // this.newTagName = "";
        });
    },
    // 获取人员类型统计数据,图2
    initData2() {
      api.getMapChart2({projectUuid: this.activeProject}).then(res => {
        if (res.data.success) {
          console.log("获取人员类型统计数据===", res.data.data);
          this.pieData[0].value =
            res.data.data.census_staff === 0 ? "" : res.data.data.census_staff;
          this.pieData[1].value =
            res.data.data.come_shanghai_staff === 0
              ? ""
              : res.data.data.come_shanghai_staff;
          this.pieData[2].value =
            res.data.data.foreign_staff === 0
              ? ""
              : res.data.data.foreign_staff;
          setTimeout(() => {
            this.startDraw();
          }, 0);
          // this.importantArr = res.data.data;
          // debugger;
          // this.addTagDialogVisible = !this.addTagDialogVisible;
          // console.log("居民标签添加成功", res.data);
          // this.getOrgTag("add");
        }
        // this.newTagName = "";
      });
    },
    // 获取人口总数统计数据,图3
    initData3() {
      this.maleTotal = [];
      this.femaleTotal = [];
      api.getMapChart3({projectUuid: this.activeProject}).then(res => {
        if (res.data.success) {
          console.log("获取人口总数统计数据===", res.data.data);
          this.maleTotal.push(
            res.data.data.male_one_to_sixteen,
            res.data.data.male_seventeen_to_forty,
            res.data.data.male_forty_to_sixty,
            res.data.data.male_sixty_to_eighty,
            res.data.data.male_eighty_plus
          );
          this.femaleTotal.push(
            res.data.data.female_one_to_sixteen,
            res.data.data.female_seventeen_to_forty,
            res.data.data.female_forty_to_sixty,
            res.data.data.female_sixty_to_eighty,
            res.data.data.female_eighty_plus
          );
          this.maleTotalNumber =
            Number(res.data.data.male_one_to_sixteen) +
            Number(res.data.data.male_seventeen_to_forty) +
            Number(res.data.data.male_forty_to_sixty) +
            Number(res.data.data.male_sixty_to_eighty) +
            Number(res.data.data.male_eighty_plus);
          this.femaleTotalNumber =
            Number(res.data.data.female_one_to_sixteen) +
            Number(res.data.data.female_seventeen_to_forty) +
            Number(res.data.data.female_forty_to_sixty) +
            Number(res.data.data.female_sixty_to_eighty) +
            Number(res.data.data.female_eighty_plus);
          this.totalPeopleNumber =
            Number(this.maleTotalNumber) + Number(this.femaleTotalNumber);
          // this.pieData[0].value = res.data.data.census_staff;
          // this.pieData[1].value = res.data.data.come_shanghai_staff;
          // this.pieData[2].value = res.data.data.foreign_staff;
          // this.importantArr = res.data.data;
          // debugger;
          // this.addTagDialogVisible = !this.addTagDialogVisible;
          // console.log("居民标签添加成功", res.data);
          // this.getOrgTag("add");
          setTimeout(() => {
            this.startDraw2();
          }, 0);
        }
        // this.newTagName = "";
      });
    },
    initData() {
      this.$ResidentManageAjax
        .getResidentTreeDataApi(this.defaultExpandedKeys)
        .then(res => {
          console.log(res.data);
          this.data = [];
          if (res.data.success && res.data.data) {
            this.data.push(res.data.data);
            this.defaultExpandedKeys.push(this.data[0].id);
            this.appendNodeOptions = [];
            this.appendNodeOptions.push(this.data);
            let checkedData = this.data[0];
            checkedData.name = checkedData.label;
            this.setLastLevelType(res.data.data.extInfo);
            this.$store.commit("SET_LEFT_MENU_Data", checkedData);
          } else {
            this.$message({
              type: "warning",
              message: "没有获取到居民基建树"
            });
          }
        });
    },
    startDraw() {
      setTimeout(() => {
        this.drawPie();
      }, 0);
    },
    startDraw2() {
      setTimeout(() => {
        this.drawPie2();
      }, 0);
    },
    drawPie() {
      var dom = document.getElementById("canvasPieNew");
      let myChart = this.$echarts.init(dom);
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          show: false
        },
        legend: {
          orient: "vertical",
          show: false,
          itemGap: 50,
          left: "right",
          top: "center",
          data: ["户籍人员", "来沪人员", "外籍人员"].reverse()
        },
        color: this.color,
        series: [
          {
            name: "人员类型",
            type: "pie",
            radius: ["40%", "80%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            // top: 10,
            // left: 100,
            label: {
              normal: {
                show: true,
                // position: "outside",
                formatter: "{d}%",
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 15
                }
              },
              // normal: {
              //   show: false,
              //   position: "center"
              // },
              show: true,
              position: "outside",
              formatter: "{d}%"
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: this.pieData
          }
        ]
      };
      myChart.setOption(option);
    },
    drawPie2() {
      var dom = document.getElementById("canvasPieNew2");
      let myChart1 = this.$echarts.init(dom);
      let barOption = {
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
            data: ["1-16岁", "17-40岁", "41-60岁", "61-80岁", "80岁以上"],
            axisLabel: {
              show: true,
              textStyle: {
                color: "#FFFFFF", // 更改坐标轴文字颜色
                fontSize: 12 // 更改坐标轴文字大小
              }
              // interval: 0,//横轴信息全部显示
              // rotate: 0,//60度角倾斜显示
              // formatter:function(val){
              //  return val.split("").join("\n");} //横轴信息文字竖直显示
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
                color: "#FFFFFF", // 更改坐标轴文字颜色
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
            name: "男",
            type: "bar",
            data: this.maleTotal,
            barWidth: "9px",
            itemStyle: {
              normal: {
                // barBorderRadius:[10, 10, 10, 10],
              }
            }
          },
          {
            name: "女",
            type: "bar",
            stack: "广告",
            data: this.femaleTotal,
            barWidth: "9px"
          }
        ]
      };
      myChart1.setOption(barOption);
    }
  },
  watch: {
    searchText(val) {
      this.$refs[this.treeName].filter(this.searchText);
    },
    Treeparent(val) {
      // console.log("=--==========================================");
      // console.log(val);
    },
    activeProjectId(val) {
      if (val) {
        this.activeProject = val;
        this.initData1();
        this.initData2();
        this.initData3();
        this.initData4();
      }
    }
  }
};
</script>
<style>
.leftmenu .echartsWrap {
  position: relative;
}
.leftmenu .echartsWrap .echartsDescrible {
  position: absolute;
  left: 2px;
  bottom: 43px;
  opacity: 0.8;
  font-family: PingFangSC-Regular;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-align: justify;
}
.leftmenu .specialCharts {
  display: flex;
  flex-direction: column;
}
.leftmenu .specialCharts .progressWrap {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.leftmenu .specialCharts .title {
  margin-bottom: 0;
}
.leftmenu .el-progress {
  width: 250px;
}
.leftmenu .progressText {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #dddddd;
}
.leftmenu .el-progress .el-progress__text {
  display: none;
}
.leftmenu .el-progress-bar {
  width: 230px;
  height: 10px;
}
.leftmenu .el-progress .el-progress-bar__outer {
  width: 230px;
  height: 10px;
  /*  background:
  opacity: 0.1;*/
  background: #25d298;
  background: rgba(37, 210, 152, 0.1);
  border-radius: 5px;
}
.leftmenu #canvasPieNew {
  width: 100%;
  min-height: 220px;
}
.leftmenu #canvasPieNew2 {
  width: 100%;
  /*min-height: 220px;*/
 /* flex: 1;*/
  height: 450px;
}
.leftmenu #echartsWrap {
  width: 100%;
  /*flex: 1;*/
  height: 550px;
  display: flex;
  flex-direction: column;
  padding-bottom: 45px;
  box-sizing: border-box;
}
.leftmenu .echartsDetail {
  width: 100%;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 40px;
}
.leftmenu .echartsDetail .singleDetail {
  width: 100px;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.leftmenu .echartsDetail .singleDetail .squareIcon {
  width: 10px;
  height: 10px;
  margin-right: 8px;
}
.leftmenu .echartsDetail .singleDetail .text {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  text-align: justify;
}
.leftmenu .el-input__inner {
  padding: 0 10px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
}
.leftmenu .singleCharts1 .listWrap .singleList:nth-child(even) div {
  background: rgba(255, 255, 255, 0.05);
}
.leftmenu .singleCharts1 {
  /* padding: 0 20px;*/
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.leftmenu {
  width: 900px;
  height: 100%;
  padding-top: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // padding-bottom: 13px;
  // box-sizing: border-box;\
  overflow-x: hidden;
  overflow-y: auto;
  .topCharts {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 24px;
    .singleCharts {
      width: 420px;
      height: 400px;
      opacity: 0.8;
      background: rgba(67, 251, 239, 0.07);
      border: 1px solid rgba(37, 210, 152, 0.3);
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      position: relative;
      .title {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 23px;
        margin-bottom: 30px;
        .icon {
          width: 4px;
          height: 16px;
          opacity: 0.79;
          background-image: linear-gradient(-180deg, #4cebc9 0%, #25d298 100%);
          border-radius: 1px;
          border-radius: 1px;
          margin-right: 9px;
        }
        .text {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #25d298;
          text-align: justify;
        }
      }
      .progressWrap {
        width: 100%;
        .singleProgress {
          width: 100%;
          height: 44px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          padding-left: 30px;
          box-sizing: border-box;
          // margin-bottom: 25px;
          .progressTitle {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #dddddd;
            text-align: justify;
            margin-right: 12px;
            width: 70px;
            text-align: left;
          }
        }
        .el-progress__text {
          display: none;
        }
      }
    }
    .singleCharts:before {
      content: "";
      width: 100%;
      height: 100%;
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
  }
  .bottomCharts {
    width: 100%;
    // flex: 1;
    height: 550px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    // padding-bottom: 26px;
    // box-sizing: border-box;
    .singleCharts {
      width: 420px;
      // height: 550px;
      height: 100%;
      margin-bottom: 26px;
      opacity: 0.8;
      background: rgba(67, 251, 239, 0.07);
      border: 1px solid rgba(37, 210, 152, 0.3);
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      position: relative;
      display: flex;
      flex-direction: column;
      .title {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 23px;
        margin-bottom: 30px;
        .icon {
          width: 4px;
          height: 16px;
          opacity: 0.79;
          background-image: linear-gradient(-180deg, #4cebc9 0%, #25d298 100%);
          border-radius: 1px;
          border-radius: 1px;
          margin-right: 9px;
        }
        .text {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #25d298;
          text-align: justify;
        }
      }
      .statisticsWrap {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        .singleStatistics {
          width: auto;
          height: 34px;
          display: flex;
          flex-direction: row;
          .imgWrap {
            .img1 {
              width: 26px;
              margin-right: 12.2px;
            }
            .img2 {
              width: 15.5px;
              margin-right: 11.6px;
            }
            .img3 {
              width: 17px;
              margin-right: 11.1px;
            }
          }
          .textWrap {
            .name {
              opacity: 0.8;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #ffffff;
              text-align: justify;
            }
            .number {
              font-family: PingFangSC-Medium;
              font-size: 20px;
              color: #ffffff;
              text-align: justify;
            }
          }
        }
      }
      .title1 {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 23px;
        .left {
          width: 150px;
          height: 60px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          .icon {
            width: 4px;
            height: 16px;
            opacity: 0.79;
            background-image: linear-gradient(
              -180deg,
              #4cebc9 0%,
              #25d298 100%
            );
            border-radius: 1px;
            border-radius: 1px;
            margin-right: 9px;
          }
          .text {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #25d298;
            text-align: justify;
          }
        }
        .right {
          width: 250px;
          height: 60px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #aaaaaa;
          text-align: justify;
          input {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }
      .title2 {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #dddddd;
        text-align: justify;
        .name {
          width: 82px;
          height: 40px;
          background: rgba(37, 210, 152, 0.15);
          border-radius: 2px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        .address {
          width: 152px;
          height: 40px;
          background: rgba(37, 210, 152, 0.15);
          border-radius: 2px;
          border-width: 0 1px;
          border-style: solid;
          border-color: #000000;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        .event {
          flex: 1;
          background: rgba(37, 210, 152, 0.15);
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .singleCharts1 {
      width: 420px;
      // height: 100%;
      // overflow-x: hidden;
      // overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .titleWrap {
        width: 420px;
        height: 100px;
      }
      .listWrap {
        width: 100%;
        // flex: 1;
        height: 450px;
        .singleList {
          width: 100%;
          height: 40px;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #dddddd;
          text-align: justify;
          .name {
            width: 82px;
            height: 40px;
            border-radius: 2px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
          .address {
            width: 152px;
            height: 40px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
          .event {
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .singleCharts:before {
      content: "";
      width: 100%;
      height: 100%;
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
  }
}
</style>
