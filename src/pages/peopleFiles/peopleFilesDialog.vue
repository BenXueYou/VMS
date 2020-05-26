<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             class='peopleFilesDialog dialogCenter'
             :close-on-click-modal="false"
             :modal="false"
             :close-on-press-escape="false"
             :append-to-body="true"
             :visible.sync='peopleFilesDialogVisiable'>
    <div class="wrap">
      <div class="leftWrap">
        <div class="imgWrap">
          <img :src="lifePictureUrl"
               v-show-bigimage
               alt="">
        </div>
        <div class="infoPannel">
          <p v-for="(item,index) in infoData"
             class='infoPannelItem'
             :key="index">
            <span class='title'>{{item.title}}：</span>
            <span v-if="item.name==='addressOrgList'">
              <p v-for="(it,ix) in item.value"
                 @click="showHouse(ix)"
                 style="cursor:pointer;"
                 class='address'
                 :key="ix">
                {{it.infrastructureAddress.replace(/\／/g,"/")}}
              </p>
            </span>
            <span v-else>{{item.value}}</span>
          </p>
          <div>
            <span>人员标签：</span>
            <div class="tagWrap">
              <div v-for="(item,index) in tag"
                   class="tagDiv"
                   :key="index">{{item}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightWrap">
        <ul class='headerasdasd'>
          <li v-for="(item,index) in menu"
              :class="{'active':index==activeIndex}"
              @click="switchTab(index)"
              :key="index">
            {{item.title}}</li>
        </ul>
        <div class="rightContent"
             ref="rightContent">
          <component :is="componentId"
                     v-if="visible"
                     :staffUuid="staffUuidInset"
                     :house="house"
                     :projectUuid='projectUuid'
                     @update="update"></component>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import DoorRecord from "./components/DoorRecord";
import ShotRecord from "./components/ShotRecord";
import ConnectCar from "./components/ConnectCar";
import PastCarRecord from "./components/PastCarRecord";
import Fans from "./components/Fans";
import AlarmEvent from "./components/AlarmEvent";
import * as api from "@/pages/communityBoard/utils/ajax.js";
export default {
  name: "PersonFilesDialog",
  components: {
    DoorRecord,
    ShotRecord,
    ConnectCar,
    PastCarRecord,
    Fans,
    AlarmEvent
  },
  props: {
    projectUuid: {
      type: String,
      default() {
        return this.$store.state.home.projectUuid;
      }
    },
    moduleName: {
      type: String,
      default() {
        return "";
      }
    },
    subModuleName: {
      type: String,
      default() {
        return "";
      }
    },
    staffUuid: {
      type: String,
      default() {
        return "ad1ade70bb764426941ed657494e266f";
      }
    },
    staffName: {
      type: String,
      default() {
        return "ad1ade70bb764426941ed657494e266f";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "一人一档";
      }
    },
    width: {
      type: String,
      default() {
        return "1300px";
      }
    }
  },
  computed: {
    componentId() {
      return this.menu[this.activeIndex].component;
    }
  },
  data() {
    return {
      isBHFShow: false,
      infrastructureUuid: "",
      staffUuidInset: "",
      lifePictureUrl: "",
      peopleFilesDialogVisiable: false,
      httpResData: {},
      infoData: [
        {
          name: "staffName",
          title: "姓名",
          value: ""
        },
        {
          name: "gender",
          title: "性别",
          value: ""
        },
        {
          name: "nation",
          title: "民族",
          value: ""
        },
        {
          name: "nativePlace",
          title: "籍贯",
          value: ""
        },
        {
          name: "credentialNo",
          title: "证件号码",
          value: ""
        },
        {
          name: "birthday",
          title: "出生日期",
          value: ""
        },
        {
          name: "education",
          title: "文化水平",
          value: ""
        },
        {
          name: "maritalStatus",
          title: "婚姻状态",
          value: ""
        },
        {
          name: "cellphone",
          title: "联系方式",
          value: ""
        },
        {
          name: "staffType",
          title: "人员类型",
          value: ""
        },
        {
          name: "addressOrgList",
          title: "住址",
          value: []
        }
      ],
      tag: [],
      activeIndex: 0,
      menu: [
        {
          title: "门禁记录",
          component: "DoorRecord"
        },
        {
          title: "抓拍记录",
          component: "ShotRecord"
        },
        {
          title: "关联机动车",
          component: "ConnectCar"
        },
        {
          title: "过车记录",
          component: "PastCarRecord"
        },
        {
          title: "同住人",
          component: "Fans"
        },
        {
          title: "报警事件",
          component: "AlarmEvent"
        }
      ],
      ManFeatureArr: window.config.ManFeatureArr,
      StrengthArr: window.config.StrengthArr,
      house: []
    };
  },
  mounted() {
    this.getData();
    this.activeIndex = 0;
    console.log("一人一档-----", this.projectUuid);
  },
  methods: {
    hideName(str, len) {
      if (!str) {
        return "";
      }
      let s = str.substr(0, len);
      s += "*".repeat(str.length - len * 2);
      s += str.substr(str.length - len, len);
      return s;
    },
    showHouse(index) {
      let uuid = this.house[index].infrastructureUuid;
      this.infrastructureUuid = uuid;
      this.isBHFShow = true;
      this.$bus.$emit("showBuildHouseFiles", {
        projectUuid: this.projectUuid,
        infrastructureUuid: this.infrastructureUuid,
        subModuleName: this.subModuleName,
        address: this.returnAddress(this.house),
        moduleName: this.moduleName
      });
    },
    returnAddress(house) {
      let address = "";
      house.forEach(element => {
        // eslint-disable-next-line no-useless-escape
        address += element.infrastructureAddress.replace(/\／/g, "/");
      });
      return address;
    },
    update(staffUuid) {
      this.activeIndex = 0;
      this.staffUuidInset = staffUuid;
      this.getData();
    },
    getData() {
      if (!this.staffUuidInset) {
        return;
      }
      this.tag = [];
      api
        .getStaffDetail(
          {
            uuid: this.staffUuidInset,
            projectUuid: this.projectUuid
          },
          {
            modelName: this.moduleName,
            detailContent: `查看${this.subModuleName || ""}${this.staffName ||
              ""}居民的一人一档`
          }
        )
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            this.httpResData = data;
            for (let i = 0, len = this.infoData.length; i < len; i++) {
              let name = data[this.infoData[i].name];
              if (this.infoData[i].name === "gender") {
                name = this.$common.getEnumItemName("gender", name);
              } else if (this.infoData[i].name === "maritalStatus") {
                name = this.$common.getEnumItemName("marital", name);
              } else if (this.infoData[i].name === "education") {
                name = this.$common.getEnumItemName("edu", name);
              } else if (this.infoData[i].name === "nation") {
                name = this.$common.getEnumItemName("nation", name);
              } else if (this.infoData[i].name === "staffType") {
                name = this.$common.getEnumItemName("staff_t", name);
              } else if (this.infoData[i].name === "birthday") {
                name = data.credentialNo.substr(6, 8);
              } else if (this.infoData[i].name === "credentialNo") {
                name = this.hideName(data.credentialNo, 4);
              } else if (this.infoData[i].name === "cellphone") {
                name = this.hideName(data.cellphone, 3);
              } else if (this.infoData[i].name === "staffName") {
                name = this.hideName(data.staffName, 1);
              }
              this.infoData[i].value = name;
            }
            this.house = data.addressOrgList;
            let featureList = data.featureList;
            let strengthList = data.strengthList;

            let tag = [],
              // eslint-disable-next-line
              flag = false;
            for (let i = 0; i < featureList.length; i++) {
              for (let j = 0; j < this.ManFeatureArr.length; j++) {
                if (this.ManFeatureArr[j].id === featureList[i]) {
                  tag.push(this.ManFeatureArr[j].label);
                  break;
                }
              }
            }
            for (let i = 0; i < strengthList.length; i++) {
              for (let j = 0; j < this.StrengthArr.length; j++) {
                if (this.StrengthArr[j].id === strengthList[i]) {
                  tag.push(this.StrengthArr[j].label);
                  break;
                }
              }
            }
            this.tag = data.tagInofShows.map(item => {
              return item.tagName;
            });
            console.log(tag);
            this.tag.push(...tag);

            this.lifePictureUrl = data.lifePictureUrl;
          }
        })
        .catch(() => {
          this.resetData();
        });
    },
    switchTab(index) {
      this.activeIndex = index;
    },
    close() {
      this.resetData();
      this.$emit("update:visible", false);
    },
    resetData() {
      this.lifePictureUrl = "";
      this.infoData = [
        {
          name: "staffName",
          title: "姓名",
          value: ""
        },
        {
          name: "gender",
          title: "性别",
          value: ""
        },
        {
          name: "nation",
          title: "民族",
          value: ""
        },
        {
          name: "nativePlace",
          title: "籍贯",
          value: ""
        },
        {
          name: "credentialNo",
          title: "证件号码",
          value: ""
        },
        {
          name: "birthday",
          title: "出生日期",
          value: ""
        },
        {
          name: "education",
          title: "文化水平",
          value: ""
        },
        {
          name: "maritalStatus",
          title: "婚姻状态",
          value: ""
        },
        {
          name: "cellphone",
          title: "联系方式",
          value: ""
        },
        {
          name: "staffType",
          title: "人员类型",
          value: ""
        },
        {
          name: "addressOrgList",
          title: "住址",
          value: []
        }
      ];
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.staffUuidInset = this.staffUuid;
        console.log("一人一档----visible----", this.projectUuid);
        this.getData();
      } else {
        this.staffUuidInset = "";
        this.activeIndex = 0;
        this.resetData();
      }
      this.peopleFilesDialogVisiable = val;
    }
  }
};
</script>

