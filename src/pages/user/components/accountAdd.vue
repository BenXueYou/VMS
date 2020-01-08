/* eslint-disable no-useless-escape */
<template>
	<div class="AccountAdd">
		<div class="mainBox">
			<el-header class="headerBox">
				<div class="headerTxt">{{title}}</div>
				<div>
					<el-button
						v-if="!rowData.accountUuid&&queryBody.accountType!=='project_admin'"
						@click="editBtnAct('again')"
						class="firstBtnClass"
						v-loading="isload"
					>保存并继续添加</el-button>
					<el-button v-if="queryBody.accountType!=='project_admin'" @click="editBtnAct('save')" v-loading="isload">确认</el-button>
					<el-button @click="close">取消</el-button>
				</div>
			</el-header>
			<div class="bodyBox">
				<div class="bodyBoxDiv">
					<p>用户账号：</p>
					<p>密码：</p>
					<p>确认密码：</p>
					<p>状态：</p>
					<p>是否关联系统人员：</p>
					<p>姓名：</p>
					<p>手机：</p>
					<p>邮箱：</p>
					<p>到期时间：</p>
					<p v-if="!isLongTIme" style="visibility: hidden;">到期时间：</p>
					<p>账号描述：</p>
				</div>
				<div class="bodyBoxDiv">
					<div>
						<el-input v-model="queryBody.accountName"></el-input>
					</div>
					<div>
						<el-input type="password" v-model="queryBody.password" :disabled="isEditPassWord"></el-input>
					</div>
					<div>
						<el-input type="password" v-model="queryBody.confirmPassword" :disabled="isEditPassWord"></el-input>
					</div>
					<p style="margin:17px 0">
						<el-radio-group v-model="queryBody.enable">
							<el-radio :label="1">启用</el-radio>
							<el-radio :label="0">禁用</el-radio>
						</el-radio-group>
					</p>
					<p style="text-align: left;margin:28px 0 0 0">
						<el-switch
							v-model="isAssociateSwitch"
							active-color="rgba(32, 204, 150, 0.2)"
							inactive-color="rgba(255,255,255,0.2)"
						></el-switch>
					</p>
					<div>
						<el-input :disabled="isAssociateSwitch" v-model="queryBody.staffName"></el-input>
						<span class="cursorClass" v-if="isAssociateSwitch" @click="addSystemStaff">
							<img class="img" src="@/assets/images/resident/modify_icon.png" alt srcset />请选择
						</span>
					</div>
					<div>
						<el-input :disabled="isAssociateSwitch" v-model="queryBody.phoneNumber"></el-input>
					</div>
					<div>
						<el-input :disabled="isAssociateSwitch" v-model="queryBody.emailNumber"></el-input>
					</div>
					<p style="margin:17px 0">
						<el-radio-group v-model="isLongTIme">
							<el-radio :label="1">长期</el-radio>
							<el-radio :label="0">短期</el-radio>
						</el-radio-group>
					</p>
					<div v-if="!isLongTIme">
						<el-date-picker
							v-model="invalidTimeVal"
							type="datetime"
							class="time-interal-date"
							placeholder="选择日期"
							size="small"
							value-format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
					</div>
					<p>
						<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryBody.description"></el-input>
					</p>
				</div>
			</div>
			<div class="bodyBox">
				<div class="bodyBoxDiv flex-spw">
					<div>
						<img class="img" src="@/assets/images/resident/baseMsg.png" alt />系统角色
					</div>
					<div>角色：</div>
				</div>
				<div>
					<div class="bodyBoxDiv addRoleBtnClass cursorClass" @click="addRoleBtn">
						<img class="img" src="@/assets/images/add.png" alt srcset />新增
					</div>
					<div>
						<!-- <gt-button
							:icon="icons.door"
							v-for="(item,index) in rowData.roles || []"
							class="person"
							:key="index"
							:show-close="false"
						>{{item.roleName}}</gt-button>-->
						<gt-button
              style="margin-right: 5px;"
							v-for="(item,index) in rowData.roles || []"
							class="bilibili"
							@close="deleteChannelAuth(index)"
							:key="index"
						>{{item.roleName}}</gt-button>
					</div>
				</div>
			</div>
			<div class="footerClass">
				<el-button
					v-if="!rowData.accountUuid&&queryBody.accountType!=='project_admin'"
					@click="editBtnAct('again')"
					class="firstBtnClass"
					v-loading="isload"
				>保存并继续添加</el-button>
				<el-button v-if="queryBody.accountType!=='project_admin'" @click="editBtnAct('save')" v-loading="isload">确认</el-button>
				<el-button @click="close">取消</el-button>
			</div>
		</div>
		<tab-tree-tag
			title="请选择关联人员"
			rightTxt="已选的人员"
			:tabs="tabs"
			:isShow="systemStaffDialogVisible"
			@onCancel="onCancel"
			@onConfirm="onConfirm"
		></tab-tree-tag>
		<!-- <tree-panel-dialog :isShow.sync="showTreeAdd" title='分配角色'></tree-panel-dialog> -->
	</div>
