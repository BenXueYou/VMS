<template>
	<div class="roleEditWrap">
		<div class="headera">
			<span class="shuline">添加角色</span>
			<div class="buttongroup">
				<el-button v-if="!roleUuid" :loading="isloading" @click="saveAndAdd" size="small" type="primary">保存并继续添加</el-button>
				<el-button @click="confirm" :loading="isloading" class="button" size="small" type="primary">确认</el-button>
				<el-button @click="close" class="button" size="small" type="primary">取消</el-button>
			</div>
		</div>
		<div class="dash-line"></div>
		<div class="k-form">
			<label for>角色名称：</label>
			<div class="aa">
				<el-input class="inpaaa" v-model="roleName"></el-input>
			</div>
		</div>
		<div class="k-form">
			<label for>状态：</label>
			<div class="aa">
				<el-radio-group v-model="enable">
					<el-radio label="enable">启用</el-radio>
					<el-radio label="disable">禁用</el-radio>
				</el-radio-group>
			</div>
		</div>
		<div class="k-form">
			<label for>到期时间：</label>
			<div class="aa">
				<el-radio-group v-model="time">
					<el-radio label="forever">永久</el-radio>
					<el-radio label="shorttime">短期</el-radio>
				</el-radio-group>
			</div>
		</div>
		<div class="k-form" v-show="time==='shorttime'">
			<label for></label>
			<div class="aa">
				<el-date-picker
					v-model="invalidTime"
					type="datetime"
					style="width:220px"
					value-format="yyyy-MM-dd HH:mm:ss"
					placeholder="选择日期时间"
				></el-date-picker>
			</div>
		</div>
		<div class="k-form">
			<label for>角色描述：</label>
			<div class="aa">
				<el-input class="inpaaa" type="textarea" :rows="3" v-model="description"></el-input>
			</div>
		</div>
		<div class="dash-line"></div>
		<div class="k-form">
			<div class="label">
				<span class="adasaaaaF">
					<img src="../../../assets/images/auth/auth.png" alt />
					权限信息
				</span>
				<label for>关联的功能模块：</label>
			</div>
			<div class="aa">
				<el-button type="text" size="small" @click="addFunction" icon="el-icon-circle-plus-outline">新增</el-button>
				<div>
					<gt-button
						v-for="(item,index) in featureAuth"
						class="bilibili"
						@close="deleteFeatureAuth(index)"
						:key="index"
					>{{item.featureName}}</gt-button>
				</div>
			</div>
		</div>
		<!-- <div class="k-form">
			<label for>关联的通道资源：</label>
			<div class="aa">
				<el-button type="text" size="small" @click="getResource" icon="el-icon-circle-plus-outline">新增</el-button>
				<div>
					<gt-button
						v-for="(item,index) in resourceAuth"
						class="bilibili"
						@close="deleteChannelAuth(index)"
						:key="index"
					>{{item.label || item.resourceName}}</gt-button>
				</div>
			</div>
		</div> -->
		<div class="dash-line"></div>
		<div class="k-form">
			<div class="label">
				<span class="adasaaaaF">
					<img src="../../../assets/images/auth/shouquan.png" alt />
					授权账号
				</span>
				<label for>授权账号：</label>
			</div>
			<div class="aa">
				<el-button
					type="text"
					style="margin-bottom:20px;"
					size="small"
					@click="addAccout"
					icon="el-icon-circle-plus-outline"
				>新增</el-button>
				<div>
					<gt-button
						v-for="(item,index) in shouquanSelectedArr"
						class="bilibili"
						@close="deleteShouQuan(index)"
						:key="index"
					>{{item.accountName}}</gt-button>
				</div>
			</div>
		</div>
		<div class="dash-line"></div>
		<div class="headera">
			<div class="buttongroup">
				<el-button
					v-if="!roleUuid"
					:loading="isloading"
					@click="saveAndAdd"
					size="small"
					type="primary"
				>保存并继续添加</el-button>
				<el-button @click="confirm" :loading="isloading" class="button" size="small" type="primary">确认</el-button>
				<el-button @click="close" class="button" size="small" type="primary">取消</el-button>
			</div>
		</div>
		<!--功能模块资源权限-->
		<auth-tree
			:visible.sync="authTreeVisible"
			:roleUuid="roleUuid"
			:selectAuthUuid="featureAuthUuids"
			@confirm="setFeatureData"
		></auth-tree>
		<!--通道资源权限-->
		<resouce-tree
			:visible.sync="showResouce"
			:defaultCHNResource="resourceAuth"
			@transferResourceAuth="transferResourceAuth"
		></resouce-tree>
		<!--账号资源权限-->
		<tree-panel-dialog
			:isShow.sync="showtreeadad"
			title="选择授权账号"
			placeholder="搜索授权账号"
			checkedText="已选中授权账号"
			:props="shouquanProps"
			:treeData="showquanAccoutArr"
			@onConfirm="selectShouquan"
			:initSelectData="shouquanSelectedArr"
		></tree-panel-dialog>
	</div>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
