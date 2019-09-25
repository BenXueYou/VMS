<template>
  <div class="main">
    <el-container class="main-container">
      <el-header class="main-container-header">
        <div class="header-title">
          <img src="@/assets/images/logo.png">
        </div>
        <tag-view />

        <el-dropdown trigger="click"
                     @command="handleCommand"
                     class='quit-btn'>
          <span class="el-dropdown-link myAccountHeader">
            <img src="@/assets/images/header.png"
                 alt="">
            <span class="userName">
              {{username}}
            </span>
            <i class="el-icon-caret-bottom el-icon--right"
               style="color:#FFF;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class='dropdown-li'
                              disabled
                              command="xiugai">
              <span class='myAccountItem'>
                <img src="@/assets/images/mima.png"
                     class='normal'
                     width="14px"
                     height="14px">
                <img src="@/assets/images/mima_l.png"
                     class='active'
                     width="14px"
                     height="14px">
                <span>
                  修改密码
                </span>
              </span>
            </el-dropdown-item>
            <el-dropdown-item class='dropdown-li'
                              command="qiehuan">
              <span class='myAccountItem'>
                <img src="@/assets/images/qiehuan.png"
                     class='normal'
                     width="14px"
                     height="14px">
                <img src="@/assets/images/qiehuan_l.png"
                     width="14px"
                     class='active'
                     height="14px">
                <span>
                  切换项目
                </span>
              </span>

            </el-dropdown-item>
            <el-dropdown-item class='dropdown-li'
                              command="tuichu">
              <span class='myAccountItem'>
                <img src="@/assets/images/tuichu.png"
                     class='normal'
                     width="14px"
                     height="14px">
                <img src="@/assets/images/tuichu_l.png"
                     class='active'
                     width="14px"
                     height="14px">
                <span>
                  退出
                </span>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="quit-btn">
          <el-button type="text"
                     size="mini"
                     @click="onClickQuit">
            <div class="quit-btn-icon">
              <img src="@/assets/images/quit.png"
                   width="14px"
                   height="14px">
              <div class="quit-btn-text">退出</div>
            </div>
          </el-button>
        </div> -->
      </el-header>
      <el-main class="main-container-main">
        <!-- <router-view></router-view> -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
    <global-alarm-dialog :visible.sync='dialogVisible' :dialogParama='dialogParama' />
  </div>
</template>

<script>
import TheChangePassWord from "@/common/EditPasswordDialog";
import TagView from "@/pages/main/views/TagView";
import { mapState } from "vuex";
import GlobalAlarmDialog from '@/pages/alarmDialog/GlobalAlarmDialog.vue';
export default {
  components: {
    TagView,
    TheChangePassWord,
    GlobalAlarmDialog
  },
  props: {},
  data() {
    return {
      local_enums: null,
      showPassWordDialogVisible: false,
      dialogVisible: false,
      dialogParama: {}
    };
  },
  created() {
    // window.config.projectUuid = this.$store.state.home.projectUuid;
    this.queryBaseTypeByGroup();
  },
  mounted() {
    console.log(this.$store);
    this.$store.commit(
      "SET_CERTIFICATE",
      this.$common.getEnumByGroupStr("cred")
    );
    this.$store.commit("SET_EDUOPTIONS", this.$common.getEnumByGroupStr("edu"));
    this.$store.commit(
      "SET_COUNTRY",
      this.$common.getEnumByGroupStr("nationality")
    );
    this.$store.commit("SET_NATION", this.$common.getEnumByGroupStr("nation"));
    this.$store.commit(
      "SET_MARITAL",
      this.$common.getEnumByGroupStr("marital")
    );
    this.$store.commit(
      "SET_GENDEROPTIONS",
      this.$common.getEnumByGroupStr("gender")
    );
    this.$store.commit(
      "SET_STAFFOPTIONS",
      this.$common.getEnumByGroupStr("staff_t")
    );
    this.$store.commit(
      "SET_CARDOPTIONS",
      this.$common.getEnumByGroupStr("card_u")
    );
  },
  activated() {
    console.log(this.$store);
  },
  methods: {
    handleCommand(command) {
      console.log(this.$store.state);
      if (command === "tuichu") {
        this.onClickQuit();
      } else if (command === "qiehuan") {
        this.$router.push("/projectManage");
      } else if (command === "xiugai") {
        this.showPassWordDialogVisible = true;
      }
    },
    onClickQuit() {
      this.$store.dispatch("setAuthorization", "");
      this.$store.dispatch("setProjectUuid", "");
      this.$store.dispatch("setTagViewArr", []);
      this.$store.dispatch("setLocalTag", "Home");
      this.$router.push({
        name: "Login"
      });
    },
    queryBaseTypeByGroup() {
      this.$homeAjax.queryBaseTypeByGroup().then(res => {
        let body = res.data;
        this.handleQueryBaseTypeByGroupSuccessResponse(body);
      });
    },
    handleQueryBaseTypeByGroupSuccessResponse(body) {
      this.local_enums = body;
      this.$store.dispatch("setLocalEnums", this.local_enums);
    }
  },
  watch: {},
  destroyed() {},
  computed: {
    ...mapState({
      username: state => {
        return state.home.account;
      }
    }),
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown-li {
  text-align: left;
  .myAccountItem {
    span {
      padding-left: 4px;
    }
    img {
      width: 11px;
      height: 11px;
    }
    .active {
      display: none;
    }

    vertical-align: top;
  }
  &:hover {
    color: #26d39d;
    .normal {
      display: none !important;
    }
    .active {
      display: inline-block;
    }
  }
}
.main {
  height: 100%;
  .main-container {
    height: 100%;
    .main-container-header {
      background: #222326;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      background-image: linear-gradient(
        -180deg,
        #353a3f 4%,
        #272a2d 47%,
        #202124 90%
      );
      box-shadow: 0 6px 25px 0 rgba(0, 0, 0, 0.4);
      z-index: 1;
      .header-title {
        margin-right: 20px;
        margin-left: 10px;
        width: 100px;
        height: 33%;
      }
      .el-dropdown-header {
        float: right;
      }
      .myAccountHeader {
        cursor: pointer;
        line-height: 30px;
        font-family: "PingFangSC-Light";
        font-size: 12px;
        color: #dddddd;
        letter-spacing: 0;
        text-align: left;
        span {
          padding-left: 15px;
        }
        img {
          vertical-align: top;
        }
      }
      .quit-btn {
        margin-left: auto;
        margin-right: 1%;
        .quit-btn-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .quit-btn-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #dddddd;
            letter-spacing: 0;
            text-align: right;
            margin-left: 6px;
          }
        }
      }
    }
    .main-container-main {
      height: 95%;
      padding: 0px;
      background: #1b1b1b;
    }
  }
}
</style>
