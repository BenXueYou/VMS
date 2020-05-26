<template>
  <el-form :model="ruleForm"
           :rules="rules"
           ref="ruleFormRef"
           label-width="130px"
           class="demo-ruleForm">
    <el-form-item class="showMsg"
                  label="设备IP：">
      <div class="devIp">{{ruleForm.ip}}</div>
    </el-form-item>

    <el-form-item class="showMsg"
                  label="设备序列号：">
      <div class="devIp">{{ruleForm.tagSn}}</div>
    </el-form-item>

    <el-form-item label="设备名称："
                  prop="nickName">
      <el-input v-model.trim="ruleForm.nickName"
                :readonly="!isOneProject"
                size="samll"></el-input>
    </el-form-item>
    <el-form-item label="设备IP："
                  v-if="isLocal">
      <el-input :readonly="!isOneProject"
                v-model.trim="ruleForm.deviceIp"
                size="samll"></el-input>
    </el-form-item>

    <el-form-item label="设备端口号："
                  v-if="isLocal">
      <el-input :readonly="!isOneProject"
                v-model.trim="ruleForm.devicePort"
                size="samll"></el-input>
    </el-form-item>

    <el-form-item label="用户名："
                  v-if="isLocal">
      <el-input :readonly="!isOneProject"
                v-model.trim="ruleForm.deviceUsername"
                size="samll"></el-input>
    </el-form-item>

    <el-form-item label="密码："
                  v-if="isLocal">
      <el-input :readonly="!isOneProject"
                v-model.trim="ruleForm.devicePassword"
                size="samll"></el-input>
    </el-form-item>

    <el-form-item label="所属子服务："
                  v-if="isLocal">
      <el-select v-model="ruleForm.belongServiceUuid"
                 :disabled="!isOneProject"
                 @change="changeOptions"
                 placeholder="请选择">
        <el-option v-for="item in localService"
                   :key="item.value"
                   :label="item.belongServiceName"
                   :value="item.belongServiceUuid"></el-option>
      </el-select>
    </el-form-item>
    <!-- 上面都是新增的 -->
    <el-form-item label="设备类型："
                  prop="deviceType">
      <el-select disabled
                 v-model="ruleForm.deviceType"
                 placeholder="请选择">
        <el-option v-for="item in deviceTypeArr"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <!-- <el-input v-model="ruleForm.deviceType"
                    readonly></el-input> -->
    </el-form-item>
    <!-- 新增一些选项 -->
    <el-form-item label="设备型号：">
      <el-input readonly
                v-model.trim="ruleForm.productType"
                size="samll"></el-input>
    </el-form-item>

    <el-form-item label="组织结构："
                  prop="oriz">
      <popover-tree v-if="isOneProject"
                    width="250px"
                    orgType="device"
                    :name="orgName"
                    :isOneProject="!isOneProject"
                    :orgUuid="orgUuid"
                    @setUseData="setOrgData"
                    ref="popoverTree" />
      <el-input v-else
                :readonly="!isOneProject"
                v-model.trim="orgName"
                size="samll"></el-input>
    </el-form-item>

    <el-form-item v-if="$store.state.home.projectType.platformType !== 'school'"
                  label="楼栋单元："
                  prop="build">
      <build-house-popover-tree v-if="isOneProject"
                                width="250px"
                                :name="houseName"
                                :houseUuid="houseUuid"
                                @setUseData="setHouseData" />
      <el-input v-else
                :readonly="!isOneProject"
                v-model.trim="houseName"
                size="samll"></el-input>
    </el-form-item>
    <el-form-item label="1400上传国标码"
                  prop="gBCode">
      <el-input :readonly="!isOneProject"
                v-model.trim="ruleForm.gBCode"
                size="samll"></el-input>
    </el-form-item>
    <el-form-item label="设备描述："
                  prop="desc">
      <el-input :readonly="!isOneProject"
                v-model.trim="ruleForm.desc"
                size="samll"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import PopoverTree from "@/common/selectOrgTree";
import BuildHousePopoverTree from "@/common/BuildHousePopoverTree2";
export default {
  name: "EditDeviceBaseTop",
  components: {
    PopoverTree,
    BuildHousePopoverTree
  },
  props: {
    isLocal: {
      type: Boolean,
      default: false
    },
    houseUuid: {
      type: String,
      default: ""
    },
    houseName: {
      type: String,
      default: ""
    },
    orgName: {
      type: String,
      default: ""
    },
    orgUuid: {
      type: String,
      default: ""
    },
    isOneProject: {
      type: false,
      default: true
    },
    rules: {
      type: Object,
      default() {
        return {
          nickName: [
            { required: true, message: "请输入设备名称", trigger: "blur" },
            {
              min: 1,
              max: 32,
              message: "长度在 4 到 32 个字符",
              trigger: "blur"
            }
          ],
          desc: [
            { required: false, message: "请输入设备描述名称", trigger: "blur" },
            {
              min: 0,
              max: 200,
              message: "长度在 200 个字符以内",
              trigger: "blur"
            }
          ],
          deviceType: [
            { required: false, message: "请选择设备型号", trigger: "change" }
          ],
          oriz: [
            { required: false, message: "请选择选择架构", trigger: "change" }
          ],
          build: [
            { required: false, message: "请选择楼栋房屋", trigger: "change" }
          ]
        };
      }
    },
    deviceTypeArr: {
      type: Array,
      default() {
        return [];
      }
    },
    FormData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      ruleForm: {}
    };
  },
  mounted() {},
  methods: {
    setHouseData(params) {
      this.ruleForm.build = params.node.data.id;
      // this.houseName = params.name;
    },
    setOrgData(params) {
      // 获取组织架构的数据
      // this.maxTagSn = params.maxTagSn;
      this.ruleForm.oriz = params.node.data.orgUuid;
    }
  },
  watch: {
    FormData: {
      handler(newVal, oldVal) {
        this.ruleForm = JSON.parse(JSON.stringify(newVal));
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
