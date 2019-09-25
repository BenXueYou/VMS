<template>
	<div class="IGMRecord">
		<div class="IGMRecord-header">
			<div class="header-line">
				<el-col :span="5" class="topTitleTxt" style="text-align:left;">
					抓拍设备：
					<elPopverTree
						:channelInfoList="DeviceTreeList"
						:elPopoverClass="CompareRecordPopoverClass2"
						@transferCheckedChannel="transferCheckedChannel"
						@show="popverShow(2)"
						@hide="popverHidden(2)"
					></elPopverTree>
				</el-col>

				<el-col :span="4" class="topTitleTxt" style="text-align:left;">
					人脸库：
					<el-popover
						popper-class="CRTaskPopoverClass2"
						placement="bottom"
						@show="popverShow(3)"
						@hide="popverHidden(3)"
						trigger="click"
					>
						<el-checkbox
							:indeterminate="isIndeterminate"
							v-model="checkLibAll"
							@change="handleLibCheckAllChange"
						>全选</el-checkbox>
						<el-tree
							ref="tree3"
							:data="faceDBList"
							show-checkbox
							node-key="libraryuuid"
							:props="faceDBDefaultProps"
							default-expand-all
							@check="checkFaceDBChanges"
						></el-tree>
						<el-input
							slot="reference"
							style="width:60%"
							:clearable="true"
							v-model="checkFaceDBNameString"
							@clear="clearAction(3)"
							placeholder="全部"
						></el-input>
					</el-popover>
				</el-col>

				<el-col :span="4" class="topTitleTxt" style="text-align:left;">
					<span class="header-line-label">相似度：</span>
					<el-input v-model="Thread" class="header-line-input"></el-input>
				</el-col>

				<el-col :span="11" class="topTitleTxt" style="text-align:left;">
					<span class="header-line-label">时段：</span>
					<el-date-picker
						class="header-line-time"
						v-model="startTime"
						@change="timeChange"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="header-line-time-label">至</span>
					<el-date-picker
						class="header-line-time"
						v-model="endTime"
						@change="timeChange"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<el-button class="search" @click="queryBtnAct" type="primary">查询</el-button>
				</el-col>
			</div>

			<div class="header-line">
				<el-col :span="5" class="topTitleTxt" style="text-align:left;">
					<span class="header-line-label">抓拍总数：</span>
					<el-select
						v-model="shootFrequencyStatus"
						filterable
						@visible-change="selectvisiblechange"
						@change="selectChange"
						collapse-tags
						placeholder="全部"
						class="header-line-input IGM_select_input"
					>
						<el-option
							v-for="item in shootFrequency"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
					<el-input v-model="shootFrequencyValue" class="header-line-input IGM_input"></el-input>
					<span class="header-line-label">次</span>
				</el-col>

				<el-col :span="4" class="topTitleTxt" style="text-align:left;">
					<span class="header-line-label">抓拍设备不少于：</span>
					<el-input v-model="minShootEquipNum" class="header-line-input IGM_input"></el-input>
					<span class="header-line-label">个</span>
				</el-col>
				<el-col :span="4" class="topTitleTxt" style="text-align:left;">
					<span class="header-line-label">图片质量：</span>
					<AlTree
						:treeDataList="qualityOptions"
						:alPopoverClass="IMRPicPopoverClass"
						:defaultProps="defaultQualityProps"
						nodeKey="value"
						@transferAct="transferAct"
					></AlTree>
				</el-col>
				<el-col :span="5" class="topTitleTxt" style="text-align:left;">
					<span class="header-line-label">抓拍时间间隔：</span>
					<el-input v-model="shootTimeSpace" class="header-line-input IGM_input"></el-input>
					<span class="header-line-label">秒</span>
				</el-col>

				<el-col :span="6" class="topTitleTxt" style="text-align:left;">
					<el-button class="search" @click="resetBtnAct" type="primary">重置</el-button>
				</el-col>
			</div>
		</div>

		<div class="IGMRecord-table">
			<div class="switchBtn">
				<div class="imagebtn" @click="changeIndex(0)" :class="{'active':showindex===0}">图片</div>
				<div class="imagebtn" @click="changeIndex(1)" :class="{'active':showindex===1}">列表</div>
			</div>

			<component
				:is="['IGMImageTable','IGMTable'][showindex]"
				:pageSize="pageSize"
				:pageNow="pageNow"
				:pageCount="pageCount"
				:tableData="tableData"
				:isloading="isloading"
				:startTime="startTime"
				:endTime="endTime"
				@lookface="lookface"
				@pagechange="pagechange"
			></component>

		</div>
	</div>
