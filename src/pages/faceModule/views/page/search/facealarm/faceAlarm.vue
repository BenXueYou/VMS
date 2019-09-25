<template>
	<div class="facealarm">
		<el-row class="topBox" type="flex" justify="space-between">
			<div class="topBoxDiv topTitleTxt topBoxTaskBox">
				任务：
				<alPopverTree
					:treeDataList="taskItemList"
					:alPopoverClass="facealarmPopoverClass"
					:defaultProps="defaultProps"
					nodeKey="taskuuid"
					inputWidth="160px"
					@transferAct="transferTaskAct"
				></alPopverTree>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;">
				抓拍设备：
				<elPopverTree
					:channelInfoList="DeviceTreeList"
					:elPopoverClass="facealarmPopoverClass"
					@transferCheckedChannel="transferCheckedChannel"
					inputWidth="160px"
				></elPopverTree>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;display:block">
				所属库：
				<alPopverTree
					:treeDataList="faceDBList"
					:alPopoverClass="facealarmPopoverClass"
					:defaultProps="faceDBDefaultProps"
					nodeKey="libraryuuid"
					inputWidth="160px"
					@transferAct="handleLibCheckAllChange"
				></alPopverTree>
			</div>
			<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:left;display:block">
				姓名：
				<el-input placeholder v-model="username" />
			</div>
			<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:left;display:block">
				证件号：
				<el-input placeholder v-model="idcard" />
			</div>
			<div :span="4" class="topBoxDiv topBoxGenderRadioBtnBox">
				<span class="topTitleTxt" style="margin-right:15px;">性别:</span>
				<el-radio-group v-model="genderOption">
					<el-radio-button label>不限</el-radio-button>
					<el-radio-button label="male">男</el-radio-button>
					<el-radio-button label="female">女</el-radio-button>
				</el-radio-group>
			</div>
			<div class="topBoxDiv topBoxDateTimeBox">
				<span class="topTitleTxt" style="margin-right:15px;">时段：</span>
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="startTime"
					type="datetime"
					placeholder="选择日期"
					@change="changeDate"
				></el-date-picker>
				<span class="facealarmTxt">至</span>
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="endTime"
					type="datetime"
					placeholder="选择日期"
					@change="changeDate"
				></el-date-picker>
			</div>
			<div class="topBoxDiv topBoxDateRadioBtnBox">
				<el-radio-group style="margin-right:0px" v-model="selectDate" @change="selectDateAct">
					<el-radio-button label="today">今天</el-radio-button>
					<el-radio-button label="lastday">昨天</el-radio-button>
					<el-radio-button label="thisWeek">本周</el-radio-button>
					<el-radio-button label="thisMonth">本月</el-radio-button>
				</el-radio-group>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;display:block">
				状态：
				<el-select
					v-model="status"
					filterable
					@visible-change="selectvisiblechange"
					@change="selectChange"
					collapse-tags
					placeholder="全部"
					class="header-line-input"
				>
					<el-option
						v-for="item in statusOptions"
						:key="item.typeStr"
						:label="item.typeName"
						:value="item.typeStr"
					></el-option>
				</el-select>
			</div>
			<div :span="2" style="margin-top:-15px;">
				<el-button icon="el-icon-search" class="search-btn" @click="gettranslate" type="primary">查询</el-button>
				<el-button class="search-btn" @click="resetData" type="primary">重置</el-button>
			</div>
		</el-row>
		<div class="facealarm-table">
				<el-radio-group class="switchBtn" v-model="showindex" @change="changeIndex">
					<el-radio label="0">图片</el-radio>
					<el-radio label="1">列表</el-radio>
				</el-radio-group>
			<component
				:is="['theFaceAlarmImageTable','faceAlarmTable'][showindex]"
				:pageSize="pageSize"
				:pageNow="pageNow"
				:pageCount="pageCount"
				:tableData="tableData"
				:isloading="isloading"
				@lookface="lookface"
				@pagechange="pagechange"
			></component>
			<the-face-alarm-dialog
				title="报警详情"
				:detail="detail"
				:detail2="detail2"
				:facearr="facearr"
				:alarminfoid="alarminfoid"
				:faceDBDialogVisible="facealarmvisible"
				@close="facealarmvisible=false"
			></the-face-alarm-dialog>
		</div>
	</div>
