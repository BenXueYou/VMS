<template>
	<el-dialog
		class="FCTabTCBDialogClass"
		width="700px"
		:title="title"
		:modal="modal"
		:visible.sync="isCurrentShow"
		:before-close="onClickCancel"
		:close-on-press-escape="false"
		:append-to-body="true"
		@close="close"
		:close-on-click-modal="false"
	>
		<el-row class="dialog-content" type="flex" justify="space-around">
			<el-col class="left-contain" :span="12">
				<el-container>
					<el-main>
						<tab-tree
							:tabs="tabs"
							:visible="isCurrentShow"
							@transferCheckedNodes="transferCheckedNodes"
							:checkedKeys="keysArr"
							:checkeTreedNodes="checkeTreedNodes"
						></tab-tree>
					</el-main>
				</el-container>
			</el-col>
			<el-col class="right-contain" :span="12">
				<span class="rightTxt checkedSpanClass">{{rightTxt}}</span>
				<div class="right-contain-box tagBox">
					<el-tag
						class="el-tag-class"
						:key="index"
						v-for="(tag,index) in dynamicTags"
						closable
						:disable-transitions="false"
						@close="handleClose()"
					>
						<el-row type="flex" style="width:280px" justify="space-around">
							<el-col :span="6" class="FCTCBtextClips">{{tag.label}}</el-col>
							<el-col :span="18" style="width:210px">
								<el-checkbox-group class="FCCheckedBox" v-model="tag.medium" @change="changeAct">
									<el-checkbox
										v-for="item in medium"
										:label="item.typeStr"
										:key="item.typeStr"
										@change="itemChangeAct"
									>{{item.typeName}}</el-checkbox>
								</el-checkbox-group>
							</el-col>
						</el-row>
					</el-tag>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="mini" @click="onClickConfirm" class="footer-button">确定</el-button>
			<el-button type="primary" size="mini" @click="onClickCancel" class="footer-button">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import tabTree from "@/common/TabTree.vue";
