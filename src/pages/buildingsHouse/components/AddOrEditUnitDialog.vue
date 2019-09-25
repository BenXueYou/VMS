<template>
  <div class="house-main-add">
    <add-special-floor :isShow="isShowAddSpecialFloor"
                       :floorData="floorData"
                       ref="addSpecialFloor"
                       @onCancel="onCancelAddSpecialFloor"
                       @onConfirm="onConfirmAddSpecialFloor"/>
    <div class="access-main">
      <div class="dialog-title">
        <div class="title-text">新增{{specialType==="building" ? "楼栋" : "单元"}}</div>
        <div class="title-button">
          <el-button type="primary"
                     @click="onClickConfirm"
                     size="small">确定</el-button>
          <el-button type="primary"
                     @click="onClickCancel"
                     size="small">取消</el-button>
        </div>
      </div>
      <el-scrollbar style="margin-top:20px;height: 85%;transition:0.2s">
        <el-form :rules="rules"
                 ref="addUnitForm"
                 label-position="right"
                 label-width="120px"
                 :model="formLabelAlign"
                 class="info-form">
          <el-form-item :label="params ? ((params || params.node.data.type === 'area') ? '所属小区：' : '所属楼栋：') : '所属小区'"
                        prop="buildingUuid">
            <span class="path-title" style="margin-left: 10px;">{{params ? params.upAddress : "暂无"}}</span>
          </el-form-item>
          <el-form-item :label="specialType === 'building' ? '楼栋名称：' : '单元名称：'"
                        prop="unitName">
            <el-input class="time-interal left-space"
                      v-model="formLabelAlign.unitName"></el-input>
          </el-form-item>
          <el-form-item label="房屋类型："
                        prop="roomsType">
            <el-select class="time-interal left-space"
                       v-model="formLabelAlign.roomsType"
                       size="small"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in houseTypeOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房屋用途："
                        prop="roomsUse">
            <el-select class="time-interal left-space"
                       v-model="formLabelAlign.roomsUse"
                       size="small"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in houseUseOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总层数："
                        v-if="isHaveFloor"
                        prop="totalFloor">
            <div class="total-floor left-space">
              <el-input style="width: 66px;"
                        size="small"
                        type="number"
                        v-model="totalFloor"></el-input>
              <span class="item-text"
                    style="margin-left: 20px;">层号从</span>
              <el-select style="width: 65px;margin-left: 10px;"
                         v-model="beginFloor"
                         size="small"
                         placeholder="请选择">
                <el-option v-for="item in floorNumOption"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
              <span class="item-text"
                    style="margin-left: 10px;">开始</span>
            </div>
            <div>
              <el-button type="text"
                         @click="confirmFloor"
                         style="margin-left: 15px;"
                         v-show="isShowConFloor"
                         size="small">生成楼层</el-button>
              <el-button type="text"
                         @click="resetFloor"
                         style="margin-left: 15px;"
                         v-show="!isShowConFloor"
                         size="small">重置</el-button>
            </div>
            <div class="left-space floor-confirm" v-if="isShowFloorDetails">
              <div class="floor-detail">
                <template v-for="item in floorData">
                  <for-edit-button :floorName="item.floorName"
                                   :key="item.key"
                                   @setFloorName="setFloorName($event, item.key)"
                                   @deleteFloor="deleteFloor(item.key)"
                                   class="edit-button-item" />
                </template>
              </div>
              <div>
                <span class="item-text"
                      style="color: #FF5F5F;">注：</span>
                <span class="dark-text">点击修改层号，拖动调换楼层顺序。</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="isHaveFloor ? '每层房屋数：' : '房屋数：'"
                        prop="houseNum">
            <el-input class="left-space"
                      style="width: 66px;"
                      type="number"
                      v-model="houseNum"></el-input>
            <div>
              <el-button type="text"
                        @click="confirmHouse"
                        v-show="isShowConHouse"
                        style="margin-left: 15px;"
                        size="small">生成房屋</el-button>
              <el-button type="text"
                        @click="resetHouse"
                        v-show="!isShowConHouse"
                        style="margin-left: 15px;"
                        size="small">重置</el-button>
            </div>
          </el-form-item>
          <div class="house-table" v-if="isShowHouseTable">
            <el-table :data="tableData"
                      border
                      size="mini">
              <el-table-column prop="houseNumber"
                               label="房号">
                <template slot-scope="scope">
                  <el-input style="width: 100%"
                            v-model="scope.row.houseNumber"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="houseArea"
                               label="房屋面积">
                <template slot-scope="scope">
                  <el-input style="width: 100%"
                            v-model="scope.row.houseArea"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin: 15px 0px;">
              <span class="item-text"
                    style="color: #FF5F5F;">注：</span>
              <span class="dark-text">房屋名称默认为【层号】+【房号】，如B101,101,1101；</span>
            </div>
          </div>
          <el-form-item label="特殊楼层："
                        v-if="isHaveFloor"
                        prop="specialFloor">
            <div class="total-floor">
              <img src="@/assets/images/add.png"
                   class="left-space">
              <el-button type="text"
                         @click="addSpecialFloor"
                         style="margin-left: 3px;"
                         size="small">添加</el-button>
              <span class="item-text"
                    style="color: #FF5F5F;margin-left: 28px;">注：</span>
              <span class="dark-text">这些楼层不根据上述规则自动新增房屋</span>
            </div>
            <div class="special-floor-detail">
              <template v-for="item in differentFloorList">
                <for-edit-button  :floorName="item.floorName"
                                  :key="item.key"
                                  :isDisableEdit="true"
                                  @deleteFloor="deleteSpecialFloor(item.key)"
                                  class="edit-button-item" />
              </template>
            </div>
          </el-form-item>
        </el-form>
        <div style="width: 100%">
          <div class="bottom-button">
            <el-button type="primary"
                      @click="onClickConfirm"
                      size="small">确定</el-button>
            <el-button type="primary"
                      @click="onClickCancel"
                      size="small">取消</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import ForEditButton from "@/common/ForEditButton";
