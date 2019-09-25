<template>
  <div class="editEquip">
    <div class="header">
      <span class="shuline">设备编辑</span>
      <div class="buttongroup">
        <el-button @click="confirm"
                   class="button"
                   size="small"
                   type="primary">保存</el-button>
        <el-button @click="close"
                   class="button"
                   size="small"
                   type="primary">取消</el-button>
      </div>
    </div>
    <gt-scroll class="body"
               ref='scroll'>
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
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
                    size="samll"></el-input>
        </el-form-item>
        <!-- 新增一些选项 -->
        <!-- <el-form-item label="设备序列号：">
          <el-input v-model.trim="ruleForm.nickName"
                    size="samll"></el-input>
        </el-form-item> -->

        <el-form-item label="设备IP："
                      v-if="isLocal">
          <el-input v-model.trim="ruleForm.deviceIp"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="设备端口号："
                      v-if="isLocal">
          <el-input v-model.trim="ruleForm.devPort"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="用户名："
                      v-if="isLocal">
          <el-input v-model.trim="ruleForm.username"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="密码："
                      v-if="isLocal">
          <el-input v-model.trim="ruleForm.password"
                    size="samll"></el-input>
        </el-form-item>

        <el-form-item label="所属子服务："
                      v-if="isLocal">
          <el-select v-model="ruleForm.service"
                     @change="changeOptions"
                     style="width:100%;"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 上面都是新增的 -->
        <el-form-item label="设备型号："
                      prop="devMode">
          <el-input v-model="ruleForm.devMode"
                    readonly></el-input>
        </el-form-item>

        <el-form-item label="组织结构："
                      prop="oriz">
          <popover-tree width="250px"
                        orgType="device"
                        :name="orgName"
                        :orgUuid="orgUuid"
                        @setUseData="setOrgData"
                        ref="popoverTree" />
        </el-form-item>

        <el-form-item label="楼栋单元："
                      prop="build">
          <build-house-popover-tree width="250px"
                                    :name="houseName"
                                    :houseUuid="houseUuid"
                                    @setUseData="setHouseData" />
        </el-form-item>

        <el-form-item label="设备描述："
                      prop="desc">
          <el-input v-model.trim="ruleForm.desc"
                    size="samll"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary"
                 v-if="isLocal"
                 @click="syncChannel">同步通道</el-button>
      <div class="section door"
           v-if="doorData.length">

        <div class="head">
          <img :src="icons.door"
               alt>
          门
        </div>
        <div class="form-item"
             v-for="(item,index) in doorData"
             :key="index">
          <label class="label">门{{index+1}}：</label>
          <el-input v-model="item.nickName"></el-input>
          <div class="mytagWrap">
            <gt-button class="button"
                       @close="deleteTag(1,index,x)"
                       v-for="(i,x) in item.tagPOList"
                       :key="x">{{i.tagName}}</gt-button>
            <el-button class="addIcon"
                       type="primary"
                       @click="chooseTag(1,index)"
                       size="small">
              <i class="el-icon-circle-plus-outline"></i>
              选择标签
            </el-button>
          </div>
        </div>
      </div>

      <div class="section door"
           v-if="dutouData.length">
        <div class="head">
          <img :src="icons.door"
               alt>
          读头
        </div>
        <div class="form-item"
             v-for="(item,index) in dutouData"
             :key="index">
          <label class="label">读头{{index+1}}：</label>
          <el-input v-model="item.nickName"></el-input>
          <div class="mytagWrap">
            <gt-button class="button"
                       @close="deleteTag(2,index,x)"
                       v-for="(i,x) in item.tagPOList"
                       :key="x">{{i.tagName}}</gt-button>
            <el-button class="addIcon"
                       type="primary"
                       @click="chooseTag(2,index)"
                       size="small">
              <i class="el-icon-circle-plus-outline"></i>
              选择标签
            </el-button>
          </div>
        </div>
      </div>

      <div class="section door"
           v-if="shuruData.length">
        <div class="head">
          <img :src="icons.door"
               alt>
          报警输入
        </div>
        <div class="form-item"
             v-for="(item,index) in shuruData"
             :key="index">
          <label class="label">报警输入{{index+1}}：</label>
          <el-input v-model="item.nickName"></el-input>
          <div class="mytagWrap">
            <gt-button class="button"
                       @close="deleteTag(3,index,x)"
                       v-for="(i,x) in item.tagPOList"
                       :key="x">{{i.tagName}}</gt-button>
            <el-button class="addIcon"
                       type="primary"
                       @click="chooseTag(3,index)"
                       size="small">
              <i class="el-icon-circle-plus-outline"></i>
              选择标签
            </el-button>
          </div>
        </div>
      </div>

      <div class="section door"
           v-if="shuchuData.length">
        <div class="head">
          <img :src="icons.door"
               alt>
          报警输出
        </div>
        <div class="form-item"
             v-for="(item,index) in shuchuData"
             :key="index">
          <label class="label">报警输出{{index+1}}：</label>
          <el-input v-model="item.nickName"></el-input>
          <div class="mytagWrap">
            <gt-button class="button"
                       @close="deleteTag(4,index,x)"
                       v-for="(i,x) in item.tagPOList"
                       :key="x">{{i.tagName}}</gt-button>
            <el-button class="addIcon"
                       type="primary"
                       @click="chooseTag(4,index)"
                       size="small">
              <i class="el-icon-circle-plus-outline"></i>
              选择标签
            </el-button>
          </div>
        </div>
      </div>
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
                 type="primary">保存</el-button>
      <el-button @click="close"
                 type="primary">取消</el-button>
    </div>
  </div>
