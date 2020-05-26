<template>
  <div :visible.sync="powerVisbile"
       :title="title"
       width="660px"
       class="dialogCenter addnewPower"
       :close-on-click-modal="false"
       :close-on-press-escape="false"
       :append-to-body="true"
       @close="close">
    <div class='myTitle'>
      {{ title}}
    </div>
    <div class="dash-line"></div>
    <el-form ref="form"
             :rules="rules"
             :model="data"
             class="asdasadasasdasdasda"
             label-width="200px">
      <el-form-item label="预警主题:"
                    style="margin-top:50px;"
                    prop="name">
        <el-input size="small"
                  class="nameInput"
                  v-model="data.name"></el-input>
      </el-form-item>

      <el-form-item label="预警原因:"
                    style="margin-top:10px;"
                    prop="accessResult">
        <el-input size="small"
                  class="nameInput"
                  v-model="data.accessResult"></el-input>
      </el-form-item>

      <el-form-item label="请选择哪些人需要预警:"
                    prop="people">
        <el-button class='iconButton'
                   @click="chooseBtn"
                   type="primary"
                   size='small'>
          <img :src="icons.tianjia"
               alt="">
          添加
        </el-button>
        <span class='total'>共{{peopleList.length}}人</span>
        <div class='showAllSelect'>
          <gt-button class='sbtn'
                     v-for="(item,index) in peopleList"
                     :key="index"
                     @close="deletePerson(index)"
                     :icon="(item.type=='staff'||item.type=='resident')?icons.personHead:icons.folder">
            {{ item.label}}
          </gt-button>
        </div>
      </el-form-item>
      <el-form-item label="请选择需要监控的门:"
                    prop="door">
        <el-button class='iconButton'
                   @click="chooseBtn2"
                   type="primary"
                   size='small'>
          <img :src="icons.tianjia"
               alt="">
          添加
        </el-button>
        <span class='total'>共{{doorList.length}}门</span>
        <div class='showAllSelect'>
          <gt-button class='sbtn'
                     @close="deleteDoor(index)"
                     v-for="(item,index) in doorList"
                     :key="index"
                     :icon="icons.door">
            {{item.label}}
          </gt-button>
        </div>
      </el-form-item>

      <el-form-item label="请选择预警时间段:"
                    prop="rule">
        <el-radio-group v-model="data.rule"
                        @change="changeTimeRadio">
          <el-radio label="all">全时间段通行</el-radio>
          <el-radio label="normal">固定时间段通行</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="data.rule==='normal'">
        <el-date-picker v-model="data.startTime"
                        type="datetime"
                        @change="changeTime"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-date-picker v-model="data.endTime"
                        type="datetime"
                        @change="changeTime"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="请添加预警声音:"
                    style="margin-top:50px;"
                    prop="accessVoice">
        <el-upload class="upload-demo"
                   ref="upload"
                   :action="actionUrl"
                   :headers="headers"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :file-list="fileList"
                   :limit="1"
                   :on-change="handleChange"
                   accept="audio/*"
                   :on-exceed="handleExceed"
                   :before-upload="beforeAvatarUpload"
                   :on-success="handleAvatarSuccess"
                   v-if="!fileList.length"
                   :auto-upload="false">
          <el-button class='iconButton'
                     type="primary"
                     size='small'>
            <img :src="icons.tianjia"
                 alt="">
            添加
          </el-button>
        </el-upload>
        <el-button class='iconButton'
                   v-else
                   type="primary"
                   @click="addMusicWarnning"
                   size='small'>
          <img :src="icons.tianjia"
               alt="">
          添加
        </el-button>

        <div v-if="fileList.length">
          <gt-button :icon="icons.voice"
                     @close="deleteVoice">
            {{audioName}}
          </gt-button>
          <el-button type='text'
                     @click="shiting"
                     style="margin:0px 15px;">
            <img src="@/assets/images/shiting.png"
                 alt="">
            {{playStatus}}
          </el-button>
        </div>
      </el-form-item>
      <audio id="audio"
             ref="audio"
             :src="audioSrc"
             style="display: none;"></audio>
      <el-form-item label="预警状态:"
                    style="margin-top:50px;"
                    prop="accessStatus">
        <el-switch v-model="data.accessStatus"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>
    </el-form>
    <div class="btngr">
      <el-button type="primary"
                 class="confirmBtn"
                 :disabled="canDiaabled"
                 @click="sureClick"
                 size="small">确定</el-button>
      <el-button type="primary"
                 class="confirmBtn"
                 @click="cancelClick"
                 size="small">取消</el-button>
    </div>
    <set-time-area-dialog :visible.sync="settimevisible"
                          @confirm="confirmTime"
                          title="通行时间段">

    </set-time-area-dialog>
    <set-date-area-dialog :visible.sync="setdatevisible"
                          @confirm="confirmDate">

    </set-date-area-dialog>

    <!-- <choose-dialog :visible.sync="chooseVisible">

    </choose-dialog> -->

    <tab-tree-tag title="请选择允许通行的人"
                  rightTxt="已选的标签、部门、设备、门、人员"
                  :modal="false"
                  :tabs="tabs1"
                  :isShow.sync="chooseVisible"
                  :checkedList="peopleList"
                  @onConfirm="peopleConfirm"></tab-tree-tag>

    <div style="height:40px;"></div>

    <tab-tree-tag title="请选择允许通行的门"
                  rightTxt="已选的标签、部门、设备、门、地址、员工或居民"
                  :tabs="tabs2"
                  :modal="false"
                  :isShow.sync="chooseVisible2"
                  :checkedList="doorList"
                  @onConfirm="doorConfirm"></tab-tree-tag>

    <div style="height:40px;"></div>

  </div>
