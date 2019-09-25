<template>
  <div class="AntiBack">
    <el-row ref="headerRef"
            class="header"
            type="flex"
            justify="space-between">
      <el-col :span="20">
        <img class="img"
             src="../../../../assets/images/doorAccess/careful_icon.png"
             alt>
        <span class="header-title">
          <span class="header-title-tips">线路反潜回：</span>设置好开门路径，如果不按照此路径验证，门将无法打开
        </span>
        <span class="header-title">
          <span class="header-title-tips">进出反潜回：</span>某个用户如果验证之后不进门/出门，再次验证时门将无法打开
        </span>
      </el-col>
      <el-col :span="4"
              class="header-buttton-box">
        <el-button type="primary"
                   @click="addAntiBackAct">
          <img class="img"
               src="../../../../assets/images/doorAccess/add_btn_icon.png"
               alt>新增
        </el-button>
      </el-col>
    </el-row>
    <el-row ref="bodyRef"
            class="body">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="80"></el-table-column>
        <el-table-column prop="groupName"
                         label="反潜回方案名称"
                         width="160"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="returnTypeName"
                         :show-overflow-tooltip="true"
                         label="反潜回读头">
          <template slot-scope="scope">
            <!-- 进出反潜回 -->
            <template v-if="scope.row.returnType == 'entry_exit'">
              <div style="text-align:left">
                进：
                <span v-for="(item, index) in scope.row.entrySetVOList"
                      :key="index">{{item}}／</span>
              </div>
              <div style="text-align:left">
                出：
                <span v-for="(item, index) in scope.row.checkOutSetVOList"
                      :key="index">{{item}}／</span>
              </div>
            </template>
            <!-- 线路反潜回 -->
            <template v-else>
              <div style="text-align:left">
                <span style="margin-right:15px;"
                      v-for="(item, index) in scope.row.entrySetVOList"
                      :key="index">{{index+1}}：{{item}}</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="returnTypeName"
                         label="反潜回类型"
                         width="180"></el-table-column>
        <el-table-column prop="address"
                         label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       @click.stop="editButtonAct(scope.row)">编辑</el-button>
            <el-button type="text"
                       size="small"
                       class="delete-button"
                       @click.stop="openDeleteDialog(scope.row)">删除</el-button>
            <!-- <el-switch
							:width="27"
							v-model="scope.row.enabled"
							@change="changeSwith(scope.row)"
							active-color="rgba(255,255,255,0.2)"
							inactive-color="#26D39D40"
						></el-switch>-->
            <el-switch :width="27"
                       v-model="scope.row.enabled"
                       @change="changeSwith(scope.row)"
                       active-color="#26D39D40"
                       inactive-color="rgb(72,73,75)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row ref="footerRef"
            class="footer">
      <el-col :span="24"
              class="footerPages"
              style="text-align:right">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       layout="total,prev, pager, next,jumper"
                       :page-size="pageSize"
                       :total="total"
                       background></el-pagination>
      </el-col>
    </el-row>
    <!-- --------------------------    弹窗   ------------------------------------- -->
    <AntiBack-dialog :isShow="isShow"
                     :antiBackDetail="antiBackDetail"
                     @onConfirm="onConfirm"
                     @onCancel="onCancel"></AntiBack-dialog>
  </div>
</template>

