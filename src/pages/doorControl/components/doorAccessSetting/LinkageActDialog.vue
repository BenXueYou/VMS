<template>
  <el-dialog width="30%"
             :title="isAdd?`新增联动预案`:`修改联动预案`"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="linkForm"
               :label-position="labelPosition"
               label-width="95px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="预案名称："
                      prop="planName">
          <el-input class="time-interal"
                    clearable
                    v-model="formLabelAlign.planName"></el-input>
        </el-form-item>
        <el-form-item label="设备："
                      prop="deviceUuid">
          <el-popover class="popverTree"
                      ref="popverBox"
                      :popper-class="elPopoverClass"
                      :visible-arrow="false"
                      :value="visible_popver"
                      @show="showPopver()"
                      @hide="hidePopver()"
                      placement="bottom-start"
                      trigger="click">
            <el-row style="width:300px;">
              <tab-tree :tabs="tabs"
                        :visible="visible_popver"
                        :show-input="false"
                        :checkeTreedNodes="checkeTreedNodes"
                        @transferCheckedNodes="transferCheckedNodes"></tab-tree>
            </el-row>
            <el-input slot="reference"
                      :style="`width: 85%`"
                      v-model="formLabelAlign.deviceName"
                      :clearable="true"
                      @clear="clearAction()"
                      placeholder="请选择设备"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="触发条件："
                      prop="triggerCondition"
                      required>
          <el-select class="time-interal"
                     v-model="formLabelAlign.triggerCondition"
                     clearable
                     @focus="hidePopover"
                     placeholder="请选择触发条件">
            <el-option v-for="item in triggerConditionOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发位置："
                      prop="triggerPos"
                      required>
          <el-select class="time-interal"
                     v-model="formLabelAlign.triggerPos"
                     clearable
                     @focus="hidePopover"
                     no-data-text="请先选择设备"
                     placeholder="请选择触发位置">
            <el-option v-for="item in triggerPosOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="联动类型："
                      prop="linkageType"
                      required>
          <el-select class="time-interal"
                     v-model="formLabelAlign.linkageType"
                     clearable
                     placeholder="请选择联动类型">
            <el-option v-for="item in linkageTypeOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="联动位置："
                      prop="linkagePos"
                      required>
          <el-select class="time-interal"
                     v-model="formLabelAlign.linkagePos"
                     clearable
                     @change="onChangeLinkageOption"
                     @focus="hidePopover"
                     no-data-text="请先选择设备"
                     placeholder="请选择联动位置">
            <el-option v-for="item in linkagePosOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联动动作："
                      prop="linkageOp"
                      required>
          <el-select class="time-interal"
                     v-model="formLabelAlign.linkageOp"
                     clearable
                     @focus="hidePopover"
                     placeholder="请选择联动动作">
            <el-option v-for="item in linkageOpOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="small"
                 @click="onClickConfirm">确定</el-button>
      <el-button type="primary"
                 size="small"
                 @click="onClickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TabTree from "@/common/TabTree.vue";

