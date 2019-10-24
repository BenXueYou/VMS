 <template>
	<el-dialog
		class="staffDetailDialog"
		:title="'员工详情'"
		:visible.sync="detailDialog"
		@close="closeDialog"
		width="580px"
	>
		<div class="detailWrap">
			<div class="linkInfo" style="height: 160px;">
				<div class="inforWrap">
					<div class="left">姓名：</div>
					<div class="right">{{this.viewStaffName}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">性别：</div>
					<div class="right">{{this.viewSexVal}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">民族：</div>
					<div class="right">{{this.viewNation}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">证件号：</div>
					<div class="right">{{this.viewIdNumber}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">别名：</div>
					<div class="right">{{this.viewNickName}}</div>
				</div>
				<div class="leftImage">
					<img :src="viewFontPhoto? viewFontPhoto : require('@/assets/images/user.png')" />
				</div>
			</div>
			<div class="linkInfo">
				<div class="inforWrap">
					<div class="left">手机：</div>
					<div class="right">{{this.viewPhoneNum}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">座机：</div>
					<div class="right">{{this.viewTelephone}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">电子邮件：</div>
					<div class="right">{{this.viewEmail}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">文化程度：</div>
					<div class="right">{{this.viewDegree}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">婚姻状况：</div>
					<div class="right">{{this.viewMaritalStatus}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">国籍：</div>
					<div class="right">{{this.viewNationality}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">籍贯：</div>
					<div class="right">{{this.viewNativePlace}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">户籍：</div>
					<div class="right">{{this.viewAdress}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">备注：</div>
					<div class="right">{{this.viewRemarks}}</div>
				</div>
			</div>
			<div class="jobInfo">
				<div class="inforWrap">
					<div class="left">部门：</div>
					<div class="right">
						<span
							v-for="(item,index) in viewOrgUuid"
							:key="index"
							style="margin-right: 5px;"
						>{{item.orgName}}</span>
					</div>
				</div>
				<div class="inforWrap">
					<div class="left">标签：</div>
					<div class="right">
						<span v-for="(item,index) in viewTagUuids" :key="index" style="margin-right: 5px;">
							<img class="img1" src="@/assets/images/personMange/equipment.png" />
							{{item.tagName}}
						</span>
					</div>
				</div>
				<div class="inforWrap">
					<div class="left">职务：</div>
					<div class="right">{{this.viewDuty}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">身份：</div>
					<div class="right">{{this.viewIdentity}}</div>
				</div>
				<div class="inforWrap">
					<div class="left">负责部门：</div>
					<div class="right">
						<span
							style="margin-right: 5px;"
							v-for="(item,index) in viewApartment"
							:key="index"
						>{{item.orgName}}</span>
					</div>
				</div>
			</div>
			<div class="accessInfo">
				<div class="inforWrap">
					<div class="left">卡：</div>
					<div class="right">
						<span class="sp1" v-for="(item,index) in viewCardList" :key="index">
							<img class="img1" src="@/assets/images/personMange/card.png" />
							{{item.cardId}}
						</span>
					</div>
				</div>
				<div class="inforWrap">
					<div class="left">指纹：</div>
					<div class="right">
						<span class="sp1">
							<img class="img1" src="@/assets/images/personMange/fingerprint1.png" />
						</span>
					</div>
				</div>
				<div class="inforWrap colm1Wrap" id="trafficAuthList">
					<div class="left">通行权限组：</div>
					<div class="right colm1">
						<span v-for="(item,index) in viewTrafficAuthList" :key="index">{{item.groupName}}</span>
					</div>
				</div>
				<div class="inforWrap colm1Wrap">
					<div class="left">访客权限组：</div>
					<div class="right colm1">
						<span v-for="(item,index) in viewVisitorAuthList" :key="index">{{item.groupName}}</span>
					</div>
				</div>
				<div class="inforWrap" style="margin-top: 20px;">
					<div class="left">延长时间：</div>
					<div class="right">{{this.viewDelayTime}}s</div>
				</div>
				<div class="inforWrap">
					<div class="left">有效期：</div>
					<div class="right">
						<span v-if="viewTimeRange">长期有效</span>
						<span v-if="!viewTimeRange">{{this.viewBeginTime}} - {{this.viewEndTime}}</span>
					</div>
				</div>
			</div>
			<div class="closeBthWrap">
				<el-button style="width: 66px;" @click="detailDialog=false">关闭</el-button>
			</div>
		</div>
	</el-dialog>
</template>
<script>
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
      projectUuid: this.$store.state.home.projectUuid,
      detailDialog: false,
      api: window.config.protocolHeader + window.config.ip,
      token: window.config.token,
      viewLalelMember: "",
      viewLalelApartment: "",
      viewBeginTime: "",
      viewEndTime: "",
      viewStaffName: "",
      viewSexVal: "",
      viewNation: "",
      viewIdNumber: "",
      viewNickName: "",
      viewMaritalStatus: "",
      viewRemarks: "",
      viewPhoneNum: "",
      viewTelephone: "",
      viewEmail: "",
      viewDegree: "",
      viewNationality: "",
      viewNativePlace: "",
      viewAdress: "",
      viewOrgUuid: "",
      viewTagUuids: "",
      viewDuty: "",
      viewIdentity: "", // 身份
      viewApartment: "", // 负责部门
      viewCardList: "",
      viewFingerprintList: "", // 指纹信息
      viewTrafficAuthList: "", // 通行权限
      viewVisitorAuthList: "", // 访客权限组
      viewDelayTime: "",
      viewTimeRange: "", // 有效期
      imageUrl: RestApi.api.imageUrl,
      viewFontPhoto: "",
      WIamgeurl: RestApi.api.imageUrl
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
    this.checkeTreedNodes = this.dynamicTags;
  },
  methods: {
    viewSingleDetail(row) {
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
      this.$http
        .get(
          this.api +
						"/iacapp-v1/project/" +
						this.projectUuid +
						"/personnel/info/" +
						row.staffUuid
        )
        .then(res => {
          console.log("查看人员详情====", res);
          if (res.status === 200) {
            if (res.data.success) {
              if (res.data.data.lifePictureUrl) {
                this.viewFontPhoto =
									this.WIamgeurl + res.data.data.lifePictureUrl;
              } else {
                this.viewFontPhoto = "";
              }
              this.viewStaffName = res.data.data.staffName;
              this.viewSexVal = this.$common.getEnumItemName(
                "gender",
                res.data.data.gender
              );
              this.viewNation = this.$common.getEnumItemName(
                "nation",
                res.data.data.nation
              );
              this.viewIdNumber = res.data.data.credentialNo;
              this.viewPhoneNum = res.data.data.cellphone;
              this.viewTelephone = res.data.data.fixedLine;
              this.viewEmail = res.data.data.email;
              this.viewDegree = this.$common.getEnumItemName(
                "edu",
                res.data.data.education
              );
              this.viewNationality = this.$common.getEnumItemName(
                "nationality",
                res.data.data.nationality
              );
              this.viewNativePlace = res.data.data.nativePlace;
              this.viewAdress = res.data.data.address;
              this.viewOrgUuid = res.data.data.baseOrgInfos; // 部门
              this.viewTagUuids = res.data.data.tagInofShows; // 标签====
              this.viewDuty = res.data.data.jobTitle;
              if (res.data.data.isLeader === 0) {
                // 身份
                this.viewIdentity = "普通员工";
              } else {
                this.viewIdentity = "上级";
              }
              this.viewApartment = res.data.data.leaderOrg; // 负责部门
              this.viewNickName = res.data.data.nickName; // 别名
              this.viewRemarks = res.data.data.remarks;
              this.viewMaritalStatus = this.$common.getEnumItemName(
                "marital",
                res.data.data.maritalStatus
              );
              this.viewCardList = res.data.data.cardList;
              this.viewFingerprintList = res.data.data.fingerprintList;
              this.viewDelayTime = res.data.data.openDelayTime;
              this.viewTimeRange = res.data.data.longTerm; // 有效期
              this.viewTrafficAuthList = res.data.data.trafficAuthList;
              this.viewVisitorAuthList = res.data.data.visitorAuthList;
              document.getElementById("trafficAuthList").style.height =
								this.viewTrafficAuthList.length * 20 + "px";
              this.viewBeginTime = res.data.data.beginTime;
              this.viewEndTime = res.data.data.endTime;
              if (this.viewBeginTime) {
                var new111 = new Date(this.viewBeginTime);
                this.viewBeginTime =
									new111.getFullYear() +
									"-" +
									addZero(new111.getMonth() + 1) +
									"-" +
									addZero(new111.getDate());
              }
              if (this.viewEndTime) {
                var new222 = new Date(this.viewEndTime);
                this.viewEndTime =
									new222.getFullYear() +
									"-" +
									addZero(new222.getMonth() + 1) +
									"-" +
									addZero(new222.getDate());
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    closeDialog() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    confirm() {}
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
        this.viewSingleDetail(this.defaultResident);
      }
      this.detailDialog = this.visible;
    },
    defaultResident: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.staffDetailDialog .detailWrap {
	width: 580px;
	padding: 0 40px;
	box-sizing: border-box;
	overflow: auto;
	height: 70vh;
}
.staffDetailDialog .detailWrap .imageInfo {
	width: 100%;
	height: 140px;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	display: flex;
	flex-direction: row;
	align-items: center;
}
.staffDetailDialog .detailWrap .imageInfo .left {
	width: 96px;
	height: 140px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
}
.staffDetailDialog .detailWrap .imageInfo .left img {
	width: 90px;
	height: 100px;
}
.staffDetailDialog .detailWrap .imageInfo .right {
	flex: 1;
	height: 140px;
	padding: 21px 0 0 25px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #dddddd;
}
.staffDetailDialog .detailWrap .imageInfo .right div {
	margin-bottom: 8px;
}
.staffDetailDialog .detailWrap .linkInfo {
	width: 100%;
	height: 260px;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 21px 0 22px 0;
	box-sizing: border-box;
	position: relative;
}
.staffDetailDialog .detailWrap .linkInfo .leftImage {
	width: 90px;
	height: 100px;
	position: absolute;
	top: 20px;
	right: 25px;
	background: rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.staffDetailDialog .detailWrap .linkInfo .leftImage img {
	width: 76px;
	height: 86px;
}
.staffDetailDialog .detailWrap .inforWrap {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #dddddd;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 9px;
}
.staffDetailDialog .detailWrap .inforWrap .left {
	width: 96px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 2px;
	box-sizing: border-box;
}
.staffDetailDialog .detailWrap .inforWrap .right {
	flex: 1;
	padding-left: 25px;
	box-sizing: border-box;
}
.staffDetailDialog .detailWrap .jobInfo {
	width: 100%;
	height: 158px;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 20px 0;
	box-sizing: border-box;
}
.staffDetailDialog .detailWrap .accessInfo {
	width: 100%;
	padding: 20px 0 0px 0;
	box-sizing: border-box;
}
.staffDetailDialog .detailWrap .inforWrap .right .sp1 {
	width: 142px;
	margin-right: 32px;
	display: flex;
	flex-direction: row;
	align-items: center;
	float: left;
}
.staffDetailDialog .detailWrap .inforWrap .right .img1 {
	margin-right: 8px;
	width: 14px;
}
.staffDetailDialog .detailWrap .inforWrap .colm1 {
	height: 12px;
	display: flex;
	flex-direction: column;
}
.staffDetailDialog .detailWrap .inforWrap .colm1 div {
	margin-bottom: 8px;
}
.staffDetailDialog .detailWrap .colm1Wrap {
	height: 40px;
}
.staffDetailDialog .closeBthWrap {
	width: 100%;
	height: 30px;
	margin-bottom: 20px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-ms-flex-direction: row;
	flex-direction: row;
	-webkit-box-pack: end;
	-ms-flex-pack: end;
	justify-content: flex-end;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
}
</style>