<script>
import AntiBackDialog from "../../components/doorAccessSetting/AntiBackDialog";
import * as api from "../../utils/ajax.js";
export default {
  components: {
    AntiBackDialog
  },
  props: {},
  data() {
    return {
      isShow: false,
      currentPage: 1,
      pageSize: 16,
      total: 0,
      tempValue: false,
      tableData: [],
      antiBackDetail: {},
      isResize: true
    };
  },
  created() {},
  mounted() {
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.$refs.bodyRef.$el.style.height = h - 240 + "px";
    // 当窗口发生变化时
    let that = this;
    function resizeEvent() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      that.$refs.bodyRef.$el.style.height = h - 240 + "px";
      var pageSize = parseInt((h - 240) / 50) - 1;
      if (pageSize !== that.pageSize && that.isResize) {
        that.pageSize = pageSize;
        that.initData();
      }
    }
    window.addEventListener(
      "resize",
      this.$common.throttle(resizeEvent, 300, { trailing: false })
    );
  },
  activated() {
    this.isResize = true;
    this.initData();
  },
  deactivated() {
    this.isResize = false;
  },
  methods: {
    initData() {
      var xhr = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      this.$DoorSetAjax.getAntiBackApi(xhr).then(res => {
        console.log(res.data);
        this.total = 0;
        if (res.data.success) {
          let data = res.data.data.list || [];
          for (let i = 0; i < data.length; i++) {
            data[i].enabled = data[i].enabled === 1;
          }
          this.tableData = data;
          this.total = res.data.data.total;
        }
      });
    },
    // 启用或关闭反潜回
    changeSwith(row) {
      console.log(row);
      api
        .switchAntiUrl(row.groupUuid, row.enabled ? 1 : 0, row.version)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("修改成功");
            this.initData();
          }
        })
        .catch(() => {
          this.initData();
        });
    },
    openDeleteDialog(row) {
      console.log(row);
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
        .then(() => {
          this.$message({ type: "info", message: "取消删除" });
        })
        .catch(action => {
          if (action === "cancel") {
            api.deleteAnti(row.groupUuid).then(res => {
              if (res.data.success) {
                this.$message.success("删除成功！");
                this.initData();
              }
            });
          }
        });
    },
    editButtonAct(data) {
      this.getAntiBackDetail(data);
    },
    // 查询详情
    getAntiBackDetail(data) {
      this.$DoorSetAjax.getAntiBackDetailApi(data.groupUuid).then(res => {
        console.log("编辑", res.data);
        if (res.data.success && res.data.data) {
          this.antiBackDetail = res.data.data;
          this.isShow = !this.isShow;
        } else {
          this.$message({ type: "error", message: "详情查询失败" });
        }
      });
    },

    addAntiBackAct() {
      // 新增互锁
      console.log("新增互锁组");
      this.isShow = !this.isShow;
      this.antiBackDetail = {};
    },
    onCancel() {
      this.isShow = !this.isShow;
    },
    onConfirm() {
      this.currentPage = 1;
      this.initData();
      this.isShow = !this.isShow;
    },
    handleCurrentChange(val) {
      console.log("当前页面变化的回调函数");
      this.currentPage = val;
      this.initData();
    },
    handleSizeChange() {
      console.log("每一页数量变化时的回调函数");
      this.openDeleteDialog();
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
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
.AntiBack .el-switch.is-checked .el-switch__core::after {
  left: 100%;
  margin-left: -11px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.AntiBack {
  height: 100%;
  background-color: rgba(35, 38, 41, 0.8);
  color: #dddddd;
  padding: 15px 40px 0px;
  .header {
    width: 100%;
    height: 5%;
    background: transparent;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .header-title {
      color: #bbbbbb;
      font-size: 13px;
      margin-right: 5%;
      .header-title-tips {
        color: #ff5f5f;
      }
    }
    .header-buttton-box {
      text-align: right;
    }
    .header-buttton-box button {
      height: 32px;
      padding: 10px 22px;
      font-size: 13px;
    }
  }
  .body {
    height: 100%;
    // background: rgba(35,38,41,0.8);
    padding-top: 15px;
    .delete-button {
      color: #ff5f5f;
      margin-right: 10px;
    }
    .el-switch__core {
      margin: 0;
      display: inline-block;
      position: relative;
      width: 40px;
      height: 16px;
      border: 1px solid #dcdfe6;
      outline: none;
      border-radius: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background: #dcdfe6;
      cursor: pointer;
      -webkit-transition: border-color 0.3s, background-color 0.3s;
      transition: border-color 0.3s, background-color 0.3s;
      vertical-align: middle;
    }
  }
  .footer {
    width: 100%;
    padding: 10px 25px;
    // background-color: rgba(35,38,41,0.8);
  }
}
</style>
