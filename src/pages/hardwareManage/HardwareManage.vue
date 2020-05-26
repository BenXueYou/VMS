<template>
	<div class="unit-main">
		<add-or-edit-hardware-dialog
			:isShow="isShowAddOrEditDialog"
			@onCancel="onCancelAddOrEditDialog"
			:isAdd="isAdd"
			ref="addOrEditUnitDialog"
			@onConfirm="onConfirmAddOrEditDialog"
		/>
		<div class="main">
			<div class="access-main">
				<div class="access-search">
					<el-button :disabled="!OwnAuthDisabled" @click="addUnit" type="primary" size="small">新增装备</el-button>
					<el-button :disabled="!OwnAuthDisabled" @click="deleteUnits" type="primary" size="small">删除</el-button>
					<div class="search-btn">
						<div style="margin-right: 10px;">
							<span class="topTitleTxt">装备名称：</span>
							<el-input v-model="companyName" placeholder="请输入装备名称" class="time-interal" size="small"></el-input>
						</div>
						<el-button
							@click="queryAct"
							icon="el-icon-search"
							style="margin-left: 10px;"
							type="primary"
							size="small"
							:disabled="!ShowAuthDisabled"
						>检索</el-button>
						<!--             <el-button v-popover:i-popover
                       type="primary"
						size="small">其他检索条件</el-button>-->
						<el-popover
							ref="i-popover"
							placement="bottom-end"
							width="320"
							@show="onShowPop"
							popper-class="i-popover-box"
							trigger="click"
						>
							<div class="unit-more-action">
								<span class="topTitleTxtMore">装备性质：</span>
								<el-select
									class="time-interal"
									v-model="companyType"
									size="small"
									clearable
									placeholder="请选择装备性质"
								>
									<el-option
										v-for="item in companyTypeOptions"
										:key="item.typeStr"
										:label="item.typeName"
										:value="item.typeStr"
									></el-option>
								</el-select>
							</div>
							<div class="unit-more-action">
								<span class="topTitleTxtMore">联系人：</span>
								<el-input v-model="chargePerson" class="time-interal" size="small"></el-input>
							</div>
							<div class="unit-more-action">
								<span class="topTitleTxtMore" style="margin-left: -40px;">楼栋单元：</span>
							</div>
							<div class="unit-more-action">
								<el-button
									@click="queryAct"
									size="small"
									style="margin-top:5px;margin-right: 10px;"
									type="primary"
									:disabled="!ShowAuthDisabled"
								>检索</el-button>
								<el-button @click="resetQuery" style="margin-top:5px;" type="text">重置</el-button>
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
							style="width: 100%"
						>
							<el-table-column type="selection"></el-table-column>
							<el-table-column type="index" label="序号" width="60" show-overflow-tooltip></el-table-column>
							<el-table-column prop="equipmentName" label="装备名称" width="200" show-overflow-tooltip></el-table-column>
							<el-table-column prop="companyType" label="装备类型" width="200" show-overflow-tooltip>
								<template slot-scope="scope">
									<span>{{$common.getEnumItemName("equip_type", scope.row.equipmentType)}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="longitude" label="经度" width="90" show-overflow-tooltip></el-table-column>
							<el-table-column prop="latitude" label="纬度" width="90" show-overflow-tooltip></el-table-column>
							<el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
							<el-table-column prop="createTime" label="创建时间" width="300" show-overflow-tooltip></el-table-column>
							<el-table-column label="操作" width="300">
								<template slot-scope="scope">
									<div class="detail-icon">
										<!--                     <el-button @click="lookDetail(scope.row)"
                               type="text"
                               size="small">
                      查看从业人员
										</el-button>-->
										<el-button :disabled="!OwnAuthDisabled" @click="editUnit(scope.row)" type="text" size="small">编辑</el-button>
										<el-button :disabled="!OwnAuthDisabled" @click="deleteUnit(scope.row)" type="text" size="small">删除
											<!-- <span style="color: #DF5656">删除</span> -->
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
	</div>
</template>

<script>
import AddOrEditHardwareDialog from "@/pages/hardwareManage/components/AddOrEditHardwareDialog.vue";

export default {
  components: {
    AddOrEditHardwareDialog
  },
  props: {},
  data() {
    return {
      companyName: "",
      companyType: "",
      chargePerson: "",
      infrastructureUri: "",
      isLoading: false,
      companyTypeOptions: [],
      tableData: [{}],
      pageInfo: {
        total: 0,
        pageSize: 13,
        currentPage: 1
      },
      multipleSelection: [],
      isShowStaffDetails: false,
      isShowAddOrEditDialog: false,
      isAdd: true,
      unitsUuid: [],
      unitsAllName: [],
      initTreeRootData: null,
      infrastructureUuid: "",
      lastLevelType: "",
      nodeText: "",
      isShowPop: false,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  activated() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有装备", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有装备", "isOwn");
    if (!this.ShowAuthDisabled) {
      return;
    }
    this.currentPage = 1;
    this.companyName = "";
    this.getAllequipments();
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有装备", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有装备", "isOwn");
    if (!this.ShowAuthDisabled) {
      return;
    }
    this.initData();
  },
  methods: {
    initData() {
      this.companyTypeOptions = this.$common.getEnumByGroupStr("company_t");
      if (this.initTreeRootData) {
        // this.getAllequipments();
      }
    },
    setTreeRootData(data) {
      this.initTreeRootData = data;
      this.infrastructureUuid = this.initTreeRootData.id;
      this.$refs.addOrEditUnitDialog.initTreeRootData = data;
    },
    setUseData(params) {
      this.infrastructureUuid = params.node.data.id;
    },
    setLastLevelType(lastLevelType) {
      this.lastLevelType = lastLevelType;
      this.$refs.addOrEditUnitDialog.lastLevelType = lastLevelType;
    },
    getAllequipments() {
      this.isLoading = true;
      this.tableData = [];
      this.$equipmentHttp
        .getAllequipments({
          equipmentName: this.companyName,
          // companyType: this.companyType,
          // chargePerson: this.chargePerson,
          // infrastructureUuid: this.infrastructureUuid,
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage
        })
        .then(res => {
          let body = res.data;
          this.handlegetAllequipmentsSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handlegetAllequipmentsSuccessResponse(body) {
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
      this.getAllequipments();
    },
    addUnit() {
      this.isAdd = true;
      this.isShowAddOrEditDialog = true;
      this.$refs.addOrEditUnitDialog.isShowPopover = true;
    },
    deleteUnits() {
      this.unitsUuid = [];
      this.unitsAllName = [];
      if (this.multipleSelection.length !== 0) {
        for (const item of this.multipleSelection) {
          this.formatItems(item);
        }
        this.delUnits();
      } else {
        this.$cToast.warn("请选择所要删除的装备！");
      }
    },
    formatItems(val) {
      this.unitsUuid.push(val.equipmentUuid);
      this.unitsAllName.push(val.equipmentName);
      // unitsAllName
    },
    lookDetail(row) {
      this.$refs.lookStaffDetails.infrastructureUuids = this.formatData(
        row
      ).infrastructureUuid;
      this.$refs.lookStaffDetails.unitsName = row.companyName;
      this.isShowStaffDetails = true;
    },
    formatData(row) {
      let infrastructureUuid = "";
      let infrastructureUri = "";
      for (let item of row.infrastructure) {
        if (!infrastructureUuid) {
          infrastructureUuid = item.infrastructureUuid;
        } else {
          infrastructureUuid =
						infrastructureUuid + "," + item.infrastructureUuid;
        }
        if (!infrastructureUri) {
          infrastructureUri = item.infrastructureUri;
        } else {
          infrastructureUri = infrastructureUri + "，" + item.infrastructureUri;
        }
      }
      let infrastructure = {
        infrastructureUuid,
        infrastructureUri
      };
      return infrastructure;
    },
    editUnit(row) {
      this.isAdd = false;
      this.isShowAddOrEditDialog = true;
      this.$refs.addOrEditUnitDialog.isShowPopover = true;
      let copyRow = {};
      copyRow = this.$common.copyObject(row, copyRow);
      // let infrastructureUuid = this.formatData(copyRow).infrastructureUuid;
      // let infrastructureUri = this.formatData(copyRow).infrastructureUri;
      /* for (let item of copyRow.infrastructure) {
        if (!infrastructureUuid) {
          infrastructureUuid = item.infrastructureUuid;
        } else {
          infrastructureUuid = infrastructureUuid + "," + item.infrastructureUuid;
        }
        if (!infrastructureUri) {
          infrastructureUri = item.infrastructureUri;
        } else {
          infrastructureUri = infrastructureUri + "，" + item.infrastructureUri;
        }
      } */
      // equipmentName: this.formLabelAlign.equipmentName, /* 实有装备名称 */
      //    equipmentType: this.formLabelAlign.equipmentType, /* 实有装备类型 */
      //    longitude: this.formLabelAlign.longitude, /* 经度 */
      //    latitude: this.formLabelAlign.latitude, /* 纬度 */
      //    coordinateSystem: this.formLabelAlign.coordinatesType, /* 坐标系 */
      //    remark: this.formLabelAlign.remarks, /* 备注 */
      //    equipmentPicture: this.formLabelAlign.imageFileData /* 实有装备图片 */
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "equipmentName",
        copyRow.equipmentName
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "equipmentType",
        copyRow.equipmentType
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "latitude",
        copyRow.latitude
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "longitude",
        copyRow.longitude
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "coordinatesType",
        copyRow.coordinateSystem
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "remarks",
        copyRow.remark
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "equipmentUuid",
        copyRow.equipmentUuid
      );
      this.$set(
        this.$refs.addOrEditUnitDialog.formLabelAlign,
        "imageFileData",
        ""
      );
      if (
        copyRow.equipmentPicture !== null &&
				copyRow.equipmentPicture !== ""
      ) {
        this.$set(
          this.$refs.addOrEditUnitDialog.formLabelAlign,
          "frontUploaded",
          true
        );
        this.$set(
          this.$refs.addOrEditUnitDialog.formLabelAlign,
          "frontPhoto",
          copyRow.equipmentPicture
        );
        this.$set(
          this.$refs.addOrEditUnitDialog.formLabelAlign,
          "wrapHeight",
          "height: 110px"
        );
        this.$set(
          this.$refs.addOrEditUnitDialog.formLabelAlign,
          "equipmentPicture",
          copyRow.equipmentPicture
        );
      }
    },
    deleteUnit(row) {
      this.unitsUuid = [];
      this.unitsAllName = [];
      this.formatItems(row);
      this.delUnits();
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.getAllequipments();
    },
    resetQuery() {
      this.companyType = "";
      this.chargePerson = "";
      this.infrastructureUuid = this.initTreeRootData.id;
      this.nodeText = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCancelStaffDetailsDialog() {
      this.isShowStaffDetails = false;
    },
    onCancelAddOrEditDialog() {
      this.isShowAddOrEditDialog = false;
      this.$refs.addOrEditUnitDialog.isShowPopover = false;
    },
    onConfirmAddOrEditDialog() {
      this.isShowAddOrEditDialog = false;
      this.$refs.addOrEditUnitDialog.isShowPopover = false;
      this.getAllequipments();
    },
    delUnits() {
      let that = this;
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
            this.$equipmentHttp
              .delequipments({
                equipmentUuids: this.unitsUuid
              }, {
                modelName: "实有装备",
                type: "删除",
                detailContent: "删除装备-" + that.unitsAllName.toString()
              })
              .then(res => {
                let body = res.data;
                this.delUnitsSuccessResponse(body);
              });
          }
        });
    },
    delUnitsSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.getAllequipments();
    },
    resetData() {
      this.resetQuery();
      this.companyName = "";
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
    },
    getInfrastructureUri(data) {
      let infrastructureUri = "";
      if (data) {
        for (let index in data) {
          if (parseInt(index) === 0) {
            infrastructureUri = data[index].infrastructureUri;
          } else {
            infrastructureUri =
							infrastructureUri + "，" + data[index].infrastructureUri;
          }
        }
      }
      return infrastructureUri;
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
        this.resetData();
        this.initData();
      },
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.unit-more-action {
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
.unit-main {
	height: 100%;
	width: 100%;
	display: flex;
}
.left-interal {
	margin-left: 12%;
}
.topTitleTxt {
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #bbbbbb;
	text-align: right;
}
.main {
	width: 100%;
	height: 100%;
	padding: 1.6% 1.5%;
	box-sizing: border-box;
	.access-main {
		height: 100%;
		background: #212325;
		padding: 1.6% 2%;
		box-sizing: border-box;
		.access-search {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			.search-btn {
				margin-left: auto;
				margin-right: 0;
				display: flex;
				font-size: 13px;
				justify-content: space-between;
				.time-interal {
					width: 170px;
				}
			}
			.el-button--small {
				padding: 9px 15px;
				font-size: 13px;
				border-radius: 3px;
        width: 80px;
			}
		}
		.face-table {
			height: 90%;
			margin-top: 2%;
			.footer {
				margin-top: 30px;
				width: 100%;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
}
</style>
