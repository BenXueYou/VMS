<template>
  <div class="wrap adasjdka">
    <div class="left">
      <div class="button_group">
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   size="small"
                   @click="addNewPowerClick"
                   icon="el-icon-edit-outline">新增</el-button>
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   @click="xiafaAll"
                   size="small">全部下发</el-button>
      </div>

      <el-table :data="tableData"
                highlight-current-row
                @current-change="handleCurrentChange"
                ref="mytable"
                style="width: 100%">
        <el-table-column prop="name"
                         label="名称"></el-table-column>
        <el-table-column prop="doorCount"
                         width="80"
                         label="门数量"></el-table-column>
        <el-table-column prop="peopleCount"
                         width="100"
                         label="人员数量"></el-table-column>
      </el-table>
    </div>
    <div class="right"
         v-show="!powerDialogVisible">
      <div class="button_group">
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   size="small"
                   @click="deletePermission"
                   icon="el-icon-delete">删除</el-button>
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   size="small"
                   @click="editPermission"
                   icon="el-icon-edit-outline">编辑</el-button>
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   @click="xiafa"
                   size="small">下发权限</el-button>
      </div>
      <div class="dash-line"></div>
      <!-- 内容区域 -->
      <div class="headInfo">
        <div class="name">
          <div class="div">
            <span>名称：{{groupName}}</span>
          </div>
        </div>
        <div class="timeInfo">
          <div class="flexItem">
            <img :src="icons.time"
                 alt />
            <span>更新时间：{{updateTime}}</span>
          </div>
          <div class="flexItem">
            <img :src="icons.time"
                 alt />
            <span>创建时间：{{createTime}}</span>
          </div>
          <div class="flexItem">
            <img :src="icons.time"
                 alt />
            <span>更新人：{{updateMan}}</span>
          </div>
        </div>
      </div>

      <div class="timeDateArea">
        <div class="cccc">
          <span class="label">通行时间段：</span>
          <div class="aaaa">
            <div v-for="(item,index) in time"
                 :key="index">
              <span class="time">{{item.time}}</span>
              <span class="area">{{item.area}}</span>
            </div>
          </div>
        </div>

        <div class="cccc">
          <span class="label">特殊时间：</span>
          <div class="aaaa">
            <div v-for="(item,index) in date"
                 :key="index">
              <span class="time">{{item.beginDate}} ~ {{item.endDate}}</span>
              <span class="area"
                    v-for="(v,i) in item.content"
                    :key="i">开始时间：{{v.begin}} ~ 结束时间：{{v.end}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="doorAndPeople">
        <span class="title">门：</span>

        <div class="mydoor">
          <p class="showMoreBtn">
            <span>共{{doorCount}}个门</span>
            <img :src="icons.down_btn"
                 @click="MH=(MH!=='inherit'?'inherit':'160px')"
                 alt />
          </p>

          <div class="doorWrap"
               :style="{'max-height':MH}">
            <el-popover placement="bottom-start"
                        v-if="item.resType !== 'door'"
                        width="320"
                        trigger="hover"
                        v-for="(item,index) in doorNum"
                        :key="index"
                        @show="showDoor(item)"
                        class="message">
              <div v-if="item.resType!='door'"
                   class="hoverPerson">
                <div class="personContent">
                  <gt-button :icon="icons.door"
                             v-for="(item,index) in doorList"
                             class="person"
                             :key="index"
                             :show-close="false">{{item.nickName}}</gt-button>
                  <div v-if="!doorList.length"
                       class="noDataTips">没有更多数据</div>
                </div>
                <div class="lookmore"
                     v-if="doorList.length>6"
                     @click="lookMoreDoor">查看更多》</div>
              </div>

              <gt-button :icon="icons.door"
                         slot="reference"
                         :show-close="false">{{item.resName}}</gt-button>
            </el-popover>
            <gt-button :icon="icons.door"
                       v-else
                       class="gtbutton"
                       :show-close="false">{{item.resName}}</gt-button>
          </div>
        </div>
      </div>

      <div class="doorAndPeople">
        <span class="title">组内成员：</span>

        <div class="mydoor">
          <p class="showMoreBtn">
            <span>共{{peopleCount}}个人</span>
            <img :src="icons.down_btn"
                 @click="MH2=(MH2!=='inherit'?'inherit':'160px')"
                 alt />
          </p>

          <div class="doorWrap"
               :style="{'max-height':MH2}">
            <el-popover placement="bottom-start"
                        width="240"
                        trigger="hover"
                        v-for="(item,index) in peopleNum"
                        :key="index"
                        @show="showPeople(item)"
                        class="message">
              <!-- 当前新建的权限组选取的是叶子节点，没有选择树节点，则直接展示该人员信心 -->
              <div v-if="item.resType=='staff' || item.resType=='resident'"
                   class="hoverPerson">
                <div class="head">
                  <img :src="staffInfo.pic"
                       alt />
                </div>
                <div class="personainfo">
                  <p>
                    <span>{{staffInfo.name}}</span>
                    <span>{{staffInfo.sex}}</span>
                    <span>{{staffInfo.zhuhu}}</span>
                  </p>
                  <p>
                    <span>{{staffInfo.phone}}</span>
                  </p>
                  <p>
                    <span>{{staffInfo.address}}</span>
                  </p>
                </div>
              </div>
              <!-- 当前新建的权限组选取的是选择树节点，则查找该节点的下的人员列表 -->
              <div v-else
                   class="hoverPerson">
                <!-- <div class="xulie">
                    {{index}}
                  </div>
                  <div class="name">
                    {{item.staffName}}
								</div>-->
                <div class="personContent">
                  <gt-button :icon="icons.personHead"
                             v-for="(item,index) in staffList"
                             class="person"
                             :key="index"
                             :show-close="false">{{item.staffName}}</gt-button>
                  <div v-if="!staffList.length"
                       class="noDataTips">没有更多数据</div>
                </div>
                <div class="lookmore"
                     @click="lookMorePerson"
                     v-if="staffList.length>6">查看更多》</div>
              </div>

              <gt-button :icon="(item.resType=='staff'||item.resType=='resident')?icons.personHead:icons.folder"
                         slot="reference"
                         :show-close="false">{{item.resName}}</gt-button>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <div class="right"
         v-show="powerDialogVisible">
      <add-new-power-dialog :visible.sync="powerDialogVisible"
                            :row="rowEdit"
                            :title="newPowerTitle"
                            :groupUuid="groupUuidDialog"
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
                  @loadNextPage='loadNextPage'
                  :data="staffList"></staff-dialog>

    <door-dialog :visible.sync="doorDialogVisible"
                 :data="doorList"></door-dialog>
  </div>
</template>

<script>
import TheCompanyTableXiafaDialog from "@/pages/equipmentMange/components/TheCompanyTableXiafaDialog";
import icons from "@/common/icon.js";
import ConfirmDialog from "@/common/ConfirmDialog";
import AddNewPowerDialog from "@/pages/doorControl/components/doorAccessConfig/AddNewPowerDialog";
import * as api from "@/pages/doorControl/utils/ajax.js";
import * as api2 from "@/pages/equipmentMange/ajax.js";
import staffDialog from "@/common/showStaffDialog";
import doorDialog from "@/common/showDoorDialog";
import { turnTimesArea, turnWeek, turnWeekToNumber } from "@/utils/date.js";
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
      groupUuid: "",
      groupUuidDialog: "",
      confirmText: "",
      confirmXiafaText: "",
      rowEdit: {},
      newPowerTitle: "",
      groupUuidNum: [],
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
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      selectHoverItem: null,
      currentPage: 1
    };
  },
  activated() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("权限组", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("权限组", "isOwn");
    if (!this.ShowAuthDisabled) return;
    this.getQXList();
  },
  mounted() {
    // this.getQXList();
  },
  methods: {
    showDoor(item) {
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
    loadNextPage(data) {
      console.log(data);
      if (this.currentPage) {
        if (
          this.selectHoverItem.resType !== "staff" ||
          this.selectHoverItem.resType !== "resident"
        ) {
          this.currentPage++;
          let data = {
            resourceType: this.selectHoverItem.resType,
            page: this.currentPage,
            limit: 15
          };
          this.httpAccessGroupStaffNode(data, this.selectHoverItem);
        }
      }
    },
    showPeople(item) {
      console.log(item);
      this.selectHoverItem = item;
      this.currentPage = 1;
      this.staffList = [];
      if (item.resType === "staff" || item.resType === "resident") {
        let data = {
          staffUuid: item.resUuid
        };
        this.staffInfo = {};
        this.httpAccessGroupStaffInfo(data);
      } else {
        let data = {
          resourceType: item.resType,
          limit: 15,
          page: 1
        };
        this.httpAccessGroupStaffNode(data, item);
      }
    },
    // 查看权限组内所有节点，包含的人员列表
    httpAccessGroupStaffNode(data, item) {
      api2.getResource(data, item.resUuid).then(res => {
        if (res.data.success) {
          let result = res.data.data || [];
          let transfer = JSON.parse(sessionStorage.localEnums);
          for (let i = 0, len = result.length; i < len; i++) {
            result[i].sex = transfer.gender[result[i].gender];
            result[i].nation = transfer.nation[result[i].nation];
          }
          // this.staffList = result;
          console.log(data, "========", result);
          if (result && !result.length) {
            this.currentPage = 0;
            return;
          }
          this.staffList = this.staffList.concat(result);
        }
      });
    },
    httpAccessGroupStaffInfo(data) {
      api.staffDetail(data).then(res => {
        let data = res.data || {};
        if (data) {
          let transfer = JSON.parse(sessionStorage.localEnums);
          if (data.lifePictureUrl) {
            data.lifePictureUrl = this.$common.setPictureShow(
              data.lifePictureUrl
            );
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
    },
    lookMoreDoor() {
      this.doorDialogVisible = true;
    },
    lookMorePerson() {
      this.personDialogVisible = true;
    },
    confirmXiafa() {
      // 下发一个权限组
      api
        .xiafa({
          authGroupUuids: this.groupUuidNum,
          deviceType: "IAC"
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.TheCompanyTableXiafaDialogVisible = true;
            // this.$message.error("数据下发成功！");
          }
        });
    },
    xiafaAll() {
      if (!this.tableData.length) {
        this.$message.error("没有可以下发的权限组");
        return;
      }
      // 下发所有的权限组
      this.groupUuidNum = [];
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        this.groupUuidNum.push(this.tableData[i].groupUuid);
      }
      this.confirmXiafaText = "是否下发所有的权限组!";
      this.xiafaConfirmVisible = true;
    },
    xiafa() {
      if (!this.row.name) {
        this.$message.error("请选择下发的权限组!");
        return;
      }
      console.log(this.row);
      this.confirmXiafaText = `是否下发名称为 ${this.row.name} 的权限组`;
      this.xiafaConfirmVisible = true;
      this.groupUuidNum = [];
      this.groupUuidNum.push(this.row.groupUuid);
    },
    clickRow(row, column, event) {
      this.row = row;
      api.getQXDetail(row.groupUuid).then(res => {
        console.log(res);
      });
    },
    handleCurrentChange(row) {
      if (row && row.groupUuid) {
        this.row = row;
        // this.rowEdit = row;
        // this.groupUuidDialog = row.groupUuid;
        this.getQXDetail(row.groupUuid);
      }
    },
    getQXDetail(groupUuid) {
      api.getQXDetail(groupUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data || {};
          this.groupName = data.groupName;
          this.updateTime = data.updateTime;
          this.createTime = data.createTime;
          this.updateMan = data.staffName;
          // 通行时段
          // this.time1 = turnWeek（;
          // this.area1 = "";
          // this.time2 = "";
          // this.area2 = "";
          let period = data.period || [],
            time = [];
          for (let i = 0; i < period.length; i++) {
            period[i].weekday = period[i].weekday.map(val => {
              return turnWeekToNumber(val);
            });
            period[i].weekday = period[i].weekday.sort();
            time.push({
              time: turnWeek(period[i].weekday),
              area: turnTimesArea(period[i].time)
            });
          }
          this.time = time;
          this.date = data.holiday;
          this.doorCount = data.doorNum;
          this.peopleCount = data.staffNum;
          this.doorNum = data.door;
          this.peopleNum = data.person;
        }
      });
    },
    getQXList(operator) {
      api.getQXList({ limit: 1000, page: 1, groupType: "normal" }).then(res => {
        console.log(res);
        let data = res.data.data;
        this.tableData = [];
        if (data && data.list) {
          let num = [];
          for (let i = 0; i < data.list.length; i++) {
            num.push({
              name: data.list[i].groupName,
              doorCount: data.list[i].doorNum,
              peopleCount: data.list[i].staffNum,
              groupUuid: data.list[i].groupUuid
            });
          }

          this.tableData = num;
          if (!this.row.groupUuid) {
            if (data.list.length) {
              // 如果是进来，则获取一次默认第一个的权限详情
              this.$refs.mytable.setCurrentRow(this.tableData[0]);
              // this.getQXDetail(this.tableData[0].groupUuid);
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
                if (data.list[i].groupUuid === this.row.groupUuid) {
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
      // 成功新增权限组之后,需要选中新增的权限组
      if (this.row.groupUuid) {
        this.getQXList();
      } else {
        this.getQXList("last");
      }
    },
    addNewPowerClick() {
      this.rowEdit = {};
      this.newPowerTitle = "新增门禁权限组";
      this.groupUuidDialog = "";
      this.powerDialogVisible = true;
    },
    editPermission() {
      this.groupUuidDialog = this.row.groupUuid;
      if (this.row.groupUuid) {
        this.groupUuid = this.row.groupUuid;
      }
      console.log(this.row);
      if (this.groupUuid) {
        this.newPowerTitle = "修改门禁权限组";
        api
          .editPMUrl(this.row.groupUuid, { groupType: "visitor" })
          .then(res => {
            console.log(res);
            this.rowEdit = res.data.data;
            this.powerDialogVisible = true;
          });
      } else {
        this.$message.error("请选择左边的一个列表");
      }
    },
    confirmDelete() {
      api.deletePermission(this.row.groupUuid).then(res => {
        if (res.data.success) {
          this.$message.success("删除权限组成功！");
          this.row = {};
          this.groupName = "";
          this.updateTime = "";
          this.createTime = "";
          this.updateMan = "";
          this.peopleNum = [];
          this.doorList = [];
          this.doorNum = [];
          this.peopleCount = 0;
          this.doorCount = 0;
          this.getQXList();
        }
      });
    },
    deletePermission() {
      if (this.row.groupUuid) {
        this.confirmText = `是否删除名称为 ${this.row.name} 的权限组规则`;
        this.confirmVisible = true;
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