import AddSpecialFloor from "@/pages/buildingsHouse/components/AddSpecialFloor";
import Sortable from 'sortablejs';

export default {
  components: {
    ForEditButton,
    AddSpecialFloor
  },
  props: {},
  data() {
    const validatorlength = (rule, value, callback) => {
      this.$houseHttp
        .getInfrastructure({
          parentUuid: this.params.node.data.id
        })
        .then(res => {
          let body = res.data;
          if (body.data && body.data.some(v => v.label === value)) {
            callback(new Error("名称不能重复"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("请求错误"));
        });
    };
    return {
      params: null,
      isHaveFloor: true,
      houseTypeOptions: [],
      houseUseOptions: [],
      floorNumOption: [
        {
          name: "B2",
          value: -2
        },
        {
          name: "B1",
          value: -1
        },
        {
          name: "1",
          value: 1
        }
      ],
      totalFloor: "",
      beginFloor: 1,
      houseNum: "",
      isShowFloorDetails: false,
      floorData: [],
      tableData: [],
      isShowAddSpecialFloor: false,
      isShowHouseTable: false,
      formLabelAlign: {
        unitName: "",
        roomsType: "commodity",
        roomsUse: "complete",
        templateFloors: [],
        templateRooms: [],
        differentFloor: []
      },
      rules: {
        unitName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" },
          {
            validator: validatorlength,
            trigger: "blur"
          }
        ]
      },
      sortable: null,
      specialType: "",
      differentFloorList: [],
      isShowConFloor: true,
      isShowConHouse: true
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.houseTypeOptions = this.$common.getEnumByGroupStr("house_t");
      this.houseUseOptions = this.$common.getEnumByGroupStr("house_u");
    },
    resetFormData() {
      this.$refs.addUnitForm.resetFields();
      this.formLabelAlign = {
        unitName: "",
        roomsType: "commodity",
        roomsUse: "complete",
        templateFloors: [],
        templateRooms: [],
        differentFloor: []
      };
      this.totalFloor = "";
      this.beginFloor = 1;
      this.houseNum = "";
      this.isShowFloorDetails = false;
      this.floorData = [];
      this.tableData = [];
      this.isShowAddSpecialFloor = false;
      this.isShowHouseTable = false;
      this.isShowConFloor = true;
      this.isShowConHouse = true;
      this.differentFloorList = [];
    },
    initAddParams() {
      this.formLabelAlign.templateFloors = [];
      this.formLabelAlign.templateRooms = [];
      for (let item of this.floorData) {
        this.formLabelAlign.templateFloors.push({
          floor: item.floor,
          floorName: item.floorName,
          infrastructureUri: item.infrastructureUri
        });
      }
      for (let item of this.tableData) {
        this.formLabelAlign.templateRooms.push({
          roomNo: item.houseNumber,
          area: parseInt(item.houseArea)
        });
      }
    },
    addUnit() {
      this.initAddParams();
      this.$houseHttp
        .addUnit({
          infrastructureType: this.params.subType,
          buildingUuid: this.params.node.data.id,
          unitName: this.formLabelAlign.unitName,
          roomsType: this.formLabelAlign.roomsType,
          roomsUse: this.formLabelAlign.roomsUse,
          templateFloors: this.formLabelAlign.templateFloors,
          templateRooms: this.formLabelAlign.templateRooms,
          differentFloor: this.formLabelAlign.differentFloor
        })
        .then(res => {
          let body = res.data;
          this.addUnitSuccessResponse(body);
        });
    },
    addUnitSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm", "add");
    },
    onClickConfirm() {
      this.$refs.addUnitForm.validate(valid => {
        if (!valid) {
          this.$cToast.warn("请正确填写内容");
        } else {
          if (this.isHaveFloor && this.totalFloor && this.floorData.length === 0) {
            this.$cToast.warn("请点击确认总层数");
            return;
          }
          if (this.houseNum && this.tableData.length === 0) {
            this.$cToast.warn("请点击确认每层房屋数");
            return;
          }
          this.addUnit();
        }
      });
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    confirmFloor() {
      if (!this.totalFloor) {
        this.$cToast.warn("请输入总层数");
        return;
      }
      this.floorData = [];
      this.isShowFloorDetails = true;
      this.isShowConFloor = false;
      for (let index = 0; index < this.totalFloor; index++) {
        let floor = "";
        let floorName = "";
        if (this.beginFloor === -2) {
          if (index === 0) {
            floor = -2;
            floorName = "B2";
          } else if (index === 1) {
            floor = -1;
            floorName = "B1";
          } else {
            floor = this.beginFloor + index + 1;
            floorName = floor.toString();
          }
        } else if (this.beginFloor === -1) {
          if (index === 0) {
            floor = -1;
            floorName = "B1";
          } else {
            floor = this.beginFloor + index + 1;
            floorName = floor.toString();
          }
        } else {
          floor = this.beginFloor + index;
          floorName = floor.toString();
        }
        this.floorData.push({
          key: index,
          floor,
          floorName: floorName + "层",
          infrastructureUri: floorName + "层"
        });
      }
      setTimeout(() => {
        this.setSort();
      }, 300);
    },
    resetFloor() {
      this.floorData = [];
      this.differentFloorList = [];
      this.isShowFloorDetails = false;
      this.isShowConFloor = true;
      this.beginFloor = 1;
      this.totalFloor = "";
    },
    addSpecialFloor() {
      if (this.floorData.length !== 0) {
        this.isShowAddSpecialFloor = true;
      } else {
        this.$cToast.warn("尚未设置总层数");
      }
    },
    onConfirmAddSpecialFloor(checkList) {
      this.differentFloorList = [];
      this.formLabelAlign.differentFloor = checkList;
      this.isShowAddSpecialFloor = false;
      for (let item of this.floorData) {
        for (let item2 of this.formLabelAlign.differentFloor) {
          if (item.floor === item2) {
            this.differentFloorList.push(item);
          }
        }
      }
    },
    onCancelAddSpecialFloor() {
      this.isShowAddSpecialFloor = false;
    },
    setSort() {
      let el = null;
      el = document.querySelectorAll('.floor-detail')[0];
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        onEnd: evt => {
          const targetRow = this.floorData.splice(evt.oldIndex, 1)[0];
          // 拖拽后的数据
          console.log(evt.newIndex);
          this.floorData.splice(evt.newIndex, 0, targetRow);
        }
      });
    },
    setFloorName(e, key) {
      for (let item of this.floorData) {
        if (item.key === key) {
          this.$set(item, "floorName", e.target.value);
        }
      }
    },
    formatNumber(num) {
      let numStr = "";
      if (num < 10) {
        numStr = `0${num}`;
      } else {
        numStr = `${num}`;
      }
      return numStr;
    },
    confirmHouse() {
      if (!this.houseNum) {
        this.$cToast.warn("请输入每层房屋数");
        return;
      }
      this.tableData = [];
      this.isShowHouseTable = true;
      this.isShowConHouse = false;
      if (this.houseNum) {
        for (let index = 1; index <= parseInt(this.houseNum); index++) {
          this.tableData.push({
            houseNumber: this.formatNumber(index),
            houseArea: "100"
          });
        }
      }
    },
    resetHouse() {
      this.tableData = [];
      this.houseNum = "";
      this.isShowHouseTable = false;
      this.isShowConHouse = true;
    },
    deleteFloor(key) {
      this.floorData.forEach((currentValue, index) => {
        if (currentValue.key === key) {
          this.floorData.splice(index, 1);
        }
      });
    },
    deleteSpecialFloor(key) {
      this.differentFloorList.forEach((currentValue, index) => {
        if (currentValue.key === key) {
          this.differentFloorList.splice(index, 1);
          this.$refs.addSpecialFloor.checkList.splice(index, 1);
        }
      });
    },
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss">
.house-main-add {
  .el-form-item__label {
    font-family: PingFangSC-Regular;
    font-size: 12px !important;
    color: #dddddd;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.house-main-add {
  width: 100%;
  height: 100%;
  padding: 1.2% 1.5%;
  box-sizing: border-box;
}
.bottom-button {
  width: 150px;
  margin-left: auto;
  margin-right: 0px;
}
.access-main {
  width: 1000px;
  height: 100%;
  background: #212325;
  padding: 0 1.5%;
  box-sizing: border-box;
  .dialog-title {
    height: 75px;
    border: {
      width: 0 0 1px 0;
      color: rgba(255, 255, 255, 0.1);
      style: dashed;
    }
    display: flex;
    align-items: center;
    .title-text {
      height: 20px;
      line-height: 20px !important;
      font-family: " PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
      padding-left: 10px;
      line-height: 50px;
      border-left: 3px solid #20cc96;
    }
    .title-button {
      margin-left: auto;
      margin-right: 0;
    }
  }
  .info-form {
    .el-form-item {
      margin-bottom: 10px;
    }
    padding: 1% 2%;
    box-sizing: border-box;
    .left-space {
      margin-left: 13px;
    }
    .time-interal {
      width: 250px;
    }
    .total-floor {
      display: flex;
      align-items: center;
    }
    .floor-confirm {
      width: 80%;
      margin-top: 15px;
      .floor-detail {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
  .special-floor-detail{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .edit-button-item {
    margin-right: 13px;
    line-height: 30px;
    margin-bottom: 12px;
  }
  .item-text {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
  }
  .dark-text {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #9c9d9d;
    margin-left: 5px;
  }
  .house-table {
    width: 40%;
    margin-left: 133px;
    margin-bottom: 20px;
  }
  .path-title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>