import authTree from "@/pages/user/components/authTree";
import resouceTree from "@/pages/user/components/resouceTree";
export default {
  name: "roleAdd",
  components: {
    treePanelDialog,
    authTree,
    resouceTree
  },
  props: {
    roleUuid: {
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
    }
  },
  data() {
    return {
      showResouce: false,
      showtreeadad: false,
      authTreeVisible: false,
      enable: "enable",
      time: "forever",
      invalidTime: "",
      roleName: "",
      description: "",
      featureAuth: [],
      account: [],
      resourceAuth: [],
      featureAuthUuids: [],
      showquanAccoutArr: [],
      shouquanSelectedArr: [],
      shouquanProps: {
        label: "accountName",
        id: "accountUuid"
      },
      defaultCHNResource: [],
      isloading: false
    };
  },
  methods: {
    selectShouquan(data) {
      this.shouquanSelectedArr = data;
      console.log(this.shouquanSelectedArr);
    },
    deleteShouQuan(index) {
      this.shouquanSelectedArr.splice(index, 1);
    },
    transferResourceAuth(dataArr) {
      this.resourceAuth = dataArr;
    },
    setFeatureData(showNum) {
      // 设置获取到的数据
      this.featureAuth = showNum;
      // this.featureAuthUuids = checkedUuidNums;
    },
    deleteFeatureAuth(index) {
      this.featureAuth.splice(index, 1);
    },
    deleteChannelAuth(index) {
      this.resourceAuth.splice(index, 1);
    },
    deleteAPPAuth(index) {
      this.account.splice(index, 1);
    },
    addAccout() {
      api
        .getAccountListApi({
          page: 1,
          limit: 11111
        })
        .then(res => {
          let data = res.data.data.list || [];
          console.log(data);
          this.showquanAccoutArr = data;
          this.showtreeadad = true;
        });
    },
    addFunction() {
      this.featureAuthUuids = this.featureAuth;
      this.authTreeVisible = true;
    },
    getResource() {
      this.showResouce = !this.showResouce;
    },
    saveAndAdd() {
      this.submit(true);
    },
    confirm() {
      if (this.roleName === "") {
        this.$message.error("请输入角色名称!");
      } else {
        this.submit(false);
      }
    },
    close() {
      this.$emit("close");
    },
    resetAddDialog() {
      // 清空数据
      this.roleName = "";
      this.enable = "enable";
      this.time = "forever";
      this.description = "";
      this.account = [];
      this.resourceAuth = [];
      this.featureAuth = [];
      this.shouquanSelectedArr = [];
      this.showquanAccoutArr = [];
    },
    rebaseData() {
      let resourceAuth = [];
      this.resourceAuth.map(i => {
        let obj = {
          resourceUuid: i.resourceUuid,
          id: i.resourceUuid,
          label: i.resourceName,
          resourceType: i.resourceType,
          authUuids: i.authUuids ? i.authUuids : i.resourceAuthUuids
        };
        return resourceAuth.push(obj);
      });
      console.log("resourceAuth===", resourceAuth);
      let isShowList = [],
        isOwnList = [];
      console.log(this.featureAuth);
      for (let i = 0, len = this.featureAuth.length; i < len; i++) {
        // featureAuthUuids.push(...this.featureAuth[i].authUuids);
        if (this.featureAuth[i].isShow) {
          isShowList.push(this.featureAuth[i].featureUuid);
        }
        if (this.featureAuth[i].isOwn) {
          isOwnList.push(this.featureAuth[i].featureUuid);
        }
      }
      let data = {
        roleName: this.roleName, // 角色名称
        invalidTime: this.time === "forever" ? "long" : this.invalidTime, // 到期时间，当类型为短期时传时间字符串，永久时传枚举值
        description: this.description, // 角色描述
        enable: this.enable === "enable" ? 1 : 0, // 0禁用、1启用
        // featureAuthUuids: featureAuthUuids,
        isShowList,
        isOwnList,
        // 关联的功能模块
        resourceAuthUuids: resourceAuth, // 关联的通道资源
        accountUuids: this.shouquanSelectedArr.map(i => {
          return i.accountUuid;
        })
      };
      if (this.roleUuid) {
        data.roleUuid = this.roleUuid;
      }
      return data;
    },
    submit(isBackTableList) {
      // 通过判断roleUuid是否为空，来判断是新增还是修改
      let data = this.rebaseData();
      this.isloading = true;
      if (!this.roleUuid) {
        api
          .addRoleDetailUrl(data)
          .then(res => {
            this.isloading = false;
            if (res.data.success) {
              console.log("isBackTableList===", isBackTableList);
              this.$message.success("添加成功!");
              if (isBackTableList) {
                this.resetAddDialog();
              } else {
                this.$emit("close", true);
              }
            }
          })
          .catch(() => {
            this.isloading = false;
          });
      } else {
        api
          .editRoleDetailUrl(data)
          .then(res => {
            this.isloading = false;
            if (res.data.success) {
              // console.log("isBackTableList===", isBackTableList)
              this.$emit("close", true);
              this.$message.success("保存成功！");
              // this.clsoe();
              // if (isBackTableList) {
              //   this.resetAddDialog();
              // } else {
              //   this.clsoe();
              // }
            }
          })
          .catch(() => {
            this.isloading = false;
          });
      }
    },
    clsoe() {
      this.$emit("update:visible", false);
    },
    getData() {
      // 根据roleUuid来获取数据
      api.getRoleDetail({ roleUuid: this.roleUuid }).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.roleName = data.roleName;
          this.enable = parseInt(data.enable) === 1 ? "enable" : "disable";
          if (!data.invalidTime || data.invalidTime === "long") {
            this.time = "forever";
          } else {
            this.time = "shorttime";
            this.invalidTime = data.invalidTime;
          }
          this.description = data.description;
          this.account = data.account || [];
          this.featureAuth = data.featureAuthUuidsList || [];
          let resourceAuth = [];
          if (data.resourceAuth) {
            resourceAuth = data.resourceAuth.map(o => {
              let temp = {
                resType: o.resourceType,
                realType: o.channelType,
                id: o.resourceUuid,
                label: o.resourceName,
                extInfo: [
                  {
                    aimType: "chnSubType"
                  }
                ],
                checkedAuthUuids: o.resourceAuthUuids
              };
              Object.assign(temp, o);
              return temp;
            });
          }
          this.resourceAuth = resourceAuth;
          this.shouquanSelectedArr = data.account || [];
        }
      });
    }
  },
  watch: {
    visible(val) {
      //
      if (val) {
        // 展示编辑框 1.有roleUuid则获取详情接口
        this.resetAddDialog();
        if (this.roleUuid) {
          this.getData();
        }
      }
    }
  }
};
</script>

