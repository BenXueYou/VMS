<template>
  <div class='facealarm'>
    <div class="facealarm-header">

      <div class="header-line">

        <!-- <el-col :span="4"
                class="topTitleTxt"
                style="text-align:left;color:#fff;">任务：
          <el-popover popper-class="CompareRecordPopoverClass2"
                      placement="bottom"
                      width="180"
                      @show="popverShow(1)"
                      @hide="popverHidden(1)"
                      trigger="click">
            <el-tree ref="tree1"
                     :data="alarmtypearr"
                     show-checkbox
                     node-key="taskuuid"
                     :props="defaultProps"
                     default-expand-all
                     @check="checkChanges"></el-tree>
            <el-input slot="reference"
                      style="width:50%"
                      :clearable="true"
                      v-model="checkedTaskNameString"
                      @clear="clearAction(1)"
                      placeholder="全部任务"></el-input>
          </el-popover>
        </el-col> -->

        <el-col class="topTitleTxt"
                style="width:18%;text-align:left;">任务：
          <el-popover popper-class="CRTaskPopoverClass2"
                      placement="bottom"
                      @show="popverShow(1)"
                      @hide="popverHidden(1)"
                      trigger="click">
            <!-- default-expand-all  -->
            <el-checkbox :indeterminate="isIndeterminate"
                         v-model="checkTaskAll"
                         @change="handleTaskCheckAllChange">
              全选
            </el-checkbox>
            <el-tree ref="tree1"
                     :data="alarmtypearr"
                     show-checkbox
                     node-key="taskuuid"
                     :props="defaultProps"
                     default-expand-all
                     @check="checkChanges"></el-tree>
            <el-input slot="reference"
                      style="width:70%;"
                      :clearable="true"
                      v-model="checkedTaskNameString"
                      @clear="clearAction(1)"
                      placeholder="全部任务"></el-input>
          </el-popover>
        </el-col>

        <el-col class="topTitleTxt"
                style="width:15%;text-align:left;margin-left:30px;">抓拍设备：
          <elPopverTree :channelInfoList="DeviceTreeList"
                        :elPopoverClass="CompareRecordPopoverClass2"
                        @transferCheckedChannel="transferCheckedChannel"
                        @clear="clearAction(2)"
                        @show="popverShow(2)"
                        @hide="popverHidden(2)"></elPopverTree>
        </el-col>

        <el-col class="topTitleTxt"
                style="width:18%;text-align:left;margin-left:30px;">所属库：
          <el-popover popper-class="CRTaskPopoverClass2"
                      placement="bottom"
                      style='width:100%;'
                      @show="popverShow(3)"
                      @hide="popverHidden(3)"
                      trigger="click">
            <!-- default-expand-all  -->
            <el-checkbox :indeterminate="isIndeterminate"
                         v-model="checkLibAll"
                         @change="handleLibCheckAllChange">
              全选
            </el-checkbox>
            <el-tree ref="tree3"
                     :data="faceDBList"
                     show-checkbox
                     node-key="libraryuuid"
                     :props="faceDBDefaultProps"
                     default-expand-all
                     @check="checkFaceDBChanges"></el-tree>
            <el-input slot="reference"
                      style="width:65%;"
                      :clearable="true"
                      v-model="checkFaceDBNameString"
                      @clear="clearAction(3)"
                      placeholder="全部对比库"></el-input>
          </el-popover>
        </el-col>

        <!-- <el-col :span="4"
                class="topTitleTxt"
                style="text-align:center;display:block">所属库：
          <el-popover popper-class="CRTaskPopoverClass2"
                      placement="bottom"
                      width="220"
                      @show="popverShow(3)"
                      @hide="popverHidden(3)"
                      trigger="click">
            <el-tree ref="faceDBTree3"
                     :data="faceDBList"
                     show-checkbox
                     node-key="libraryuuid"
                     :props="faceDBDefaultProps"
                     default-expand-all
                     @check="checkFaceDBChanges"></el-tree>
            <el-input slot="reference"
                      style="width:50%"
                      :clearable="true"
                      v-model="checkFaceDBNameString"
                      @clear="clearAction(3)"
                      placeholder="全部对比库"></el-input>
          </el-popover>
        </el-col> -->

        <span class='header-line-label'
              style='margin-left:30px;'>姓名：</span>
        <el-input v-model='username'
                  class='header-line-input'>
        </el-input>

        <span class='header-line-label'
              style='margin-left:30px;'>证件号：</span>
        <el-input v-model='idcard'
                  class='header-line-input'>
        </el-input>

        <el-button class='search'
                   @click='gettranslate'
                   type='primary'>查询</el-button>
      </div>

      <div class="header-line">
        <span class='header-line-label'>报警时段：</span>

        <el-date-picker class="header-line-time"
                        v-model="startTime"
                        @change='timeChange'
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <span class='header-line-time-label'>至</span>
        <el-date-picker class="header-line-time"
                        v-model="endTime"
                        @change='timeChange'
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <span class='header-line-label'
              style='margin-left:70px;'>状态：</span>
        <el-select v-model="status"
                   filterable
                   @visible-change="selectvisiblechange"
                   @change="selectChange"
                   collapse-tags
                   placeholder="全部"
                   class='header-line-input'>
          <el-option v-for="item in statusZnarr"
                     :key="item.typestr"
                     :label="item.typename"
                     :value="item.typestr">
          </el-option>
        </el-select>

      </div>

    </div>

    <div class="facealarm-table">

      <div class="switchBtn">
        <div class="imagebtn "
             @click='changeIndex(0)'
             :class='{"active":showindex==0}'>
          列表
        </div>
        <div class="imagebtn"
             @click='changeIndex(1)'
             :class='{"active":showindex==1}'>
          图片
        </div>
      </div>

      <component :is='["faceAlarmTable","theFaceAlarmImageTable"][showindex]'
                 :pageSize="pageSize"
                 :pageNow="pageNow"
                 :pageCount="pageCount"
                 :tableData="tableData"
                 :isloading="isloading"
                 @lookface="lookface"
                 @pagechange='pagechange'></component>

      <the-face-alarm-dialog title="报警详情"
                             :detail="detail"
                             :detail2="detail2"
                             :facearr="facearr"
                             :alarminfoid="alarminfoid"
                             :faceDBDialogVisible="facealarmvisible"
                             @close="facealarmvisible=false"></the-face-alarm-dialog>
    </div>

  </div>
