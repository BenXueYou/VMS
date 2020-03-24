<template>
  <div class="Interlocking">
    <el-row ref="headerRef"
            class="header"
            type="flex"
            justify="space-between">
      <el-col :span="20">
        <img class="img"
             src="@/assets/images/doorAccess/careful_icon.png"
             alt />
        <span class="header-title">注：配置好多门互锁之后，最多只能开启组内一扇门，且其他门必须处于关闭状态才能开启这扇门</span>
      </el-col>
      <el-col :span="4"
              class="header-buttton-box">
        <el-button :disabled="!OwnAuthDisabled"
                   type="primary"
                   @click="addInterLockingAct">
          <img class="img"
               src="@/assets/images/doorAccess/add_btn_icon.png"
               alt /> 新增
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
                         label="互锁组名称"
                         width="180"></el-table-column>
        <el-table-column label="互锁组合">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.doorsNames.join('、')">
              <div>{{scope.row.doorsNames.join("、")}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-button type="text"
                       :disabled="!OwnAuthDisabled"
                       size="small"
                       @click.stop="editButtonAct(scope.row)">编辑</el-button>
            <el-button :disabled="!OwnAuthDisabled"
                       type="text"
                       size="small"
                       class="delete-button"
                       @click.stop="openDeleteDialog(scope.row)">删除</el-button>
            <el-switch :disabled="!OwnAuthDisabled"
                       :width="27"
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
    <interlocking-dialog :isShow="isShow"
                         :row="row"
                         @onCancel="addInterLockingAct"></interlocking-dialog>
  </div>
</template>
<script>
import * as api from "../../utils/ajax";
import InterlockingDialog from "../../components/doorAccessSetting/InterlockingDialog";
export default {
  components: {
    InterlockingDialog
  },
  props: {},
  data() {
    return {
      isShow: false,
      currentPage: 1,
      pageSize: 15,
      total: 0,
      tempValue: false,
      tableData: [],
      row: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("互锁", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("互锁", "isOwn");
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.$refs.bodyRef.$el.style.height = h - 240 + "px";
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      that.$refs.bodyRef.$el.style.height = h - 240 + "px";
    });
  },
  activated() {
    setTimeout(() => {
      if (!this.ShowAuthDisabled) return;
      this.initData();
    }, 0);
  },
  methods: {
    initData() {
      let xhr = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      console.log(this);
      this.$DoorSetAjax.getInterlockingApi(xhr).then(res => {
        console.log(res.data);
        this.total = 0;
        if (res.data.success) {
          if (res.data.data) {
            let data = res.data.data.list || [];
            for (let i = 0; i < data.length; i++) {
              data[i].enabled = data[i].enabled === 1;
              data[i].doorsNames = data[i].doorsNames || [];
            }
            this.tableData = data;
            this.total = res.data.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        } else {
        }
      });
    },
    // 启用或关闭互锁
    changeSwith(row) {
      console.log(row);
      api
        .switchITUrl(row.groupUuid, row.enabled ? 1 : 0, row.version)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            if (row.enabled) {
              this.$message.success("已开启");
            } else {
              this.$message.success("已关闭");
            }
            this.initData();
          }
        })
        .catch(() => {
          this.initData();
        });
    },
    openDeleteDialog(row) {
      console.log(row);
      console.log("删除按钮");
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
            api.deleteIT(row.groupUuid).then(res => {
              console.log(res);
              if (res.data.success) {
                this.$message.success("删除成功！");
                this.initData();
              }
            });
          }
        });
    },
    editButtonAct(row) {
      api.detailIT(row.groupUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.row = res.data.data;
          this.isShow = true;
        }
      });
      // console.log("编辑");
      // this.row = row;
      // this.isShow = !this.isShow;
    },
    addInterLockingAct() {
      // 新增互锁
      this.row = {};
      console.log("新增互锁组");
      this.initData();
      this.isShow = !this.isShow;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
      console.log("当前页面变化的回调函数");
    },
    handleSizeChange() {
      console.log("每一页数量变化时的回调函数");
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
.Interlocking .el-switch.is-checked .el-switch__core::after {
  left: 100%;
  margin-left: -10px;
}
.Interlocking .el-switch__core:after {
  top: -2px;
  height: 12px;
  width: 12px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Interlocking {
  height: 100%;
  background-color: rgba(35, 38, 41, 0.8);
  color: #dddddd;
  padding: 15px 40px 0px;
  .header {
    width: 100%;
    height: 5%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .header-title {
      color: #dddddd;
      font-size: 12px;
    }
    .header-buttton-box {
      text-align: right;
    }
    .header-buttton-box button {
      height: 32px;
      padding: 10px 22px;
      font-size: 13px;
      color: #ffffff;
    }
  }
  .body {
    height: 100%;
    padding-top: 15px;
    .delete-button {
      color: #ff5f5f;
      margin-right: 10px;
    }
  }
  img {
    vertical-align: middle;
    margin-right: 3px;
  }
  .footer {
    width: 100%;
    padding: 10px 25px;
    // background-color: #272a2dcc;
  }
  .el-switch__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 25px;
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
</style>
