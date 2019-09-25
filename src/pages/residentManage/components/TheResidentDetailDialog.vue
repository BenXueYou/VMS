<template>
	<el-dialog
		:title="title"
		@close="close"
		:width="width"
		class="EditResidentdialogClass"
		:visible.sync="dialogVisible"
	>
		<div class="body">
			<div class="body_box" style="border-top:0px;">
				<el-row type="flex" justify="flex-start" :gutter="20">

							<el-col style="text-align:right;" :span="5">
								<p>姓名：</p>
								<p>性别：</p>
								<p>民族：</p>
								<p>证件号：</p>
							</el-col>
							<el-col :span="14">
								<p>{{defaultResident.staffName}}</p>
								<p>{{$common.getEnumItemName("gender", defaultResident.gender)}}</p>
								<p>{{$common.getEnumItemName("nation", defaultResident.nation)}}</p>
								<p>{{defaultResident.credentialNo}}</p>
							</el-col>

					<el-col style="text-align:right;" :span="5">
						<div class="imgBox">
							<img
								:src="defaultResident.lifePictureUrl? imageUrl+defaultResident.lifePictureUrl : require('@/assets/images/user.png')"
								alt
								srcset
							>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>手机：</p>
						<p>文化程度：</p>
						<p>婚姻状况：</p>
						<p>国籍：</p>
						<p>籍贯：</p>
						<p>户籍：</p>
						<p>备注：</p>
					</el-col>
					<el-col :span="19">
						<p>{{defaultResident.cellphone || ''}}</p>
						<p>{{$common.getEnumItemName("edu", defaultResident.education) || ''}}</p>
						<p>{{$common.getEnumItemName("marital", defaultResident.maritalStatus) || ''}}</p>
						<p>{{$common.getEnumItemName("nationality", defaultResident.nationality || '')}}</p>
						<p>{{defaultResident.nativePlace || ''}}</p>
						<p>{{defaultResident.address || ''}}</p>
						<p>{{defaultResident.remarks || ''}}</p>
					</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>房屋地址：</p>
						<p>标签：</p>
					</el-col>
					<el-col :span="19">
						<p>{{defaultResident.addressString}}</p>
							<tag-view
								style="display:inline;margin-top:-15px"
								:tags="dynamicTags"
								:closable="false"
								@handleClose="handleClose"
							></tag-view>

					</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>卡：</p>
					</el-col>
					<el-col :span="19">
						<div class="pBox" v-for="(item, index) in defaultResident.cardList" :key="index">
							<div>
								<img class="img" src="@/assets/images/resident/card_icon.png" alt srcset>
								{{item.cardId}}
							</div>
						</div>
					</el-col>
				</el-row>

				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>指纹：</p>
					</el-col>
					<el-col :span="19">
						<div class="pBox" v-for="(item, index) in defaultResident.fingerprintList" :key="index">
							<div>
								<img class="img" src="@/assets/images/resident/finger_prints_icon.png" alt srcset>
								{{item.name}}
							</div>
						</div>
					</el-col>
				</el-row>

				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>通行权限组：</p>
					</el-col>
					<el-col :span="19">
						<p v-for="(item, index) in defaultResident.trafficAuthList" :key="index">{{item.groupName}}</p>
					</el-col>
				</el-row>

				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>访客权限组：</p>
					</el-col>
					<el-col :span="19">
						<p v-for="(item, index) in defaultResident.visitorAuthList" :key="index">{{item.groupName}}</p>
					</el-col>
				</el-row>

				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>延迟时间：</p>
						<p>有效期：</p>
					</el-col>
					<el-col :span="19">
						<p>{{defaultResident.openDelayTime?defaultResident.openDelayTime:'0'}}秒</p>
						<p>{{defaultResident.longTerm===true?'长期有效':'短期有效'}}</p>
					</el-col>
				</el-row>
			</div>
		</div>
		<div slot="footer" class="dialogHeaderClass">
			<el-row type="flex" justify="space-between">
				<el-col style="text-align:left" :span="4"></el-col>
				<el-col class="header_right_box" :span="20">
					<!-- <el-button @click="confirm" type="primary">保存并新增</el-button>
					<el-button @click="confirm" type="primary">确认</el-button>-->
					<el-button @click="close" type="primary">关闭</el-button>
				</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import tagView from "@/common/Tag.vue";
