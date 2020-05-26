<template>
  <div class="wrap adasjdka">
    <gt-scroll class="left">
      <div class="button_group">
        <el-button type="primary"
                   size="small"
                   :disabled="!OwnAuthDisabled"
                   @click="addNewPowerClick">
          <img src="@/assets/images/addNew.png"
               style='width:12px;'
               alt=""> 新增</el-button>
      </div>

      <el-table :data="tableData"
                highlight-current-row
                @current-change="handleCurrentChange"
                ref="mytable"
                style="width: 100%">
        <el-table-column prop="subject"
                         label="预警主题"></el-table-column>
        <el-table-column prop="peopleCount"
                         width="80"
                         label="人员数量"></el-table-column>
        <el-table-column prop="doorCount"
                         width="100"
                         label="门数量"></el-table-column>
      </el-table>
    </gt-scroll>
    <div class="right"
         v-show="!powerDialogVisible">
      <div class="button_group">

        <el-button type="primary"
                   size="small"
                   :disabled="!OwnAuthDisabled"
                   @click="deletePermission"
                   icon="el-icon-delete">删除</el-button>
        <el-button type="primary"
                   size="small"
                   :disabled="!OwnAuthDisabled"
                   @click="editPermission"
                   icon="el-icon-edit-outline">编辑</el-button>
        <el-button type="primary"
                   @click="xiafa"
                   :disabled="!OwnAuthDisabled"
                   size="small">{{accessRow.enable!==1?"启用":"禁用"}}</el-button>
      </div>
      <div class="dash-line"></div>
      <!-- 内容区域 -->

      <div class="timeDateArea">
        <div class="cccc">
          <span class="label">预警主题：</span>
          <div class="aaaa">
            <span>{{accessRow.subject}}</span>
          </div>
        </div>

        <div class="cccc">
          <span class="label">预警原因：</span>
          <div class="aaaa">
            <span>{{accessRow.reason}}</span>
          </div>
        </div>

        <div class="cccc">
          <span class="label">创建人：</span>
          <div class="aaaa">
            <span>{{accessRow.createUser}}</span>
          </div>
        </div>

        <div class="cccc">
          <span class="label">创建时间：</span>
          <div class="aaaa">
            <span>{{accessRow.createTime}}</span>
          </div>
        </div>
      </div>

      <div class="doorAndPeople">
        <span class="title">需要预警的人：</span>

        <div class="mydoor">
          <p class="showMoreBtn">
            <span>共{{staffList.length}}个人</span>
            <img :src="icons.down_btn"
                 @click="MH2=(MH2!=='inherit'?'inherit':'160px')"
                 alt>
          </p>

          <div class="doorWrap"
               :style="{'max-height':MH2}">
            <gt-button :icon="icons.personHead"
                       v-for="(item,index) in staffList"
                       class="person"
                       style="margin-right:15px;"
                       :key="index"
                       :show-close="false">{{item.staffName}}</gt-button>
          </div>
        </div>
      </div>

      <div class="doorAndPeople">
        <span class="title">需要监控的门：</span>

        <div class="mydoor">
          <p class="showMoreBtn">
            <span>共{{doorList.length}}个门</span>
            <img :src="icons.down_btn"
                 @click="MH=(MH!=='inherit'?'inherit':'160px')"
                 alt>
          </p>

          <div class="doorWrap"
               :style="{'max-height':MH}">
            <gt-button :icon="icons.door"
                       v-for="(item,index) in doorList"
                       class="person"
                       style="margin-right:15px;"
                       :key="index"
                       :show-close="false">{{item.doorName}}</gt-button>
          </div>
        </div>
      </div>

      <div class="timeDateArea"
           style='margin-top:30px;'>
        <div class="dddd">
          <span class="label"
                v-if="accessRow.allTime!=1">预警时间段：{{accessRow.beginTime}} 至 {{accessRow.endTime}}</span>
          <span class="label"
                v-else>预警时间段：全时间段</span>
          <span class="label">报警声音：{{accessRow.soundName}}</span>
        </div>
      </div>

      <div class="timeDateArea"
           style='margin-top:30px;'>
        <div class="dddd">
          <span class="label">预警状态：{{accessRow.enable==1?"启用":"禁用"}}</span>
        </div>
      </div>

    </div>
    <div class="right"
         v-show="powerDialogVisible">
      <add-new-power-dialog :visible.sync="powerDialogVisible"
                            :row="rowEdit"
                            :title="newPowerTitle"
                            :warningPlanUuid="warningPlanUuidDialog"
                            @sure="permissionSure"></add-new-power-dialog>
    </div>

    <confirm-dialog :visible.sync="confirmVisible"
                    @confirm="confirmDelete"
                    :confirmText="confirmText"></confirm-dialog>

    <confirm-dialog :visible.sync="xiafaConfirmVisible"
                    @confirm="confirmXiafa"
                    :confirmText="confirmXiafaText"></confirm-dialog>
    <the-company-table-xiafa-dialog :visible.sync="TheCompanyTableXiafaDialogVisible"></the-company-table-xiafa-dialog>

    <staff-dialog :visible.sync="personDialogVisible"
                  :data="staffList"></staff-dialog>

    <door-dialog :visible.sync="doorDialogVisible"
                 :data="doorList"></door-dialog>
  </div>