</template>
<script>
// import api from "@/pages/faceModule/api.js";
import tabTreeTag from "@/common/TabTreeTag";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
import tagView from "@/common/Tag.vue";
import icons from "@/common/js/icon.js";
import * as api from "../http/ajax";
export default {
  components: { tabTreeTag, treePanelDialog, tagView },
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isEditPassWord: true,
      title: "添加账号",
      icons,
      isload: false,
      showTreeAdd: false,
      systemStaffDialogVisible: false,
      tabs: [
        {
          id: "1",
          label: "组织架构",
          treeType: "person",
          treeRef: "tree1",
          nodeKey: "id",
          treeNodeType: "staff",
          selectSingleNode: "staff",
          radio: true
        },
        {
          id: "2",
          label: "标签",
          treeType: "person",
          treeRef: "tree2",
          nodeKey: "tagUuid",
          isTag: true
        }
      ],
      tags: [],
      invalidTimeVal: null, // 失效时间 (可选)
      isAssociateSwitch: false,
      isLongTIme: 1,
      queryBody: {
        accountName: null, // 用户账号
        accountType: null, // 账号类型
        password: null, // 用户密码
        confirmPassword: null, // 用户确认密码
        enable: 1, // 使能状态
        enableValue: 1, // 使能状态
        staffUuid: null, // 人员UUID (可选)
        staffName: null, // 用户名
        phoneNumber: null, // 电话号码
        emailNumber: null, // 邮箱号码
        description: null, // 描述
        roleUuids: [], // 角色uuid数组
        isAssociateStaff: "",
        invalidTime: "" // 失效时间 (可选)
      }
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.invalidTimeVal = new Date();
    console.log("queryBody==", this.queryBody);
    // this.queryBody.invalidTime = this.$common.timestampToFormatter(new Date(), "yyyy-mm-dd HH:mm:ss");
  },
  methods: {
    initData() {
      this.invalidTimeVal = null; // 失效时间 (可选)
      this.isAssociateSwitch = false;
      this.isLongTIme = 1;
      this.queryBody.accountName = null; // 用户账号
      this.queryBody.accountType = null; // 账号类型
      this.queryBody.password = null; // 用户密码
      this.queryBody.confirmPassword = null; // 用户确认密码
      this.queryBody.enable = 1; // 使能状态
      this.queryBody.enableValue = 1; // 使能状态
      this.queryBody.staffUuid = null; // 人员UUID (可选)
      this.queryBody.staffName = null; // 用户名
      this.queryBody.phoneNumber = null; // 电话号码
      this.queryBody.emailNumber = null; // 邮箱号码
      this.queryBody.description = null; // 描述
      this.queryBody.roleUuids = []; // 角色uuid数组
      this.queryBody.roles = [];
      this.queryBody.isAssociateStaff = "";
      this.queryBody.invalidTime = ""; // 失效时间 (可选)
    },
    // 点击确定按钮
    editBtnAct(status) {
      console.log("queryBody==", this.queryBody);
      console.log("staffName==", this.queryBody.staffName);
      if (this.queryBody.accountName === null || this.queryBody.accountName === "null") {
        this.$message.warning("账号长度在 4 到 16 个字符"); return;
      } else if (this.queryBody.accountName.length < 4 || this.queryBody.accountName.length > 16) {
        this.$message.warning("账号长度在 4 到 16 个字符"); return;
      }
      if (this.queryBody.roles) {
        let roleUuids = [];
        this.queryBody.roles.filter(i => {
          roleUuids.push(i.roleUuid);
        });
        this.queryBody.roleUuids = roleUuids;
      }
      if (this.rowData.accountUuid) {
        // 修改
        console.log("queryBody==", this.queryBody);
        let parms = this.queryBody;
        if (this.isAssociateSwitch === true) {
          parms.isAssociateStaff = 1;
        } else {
          parms.isAssociateStaff = 0;
        }
        if (this.isLongTIme === 1) {
          parms.invalidTime = "long";
        } else {
          parms.invalidTime = this.$common.timestampToFormatter(
            this.invalidTimeVal,
            "yyyy-mm-dd HH:mm:ss"
          );
        }
        this.isload = !this.isload;
        api
          .putAccountApi(parms)
          .then(res => {
            this.isload = !this.isload;
            if (res.data.success) {
              this.$emit("close", true);
              this.$message.success(res.data.msg);
            } else {
              this.$message.warning(res.data.msg);
            }
          })
          .catch(() => {
            this.isload = !this.isload;
          });
      } else {
        if (this.queryBody.password !== this.queryBody.confirmPassword) {
          this.$message({ type: "warning", message: "两次密码不一致" });
          return;
        }
        var eReg1 = /^(?![^a-zA-Z]+$)(?!\D+$)/;
        if (!eReg1.test(this.queryBody.password)) {
          this.$message.warning("密码至少包含数字，字母这两种（区分大小写）");
          return;
        }
        /* eslint-disable */
				var eReg2 = /^[^\[\]\?\|\\\/\:\;\+\*\<\>]*$/;
				/* eslint-enable */
        if (!eReg2.test(this.queryBody.password)) {
          this.$message.warning("不能包含特殊字符 /[]:;丨+*?<>");
          return;
        }
        var eReg3 = /^[^\s]*$/;
        if (!eReg3.test(this.queryBody.password)) {
          this.$message.warning("字符中不能包含空格");
          return;
        }
        let parms = this.queryBody;
        if (this.isAssociateSwitch === true) {
          parms.isAssociateStaff = 1;
        } else {
          parms.isAssociateStaff = 0;
        }
        if (this.isLongTIme === 1) {
          parms.invalidTime = "long";
        } else {
          parms.invalidTime = this.$common.timestampToFormatter(
            this.invalidTimeVal,
            "yyyy-mm-dd HH:mm:ss"
          );
        }
        // if (parms.enableValue === 1) {
        //   parms.enable = true;
        // } else {
        //   parms.enable = false;
        // }
        console.log("parms===", parms);
        // 新增
        this.isload = !this.isload;
        api
          .addAccountApi(parms)
          .then(res => {
            this.isload = !this.isload;
            if (res.data.success) {
              console.log("status55555==", status);
              if (status === "again") {
                this.initData();
                this.$emit("update:rowData", { roles: [] });
              } else if (status === "save") {
                this.$emit("close", true);
              }
              this.$message.success(res.data.msg);
              // this.$emit("close", true);
            } else {
              this.$message.warning(res.data.msg);
            }
          })
          .catch(() => {
            this.isload = !this.isload;
          });
      }
    },
    onCancel() {
      this.systemStaffDialogVisible = !this.systemStaffDialogVisible;
    },
    onConfirm(arr) {
      console.log(arr);
      this.queryBody.staffUuid = arr[0].id;
      this.queryBody.staffName = arr[0].label;
      this.systemStaffDialogVisible = !this.systemStaffDialogVisible;
    },
    // 选择系统人员
    addSystemStaff() {
      this.systemStaffDialogVisible = !this.systemStaffDialogVisible;
    },
    // 新增角色
    addRoleBtn() {
      // 分配角色 向父组件传值
      //   this.showTreeAdd = !this.showTreeAdd;
      console.log(this.rowData);
      this.$emit("addRole", this.rowData);
    },
    close() {
      this.$emit("close", true);
    },
    deleteChannelAuth(index) {
      this.rowData.roles.splice(index, 1);
    }
  },
  watch: {
    rowData: {
      handler(newVal, old) {
        if (this.rowData.accountUuid) {
          // this.initData();
          this.title = "编辑账号";
          // this.initData();
          console.log("rowData==", this.rowData);
          this.isEditPassWord = true;
          if (this.rowData.isAssociateStaff === 1) {
            this.isAssociateSwitch = true;
          } else {
            this.isAssociateSwitch = false;
          }
        } else {
          // this.initData();
          this.title = "添加账号";
          this.isEditPassWord = false;
        }
        console.log("newVal===", newVal);
        console.log("old===", old);
        if (!newVal.roles) {
          this.initData();
        }
        Object.assign(this.queryBody, newVal);
        console.log("--------------------", this.queryBody);
        if (this.rowData.accountUuid) {
          if (this.queryBody.invalidTime === "long") {
            this.isLongTIme = 1;
            this.queryBody.confirmPassword = this.queryBody.password;
          } else {
            this.invalidTimeVal = this.queryBody.invalidTime;
            this.isLongTIme = 0;
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  destroyed() {}
};
</script>
<style>
.AccountAdd .el-tag .el-icon-close {
	/* background-image: url("../../../../../assets/images/faceModule/tagDeleteIcon.png"); */
	background-size: contain;
	color: transparent;
	top: -15px;
	right: -15px;
}
.AccountAdd .flex-spw {
	display: flex;
	justify-content: space-between;
}
.AccountAdd .el-input__inner {
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 2px;
}
.AccountAdd .el-textarea__inner {
	width: 250px;
	background-color: transparent;
	border: 1px solid rgba(255, 255, 255, 0.15);
}
.el-message-box__title {
	padding-left: 0;
	margin-bottom: 0;
	font-size: 16px;
	line-height: 1;
	color: #dddddd;
}
.el-message-box__header {
	border-bottom: 1px solid #303133;
}
.el-message-box__content {
	color: #dddddd;
}
.el-message-box .el-button--default,
.el-message-box .el-button--default:hover,
.el-message-box .el-button--default:active,
.el-message-box .el-button--default:focus {
	background: rgba(40, 255, 187, 0.1);
	border: 1px solid rgba(40, 255, 187, 0.45);
	border-radius: 2px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.AccountAdd {
	width: 1100px;
	min-height: 100%;
	padding: 30px;
	box-sizing: border-box;
	background-color: #212325;
	.mainBox {
		height: 100%;
		padding: 0 40px;
		box-sizing: border-box;
		overflow: auto;
		.headerBox {
			display: flex;
			justify-content: space-between;
			align-content: center;
			padding: 18px 0 24px;
			height: 69px;
			border-bottom: 1px solid rgba(255, 255, 255, 0.07);
			.headerTxt {
				border-left: 2px solid #26d39d;
				font-family: "PingFangSC-Regular";
				font-size: 14px;
				color: #ffffff;
				padding-left: 10px;
			}
			.el-button {
				background: rgba(40, 255, 187, 0.08);
				border: 1px solid rgba(38, 211, 157, 0.8);
				border-radius: 2px;
				height: 32px;
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #ffffff;
				text-align: justify;
				padding: 0px 27px;
				margin-top: -13px;
			}
			.firstBtnClass {
				padding: 0 15px;
			}
		}
		.bodyBox {
			display: flex;
			justify-content: flex-start;
			border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
			padding: 15px 0;
			.bodyBoxDiv {
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #dddddd;
				text-align: right;
				padding: 0px 11px;
				p {
					margin: 28px 0;
					text-align: right;
				}
				p:last-child {
					margin: 17px 0 13px 0;
				}
				.el-radio-group {
					display: block;
				}
				.el-input {
					display: inline-block;
					width: 250px;
					height: 32px;
					margin: 17px 13px 0px 0;
					.el-input__inner {
						border: 1px solid rgba(255, 255, 255, 0.15);
						border-radius: 2px;
					}
				}
				div {
					text-align: left;
				}
				.img {
					vertical-align: baseline;
					margin-right: 8px;
				}
				.el-tag {
					background-color: rgba(255, 255, 255, 0.05);
					border: 0;
					border-radius: 2px;
					font-family: "PingFangSC-Regular";
					font-size: 13px;
					color: #dddddd;
				}
				.warningTxt {
					font-family: "PingFangSC-Regular";
					font-size: 13px;
					color: #fd545e;
				}
			}
			.bodyBoxDiv:first-child {
				width: 24%;
				min-width: 100px;
			}
			.addRoleBtnClass {
				text-align: left;
				line-height: 25px;
				margin-bottom: 10px;
			}
		}
		.footerClass {
			margin: 26px 0 100px;
			text-align: right;
			.el-button {
				background: rgba(40, 255, 187, 0.08);
				border: 1px solid rgba(38, 211, 157, 0.8);
				border-radius: 2px;
				border-radius: 2px;
				height: 32px;
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #ffffff;
				text-align: justify;
				padding: 7px 27px;
			}
			.firstBtnClass {
				padding: 0 15px;
			}
		}
	}
}
</style>
