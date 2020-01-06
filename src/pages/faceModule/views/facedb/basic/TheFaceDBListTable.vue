<template>
	<div class="tablelist" ref="tablelist">
		<div>
			<el-table :data="listTableData" border style="width: 100%;" v-loading="listtableloadding">
				<el-table-column prop="index" label="序号" width="120">
					<template slot-scope="scope">
						<!-- {{("0"+(parseInt(scope.$index)+1)).slice(-2)}} -->
						<el-checkbox
							v-model="scope.row.checked"
							@change="selectchange"
						>{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</el-checkbox>
					</template>
				</el-table-column>
				<el-table-column
					v-for="(item,index) in tableColumnsList"
					:key="index"
					:prop="item.propName"
					:label="item.labelName"
				>
					<template slot-scope="scope">
						<span :title="scope.row[item.propName]">{{scope.row[item.propName]}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="120">
					<template slot-scope="scope">
						<el-button :disabled='!OwnAuthDisabled' type="text" size="small" @click="editface(scope.row)">
							<i class="el-icon-edit-outline"></i>
							编辑
						</el-button>
						<el-button :disabled='!OwnAuthDisabled' type="text" size="small" @click="deleteface(scope.row)">
							<i class="el-icon-delete"></i>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="faceDBFooter">
			<el-pagination
				@current-change="currentChange"
				:current-page="pageNow"
				layout="total,prev, pager, next,jumper"
				:page-size="listPageSize"
				:total="total"
				background
			></el-pagination>
			<!-- <el-pagination
				background
				layout="prev, pager, next"
				:page-size="listPageSize"
				:current-page="pageNow"
				@current-change="currentChange"
				:total="total"
			></el-pagination>
			<p class="totalpagetitle">共{{total}}条</p>
			<div class="tiaozhuan">
				<span>跳转至</span>
				<el-input
					class="yeshu"
					v-model="yeshu"
					onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
					@blur="blur"
					@keyup.enter.native="blur"
					type="number"
				></el-input>
			</div>-->
		</div>
	</div>
</template>
<script>
const COLUMNS = [
  { propName: "staffName", labelName: "姓名" },
  { propName: "gender", labelName: "性别" },
  { propName: "credentialType", labelName: "证件类型" },
  { propName: "credentialNo", labelName: "证件号码" },
  { propName: "staffType", labelName: "人员类型" },
  { propName: "phoneNo", labelName: "电话" },
  { propName: "faceLibraryName", labelName: "所属库" },
  { propName: "createTime", labelName: "创建时间" }
];
export default {
  name: "facedblist",
  props: {
    listtableloadding: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    listTableData: {
      type: Array,
      default: function() {
        var num = [];
        return num;
      }
    },
    listTableColumns: {
      type: Array,
      default: function() {
        let num = COLUMNS;
        return num;
      }
    },
    selectall: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    pageNow: {
      type: Number,
      default() {
        return 1;
      }
    },
    listPageSize: {
      type: Number,
      default() {
        return 15;
      }
    },
    total: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      yeshu: "",
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  computed: {
    tableColumnsList() {
      let num = this.listTableColumns.length ? this.listTableColumns : COLUMNS;
      return num;
    }
  },
  mounted() {
    console.log(this.listTableData, this.tableColumnsList);
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("人脸库", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("人脸库", "isOwn");
  },
  methods: {
    blur() {
      if (this.yeshu !== "") {
        if (this.yeshu > Math.ceil(this.listPageCount / this.listPageSize)) {
          this.yeshu = Math.ceil(this.listPageCount / this.listPageSize);
        }
        this.yeshu = parseInt(this.yeshu);
        this.$emit("changepage", parseInt(this.yeshu));
      }
    },
    editface(row) {
      this.$emit("getFaceDetail", row.faceUuid, row.faceLibraryUuid);
    },
    deleteface(row) {
      this.$emit("deleteStaffFace", [row.faceUuid]);
    },

    currentChange(index) {
      this.$emit("changepage", index);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectchange() {
      var flag = this.judgeallchecked();
      this.$emit("checkall", flag);
    },
    judgeallchecked() {
      var flag = true;
      for (var i = 0, len = this.listTableData.length; i < len; i++) {
        if (!this.listTableData[i].checked) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  },
  deactivated() {
    this.listTableData.map(row => {
      row.checked = false;
      return row;
    });
  },
  watch: {
    selectall: function() {
      if (this.selectall) {
        this.listTableData.map(row => {
          row.checked = true;
          return row;
        });
      } else {
        var flag = this.judgeallchecked();
        if (flag) {
          this.listTableData.map(row => {
            row.checked = false;
            return row;
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tablelist {
	height: 100%;
}
.faceDBFooter {
	position: relative;
	.totalpagetitle {
		font-size: 14px;
		color: #fff;
		float: right;
		margin-right: 20px;
		margin-top: 17px;
	}
	.el-pagination {
		margin-right: 1px;
		margin-top: 10px;
		float: right;
	}
	.tiaozhuan {
		position: absolute;
		right: 20px;
		top: 6px;
		span {
			font-size: 14px;
			color: #fff;
			padding-right: 20px;
		}
		.yeshu {
			display: inline-block;
			width: 90px;
			input {
				padding: 0px;
			}
		}
	}
}
</style>

<style  lang="scss">
.tiaozhuan {
	span {
		display: inline-block;
		vertical-align: middle;
	}
	.yeshu {
		display: inline-block;
		width: 90px;
		vertical-align: middle;
		height: 40px;

		.el-input__inner {
			margin-top: 5px;
			width: 50px;
			height: 28px;
			line-height: 28px;
			padding: 0px 5px;
		}
	}
}
</style>
