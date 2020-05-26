<template>
  <el-row class="PublicMessage"
          ref="mainWMHeight"
          type="flex"
          style="height: 100%">
    <el-col class="PMBox PBoxMenu"
            :span="4"
            style="height: 100%">
      <el-header>
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   @click="addReportMessageAct">
          <img class="img"
               src="../../../../assets/images/doorAccess/add_btn_icon.png"
               alt />新建公告
        </el-button>
      </el-header>
      <el-table :data="tableData"
                style="width: 100%"
                height="90%"
                @row-click="handleRowClick"
                highlight-current-row
                ref="elTable"
                v-loading="isLoading">
        <el-table-column prop="noticeName"
                         label="公告"></el-table-column>
        <el-table-column label="操作"
                         width>
          <template slot-scope="scope">
            <el-button :disabled="!OwnAuthDisabled"
                       type="text"
                       size="small"
                       class="delete-button"
                       @click.stop="deleteNotice(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="PMBox PBoxMain"
            :span="20">
      <el-scrollbar style="height: 98%;transition:0.2s;">
        <el-row type="flex"
                justify="center"
                :gutter="30">
          <el-col class="left_box"
                  :span="5">
            <p>
              <span style="color:red;margin-right:8px;">*</span>发送对象：
            </p>
          </el-col>
          <el-col class="right_box"
                  :span="19">
            <el-header>
              <span :disabled="!OwnAuthDisabled"
                    class="left_tips_txt"
                    @click="addDeviceTag">
                <i class="el-icon-circle-plus-outline img"></i>选取设备
              </span>
            </el-header>
            <div class="showAllSelect">
              <gt-button :disabled="!OwnAuthDisabled"
                         class="sbtn"
                         @close="deleteDev(index)"
                         v-for="(item, index) in resourceSet"
                         :key="index"
                         :icon="icons.door">{{item.label}}</gt-button>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="center"
                align="middle"
                :gutter="30">
          <el-col class="left_box"
                  :span="5">
            <p>
              <span style="color:red;margin-right:8px;">*</span>主题：
            </p>
          </el-col>
          <el-col class="right_box"
                  :span="19">
            <el-input v-model="noticeName"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="center"
                :gutter="30">
          <el-col class="left_box"
                  :span="5">
            <p>图片：</p>
          </el-col>
          <el-col class="right_box"
                  :span="19">
            <el-header>
              <el-upload :disabled="(!OwnAuthDisabled) || isDisable"
                         class="uploadClass"
                         :action="updateFileImage"
                         :show-file-list="false"
                         :headers="myHeaders"
                         :auto-upload="true"
                         :http-request="httpRequest">
                <span class="left_tips_txt"
                      :disabled="!OwnAuthDisabled">
                  <img class="img"
                       src="../../../../assets/images/doorAccess/add_img_icon.png"
                       alt /> 添加图片
                </span>
              </el-upload>

              <span class="tips_txt">图片格式为JPG/PNG，推荐上传800*450，16:9尺寸图片，最多可以添加5张</span>
            </el-header>
            <el-header>
              <span class="left_tips_txt">
                <el-checkbox @change="onChangeLoop"
                             v-model="loop">循环播放</el-checkbox>
              </span>
              <span class="tips_txt"
                    v-if="picture.length > 1">
                每张停留时间
                <el-input type="number"
                          v-model="duration"></el-input>秒
              </span>
            </el-header>
            <el-row class="colRowBoxClass"
                    style="margin-top: 15px;">
              <el-row :gutter="13"
                      id="scrollView"
                      class="colBoxClass"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-col class
                        :span="4"
                        v-for="(item, index) in pictureForLocalShow"
                        :key="index">
                  <div class="imgListCellClass">
                    <img width="140px"
                         height="120px"
                         :src="showPicture(item)" />
                    <div class="imgBox"
                         @click="deleteImage(index)">
                      <img src="../../../../assets/images/doorAccess/delete_icon.png"
                           alt />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="center"
                style="margin-top: 20px;"
                :gutter="30">
          <el-col class="left_box"
                  :span="5">
            <p>信息：</p>
          </el-col>
          <el-col class="i-inner"
                  style="margin-top: 10px;"
                  :span="19">
            <el-input type="textarea"
                      :rows="4"
                      maxlength="180"
                      placeholder="最多可输入180个字符"
                      v-model="info"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="center"
                :gutter="30">
          <el-col class="left_box"
                  :span="5"></el-col>
          <el-col class="right_box right_box_textarea"
                  :span="19">
            <el-button :disabled="!OwnAuthDisabled"
                       type="primary"
                       size="mini"
                       @click="submitAct"
                       class="footer-button">发送</el-button>
            <el-button :disabled="!ShowAuthDisabled"
                       type="primary"
                       size="mini"
                       @click="onClickClear"
                       class="footer-button">清空</el-button>
          </el-col>
        </el-row>
      </el-scrollbar>
    </el-col>

    <tab-tree-tag title="发送对象"
                  rightTxt="已选的分组、设备、门"
                  :tabs="tabs"
                  :modal="true"
                  @onCancel="onCancel"
                  :isShow.sync="isShow"
                  :checkedList="resourceSet"
                  @onConfirm="onConfirm"></tab-tree-tag>
  </el-row>
