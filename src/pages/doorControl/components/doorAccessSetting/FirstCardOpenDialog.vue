<template>
	<el-dialog
		class="FirstCardOpenDialog"
		width="600px"
		height="80%"
		title="首人验证后，门保持开启"
		:visible.sync="isCurrentShow"
		:before-close="onClickCancel"
		:close-on-click-modal="false"
	>
		<el-container class="FirstCardOpenDialog">
			<el-header class="box">
				<span style="color:red">*</span>
				<span>请选择门：</span>
				<div class="device-popover-tree">
					<!-- <device-popover-tree @setUseData="setUseData"></device-popover-tree> -->
					<el-popover
						class="popverTree"
						ref="popverBox"
						:popper-class="elPopoverClass"
						:visible-arrow="false"
						:value="visible_popver"
						@show="showPopver()"
						@hide="hidePopver()"
						placement="bottom-start"
						trigger="click"
					>
						<el-row style="width:300px;">
							<tab-tree
								:tabs="tabs"
								:visible="visible_popver"
								:show-input="false"
								:checkeTreedNodes="checkeTreedNodes"
								@transferCheckedNodes="transferCheckedNodes"
							></tab-tree>
						</el-row>
						<el-input
							slot="reference"
							:style="`width: ${inputWidth}`"
							v-model="checkedNodeName"
							:clearable="true"
							@clear="clearAction()"
							placeholder="请选择"
						></el-input>
					</el-popover>
				</div>
			</el-header>
			<el-main>
				<p>
					<span style="color:red">*</span>
					请选择哪些凭证验证通过后，门保持开启：
					<span class="cursorClass" style="color:#26D39D" @click="AddTag">
						<i class="el-icon-circle-plus-outline"></i>添加
					</span>
				</p>
				<FCTabTreeCheckBox
					title="选择通过哪些凭证验证通过后，门保持开启"
					rightTxt="已选的分组、设备、门或者地址"
					:modal="false"
					:tabs="tabs2"
					:isShow.sync="chooseVisible"
					:checkedList="peopleList"
					@onConfirm="peopleConfirm"
				></FCTabTreeCheckBox>
				<div class="tagBox">
					<el-tag
						class="el-tag-class"
						:key="index"
						v-for="( tag , index) in dynamicTags"
						closable
						:disable-transitions="false"
						@close="handleClose(tag,index)"
					>
						<el-row type="flex" style="width:calc(100% - 20px)" justify="space-around">
							<el-col
								:span="6" style="text-align: left;"
							>
								<el-tooltip class="item" effect="dark" :content="tag.label" placement="top-start">
									<span class="text-item-Title textClips">{{tag.label}}</span>
								</el-tooltip>
							</el-col>
							<el-col :span="18">
								<el-checkbox-group class="FCCheckedBox" v-model="tag.medium">
									<el-checkbox
										v-for="item in medium"
										:label="item.typeStr"
										:key="item.typeStr"
									>{{item.typeName}}</el-checkbox>
								</el-checkbox-group>
							</el-col>
						</el-row>
					</el-tag>
				</div>
			</el-main>
			<div class="main-middle">
				<p>
					<span style="color:red">*</span>
					门持续开启时间：
					<span>
						<el-input
							placeholder="请输入内容"
							v-model="inputMinTime"
							onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
							type="number"
							clearable
						></el-input>分钟
					</span>
				</p>
				<p>
					<span style="color:red">*</span>
					<span>有效时间：</span>
					<el-date-picker
						v-model="startTime"
						type="date"
						class="time-interal-date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="time-line"></span>
					<el-date-picker
						v-model="endTime"
						type="date"
						class="time-interal-date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
				</p>
			</div>
		</el-container>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="mini" @click="onClickConfirm" class="footer-button">确定</el-button>
			<el-button type="primary" size="mini" @click="onClickCancel" class="footer-button">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
