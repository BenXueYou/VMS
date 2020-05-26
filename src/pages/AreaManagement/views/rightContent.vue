<template>
  <div class="rightContent">
    <div class="header_menu">
      <div class="btn_group">
        <el-input placeholder="请输入项目的名称"
                  v-model="childProjectName"
                  style="width:200px;"></el-input>
        <el-button type="primary"
                   @click="searchData"
                   size="medium">检索</el-button>
      </div>
    </div>
    <div class="areaList"
         ref="rightContent">
      <div class="area"
           v-for="(item, index) in data"
           :key="index">
        <div class="imgWrap">
          <img src="@/assets/images/projectImage.png"
               alt="" />
        </div>
        <!-- 项目名称：
        所属组织：
        项目状态：
        设备数量：
        人员数量： -->
        <div class="areaInfo">
          <p class="textClips">项目名称：{{ item.childProjectName }}</p>
          <p>所属组织：{{ item.orgName }}</p>
          <p>项目状态：{{ item.childProjectState || "已授权" }}</p>
          <p>设备数量：{{ item.childProjectDeviceCount }}</p>
          <p>人员数量：{{ item.childProjectStaffCount }}</p>
        </div>
        <div class="setIcon">
          <el-button type="text"
                     @click="showSelectTree(index)"
                     :disabled="!OwnAuthDisabled">
            <img v-if="OwnAuthDisabled"
                 src="@/assets/images/setting.png"
                 alt="" />
            设置
          </el-button>
        </div>
      </div>
    </div>
    <select-area-tree :childProjectUuid="childProjectUuid"
                      :id="oriId"
                      :label="oriLabel"
                      @updateTree="updateTree"
                      :visible.sync="selectAreaTreeVisible"
                      :updateCount="updateCount">
    </select-area-tree>
  </div>
</template>

<script>
import selectAreaTree from "@/pages/AreaManagement/components/selectAreaTree";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "AreaManagement",
  props: {
    updateCount: {
      type: Number,
      default: 0
    },
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return true;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      selectAreaTreeVisible: false,
      childProjectName: "",
      data: [],
      page: 1,
      limit: 200000,
      isHaveData: true,
      childProjectUuid: "",
      oriId: "",
      oriLabel: "",
      orgUuid: ""
    };
  },
  components: {
    selectAreaTree
  },
  activated() {
    this.registerEventbus();
  },
  mounted() {},
  methods: {
    updateTree() {
      this.$emit("updateTree");
    },
    searchData() {
      // 点击搜索的时候，默认清空
      this.isHaveData = true;
      this.data = [];
      this.page = 1;
      this.getData(this.orgUuid);
    },
    getData(orgUuid) {
      api
        .getAreaProject({
          childProjectName: this.childProjectName,
          orgUuid: orgUuid,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            let data = (res.data.data || {}).list || [];
            this.data = data;
          }
        });
    },
    scroll(e) {
      let rightContent = this.$refs.rightContent;
      // 还有30px的就触发获取下一页数据的方法
      if (
        rightContent.clientHeight + rightContent.scrollTop + 30 >=
        rightContent.scrollHeight
      ) {
        this.pageNow++;
        this.getData(this.orgUuid);
      }
    },
    setAreaTree(data) {
      console.log(data);
    },
    showSelectTree(index) {
      this.childProjectUuid = this.data[index].childProjectUuid;
      this.oriId = this.data[index].orgUuid;
      this.oriLabel = this.data[index].orgName;
      this.selectAreaTreeVisible = true;
    },
    registerEventbus() {
      this.$bus.$on("clickMenuNode", obj => {
        this.orgUuid = obj.id;
        this.getData(obj.id);
      });
    },
    unRegisterEventbus() {
      this.$bus.$off("clickMenuNode");
    }
  },
  deactivated() {
    this.unRegisterEventbus();
  },
  destroyed() {
    this.unRegisterEventbus();
  },
  watch: {
    updateCount: {
      handler() {
        this.data = [];
        this.page = 1;
        this.childProjectUuid = "";
        this.oriId = "";
        this.oriLabel = "";
        if (this.orgUuid) {
          this.getData(this.orgUuid);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rightContent {
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  background-color: rgba(17, 17, 17, 1);
  .header_menu {
    overflow: hidden;
    .btn_group {
      float: right;
    }
  }
  .areaList {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: calc(100% - 40px);
    overflow-y: auto;
    .area {
      position: relative;
      display: flex;
      width: 380px;
      height: 190px;
      margin-top: 15px;
      margin-left: 20px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid #979797;
      border-radius: 1px;
      padding: 17px;
      box-sizing: border-box;
      .imgWrap {
        width: 140px;
        height: 150px;
        background-color: #fff;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .setIcon {
        position: absolute;
        top: 13px;
        right: 13px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #22ce98;
        text-align: justify;
        cursor: pointer;
        img {
          vertical-align: middle;
        }
      }
    }
    .areaInfo {
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #dddddd;
      text-align: justify;
      text-indent: 10px;
      max-width: 160px;
      p {
        margin: 8px 0;
      }
    }
  }
}
</style>