</template>

<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import alPopverTree from "@/pages/faceModule/components/AlElTree.vue";
import TheFaceAlarmDialog from "@/pages/faceModule/views/page/search/facealarm/basic/TheFaceAlarmDialog.vue";
import faceAlarmTable from "@/pages/faceModule/views/page/search/facealarm/basic/TheFaceAlarmTable.vue";
import theFaceAlarmImageTable from "@/pages/faceModule/views/page/search/facealarm/basic/TheFaceAlarmImageTable.vue";
import * as api from "@/pages/faceModule/api.js";
export default {
  name: "facealarm",
  components: {
    faceAlarmTable,
    theFaceAlarmImageTable,
    TheFaceAlarmDialog,
    elPopverTree,
    alPopverTree
  },
  data() {
    return {
      isIndeterminate: false,
      checkTaskAll: true,
      checkLibAll: true,
      facealarmPopoverClass: "facealarmPopoverClass",
      faceDBDefaultProps: {
        label: "libraryname"
      },
      defaultProps: {
        label: "taskname"
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
      statusarr: [],
      status: "",
      pageSize: 13,
      pageNow: 1,
      pageCount: 0,
      imagePageSize: 12,
      imagePageNow: 1,
      tableData: [],
      showindex: '0',
      statusOptions: [],
      username: "",
      idcard: "",
      isloading: false,
      facealarmvisible: false,
      genderOption: null,
      detail: {
        zhuapaiurl: "",
        zhuapaiaddress: "",
        zhuapaitime: "",
        tezheng: "",
        taskName: "",
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
      taskItemList: [], // 布控任務列表
      checkedTaskUuidList: [],
      checkedTaskObj: [],
      checkedTaskNameString: "",
      DeviceTreeList: [],
      checkedChannelsUuidList: [],
      faceDBList: [],
      checkedFaceUuidList: [],
      checkedFaceLibObj: [],
      checkFaceDBNameString: "对比人脸库",
      selectDate: null
    };
  },
  fiters: {},
  activated() {
    const _this = this;
    // 获取布控任务
    api.getbukongrenwu().then(res => {
      console.log(res);
      var num = [
        //   {
        //   taskname:"全部",
        //   taskuuid:"",
        // }
      ];
      if (res.data.data) {
        var diaabled = res.data.data.disable;
        var enableed = res.data.data.enable;
        num = num.concat(diaabled);
        num = num.concat(enableed);
      }
      _this.alarmtypearr = num;

      var test = [];
      for (let i = 0; i < num.length; i++) {
        var tempTask = num[i];
        test.push(tempTask.taskuuid);
      }

      // this.getFaceLibsAndDeviceList(test);
    });
    // 获取身份证的
    api
      .getIdCardType({
        typegroupstring: "credential"
      })
      .then(res => {
        console.log(res);
        var data = res.data.data;
        this.idtypetranslatearr = data;
      });
  },
  mounted() {
    // 调用翻译
    // ----------------
    this.startTime = this.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.statusOptions = this.$common.getEnumByGroupStr("alarm_r");
  },
  watch: {
    checkedTaskUuidList: function(newVal, oldVal) {
      this.checkTaskAll = newVal.length === this.alarmtypearr.length;
    },
    checkedFaceUuidList: function(newVal, oldVal) {
      this.checkLibAll = newVal.length === this.faceDBList.length;
    }
  },
  methods: {
    changeDate() {
      this.selectDate = null;
    },
    selectDateAct(dateStr) {
      console.log(dateStr);
      let day = new Date();
      switch (dateStr) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "thisWeek":
          let weekday = day.getDay();
          let today = day.getDate();
          let month = day.getMonth();
          let firstDay = null;
          // month默认从0开始，则判断不是月初，则月份+1
          if (today - weekday) {
            month += 1;
            firstDay = today - weekday;
          } else {
            // 月初 则向前退weekday - today天
            // 判断 月大 月小
            let lastMonthDays =
							[1, 3, 5, 7, 8, 10, 12].indexOf(month + 1) > -1 ? 31 : 30;
            firstDay = lastMonthDays - weekday + today;
          }
          let firstdate = new Date(day.getFullYear(), month - 1, firstDay);
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
        case "thisMonth":
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          enddate = this.$common.timestampToFormatter(
            new Date().getTime(),
            "yyyy-mm-dd"
          );
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
      }

      console.log(this.startTime, "-----", this.endTime);
    },
    handleLibCheckAllChange(val) {
      this.checkedFaceUuidList = [];
      if (val) {
        this.checkedFaceLibObj = this.faceDBList;
        for (let i = 0; i < this.faceDBList.length; i++) {
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
    transferTaskAct(val) {
      this.checkedTaskUuidList = [];
      if (val) {
        this.checkedTaskObj = this.alarmtypearr;
        for (let i = 0; i < this.alarmtypearr.length; i++) {
          var temp = this.alarmtypearr[i];
          this.checkedTaskUuidList.push(temp.taskuuid);
        }
      } else {
        this.checkedTaskObj = [];
      }
      this.$refs.tree1.setCheckedKeys(this.checkedTaskUuidList);
      this.isIndeterminate = false;
    },

    // 清除按钮
    clearAction(e) {
      console.log("清除----");
      if (e === 1) {
        this.checkedTaskNameString = "";
        this.checkedTaskUuidList = [];
        this.checkedTaskObj = [];
        this.checkTaskAll = true;
      } else if (e === 1) {
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
        //  this.checkNameString = '';
        for (let i = 0; i < this.checkedChannelObj.length; i++) {
          var item = this.checkedChannelObj[i];
          this.checkedChannelsUuidList.push(item.id);
          // this.checkNameString += item.channelName;
          // this.checkNameString += ',';
        }
      } else {
        this.checkNameString = "全部设备";
      }
    },
    checkChanges(data, node) {
      var checkedKeys = node.checkedKeys;
      this.checkedTaskUuidList = checkedKeys;
      this.checkedTaskObj = node.checkedNodes;
      this.$refs.tree1.setCheckedKeys(this.checkedTaskUuidList);
      console.log(this.checkedTaskUuidList);
      console.log(this.checkedTaskObj);
    },
    // 勾选人脸库
    checkFaceDBChanges(data, node) {
      this.checkedFaceUuidList = node.checkedKeys;
      this.checkedFaceLibObj = node.checkedNodes;
      this.$refs.tree3.setCheckedKeys(this.checkedFaceUuidList);
      console.log("+++++++++++++++++");
      console.log(data);
      console.log(node);
      console.log(this.checkedFaceUuidList);
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
            this.faceDBList = res.data.faceLibDTOS;
            console.log("+++++++++++++++++++++++++++++++++++++++++");
            console.log(this.faceDBList);
            this.checkedFaceUuidList = [];
            for (let i = 0; i < this.faceDBList.length; i++) {
              var temp = this.faceDBList[i];
              this.checkedFaceUuidList.push(temp.libraryuuid);
            }
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
      if (e === 1) {
        // 任务树
        // this.getFaceLibsAndDeviceList(this.checkedTaskUuidList);
        if (this.checkedTaskObj && this.checkedTaskObj.length) {
          this.checkedTaskNameString = "";
          for (let i = 0; i < this.checkedTaskObj.length; i++) {
            var item = this.checkedTaskObj[i];
            this.checkedTaskNameString += item.taskname;
            this.checkedTaskNameString += ",";
          }
        } else {
          this.checkedTaskNameString = "全部任务";
          this.checkedTaskUuidList = [];
        }
      } else if (e === 2) {
      } else if (e === 3) {
        // 任务树
        if (this.checkedFaceLibObj && this.checkedFaceLibObj.length) {
          this.checkFaceDBNameString = "";
          for (let i = 0; i < this.checkedFaceLibObj.length; i++) {
            // var item = this.checkedFaceLibObj[i];
            this.checkFaceDBNameString += item.libraryname;
            this.checkFaceDBNameString += ",";
          }
        } else {
          this.checkFaceDBNameString = "全部对比库";
          this.checkedFaceUuidList = [];
        }
      } else {
        console.log("其他异常");
      }
    },
    // 弹窗展开的回调
    popverShow(e) {
      var num = [];
      if (e === 1) {
        // 任务树
        console.log(this.checkedTaskUuidList);
        if (this.checkTaskAll) {
          for (let i = 0, len = this.alarmtypearr.length; i < len; i++) {
            num.push(this.alarmtypearr[i].taskuuid);
          }
        }
        this.$refs.tree1.setCheckedKeys(
          this.checkTaskAll ? num : this.checkedTaskUuidList
        );
      } else if (e === 2) {
        // 设备树
      } else if (e === 3) {
        // 任务树
        if (this.checkLibAll) {
          // alert(this.faceDBList.length);
          for (let i = 0, len = this.faceDBList.length; i < len; i++) {
            num.push(this.faceDBList[i].libraryuuid);
          }
        }
        this.$refs.tree3.setCheckedKeys(
          this.checkLibAll ? num : this.checkedFaceUuidList
        );
      } else {
        console.log("其他异常");
      }
    },
    getidName(val) {
      var str = val;
      for (let i = 0, len = this.idtypetranslatearr.length; i < len; i++) {
        if (this.idtypetranslatearr[i].typeStr === val) {
          str = this.idtypetranslatearr[i].typeName;
        }
      }
      return str;
    },
    gettranslate() {
      this.init();
      if (!this.statusOptions.length) {
        // 点击搜索按钮从而发起请求
        api
          .gettranslateword({
            typegroupstring: "alarm_receiving"
          })
          .then(res => {
            // console.log(res);
            if (res.data && res.data.data) {
              this.statusOptions = [{ typeName: "全部", typeStr: "" }].concat(
                res.data.data
              );
            }
            this.getAfterFanyi();
            this.ajaxdata();
          })
          .catch(() => {
            this.$message.error("获取请求失败！");
            this.ajaxdata();
          });
      } else {
        this.pageNow = 1; // 点击搜索条件变更,当前页设置为第一页
        this.ajaxdata();
      }
    },
    resetData() {
      this.detail = {
        zhuapaiurl: "",
        zhuapaiaddress: "",
        zhuapaitime: "",
        tezheng: "",
        taskName: "",
        jindu: 0,
        kuurl: "",
        belong: "",
        username: "",
        sex: "",
        huji: "",
        minzu: "",
        bir: "",
        cardtype: "",
        idcard: ""
      };
    },
    lookface(detail) {
      const _this = this;
      this.detail = detail;
      _this.facearr = [];
      // 这个获取抓拍记录
      api.getAlarmDetail({ staffUuid: detail.staffuuid }).then(res => {
        var data = res.data.data;
        if (data) {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            data[i].panoramauri = data[i].panoramauri
              ? data[i].panoramauri.replace(/"/g, "")
              : "";
            data[i].photouri = data[i].photouri
              ? data[i].photouri.replace(/"/g, "")
              : "";
            data[i].channelName = data[i].channelName
              ? data[i].channelName.replace(/"/g, "")
              : "";
            data[i].time = data[i].time ? data[i].time.replace(/"/g, "") : "";
            data[i].panoramauri = data[i].panoramauri || _this.defaultHeader;
            data[i].photouri = data[i].photouri || _this.defaultHeader;
          }
          _this.facearr = data;
        }
      });
      // 下面获取一些特殊信息，

      this.detail2 = {};
      api
        .queryvip({
          staffUuid: detail.staffuuid
        })
        .then(res => {
          var data = res.data.data;
          if (data) {
            _this.detail2 = {
              sex: data.staffsexName,
              huji: data.nation,
              minzu: data.domicileAddress,
              bir: data.birthdate,
              cardtype: _this.getidName(data.credentialtype),
              idcard: data.credentialno
            };
          } else {
            // this.$message.error("获取数据为空!");
          }
          console.log("---------------");
          console.log(_this.detail2);
        });
      // 这边有个请求。
      this.alarminfoid = detail.alarminfoid;
      this.facealarmvisible = true;
    },
    getAfterFanyi() {
      this.init();
      // const _this = this;
      // this.alarmtypearr = face.alarmsubtype;
      this.statusarr = window.face.dealstate;
      // this.mock();

      // 获取所属库和
      // this.getku();

      // api.getDeviceName(face.devicetypearr).then(res => {
      //   if (res.data && res.data.data) {
      //     this.devicearr = res.data.data;
      //   }
      // });
    },
    statusChange(val) {
      var str = val;
      for (let i = 0; i < this.statusOptions.length; i++) {
        if (this.statusOptions[i].typeStr === val) {
          str = this.statusOptions[i].typeName;
          break;
        }
      }
      return str;
    },
    changeIndex(index) {
      this.showindex = index;
      if (index === 1) {
        if (this.pageSize >= 12) {
          this.tableData.splice(12, 100);
        } else {
          this.pageSize = 12;
          // this.tableData = [];
          // this.ajaxdata();
        }
      } else {
        this.init();
        // this.tableData = [];
        // this.ajaxdata();
      }
    },
    getku() {
      const _this = this;
      api.querystafflibrarylist().then(res => {
        // console.log(res);
        _this.belongtoarr = res.data.data;
      });
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
      // this.ajaxdata();
    },
    ajaxdata() {
      const _this = this;
      this.init();
      var pageSize = this.pageSize;
      var pageNow = this.pageNow;
      if (this.showindex === '0') {
        pageSize = this.imagePageSize;
      }
      console.log(`请求数据：第${pageNow}页，一页${pageSize}条`);
      console.log(this.devicename);
      console.log(this.checkedTaskUuidList);
      console.log(this.checkedChannelsUuidList);
      console.log(this.checkedFaceUuidList);

      this.isloading = true;
      api
        .getAlarmRecord({
          staffname: this.username,
          IDnumber: this.idcard,
          state: this.status,
          taskNameList: this.checkedTaskUuidList.toString(),
          database: this.checkedFaceUuidList.toString(),
          devname: this.checkedChannelsUuidList.toString(),
          starttime: this.startTime,
          overtime: this.endTime,
          currentPage: pageNow,
          pageSize: pageSize
        })
        .then(res => {
          this.isloading = false;
          // console.log(res);
          // for (let i = 0; i < res.data.data.list.length; i++) {
          //   console.log(res.data.data.list[i]);
          //   console.log(JSON.parse(res.data.data.list[i].extinfo));
          // }
          var data = res.data;

          this.tableData = [];
          this.pageCount = data.data.total;
          var num = [];
          if (data && data.data) {
            this.pageCount = data.data.total;
            // console.log(data.data);
            for (let i = 0; i < res.data.data.list.length; i++) {
              var waimian = res.data.data.list[i];
              var limian = JSON.parse(res.data.data.list[i].extinfo);
              if (i === 0) {
                console.log(waimian);
                console.log(limian);
              }
              if (limian.faceRecognization) {
                var detectedinfo, photoinfo2, staffinfo;
                if (typeof limian.faceRecognization.detectedinfo === "string") {
                  detectedinfo = JSON.parse(
                    limian.faceRecognization.detectedinfo
                  );
                } else {
                  detectedinfo = limian.faceRecognization.detectedinfo;
                }
                if (typeof limian.faceRecognization.photoinfo === "string") {
                  photoinfo2 = JSON.parse(limian.faceRecognization.photoinfo);
                } else {
                  photoinfo2 = limian.faceRecognization.photoinfo;
                }
                if (typeof limian.faceRecognization.staffinfo === "string") {
                  staffinfo = JSON.parse(limian.faceRecognization.staffinfo);
                } else {
                  staffinfo = limian.faceRecognization.staffinfo;
                }
                num.push({
                  detail: {
                    alarminfoid: waimian.alarminfoid,
                    staffuuid: staffinfo.staffUuid,
                    zhuapaiurl: photoinfo2.imageUri,
                    zhuapaiaddress: detectedinfo.channelinfo.channelName,
                    zhuapaitime: data.data.list[i].alarmtime,
                    tezheng: "",
                    taskName: limian.taskname,
                    jindu: Math.round(limian.faceRecognization.scores),
                    kuurl: staffinfo.photoUri || _this.defaultHeader,
                    belong: limian.faceRecognization.staffinfo.libraryName,
                    username: limian.faceRecognization.staffinfo.staffName
                  },
                  alarmed: waimian.alarmed,
                  alarminfoid: waimian.alarminfoid,
                  zhuapaipic: photoinfo2.imageUri || _this.defaultHeader, //
                  kulipic: staffinfo.photoUri || _this.defaultHeader,
                  taskname: limian.taskname,
                  zhuapai: limian.faceRecognization.channelName,
                  alarmtime: waimian.alarmtime,
                  xiangsidu: Math.round(limian.faceRecognization.scores) + "%",
                  percent: Math.round(limian.faceRecognization.scores),
                  staffname: limian.faceRecognization.staffinfo.staffName,
                  idcard: limian.faceRecognization.staffinfo.credentialNo,
                  // idcard: "342626199411060399",
                  belong: limian.faceRecognization.staffinfo.libraryName,
                  librarycolor: limian.faceRecognization.staffinfo.librarycolor,
                  // librarycolor: "red",
                  dealstate: _this.statusChange(waimian.dealstate)
                });
              }
            }
            console.log(num);
            this.tableData = num;
          }
        })
        .catch(err => {
          console.log(err);
          this.isloading = false;
        });
    },
    search() {},
    pagechange(index) {
      this.pageNow = index;

      this.ajaxdata();
    },
    selectvisiblechange() {},
    selectChange() {
      console.log("改变了");
      console.log(this.devicename);
      console.log(this.status);
      console.log(this.belongto);
      console.log(this.alarmtype);
      this.gettranslate();
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
      this.belongtoarr = [
        {
          label: "全部",
          value: ""
        },
        {
          label: "库1",
          value: "1"
        },
        {
          label: "库2",
          value: "2"
        }
      ];
      this.statusarr = [
        {
          label: "全部",
          value: ""
        },
        {
          label: "状态1",
          value: "1"
        },
        {
          label: "状态2",
          value: "2"
        }
      ];
    },
    getStartTime() {
      var new111 = new Date();
      var hours = new111.getHours();
      if (hours > 1) {
        return (
          new111.getFullYear() +
					"-" +
					addZero(new111.getMonth() + 1) +
					"-" +
					addZero(new111.getDate()) +
					" " +
					addZero(hours - 1) +
					":" +
					addZero(new111.getMinutes()) +
					":" +
					addZero(new111.getSeconds())
        );
      } else {
        return (
          new111.getFullYear() +
					"-" +
					addZero(new111.getMonth() + 1) +
					"-" +
					addZero(new111.getDate()) +
					" " +
					"00:00:00"
        );
      }
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>

<style>
.facealarm .topBoxInputBox {
	width: 220px;
	padding-bottom: 20px;
}
.facealarm .topBoxInputBox .el-input {
	width: 160px;
}
.facealarm .el-input--prefix .el-input__inner {
	padding-left: 10px;
}
.facealarm .el-input--suffix .el-input__inner {
	padding-right: 10px;
}

.facealarm .el-button {
	line-height: 1;
	background: transparent;
	border: 0;
	color: #efefef;
	text-align: center;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	font-weight: 500;
	padding: 12px 20px;
	font-size: 14px;
	border-radius: 4px;
}
.facealarm .el-input__prefix {
	left: 110%;
	-webkit-transform: translateX(-200%);
	transform: translateX(-200%);
}
.facealarm .el-checkbox-button__inner,
.facealarm .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.1);
	color: #ffffff;
	margin-right: 9px;
	border: 0;
	padding: 8px 20px;
	font-size: 13px;
}
.facealarm .el-checkbox-button:first-child .el-checkbox-button__inner,
.facealarm .el-radio-button:first-child .el-radio-button__inner {
	border: 0;
	/* margin-left: 30px; */
}
.facealarm .el-button--primary {
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	/* margin-left: 8%; */
}
.facealarm .topBoxDateRadioBtnBox {
	min-width: 310px;
}
.facealarm .topBoxGenderRadioBtnBox {
	min-width: 250px;
}
.facealarm .el-checkbox-button.is-checked .el-checkbox-button__inner,
.facealarm .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background: rgba(40, 255, 187, 0.1);
	border-radius: 2px;
	border-radius: 2px;
	border: 0;
	box-shadow: 0px 0 0 0 #26d39d;
}
.facealarm .topBoxDeviceBox {
	min-width: 240px;
}
.facealarm .topBoxTaskBox {
	min-width: 240px;
}
.facealarm .topBoxQualityCheckBox {
	min-width: 360px;
}
.facealarm .el-checkbox-group {
	display: inline-block;
}
.facealarm .topTitleTxt {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: left;
}
.facealarm .topBoxDiv {
	padding-bottom: 20px;
}
.facealarm .topBox {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 25px 40px 0px 27px;
	background: rgba(36, 39, 42, 1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
	/* overflow-y: auto; */
	box-sizing: border-box;
}
.facealarm .el-input--prefix .el-input__inner {
	padding: 0px 10px;
}
.facealarmPopoverClass .is-checked .el-checkbox__inner,
.facealarmPopoverClass
	.el-checkbox__input.is-indeterminate
	.el-checkbox__inner {
	background-color: transparent;
	border-color: #28ffbb;
	/* color:#28FFBB; */
}
.facealarmPopoverClass .el-checkbox__inner::after {
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
	transform-origin: center;
}
.facealarmPopoverClass .el-checkbox__inner {
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
}

.facealarmPopoverClass
	.el-tree--highlight-current
	.el-tree-node.is-current
	> .el-tree-node__content {
	background-color: transparent;
}
.facealarmPopoverClass .el-tree,
.facealarmPopoverClass .el-tree {
	position: relative;
	cursor: default;
	background: #202127;
	color: #efefee;
}
.facealarmPopoverClass {
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

.facealarmPopoverClass .el-tree-node__content:hover {
	background-color: #000000;
	/* color: #; */
}
.facealarm .elCardBoxHeaders {
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding-bottom: 12px;
	padding: 9px 15px;
	/* background: rgba(227, 53, 53, 0.8); */
}
.facealarmPopoverClass .el-tree {
	color: #aaaaaa;
	background: none;
}
.facealarmPopoverClass .el-tree-node__content:hover {
	background: none;
}
.facealarmPopoverClass .el-tree-node:focus > .el-tree-node__content {
	background: none;
	/* color: #28FFBB; */
}
.facealarmPopoverClass {
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
