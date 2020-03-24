<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c">
      <div class="body">
        <label class="label"
               for>账号：</label>
        <div style="padding-left:10px;"
             class="userNameClass">{{username}}</div>
        <!-- <el-input class="input" disabled v-model="username"></el-input> -->
      </div>
      <div class="body">
        <label class="label"
               for>原密码：</label>
        <el-input type="password"
                  class="input"
                  v-model="password"></el-input>
      </div>
      <div class="body">
        <label class="label"
               for>新密码：</label>
        <el-input type="password"
                  class="input"
                  v-model="newPassword"></el-input>
      </div>
      <div class="body">
        <label class="label"
               for>确认密码：</label>
        <el-input type="password"
                  class="input"
                  v-model="newPasswordConfirm"></el-input>
      </div>
      <div class="body">
        <span class="label"></span>
        <div class="input">
          <el-button @click="confirm"
                     type="primary">确定</el-button>
          <el-button @click="close"
                     type="primary">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TheChangePasswordDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "400px";
      }
    },
    userName: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "修改密码";
      }
    },
    value: {
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
    }
  },
  computed: {
    ...mapState({
      username: state => {
        return state.home.account;
      }
    })
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      name: null,
      password: null,
      newPassword: null,
      newPasswordConfirm: null
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.username;
  },
  methods: {
    confirm() {
      if (!this.username) {
        this.$message.error("名称不可以为空!");
        return;
      }
      if (this.newPasswordConfirm !== this.newPassword) {
        this.$message.error("两次的密码不一致!");
        return;
      }
      var eReg1 = /^(?![^a-zA-Z]+$)(?!\D+$)/;
      if (!eReg1.test(this.newPasswordConfirm)) {
        this.$message.warning(
          "修改的密码至少包含数字，字母这两种（区分大小写）"
        );
        return;
      }
      if (this.newPasswordConfirm && this.password) {
        let data = {
          accountName: this.username, //账号名称
          newPassword: this.newPasswordConfirm, // 新密码
          oldPassword: this.password //旧密码
        };
        this.httpPutPassword(data);
      } else {
        this.$message.error("密码不能为空!");
      }
    },
    httpPutPassword(data) {
      this.$loginAjax
        .updatePassword(data)
        .then(res => {
          if (res.data.success) {
            this.newPasswordConfirm = null;
            this.password = null;
            this.newPassword = null;
            this.$emit("onConfirm", data);
            this.$emit("update:visible", false);
          } else {
            this.$message({ type: "warning", message: res.data.msg });
          }
        })
        .catch(() => {});
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
$labelwidth: 6em;
.c {
  overflow: hidden;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 15px auto;
    display: flex;
    flex-wrap: wrap;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      font-family: "PingFangSC-Regular";
      padding-right: 5px;
      box-sizing: border-box;
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .userNameClass,
    .input {
      width: calc(100% - #{$labelwidth});
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      line-height: 30px;
      button {
        height: 30px;
        padding: 7px 21px;
        background: rgba(40, 255, 187, 0.12);
        border: 1px solid rgba(40, 255, 187, 0.8);
        border-radius: 2px;
        font-family: "PingFangSC-Regular";
        letter-spacing: 0;
        margin-top: 15px;
      }
    }
  }
}
</style>