</template>
<script>
import TabTreeTag from "@/common/TabTreeTag.vue";
import icons from "@/common/icon.js";
export default {
  components: { TabTreeTag },
  props: {},
  data() {
    return {
      updateFileImage: "",
      icons,
      duration: "",
      isLoop: 0,
      loop: false,
      info: "",
      noticeName: "",
      tableData: [],
      picture: [],
      pictureBase64List: [],
      pictureForLocalShow: [],
      myHeaders: {},
      isShow: false,
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id",
          hasDoor: false
        }
      ],
      resourceSet: [],
      isDisable: false,
      picBaseUrl: "",
      isLoading: false,
      noticeUuid: "",
      version: 0,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      currentRowIndex: -1
    };
  },
  created() {},
  mounted() {
    // this.getPublicMessageList();
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("发布公告", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("发布公告", "isOwn");
    let projectType = this.$store.state.home.projectType;
    // 判断不是学校项目则加入基建的选项
    if (projectType.platformType !== "school") {
      this.tabs.push({
        id: "2",
        label: "地址",
        treeType: "resident",
        treeNodeType: "device",
        treeRef: "tree2",
        nodeKey: "id"
      });
      // 按照id 大小排序
      this.tabs.sort((item1, item2) => {
        let id1 = Number(item1.id);
        let id2 = Number(item2.id);
        return id1 - id2;
      });
    }
  },
  activated() {
    setTimeout(() => {
      if (!this.ShowAuthDisabled) return;
      this.getPublicMessageList();
    }, 0);
  },
  methods: {
    getPublicMessageList() {
      this.tableData = [];
      this.isLoading = true;
      this.$DoorSetAjax
        .getPublicMessageListApi({
          limit: 9999,
          page: 1
        })
        .then(res => {
          let body = res.data;
          this.getPublicMessageListSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getPublicMessageListSuccessResponse(body) {
      if (body.data) {
        this.tableData = body.data.list || [];
        this.handleDefaultChooseFirstData();
      } else {
        this.onClickClear();
      }
    },
    setCurrentRow(index) {
      if (this.$refs.elTable) {
        this.$refs.elTable.setCurrentRow(this.tableData[index]);
      }
    },
    handleDefaultChooseFirstData() {
      if (!this.tableData || this.tableData.length === 0) {
        // 清除右边的页面数据
        this.onClickClear();
        return;
      }
      let index = 0;
      if (this.noticeUuid === "") {
        index = 0;
      } else if (this.currentRowIndex && this.currentRowIndex >= 0) {
        index = this.currentRowIndex;
      }
      this.setCurrentRow(index);
      this.handleRowClick(this.tableData[index]);
    },
    handleRowClick(row) {
      this.currentRowIndex = this.getIndexById(row);
      this.$DoorSetAjax.getPublicMessageApi(row.noticeUuid).then(res => {
        let body = res.data.data;
        this.getPublicMessageApiSuccessResponse(body);
      });
    },
    getIndexById(row) {
      if (!row || this.tableData.length === 0) {
        return -1;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (row.noticeUuid === this.tableData[i].noticeUuid) {
          return i;
        }
      }
      return -1;
    },
    getPublicMessageApiSuccessResponse(body) {
      this.onClickClear();
      if (!body) {
        return;
      }
      this.duration = body.duration;
      this.isLoop = body.isLoop;
      if (this.isLoop === 0) {
        this.loop = false;
      } else {
        this.loop = true;
      }
      this.info = body.info;
      this.noticeName = body.noticeName;
      this.noticeUuid = body.noticeUuid;
      this.version = body.version;
      this.picture = body.picture;
      this.pictureForLocalShow = [];
      if (this.picture) {
        for (let item of this.picture) {
          this.pictureForLocalShow.push({
            url: item,
            type: "web"
          });
        }
      }
      this.pictureBase64List = [];
      if (!body.resourceSetVOS) {
        this.resourceSet = [];
      } else {
        this.resourceSet = this.$common.copyArray(
          body.resourceSetVOS,
          this.resourceSet
        );
      }
      for (let item of this.resourceSet) {
        this.$set(item, "id", item.resUuid);
        this.$set(item, "label", item.resName);
      }
    },
    onCancel() {
      this.isShow = !this.isShow;
    },
    submitAct() {
      if (this.resourceSet.length === 0) {
        this.$cToast.warn("请选取设备");
        return;
      }
      if (!this.noticeName) {
        this.$cToast.warn("请填写主题");
        return;
      }
      let picture = [];
      if (!this.noticeUuid) {
        picture = [];
      } else {
        for (let item of this.picture) {
          if (item.substr(0, 4) !== "blob") {
            picture.push(item);
          }
        }
      }
      if (
        !this.noticeUuid &&
        this.pictureForLocalShow.length > 1 &&
        parseInt(this.duration) === 0
      ) {
        this.$cToast.warn("照片停留时间不能为0秒");
        return;
      }
      if (
        this.noticeUuid &&
        this.picture.length > 1 &&
        parseInt(this.duration) === 0
      ) {
        this.$cToast.warn("照片停留时间不能为0秒");
        return;
      }
      let xhr = {
        duration: parseInt(this.duration),
        noticeUuid: this.noticeUuid,
        isLoop: this.isLoop,
        noticeName: this.noticeName,
        pictureBase64List: this.pictureBase64List,
        picture,
        resourceSet: this.resourceSet,
        info: this.info,
        version: this.version
      };
      this.$DoorSetAjax.postPublicMessageApi(xhr).then(res => {
        let body = res.data;
        this.postPublicMessageApiSuccessResponse(body);
      });
    },
    postPublicMessageApiSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.getPublicMessageList();
    },
    onClickClear() {
      this.duration = "";
      this.isLoop = 0;
      this.loop = false;
      this.info = "";
      this.noticeName = "";
      this.picture = [];
      this.pictureForLocalShow = [];
      this.pictureBase64List = [];
      this.resourceSet = [];
      this.noticeUuid = "";
    },
    httpRequest(e) {
      if (
        e.file.type === "image/png" ||
        e.file.type === "image/jpg" ||
        e.file.type === "image/jpeg"
      ) {
        if (this.picture.length < 5) {
          this.picture.push(URL.createObjectURL(e.file));
          this.pictureForLocalShow.push({
            url: URL.createObjectURL(e.file),
            type: "local"
          });
        }
        if (this.picture.length < 5) {
          this.isDisable = false;
        } else {
          this.isDisable = true;
        }
        let reader = new FileReader();
        reader.readAsDataURL(e.file);
        let _this = this;
        reader.onload = function(e) {
          _this.picBaseUrl = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
          _this.pictureBase64List.push(_this.picBaseUrl);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    deleteImage(index) {
      this.picture.splice(index, 1);
      this.pictureForLocalShow.splice(index, 1);
      if (this.picture.length < 5) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    },
    addDeviceTag() {
      this.isShow = !this.isShow;
    },
    // 新建公告
    addReportMessageAct() {
      this.onClickClear();
    },
    deleteNotice(row) {
      // 删除公告
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认删除？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {})
        .catch(action => {
          if (action === "cancel") {
            this.$DoorSetAjax
              .deletePublicMessageApi(row.noticeUuid)
              .then(res => {
                let body = res.data;
                this.deletePublicMessageSuccessResponse(body);
              });
          }
        });
    },
    deletePublicMessageSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.currentRowIndex = -1;
      this.getPublicMessageList();
    },
    onConfirm(data) {
      // 接受返回的标签
      this.resourceSet = [];
      this.isShow = !this.isShow;
      console.log(data);
      for (let [i, v] of data.entries()) {
        this.resourceSet.push({
          resSn: i,
          resType: v.type,
          resUuid: v.id,
          resName: v.orgName || v.deviceName || v.nickName || v.label,
          id: v.id,
          label: v.orgName || v.deviceName || v.nickName || v.label
        });
      }
    },
    deleteDev(index) {
      this.resourceSet.splice(index, 1);
    },
    onChangeLoop(val) {
      if (val) {
        this.isLoop = 1;
      } else {
        this.isLoop = 0;
      }
    },
    showPicture(item) {
      let url = "";
      if (item.type === "web") {
        url = this.$common.setPictureShow(item.url);
      } else {
        url = item.url;
      }
      return url;
    }
  },
  watch: {},
  destroyed() {},
  computed: {
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>
<style>
.left_tips_txt .el-checkbox__label {
  color: #dddddd;
}
.i-inner .el-textarea__inner {
  background-color: transparent;
  width: 70%;
}
.right_box_textarea {
  margin-top: 30px;
}
.PublicMessage .PBoxMenu .el-tree {
  background-color: transparent;
}
.PublicMessage .img {
  vertical-align: baseline;
}
.PMBox .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style scoped lang="scss">
.PublicMessage {
  height: 100%;
  .PMBox {
    background-color: rgb(33, 35, 37);
    height: 100%;
    padding-top: 20px;
    .delete-button {
      color: #ff5f5f;
    }
  }
  .PBoxMenu {
    margin-right: 20px;
    padding: 0 20px;
    .el-header {
      padding: 0;
      line-height: 60px;
    }
  }
  .PBoxMain {
    padding-top: 80px;
    .el-header {
      line-height: 60px;
      padding-left: 0px;
    }
  }
  .left_box {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #dddddd;
    text-align: right;
    line-height: 60px;
    p {
      margin: 0;
    }
  }
  .right_box {
    text-align: left;
    // line-height: 60px;
    .el-input {
      width: 30%;
      height: 32px;
      line-height: 60px;
    }
    .tips_txt {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #dddddd;
      .el-input {
        width: 8%;
        margin: 3px 5px;
        height: 32px;
        line-height: 30px;
      }
    }
    .left_tips_txt {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #26d39d;
      margin-right: 32px;
    }
    .el-textarea__inner:hover {
      border-color: #c0c4cc;
    }
    .imgListCellClass {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .imgBox {
      width: 22px;
      height: 22px;
      border-radius: 11px;
      position: absolute;
      right: 3px;
      top: 3px;
      background-color: rgba(17, 17, 17, 0.5);
      img {
        width: 10px;
        height: 10px;
        margin: 6px;
      }
    }
  }
  .uploadClass {
    // border: 1px solid red;
    display: inline-block;
  }
  .footer-button {
    padding: 7px 27px;
  }
  .showAllSelect {
    // min-height: 50px;
    .sbtn {
      margin-right: 10px;
      margin-bottom: 8px;
    }
  }
}
</style>