</template>

<script>
import PopoverTree from "@/common/selectOrgTree";
// 这是楼栋房屋只到单元的下拉框树
import BuildHousePopoverTree from "@/common/BuildHousePopoverTree2";
import personTreeTag from "@/common/personTreeTag";
import icons from "@/common/icon.js";
import * as api from "../ajax";
export default {
  name: "TreeChangeNameDialog.vue",
  components: {
    PopoverTree,
    BuildHousePopoverTree,
    personTreeTag
  },
  props: {
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "添加设备";
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
      orgUuid: "",
      isLocal: false,
      service: "",
      options: [],
      houseUuid: "", // 楼栋房屋的ID
      treeType: window.config.tagType,
      isShow: false,
      icons,
      door: "",
      checkedNode: [],
      ruleForm: {
        ip: "",
        tagSn: "",
        nickName: "",
        devMode: "",
        oriz: "",
        build: "",
        desc: "",
        deviceIp: "",
        devicePort: "",
        username: "",
        password: ""
      },
      rules: {
        nickName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
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
        devMode: [
          { required: false, message: "请选择设备型号", trigger: "change" }
        ],
        oriz: [
          { required: false, message: "请选择选择架构", trigger: "change" }
        ],
        build: [
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
    syncChannel() {
      api.manualEquipment(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$emit("showEdit", false);
        }
      });
    },
    changeOptions(val) {},
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
      this.ruleForm.oriz = params.node.data.orgUuid;
    },
    setHouseData(params) {
      this.ruleForm.build = params.node.data.id;
      this.houseName = params.node.data.label;
    },
    saveData() {
      let num = [];
      const getNum = data => {
        return data;
        // let channelList = [];
        // data.forEach(item => {
        //   channelList.push({
        //     nickName: item.nickName,
        //     channelUuid: item.channelUuid,
        //     version: item.version
        //   });
        // });
        // return channelList;
      };
      num = num.concat(getNum(this.doorData));
      num = num.concat(getNum(this.dutouData));
      num = num.concat(getNum(this.shuruData));
      num = num.concat(getNum(this.shuchuData));
      console.log(num);

      let data = {
        productType: this.ruleForm.devMode,
        orgUuid: this.ruleForm.oriz,
        infrastructureUuid: this.ruleForm.build,
        remarks: this.ruleForm.desc,
        deviceUuid: this.deviceUuid,
        nickName: this.ruleForm.nickName,
        version: this.ruleForm.version,
        channelList: num
        // [
        //   {
        //     nickName: "测试的通道啊2",
        //     channelUuid: "uuid0",
        //     version: 11
        //   },
        //   {
        //     nickName: "测试的通道啊3",
        //     channelUuid: "uuid1",
        //     version: 0
        //   }
        // ]
      };
      console.log(data);
      api.saveDevice(data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("保存成功！");
          this.$emit("showEdit", true);
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
      this.$emit("showEdit", false);
    },
    getServiceList() {
      api.serviceList().then(res => {
        console.log(res);
        if (res.data.success) {
        }
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(this.row);
        this.ruleForm = {
          ip: this.row.deviceIp,
          tagSn: this.row.deviceSn,
          nickName: this.row.nickName,
          devMode: this.row.productType,
          oriz: this.row.orgUuid,
          build: this.row.infrastructureUuid,
          desc: this.row.remarks,
          version: this.row.version,
          deviceIp: this.row.deviceIp,
          devicePort: this.row.devicePort,
          username: this.row.username,
          password: this.row.password
        };
        const deal = arr => {
          return arr.map(val => {
            if (this.isLocal) {
              val.faceSnap = !!(val.extInfo.faceSnap === 1);
              val.vehicleSnap = !!(val.extInfo.vehicleSnap === 1);
              val.bodySnap = !!(val.extInfo.bodySnap === 1);
            }
            val.tagPOList = val.tagPOList || [];
            return val;
            // return {
            //   nickName: val.nickName,
            //   nickName: val.nickName,
            //   channelUuid: val.channelUuid,
            //   version: val.version
            // };
          });
        };
        // 获取门状态的数组
        for (let k in this.row.channelMapList) {
          if (k === window.config.door) {
            this.doorData = deal(this.row.channelMapList[k]);
          } else if (k === window.config.readhead) {
            this.dutouData = deal(this.row.channelMapList[k]);
          } else if (k === window.config.door_aic) {
            this.shuruData = deal(this.row.channelMapList[k]);
          } else if (k === window.config.door_aoc) {
            this.shuchuData = deal(this.row.channelMapList[k]);
          }
        }
        // 记录门状态
        if (this.row.org && this.row.org.length) {
          this.orgName = this.row.org[0].orgName;
          this.orgUuid = this.row.org[0].orgUuid;
        }

        this.houseName = this.row.infrastructureName;
        this.houseUuid = this.row.infrastructureUuid;
        console.log(this.doorData);
        this.$nextTick(() => {
          this.$refs.scroll.initBar();
        });
        if (this.isLocal) {
          this.getServiceList();
        }
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
  width: 1000px;
  background: #212325;
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
  justify-content: flex-end;
  button {
    width: 66px;
    @include button30;
  }
}
</style>
