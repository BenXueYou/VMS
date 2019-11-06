<template>
	<div class="tableCellList" ref="tableCellList">
		<div class="tableCellListBox" v-loading="isloading">
			<div class="fater">
				<div class="item" v-for="(item,index) in tableSourceData" :key="index">
					<recoginize-card
						:recoginizeItem="item"
						@detailClick="openDialog(item)"
						@click="openDialog(item)"
						:alarmState="item.dealState"
					/>
				</div>
				<!-- <div class="item hiddenitem" v-for="(item,index) in getLast" :key="item+index"></div> -->
			</div>
		</div>
		<div class="footer">
			<el-pagination
				background
				layout="prev, pager, next"
				:page-size="pageSize"
				:current-page="pageNow"
				@current-change="currentChange"
				:total="pageCount"
			></el-pagination>
			<p class="totalpagetitle">共{{pageCount}}条</p>
			<div class="tiaozhuan">
				<span>跳转至</span>
				<el-input class="yeshu" type="number"></el-input>
			</div>
		</div>
		<the-face-alarm-dialog
			title="对比详情"
			:faceDBDialogVisible="facealarmvisible"
			@close="facealarmvisible=false"
		></the-face-alarm-dialog>
		<el-dialog class="FAImageDetailDialog" title="图片详情" :visible.sync="dialogVisible">
			<img
				style="max-width:100%;display:block;margin:0 auto;max-height:400px;"
				:src="dialogImageUrl"
				alt
			/>
		</el-dialog>
	</div>
</template>

<script>
import TheFaceAlarmDialog from "@/pages/faceModule/views/facealarm/basic/TheFaceAlarmDialog.vue";
import RecoginizeCard from "@/pages/faceModule/components/RecoginizeCard.vue";
export default {
  name: "facedblist",
  props: {
    isloading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    progressWidth: {
      type: Number,
      default() {
        return 45;
      }
    },
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        for (var i = 0; i < 13; i++) {
          num.push({
            index: ("0" + (i + 1)).slice(-2),
            name: "王小虎",
            sex: "男",
            time: "2018-10-18 12:00:00",
            id: "342626199411060399",
            ku: "住户"
          });
        }
        return num;
      }
    },
    pageSize: {
      type: Number,
      default: function() {
        return 12;
      }
    },
    pageNow: {
      type: Number,
      default: function() {
        return 1111;
      }
    },
    pageCount: {
      type: Number,
      default: function() {
        return 1000;
      }
    }
  },
  computed: {
    getLast() {
      var len = this.pageSize - this.tableData.length;
      len = Math.max(0, len);
      var a = [];
      while (len--) {
        a.push("kj");
      }
      return a;
    }
  },
  data() {
    return {
      multipleSelection: [],
      tableSourceData: [],
      facealarmvisible: false,
      arr: [1, 1, 1, 1, 1],
      dialogImageUrl: "",
      dialogVisible: false,
      userheader: require("@/assets/user.png")
    };
  },
  watch: {
    tableData(val) {
      if (val && val.length) {
        let arr = [];
        val.map(item => {
          item.similarity = item.faceSimilarity;
          //   item.dealState = Boolean(item.dealState);
          arr.push(item);
        });
        this.tableSourceData = arr;
      }
      console.log(this.tableSourceData);
    }
  },
  mounted() {},
  methods: {
    showbig(url) {
      if (url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      }
    },
    openDialog(detail) {
      console.log(detail);
      this.$emit("lookAlarmDetail", detail);
    },
    lookAlarmDetail() {
      this.facealarmvisible = true;
    },
    currentChange(index) {
      this.$emit("pagechange", index);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  components: {
    TheFaceAlarmDialog,
    RecoginizeCard
  }
};
</script>

<style lang="scss" scoped>
@mixin active {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #fff;
	letter-spacing: 0;
}
@mixin fontsa {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
}
.tableCellList {
	height: calc(100% - 69px);
	.tableCellListBox {
		height: calc(100% - 45px);
		overflow: auto;
		.fater {
			width: 100%;
			height: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-content: flex-start;
			overflow: auto;
			.item {
				background-color: rgb(27, 30, 33);
				box-sizing: border-box;
				margin-bottom: 30px;
				margin-left: 17px;
				.content {
					padding: 10px 12px;
					box-sizing: border-box;
					overflow: hidden;
					.aitem {
						float: left;
						width: 100%;

						overflow: hidden;
						.aitemp {
							text-indent: 8px;
							line-height: 30px;
							@include fontsa;
							p {
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							}
						}

						.aitemimg {
							position: relative;
							float: left;
							width: 25%;
							overflow: hidden;
							padding-bottom: 25%;
							// width:100px;
							// height: 100px;
							// background-color: #aaa;
							img {
								position: absolute;
								top: 0px;
								left: 0px;
								width: 100%;
								height: 100%;
							}
						}
						.aitemprogress {
							float: left;
							width: 60px;
							height: 100px;
						}
					}
				}
				.header1 {
					width: 100%;
					vertical-align: middle;
					padding: 10px 12px;
					box-sizing: border-box;
					@include active;
					border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
					margin-bottom: 10px;
					.adadr {
						display: inline-block;
						vertical-align: middle;
					}
					.aaac {
						cursor: pointer;
						float: right;
						.xiangqing {
							display: inline-block;
							vertical-align: middle;
							// color: rgb(39, 150, 119);
							color: #28ffbb;
						}
					}

					img {
						vertical-align: middle;
						width: 16px;
					}
				}
			}
			.hiddenitem {
				opacity: 0;
			}
		}
	}
}
.footer {
	position: relative;
	// margin: 30px 0px;
	.totalpagetitle {
		font-size: 14px;
		color: #fff;
		float: right;
		margin-right: 20px;
		margin-top: 17px;
	}
	.el-pagination {
		margin-right: 180px;
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

<style lang='scss'>
// .FAImageDetailDialog {
//   .el-dialog {
//     // height:400px!important;
//   }
// }
.progressCircle {
	margin: 20px 10px;
	.el-progress__text {
		font-family: "PingFangSC-Regular";
		font-size: 14px !important;
		color: #28ffbb;
		letter-spacing: 0;
	}
}
.isactive {
	.el-progress__text {
		color: #ff5f5f;
	}
}
</style>
