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
                  v-model="username"></el-input>
      </div>
    </div>
    <div class="k-form">
      <label for="">状态：</label>
      <div class="aa">
        <el-radio-group v-model="status">
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
    <div class="k-form">
      <label for="">角色描述：</label>
      <div class="aa">
        <el-input class='inpaaa'
                  type="textarea"
                  :rows="3"
                  v-model="descrition"></el-input>
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
                   style='margin-bottom:20px;'
                   size="small"
                   @click="addFunction"
                   icon="el-icon-circle-plus-outline">新增</el-button>
      </div>
    </div>
    <div class="k-form">
      <label for="">关联的通道资源：</label>
      <div class="aa">
        <el-button type="text"
                   style='margin-bottom:20px;'
                   size="small"
                   @click="addFunction"
                   icon="el-icon-circle-plus-outline">新增</el-button>
      </div>
    </div>
    <div class="k-form">
      <label for="">关联的APP权限：</label>
      <div class="aa">
        <el-button type="text"
                   style='margin-bottom:20px;'
                   size="small"
                   @click="addFunction"
                   icon="el-icon-circle-plus-outline">新增</el-button>
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
  </div>
</template>

<script>
import treePanelDialog from "@/pages/user/components/treePanelDialog";
export default {
  name: "accountAdd",
  components: {
    treePanelDialog
  },
  data() {
    return {
      showtreeadad: false,
      status: "enable",
      time: "forever",
      username: "",
      descrition: ""
    };
  },
  methods: {
    addAccout() {
      this.showtreeadad = true;
    },
    addFunction() {},
    saveAndAdd() {},
    confirm() {},
    close() {}
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
  .k-form {
    display: flex;
    margin: 15px 0px;
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