import tag from "@/common/Tag.vue";
export default {
  components: { tabTree, tag },
  props: {
    tabs: {
      type: Array,
      default: () => [
        {
          id: "1",
          label: "设备树",
          treeType: "device",
          treeRef: "tree1",
          nodeKey: "id"
        },
      ]
    },
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "新增弹窗"
    },
    rightTxt: {
      type: String,
      default: "已选择的设备"
    },
    modal: {
      type: Boolean,
      default() {
        return false;
      }
    },
    checkedList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tagList: [],
      checkeTreedNodes: [],
      dynamicTags: [],
      inputModel: "",
      isCurrentShow: false,
      treedata: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      keysArr: [],
      medium: [
        { typeStr: "card", typeName: "卡片" },
        { typeStr: "face", typeName: "人脸" },
        { typeStr: "fingerprint", typeName: "指纹" }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    changeAct(val) {
      console.log(val);
    },
    itemChangeAct(item) {
      console.log(item);
    },
    init() {
      this.checkeTreedNodes = this.dynamicTags;
    },
    /**
		 * 取消新增或修改
		 */
    onClickCancel() {
      this.$emit("onCancel");
      this.$emit("update:isShow", false);
    },
    onClickConfirm() {
      if (this.checkeTreedNodes && this.checkeTreedNodes.length) {
        this.checkeTreedNodes.forEach(item => {
          if (item.medium && item.medium.length) {
          } else {
            this.$message({
              type: "error",
              message: "人脸、卡片、指纹至少选一个"
            });
          }
        });
      } else {
        this.$message({ type: "error", message: "开门凭证不能为空" });
        return;
      }
      this.$emit("onConfirm", this.checkeTreedNodes);
      this.$emit("update:isShow", false);
    },
    close() {
      this.$emit("update:isShow", false);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    transferCheckedNodes(data, nodeBool, treeName) {
      var num = this.dynamicTags;
      let index = -1;
      var medium = ["card", "face", "fingerprint"];
      if (!data.medium) {
        this.$set(data, "medium", medium);
      }
      for (var i = 0; i < num.length; i++) {
        var isFlag = num[i].hasOwnProperty("medium");
        if (!isFlag) {
          this.$set(num[i], "medium", medium);
        }
        if (num[i].treeName === treeName && num[i].id === data.id) {
          index = i;
          break;
        }
      }
      if (nodeBool && index === -1) {
        data.treeName = treeName;
        num.push(data);
        this.dynamicTags = num;
        this.checkeTreedNodes = num;
      }
      if (!nodeBool && index !== -1) {
        num.splice(index, 1);
        this.dynamicTags = num;
        this.checkeTreedNodes = num;
      }
    },
    handleClose(tag, index) {
      this.dynamicTags.splice(index, 1);
      this.checkeTreedNodes = this.dynamicTags;
    }
  },
  watch: {
    isShow: {
      handler(val, oldVal) {
        // 初始化弹窗数据
        console.log("初始化弹窗", val);
        if (val) {
          let data = this.checkedList;
          for (let i = 0, len = data.length; i < len; i++) {
            if (!data[i]) {
              data[i].id = data[i].resUuid;
            }
            if (!data[i].label) {
              data[i].label = data[i].resName || data[i].orgName;
            }
          }
          this.checkeTreedNodes = data;
          this.dynamicTags = data;
        } else {
          this.checkeTreedNodes = [];
        }
        this.isCurrentShow = val;
      },
      deep: true,
      immediate: true
    },
    tabs: {
      handler(val) {
        this.treedata = val;
      },
      immediate: true,
      deep: true
    },
    checkeTreedNodes: {
      handler(val) {},
      immediate: true,
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style>
.FCCheckedBox {
	display: inline-block;
}
.FCTCBtextClips {
	width: 75px;
	padding-right: 15px;
	font-family: "PingFangSC-Regular";
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	-webkit-box-orient: vertical;
}
.FCCheckedBox .el-checkbox__label {
	display: inline-block;
	padding-left: 8px;
	padding-right: 19px;
	line-height: 19px;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
}
.FCTabTCBDialogClass .rightTxt {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #ffffff;
	margin-bottom: 10px;
}
.FCTabTCBDialogClass .el-input__prefix {
	position: absolute;
	height: 100%;
	left: 5px !important;
	top: 0;
	text-align: center;
	color: #c0c4cc;
	-webkit-transition: all 0.3s;
	transition: all 0.3s;
	transform: translateX(0%);
}
.FCTabTCBDialogClass .el-tag-class .el-icon-close {
	color: rgba(0, 0, 0, 0.6);
	margin-top: 7px;
	background-color: rgba(245, 245, 245, 0.6);
	margin-right: 15px;
}
.FCTabTCBDialogClass .el-tag-class .el-icon-close:hover {
	background-color: transparent;
	color: #26d39d;
}
.FCTabTCBDialogClass .el-dialog {
	height: 560px;
}
.FCTabTCBDialogClass .el-tree {
	overflow-y: auto;
}
.FCTabTCBDialogClass .el-dialog .el-dialog__body {
	height: calc(100% - 120px);
}
.FCTabTCBDialogClass .checkedSpanClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
	text-align: center;
	margin-bottom: 11px;
}
.FCTabTCBDialogClass .checkedSpanClass::before {
	display: inline-block;
	content: "";
	width: 5px;
	height: 5px;
	background-color: #dddddd;
	margin-right: 8px;
	transform: translateY(-50%);
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
	font-family: PingFangSC-Regular;
	font-size: $fontsize;
	color: #cccccc;
	letter-spacing: 0;
}
.dialog-content {
	display: flex;
	width: 100%;
	height: 100%;
	.left-contain {
		border-right: 1px solid #2f2f2f;
		padding: 10px 15px 0;
		height: 100%;
		.el-container {
			height: 100%;
		}
		.box {
			display: flex;
			justify-content: space-around;
			padding: 10px 0px;
			margin: 0 25px;
			border-bottom: 1px dashed rgb(57, 60, 64);
			span {
				width: 20%;
				min-width: 100px;
				height: 40px;
				line-height: 40px;
			}
			.el-input {
				width: 80%;
			}
		}
		.el-main {
			padding: 10px 15px 0;
		}
	}
	.right-contain {
		padding: 10px 15px;
		height: 100%;
		.el-checkbox {
			margin-right: 5px;
		}
		.right-contain-box {
			width: 100%;
			height: calc(100% - 20px);
			// border: 1px solid red;
			overflow: auto;
			margin-top: 10px;
		}
		.el-tag {
			display: flex;
			justify-content: space-around;
			background-color: transparent;
			border: none;
			padding: 0;
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
