<template>
	<div class="ManMakeUpOpen">
		<el-row ref="headerRef" class="header" type="flex" justify="space-between">
			<el-col :span="20">
				<img class="img" src="../../../../assets/images/doorAccess/careful_icon.png" alt />
				<span class="header-title">
					<span class="header-title-tips">注：</span>需要多人均验证通过后才能开门
				</span>
			</el-col>
			<el-col :span="4" class="header-buttton-box">
				<el-button :disabled="!OwnAuthDisabled" type="primary" @click="addManMakeUpOpenAct">
					<img class="img" src="../../../../assets/images/doorAccess/add_btn_icon.png" alt /> 新增
				</el-button>
			</el-col>
		</el-row>
		<el-row ref="bodyRef" class="body">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="index" :index="tableIndex" label="序号" width="80">
					<template slot-scope="scope">
						<div>{{scope.$index + 1}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="门"></el-table-column>
				<el-table-column prop="deviceName" label="设备"></el-table-column>
				<el-table-column prop="atLeast" label="至少验证通过人数" width="150"></el-table-column>
				<el-table-column prop="intervals" label="验证时间间隔（秒）" width="150"></el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<!-- <el-button type="text"
                       size="small"
						@click.stop="detailButtonAct(scope.row)">详情</el-button>-->
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
		<ManMakeUpOpen-dialog :row="row" :isShow="isShow" @onCancel="addManMakeUpOpenAct"></ManMakeUpOpen-dialog>
	</div>
</template>
<script>
import ManMakeUpOpenDialog from "../../components/doorAccessSetting/ManMakeUpOpenDialog";
import * as api from "../../utils/ajax.js";
export default {
  components: {
    ManMakeUpOpenDialog
  },
  props: {},
  data() {
    return {
      isShow: false,
      currentPage: 1,
      pageSize: 16,
      total: 1,
      tempValue: false,
      tableData: [],
      row: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("多人组合开门", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("多人组合开门", "isOwn");
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
    this.init();
  },
  methods: {
    init() {
      if (!this.ShowAuthDisabled) return;
      this.initData();
    },
    initData() {
      var xhr = {
        page: this.currentPage,
        limit: this.pageSize
      };
      api.getDRZH(xhr).then(res => {
        console.log(res);
        if (res.data.success && res.data.data) {
          let data = res.data.data;
          let list = data.list || [];
          for (var i = 0, len = list.length; i < len; i++) {
            list[i].nickName = list[i].nickName || list[i].channelName;
          }
          this.tableData = list;
          this.total = data.total;
        }
      });
    },
    detailButtonAct(row) {
      console.log("打开详情弹窗按钮");
      api.detailDRZH(row.groupUuid).then(res => {
        console.log(res);
      });
    },
    openDeleteDialog(row) {
      const _this = this;
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
        .then(res => {
          this.$message({ type: "info", message: "取消删除" });
        })
        .catch(action => {
          if (action === "cancel") {
            api.deleteDRZH(row.groupUuid).then(res => {
              if (res.data.success) {
                _this.$message.success("删除成功！");
                _this.initData();
              }
            });
          }
        });
    },
    editButtonAct(row) {
      console.log(row);
      api.detailDRZH(row.groupUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.row = res.data.data || {};
          this.isShow = true;
        }
      });
    },
    addManMakeUpOpenAct() {
      this.row = {};
      this.isShow = !this.isShow;
      this.initData();
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
.ManMakeUpOpen {
	height: 100%;
	background-color: rgba(35, 38, 41, 0.8);
	color: #dddddd;
	padding: 15px 40px 0px;
	.header {
		width: 100%;
		height: 5%;
		background-color: transparent;

		display: flex;
		flex-flow: row nowrap;
		padding: 0px 25px;
		align-items: center;
		.header-title {
			color: #dddddd;
			font-size: 12px;
			margin-right: 5%;
			.header-title-tips {
				color: #ff5f5f;
			}
		}
		.header-buttton-box {
			text-align: center;
		}
		.header-buttton-box button {
			height: 35px;
			padding: 10px 20px;
			font-size: 14px;
		}
	}
	.body {
		height: 100%;
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
	}
}
</style>
