<template>
	<el-dialog
		width="41.7%"
		title="新增反潜回方案"
		:visible.sync="isCurrentShow"
		:close-on-click-modal="false"
	>
		<el-row class="dialog-content" type="flex" justify="space-around">
			<el-col class="left-contain" :span="12">
				<el-container>
					<el-header class="box">
						<span>方案名称：</span>
						<el-input v-model="inputModel" placeholder="请输入内容"></el-input>
					</el-header>
					<el-header class="box">
						<span>反潜回类型：</span>
						<el-select v-model="value" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.typeStr"
								:label="item.typeName"
								:value="item.typeStr"
							></el-option>
						</el-select>
					</el-header>
					<el-main>
						<!-- <tab-tree></tab-tree> -->
						<tab-tree
							:tabs="tabs"
							:visible="isCurrentShow"
							:show-input="true"
							:checkeTreedNodes="checkeTreedNodes"
							@transferCheckedNodes="transferCheckedNodes"
						></tab-tree>
					</el-main>
				</el-container>
			</el-col>
			<el-col class="right-contain" :span="12">
				<span class="rightTxt checkedSpanClass">已选读头</span>
				<div class="tagBox">
					<el-table :data="dynamicTags" height="100%" style="width: 100%;height:100%">
						<el-table-column type="index" :index="tableIndex" label="序号" width="50"></el-table-column>
						<el-table-column prop="label" label="读头名称"></el-table-column>
						<el-table-column prop="address" label="操作" width="180">
							<template slot-scope="scope">
								<div class="tableDiv" v-if="value === 'line'">
									<el-button
										v-if="value === 'line'"
										type="text"
										size="small"
										@click.stop="upButtonAct(scope.row)"
									>
										<img src="../../../../assets/images/doorAccess/up_arrow.png" alt>
									</el-button>
									<el-button type="text" size="small" @click.stop="dropButtonAct(scope.row)">
										<img src="../../../../assets/images/doorAccess/down_arrow.png" alt>
									</el-button>
								</div>
								<div class="tableDiv" v-else>
									<el-radio-group v-model="scope.row.readHeadOrientation">
										<el-radio disabled label="1">进</el-radio>
										<el-radio disabled label="2">出</el-radio>
									</el-radio-group>
								</div>
								<el-button
									type="text"
									size="small"
									class="delete-button"
									@click.stop="openDeleteDialog(scope.row)"
								>
									<img src="../../../../assets/images/doorAccess/delete_select.png" alt>
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="mini" @click="onClickCancel(true)" class="footer-button">确定</el-button>
			<el-button type="primary" size="mini" @click="onClickCancel(false)" class="footer-button">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import tabTree from "@/common/TabTree.vue";