import DevicePopoverTree from "@/common/DevicePopoverTree.vue";
import TabTree from "@/common/TabTree.vue";
import FCTabTreeCheckBox from "./FCTabTreeCheckBox";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  components: { DevicePopoverTree, TabTree, FCTabTreeCheckBox },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    FCDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      medium: [
        { typeStr: "card", typeName: "卡片" },
        { typeStr: "face", typeName: "人脸" },
        { typeStr: "fingerprint", typeName: "指纹" }
      ],
      peopleList: [],
      inputWidth: "80%",
      checkedNodeName: "",
      checkedDoor: {},
      chooseVisible: false,
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          treeNodeType: "door",
          radio: true,
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeRef: "tree2",
          nodeKey: "id",
          treeNodeType: "door",
          radio: true
        }
      ],
      tabs2: [
        {
          id: "1",
          label: "组织结构",
          treeType: "person",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "楼栋房屋",
          treeType: "resident",
          treeNodeType: "staff",
          treeRef: "tree2",
          nodeKey: "id"
        },
        {
          id: "3",
          label: "标签",
          treeType: "person",
          treeRef: "tree3",
          nodeKey: "tagUuid",
          isTag: true
        },
        {
          id: "4",
          label: "信息来源",
          treeType: "orgAndDev",
          treeRef: "tree4",
          nodeKey: "id"
        }
      ],
      checkeTreedNodes: [],
      inputMinTime: 600,
      startTime: "",
      endTime: "",
      checkList: ["人脸", "卡片", "指纹"],
      dynamicTags: [],
      isCurrentShow: false,
      filterText: "",
      elPopoverClass: "firstCardPopver",
      data2: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      options: [],
      value: "",
      tableData: [],
      visible_popver: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    peopleConfirm(checkedNodes) {
      this.peopleList = checkedNodes;
      this.dynamicTags = checkedNodes;
    },
    transferCheckedNodes(data, nodeBool, treeName) {
      console.log(data, nodeBool);
      if (nodeBool) {
        this.checkedNodeName = data.label;
        this.checkedDoor = data;
      } else {
        this.checkedDoor = {};
        this.checkedNodeName = "";
      }
    },
    showPopver() {
      this.visible_popver = true;
    },
    hidePopver() {
      this.visible_popver = false;
    },
    setUseData(node, type) {
      // 选中的设备
      console.log(node, type);
    },
    handleClose(tag, index) {
      console.log(tag, index);
      this.dynamicTags.splice(index, 1);
    },
    /**
		 * 取消新增或修改
		 */
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickConfirm() {
      var resourceSet = [];
      var version = 0;
      console.log(this.dynamicTags, "==========", this.inputMinTime);
      this.inputMinTime = this.inputMinTime
        .toString()
        .replace(/^(0+)|[^\d]+/g, "");
      // 恢复当前的资源的版本
      if (
        this.FCDetail &&
				this.FCDetail.resourceSetVOS &&
				this.FCDetail.resourceSetVOS.length
      ) {
        version = this.FCDetail.resourceSetVOS[0].version;
      }
      for (var i = 0; i < this.dynamicTags.length; i++) {
        let item = this.dynamicTags[i];
        var tempItem = {
          resSn: i,
          resType: item.type,
          resUuid: item.id,
          version: version || item.version,
          mediumAuthList: item.medium
        };
        resourceSet.push(tempItem);
      }
      if (this.checkedDoor === {}) {
        this.$message({
          type: "warning",
          message: "请选择门"
        });
        return;
      }
      if (!this.dynamicTags.length) {
        this.$message({ type: "warning", message: "请选择开门的凭证" });
        return;
      }
      if (!this.inputMinTime) {
        this.$message({ type: "warning", message: "请填写门持续开启时间" });
        return;
      }
      if (this.inputMinTime < 1) {
        this.$message({ type: "warning", message: "门持续开启时间不能小于1" });
        return;
      }
      if (!this.startTime) {
        this.$message({ type: "warning", message: "请选择起始有效时间" });
        return;
      }
      if (!this.endTime) {
        this.$message({ type: "warning", message: "请选择截止有效时间" });
        return;
      }
      if (
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
      ) {
        this.$message({
          type: "warning",
          message: "开始时间不能大于结束时间"
        });
        return;
      }
      var data = {
        beginTime: this.startTime,
        nickName: this.checkedDoor.nickName,
        channelUuid: this.checkedDoor.channelUuid,
        deviceUuid: this.checkedDoor.deviceUuid,
        duration: this.inputMinTime,
        endTime: this.endTime,
        isAll: true,
        resourceSet: resourceSet
      };
      console.log(this.FCDetail, "新增首卡开门", data);
      // 判断是否编辑
      if (!this.FCDetail.infoUuid) {
        this.httpFirstCardOpenDoor(data);
      } else {
        this.FCDetail.resourceSet = data.resourceSet;
        Object.assign(this.FCDetail, data);
        this.httpPutFirstCardApi(this.FCDetail);
      }
    },
    // 新增
    httpFirstCardOpenDoor(data) {
      console.log("新增");
      this.$DoorSetAjax.postFirstCardApi(data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message({ type: "success", message: "新增成功" });
          this.$emit("onConfirm");
        } else {
          this.$message({ type: "warning", message: "新增失败" });
        }
      });
    },
    // 修改
    httpPutFirstCardApi(data) {
      console.log("修改");
      this.$DoorSetAjax.putFirstCardApi(data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message({ type: "success", message: "修改成功" });
          this.$emit("onConfirm");
        } else {
          this.$message({ type: "warning", message: "修改失败" });
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    },
    AddTag() {
      console.log("添加凭证，弹出弹窗");
      this.chooseVisible = !this.chooseVisible;
    },
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  watch: {
    isShow(val) {
      console.log(val);
      this.isCurrentShow = val;
      if (val) {
        this.startTime =
					this.FCDetail.beginTime || this.$common.getCurrentDate();
        this.checkedDoor.nickName = this.FCDetail.nickName;
        this.checkedDoor.channelUuid = this.FCDetail.channelUuid;
        this.checkedDoor.deviceUuid = this.FCDetail.deviceUuid;
        this.checkedDoor.deviceName = this.FCDetail.deviceName;
        this.checkedNodeName = this.checkedDoor.nickName;
        this.inputMinTime = this.FCDetail.duration || 600;
        this.endTime =
					this.FCDetail.endTime || this.$common.getCurrentEndTime();
        this.dynamicTags = [];
        console.log(this.startTime);
        if (
          this.FCDetail.resourceSetVOS &&
					this.FCDetail.resourceSetVOS.length
        ) {
          this.FCDetail.resourceSetVOS.forEach(element => {
            var tempItem = {
              id: element.resUuid,
              label: element.resName,
              type: element.resType,
              nodeType: element.resType,
              version: element.version,
              medium: element.medium
            };
            this.dynamicTags.push(tempItem);
          });
        }
        this.peopleList = this.dynamicTags;
        console.log(this.dynamicTags);
      } else {
        this.startTime = null;
        this.checkedDoor = {};
        this.inputMinTime = 600;
        this.endTime = null;
        this.dynamicTags = [];
      }
    },
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    startTime(val) {
      return val + "日";
    },
    endTime(val) {
      return val + "日";
    },
    checkedDoor() {
      this.checkeTreedNodes = [];
      this.checkeTreedNodes.push(this.checkedDoor);
    }
  },
  destroyed() {}
};
</script>
<style>
.FCCheckedBox {
	display: inline-block;
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
.firstCardPopver {
	max-height: 70%;
	overflow: auto;
}
.device-popover-tree {
	width: 75%;
	display: inline-block;
}
.FirstCardOpenDialog span {
	color: #dddddd;
}
.FirstCardOpenDialog .el-container.is-vertical {
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	overflow-y: auto;
	height: 100%;
}

.FirstCardOpenDialog .el-input__prefix {
	position: absolute;
	height: 100%;
	left: 100% !important;
	top: 0;
	text-align: center;
	color: #dddddd;
	-webkit-transition: all 0.3s;
	transition: all 0.3s;
	transform: translateX(-100%);
}
.FirstCardOpenDialog .el-select {
	display: inline-block;
	position: relative;
	width: 60%;
	max-width: 220px;
}
.FirstCardOpenDialog .el-dialog__body {
	padding: 30px 20px;
	color: #606266;
	font-size: 14px;
}
.FirstCardOpenDialog .el-tag .el-icon-close {
	border-radius: 50%;
	text-align: center;
	position: relative;
	cursor: pointer;
	font-size: 12px;
	height: 16px;
	width: 16px;
	line-height: 16px;
	vertical-align: middle;
	top: 7px;
	right: 15px;
	color: rgba(0, 0, 0, 1);
	/* background-color: #26d39d; */
	background-color: rgba(245, 245, 245, 0.6);
	display: none;
	margin-top: 0px;
}
.FirstCardOpenDialog .el-radio {
	margin: auto 15px auto 0;
}
.FirstCardOpenDialog .el-dialog__body {
	padding: 0 50px;
	height: calc(100% - 120px);
}
.FirstCardOpenDialog .el-checkbox-group {
	font-size: 0;
	display: inline-block;
	/* justify-content: space-around; */
	margin: 0 8px 0 20px;
}
.FirstCardOpenDialog .el-tag:hover {
	background-color: rgb(43, 47, 52);
}

.FirstCardOpenDialog .el-tag:hover .el-icon-close {
	display: inline-block;
}

.FirstCardOpenDialog .el-tag {
	padding: 0 15px;
	height: 32px;
	line-height: 30px;
	font-size: 12px;
	color: #26d39d;
	border-radius: 4px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border: 0px solid rgba(40, 255, 187, 0.2);
	white-space: nowrap;
	margin: 5px 8px;
	background-color: transparent;
	display: flex;
	justify-content: space-around;
	padding: 0;
}
.FirstCardOpenDialog .tagBox {
	padding: 5px 50px 15px 0;
	text-align: center;
	border-bottom: 1px dashed rgb(52, 55, 59);
	color: #dddddd;
}
.FirstCardOpenDialog .tagBox .el-checkbox {
	margin-right: 18px;
}
.FirstCardOpenDialog .main-middle .el-input {
	display: inline-block;
	width: 30%;
	max-width: 150px;
	margin: auto 10px;
}
.FirstCardOpenDialog .el-header {
	padding: 0px 10% 0;
	height: 50px !important;
	line-height: 50px;
}
.FirstCardOpenDialog i {
	margin-right: 5px;
	color: #26d39d;
}
.FirstCardOpenDialog .el-input--prefix .el-input__inner {
	padding-left: 15px;
}

.FirstCardOpenDialog .el-input--suffix .el-input__inner {
	padding-right: 12px;
}
.FirstCardOpenDialog .el-dialog {
	background: #25292d;
	border-radius: 3px;
	border-radius: 3px;
	overflow-y: auto;
	/* height: 42.6%; */
}
.FirstCardOpenDialog .el-dialog__body {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
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
	border-right: 1px solid #2f2f2f;
	padding: 10px 15px;
	color: #dddddd;
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
		}
		.el-input {
			width: 80%;
		}
	}
	.el-main {
		padding: 10px 15px;
		.tagBox {
			padding: 30px 50px;
		}
	}
}
.main-middle {
	padding: 0px 10px;
}
.main-middle p:nth-child(2) {
	text-align: center;
	margin: 15px auto 15px;
}
.time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.dialog-footer {
	text-align: center;
	border: {
		width: 0px 0 0 0;
		style: solid;
		color: $line-color;
	}
	.footer-button {
		margin: 17px 28px 17px 0;
	}
}
</style>