export default {
  components: {
    TabTree
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        planUuid: "",
        planName: "",
        deviceName: "",
        triggerCondition: "",
        deviceUuid: "",
        // linkageType: "",
        triggerPos: "",
        linkagePos: "",
        linkageOp: ""
      },
      rules: {
        planName: [
          {
            required: true,
            message: "预案名称不能为空",
            trigger: "blur"
          }
        ],
        deviceUuid: {
          required: true,
          message: "设备不能为空",
          trigger: "blur"
        },
        triggerCondition: {
          required: true,
          message: "触发条件不能为空",
          trigger: "change"
        },
        /* linkageType: {
          required: true,
          message: "联动类型不能为空",
          trigger: "change"
        }, */
        triggerPos: {
          required: true,
          message: "触发位置不能为空",
          trigger: "change"
        },
        linkagePos: {
          required: true,
          message: "联动位置不能为空",
          trigger: "change"
        },
        linkageOp: {
          required: true,
          message: "联动动作不能为空",
          trigger: "change"
        }
      },
      triggerConditionOptions: [],
      // linkageTypeOptions: [],
      triggerPosOptions: [],
      linkagePosOptions: [],
      linkageOpOptions: [],
      elPopoverClass: "elPopover",
      visible_popver: false,
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id",
          hasDoor: false,
          radio: true,
          treeLeafType: "device"
        }
      ],
      checkeTreedNodes: []
    };
  },
  created() {},
  mounted() {
    let projectType = this.$store.state.home.projectType;
    // 判断不是学校项目则加入基建的选项
    if (projectType.platformType !== "school") {
      this.tabs.push({
        id: "2",
        label: "地址",
        treeType: "resident",
        treeNodeType: "device",
        treeRef: "tree2",
        nodeKey: "id",
        radio: true,
        treeLeafType: "device"
      });
    }
    this.initData();
  },
  methods: {
    clearAction() {
      this.checkeTreedNodes = [];
      this.formLabelAlign.deviceName = "";
      this.formLabelAlign.deviceUuid = "";
    },
    initData() {
      this.triggerConditionOptions = this.$common.getEnumByGroupStr(
        "door_plan_t"
      );
      // this.linkageTypeOptions = this.$common.getEnumByGroupStr("linkage");
      // this.linkageOpOptions = this.$common.getEnumByGroupStr("door_plan_d");
    },
    addLink() {
      let holder = {
        deviceUuid: this.formLabelAlign.deviceUuid,
        linkageOp: this.formLabelAlign.linkageOp,
        linkagePos: this.formLabelAlign.linkagePos,
        // linkageType: this.formLabelAlign.linkageType,
        planName: this.formLabelAlign.planName,
        triggerCondition: this.formLabelAlign.triggerCondition,
        triggerPos: this.formLabelAlign.triggerPos
      };
      this.$DoorSetAjax.postLinkageAct(holder).then(res => {
        let body = res.data;
        this.addLinkSuccessResponse(body);
      });
    },
    addLinkSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
    updateLink() {
      this.$DoorSetAjax
        .putLinkageActApi({
          planUuid: this.formLabelAlign.planUuid,
          deviceUuid: this.formLabelAlign.deviceUuid,
          linkageOp: this.formLabelAlign.linkageOp,
          linkagePos: this.formLabelAlign.linkagePos,
          // linkageType: this.formLabelAlign.linkageType,
          planName: this.formLabelAlign.planName,
          triggerCondition: this.formLabelAlign.triggerCondition,
          triggerPos: this.formLabelAlign.triggerPos,
          version: this.formLabelAlign.version
        })
        .then(res => {
          let body = res.data;
          this.updateLinkSuccessResponse(body);
        });
    },
    updateLinkSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    onClickConfirm() {
      const isPass = this.validForm();
      if (!isPass) {
        this.$cToast.error("请正确填写内容");
      } else {
        if (this.isAdd) {
          this.addLink();
        } else {
          this.updateLink();
        }
      }
    },
    validForm() {
      let validResult = false;
      this.$refs.linkForm.validate(valid => {
        if (valid) {
          validResult = true;
        }
      });
      return validResult;
    },
    resetFormData() {
      this.$refs.linkForm.resetFields();
      this.formLabelAlign = {
        planUuid: "",
        planName: "",
        triggerCondition: "",
        deviceUuid: "",
        // linkageType: "",
        triggerPos: "",
        linkagePos: "",
        linkageOp: ""
      };
      this.linkagePosOptions = [];
      this.triggerPosOptions = [];
      this.checkeTreedNodes = [];
      this.formLabelAlign.deviceName = "";
    },
    showPopver() {
      this.visible_popver = true;
    },
    hidePopver() {
      this.visible_popver = false;
    },
    transferCheckedNodes(data, nodeBool, treeName) {
      if (nodeBool) {
        this.formLabelAlign.deviceName = data.label;
        this.formLabelAlign.deviceUuid = data.id;
      } else {
        this.formLabelAlign.deviceName = "";
        this.formLabelAlign.deviceUuid = "";
      }
      this.formLabelAlign.triggerPos = "";
      this.formLabelAlign.linkagePos = "";
      this.getDeviceDoorVO(this.formLabelAlign.deviceUuid);
    },
    getDeviceDoorVO(deviceUuid) {
      if (!deviceUuid) {
        return;
      }
      this.$DoorSetAjax.getDeviceDoorVO(deviceUuid).then(res => {
        let body = res.data;
        this.getDeviceDoorVOSuccessResponse(body);
      });
    },
    getDeviceDoorVOSuccessResponse(body) {
      this.linkagePosOptions = [];
      this.triggerPosOptions = [];
      if (body && body.data) {
        for (let item of body.data.linkagePosList) {
          let linkageActionOp = [];
          for (let item2 of item.extInfo.linkageAction) {
            linkageActionOp.push({
              typeName: this.$common.getEnumItemName("door_plan_d", item2),
              typeStr: item2
            });
          }
          this.linkagePosOptions.push({
            typeName: item.label,
            typeStr: item.id,
            type: item.type,
            linkageOption: linkageActionOp
          });
        }
        for (let item of body.data.triggerPosList) {
          this.triggerPosOptions.push({
            typeName: item.label,
            typeStr: item.id,
            type: item.type
          });
        }
      }
    },
    hidePopover() {
      this.$refs.popverBox.isShowPopover = false;
      this.visible_popver = false;
    },
    onChangeLinkageOption(val) {
      if (this.linkagePosOptions) {
        for (let item of this.linkagePosOptions) {
          if (item.typeStr === val) {
            this.linkageOpOptions = item.linkageOption;
          }
        }
      }
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.firstCardPopver {
  max-height: 70%;
  overflow: auto;
}
</style>

<style lang="scss" scoped>
.dialog-content {
  padding: 2% 2%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
.topTitleTxt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
}
.time-interal {
  width: 85%;
}
.info-form {
  width: 75%;
  margin: 0 auto;
}
</style>
