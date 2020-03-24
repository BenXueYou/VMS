<template>
  <div class="ResidentTagWrap"
       v-loading="mainScreenLoading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-row type="flex"
            justify="space-between">
      <el-col class="leftBox"
              :span="12">
        <span>{{tagName}}（{{total}}人）</span>
      </el-col>
      <el-col class="rightBox"
              :span="12">
        <span :class="OwnAuthDisabled?'cursorClass':'disabled'"
              @click="updateTagName">
          <img class="img"
               v-if="OwnAuthDisabled"
               src="../../../assets/images/resident/modify_icon.png"
               alt />
          <img class="img"
               style="width:15px;height:15px;"
               v-else
               src="../../../assets/images/resident/unabled_modify.png"
               alt />
          修改标签

        </span>
        <span style="color:rgba(255,255,255,0.1)">|</span>
        <span :class="ShowAuthDisabled?'cursorClass':'disabled'"
              @click="detailDialogAct">
          <img class="img"
               src="../../../assets/images/resident/detail_tag_icon.png"
               alt /> 标签详情
        </span>
      </el-col>
    </el-row>

    <el-main>
      <el-header>
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   size="small"
                   @click="addElementToTagAct">添加楼栋房屋/居民</el-button>
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   size="small"
                   @click="removeTagAct">移出</el-button>
      </el-header>
      <el-table ref="multipleTagTable"
                :data="tableData"
                tooltip-effect="dark"
                class="tableBoxClass"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="100"></el-table-column>
        <el-table-column prop="staffName"
                         label="名称"></el-table-column>
        <el-table-column prop="address"
                         label="楼栋房屋"></el-table-column>
      </el-table>
      <el-footer class="footerClass">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       layout="total,prev, pager, next,jumper"
                       :page-size="pageSize"
                       :total="total"
                       background></el-pagination>
      </el-footer>
    </el-main>
    <!-----------------------------------------添加地址居民到标签----------------------------------->
    <person-tree-tag title="添加地址/居民到标签"
                     rightTxt="已选择的地址或居民"
                     :isShow="isShow"
                     :treeType="treeType"
                     treeNodeType="staff"
                     :checkedNodeArr="checkedNode"
                     @onCancel="onCancel"
                     @onConfirm="onConfirm"></person-tree-tag>
    <!---------------------------------------------标签详情---------------------------------------------->
    <el-dialog title="标签详情"
               :visible.sync="detailDialogVisible"
               width="25%"
               center>
      <el-row type="flex"
              class="changeTagBox">
        <el-col :span="8"
                style="padding-top:12px;">
          <img src="@/assets/images/resident/tag_default.png"
               alt
               srcset />
          {{checkedLeftTagData.tagName}}：
        </el-col>
        <el-col :span="16">
          <!-- <p v-for="(value, name) in residentTag"
             :key="name"
             v-show="tn[name]">
            <span style='display:inline-block;width:60px;'>包含{{tn[name]}}</span>
            <span>{{value || 0}}</span>
					</p>-->
          <p>
            <span>包含区域</span>
            <span>{{residentTag.area || 0}}</span>
          </p>
          <p>
            <span>包含期&nbsp;&nbsp;&nbsp;</span>
            <span>{{residentTag.phase || 0}}</span>
          </p>
          <p>
            <span>包含楼栋</span>
            <span>{{residentTag.building || 0}}</span>
          </p>
          <p>
            <span>包含单元</span>
            <span>{{residentTag.unit || 0}}</span>
          </p>
          <p>
            <span>包含楼层</span>
            <span>{{residentTag.floor || 0}}</span>
          </p>
          <p>
            <span>包含居民</span>
            <span>{{residentTag.staff || 0}}</span>
          </p>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="detailDialogVisible = false">保 存</el-button>
        <el-button type="primary"
                   @click="detailDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import personTreeTag from "@/common/personTreeTag";
