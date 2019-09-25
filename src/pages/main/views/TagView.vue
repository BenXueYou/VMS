<template>
  <div class="el-menu-div">
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect"
             background-color="transparent"
             text-color="#DDDDDD"
             active-text-color="#FFFFFF">
      <el-menu-item index="Home"
                    v-show="projectUuid">首页</el-menu-item>
      <template v-for="(item, index) in $store.state.home.tagViewArr">
        <el-menu-item :key="index"
                      :index="item.name">
          <span>{{item.title}}</span>
          <div class="icon-close-replace"></div>
          <img src="@/assets/images/close.png"
               class="icon-close"
               @click.stop="onClickDelete(item)">
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  props: {},
  data() {
    return {
      activeIndex: this.$store.state.home.localTag
    };
  },
  computed: {
    ...mapState({
      projectUuid: state => {
        return state.home.projectUuid;
      }
    })
  },
  created() {},
  mounted() {
    // 添加一个uuid的判断，表示如果项目过多，就不跳到首页，而是跳转到项目选择页面
    if (
      this.$store.state.home.tagViewArr.length === 0 &&
      this.$store.state.home.projectUuid
    ) {
      this.$store.dispatch("setLocalTag", "Home");
      this.$bus.$emit("setLocalTag", "Home");
      this.$router.push({ name: "Home" });
    }
    this.registerEventbus();
  },
  activated() {},
  methods: {
    handleSelect(key, keyPath) {
      this.$store.dispatch("setLocalTag", key);
      this.activeIndex = this.$store.state.home.localTag;
      this.$router.push({ name: key });
    },
    onClickDelete(item) {
      this.$store.dispatch("delTagViewItem", item);
      if (item.name === this.$store.state.home.localTag) {
        if (this.$store.state.home.tagViewArr.length > 0) {
          // eslint-disable-next-line
          let index = this.$store.state.home.tagViewArr.length - 1;
          let laseMenuName = this.$store.state.home.tagViewArr[index].name;
          this.$store.dispatch("setLocalTag", laseMenuName);
          this.$bus.$emit("setLocalTag", laseMenuName);
          this.$router.push({ name: laseMenuName });
        } else {
          this.$store.dispatch("setLocalTag", "Home");
          this.$bus.$emit("setLocalTag", "Home");
          this.$router.push({ name: "Home" });
        }
      }
    },
    registerEventbus() {
      this.$bus.$on("setLocalTag", localTag => {
        this.$nextTick(() => {
          this.activeIndex = localTag;
        });
      });
    },
    unRegisterEventbus() {
      this.$bus.$off("setLocalTag");
    }
  },
  watch: {},
  deactivated() {
    this.unRegisterEventbus();
  },
  destroyed() {
    this.unRegisterEventbus();
  }
};
</script>

<style lang="scss">
.el-menu-div {
  .el-menu.el-menu--horizontal {
    border-bottom: 0px !important;
  }
  .el-menu-demo {
    .el-menu-item {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      letter-spacing: 0;
      border-bottom: 0px !important;
      padding: 0 15px !important;
      display: flex;
      width: 120px !important;
      justify-content: center;
      align-items: center;
      .icon-close {
        margin-left: auto;
        width: 10px;
        height: 10px;
        display: none;
      }
      .icon-close-replace {
        margin-left: auto;
        color: #ffffff;
        width: 10px;
        height: 10px;
      }
    }
    .el-menu-item:hover {
      background-color: rgba(255, 255, 255, 0.06) !important;
      border-radius: 4px;
      .icon-close {
        display: block;
      }
    }
    .el-menu-item.is-active {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      letter-spacing: 0;
      border-bottom: 0px !important;
      background-color: rgba(255, 255, 255, 0.06) !important;
      border-radius: 4px;
      padding: 0 25px;
      .icon-close {
        display: block;
      }
    }
    li {
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
}
</style>
