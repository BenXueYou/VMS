<template>
  <div class='roleEditWrap'>
    <div class="headera">
      <span class="shuline">添加角色</span>
      <div class="buttongroup">
        <el-button @click="saveAndAdd"
                   size="small"
                   type="primary">保存并继续添加</el-button>
        <el-button @click="confirm"
                   class="button"
                   size="small"
                   type="primary">确认</el-button>
        <el-button @click="close"
                   class="button"
                   size="small"
                   type="primary">取消</el-button>
      </div>
    </div>
    <div class="dash-line"></div>
    <div class="k-form">
      <label for="">角色名称：</label>
      <div class="aa">
        <el-input class='inpaaa'
                  v-model="roleName"></el-input>
      </div>
    </div>
    <div class="k-form">
      <label for="">状态：</label>
      <div class="aa">
        <el-radio-group v-model="enable">
          <el-radio label="enable">启用</el-radio>
          <el-radio label="disable">禁用</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="k-form">
      <label for="">到期时间：</label>
      <div class="aa">
        <el-radio-group v-model="time">
          <el-radio label="forever">永久</el-radio>
          <el-radio label="shorttime">短期</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="k-form"
         v-show="time==='shorttime'">
      <label for=""></label>
      <div class="aa">
        <el-input style="width:220px"
                  v-model="invalidTime"></el-input>
      </div>
    </div>
    <div class="k-form">
      <label for="">角色描述：</label>
      <div class="aa">
        <el-input class='inpaaa'
                  type="textarea"
                  :rows="3"
                  v-model="description"></el-input>
      </div>
    </div>
    <div class="dash-line"></div>
    <div class="k-form">
      <div class="label">
        <span class="adasaaaaF">
          <img src="../../../assets/images/auth/auth.png"
               alt="">
          权限信息</span>
        <label for="">关联的功能模块：</label>
      </div>
      <div class="aa">
        <el-button type="text"
                   size="small"
                   @click="addFunction"
                   icon="el-icon-circle-plus-outline">新增</el-button>
        <div>
          <gt-button v-for="(item,index) in featureAuth"
                     class='bilibili'
                     @close="deleteFeatureAuth(index)"
                     :key="index">{{item.featureName}}</gt-button>
        </div>
      </div>
    </div>
    <div class="k-form">
      <label for="">关联的通道资源：</label>
      <div class="aa">
        <el-button type="text"
                   size="small"
                   @click="addFunction"
                   icon="el-icon-circle-plus-outline">新增</el-button>
        <div>
          <gt-button v-for="(item,index) in resourceAuth"
                     class='bilibili'
                     @close="deleteFeatureAuth2(index)"
                     :key="index">{{item.resourceName}}</gt-button>
        </div>
      </div>
    </div>
    <div class="k-form">
      <label for="">关联的APP权限：</label>
      <div class="aa">
        <el-button type="text"
                   size="small"
                   @click="addFunction"
                   icon="el-icon-circle-plus-outline">新增</el-button>
        <div>
          <gt-button v-for="(item,index) in account "
                     class='bilibili'
                     @close="deleteFeatureAuth3(index)"
                     :key="index">{{item.staffName}}</gt-button>
        </div>
      </div>
    </div>
    <div class="dash-line"></div>
    <div class="k-form">
      <div class="label">
        <span class="adasaaaaF">
          <img src="../../../assets/images/auth/shouquan.png"
               alt="">
          授权账号</span>
        <label for="">授权账号：</label>
      </div>
      <div class="aa">
        <el-button type="text"
                   style='margin-bottom:20px;'
                   size="small"
                   @click="addAccout"
                   icon="el-icon-circle-plus-outline">新增</el-button>
      </div>
    </div>
    <div class="dash-line"></div>
    <div class="headera">
      <div class="buttongroup">
        <el-button @click="saveAndAdd"
                   size="small"
                   type="primary">保存并继续添加</el-button>
        <el-button @click="confirm"
                   class="button"
                   size="small"
                   type="primary">确认</el-button>
        <el-button @click="close"
                   class="button"
                   size="small"
                   type="primary">取消</el-button>
      </div>
    </div>
    <tree-panel-dialog :isShow.sync="showtreeadad"></tree-panel-dialog>
    <auth-tree :visible.sync="authTreeVisible">

    </auth-tree>
  </div>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