<style lang="scss" >
@import "@/style/variables.scss";
.roleEditWrap {
	padding: 20px 0px;
	box-sizing: border-box;
	background: #212325;
	border-radius: 2px 2px 2px 2px 0 0;
	border-radius: 2px 2px 2px 2px 0px 0px;
	overflow: auto;
	.bilibili {
		margin-right: 10px;
	}
	.k-form {
		display: flex;
		margin: 5px 0px;
		.label,
		label {
			flex: 1;
			text-align: right;
			padding-right: 20px;
			font-family: "PingFangSC-Regular";
			font-size: 12px;
			color: #dddddd;
			line-height: 30px;
			.adasaaaaF {
				float: left;
				padding-left: 50px;
				img {
					vertical-align: middle;
					margin: 0px 20px;
				}
			}
		}
		.aa {
			flex: 2;
			margin-bottom: 20px;
			.inpaaa {
				width: 250px;
				textarea {
					background: #212325;
				}
			}
		}
	}
	.headera {
		padding-left: 30px;
		.buttongroup {
			float: right;
			margin-right: 30px;
			margin-top: 5px;
			.button {
				width: 66px;
				@include button30;
			}
		}
		.shuline {
			position: relative;
			font-family: "PingFangSC-Regular";
			font-size: 14px;
			color: #ffffff;
			line-height: 50px;
			padding-left: 5px;
			&::after {
				content: "";
				position: absolute;
				left: 0px;
				top: 50%;
				transform: translateY(-50%);
				display: block;
				width: 3px;
				height: 14px;
				background: $add-text-color;
			}
		}
	}
}
</style>
