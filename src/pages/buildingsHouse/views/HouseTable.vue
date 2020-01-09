<template>
	<div class="house-main">
		<div class="access-main">
			<div class="access-search">
				<el-button :disabled="!OwnAuthDisabled" @click="addHouse" type="primary" size="small">新增房屋</el-button>
				<el-button
					:disabled="!OwnAuthDisabled"
					style="margin-left: 1%;"
					@click="batchImport"
					type="primary"
					size="small"
				>批量导入</el-button>
				<el-button
					:disabled="!OwnAuthDisabled"
					style="margin-left: 1%;"
					@click="batchExport"
					type="primary"
					size="small"
				>批量导出</el-button>
				<el-button
					:disabled="!OwnAuthDisabled"
					style="margin-left: 1%;"
					@click="deleteHouses"
					type="primary"
					size="small"
				>删除</el-button>
				<div class="search-btn">
					<div style="margin-right: 10px;">
						<span class="topTitleTxt">房屋名称：</span>
						<el-input v-model="roomName" class="time-interal" size="small"></el-input>
					</div>
					<el-button
						@click="queryAct"
						icon="el-icon-search"
						style="margin-left: 10px;"
						type="primary"
						size="small"
						:disabled="!ShowAuthDisabled"
					>检索</el-button>
					<el-button :disabled="!ShowAuthDisabled" v-popover:popover type="primary" size="small">其他检索条件</el-button>
					<el-popover
						ref="popover"
						placement="bottom-end"
						width="320"
						@show="onShowPop"
						popper-class="i-popover-box"
						trigger="click"
					>
						<div class="house-more-action">
							<span class="topTitleTxtMore" style="margin-left: -40px;">楼栋单元：</span>
							<build-floor-popover-tree
								width="170px"
								:initTreeRootData="initTreeRootData"
								@setUseData="setUseData"
								:nodeText.sync="nodeText"
								ref="buildPopoverTree"
								:lastLevelType="lastLevelType"
								:isAllCanSelected="true"
							/>
						</div>
						<div class="house-more-action">
							<span class="topTitleTxtMore">房屋类型：</span>
							<el-select class="time-interal" v-model="roomsType" size="small" clearable placeholder="请选择">
								<el-option
									v-for="item in houseTypeOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</div>
						<div class="house-more-action">
							<span class="topTitleTxtMore">房屋用途：</span>
							<el-select class="time-interal" v-model="roomsUse" size="small" clearable placeholder="请选择">
								<el-option
									v-for="item in houseUseOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</div>
						<div class="house-more-action">
							<el-button
								:disabled="!ShowAuthDisabled"
								@click="queryAct"
								size="small"
								style="margin-top:5px;margin-right: 10px;"
								type="primary"
							>检索</el-button>
							<el-button
								:disabled="!OwnAuthDisabled"
								@click="resetQuery"
								style="margin-top:5px;"
								type="text"
							>重置</el-button>
						</div>
					</el-popover>
				</div>
			</div>
			<div class="face-table">
				<el-scrollbar style="height: 92%;transition:0.2s">
					<el-table
						:data="tableData"
						@selection-change="handleSelectionChange"
						v-loading="isLoading"
						style="width: 99%"
					>
						<el-table-column type="selection"></el-table-column>
						<el-table-column type="index" label="序号" width="60"></el-table-column>
						<el-table-column prop="infrastructureName" label="房屋名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="floor" v-if="isHaveFloor" label="楼层" width="90"></el-table-column>
						<el-table-column prop="address" label="楼栋单元" width="250" show-overflow-tooltip></el-table-column>
						<el-table-column prop="roomType" label="房屋类型">
							<template slot-scope="scope">
								<span>{{$common.getEnumItemName("house_t", scope.row.roomType)}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="people" label="入住人数" width="90"></el-table-column>
						<el-table-column prop="roomUse" label="房屋用途">
							<template slot-scope="scope">
								<span>{{$common.getEnumItemName("house_u", scope.row.roomUse)}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" width="200">
							<template slot-scope="scope">
								<div class="detail-icon">
									<el-button :disabled="!ShowAuthDisabled" @click="lookDetail(scope.row)" type="text" size="small">一房一档</el-button>
									<el-button :disabled="!OwnAuthDisabled" @click="editHouse(scope.row)" type="text" size="small">编辑</el-button>
									<el-button :disabled="!OwnAuthDisabled" @click="deleteHouse(scope.row)" type="text" size="small">
										<span :style="OwnAuthDisabled?`color:'#DF5656'`: `color:'#82848a'`">删除</span>
									</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
				<div class="footer">
					<el-pagination
						background
						layout="total, prev, pager, next, jumper"
						:page-size="pageInfo.pageSize"
						:current-page="pageInfo.currentPage"
						@current-change="handleCurrentChange"
						:total="pageInfo.total"
					></el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BuildFloorPopoverTree from "@/pages/unitMange/components/BuildFloorPopoverTree";

export default {
  components: {
    BuildFloorPopoverTree
  },
  props: {},
  data() {
    return {
      roomName: "",
      roomsType: "",
      roomsUse: "",
      lastLevelType: "",
      tableData: [],
      multipleSelection: [],
      houseTypeOptions: [],
      houseUseOptions: [],
      isHaveFloor: true,
      isLoading: false,
      rootInfrastructureUuid: "",
      infrastructureUuid: "",
      initTreeRootData: {},
      nodeText: "",
      pageInfo: {
        total: 0,
        pageSize: 12,
        currentPage: 1
      },
      roomsUuidArr: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    // this.initData();
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("楼栋房屋", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("楼栋房屋", "isOwn");
  },
  methods: {
    initData() {
      if (!this.ShowAuthDisabled) return;
      this.houseTypeOptions = this.$common.getEnumByGroupStr("house_t");
      this.houseUseOptions = this.$common.getEnumByGroupStr("house_u");
      this.getHouseList();
    },
    getHouseList() {
      this.tableData = [];
      this.isLoading = true;
      this.$houseHttp
        .getHouseList({
          infrastructureUuid: this.infrastructureUuid,
          roomName: this.roomName,
          roomsType: this.roomsType,
          roomsUse: this.roomsUse,
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage
        })
        .then(res => {
          let body = res.data;
          this.getHouseListSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getHouseListSuccessResponse(body) {
      this.tableData = body.data.list;
      this.handlePageInfo(body.data);
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getHouseList();
    },
    setUseData(params) {
      this.infrastructureUuid = params.node.data.id;
    },
    addHouse() {
      this.$emit("addHouse");
    },
    lookDetail(row) {},
    editHouse(row) {
      this.$emit("editHouse", row);
    },
    deleteHouse(row) {
      this.roomsUuidArr = [];
      this.formatItems(row);
      this.delRooms();
    },
    deleteHouses() {
      this.roomsUuidArr = [];
      if (this.multipleSelection.length !== 0) {
        for (const item of this.multipleSelection) {
          this.formatItems(item);
        }
        this.delRooms();
      } else {
        this.$cToast.warn("请选择所要删除的房屋！");
      }
    },
    formatItems(val) {
      if (val.people === 0) {
        this.roomsUuidArr.push(val.infrastructureUuid);
      }
    },
    delRooms() {
      if (this.roomsUuidArr.length === 0) {
        this.$cToast.warn("所选择的房屋下有居民，不可删除！");
        return;
      }
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
            this.$houseHttp
              .deleteHouse({
                infrastructureList: this.roomsUuidArr
              })
              .then(res => {
                let body = res.data;
                this.delRoomsSuccessResponse(body);
              });
          }
        });
    },
    delRoomsSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.getHouseList();
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.getHouseList();
    },
    resetQuery() {
      this.roomName = "";
      this.roomsType = "";
      this.roomsUse = "";
      this.infrastructureUuid = this.rootInfrastructureUuid;
      this.nodeText = "";
    },
    batchImport() {
      this.$emit("batchImport");
    },
    batchExport() {
      this.$emit("batchExport");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    resetData() {
      this.resetQuery();
      this.roomName = "";
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
    },
    onShowPop() {
      document.getElementById("app").addEventListener("click", () => {
        this.$refs.buildPopoverTree.isShowPopover = false;
      });
      document
        .getElementsByClassName("i-popover-box")[0]
        .addEventListener("click", () => {
          this.$refs.buildPopoverTree.isShowPopover = false;
        });
    }
  },
  watch: {
    initTreeRootData: {
      handler(val) {
        this.infrastructureUuid = val.id;
        this.resetData();
        this.initData();
      },
      deep: true
    }
    /* rootInfrastructureUuid(val) {
      this.infrastructureUuid = val;
      this.initData();
    } */
  },
  destroyed() {}
};
</script>
<style lang="scss">
.house-more-action {
	.el-input {
		width: 200px;
	}
	.el-input__inner {
		width: 200px;
	}
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px 20px 12px 0px;
	.topTitleTxtMore {
		width: 100px;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #bbbbbb;
		text-align: right;
		margin-right: 10px;
	}
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.house-main {
	width: 100%;
	height: 100%;
	padding: 1.6% 1.5%;
	box-sizing: border-box;
}
.topTitleTxt {
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #bbbbbb;
	text-align: right;
}
.access-main {
	width: 100%;
	height: 100%;
	background: #212325;
	padding: 1.6% 2% 0 2%;
	box-sizing: border-box;
	.access-search {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		.search-btn {
			margin-left: auto;
			margin-right: 0;
			display: flex;
			justify-content: space-between;
			.time-interal {
				width: 170px;
			}
		}
	}
	.face-table {
		height: 90%;
		margin-top: 20px;
		.footer {
			margin-top: 30px;
			width: 100%;
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