</template>

<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import IGMTable from "@/pages/faceModule/views/page/search/IntelligentModelRecord/basic/IGMTable.vue";
import IGMImageTable from "@/pages/faceModule/views/page/search/IntelligentModelRecord/basic/IGMImageTable.vue";
import TheAnalysisDialog from "@/pages/faceModule/views/page/search/IntelligentModelRecord/basic/IGMDialog.vue";

import * as api from "@/pages/faceModule/api.js";
import AlTree from "@/pages/faceModule/components/AlElTree.vue";

export default {
  name: "IGMRecord",
  components: {
    IGMTable,
    IGMImageTable,
    TheAnalysisDialog,
    elPopverTree,
    AlTree
  },
  data() {
    return {
      isIndeterminate: false,
      checkLibAll: true,
      shootTimeSpace: "1",
      Thread: "80",
      CRTaskPopoverClass2: "CRTaskPopoverClass2",
      IMRPicPopoverClass: "IMRPicPopoverClass",
      CompareRecordPopoverClass2: "CompareRecordPopoverClass2",
      faceDBDefaultProps: {
        label: "libraryname"
      },
      defaultQualityProps: {
        label: "label"
      },
      alarminfoid: "",
      startTime: "",
      endTime: "",
      devicearr: [],
      devicename: [],
      alarmtypearr: [],
      alarmtype: [],
      belongtoarr: [],
      belongto: [],
      shootFrequencyStatus: ">=",
      shootFrequencyValue: "2",
      pageSize: 30,
      pageNow: 1,
      pageCount: 30,
      imagePageSize: 12,
      imagePageNow: 1,
      tableData: [],
      showindex: 0,
      dataArr: [], // 分页好的二维数组
      dataSource: [], // 未分页的数据源
      shootFrequency: [
        {
          label: ">=",
          value: ">="
        },
        {
          label: "<=",
          value: "<="
        }
      ],
      username: "",
      minShootEquipNum: "1",
      isloading: false,
      IGMRecordvisible: false,
      detail: {
        zhuapaiurl: "",
        zhuapaiaddress: "",
        zhuapaitime: "",
        tezheng: "",

        jindu: 80,
        kuurl: "",
        belong: "",
        username: "",
        sex: "",
        huji: "",
        minzu: "",
        bir: "",
        cardtype: "",
        idcard: ""
      },
      detail2: {},
      defaultHeader: require("@/assets/user.png"),
      facearr: [],
      idtypetranslatearr: [],

      DeviceTreeList: [],
      checkedChannelsUuidList: [],
      faceDBList: [],
      checkedFaceUuidList: [],
      checkedFaceLibObj: [],
      checkFaceDBNameString: "全部人脸库",
      qualityOptions: [
        {
          label: "高",
          value: "HIGH"
        },
        {
          label: "中",
          value: "NORMAL"
        },
        {
          label: "低",
          value: "LOW"
        }
      ],
      qualityOption: []
    };
  },
  fiters: {},
  activated() {
    const _this = this;
    this.getFaceListData();
    // 获取布控任务
    api.getbukongrenwu().then(res => {
      console.log(res);
      var num = [];
      if (res.data.data) {
        var diaabled = res.data.data.disable;
        var enableed = res.data.data.enable;
        num = num.concat(diaabled);
        num = num.concat(enableed);
      }
      _this.alarmtypearr = num;

      var test = [];
      for (var i = 0; i < num.length; i++) {
        var tempTask = num[i];
        test.push(tempTask.taskuuid);
      }

      this.getFaceLibsAndDeviceList(test);
    });
  },
  mounted() {
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
  },
  watch: {
    checkedFaceUuidList: function(newVal, oldVal) {
      this.checkLibAll = newVal.length === this.faceDBList.length;
    },
    showindex: function(newVal, oldVal) {
      if (newVal === 0) {
        this.pageSize = 30;
      } else {
        this.pageSize = 13;
      }
    }
  },
  methods: {
    // 获取人脸库的数据
    getFaceListData() {
      api.querystafflibrarylist().then(res => {
        if (res.data.result === 0) {
          var list = res.data.data;
          this.faceDBList = list;
          this.checkedFaceUuidList = [];
          for (var i = 0; i < this.faceDBList.length; i++) {
            var temp = this.faceDBList[i];
            this.checkedFaceUuidList.push(temp.libraryuuid);
          }
          this.$refs.tree3.setCheckedKeys(this.checkedFaceUuidList);
        } else {
          this.$message({
            message: "没有获取到相关人脸对比库",
            type: "warning"
          });
        }
      });
    },

    // 查询接口
    queryBtnAct() {
      console.log("设备：", this.checkedChannelsUuidList);
      console.log("对比库：", this.checkedFaceUuidList);

      console.log("阈值:", this.Thread);
      console.log("时段：", this.startTime, "-", this.endTime);
      console.log(
        "抓拍总数：",
        this.shootFrequencyStatus,
        "==",
        this.shootFrequencyValue
      );
      console.log("最少抓拍设备数：", this.minShootEquipNum);
      console.log("图片质量：", this.qualityOption);
      console.log("抓拍时间间隔：", this.shootTimeSpace);

      if (!this.startTime) {
        this.startTime = this.$common.getStartTime();
      }
      if (!this.endTime) {
        this.endTime = this.$common.getCurrentTime();
      }

      this.requestData();
    },
    // 重置
    resetBtnAct() {
      this.checkedChannelsUuidList = [];
      this.checkedFaceUuidList = [];
      this.Thread = "80";
      this.startTime = this.$common.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.shootFrequencyValue = "2";
      this.shootFrequencyStatus = ">=";
      this.minShootEquipNum = "1";
      this.qualityOption = ["HIGH", "NORMAL"];
      this.shootFrequency = "1";

      console.log("设备：", this.checkedChannelsUuidList);
      console.log("对比库：", this.checkedFaceUuidList);
      console.log("阈值:", this.Thread);
      console.log("时段：", this.startTime, "-", this.endTime);
      console.log(
        "抓拍总数：",
        this.shootFrequencyStatus,
        "==",
        this.shootFrequencyValue
      );
      console.log("最少抓拍设备数：", this.minShootEquipNum);
      console.log("图片质量：", this.qualityOption);
      console.log("抓拍时间间隔：", this.shootTimeSpace);
    },
    // http获取数据
    requestData() {
      var data = {
        channelUuids: this.checkedChannelsUuidList,
        endTime: this.endTime,
        libraryUuids: this.checkedFaceUuidList,
        qualitys: this.qualityOption,
        startTime: this.startTime,
        storInterVal: parseInt(this.shootTimeSpace),
        stors: parseInt(this.shootFrequencyValue),
        storsRule: this.shootFrequencyStatus,
        threshold: parseInt(this.Thread),
        minStorDevs: parseInt(this.minShootEquipNum)
      };

      this.isloading = true;

      setTimeout(() => {
        this.isloading = false;
      }, 60000);
      api.getRecordModelAnalysis(data).then(res => {
        this.isloading = false;
        var data = res.data.data;
        this.dataSource = data;
        this.dataArr = this.$common.getSubArrayFromArray(data, this.pageSize);
        this.tableData = this.dataArr[this.pageNow - 1];
        this.pageCount = this.dataSource.length;
      });
    },

    // 全选回调
    transferAct(arr) {
      console.log(arr);
    },

    handleLibCheckAllChange(val) {
      this.checkedFaceUuidList = [];
      if (val) {
        this.checkedFaceLibObj = this.faceDBList;
        for (var i = 0; i < this.faceDBList.length; i++) {
          var temp = this.faceDBList[i];
          this.checkedFaceUuidList.push(temp.libraryuuid);
        }
      } else {
        this.checkedFaceLibObj = [];
      }
      console.log("***************");
      console.log(this.checkedFaceUuidList);
      this.$refs.tree3.setCheckedKeys(this.checkedFaceUuidList);
      this.isIndeterminate = false;
    },

    // 清除按钮
    clearAction(e) {
      console.log("清除----");
      if (e === 1) {
      } else {
        this.checkFaceDBNameString = "";
        this.checkedFaceUuidList = [];
        this.checkedFaceLibObj = [];
        this.checkLibAll = true;
      }
    },
    transferCheckedChannel(checkedChannel) {
      console.log("+++++++++++");
      console.log(checkedChannel);
      this.checkedChannelObj = checkedChannel;
      this.checkedChannelsUuidList = [];
      // 设备树
      if (this.checkedChannelObj && this.checkedChannelObj.length) {
        for (var i = 0; i < this.checkedChannelObj.length; i++) {
          var item = this.checkedChannelObj[i];
          this.checkedChannelsUuidList.push(item.id);
        }
      } else {
        this.checkNameString = "全部设备";
      }
    },
    // 勾选人脸库
    checkFaceDBChanges(data, node) {
      this.checkedFaceUuidList = node.checkedKeys;
      this.checkedFaceLibObj = node.checkedNodes;
      this.$refs.tree3.setCheckedKeys(this.checkedFaceUuidList);
    },
    getFaceLibsAndDeviceList(taskuuidList) {
      this.$store
        .dispatch("getFaceLibsAndDeviceList", taskuuidList)
        .then(res => {
          console.log(res);
          if (res.result === 0 && res.data) {
            var arr = [];
            arr.push(res.data.vcDeviceTreeDTO);
            this.DeviceTreeList = JSON.parse(JSON.stringify(arr));

            this.queryBtnAct();
          } else {
            this.$message({
              message: "没有查找到相关设备",
              type: "warning"
            });
          }
        });
    },
    // 弹窗消失的回调
    popverHidden(e) {
      if (e === "3") {
        this.checkFaceDBNameString = "";
        for (var i = 0; i < this.checkedFaceLibObj.length; i++) {
          this.checkFaceDBNameString += this.checkedFaceLibObj[i].libraryname;
          if (i === this.checkedFaceLibObj.length - 1) {
            return;
          }
          this.checkFaceDBNameString += ",";
        }
      }
    },
    // 弹窗展开的回调
    popverShow(e) {},
    getidName(val) {
      var str = val;
      for (var i = 0, len = this.idtypetranslatearr.length; i < len; i++) {
        if (this.idtypetranslatearr[i].typestr === val) {
          str = this.idtypetranslatearr[i].typename;
        }
      }
      return str;
    },

    lookface(detail) {},
    getAfterFanyi() {
      this.init();
    },
    statusChange(val) {
      var str = val;
      for (var i = 0; i < this.shootFrequency.length; i++) {
        if (this.shootFrequency[i].value === val) {
          str = this.shootFrequency[i].label;
          break;
        }
      }
      return str;
    },
    changeIndex(index) {
      this.showindex = index;
      if (index === 0) {
        this.pageSize = 30;
      } else {
        this.pageSize = 13;
      }
      // this.requestData();
      this.pageNow = 1;
      this.tableData = [];
      this.dataArr = this.$common.getSubArrayFromArray(
        this.dataSource,
        this.pageSize
      );
      this.tableData = this.dataArr[this.pageNow - 1];
      this.pageCount = this.dataSource.length;
    },

    init() {
      //
      var _w =
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth;
      var _h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;

      this.pageSize = Math.floor((_h - 410) / 43);
      console.log(_w);
    },

    search() {},
    pagechange(index) {
      this.pageNow = index;
      // 下一页
      // this.queryBtnAct();
      this.tableData = this.dataArr[this.pageNow - 1];
    },
    selectvisiblechange() {},

    selectChange() {
      console.log("改变了");
      console.log(this.devicename);
      console.log(this.status);
      console.log(this.belongto);
      console.log(this.alarmtype);
    },
    timeChange() {
      if (this.startTime && this.endTime) {
        if (new Date(this.startTime) > new Date(this.endTime)) {
          var t = this.startTime;
          this.startTime = this.endTime;
          this.endTime = t;
        }
      }
    },
    mock() {
      this.devicearr = [
        {
          label: "全部",
          value: ""
        },
        {
          label: "设备1",
          value: "1"
        },
        {
          label: "设备2",
          value: "2"
        }
      ];
      this.alarmtypearr = [
        {
          label: "全部",
          value: ""
        },
        {
          label: "报警类型1",
          value: "1"
        },
        {
          label: "报警类型2",
          value: "2"
        }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>

<style>
.IGMRecord .IGM_select_input {
	width: 80px !important;
}

.IGMRecord .el-input--prefix .el-input__inner {
	padding-left: 15px;
}

.IGMRecord .IGM_input.el-input,
.IGM_input .el-input__inner {
	width: 60px !important;
}
.CompareRecordPopoverClass2 .is-checked .el-checkbox__inner,
.CompareRecordPopoverClass2
	.el-checkbox__input.is-indeterminate
	.el-checkbox__inner {
	background-color: transparent;
	border-color: #28ffbb;
	/* color:#28FFBB; */
}
.CompareRecordPopoverClass2 .el-checkbox__inner::after {
	-webkit-box-sizing: content-box;
	box-sizing: content-box;
	content: "";
	border: 1px solid #28ffbb;
	border-left: 0;
	border-top: 0;
	height: 7px;
	left: 4px;
	position: absolute;
	top: 1px;
	-webkit-transform: rotate(45deg) scaleY(0);
	transform: rotate(45deg) scaleY(0);
	width: 3px;
	-webkit-transition: -webkit-transform 0.15s ease-in 0.05s;
	transition: -webkit-transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s,
		-webkit-transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s,
		-webkit-transform 0.15s ease-in 0.05s;
	-webkit-transform-origin: center;
	transform-origin: center;
}
.CompareRecordPopoverClass2 .el-checkbox__inner {
	display: inline-block;
	position: relative;
	border: 1px solid #dcdfe6;
	border-radius: 2px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	width: 14px;
	height: 12px;
	background-color: transparent;
	z-index: 1;
	/* margin: 12px 0px; */
	-webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
		background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
	transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
		background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

.CompareRecordPopoverClass2
	.el-tree--highlight-current
	.el-tree-node.is-current
	> .el-tree-node__content {
	background-color: transparent;
}
.CRTaskPopoverClass2 .el-tree,
.CompareRecordPopoverClass2 .el-tree {
	position: relative;
	cursor: default;
	background: #202127;
	color: #efefee;
}
.IMRPicPopoverClass {
	width: 180px !important;
}
.CRTaskPopoverClass2 {
	position: absolute;
	background: #202127;
	min-width: 150px;
	/* border: 1px solid rgba(40,255,187, 1); */
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	max-height: 80%;
	overflow: auto;
}

.CompareRecordPopoverClass2 .el-tree-node__content:hover {
	background-color: #000000;
	/* color: #; */
}
.CompareRecord .elCardBoxHeaders {
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding-bottom: 12px;
	padding: 9px 15px;
	/* background: rgba(227, 53, 53, 0.8); */
}
.CompareRecordPopoverClass2 .el-tree {
	color: #aaaaaa;
	background: none;
}
.CompareRecordPopoverClass2 .el-tree-node__content:hover {
	background: none;
}
.CompareRecordPopoverClass2 .el-tree-node:focus > .el-tree-node__content {
	background: none;
	/* color: #28FFBB; */
}
.CompareRecordPopoverClass2 {
	width: 50%;
	height: 50%;
	position: absolute;
	background: #202127;
	min-width: 150px;
	/* border: 1px solid rgba(40,255,187, 1); */
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	max-height: 80%;
	overflow: auto;
}
</style>