</template>

<script>
import icons from "@/common/js/icon.js";
import SetTimeAreaDialog from "@/pages/equipmentMange/components/RemoteControlDialogContent/SetTimeAreaDialog";
import SetDateAreaDialog from "@/pages/equipmentMange/components/RemoteControlDialogContent/SetDateAreaDialog";
import chooseDialog from "@/pages/doorControl/components/doorAccessConfig/chooseDialog";
import tabTreeTag from "@/common/TabTreeTag";
import buttonSelect from "@/common/buttonSelect";
import * as api from "../../utils/ajax";
import * as api2 from "@/pages/equipmentMange/ajax.js";
export default {
  name: "AddNewPowerDialog",
  computed: {
    headers() {
      return {
        Authorization: this.$store.state.home.Authorization
      };
    },
    actionUrl() {
      return "";
    },
    audioName() {
      if (this.fileList.length) {
        return this.fileList[0].name;
      }
      return "";
    },
    audioSrc() {
      console.log(this.fileList);
      if (this.fileList.length) {
        if (this.fileList[0].soundUrl) {
          return this.fileList[0].soundUrl;
        }
        let file = this.fileList[0].raw;
        var src =
          (window.createObjectURL && window.createObjectURL(file)) ||
          (window.URL && window.URL.createObjectURL(file)) ||
          (window.webkitURL && window.webkitURL.createObjectURL(file));
        return src;
      } else {
        return "";
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    warningPlanUuid: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "";
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      playStatus: "试听",
      voice: {
        name: "", // 声音的名字
        src: "" // 声音的播放源
      },
      chooseVisible: false,
      chooseVisible2: false,
      settimevisible: false,
      setdatevisible: false,
      icons,
      showTimeArea: false,
      powerVisbile: false,
      data: {
        name: "",
        people: [
          {
            resSn: 0,
            resType: "uuid44",
            resUuid: "uuid44",
            setUuid: "00012",
            version: 0
          }
        ],
        door: [
          {
            resSn: 0,
            resType: "uuid44",
            resUuid: "uuid44",
            setUuid: "00012",
            version: 0
          }
        ],
        rule: "all",
        time: "",
        accessResult: "",
        accessStatus: true,
        date: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ],
        accessStatus: [
          { required: true, message: "请选择预警状态", trigger: "change" }
        ],
        people: [
          { required: true, message: "请选择预警的人", trigger: "change" }
        ],
        door: [
          { required: true, message: "请选择预警的门", trigger: "change" }
        ],
        rule: [{ required: true, message: "请选择预警规则", trigger: "change" }]
      },
      tabs1: [
        {
          id: "1",
          label: "员工",
          treeType: "person",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "标签",
          treeType: "person",
          treeNodeType: "door",
          treeRef: "tree3",
          nodeKey: "tagUuid",
          isTag: true,
          selectSingleNode: "door"
        },
        {
          id: "3",
          label: "信息来源",
          treeType: "orgAndDev",
          treeRef: "tree4",
          hasDoor: false,
          nodeKey: "id"
        }
      ],
      tabs2: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeNodeType: "door",
          treeRef: "tree2",
          nodeKey: "id"
        },
        {
          id: "3",
          label: "标签",
          treeType: "device",
          treeNodeType: "door",
          treeRef: "tree3",
          nodeKey: "tagUuid",
          isTag: true,
          selectSingleNode: "door"
        }
      ],
      timeOptions: [],
      dateOptions: [],
      peopleList: [],
      doorList: [],
      peopleVersion: 0,
      doorVersion: 0,
      peopleCount: 0,
      doorCount: 0,
      canDiaabled: false,
      dateName: "",
      timeName: "",
      fileList: []
    };
  },
  mounted() {
    let projectType = this.$store.state.home.projectType;
    // 判断不是学校项目则加入基建的选项
    if (projectType.platformType !== "school") {
      this.tabs1.push({
        id: "2",
        label: "居民",
        treeType: "resident",
        treeNodeType: "staff",
        treeRef: "tree2",
        nodeKey: "id"
      });
      this.tabs2.push({
        id: "2",
        label: "地址",
        treeType: "resident",
        treeNodeType: "door",
        treeRef: "tree2",
        nodeKey: "id"
      });
      // 按照id 大小排序
      this.tabs1.sort((item1, item2) => {
        let id1 = Number(item1.id);
        let id2 = Number(item2.id);
        return id1 - id2;
      });
      this.tabs2.sort((item1, item2) => {
        let id1 = Number(item1.id);
        let id2 = Number(item2.id);
        return id1 - id2;
      });
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      alert(file.size);
      const isLt2M = file.size < 1048576;
      if (!isLt2M) {
        this.$message.error("文件过大，限制为多少1MB!");
      }
      return isLt2M;
    },
    addMusicWarnning() {
      this.$message.warning("最多添加一个声音!");
    },
    shiting() {
      let audio = this.$refs.audio;
      console.log(audio);
      console.log(audio.paused);

      if (this.playStatus === "试听") {
        audio.currentTime = 0;
        audio.play();
        this.playStatus = "停止";
        audio.addEventListener(
          "ended",
          () => {
            this.playStatus = "试听";
          },
          false
        );
      } else {
        audio.pause();
        audio.currentTime = 0;
        this.playStatus = "试听";
      }
    },
    handleChange(file, fileList) {
      if (file.size > 1048576) {
        this.$message.error("音乐文件过大，限制为1MB以内!");
        this.fileList = [];
        return;
      }
      if (/^audio/i.test(file.raw.type)) {
        this.playStatus = "试听";
        this.fileList = fileList;
        console.log(file);
        console.log(this.fileList);
        let param = new FormData();
        param.append("file", fileList[0].raw);
        api
          .uploadSound(param, {
            Authorization: this.$store.state.home.Authorization
          })
          .then(res => {
            console.log(res);
            this.fileList[0].soundUrl = res.data.data;
          });
      } else {
        this.$message.error("请选择音乐文件!");
      }
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    deleteVoice(index) {
      this.fileList = [];
    },
    changeTime(value) {
      if (!this.data.startTime || !this.data.endTime) {
        return;
      }
      if (this.data.startTime > this.data.endTime) {
        let t = this.data.startTime;
        this.data.startTime = this.data.endTime;
        this.data.endTime = t;
      }
    },
    getOranizitionDoor(item) {
      return new Promise((resolve, reject) => {
        api2.getTDByType(item.id, item.type).then(res => {
          console.log(res);
          resolve(res.data.data.list || []);
        });
      });
    },
    async doorConfirm(checkedNodes) {
      console.log(checkedNodes);
      let doorList = [];
      console.log(1);
      for (let i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].type !== "door") {
          let num = await this.getOranizitionDoor(checkedNodes[i]);
          for (let k = 0; k < num.length; k++) {
            let flag = this.isInNum(doorList, num[k]);
            if (!num[k].id) {
              num[k].id = num[k].channelUuid;
            }
            if (!num[k].label) {
              num[k].label = num[k].channelName;
            }

            if (!num[k].chan) {
              if (flag) {
                doorList.push(num[k]);
              }
            }
          }
        } else {
          let flag = this.isInNum(doorList, checkedNodes[i]);
          if (flag) {
            doorList.push(checkedNodes[i]);
          }
        }
      }
      console.log(2);
      this.doorList = doorList;
      console.log(doorList);
    },
    getOranizition(item) {
      return new Promise((resolve, reject) => {
        let data = {
          limit: 131111,
          page: 1,
          queryType: item.type,
          queryTypeUuid: item.id,
          staffName: ""
        };
        api.getOranizition(data).then(res => {
          console.log(res);
          resolve(res.data.data.list || []);
        });
      });
    },
    getPersonnel(item) {
      return new Promise((resolve, reject) => {
        let data = {
          page: 1,
          limit: 11111,
          projectUuid: this.$store.state.home.projectUuid,
          queryType: "organization",
          queryTypeUuid: item.id,
          staffName: "null",
          cellphone: "null",
          createTimeStart: "null",
          createTimeOver: "null",
          gender: "null",
          orgName: "null"
        };
        api.getPersonnel(data).then(res => {
          console.log(res);
          resolve(res.data.data.list || []);
        });
      });
    },
    isInNum(peopleList, item) {
      console.log(peopleList, item);
      for (let i = 0; i < peopleList.length; i++) {
        if (peopleList[i].id === item.id) {
          return false;
        }
      }
      return true;
    },
    async peopleConfirm(checkedNodes) {
      console.log(checkedNodes);
      let peopleList = [];
      console.log(1);
      for (let i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].type === "infrastructure") {
          let num = await this.getOranizition(checkedNodes[i]);
          for (let k = 0; k < num.length; k++) {
            if (!num[k].id) {
              num[k].id = num[k].staffUuid;
            }
            if (!num[k].label) {
              num[k].label = num[k].staffName;
            }
            let flag = this.isInNum(peopleList, num[k]);
            if (flag) {
              peopleList.push(num[k]);
            }
          }
        } else if (checkedNodes[i].type === "organization") {
          let num = await this.getPersonnel(checkedNodes[i]);
          for (let k = 0; k < num.length; k++) {
            if (!num[k].id) {
              num[k].id = num[k].staffUuid;
            }
            if (!num[k].label) {
              num[k].label = num[k].staffName;
            }
            let flag = this.isInNum(peopleList, num[k]);
            console.log(num);
            if (flag) {
              peopleList.push(num[k]);
            }
          }
        } else {
          let flag = this.isInNum(peopleList, checkedNodes[i]);
          if (flag) {
            peopleList.push(checkedNodes[i]);
          }
        }
      }
      console.log(2);
      this.peopleList = peopleList;
      console.log(peopleList);
    },
    confirmTime(row) {
      console.log(row);
      // 弹窗里面点击设置了时间
      let data = Object.assign({}, this.data);
      data.time = row.periodUuid;
      this.data = data;
      this.getTimeList();
    },
    confirmDate(row) {
      console.log(row);
      // 弹窗里面点击设置了时间
      let data = Object.assign({}, this.data);
      data.date = row.holidayUuid;
      this.data = data;
      this.getDateList();
    },
    sureClick() {
      if (this.canDiaabled) {
        this.$message.error("正在发送请求，请勿重复点击！");
        return;
      }
      console.log(this.fileList);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitPM();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    deletePerson(index) {
      this.peopleList.splice(index, 1);
    },
    deleteDoor(index) {
      this.doorList.splice(index, 1);
    },
    submitPM() {
      let soundUrl = null,
        soundName = null;
      if (this.fileList.length) {
        soundUrl = this.fileList[0].soundUrl;
        soundName = this.fileList[0].name;
      }
      if (!this.peopleList.length) {
        this.$message.warning("请选择预警的人!");
        return;
      }
      if (!this.doorList.length) {
        this.$message.warning("请选择预警的门!");
        return;
      }
      if (this.data.rule === "normal") {
        if (!this.data.startTime) {
          this.$message.warning("请选择预警的开始时间!");
          return;
        }
        if (!this.data.endTime) {
          this.$message.warning("请选择预警的结束时间!");
          return;
        }
      }
      let staffs = this.peopleList.map(item => {
        return {
          staffName: item.label,
          staffUuid: item.id
        };
      });
      let doors = this.doorList.map(item => {
        return {
          doorUuid: item.id,
          doorName: item.label
        };
      });
      let data = {
        subject: this.data.name /* 预警主题 */,
        reason: this.data.accessResult /* 预警原因 */,
        allTime: this.data.rule === "all" ? 1 : 0 /* 是否全时段预警 */,
        beginTime: this.data.startTime || null /* 开始预警时刻 */,
        endTime: this.data.endTime || null /* 结束预警时刻 */,
        soundUrl /* 预警声音url */,
        soundName,
        enable: this.data.accessStatus ? 1 : 0 /* 是否启用 */,
        staffs,
        doors,
        extInfo: {},
        version: this.row.version || 0,
        remarks: "string" /* 备注 */
      };
      if (this.warningPlanUuid) {
        data.warningPlanUuid = this.warningPlanUuid;
        api.updateAccessRecord(this.warningPlanUuid, data).then(res => {
          if (res.data.success) {
            this.$message.success("修改成功!");
            this.$emit("sure");
            this.close();
          }
        });
      } else {
        api.addAccessRecord(data).then(res => {
          if (res.data.success) {
            this.$message.success("添加成功!");
            this.$emit("sure");
            this.close();
          }
        });
      }
    },
    cancelClick() {
      this.$emit("update:visible", false);
    },
    chooseBtn() {
      this.chooseVisible = true;
    },
    chooseBtn2() {
      this.chooseVisible2 = true;
    },
    showTime() {
      this.settimevisible = true;
    },
    showDate() {
      this.setdatevisible = true;
    },
    changeTimeRadio(val) {
      this.showTimeArea = val === "normal";
    },
    close() {
      this.$emit("update:visible", false);
    },
    getTimeList() {
      // 获取时间段的列表
      api.getTimeListAll().then(res => {
        if (res.data.success) {
          this.timeOptions = res.data.data || [];
          this.timeOptions = this.timeOptions.map(item => {
            return {
              value: item.periodUuid,
              label: item.periodName
            };
          });
        }
      });
    },
    getDateList() {
      // 获取特殊时期列表
      api.getDateListAll().then(res => {
        if (res.data.success) {
          this.dateOptions = res.data.data || [];
          this.dateOptions = this.dateOptions.map(item => {
            return {
              value: item.holidayUuid,
              label: item.holidayName
            };
          });
        }
      });
    },
    init() {
      // this.getTimeList();
      // this.getDateList();
    },
    abcd() {
      console.log(this.row);
      // this.data.name = this.row.name;
      let peopleList = [],
        people = this.row.staffs || [];
      for (let i = 0; i < people.length; i++) {
        let item = {
          // orgSn: this.row.person[i].resSn,
          // orgName: this.row.person[i].resName,
          // orgType: this.row.person[i].resType,
          // type: this.row.person[i].resType,
          // orgUuid: this.row.person[i].resUuid,
          // id: this.row.person[i].resUuid,
          // version: this.row.person[i].version
          id: people[i].staffUuid,
          label: people[i].staffName,
          type: "staff"
        };
        peopleList.push(item);
      }
      let doorList = [],
        door = this.row.doors || [];
      console.log(door);
      for (let i = 0; i < door.length; i++) {
        let item = {
          // orgSn: this.row.door[i].resSn,
          // orgName: this.row.door[i].resName,
          // orgType: this.row.door[i].resType,
          // orgUuid: this.row.door[i].resUuid,
          // type: this.row.door[i].resType,
          // id: this.row.door[i].resUuid,
          // version: this.row.door[i].version
          id: door[i].doorUuid,
          label: door[i].doorName,
          type: "door"
        };
        doorList.push(item);
      }
      this.data.name = this.row.subject || "";
      this.data.accessResult = this.row.reason || "";
      this.data.rule = this.row.allTime === 1 ? "all" : "normal";
      this.showTimeArea = this.data.rule === "normal";
      this.peopleList = peopleList || [];
      this.doorList = doorList || [];
      this.data.startTime = this.row.beginTime;
      this.data.endTime = this.row.endTime;
      this.data.accessStatus = !!this.row.enable;
      if (this.row.soundUrl) {
        this.fileList = [
          {
            soundUrl: this.row.soundUrl,
            name: this.row.soundName
          }
        ]; // 如果有sound字段
      }
      this.row.period = this.row.period || {};
      this.row.holiday = this.row.holiday || {};
      this.data.time = this.row.period.periodUuid || "";
      this.data.date = this.row.holiday.holidayUuid || "";
      for (let i = 0; i < this.doorList.length; i++) {
        if (this.doorList[i].version) {
          this.doorVersion = parseInt(this.doorList[i].version);
          // break;
        }
      }
      for (let i = 0; i < this.peopleList.length; i++) {
        if (this.peopleList[i].version) {
          this.peopleVersion = parseInt(this.peopleList[i].version);
          // break;
        }
      }
      console.log(this.data);
    },
    back() {
      this.doorVersion = 0;
      this.peopleVersion = 0;
      this.data.name = "";
      this.playStatus = "试听";
      this.data.accessResult = "";
      this.peopleList = [];
      this.doorList = [];
      this.fileList = [];
      this.data.time = "";
      this.data.date = "";
      this.data.startTIme = "";
      this.data.endTime = "";
      this.data.rule = "all";
      this.showTimeArea = false;
      this.data.accessStatus = true;
      this.$refs.form.resetFields();
    }
  },
  watch: {
    warningPlanUuid(val) {
      if (val) {
        this.abcd();
      } else {
        this.back();
      }
      // alert(this.data.rule);
    },
    visible(val) {
      if (val) {
        if (this.warningPlanUuid) {
          this.abcd();
        }
        this.init();
      } else {
        this.back();
      }
      this.powerVisbile = val;
    },
    setdatevisible(val) {
      if (!val) {
        this.getDateList();
      }
    },
    settimevisible(val) {
      if (!val) {
        this.getTimeList();
      }
    }
  },
  components: {
    SetTimeAreaDialog,
    SetDateAreaDialog,
    chooseDialog,
    tabTreeTag,
    buttonSelect
  }
};
</script>

<style lang="scss">
.addnewPower {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.addnewPower {
  padding-bottom: 20px;
  .btngr {
    margin-top: 20px;
    margin-left: 200px;
    .confirmBtn {
      margin-right: 20px;
      @include button30;
    }
  }
  .myTitle {
    position: relative;
    font-family: " PingFangSC-Regular";
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 15px;
    text-indent: 20px;
    &::before {
      content: "";
      position: absolute;
      top: 2px;
      left: 0px;
      width: 3px;
      height: 15px;
      background: #26d39d;
    }
  }
  .asdasadasasdasdasda {
    // overflow: auto;
    // margin: 20px 0px;
    .nameInput {
      width: 150px;
    }
    .iconButton {
      @include buttonnoborder;
    }
    .dateTips {
      font-family: " PingFangSC-Regular";
      font-size: 12px;
      color: #999999;
    }
    .total {
      font-size: 12px;
      color: #999;
    }
    .showAllSelect {
      min-height: 50px;
      .sbtn {
        margin-right: 10px;
      }
    }
  }
}
</style>