</template>

<script>
import TheCompanyTableXiafaDialog from "@/pages/equipmentMange/components/TheCompanyTableXiafaDialog";
import icons from "@/common/js/icon.js";
import ConfirmDialog from "@/common/ConfirmDialog";
import AddNewPowerDialog from "@/pages/doorControl/components/doorAccessConfig/AddNewAccess";
import * as api from "@/pages/doorControl/utils/ajax.js";
import * as api2 from "@/pages/equipmentMange/ajax.js";
import staffDialog from "@/common/showStaffDialog";
import doorDialog from "@/common/showDoorDialog";
// import { turnTimesArea, turnWeek, turnWeekToNumber } from "@/utils/date.js";
import RestApi from "@/utils/RestApi.js";
export default {
  data() {
    return {
      icons,
      tableData: new Array(0).fill({
        name: "xxxxxxx主题",
        doorCount: 10,
        peopleCount: 20
      }),
      MH: "160px", // 通过设置max-height的值来控制展开与显示
      MH2: "210px",
      updateTime: "",
      createTime: "",
      updateMan: "",
      time: [],
      date: [],
      doorCount: 0,
      peopleCount: 0,
      powerDialogVisible: false,
      xiafaConfirmVisible: false,
      confirmVisible: false,
      TheCompanyTableXiafaDialogVisible: false,
      isAddOrEdit: false, // 是添加还是修改的标志
      permissionId: "", // 修改权限的当前ID
      row: {},
      warningPlanUuid: "",
      warningPlanUuidDialog: "",
      confirmText: "",
      confirmXiafaText: "",
      rowEdit: {},
      newPowerTitle: "",
      warningPlanUuidNum: [],
      groupName: "",
      doorNum: [],
      peopleNum: [],
      doorChildNum: [],
      staffInfo: {
        name: "",
        sex: "",
        zhuhu: "",
        phone: "",
        address: "",
        pic: icons.defaultHead
      },
      staffList: [],
      doorList: [],
      personDialogVisible: false,
      doorDialogVisible: false,
      accessRow: {
        warningPlanUuid: "" /* 预案UUID */,
        subject: "" /* 预警主题 */,
        reason: "" /* 预警原因 */,
        allTime: 1 /* 是否全时段预警 */,
        beginTime: "" /* 开始预警时刻 */,
        endTime: "" /* 结束预警时刻 */,
        sound: "" /* 预警声音url */,
        enable: "" /* 是否启用 */,
        extInfo: {},
        remarks: "" /* 备注 */,
        createTime: "" /* 创建时间 */,
        updateTime: "" /* 更新时间 */,
        version: "" /* 版本 */
      },
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
    };
  },
  activated() {
    this.getQXList();
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("人员预警记录", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("人员预警记录", "isOwn");
  },
  methods: {
    showDoor(item) {
      // console.log(item);
      // if (item.resType === "organization") {
      //   // 组织
      //   api2.getTDByOrgUuid(item.resUuid).then(res => {
      //     console.log(res);
      //     if (res.data.success) {
      //       this.doorList = res.data.data || [];
      //     }
      //   });
      // } else if (item.resType === "access_ctrl") {
      //   // 设备
      //   api2.getTDByDUuid(item.resUuid).then(res => {
      //     console.log(res);
      //     if (res.data.success) {
      //       this.doorList = res.data.data || [];
      //     }
      //   });
      // } else if (item.resType === "door") {
      //   // 门
      // }
      // 重新调用一个接口
      if (item.resType === "door") {
      } else {
        this.doorList = [];
        api2.getTDByType(item.resUuid, item.resType).then(res => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data) {
              this.doorList = res.data.data.list || [];
            }
          }
        });
      }
    },
    showPeople(item) {
      console.log(item);

      if (item.resType === "staff" || item.resType === "resident") {
        let data = {
          staffUuid: item.resUuid
        };
        this.staffInfo = {};
        api.staffDetail(data).then(res => {
          let data = res.data || {};
          if (data) {
            let transfer = JSON.parse(sessionStorage.localEnums);
            if (data.lifePictureUrl) {
              data.lifePictureUrl = RestApi.api.imageUrl + data.lifePictureUrl;
            }
            this.staffInfo = {
              name: data.staffName || "",
              sex: transfer.gender[data.gender],
              zhuhu: transfer.staff_t[data.staffType] || "",
              phone: data.cellphone || "",
              address: data.address || "",
              pic: data.lifePictureUrl || icons.defaultHead
            };
          }
        });
      } else {
        let data = {
          resourceType: item.resType
        };
        api2.getResource(data, item.resUuid).then(res => {
          console.log(res);
          if (res.data.success) {
            let result = res.data.data || [];
            let transfer = JSON.parse(sessionStorage.localEnums);
            for (let i = 0, len = result.length; i < len; i++) {
              result[i].sex = transfer.gender[result[i].gender];
              result[i].nation = transfer.nation[result[i].nation];
            }
            this.staffList = result;
          }
        });
      }
    },
    lookMoreDoor() {
      this.doorDialogVisible = true;
    },
    lookMorePerson() {
      this.personDialogVisible = true;
    },
    confirmXiafa() {
      // 下发一个人员预警进出记录
      api
        .xiafa({
          authGroupUuids: this.warningPlanUuidNum
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.TheCompanyTableXiafaDialogVisible = true;
            // this.$message.error("数据下发成功！");
          }
        });
    },
    xiafa() {
      if (!this.row.warningPlanUuid) {
        this.$message.error("请选择人员预警进出记录!");
        return;
      }
      // console.log(this.row);
      let enable = this.row.enable === 1 ? 0 : 1;
      // let data = {
      //   prewarningUuid: this.row.warningPlanUuid,
      //   enable
      // };
      api
        .updateAccessRecordStatus(this.row.warningPlanUuid, enable)
        .then(res => {
          if (res.data.success) {
            this.$message.success(`${enable === 1 ? "启用" : "禁用"}成功!`);
            this.getQXDetail(this.row.warningPlanUuid);
            console.log(this.row);
          }
        });
    },
    clickRow(row, column, event) {
      this.row = row;
      api.getQXDetail(row.warningPlanUuid).then(res => {
        console.log(res);
      });
    },
    handleCurrentChange(row) {
      console.log(row);
      if (row && row.warningPlanUuid) {
        this.row = row;
        this.rowEdit = row;
        // this.warningPlanUuidDialog = row.warningPlanUuid;
        this.getQXDetail(row.warningPlanUuid);
      }
    },
    getQXDetail(warningPlanUuid) {
      api.getAccessDetail(warningPlanUuid).then(res => {
        if (res.data.success) {
          let data = res.data.data || {};
          this.staffList = data.staffs || [];
          this.doorList = data.doors || [];
          console.log(data);
          this.accessRow = data;
          this.row = data;
        }
      });
    },
    getQXList(operator) {
      api
        .getAccessList({
          page: 1,
          size: 10000
        })
        .then(res => {
          console.log(res);
          let data = res.data.data;
          if (data && data.list) {
            let list = data.list;
            list = list.map(item => {
              item.peopleCount = (item.staffUuid && item.staffUuid.length) || 0;
              item.doorCount = (item.doorUuid && item.doorUuid.length) || 0;
              return item;
            });
            this.tableData = list;
            console.log(this.tableData);
            if (!this.row.warningPlanUuid) {
              if (data.list.length) {
                // 如果是进来，则获取一次默认第一个的权限详情
                this.$refs.mytable.setCurrentRow(this.tableData[0]);
                // this.getQXDetail(this.tableData[0].warningPlanUuid);
              }
            } else {
              // last则表示新增之后，则选择最后一个
              if (operator === "last") {
                this.$refs.mytable.setCurrentRow(
                  this.tableData[this.tableData.length - 1]
                );
              } else if (data.list.length) {
                let index = 0;
                for (let i = 0; i < data.list.length; i++) {
                  if (
                    data.list[i].warningPlanUuid === this.row.warningPlanUuid
                  ) {
                    index = i;
                    break;
                  }
                }
                this.$refs.mytable.setCurrentRow(this.tableData[index]);
              }
            }
          }
        });
    },
    permissionSure() {
      // 成功新增人员预警进出记录之后,需要选中新增的人员预警进出记录
      if (this.row.warningPlanUuid) {
        this.getQXList();
      } else {
        this.getQXList("last");
      }
    },
    addNewPowerClick() {
      this.rowEdit = {};
      this.newPowerTitle = "新建人员进出预警";
      this.warningPlanUuidDialog = "";
      this.powerDialogVisible = true;
    },
    editPermission() {
      this.warningPlanUuidDialog = this.row.warningPlanUuid;
      if (this.row.warningPlanUuid) {
        this.warningPlanUuid = this.row.warningPlanUuid;
      }
      console.log(this.row);
      if (this.warningPlanUuid) {
        this.newPowerTitle = "编辑人员进出预警";
        api.getAccessDetail(this.row.warningPlanUuid).then(res => {
          if (res.data.success) {
            this.rowEdit = res.data.data;
            this.powerDialogVisible = true;
          }
        });
      } else {
        this.$message.error("请选择左边的一个列表");
      }
    },
    confirmDelete() {
      api.deleteAccessRecord(this.row.warningPlanUuid).then(res => {
        if (res.data.success) {
          this.$message.success("删除人员进出预警记录成功！");
          this.row = {};
          this.getQXList();
        }
      });
    },
    deletePermission() {
      if (this.row.warningPlanUuid) {
        this.confirmText = `是否删除名称为 ${this.row.subject} 的人员进出预警记录`;
        this.confirmVisible = true;
      } else {
        this.$message.error("请选择左边的一个列表");
      }
    }
  },
  components: {
    AddNewPowerDialog,
    ConfirmDialog,
    TheCompanyTableXiafaDialog,
    staffDialog,
    doorDialog
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";

.hoverPerson {
  box-sizing: border-box;
  .personContent {
    height: 130px;
    overflow: hidden;
  }
  .person {
    margin-right: 10px;
    margin-top: 10px;
  }
  .lookmore {
    text-align: right;
    @include font-m;
    color: $add-text-color;
    cursor: pointer;
  }
  .head {
    display: inline-block;
    width: 92px;
    height: 92px;
    // background-color: #fff;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .personainfo {
    display: inline-block;
    @include font-s;
    vertical-align: top;
    padding-top: 10px;
    padding-left: 10px;
    p {
      margin: 0px;
      line-height: 25px;
      span {
        display: inline-block;
        &:nth-child(2) {
          padding: 0px 10px;
        }
      }
    }
  }
}
.hoverContent {
  background-color: #2a2e31;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .gt-button {
    width: 30%;
    margin-top: 5px;
  }
}
.noDataTips {
  text-align: center;
  color: #fff;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.wrap {
  .gtbutton {
    margin-right: 15px;
    margin-bottom: 15px;
  }

  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;

  $leftWidth: 450px;
  $rightMarginRight: 20px;
  .left {
    width: $leftWidth;
    padding: $rightContentPadding;
    background-color: $rigthContentBackgroundColor;
    box-sizing: border-box;
    overflow: auto;
    .button_group {
      margin: 0px 0px 20px;
    }
  }
  .right {
    position: relative;
    margin-left: 20px;
    width: calc(100% - #{$rightMarginRight} - #{$leftWidth});
    padding: $rightContentPadding;
    background-color: $rigthContentBackgroundColor;
    overflow: auto;

    $wrapBg: rgba(255, 255, 255, 0.03);
    $titleWidth: 140px;
    .message {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .doorAndPeople {
      background: $wrapBg;
      margin-top: 10px;
      padding: 20px 0px;
      font-size: 0px;
      .doorWrap {
        margin-top: 20px;
        max-height: 200px;
        overflow: hidden;
      }
      .mydoor {
        display: inline-block;
        width: calc(100% - #{$titleWidth});
        padding-left: 20px;
        box-sizing: border-box;
        .showMoreBtn {
          margin: 0px;
          @include font-m;
          span {
            display: inline-block;
          }
          img {
            cursor: pointer;
            padding-left: 10px;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
      .title {
        display: inline-block;
        width: $titleWidth;
        text-align: right;
        vertical-align: top;
        @include font-m;
      }
    }
    .timeDateArea {
      background-color: $wrapBg;
      padding: 15px 0px;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      white-space: nowrap;
      .dddd {
        display: flex;
        span {
          flex: 1;
          &:first-child {
            padding-left: 30px;
          }
        }
      }
      .cccc {
        padding: 8px 20px 8px;
        margin: 0px;
        vertical-align: top;
        .aaaa {
          display: inline-block;
          .time {
            padding-right: 25px;
          }
        }
        @include font-m;
        .label {
          width: 120px;
          text-align: right;
          display: inline-block;
          vertical-align: top;
        }
      }
    }
    .headInfo {
      display: flex;
      justify-content: space-between;
      line-height: 20px;
      margin: 20px 0px 10px;
      @include font-m;
      .name {
        padding: 10px 0px;
        width: 160px;
        background: $wrapBg;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        .div {
          span {
            height: 20px;
          }
        }
      }
      .timeInfo {
        padding: 10px 0px;
        display: flex;
        flex-wrap: wrap;
        .flexItem {
          white-space: nowrap;
          img {
            padding-left: 0px;
          }
        }
      }
    }
    .button_group {
      margin-bottom: 20px;
      overflow: hidden;
      button {
        float: right;
        margin-right: 10px;
        margin-left: 0px;
      }
    }
  }
}
</style>