</template>

<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
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
    elPopverTree
  },
  data() {
    return {
      isIndeterminate: false,
      checkTaskAll: true,
      checkLibAll: true,
      CompareRecordPopoverClass2: "CompareRecordPopoverClass2",
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
      showindex: 0,
      statusZnarr: [],
      username: "",
      idcard: "",
      isloading: false,
      facealarmvisible: false,
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
      checkFaceDBNameString: "对比人脸库"
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

      this.getFaceLibsAndDeviceList(test);

      // var taskuuidnum = num.map(val => val.taskuuid);
      // api.getchannelbykongbu(taskuuidnum).then(res => {
      //   console.log(res);
      //   var num1 = [],
      //     num2 = [];
      //   if (res.data.data) {
      //     num1 = res.data.data.channelDTOS;
      //     num2 = res.data.data.faceLibDTOS;
      //   }
      //   _this.devicearr = num1;
      //   _this.belongtoarr = num2;
      // });
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
    this.startTime = this.$common.getYesterday(new Date());
    this.endTime = this.$common.formatDate(new Date());
    // console.log(this.startTime);
    // console.lg(this.endTIme);
    this.gettranslate();
    // this.ajaxdata();
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
    handleTaskCheckAllChange(val) {
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
        if (this.idtypetranslatearr[i].typestr === val) {
          str = this.idtypetranslatearr[i].typename;
        }
      }
      return str;
    },
    gettranslate() {
      this.init();
      if (!this.statusZnarr.length) {
        // 点击搜索按钮从而发起请求
        api
          .gettranslateword({
            typegroupstring: "alarm_receiving"
          })
          .then(res => {
            // console.log(res);
            if (res.data && res.data.data) {
              this.statusZnarr = [{ typename: "全部", typestr: "" }].concat(
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
      for (let i = 0; i < this.statusZnarr.length; i++) {
        if (this.statusZnarr[i].typestr === val) {
          str = this.statusZnarr[i].typename;
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
          this.tableData = [];
          this.ajaxdata();
        }
      } else {
        this.init();
        this.tableData = [];
        this.ajaxdata();
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
      if (this.showindex === 1) {
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>

<style>
.facealarm .el-input--prefix .el-input__inner {
  padding: 0px 10px ;
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