export default {
  components: { tabTree },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    antiBackDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkeTreedNodes: [],
      radio: "",
      dynamicTags: [],
      inputModel: "",
      isCurrentShow: false,
      data2: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      options: [],
      value: "",
      tableData: [],
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id",
          treeNodeType: "channel",
          treeLeafType: "channel"
        },
        {
          id: "2",
          label: "楼栋房屋",
          treeType: "resident",
          treeRef: "tree2",
          treeNodeType: "channel",
          nodeKey: "id",
          treeLeafType: "channel"
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.options = this.$common.getEnumByGroupStr("anti_s_t");
    this.value = this.options[0].typeStr;
  },
  methods: {
    // 上移
    upButtonAct(data) {
      var index = this.dynamicTags.indexOf(data);
      console.log(index);
      if (index === 0) {
        this.$message({ type: "warning", message: "已经是第一的位置了" });
        return;
      }
      var copyArr = [];
      copyArr = JSON.parse(JSON.stringify(this.dynamicTags));
      [copyArr[index], copyArr[index - 1]] = [
        copyArr[index - 1],
        copyArr[index]
      ];
      this.dynamicTags = [];
      this.dynamicTags = copyArr;
    },
    // 下移
    dropButtonAct(data) {
      var index = this.dynamicTags.indexOf(data);
      console.log(index);
      if (index === this.dynamicTags.length - 1) {
        this.$message({ type: "warning", message: "已经是最末的位置了" });
        return;
      }
      console.time("test");
      var copyArr = [];
      copyArr = JSON.parse(JSON.stringify(this.dynamicTags));
      [copyArr[index], copyArr[index + 1]] = [
        copyArr[index + 1],
        copyArr[index]
      ];
      this.dynamicTags = [];
      this.dynamicTags = copyArr;
      console.timeEnd("test");
    },
    // 点击左侧树的返回选中/取消的值
    transferCheckedNodes(data, nodeBool, treeName) {
      var num = JSON.parse(JSON.stringify(this.dynamicTags));
      if (!data.readHeadOrientation) {
        // data.readHeadOrientation = "";
        this.$set(data, "readHeadOrientation", "");
      }
      if (data.direction === "in") {
        this.$set(data, "readHeadOrientation", "1");
      } else if (data.direction === "out") {
        this.$set(data, "readHeadOrientation", "2");
      } else {
      }
      console.log(data.direction);
      let index = -1;
      for (var i = 0; i < num.length; i++) {
        if (!num[i].readHeadOrientation) {
          // num[i].readHeadOrientation = "";
          this.$set(num[i], "readHeadOrientation", "");
        }
        if (num[i].treeName === treeName && num[i].id === data.id) {
          index = i;
          break;
        }
      }
      if (nodeBool && index === -1) {
        data.treeName = treeName;
        num.push(data);
      }
      if (!nodeBool && index !== -1) {
        num.splice(index, 1);
      }
      this.checkeTreedNodes = num;
      this.dynamicTags = JSON.parse(JSON.stringify(num));
    },
    // 删除
    openDeleteDialog(data) {
      var index = this.dynamicTags.indexOf(data);
      console.log(index);
      this.dynamicTags.splice(index, 1);
      this.checkeTreedNodes = JSON.parse(JSON.stringify(this.dynamicTags));
    },
    /**
		 * 取消新增或修改
		 */
    onClickCancel(isFi) {
      console.log(this.dynamicTags);
      if (!isFi) {
        this.$emit("onCancel");
      } else {
        if (!this.inputModel.length) {
          this.$message({ type: "warning", message: "方案名称不能为空" });
          return;
        }
        var entrySet = [];
        var checkOutSet = [];
        var version = 0;
        // 线路反潜回
        if (this.value === "line") {
          if (
            this.antiBackDetail &&
						this.antiBackDetail.entrySetVOList &&
						this.antiBackDetail.entrySetVOList.length
          ) {
            // 记住版本号
            version = this.antiBackDetail.entrySetVOList[0].version;
          }
          for (var i = 0; i < this.dynamicTags.length; i++) {
            var item = {
              resSn: i,
              resType: this.dynamicTags[i].type,
              resUuid: this.dynamicTags[i].id,
              version: version
            };
            entrySet.push(item);
          }
        } else {
          // 出入口反潜回
          this.dynamicTags.forEach(item => {
            // 判断每一个进出读头的出入属性
            if (item.readHeadOrientation === "") {
              this.$message({ type: "error", message: "读头进出类型不能为空" });
              return 0;
            }
          });
          var versionj = 0;
          // 记录版本号
          if (
            this.antiBackDetail &&
						this.antiBackDetail.checkOutSetVOList &&
						this.antiBackDetail.checkOutSetVOList.length
          ) {
            versionj = this.antiBackDetail.checkOutSetVOList[0].version;
          }
          // 将读头根据出入属性分成两个数组
          for (var j = 0; j < this.dynamicTags.length; j++) {
            var itemj = {
              resSn: j,
              resType: this.dynamicTags[j].type,
              resUuid: this.dynamicTags[j].id,
              version: versionj,
              readHeadOrientation: this.dynamicTags[j].readHeadOrientation
            };
            if (itemj.readHeadOrientation === "1") {
              entrySet.push(itemj);
            } else {
              checkOutSet.push(itemj);
            }
          }
          if (!(checkOutSet.length && entrySet.length)) {
            this.$message({
              type: "warning",
              message: "进出反潜回至少一进一出"
            });
            return;
          }
        }
        var data = {
          checkOutSet: checkOutSet,
          entrySet: entrySet,
          groupName: this.inputModel,
          returnType: this.value
        };
        console.log(data);
        if (!this.antiBackDetail.groupUuid) {
          // 新增 默认改配置有效，开启
          data.enabled = 1;
          this.httpPostAntiBack(data);
        } else {
          // 编辑
          Object.assign(this.antiBackDetail, data);
          this.httpPutAntiBack(this.antiBackDetail);
        }
      }
    },
    // 编辑
    httpPutAntiBack(data) {
      this.$DoorSetAjax.putAntiBackApi(data).then(res => {
        if (res.data.success) {
          this.$message({ type: "success", message: "编辑成功" });
          this.$emit("onConfirm");
        } else {
          this.$message({ type: "error", message: "编辑失败" });
        }
      });
    },
    // 新增
    httpPostAntiBack(data) {
      this.$DoorSetAjax.postAntiBackApi(data).then(res => {
        if (res.data.success) {
          this.$message({ type: "success", message: "添加成功" });
          this.$emit("onConfirm");
        } else {
          this.$message({ type: "error", message: "添加失败" });
        }
      });
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    }
  },
  watch: {
    isShow(val) {
      console.log(val);
      this.isCurrentShow = val;
      if (val) {
        if (this.antiBackDetail.groupUuid) {
          // 编辑 改造源数据
          var checkOutSetVOList = [];
          if (
            this.antiBackDetail.checkOutSetVOList &&
						this.antiBackDetail.checkOutSetVOList.length
          ) {
            checkOutSetVOList = this.antiBackDetail.checkOutSetVOList;
            checkOutSetVOList.forEach(item => {
              item.readHeadOrientation = "2";
            });
          }
          var entrySetVOList = [];
          if (
            this.antiBackDetail.entrySetVOList &&
						this.antiBackDetail.entrySetVOList.length
          ) {
            entrySetVOList = this.antiBackDetail.entrySetVOList;
            entrySetVOList.forEach(item => {
              item.readHeadOrientation = "1";
            });
          }
          // 拼接数组
          entrySetVOList.push.apply(entrySetVOList, checkOutSetVOList);
          console.log(entrySetVOList);
          // 改造键值
          entrySetVOList.forEach(item => {
            item.id = item.resUuid;
            item.label = item.resName;
          });
          // 赋值属性
          this.dynamicTags = JSON.parse(JSON.stringify(entrySetVOList));
          this.checkeTreedNodes = JSON.parse(JSON.stringify(entrySetVOList));
          this.inputModel = this.antiBackDetail.groupName;
          this.value =
						this.antiBackDetail.returnType || this.options[0].typeStr;
        } else {
          // 新增 初始化 编辑值
          this.value = this.options[0].typeStr;
          this.inputModel = "";
          this.dynamicTags = [];
          this.checkeTreedNodes = [];
        }
      }
    },
    dynamicTags: {
      handler() {},
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style>
.AntiBack .el-input__prefix {
	position: absolute;
	height: 100%;
	left: 5px !important;
	top: 0;
	text-align: center;
	color: #dddddd;
	-webkit-transition: all 0.3s;
	transition: all 0.3s;
	transform: translateX(0%);
}
.AntiBack .el-container.is-vertical {
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	height: 100%;
}
.AntiBack .el-select {
	display: inline-block;
	position: relative;
	width: 80%;
}
.AntiBack .el-radio {
	margin: auto 15px auto 0;
}
.AntiBack .el-dialog {
	height: 58.3%;
  min-width: 720px;
  min-height: 580px;
	/* height: auto; */
}
.AntiBack .el-dialog__body {
	padding: 0;
	height: calc(100% - 120px);
}
.AntiBack .rightTxt {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
	margin-bottom: 10px;
}
.AntiBack .checkedSpanClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
	text-align: center;
	margin-bottom: 11px;
}
.AntiBack .checkedSpanClass::before {
	display: inline-block;
	content: "";
	width: 5px;
	height: 5px;
	background-color: #dddddd;
	margin-right: 8px;
	transform: translateY(-50%);
}
.AntiBack .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    background-color: #26d39d;
}
.AntiBack .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: transparent;
    border-color: #E4E7ED;
}
.AntiBack .el-radio__input.is-disabled .el-radio__inner {
    background-color: transparent;
    border-color: #E4E7ED;
    cursor: not-allowed;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
	font-family: PingFangSC-Regular;
	font-size: $fontsize;
	color: #dddddd;
	letter-spacing: 0;
}
.dialog-content {
	display: flex;
	width: 100%;
	height: 100%;
	.left-contain {
		border-right: 1px solid #2f2f2f;
		padding: 10px 15px 0px;
		height: 100%;
		.box {
			display: flex;
			justify-content: space-around;
			padding: 10px 0px;
			margin: 0 25px;
			border-bottom: 1px dashed #2f2f2f;
			span {
				width: 20%;
				min-width: 100px;
				height: 40px;
				line-height: 40px;
				color: #dddddd;
			}
			.el-input {
				width: 80%;
			}
		}
		.el-main {
			padding: 10px 15px 0px;
			height: calc(100% - 124px);
		}
	}
	.right-contain {
		padding: 10px 15px 0px;
		box-sizing: border-box;
		height: 100%;
		.el-checkbox {
			margin-right: 5px;
		}
		.tagBox {
			padding-top: 15px;
			box-sizing: border-box;
			height: calc(100% - 20px);
			.tableDiv {
				display: inline-flex;
			}
			.el-tag-class {
				margin: 15px 12px 0;
			}
		}
	}
}
.dialog-footer {
	border: {
		width: 1px 0 0 0;
		style: solid;
		color: $line-color;
	}
	.footer-button {
		margin: 17px 28px 17px 0;
	}
}
</style>