import tagView from "@/common/TagView";
// import * as api from "@/pages/equipmentMange/ajax.js";
import { mapState } from "vuex";
export default {
  name: "TheTagTable",
  props: {},
  components: { personTreeTag, tagView },
  data() {
    return {
      pageSize: 15,
      currentPage: 1,
      total: 0,
      tableData: [],
      isShow: false,
      checkedNode: [],
      removeDialogVisble: false,
      changeDialogVisible: false,
      detailDialogVisible: false,
      tagName: "",
      defaultExpandedKeys: [],
      orgType: "organization.device",
      treeType: "resident",
      mainScreenLoading: false,
      checkStaffUuids: [],
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "device",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeRef: "tree2",
          nodeKey: "id"
        }
      ],
      residentTag: {},
      isResize: true,
      tn: {
        area: "区域",
        building: "楼栋",
        unit: "单元",
        floor: "层",
        house: "房屋",
        affiliated: "附属基建",
        bayonet: "卡口",
        phase: "期",
        staff: "居民"
      },
      ShowAuthDisabled: false,
      OwnAuthDisabled: false
    };
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("居民管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("居民管理", "isOwn");
    // this.OwnAuthDisabled = false;

    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.$refs.multipleTagTable.$el.style.height = h - 280 + "px";
    // 这里 -1 是为了去掉表头高度
    this.pageSize = parseInt((h - 280) / 48) - 1;
    console.log(this.tableSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      that.$refs.multipleTagTable.$el.style.height = h - 280 + "px";
      var pageSize = parseInt((h - 280) / 48) - 1;
      if (pageSize !== that.pageSize && that.isResize) {
        that.pageSize = pageSize;
        that.getTagTreeDetail();
      }
    });
  },
  deactivated() {
    this.isResize = false;
  },
  activated() {
    this.isResize = true;
  },
  computed: {
    ...mapState({
      checkedLeftTagData: state => {
        console.log(state);
        return state.resident.curLeftTagData;
      }
    })
  },
  methods: {
    updateTagName() {
      if (this.checkedLeftTagData && !this.checkedLeftTagData.tagUuid) {
        this.$message({ type: "warning", message: "没有选择标签" });
      } else {
        this.changeDialogVisible = this.$common.getAuthIsOwn(
          "居民管理",
          "isShow"
        );
        this.$bus.$emit("ModifyTagName", this.changeDialogVisible);
      }
    },
    addElementToTagAct() {
      if (this.checkedLeftTagData && !this.checkedLeftTagData.tagUuid) {
        this.$message({ type: "warning", message: "没有选择标签" });
        return;
      }
      this.isShow = !this.isShow;
    },
    getTagTreeDetail() {
      if (this.checkedLeftTagData && !this.checkedLeftTagData.tagUuid) {
        this.$message({ type: "warning", message: "没有选择标签" });
        this.tableData = [];
        return;
      }
      let queryTyoeUuid = this.checkedLeftTagData.tagUuid;
      var xhr = {
        limit: this.pageSize,
        page: this.currentPage,
        queryType: "staffLabel",
        queryTypeUuid: queryTyoeUuid
      };
      this.mainScreenLoading = true;
      setTimeout(() => {
        this.mainScreenLoading = false;
      }, 10000);
      this.$ResidentManageAjax.getResidentListApi(xhr).then(res => {
        this.mainScreenLoading = false;
        this.tableData = [];
        if (res.data.success && res.data.data.list) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message({
            type: "error",
            message: "出错了！！！"
          });
        }
      });
    },
    removeTagAct() {
      if (this.checkedNode && !this.checkedNode.length) {
        this.$message({
          type: "warning",
          message: "没有选择移出的元素"
        });
        return;
      }
      this.$confirm("是否从该标签中移出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteElementFromTag(this.checkedNode);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除接口函数
    deleteElementFromTag(staffUuids) {
      this.$ResidentManageAjax
        .deleteElementFromTag(this.checkedNode, this.checkedLeftTagData)
        .then(res => {
          console.log("删除返回接口", res.data);
          if (res.data.success) {
            console.log("已移出！");
            this.$message({
              type: "success",
              message: "已移出"
            });
            console.log(this.checkedLeftTagData);
            this.$bus.$emit(
              "getLeftMenuTag",
              JSON.parse(JSON.stringify(this.checkedLeftTagData))
            );
            // this.getTagTreeDetail();
          }
        });
    },
    // 标签内添加元素
    addElementToTag(xhr, checkedLeftTagData) {
      this.$ResidentManageAjax
        .addElementToTag(xhr, checkedLeftTagData)
        .then(res => {
          console.log("添加标签元素", res.data);
          if (res.data.success) {
            console.log("添加成功！");
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            this.isShow = !this.isShow;
            this.$bus.$emit("getLeftMenuTag", this.checkedLeftTagData);
            // this.getTagTreeDetail();
          }
        });
    },
    // 编辑标签内元素
    putElementToTag(xhr, checkedLeftTagData) {
      console.log("编辑标签内元素");
      this.$ResidentManageAjax
        .putElementForResidentTag(xhr, checkedLeftTagData)
        .then(res => {
          console.log("编辑标签元素", res.data);
          if (res.data.success) {
            console.log("编辑成功！");
            this.$message({
              type: "success",
              message: "编辑成功！"
            });
            this.isShow = !this.isShow;
            this.$bus.$emit("getLeftMenuTag", this.checkedLeftTagData);
            // this.getTagTreeDetail();
          }
        });
      // this.addElementToTagAct();
      // this.$bus.$emit("getLeftMenuTag", this.curLeftTagData);
    },
    detailDialogAct() {
      if (this.checkedLeftTagData && !this.checkedLeftTagData.tagUuid) {
        this.$message({ type: "warning", message: "没有选择标签" });
        return;
      }
      if (!this.$common.getAuthIsOwn("居民管理", "isShow")) return;
      var tagUuid = this.checkedLeftTagData.tagUuid;
      this.$ResidentManageAjax
        .getResidentTagBriefDetail(tagUuid, "resident")
        .then(res => {
          if (res.data.success) {
            this.residentTag = res.data.data;
            this.detailDialogVisible = !this.detailDialogVisible;
          } else {
            this.$message({ type: "error", message: "服务器开小差了" });
          }
        });
    },
    onCancel() {
      this.isShow = !this.isShow;
    },
    onConfirm(data) {
      // 接受返回的标签
      console.log(this.checkedLeftTagData, "添加地址居民到标签", data);
      this.checkedNode = data;
      if (this.checkedLeftTagData && !this.checkedLeftTagData.tagUuid) {
        this.$message({ type: "warning", message: "没有选择标签" });
        return;
      }
      if (this.tableData && this.tableData.length) {
        // 编辑标签内元素
        this.putElementToTag(data, this.checkedLeftTagData);
      } else {
        // 给标签内新增元素
        this.addElementToTag(data, this.checkedLeftTagData);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTagTreeDetail();
    },
    handleSizeChange() {},
    handleSelectionChange(val) {
      this.checkedNode = val;
      console.log("table select-change:", val);
      this.checkStaffUuids = [];
      if (val && val.length) {
        val.forEach(item => {
          this.checkStaffUuids.push(item.staffUuid);
        });
      }
    }
  },
  watch: {
    tabs: {
      handler(val) {
        console.log("tabs:", val);
      },
      immediate: true,
      deep: true
    },
    isShow(val) {
      console.log(val, this.tableData);
      this.checkedNode = [];
      if (val && this.total) {
        this.tableData.forEach(item => {
          item.id = item.staffUuid;
          item.label = item.staffName;
          item.type = item.staffType;
          this.checkedNode.push(item);
        });
      }
    },
    checkedLeftTagData(val) {
      this.tagName = val.tagName;
      this.currentPage = 1;
      this.getTagTreeDetail();
    }
    // changeDialogVisible(val) {
    //   if (val) {
    //     this.$bus.$emit("ModifyTagName", val);
    //   }
    // }
  }
};
</script>
<style>
.tagDialogBox .el-dialog {
  padding: 0 0 36px;
}
.ResidentTagWrap .el-dialog--center .el-dialog__body {
  text-align: initial;
  padding: 25px 25px 0px;
}
.el-message-box__btns .el-button {
  background: rgba(40, 255, 187, 0.1);
  border: 1px solid rgba(40, 255, 187, 0.45);
  border-radius: 2px;
}
.el-message-box__title,
.el-message-box__content {
  color: #dddddd;
}
</style>
<style lang="scss" scoped>
.ResidentTagWrap {
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #dddddd;
  letter-spacing: 0.5px;
  height: 100%;
  box-sizing: border-box;
  .leftBox {
    text-align: left;
    // height: 40px;
    padding-left: 20px;
    padding-bottom: 15px;
  }
  .rightBox {
    text-align: right;
    // height: 40px;
    padding-right: 20px;
    padding-bottom: 15px;
    span {
      color: #26d39d;
      margin: 0 12px;
      font-size: 13px;
      font-family: PingFangSC-Regular;
    }
  }
  .el-main {
    background: #212325;
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
  }
  .el-main .el-header {
    // height: ;
    line-height: 60px;
    padding-left: 30px;
  }
  .tableBoxClass {
    width: 60%;
    padding: 0px 30px;
    box-sizing: border-box;
  }
  .footerClass {
    width: calc(60% - 30px);
    text-align: right;
  }
  .changeTagBox {
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #dddddd;
    text-align: left;
    padding-left: 36px;
    .el-input {
      display: inline-block;
      width: 50%;
      margin-left: 5px;
    }
  }
  .dialog-footer {
    line-height: 80px;
    margin-bottom: 36px;
  }
  .el-dialog--center .el-dialog__footer {
    text-align: inherit;
  }
}
</style>
