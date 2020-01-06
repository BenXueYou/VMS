<template>
	<div class="FirstCardOpen">
		<el-row ref="headerRef" class="header" type="flex" justify="space-between">
			<el-col :span="20">
				<img class="img" src="../../../../assets/images/doorAccess/careful_icon.png" alt />
				<span class="header-title">
					<span class="header-title-tips">注：</span>首人验证后，门保持开启
				</span>
				<!-- <span class="header-title"><span class="header-title-tips">进出反潜回：</span>某个用户如果验证之后不进门/出门，再次验证时门将无法打开</span> -->
			</el-col>
			<el-col :span="4" class="header-buttton-box">
				<el-button :disabled="!OwnAuthDisabled" type="primary" @click="addFirstCardOpenAct">
					<img class="img" src="../../../../assets/images/doorAccess/add_btn_icon.png" alt />
					新增
				</el-button>
			</el-col>
		</el-row>
		<el-row ref="bodyRef" class="body">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="index" :index="tableIndex" label="序号" width="80"></el-table-column>
				<el-table-column prop="channelName" label="门" width="180"></el-table-column>
				<el-table-column prop="deviceName" label="设备" width="200"></el-table-column>
				<el-table-column prop="duration" label="持续时间(分)" width="200"></el-table-column>
				<el-table-column prop="name" label="有效日期">
					<template slot-scope="scope">{{scope.row.beginTime}}~{{scope.row.endTime}}</template>
				</el-table-column>
				<el-table-column prop="address" label="操作" width>
					<template slot-scope="scope">
						<el-button
							:disabled="!OwnAuthDisabled"
							type="text"
							size="small"
							@click.stop="editButtonAct(scope.row)"
						>编辑</el-button>
						<el-button
							:disabled="!OwnAuthDisabled"
							type="text"
							size="small"
							class="delete-button"
							@click.stop="openDeleteDialog(scope.row)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-row ref="footerRef" class="footer">
			<el-col :span="24" class="footerPages" style="text-align:right">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total,prev, pager, next,jumper"
					:page-size="pageSize"
					:total="total"
					background
				></el-pagination>
			</el-col>
		</el-row>
		<!-- --------------------------    弹窗   ------------------------------------- -->
		<FirstCardOpen-dialog
			:isShow="isShow"
			:FCDetail="FCDetail"
			@onCancel="addFirstCardOpenAct"
			@onConfirm="addFirstCardObj"
		></FirstCardOpen-dialog>
	</div>
</template>
<script>
import FirstCardOpenDialog from "../../components/doorAccessSetting/FirstCardOpenDialog";
export default {
  components: {
    FirstCardOpenDialog
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
      FCDetail: null,
      isResize: true,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("首卡开门", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("首卡开门", "isOwn");
    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    this.$refs.bodyRef.$el.style.height = h - 220 + "px";
    // 这里 -1 是为了去掉表头高度
    this.pageSize = parseInt((h - 220) / 50) - 1;
    console.log(this.pageSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      that.$refs.bodyRef.$el.style.height = h - 220 + "px";
      var pageSize = parseInt((h - 220) / 50) - 1;
      if (pageSize !== that.pageSize && that.isResize) {
        that.pageSize = pageSize;
        if (!this.ShowAuthDisabled) return;
        that.initData();
      }
    });
  },
  activated() {
    if (!this.ShowAuthDisabled) return;
    this.initData();
    this.isResize = true;
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
      this.$DoorSetAjax.getFirstCardApi(xhr).then(res => {
        console.log(res);
        this.total = 0;
        if (res.data.success && res.data.data) {
          let list = res.data.data.list || [];
          for (var i = 0, len = list.length; i < len; i++) {
            list[i].nickName = list[i].nickName || list[i].channelName;
          }
          this.tableData = list;
          this.total = res.data.data.total;
        } else {
          this.$message({
            message: "没有找到相关数据",
            type: "warning"
          });
        }
      });
    },
    openDeleteDialog(data) {
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
            this.deleteFirstCard(data.infoUuid);
          }
        });
    },
    deleteFirstCard(uuid) {
      this.$DoorSetAjax.deleteFirstCardApi(uuid).then(res => {
        if (res.data.success) {
          this.initData();
          this.$message({ type: "success", message: "删除成功" });
        } else {
          this.$message({ type: "error", message: "删除失败" });
        }
      });
    },
    editButtonAct(value) {
      console.log("编辑");
      this.getFCDetail(value.infoUuid);
    },
    getFCDetail(uuid) {
      this.$DoorSetAjax.getFirstCardDetailApi(uuid).then(res => {
        console.log(res.data);
        if (res.data.success) {
          this.FCDetail = res.data.data;
          this.isShow = !this.isShow;
        } else {
          this.$message({ type: "warning", message: "没有找到相关数据" });
        }
      });
    },
    addFirstCardOpenAct() {
      // 新增互锁
      this.FCDetail = {};
      this.isShow = !this.isShow;
    },
    addFirstCardObj() {
      // 新增成功，刷新界面
      this.initData();
      this.addFirstCardOpenAct();
    },
    handleCurrentChange(val) {
      console.log("当前页面变化的回调函数");
      this.currentPage = val;
      this.initData();
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.FirstCardOpen {
	height: 100%;
	background: rgba(35, 38, 41, 0.8);
	color: #dddddd;
	padding: 15px 40px 0px;
	.header {
		width: 100%;
		height: 5%;
		// background-color: #272a2dcc;
		// background: #222326;
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
		// background: #272a2dcc;
		padding-top: 15px;
		overflow: auto;
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
		// background-color: #272a2dcc;
	}
}
</style>
