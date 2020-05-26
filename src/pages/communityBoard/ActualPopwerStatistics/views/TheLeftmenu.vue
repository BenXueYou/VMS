<template>
  <div id="ActualPopwerMenu"
       class="ActualPopwerMenu">
      <div class="echartsWrap">
          <div class="echartsDescrible">单位：个</div>
          <div id="canvasPiePower"></div>
        </div>
      <div class='contentWrap' id="contentWrap">
        <div class="powerListWrap" id="powerListWrap" v-loading="mainListLoading1" element-loading-background="rgba(0, 0, 0, 0.8)">
           <div class="header">
             <div class="icon"></div>
             <div class="text">{{$common.getEnumItemName("strength", currentType)}}（{{pageInfo.total}}）</div>
           </div>
           <div class="inforWrap">
             <div class="singlePowerCell" id="singlePowerCell" v-for="(o, index) in tableData" :key="index">
               <div class="mainPowerImg" id="mainPowerImg1" style="overflow: hidden;">
                 <img id="mainPowerImg" :src="tableData.length>index?(tableData[tableData.length-index-1].photoUri?WIamgeurl + tableData[tableData.length-index-1].photoUri:require('@/assets/images/user.png')):require('@/assets/images/user.png')"/>
               </div>
               <div class="textWrap" id="textWrap">
                 <div class="singleText">姓名：{{tableData.length>index?tableData[tableData.length-index-1].name:""}}</div>
                 <div class="singleText"  @mouseover="mymouseover"
                         @mouseout="mymouseout"
                         @mousemove="mymousemove">证件号码：{{tableData.length>index?tableData[tableData.length-index-1].identityNumber:""}}</div>
                 <div class="singleText">电话：{{tableData.length>index?tableData[tableData.length-index-1].phoneNumber:""}}</div>
                 <div class="singleText" @mouseover="mymouseover"
                         @mouseout="mymouseout"
                         @mousemove="mymousemove">地址：{{tableData.length>index?tableData[tableData.length-index-1].address:""}}</div>
                 <div class="singleText">公司：{{tableData.length>index?tableData[tableData.length-index-1].company:""}}</div>
                 <div class="singleText">出现次数：{{tableData.length>index?tableData[tableData.length-index-1].appearNumber:""}}次</div>
               </div>
             </div>
           </div>
        </div>
        <div class="PopwerFooter">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :page-size="pageInfo.pageSize"
                         :current-page="pageInfo.currentPage"
                         @current-change='handleCurrentChange'
                         :total="pageInfo.total">
          </el-pagination>
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
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
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
      mainListLoading1: false,
      pageInfo: {
        total: 0,
        pageSize: 8,
        currentPage: 1
      },
      tableData: [],
      powerTotal: [],
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
      optionPower: {},
      labelTotal: [],
      labelTranslatTotal: [],
      currentType: "",
      listLabelName: "",
      bar: "",
      startTime: "",
      endTime: "",
      projectId: ""
    };
  },
  mounted() {
    // setTimeout(() => {
    //   this.initImageWidth();
    // }, 0);
    this.transSelectDate();
    this.data = [];
    this.data2 = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    // setTimeout(() => {
    //   this.getOrgTree(true);
    // }, 0);
    this.initData1();
    // this.initData2();
    // this.initData1();
    setTimeout(() => {
      this.currentType = this.labelTotal[0];
      if (this.currentType) {
        this.getPowerList();
      }
    }, 100);
    var dom = document.getElementById("canvasPiePower");
    this.bar = this.$echarts.init(dom);
    this.bar.setOption(this.optionPower);
    // this.line = echarts.init(this.$refs.line)
    // this.line.setOption(this.lineOption)
    /* 窗口变化时自适应 步骤一:监听窗口变化 */
    window.addEventListener('resize', this.resizeHandle2);
    window.addEventListener('resize', this.resizeHandle);
  },
  destroyed () {
    /* 窗口变化时自适应 步骤三 组件被注销时，缩放函数是匿名函数，且仍然在事件监听列表中，
    因此匿名函数和匿名函数中用到的外部变量在组件注销后均不会被清理。
     所以要手动清理 */
    window.removeEventListener('resize', this.resizeHandle2);
    window.removeEventListener('resize', this.resizeHandle);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandle2);
    window.removeEventListener('resize', this.resizeHandle);
  },
  activated() {
    // setTimeout(() => {
    //   this.initImageWidth();
    // }, 0);
    // this.initData1();
    // setTimeout(() => {
    //   this.currentType = this.labelTotal[0];
    //   // this.listLabelName = this.$common.getEnumItemName("strength", this.currentType);
    //   // this.$common.getEnumItemName("strength", res.data.data[i].staffStrength);
    //   if (this.currentType) {
    //     this.getPowerList();
    //   }
    // }, 100);
  },
  computed: {
    ...mapState({
      tagUuid: state => {
        return state.equipment.tagUuid;
      }
    })
  },
  methods: {
    transSelectDate() {
      // let day3 = new Date();
      var now = new Date(); // 当前日期
      var nowday3OfWeek = now.getDay(); // 今天本周的第几天
      var nowday3 = now.getDate(); // 当前日
      var nowMonth = now.getMonth(); // 当前月
      // var nowYear = now.getYear(); // 当前年
      let day31 = nowday3OfWeek || 7;
      let weektime1 = this.formatDate(new Date(now.getFullYear(), nowMonth, nowday3 + 1 - day31));
      let weektime2 = this.formatDate(new Date(now.getFullYear(), nowMonth, nowday3 + 7 - day31));
      this.startTime = weektime1 + " " + "00:00:00";
      this.endTime = weektime2 + " " + "23:59:59";
      console.log("weektime===", weektime2);
    },
    formatDate: function(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday3 = date.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday3 < 10) {
        myweekday3 = "0" + myweekday3;
      }
      return (myyear + "-" + mymonth + "-" + myweekday3);
    },
    resizeHandle2() {
      // this.initImageWidth();
    },
    resizeHandle () {
      this.bar.resize();
      // this.initImageWidth();
      console.log("resizeData==", this.isLastAdress);
      // this.initImageWidth()l
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
    resizeHandle1(params) {
      console.log("单击了" + params.value + "x轴标签");
    },
    initImageWidth() {
      let length1 =
      document.getElementById("mainPowerImg").offsetWidth;
      let lengthAll =
      document.getElementById("singlePowerCell").offsetWidth;
      let elems = document.querySelectorAll("#mainPowerImg");
      for (let index = 0; index < elems.length; index++) {
        elems[index].style.width = length1 + "px";
        elems[index].style.height = length1 + "px";
        console.log("length1==", (Number(length1) + 60) + "px");
      }
      let elems1 = document.querySelectorAll("#textWrap");
      for (let index1 = 0; index1 < elems1.length; index1++) {
        // elems[index].style.width = length1 + "px";
        elems1[index1].style.width = lengthAll - length1 + "px";
        console.log("length1==", (Number(length1) + 60) + "px");
      }
      let elems2 = document.querySelectorAll("#contentWrap");
      for (let index2 = 0; index2 < elems2.length; index2++) {
        // elems[index].style.width = length1 + "px";
        elems2[index2].style.height = (Number(length1) * 3 + 100) + "px";
        console.log("length1==", (Number(length1) + 60) + "px");
      }
      // document.getElementById("contentWrap")[0].style.height = "500px";
      // console.log("length1==", (Number(length1)*2+130)+"px");
      this.resizeHandle();
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getPowerList();
    },
    // 修改门禁感知天数
    changeValue() {
      console.log("天数====", this.duration);
      if (this.duration === "") {
        return;
      }
      this.initData4();
    },
    // 获取实有力量统计数据
    initData1() {
      this.powerTotal = [];
      this.labelTotal = [];
      this.labelTranslatTotal = [];
      console.log("projectId===", this.projectId);
      api
        .getPowerMapChart({
          projectUuid: this.activeProject
        })
        .then(res => {
          if (res.data.success) {
            console.log("实有力量统计====", res.data.data);
            if (res.data && res.data.data) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.powerTotal.push(res.data.data[i].count);
                this.labelTotal.push(res.data.data[i].staffStrength);
                this.labelTranslatTotal.push(this.$common.getEnumItemName("strength", res.data.data[i].staffStrength));
              }
            }
            this.startPowerDraw();
          }
        })
        .catch(err => {
          this.mainListLoading1 = false;
          console.log("请求错误：" + err);
        });
    },
    // 获取实有力量列表
    getPowerList() {
      this.mainListLoading1 = true;
      // this.pageInfo.total = 0;
      this.tableData = [];
      // this.listLabelName = "";
      let dada1 = {
        powerType: this.currentType,
        page: this.pageInfo.currentPage,
        limit: this.pageInfo.pageSize,
        startTime: this.startTime,
        endTime: this.endTime
      };
      let dada2 = {
        projectUuid: this.activeProject
      };
      let parms = {
        dada1: dada1,
        dada2: dada2
      };
      api
        .getPowerList(parms)
        .then(res => {
          if (res.data.success) {
            console.log("获取实有力量列表===", res.data);
            this.pageInfo.total = res.data.data.total;
            this.tableData = res.data.data.list;
            setTimeout(() => {
              this.initImageWidth();
            }, 0);
            // this.pieData[0].value = res.data.data.census_staff;
            // this.pieData[1].value = res.data.data.come_shanghai_staff;
            // this.pieData[2].value = res.data.data.foreign_staff;
          }
          this.mainListLoading1 = false;
        })
        .catch(err => {
          this.mainListLoading1 = false;
          console.log("请求错误：" + err);
        });
    },
    startPowerDraw() {
      setTimeout(() => {
        this.drawPowerPie();
      }, 0);
    },
    drawPowerPie() {
      var domPower = document.getElementById("canvasPiePower");
      let myChartPower = this.$echarts.init(domPower);
      this.optionPower = {
        color: ['#26D39D', '#E7A918'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //     data: ['直接访问','视频广告']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.labelTranslatTotal,
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(255,255,255,0.8)', // 更改坐标轴文字颜色
                fontSize: 14 // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)' // 更改坐标轴颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(221,221,221,0.8)', // 更改坐标轴文字颜色
                fontSize: 14 // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)' // 更改坐标轴颜色
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(255,255,255,0.1)'],
                width: 1,
                type: 'solid'
              }
            }
          }
        ],
        series: [
          {
            name: '力量',
            type: 'bar',
            data: this.powerTotal,
            barWidth: '40px',
            itemStyle: {
              normal: {
                //  color: new echarts.graphic.LinearGradient(
                //     0, 0, 0, 1,
                //     [
                //         {offset: 0, color: '#06B5D7'},                   //柱图渐变色
                //         {offset: 0.5, color: '#44C0C1'},                 //柱图渐变色
                //         {offset: 1, color: '#71C8B1'},                   //柱图渐变色
                //     ]
                // )
              }
            }
          }
        ]
      };
      myChartPower.setOption(this.optionPower);
      let that = this;
      myChartPower.on('click', function (params) { // 点击柱状图
        that.listLabelName = params.name;
        console.log("params===", params);
        for (let i = 0; i < that.labelTranslatTotal.length; i++) {
          if (that.labelTranslatTotal[i] === params.name) {
            that.currentType = that.labelTotal[i];
          }
        }
        console.log("currentType===", that.currentType);
        if (that.currentType) {
          that.pageInfo.currentPage = 1;
          that.getPowerList();
        }
      });
    },
  },
  watch: {
    searchText(val) {
      this.$refs[this.treeName].filter(this.searchText);
    },
    Treeparent(val) {
      // console.log("=--==========================================");
      // console.log(val);
    },
    activeProject(val) {
      if (val) {
        // this.projectId = val;
        console.log("val===", val);
        this.initData1();
        this.tableData = [];
        this.pageInfo.total = 0;
        setTimeout(() => {
          this.currentType = this.labelTotal[0];
          if (this.currentType) {
            this.getPowerList();
          }
        }, 100);
      }
    }
  }
};
</script>
<style>
  .ActualPopwerMenu {
    height: 100%;
    width: 100%;
    padding: 0 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
/*    padding-bottom: 10px;*/
    box-sizing: border-box;
  }
  .ActualPopwerMenu .singleText {
/*    width: 100%;*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ActualPopwerMenu .contentWrap {
    width: 100%;
    height: 580px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    justify-content: space-between;
  }
  .ActualPopwerMenu .echartsWrap {
    width: 100%;
    height: 310px;
/*    flex: 1;*/
    border-bottom: 1px dashed rgba(255,255,255,0.2);
    position: relative;
  }
  .ActualPopwerMenu .echartsWrap #canvasPiePower {
    width: 100%;
   /* min-height: 290px;*/
    height: 100%;
  }
  .ActualPopwerMenu .echartsWrap .echartsDescrible {
    position: absolute;
    left: 13px;
    /*top: 273px;*/
    bottom: 0;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #DDDDDD;
    letter-spacing: 0;
    text-align: justify;
  }
  .ActualPopwerMenu .powerListWrap {
    width: 100%;
   /* height: 100%;*/
  }
  .ActualPopwerMenu .powerListWrap .header {
    width: 100%;
    height: 58px;
    display: flex;
    flex-direction: row;
    /*: center;*/
    align-items: flex-end;
  }
  .ActualPopwerMenu .powerListWrap .header .icon {
    width: 4px;
    height: 18px;
    background: #26D39D;
    border-radius: 1px;
    margin-right: 11px;
  }
  .ActualPopwerMenu .powerListWrap .header .text {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: justify;
  }
  .ActualPopwerMenu .powerListWrap .inforWrap {
    width: 100%;
   /* padding-top: 20px;*/
    height: 410px;
  }
  .ActualPopwerMenu .powerListWrap .inforWrap .singlePowerCell {
    width: 23.3%;
    /*height: 200px;*/
    background: rgba(0, 0, 0, 0.1);
 /*   border: 1px solid rgba(255, 255, 255, 0.1);*/
/*    border-radius: 2px;*/
 /*   padding: 8px 8px 0 8px;*/
    box-sizing: border-box;
    position: relative;
    float: left;
    margin-right: 2.25%;
  /*  margin-bottom: 48px;*/
    overflow: hidden;
    /*background: rgba(255,255,255,0.5);*/
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  /*  background: #DDDDDD;*/
    margin-top: 32px;
  }
  .ActualPopwerMenu .powerListWrap .inforWrap .singlePowerCell:nth-child(4n) {
    margin-right: 0;
  }
  .ActualPopwerMenu .powerListWrap .singlePowerCell .mainPowerImg {
    width: 43.8%;
/*    height: 120px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ActualPopwerMenu .powerListWrap .singlePowerCell .mainPowerImg img {
   /* width: 100%;*/
  }
  .ActualPopwerMenu .powerListWrap .singlePowerCell .textWrap {
    width: 56.2%;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #DDDDDD;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 5.5%;
    box-sizing: border-box;
   /* margin-left: 5.5%;*/
  }
  .ActualPopwerMenu .powerListWrap .singlePowerCell .textWrap div {
    width: 100%;
    text-align: left;
    line-height: 20px;
  }
  .ActualPopwerMenu .PopwerFooter {
   /* margin-top: 30px;*/
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
</style>
