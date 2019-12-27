<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             class="editEquip"
             :visible.sync="editEquipmentDialogVisible">
    <gt-scroll class="body"
               ref='scroll'>
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="130px"
               class="demo-ruleForm">

        <el-form-item label="设备名称："
                      prop="nickName">
          <el-input v-model.trim="ruleForm.nickName"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item class="showMsg"
                      label="设备IP：">
          <el-input v-model.trim="ruleForm.deviceIp"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="设备端口号：">
          <el-input v-model.trim="ruleForm.devicePort"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="用户名：">
          <el-input v-model.trim="ruleForm.deviceUsername"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="密码：">
          <el-input v-model.trim="ruleForm.devicePassword"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="所属子服务：">
          <el-select v-model="ruleForm.belongServiceUuid"
                     placeholder="请选择">
            <el-option v-for="item in localService"
                       :key="item.value"
                       :label="item.belongServiceName"
                       :value="item.belongServiceUuid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备类型："
                      prop="deviceType">
          <el-select v-model="ruleForm.deviceType"
                     placeholder="请选择">
            <el-option v-for="item in deviceTypeArr"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <!-- <el-input v-model="ruleForm.deviceType"
                    readonly></el-input> -->
        </el-form-item>

        <el-form-item label="组织结构："
                      prop="orgUuid">
          <popover-tree width="250px"
                        orgType="device"
                        :name="orgName"
                        @setUseData="setOrgData"
                        ref="popoverTree" />
        </el-form-item>

        <el-form-item label="楼栋单元："
                      prop="infrastructureUuid">
          <build-house-popover-tree width="250px"
                                    :name="houseName"
                                    :houseUuid="houseUuid"
                                    @setUseData="setHouseData" />
        </el-form-item>

        <el-form-item label="设备描述："
                      prop="remarks">
          <el-input v-model.trim="ruleForm.remarks"
                    size="samll"></el-input>
        </el-form-item>
      </el-form>
      <person-tree-tag title="请选择要添加的标签"
                       rightTxt="已选择的标签"
                       :isShow.sync="isShow"
                       :treeType="treeType"
                       :isTag="true"
                       :checkedNodeArr="checkedNode"
                       @onCancel="onCancel"
                       @onConfirm="onConfirm"></person-tree-tag>
    </gt-scroll>
    <div slot="footer"
         class="footer">
      <el-button @click="confirm"
                 type="primary">确定</el-button>
      <el-button @click="close"
                 type="primary">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PopoverTree from "@/common/selectOrgTree";