import RestApi from "@/utils/RestApi.js";
export default {
  components: { tagView },
  props: {
    width: {
      type: String,
      default() {
        return "550px";
      }
    },
    title: {
      type: String,
      default() {
        return "居民信息";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    defaultResident: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      countryOptions: window.config.options,
      countryOption: "",
      maritalOptions: window.config.options,
      maritalOption: "",
      nationOption: "",
      nationOptions: window.config.options,
      educationOptions: window.config.options,
      educationOption: "",
      checkedNodeName: "",
      inputWidth: "30%",
      visible_popver: false,
      checkeTreedNodes: [],
      dynamicTags: [],
      myHeaders: {},
      updateFileImage: "",
      icons,
      dialogVisible: false,
      radioGender: "男",
      phoneNumber: "",
      name: "",
      radioDate: "",
      startTime: "",
      endTime: "",
      ResidentPopoverClass: "ResidentPopoverClass",
      treeData: window.config.treeData,
      defaultProps: {
        label: "label",
        children: "children"
      },
      filterText: "",
      certificateOptions: window.config.options,
      certificateOption: "",
      imageUrl: RestApi.api.imageUrl
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
    this.checkeTreedNodes = this.dynamicTags;
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    clearAction() {},
    transferCheckedNodes() {},
    handleClose(arr) {
      this.dynamicTags = arr;
      this.checkeTreedNodes = this.dynamicTags;
    },
    httpRequest() {},
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    confirm() {},
    nodeClick(data, node, nodeTree) {
      var checkedKeys = this.$refs.roomTree.getCheckedKeys();
      if (checkedKeys.indexOf(data.id) !== -1) {
        checkedKeys.splice(checkedKeys.indexOf(data.id), 1);
      } else {
        checkedKeys.push(data.id);
      }
      this.$refs.roomTree.setCheckedKeys(checkedKeys);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.dialogVisible = this.visible;
      this.dynamicTags = [];
    },
    defaultResident: {
      handler(val, oldVal) {
        if (val.tagInofShows && val.tagInofShows.length) {
          val.tagInofShows.forEach(item => {
            item.id = item.tagUuid;
            item.label = item.tagName;
            this.dynamicTags.push(item);
          });
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.EditResidentdialogClass .el-dialog {
	position: relative;
	top: 60px;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, 0%);
	margin: 0px !important;
	background: #212325;
}
.EditResidentdialogClass .el-input__icon {
	line-height: 30px;
	color: #26d39d;
}
.EditResidentdialogClass .el-dialog__headerbtn {
	top: 18px;
	display: none;
}
.EditResidentdialogClass .el-dialog__header {
	height: 60px;
}
.dialogHeaderClass {
	width: 100%;
	padding: 25px 40px 24px;
	box-sizing: border-box;
}
.EditResidentdialogClass .dialogHeaderClass .header_left_txt {
	border-left: 2px solid #26d39d;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	padding-left: 10px;
}
.EditResidentdialogClass .pBox {
	display: flex;
	justify-content: flex-start;
	margin: 7px 0 8px;
}
.EditResidentdialogClass .pBox div {
	width: 50%;
	text-align: left;
}
.EditResidentdialogClass .header_right_box {
	text-align: right;
	margin-top: -10px;
}
.EditResidentdialogClass .header_right_box button {
	height: 32px;
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #ffffff;
	text-align: justify;
	padding: 7px 17px;
}

.EditResidentdialogClass .imgBox {
	display: inline-block;
	width: 100%;
	height: 100px;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
}
.EditResidentdialogClass .imgBox img {
	width: 100%;
	height: 100%;
}
.EditResidentdialogClass .left_tips_txt {
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #26d39d;
}
.EditResidentdialogClass .el-upload {
	display: inline-block;
	text-align: center;
	width: 100%;
	line-height: 130px;
	cursor: pointer;
	outline: none;
}
.EditResidentdialogClass .authBox {
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}
.EditResidentdialogClass .el-select {
	display: inline-block;
	position: relative;
	width: 30%;
}
.EditResidentdialogClass .el-select .el-input {
	width: 100%;
}
.EditResidentdialogClass .el-select .el-select-dropdown__list {
	width: 100%;
}
.EditResidentdialogClass .el-input {
	display: inline-block;
	width: 30%;
	height: 30px;
}
.EditResidentdialogClass .el-input .el-input__inner {
	height: 30px;
	padding-right: 15px;
}
.EditResidentdialogClass .body_box {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 15px 0px 20px;
	color: #bbbbbb;
}
.el-dialog__wrapper {
	overflow: auto;
}
.EditResidentdialogClass .time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.EditResidentdialogClass .img {
	vertical-align: baseline;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
	padding: 10px 46px 0px;
	box-sizing: border-box;
}
.body {
	height:80vh;
	max-height: 600px;
	overflow: auto;
	@include padding;
	.title {
		height: 40px;
		line-height: 30px;
		@include font-s;
	}
	.righttips {
		float: right;
		.test {
			padding-right: 20px;
		}
		.refresh {
			cursor: pointer;
			img {
				display: inline-block;
				vertical-align: middle;
			}
			color: $add-text-color;
		}
	}
	.body_box {
		p {
			font-family: PingFangSC-Regular;
			font-size: 12px;
			color: #dddddd;
			margin: 7px 0 8px;
			height: 16px;
		}
	}
	.card_icon_class {
		text-align: center;
		p {
			background: rgba(255, 255, 255, 0.03);
			border-radius: 2px;
			border-radius: 2px;
			font-family: PingFangSC-Regular;
			font-size: 12px;
			color: #bbbbbb;
			line-height: 35px;
			margin: 0 20%;
			padding: 0 20px;
			width: 60%;
			text-align: center;
			display: flex;
			justify-content: space-between;
		}
	}
	.finger_icon_class {
		padding-left: 30px;
	}
}
.footer {
	@include padding;
	overflow: hidden;
	button {
		height: 30px;
		padding: 7px 21px;
		background: rgba(40, 255, 187, 0.12);
		border: 1px solid rgba(40, 255, 187, 0.8);
		border-radius: 2px;
		border-radius: 2px;
		font-family: "PingFangSC-Regular";
		font-size: 12px;
		color: #ffffff;
		letter-spacing: 0;
	}
}
</style>