<style lang="scss" scoped>
$leftWrapWidth: 330px;
.peopleFilesDialog {
  >>> .el-dialog__body {
    height: 830px;
  }
  .wrap {
    display: flex;
    height: 100%;
    .tagWrap {
      display: flex;
      flex-wrap: wrap;
      .tagDiv {
        width: 100px;
        margin-right: 5px;
        margin-top: 5px;
        line-height: 40px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
    }
    .leftWrap {
      width: $leftWrapWidth;
      padding: 15px 30px;
      box-sizing: border-box;
      .imgWrap {
        width: 100px;
        height: 100px;
        margin: 30px auto;
        // background: #fff;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .infoPannel {
        font-family: "PingFangSC-Regular";
        font-size: 16px;
        color: #dddddd;
        text-align: justify;
        .infoPannelItem {
          display: flex;
          flex-wrap: wrap;
          .title {
            min-width: 70px;
          }
          .address {
            margin: 0px;
            font-family: "PingFangSC-Regular";
            font-size: 16px;
            color: #25d298;
            text-align: justify;
            line-height: 22px;
            white-space: nowrap;
          }
        }
      }
    }
    .rightWrap {
      width: calc(100% - #{$leftWrapWidth});
      height: 100%;
      padding: 25px;
      box-sizing: border-box;
      border-left: 1px dashed rgba(151, 151, 151, 0.3);
      .headerasdasd {
        padding: 0px;
        margin: 0px;
        li {
          cursor: pointer;
          display: inline-block;
          margin-right: 5px;
          padding: 0px 18px;
          line-height: 40px;
          background: rgba(255, 255, 255, 0.05);
          font-family: "PingFangSC-Regular";
          font-size: 18px;
          color: #bbbbbb;
          text-align: justify;
        }
        .active {
          color: #fff;
          background: rgba(37, 210, 152, 0.25);
          border: 1px solid rgba(37, 210, 152, 0.3);
        }
      }
      .rightContent {
        border: 1px solid rgba(37, 210, 152, 0.3);
        height: calc(100% - 40px);
        padding: 15px;
        box-sizing: border-box;
        overflow: auto;
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