// 这是楼栋房屋只到单元的下拉框树
import BuildHousePopoverTree from "@/common/BuildHousePopoverTree2";
import personTreeTag from "@/common/personTreeTag";
import icons from "@/common/icon.js";
import * as api from "../ajax";
export default {
  name: "ManualAddDialog",
  components: {
    PopoverTree,
    BuildHousePopoverTree,
    personTreeTag
  },
  props: {
    localService: {
      type: Array,
      default() {
        return [];
      }
    },
    serverList: {
      type: Array,
      default() {
        return [];
      }
    },
    deviceTypeArr: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: String,
      default() {
        return "500px";
      }
    },
    title: {
      type: String,
      default() {
        return "手动搜索";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
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
      options: [],
      houseUuid: "", // 楼栋房屋的ID
      treeType: window.config.tagType,
      isShow: false,
      icons,
      door: "",
      checkedNode: [],
      ruleForm: {
        belongServiceName: "",
        belongServiceUuid: "",
        deviceIp: "",
        devicePassword: "",
        devicePort: 0,
        deviceType: "",
        deviceUsername: "",
        deviceUuid: "",
        infrastructureUuid: "",
        nickName: "",
        orgUuid: "",
        remarks: ""
      },
      rules: {
        nickName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ],
        remarks: [
          { required: false, message: "请输入设备描述名称", trigger: "blur" },
          {
            min: 0,
            max: 200,
            message: "长度在 200 个字符以内",
            trigger: "blur"
          }
        ],
        deviceIp: [
          { required: true, message: "请填写设备ip", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
        ],
        devicePort: [
          { required: true, message: "请填写设备端口", trigger: "blur" }
        ],
        deviceUsername: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        devicePassword: [
          { required: true, message: "请填写密码", trigger: "blur" }
        ],
        belongServiceUuid: [
          { required: true, message: "请选择子服务", trigger: "blur" }
        ],
        deviceType: [
          { required: true, message: "请填写设备类型", trigger: "blur" }
        ],
        orgUuid: [
          { required: true, message: "请选择选择架构", trigger: "change" }
        ],
        infrastructureUuid: [
          { required: false, message: "请选择楼栋房屋", trigger: "change" }
        ]
      },
      editEquipmentDialogVisible: false,
      doorData: [],
      dutouData: [],
      shuchuData: [],
      shuruData: [],
      whichType: 1,
      whichIndex: 0,
      orgName: "",
      houseName: ""
    };
  },
  mounted() {
    // this.editEquipmentDialogVisible = this.visible;
    // this.name = this.value;
  },
  methods: {
    deleteTag(type, i, j) {
      let key = "";
      if (type === 1) {
        key = "doorData";
      } else if (type === 2) {
        key = "dutouData";
      } else if (type === 3) {
        key = "shuruData";
      } else if (type === 4) {
        key = "shuchuData";
      }
      console.log(key);
      this[key][i].tagPOList.splice(j, 1);
      console.log(this[key][i]);
      this.delteTagChannel(
        this[key][i].tagPOList,
        this[key][i].channelUuid,
        this[key][i].channelType
      );
      this[key].concat();
    },
    chooseTag(whichType, index, x) {
      this.whichType = whichType;
      this.whichIndex = parseInt(index);
      let data = [],
        key = "doorData";
      if (this.whichType === 1) {
        key = "doorData";
      } else if (this.whichType === 2) {
        key = "dutouData";
      } else if (this.whichType === 3) {
        key = "shuruData";
      } else if (this.whichType === 4) {
        key = "shuchuData";
      }
      data = this[key][this.whichIndex].tagPOList;
      for (let i = 0; i < data.length; i++) {
        data[i].id = data[i].tagUuid;
        data[i].label = data[i].tagName;
      }
      this.checkedNode = JSON.parse(JSON.stringify(data));
      this.isShow = true;
    },
    onCancel() {
      this.isShow = false;
    },
    delteTagChannel(data, channelUuid, channelType) {
      api.deleteChannelTagUrl(data, channelUuid, channelType).then(res => {
        console.log(res);
      });
    },
    onConfirm(data) {
      console.log(data);
      let key = "";
      if (this.whichType === 1) {
        key = "doorData";
      } else if (this.whichType === 2) {
        key = "dutouData";
      } else if (this.whichType === 3) {
        key = "shuruData";
      } else if (this.whichType === 4) {
        key = "shuchuData";
      }
      this[key][this.whichIndex].tagPOList = data;
      this[key].concat();
      let channelUuid = this[key][this.whichIndex].channelUuid;
      let channelType = this[key][this.whichIndex].channelType;
      this.delteTagChannel(data, channelUuid, channelType);
      this.isShow = false;
    },
    setOrgData(params) {
      // 获取组织架构的数据
      // this.maxTagSn = params.maxTagSn;
      this.ruleForm.orgUuid = params.node.data.orgUuid;
    },
    setHouseData(params) {
      this.ruleForm.infrastructureUuid = params.node.data.id;
      this.houseName = params.node.data.label;
    },
    saveData() {
      const getServiceNameByUuid = uuid => {
        return this.localService.filter(v => {
          return v.belongServiceUuid === uuid;
        })[0].belongServiceName;
      };

      let data = {
        belongServiceName: getServiceNameByUuid(
          this.ruleForm.belongServiceUuid
        ),
        belongServiceUuid: this.ruleForm.belongServiceUuid,
        deviceIp: this.ruleForm.deviceIp,
        devicePassword: this.ruleForm.devicePassword,
        devicePort: this.ruleForm.devicePort,
        deviceType: this.ruleForm.deviceType,
        deviceUsername: this.ruleForm.deviceUsername,
        deviceUuid: this.ruleForm.deviceUuid,
        infrastructureUuid: this.ruleForm.infrastructureUuid,
        nickName: this.ruleForm.nickName,
        orgUuid: this.ruleForm.orgUuid,
        remarks: this.ruleForm.remarks
      };
      console.log(data);

      api.manualEquipment(data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("保存成功！");
          this.$emit("update:visible", false);
          this.$emit("commit");
        }
      });
    },
    confirm() {
      console.log(this.doorData);
      console.log(this.dutouData);
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(this.row);
        this.ruleForm = {
          belongServiceName: "",
          belongServiceUuid: "",
          deviceIp: "",
          devicePassword: "",
          devicePort: 0,
          deviceType: "",
          deviceUsername: "",
          deviceUuid: "",
          infrastructureUuid: "",
          nickName: "",
          orgUuid: "",
          remarks: ""
        };
        // 记录门状态
        if (this.row.org && this.row.org.length) {
          this.orgName = this.row.org[0].orgName;
        }

        this.houseName = this.row.infrastructureName;
        this.houseUuid = this.row.infrastructureUuid;
        console.log(this.ruleForm);
        this.$nextTick(() => {
          this.$refs.scroll.initBar();
        });
      } else {
        this.orgName = "";
        this.houseName = "";
        this.$refs.ruleForm.resetFields();
      }
      this.editEquipmentDialogVisible = this.visible;
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.editEquip {
  input {
    @include input30;
  }
  .demo-ruleForm {
    input {
      width: 250px;
    }
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item__label {
    line-height: 30px;
  }
  .devIp {
    line-height: 30px;
    @include font-s;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .showMsg {
    margin-bottom: 10px;
  }
  .el-select {
    height: 30px;
    .el-input {
      height: 30px;
      line-height: 30px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: $--color-primary;
  }
  .el-dialog__header {
    border-width: 0px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
  padding: 10px 30px 30px;
  box-sizing: border-box;
}
$dashline: 1px dashed rgba(255, 255, 255, 0.1);
.editEquip {
  // width: 1000px;
  // background: #212325;
  .header {
    padding-left: 30px;
    .buttongroup {
      float: right;
      margin-right: 30px;
      margin-top: 5px;
      .button {
        width: 66px;
        @include button30;
      }
    }
    .shuline {
      position: relative;
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
      line-height: 50px;
      padding-left: 5px;
      &::after {
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        width: 3px;
        height: 14px;
        background: $add-text-color;
      }
    }
  }
  .body {
    height: calc(100vh - 290px);
    overflow-y: auto;
    padding: 20px 0px 10px;
    margin: 0px 30px 30px;
    border-top: $dashline;
    .devIp {
      @include font-s;
    }
    .righttips {
      float: right;
      .test {
        padding-right: 20px;
      }
      .refresh {
        cursor: pointer;
        img {
          display: inline-block;
          vertical-align: middle;
        }
        color: $add-text-color;
      }
    }
    .section {
      border-top: $dashline;
      .form-item {
        padding-left: 100px;
        $mleft: 10px;
        margin-bottom: 15px;
        vertical-align: top;
        .el-input {
          display: inline-block;
          width: 160px;
          vertical-align: top;
        }
        .button {
          vertical-align: middle;
          margin-left: $mleft;
          margin-bottom: 10px;
        }
        .addIcon {
          margin-left: $mleft;
          border: none;
          background: none;
          @include font-s;
          color: $add-text-color;
        }
        .label {
          display: inline-block;
          @include font-s;
          width: 80px;
          vertical-align: top;
        }
        .mytagWrap {
          display: inline-block;
          width: calc(100% - 300px);
        }
      }
      .head {
        padding: 10px 20px;
        @include font-s;
        img {
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
      }
    }
  }
}
.footer {
  @include padding;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  padding-left: 160px;
  button {
    width: 66px;
    @include button30;
  }
}
</style>