import authTree from "@/pages/user/components/authTree";
export default {
  name: "accountAdd",
  components: {
    treePanelDialog,
    authTree
  },
  props: {
    roleUuid: {
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
    }
  },
  data() {
    return {
      showtreeadad: false,
      authTreeVisible: false,
      enable: "enable",
      time: "forever",
      invalidTime: "",
      roleName: "",
      description: "",
      featureAuth: [
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        },
        {
          featureUuid: "string", // 功能uuid
          featureName: "string" // 功能名称
        }
      ],
      account: [],
      resourceAuth: []
    };
  },
  methods: {
    deleteFeatureAuth(index) {
      this.featureAuth.splice(index, 1);
    },
    deleteFeatureAuth2(index) {
      this.resourceAuth.splice(index, 1);
    },
    deleteFeatureAuth3(index) {
      this.account.splice(index, 1);
    },
    addAccout() {
      this.showtreeadad = true;
    },
    addFunction() {
      this.authTreeVisible = true;
    },
    saveAndAdd() {
      this.submit(false);
    },
    confirm() {
      this.submit();
    },
    close() {
      this.$emit("close");
    },
    resetAddDialog() {
      // 清空数据
      this.roleName = "";
      this.enable = false;
      this.time = "forever";
      this.description = "";
      this.account = [];
      this.resourceAuth = [];
      this.featureAuth = [];
    },
    rebaseData() {
      let data = {
        roleName: this.roleName, // 角色名称
        invalidTime: this.invalidTime, // 到期时间，当类型为短期时传时间字符串，永久时传枚举值
        description: this.description, // 角色描述
        enable: this.enable ? 1 : 0, // 0禁用、1启用
        featureAuthUuids: this.account.map(i => {
          return i.featureUuid;
        }),
        // 关联的功能模块
        resourceAuthUuids: this.resourceAuth, // 关联的通道资源
        accountUuids: this.featureAuth.map(i => {
          return i.accountUuid;
        }) // 账号uuid列表
      };
      if (this.roleUuid) {
        return;
      }
      if (this.roleUuid) {
        data.roleUuid = this.roleUuid;
      }
      return data;
    },
    submit(isBackTableList = true) {
      // 通过判断roleUuid是否为空，来判断是新增还是修改
      let data = this.rebaseData();
      if (!this.roleUuid) {
        api.addUserDetailUrl(data).then(res => {
          if (res.data.success) {
            this.$message.success("添加成功!");
            if (isBackTableList) {
              this.resetAddDialog();
            } else {
              this.clsoe();
            }
          }
        });
      } else {
        api.editUserDetailUrl(data).then(res => {
          if (res.data.success) {
            this.$mesage.success("保存成功！");
            if (isBackTableList) {
              this.resetAddDialog();
            } else {
              this.clsoe();
            }
          }
        });
      }
    },
    getData() {
      // 根据roleUuid来获取数据
      api.getUserDetail({ roleUuid: this.roleUuid }).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          // "roleUuid": "string",  // 角色uuid
          // "roleName": "string",  // 角色名称
          // "enable": 0,           // 0禁用、1启用
          // "invalidTime": "string",  // 失效时间
          //     "description": "string",  // 账号描述
          // "account": [
          //   {
          //     "accountUuid": "string",  // 账号uuid
          //     "accountName": "string" ,  // 账号名称
          //             "staffName":"string" //人员名称
          //   }
          // ],
          // "featureAuth": [
          //   {
          //     "featureUuid": "string",  // 功能uuid
          //     "featureName": "string"   // 功能名称
          //   }
          // ],
          // "resourceAuth": [
          //   {
          //             "resourceUuid": "string", // 资源uuid
          //             "resourceType": "string",  // 资源类型
          //             "resourceName":"string"   // 资源名称
          //   }
          // ]
          this.roleName = data.roleName;
          this.enable = !!data.enable;
          if (!data.invalidTime) {
            this.time = "forever";
          } else {
            this.time = "shortTime";
            this.invalidTime = data.invalidTime;
          }
          this.description = data.description;
          this.account = data.account;
          this.featureAuth = data.featureAuth;
          this.resourceAuth = data.resourceAuth;
        }
      });
    }
  },
  watch: {
    visible(val) {
      //
      if (val) {
        // 展示编辑框 1.有roleUuid则获取详情接口
        this.resetAddDialog();
        if (this.roleUuid) {
          this.getData();
        }
      }
    }
  }
};
</script>

<style lang="scss" >
@import "@/style/variables.scss";
.roleEditWrap {
  padding: 20px 0px;
  box-sizing: border-box;
  background: #212325;
  border-radius: 2px 2px 2px 2px 0 0;
  border-radius: 2px 2px 2px 2px 0px 0px;
  overflow: auto;
  .bilibili {
    margin-right: 10px;
  }
  .k-form {
    display: flex;
    margin: 5px 0px;
    .label,
    label {
      flex: 1;
      text-align: right;
      padding-right: 20px;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #dddddd;
      line-height: 30px;
      .adasaaaaF {
        float: left;
        padding-left: 50px;
        img {
          vertical-align: middle;
          margin: 0px 20px;
        }
      }
    }
    .aa {
      flex: 2;
      margin-bottom: 20px;
      .inpaaa {
        width: 250px;
        textarea {
          background: #212325;
        }
      }
    }
  }
  .headera {
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
}
</style>
