<template>
	<div class="dialogBoxClass" v-show="addResidentDialogVisible">
		<div class="dialogHeaderClass">
			<el-row type="flex" justify="space-between">
				<el-col style="text-align:left" :span="4">
					<div class="header_left_txt">{{titleTxt}}</div>
				</el-col>
				<el-col class="header_right_box" :span="20">
					<el-button v-if="titleTxt === '新增居民'" @click="confirm(false)" type="primary">保存并新增</el-button>
					<el-button @click="confirm(true)" type="primary">确认</el-button>
					<el-button @click="close" type="primary">取消</el-button>
				</el-col>
			</el-row>
		</div>
		<!----------------------------------------------------------------------->
		<div class="body">
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3">
						<div>
							<img class="img" src="../../../assets/images/resident/baseMsg.png" alt srcset />
							<span>基本信息</span>
						</div>
					</el-col>
					<el-col style="text-align:right;" :span="4">
						<div>
							<el-upload
								class="uploadClass"
								:action="updateFileImage"
								:show-file-list="false"
								accept="image/jpg, image/jpeg"
								:headers="myHeaders"
								:auto-upload="true"
								:http-request="httpRequest"
							>
								<span v-if="imageUrl" class="left_tips_txt imgBox">
									<img class="img" :src="imageUrl" alt />
									<div class="deleteIconBox" @click.stop="imageUrl='';fileData=''">
										<img src="@/assets/images/doorAccess/delete_icon.png" alt />
									</div>
								</span>
								<span v-else style="display:block;padding:5px 0;">
									<span class="left_tips_txt" style="line-height:60px;display:block;">
										<img class="img" src="@/assets/images/doorAccess/add_img_icon.png" alt />本地
									</span>
									<span
										class="left_tips_txt"
										@click.stop="shootPhoto"
										style="line-height:60px;display:block;"
									>
										<img class="img" src="@/assets/images/personMange/shootPhoto.png" alt /> 拍摄
									</span>
								</span>
							</el-upload>
						</div>
					</el-col>
					<el-col :span="17">
						<p>
							<el-input v-model="name" required placeholder="姓名"></el-input>
							<span style="color:#ff5f5f;margin-left:10px;line-height:30px">*</span>
							<span
								class="cursorClass"
								@click="getIcdIdCard()"
								style="color:#26D39D;margin-left:10px;line-height:30px"
							>从身份证阅读器读取</span>
						</p>
						<p>
							<el-radio-group v-model="radioGender">
								<el-radio label="male">男</el-radio>
								<el-radio label="female">女</el-radio>
							</el-radio-group>
						</p>
						<p>
							<el-input v-model="phoneNumber" placeholder="手机号"></el-input>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>选择房间号：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<multi-popover-tree
								treeType="residentTree"
								placeholderTxt="房间号允许多选"
								:initData="initData"
								:topCheckedNodeTitle="topCheckedNodeTitle"
								:houseName="houseName"
								@transferData="transferCheckedData"
								:checkedNodes="checkeTreedNodes"
							></multi-popover-tree>
							<span style="color:#ff5f5f;margin-left:10px;line-height:30px">*</span>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>证件类型：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-select v-model="certificateOption" placeholder="请选择证件类型">
								<el-option
									v-for="item in certificateOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>证件号码：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-input v-model="credentialNo" placeholder="证件号码"></el-input>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>标签：</p>
					</el-col>
					<el-col :span="17">
						<tag-view
							style="display:inline;margin-left: -14px;"
							:tags="dynamicTags"
							@handleClose="handleClose"
						></tag-view>
						<p style="display: inline-block">
							<img
								style="vertical-align:middle;margin-left:10px;margin-right:7px;"
								src="@/assets/images/personMange/addCard.png"
								alt
								srcset
							/>
							<span class="themeFont cursorClass" @click="isShow=!isShow">修改标签</span>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>人员类型：</p>
					</el-col>
					<el-col :span="13">
						<p>
							<el-select v-model="staffOption" placeholder="请选择人员类型">
								<el-option
									v-for="item in staffOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
							<span style="color:#ff5f5f;margin-left:10px;line-height:30px">*</span>
						</p>
					</el-col>
					<el-col class="themeFont" style="text-align:center;" :span="4">
						<p class="themeFont cursorClass" @click="firstShow =!firstShow">
							{{firstShow?'展开':'收起'}}
							<i :class="firstShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
						</p>
					</el-col>
				</el-row>
			</div>
			<div v-show="!firstShow" class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>民族：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-select v-model="nationOption" placeholder="请选择民族">
								<el-option
									v-for="item in nationOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>文化程度：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-select v-model="educationOption" placeholder="请选择学历">
								<el-option
									v-for="item in educationOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>婚姻状况：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-select v-model="maritalOption" placeholder="请选择婚姻状况">
								<el-option
									v-for="item in maritalOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>国籍：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-select v-model="countryOption" placeholder="请选择国籍">
								<el-option
									v-for="item in countryOptions"
									:key="item.typeStr"
									:label="item.typeName"
									:value="item.typeStr"
								></el-option>
							</el-select>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>籍贯：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-input v-model="nativePlace" placeholder="籍贯"></el-input>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>户籍：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-input v-model="address" placeholder="户籍"></el-input>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col :span="3"></el-col>
					<el-col style="text-align:right;" :span="4">
						<p>备注：</p>
					</el-col>
					<el-col :span="17">
						<p>
							<el-input v-model="remarks" placeholder="备注"></el-input>
						</p>
					</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="3">
						<div>
							<img class="img" src="../../../assets/images/resident/access_auth_icon.png" alt srcset />
							<span>通行权限</span>
						</div>
					</el-col>
					<el-col class="body_box_left_txt" style="text-align:right;" :span="4">
						<p>门禁权限组：</p>
					</el-col>
					<el-col :span="13">
						<p style="margin:0">
							<multi-popover-tree
								treeType="doorAccessAuth"
								placeholderTxt="请选择权限组"
								@transferCheckedBoxData="getTrafficAuthList"
								:checkedNodes="trafficAuthList"
							></multi-popover-tree>
						</p>
						<tag-view
							style="display:inline;margin-left: -14px;"
							:tags="dynamicAuthTags"
							@handleClose="handleAuthTagClose"
						></tag-view>
					</el-col>
					<el-col class="themeFont body_box_left_txt" style="text-align:center;" :span="4">
						<p style="visibility:hidden" class="themeFont cursorClass" @click="secondShow =!secondShow">
							{{!secondShow?'展开':'收起'}}
							<i :class="firstShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
						</p>
						<p class="themeFont cursorClass" @click="secondShow =!secondShow">
							{{secondShow?'展开':'收起'}}
							<i :class="secondShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
						</p>
					</el-col>
				</el-row>
				<div v-show="!secondShow">
					<el-row type="flex" justify="flex-start" :gutter="20">
						<el-col :span="3"></el-col>
						<el-col class="body_box_left_txt" style="text-align:right;" :span="4">
							<p>有效期：</p>
						</el-col>
						<el-col :span="17">
							<p style="height:40px;margin:0">
								<el-radio-group v-model="radioDate">
									<el-radio label="1">长期</el-radio>
									<el-radio label="0">短期</el-radio>
								</el-radio-group>
							</p>
							<div v-show="radioDate!=='1'">
								<el-date-picker
									v-model="startTime"
									type="date"
									class="time-interal-date"
									placeholder="选择日期"
									value-format="yyyy-MM-dd"
								></el-date-picker>
								<span class="time-line"></span>
								<el-date-picker
									v-model="endTime"
									type="date"
									class="time-interal-date"
									placeholder="选择日期"
									value-format="yyyy-MM-dd"
								></el-date-picker>
							</div>
						</el-col>
					</el-row>
					<el-row type="flex" justify="flex-start" :gutter="20">
						<el-col :span="3"></el-col>
						<el-col style="text-align:right;" :span="4">
							<p>延迟时间：</p>
						</el-col>
						<el-col :span="17">
							<p>
								<el-input v-model="openDelayTime" style="width:10%;margin-right:5px"></el-input>秒
								<span style="margin-left:25px">
									<span style="color:#ff5f5f">注：</span>为行动不便的人员增加通过门禁的时间
								</span>
							</p>
						</el-col>
					</el-row>
					<el-row type="flex" justify="flex-start" :gutter="20">
						<el-col :span="3"></el-col>
						<el-col style="text-align:right;" :span="4">
							<p>访客权限：</p>
						</el-col>
						<el-col :span="17">
							<p>
								<multi-popover-tree
									treeType="visitorAuth"
									placeholderTxt="请选择访客权限"
									@transferCheckedBoxData="getVisitorAuthList"
								></multi-popover-tree>
							</p>
							<tag-view
								style="display:inline;margin-left: -14px;"
								:tags="dynamicVistorAuthTags"
								@handleClose="handleVistorAuthTagClose"
							></tag-view>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="3">
						<div>
							<img class="img" src="../../../assets/images/resident/access_card.png" alt srcset />
							<span>通行凭证</span>
						</div>
					</el-col>
					<el-col class="body_box_left_txt" style="text-align:right;" :span="4">
						<p>卡片：</p>
					</el-col>
					<el-col :span="17">
						<div>
							<span>
								<img
									style="vertical-align:middle;margin-left:10px;margin-right:7px;"
									src="@/assets/images/personMange/addCard.png"
									alt
									srcset
								/>
								<span class="themeFont cursorClass" @click="addCardDialogAct">新增卡片</span>
								<span style="color:rgba(255,255,255,0.1);margin:0 10px;">|</span>
								<span class="themeFont cursorClass">发卡器配置</span>
							</span>
						</div>
						<div class="card_icon_class">
							<p v-for="(item, index) in cardList" :key="index">
								<span>
									<span class="card-span">{{item.cardName}}</span>
									<span class="card-span">卡号：{{item.cardId}}</span>
									<span class="card-span">{{item.cardEnable?'已启用':'已停用'}}</span>
									<span class="card-span">{{item.addCardFuncName || '未知'}}</span>
								</span>
								<span>
									<span @click="editCardAct(index,item)" style="color:#26D39D;padding:0 12px">编辑</span>
									<span @click="deleteCardAct(index,item)" style="color:#ff5f5f">删除</span>
								</span>
							</p>
						</div>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="3"></el-col>
					<el-col class style="text-align:right;" :span="4">
						<p>指纹：</p>
					</el-col>
					<el-col :span="17">
						<div>
							<p>
								<img
									style="vertical-align:middle;margin-left:10px;margin-right:7px;"
									src="@/assets/images/personMange/addCard.png"
									alt
									srcset
								/>
								<span class="themeFont cursorClass">新增指纹</span>
							</p>
						</div>
						<!-- <div class="card_icon_class">
							<p v-for="(item, index) in cardList" :key="index">
								<span>
									<span class="card-span">{{item.cardName}}</span>
									<span class="card-span">卡号：{{item.cardId}}</span>
									<span class="card-span">{{item.cardEnable?'已启用':'已停用'}}</span>
									<span class="card-span">{{item.addCardFuncName || '未知'}}</span>
								</span>
								<span>
									<span @click="editCardAct(index,item)" style="color:#26D39D;padding:0 12px">编辑</span>
									<span @click="deleteCardAct(index,item)" style="color:#ff5f5f">删除</span>
								</span>
							</p>
						</div>-->
					</el-col>
				</el-row>
			</div>
			<div v-if="titleTxt !== '新增居民'">
				<div class="finger_icon_class" v-for="(item, index) in 1" :key="index">
					<p>
						<span>
							<span>信息来源：</span>
						</span>
						<span>
							<span>{{defaultResident.source==='platform'?'平台录入':defaultResident.source}}</span>
						</span>
					</p>
				</div>
			</div>
		</div>
		<!-- ----------------->
		<div class="dialogHeaderClass">
			<el-row type="flex" justify="space-between">
				<el-col style="text-align:left" :span="4">
					<!-- <div class="header_left_txt">新增居民</div> -->
				</el-col>
				<el-col class="header_right_box" :span="20">
					<el-button
						:loading="isloading"
						v-if="titleTxt === '新增居民'"
						@click="confirm(false)"
						type="primary"
					>保存并新增</el-button>
					<el-button :loading="isloading" @click="confirm(true)" type="primary">确认</el-button>
					<el-button @click="close" type="primary">取消</el-button>
				</el-col>
			</el-row>
		</div>
		<person-tree-tag
			title="选择居民所属标签"
			rightTxt="已选择居民所属标签"
			:isShow="isShow"
			:treeType="treeType"
			:isTag="true"
			:checkedNodeArr="checkedNode"
			@onCancel="onCancel"
			@onConfirm="onConfirm"
		></person-tree-tag>
		<el-dialog
			title="拍照"
			center
			:visible.sync="shootPhotoDialogVisible"
			:width="`${canvWidth ? canvWidth + 50 : '1300'}px`"
			:before-close="handleClosePhoto"
		>
			<video
				v-show="!shootPhotoShow"
				id="video"
				:height="`${canvHeight ? canvHeight : '800'}px`"
				ref="video"
			></video>
			<img v-show="shootPhotoShow" id="img" src />
			<span slot="footer" style="padding:15px">
				<el-button type="primary" @click="shootAct">拍摄</el-button>
				<el-button type="primary" @click="handleClosePhoto">取消</el-button>
			</span>
		</el-dialog>
		<add-card-dialog
			:addCardDialog.sync="addCardDialogVisible"
			:checkedCard="currentCard"
			:cardList="cardList"
			@transferCard="transferCard"
		></add-card-dialog>
	</div>
</template>

<script>
import icons from "@/common/js/icon.js";
import tagView from "@/common/Tag.vue";
import tabTreeTag from "@/common/TabTreeTag.vue";
import personTreeTag from "@/common/personTreeTag";
import MultiPopoverTree from "@/common/MultiPopoverTree.vue";
import addCardDialog from "./addCardDialog.vue";
import RestApi from "@/utils/RestApi.js";
export default {
  components: {
    tagView,
    tabTreeTag,
    MultiPopoverTree,
    personTreeTag,
    addCardDialog
  },
  props: {
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "添加设备";
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
    addResidentDialogVisible: {
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
    },
    titleTxt: {
      type: String,
      default: "新增居民"
    },
    topCheckedNodeTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      houseName: "",
      initData: [],
      currentCard: null,
      cardList: [],
      addCardDialogVisible: false,
      shootPhotoShow: false,
      shootPhotoDialogVisible: false,
      remarks: "",
      firstShow: true,
      secondShow: true,
      countryOptions: window.config.options,
      countryOption: "",
      maritalOptions: window.config.options,
      maritalOption: "",
      nationOption: "",
      nationOptions: window.config.options,
      educationOptions: window.config.options,
      educationOption: "",
      checkedNodeName: "",
      checkedNode: [],
      treeType: "resident",
      inputWidth: "30%",
      visible_popver: false,
      checkeTreedNodes: [],
      dynamicTags: [],
      myHeaders: {},
      updateFileImage: "",
      icons,
      dialogVisible: false,
      radioGender: "male",
      phoneNumber: "",
      name: "",
      radioDate: "1",
      startTime: null,
      endTime: null,
      ResidentPopoverClass: "ResidentPopoverClass",
      treeData: window.config.treeData,
      defaultProps: {
        label: "label",
        children: "children"
      },
      filterText: "",
      certificateOptions: window.config.options,
      certificateOption: "",
      imageUrl: null,
      fileData: null,
      staffOptions: [],
      staffOption: null,
      isShow: false,
      openDelayTime: "",
      credentialNo: "",
      visitorAuthList: [],
      addressOrgList: [],
      trafficAuthList: [],
      nativePlace: "",
      fingerprintList: [],
      address: "",
      canvas: null,
      video: null,
      img: null,
      dynamicAuthTags: [],
      dynamicVistorAuthTags: [],
      tagUuids: [],
      vendorUrl: window.URL || window.webkitURL,
      currentCardIndex: 0,
      birthday: "",
      icdSocket: null,
      icdPhotofileData: "",
      isloading: false,
      canvWidth: "",
      canvHeight: "",
      mediaStreamTrack: null
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
    this.certificateOptions = this.$common.getEnumByGroupStr("cred");
    this.educationOptions = this.$common.getEnumByGroupStr("edu");
    this.countryOptions = this.$common.getEnumByGroupStr("nationality");
    this.nationOptions = this.$common.getEnumByGroupStr("nation");
    this.maritalOptions = this.$common.getEnumByGroupStr("marital");
  },
  methods: {
    /**
		 * "idNumber": "string",   //身份证号
		 * "idIssued": "string",   //签证机关
		 * "issuedDate": "string", //签发日期 格式：yyyy-MM-dd
		 * "validDate": "string",  //有效截止日期 格式：yyyy-MM-dd
		 * "photoData": "string",  //身份证图片 base64编码
		 * "cardPhotoF": "string", //身份证真面图片 base64编码
		 * "cardPhotoB": "string", //身份证反面图片 base64编码
		 * "fpData": "string"      //指纹数据 base64编码
		 */
    getIcdIdCard() {
      // 发信令，读取
      this.initWebsocket();
    },
    initWebsocket() {
      let socketIp = "ws://127.0.0.1:15010/1.0/icd";
      if (this.icdSocket) {
        let data = {
          topic: "TOPIC_ICD_IDCARD_INFO",
          data: {}
        };
        this.icdSocket.send(JSON.stringify(data));
        return;
      }
      this.icdSocket = new WebSocket(socketIp);
      this.icdSocket.onmessage = msg => {
        console.log(msg);
        let itemData = JSON.parse(msg.data);
        console.log(itemData);
        if (itemData.success) {
          let data = itemData.data;
          this.name = data.name;
          this.radioGender = data.sex;
          this.nationOption = data.nation;
          this.birthday = data.birthday;
          this.address = data.address;
          this.credentialNo = data.idNumber;
          this.icdPhotofileData = "jpg:" + data.photoData;
          this.certificateOption = "id_card";
        } else {
          this.$message({ type: "error", message: "没有读取到证件信息" });
        }
      };
      this.icdSocket.onerror = msg => {
        this.icdSocket = null;
        console.log("出错了：", msg);
        this.$message({ type: "error", message: "读取串口出错了" });
      };
      this.icdSocket.onclose = msg => {
        this.icdSocket = null;
        console.log("断开了：", msg);
      };
      this.icdSocket.onopen = msg => {
        console.log("socket 已经链接");
        this.$message({ type: "success", message: "读取串口成功" });
        let data = {
          topic: "TOPIC_ICD_IDCARD_INFO",
          data: {}
        };
        this.icdSocket.send(JSON.stringify(data));
      };
    },
    // Http读取身份证信息，该方式已经被弃用
    getHttpIcdAct() {
      this.$ResidentManageAjax.getIcdIdCardApi(1).then(res => {
        console.log(res);
        if (res.data.success && res.data.data) {
          this.name = res.data.data.name;
          this.radioGender = res.data.data.sex;
          this.nationOption = res.data.data.nation;
          this.birthday = res.data.data.birthday;
          this.address = res.data.data.address;
          this.credentialNo = res.data.data.idNumber;
          this.fileData = res.data.data.photoData;
          this.certificateOption = "id_card";
        } else {
          this.$message({ type: "err", message: "没有读取到身份信息" });
        }
      });
    },
    // 新增卡片
    addCardDialogAct() {
      this.currentCard = {};
      this.currentCard.cardName = "卡" + (this.cardList.length + 1);
      this.currentCardIndex = this.cardList.length;
      this.addCardDialogVisible = !this.addCardDialogVisible;
    },
    // 编辑卡片
    editCardAct(index, item) {
      this.addCardDialogVisible = !this.addCardDialogVisible;
      this.currentCard = item;
      this.currentCardIndex = index;
      item.cardEnable = Boolean(item.cardEnable);
      console.log(this.cardList, "编辑", item);
    },
    // 删除卡片
    deleteCardAct(index, item) {
      this.cardList.splice(index, 1);
      console.log(this.cardList);
    },
    // 新增卡片的回调
    transferCard(item) {
      console.log(this.cardList, item);
      item.cardEnable = Number(item.cardEnable);
      // 深拷贝，消除源数据深度监听的影响
      var cardArr = JSON.parse(JSON.stringify(this.cardList));
      // 去掉编辑的原卡片
      if (this.currentCardIndex !== cardArr.length) {
        cardArr.splice(this.currentCardIndex, 1);
      }
      // 检查新编辑的卡片与其他卡片是否有重复
      var flag = 0;
      for (var i = 0; i < cardArr.length; i++) {
        if (
          item.cardName === cardArr[i].cardName &&
					item.cardId === cardArr[i].cardId
        ) {
          flag = 1;
          break;
        }
      }
      if (flag) {
        this.$message({ type: "warning", message: "卡片重复" });
        if (this.currentCardIndex !== cardArr.length) {
          cardArr.push(this.currentCard);
        }
      } else {
        cardArr.push(item);
        this.addCardDialogVisible = !this.addCardDialogVisible;
      }
      this.cardList = cardArr;
    },
    // 重新拍摄
    resetShootAct() {
      this.shootPhotoShow = false;
      this.video.play();
    },
    // 拍照事件
    shootAct() {
      var canvas = document.createElement("canvas");
      canvas.width = this.canvWidth;
      canvas.height = this.canvHeight;
      //    canvas.getContext("2d").drawImage(this.video, 280, 0, 1000, 720, 0, 0, 260, 260);
      canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, this.canvWidth, this.canvHeight);
      // 把canvas图像转为img图片
      this.shootPhotoShow = true;
      this.img = document.getElementById("img");
      this.img.src = canvas.toDataURL("image/jpeg");
      this.imageUrl = canvas.toDataURL("image/jpeg");
      this.fileData = this.imageUrl
        .replace("data:image/jpeg;base64,", "jpeg:")
        .replace("data:image/png;base64,", "png:")
        .replace("data:image/jpg;base64,", "jpg:");
      this.getFaceQualityDetection(this.fileData);
      this.mediaStreamTrack.stop();
      this.shootPhotoDialogVisible = false;
      // console.log(this.imageUrl);
    },
    // 调取摄像头
    shootPhoto() {
      this.canvas = document.getElementById("canvas");
      var _this = this;
      _this.shootPhotoDialogVisible = true;
      _this.shootPhotoShow = false;
      setTimeout(() => {
        _this.video = document.getElementById("video");
        // 媒体对象
        window.navigator.getMedia =
					window.navigator.getUserMedia ||
					window.navigator.webkitGetUserMedia ||
					window.navigator.mozGetUserMedia ||
					window.navigator.msGetUserMedia;
        if (window.navigator.getMedia) {
          window.navigator
            .getUserMedia({
              // video: {
              //   width: { min: 1024, ideal: 1280, max: 1920 },
              //   height: { min: 776, ideal: 720, max: 1080 }
              // },
              video: {
                width: { min: 1280 },
                height: { min: 720 }
              },
              audio: false // 不适用音频
            }, function(strem) {
              console.log(strem);
              _this.mediaStreamTrack = strem.getTracks()[0];
              try {
                _this.video.src = _this.vendorUrl.createObjectURL(strem);
              } catch (e) {
                console.log(e);
                _this.video.srcObject = strem;
              }
              _this.video.play();
              _this.video.addEventListener("loadedmetadata", function() {
                _this.canvWidth = this.videoWidth;
                _this.canvHeight = this.videoHeight;
              });
              // let track = strem.getVideoTracks()[0],
              //   imageCapture = new ImageCapture(track);
              // imageCapture.getPhotoSettings().then((photoSettings) => {
              //   _this.canvWidth = photoSettings.imageWidth;
              //   _this.canvHeight = photoSettings.imageHeight;
              //   console.log("_this.canvWidth: ", _this.canvWidth, _this.canvHeight);
              // });
            }, function(error) {
              console.log(error);
              _this.shootPhotoDialogVisible = false;
              alert("未捕捉到摄像头");
            });
        } else {
          _this.shootPhotoDialogVisible = false;
          alert("不支持摄像头");
        }
      }, 100);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onCancel(evt, evt2) {
      this.isShow = !this.isShow;
      console.log("onCancel", evt, evt2);
    },
    onConfirm(evt) {
      this.isShow = !this.isShow;
      this.dynamicTags = evt;
      this.tagUuids = [];
      this.dynamicTags.forEach(element => {
        this.tagUuids.push(element.id);
      });
      console.log("onConfirm", evt);
    },
    handleClose(arr) {
      this.dynamicTags = arr;
      this.checkedNode = this.dynamicTags;
    },
    handleAuthTagClose(arr) {
      this.dynamicAuthTags = arr;
      this.trafficAuthList = arr;
    },
    handleVistorAuthTagClose(arr) {
      this.dynamicVistorAuthTags = arr;
      this.visitorAuthList = arr;
    },
    httpRequest(e) {
      //   this.fileData = e.file;
      console.log(e.file.type);
      if (e.file.type === "image/jpg" || e.file.type === "image/jpeg") {
        var reader = new FileReader();
        reader.readAsDataURL(e.file);
        this.imageUrl = URL.createObjectURL(e.file);
        var _this = this;
        reader.onload = function(e) {
          _this.fileData = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
          _this.getFaceQualityDetection(_this.fileData);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    // 检测图片质量
    getFaceQualityDetection() {
      var data = { imageBase64: this.fileData };
      this.$ResidentManageAjax
        .getFaceQualityDetection(data)
        .then(res => {
          console.log(this.imageUrl);
          this.$message({
            type: "success",
            message: res.data.msg
          });
        })
        .catch(err => {
          console.log(err);
          this.fileData = null;
          this.imageUrl = false;
        });
    },
    close() {
      this.$emit("close");
    },
    getTrafficAuthList(data) {
      console.log("权限组", data);
      this.trafficAuthList = data;
      this.dynamicAuthTags = [];
      data.forEach(element => {
        element.id = element.groupUuid;
        element.label = element.groupName;
        this.dynamicAuthTags.push(element);
      });
    },
    getVisitorAuthList(data) {
      console.log("访客权限组", data);
      this.visitorAuthList = data;
      this.dynamicVistorAuthTags = [];
      data.forEach(element => {
        element.id = element.groupUuid;
        element.label = element.groupName;
        this.dynamicVistorAuthTags.push(element);
      });
    },
    confirm(isBool) {
      console.log(this.staffOption);
      if (this.phoneNumber && !/^1[3456789]\d{9}$/.test(this.phoneNumber)) {
        this.$message({
          type: "warning",
          message: "手机号有误"
        });
        return false;
      }
      if (!this.addressOrgList.length) {
        this.$message({
          type: "warning",
          message: "请选择房间号"
        });
        return;
      }
      if (!this.name) {
        this.$message({
          type: "warning",
          message: "请填写姓名"
        });
        return;
      }
      if (!this.staffOption) {
        this.$message({
          type: "warning",
          message: "请填写人员类型"
        });
        return;
      }
      // 短期权限组 时间端校验
      if (this.radioDate === "0") {
        if (!this.startTime) {
          this.$message({
            type: "warning",
            message: "请选择短期权限的起始时间"
          });
          return;
        }
        if (!this.endTime) {
          this.$message({
            type: "warning",
            message: "请选择短期权限的截止时间"
          });
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
      }
      if (isBool) {
        this.$emit("close");
      }
      var xhr = {
        version: this.defaultResident.version,
        staffUuid: this.defaultResident.staffUuid,
        address: this.address,
        addressOrgList: this.addressOrgList,
        cardList: this.cardList,
        cellphone: this.phoneNumber,
        credential: this.certificateOption,
        credentialNo: this.credentialNo,
        education: this.educationOption,
        email: "",
        fingerprintList: [],
        fixedLine: "",
        gender: this.radioGender,
        lifePictureBase64: this.fileData,
        lifePictureUrl: this.imageUrl, // this.fileData
        longTerm: this.radioDate,
        maritalStatus: this.maritalOption,
        nation: this.nationOption,
        nationality: this.countryOption,
        nativePlace: this.nativePlace,
        openDelayTime: this.openDelayTime,
        remarks: this.remarks,
        staffName: this.name,
        staffType: this.staffOption,
        trafficAuthList: this.trafficAuthList,
        visitorAuthList: this.visitorAuthList,
        tagUuids: this.tagUuids,
        idCardPictureBase64: this.icdPhotofileData
      };
      if (this.startTime && this.startTime.length > 10) {
        xhr.beginTime = this.startTime ? this.startTime : null;
      } else {
        xhr.beginTime = this.startTime ? this.startTime + " 00:00:00" : null;
      }
      if (this.endTime && this.endTime.length > 10) {
        xhr.endTime = this.endTime ? this.endTime : null;
      } else {
        xhr.endTime = this.endTime ? this.endTime + " 23:59:59" : null;
      }
      this.isloading = true;
      this.$emit("transferResidentData", xhr);
      this.isloading = false;
      this.clearView();
      this.checkeTreedNodes = [];
    },
    clearView() {
      this.address = "";
      this.addressOrgList = [];
      this.startTime = null;
      this.cardList = [];
      this.phoneNumber = "";
      this.certificateOption = "";
      this.credentialNo = "";
      this.educationOption = "";
      this.email = "";
      this.endTime = null;
      this.fingerprintList = [];
      this.radioGender = "male";
      this.imageUrl = ""; // this.fileData
      this.radioDate = "1";
      this.maritalOption = "";
      this.nationOption = "";
      this.countryOption = "";
      this.nativePlace = "";
      this.openDelayTime = "";
      this.remarks = "";
      this.name = "";
      this.staffOptions = this.$common.getEnumByGroupStr("staff_t");
      this.staffOption = this.staffOptions[0].typeStr;
      this.trafficAuthList = [];
      this.visitorAuthList = [];
      this.tagUuids = [];
      this.fileData = null;
      this.dynamicAuthTags = [];
      this.dynamicVistorAuthTags = [];
      this.icdPhotofileData = null;
      this.houseName = "";
    },
    transferCheckedData(data) {
      console.log("获取到选中的节点：", data);
      this.addressOrgList = data;
    },
    handleClosePhoto() {
      this.mediaStreamTrack.stop();
      this.shootPhotoDialogVisible = false;
    }
  },
  watch: {
    addResidentDialogVisible(val) {
      this.checkeTreedNodes = [];
    },
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.dialogVisible = this.visible;
      this.dynamicTags = [];
    },
    defaultResident: {
      handler(val, oldVal) {
        console.log(val);
        this.address = val.address;
        this.checkeTreedNodes = [];
        this.addressOrgList = [];
        this.initData = [];
        if (val.checkedTreeNode) {
          this.initData.push(val.checkedTreeNode);
          // this.checkeTreedNodes.push(val.checkedTreeNode);
          // this.addressOrgList.push(val.checkedTreeNode.id);
        }
        this.dynamicAuthTags = [];
        this.dynamicTags = [];
        this.houseName = "";
        if (val.addressOrgList && val.addressOrgList.length) {
          let aName = [];
          val.addressOrgList.forEach(element => {
            element.id = element.infrastructureUuid;
            element.label = element.infrastructureName;
            aName.push(element.label);
            this.addressOrgList.push(element.infrastructureUuid);
          });
          this.houseName = aName.join(",");
          this.checkeTreedNodes = val.addressOrgList;
        }
        this.startTime = val.beginTime === "" ? null : val.beginTime;
        this.endTime = val.endTime === "" ? null : val.endTime;
        this.cardList = [];
        if (val.cardList) {
          val.cardList.forEach(item => {
            item.addCardFuncName = this.$common.transferEnumItemName(
              this.$store.getters.GET_CARDOPTIONS,
              item.function
            );
            this.cardList.push(item);
          });
          console.log(this.cardList);
        }
        this.phoneNumber = val.cellphone;
        this.certificateOption = val.credential;
        this.credentialNo = val.credentialNo;
        this.educationOption = val.education;
        this.email = val.email;
        this.endTime = val.endTime === "" ? null : val.endTime;
        this.fingerprintList = val.fingerprintList;
        this.radioGender = val.gender || "male";
        this.imageUrl = val.lifePictureUrl
          ? RestApi.api.imageUrl + val.lifePictureUrl
          : val.lifePictureUrl; // this.fileData
        this.radioDate = val.longTerm === false ? "0" : "1";
        this.maritalOption = val.maritalStatus;
        this.nationOption = val.nation;
        this.countryOption = val.nationality;
        this.nativePlace = val.nativePlace;
        this.openDelayTime = val.openDelayTime;
        this.remarks = val.remarks;
        this.name = val.staffName;
        this.staffOptions = this.$common.getEnumByGroupStr("staff_t");
        this.staffOption = this.staffOptions[0].typeStr;
        this.staffOption = val.staffType ? val.staffType : this.staffOption;
        this.trafficAuthList = [];
        if (val.trafficAuthList && val.trafficAuthList.length) {
          val.trafficAuthList.forEach(element => {
            element.id = element.groupUuid;
            element.label = element.groupName;
            this.trafficAuthList.push(element);
            this.dynamicAuthTags.push(element);
          });
        }
        this.visitorAuthList = [];
        this.dynamicVistorAuthTags = [];
        if (val.visitorAuthList && val.visitorAuthList.length) {
          val.visitorAuthList.forEach(element => {
            element.id = element.groupUuid;
            element.label = element.groupName;
            this.visitorAuthList.push(element);
            this.dynamicVistorAuthTags.push(element);
          });
        }
        this.dynamicTags = [];
        if (val.tagInofs && val.tagInofs.length) {
          val.tagInofs.forEach(item => {
            item.id = item.tagUuid;
            item.label = item.tagName;
            this.dynamicTags.push(item);
          });
        }
        this.checkedNode = this.dynamicTags;
      },
      deep: true,
      immediate: true
    },
    checkedNode: {
      handler(val, oldVal) {
        this.tagUuids = [];
        val.forEach(element => {
          this.tagUuids.push(element.id);
        });
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.dialogBoxClass {
	width: 1000px;
	height: 100%;
	overflow-y: auto;
	background: #212325;
}
/* .dialogBoxClass #video {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.01);
} */
.dialogBoxClass .el-dialog--center .el-dialog__body {
	text-align: center;
}
.dialogBoxClass .el-dialog {
	margin-top: 1vh !important;
}
.dialogBoxClass .el-input__icon {
	line-height: 30px;
	/* color: #26d39d; */
}
.dialogHeaderClass {
	width: 100%;
	padding: 25px 40px 24px;
	box-sizing: border-box;
}
.dialogBoxClass .dialogHeaderClass .header_left_txt {
	border-left: 2px solid #26d39d;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	padding-left: 10px;
}
.dialogBoxClass .header_right_box {
	text-align: right;
	margin-top: -10px;
}
.dialogBoxClass .header_right_box button {
	height: 32px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: justify;
	padding: 7px 17px;
}

.dialogBoxClass .uploadClass {
	display: inline-block;
	width: 75%;
	position: relative;
	height: 135px;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
	/* height: 100%; */
}
.dialogBoxClass .left_tips_txt {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #26d39d;
}
.dialogBoxClass .imgBox {
	width: 100%;
	height: 100%;
}
.dialogBoxClass .themeFont {
	color: #26d39d !important;
	font-family: "PingFangSC-Regular" !important;
	font-size: 12px !important;
}
.dialogBoxClass .imgBox .img {
	width: 100%;
	height: 100%;
	background-origin: border-box;
	background-clip: border-box;
	background-size: 100%;
}
.dialogBoxClass .el-upload {
	display: inline-block;
	text-align: center;
	width: 100%;
	height: 100%;
	cursor: pointer;
	outline: none;
}
.dialogBoxClass .card-span {
	margin-right: 6px;
}
.dialogBoxClass .el-select {
	display: inline-block;
	position: relative;
	width: 140px;
}
.dialogBoxClass .el-select .el-input {
	width: 100% !important;
}
.dialogBoxClass .el-select .el-select-dropdown__list {
	width: 100%;
}
.dialogBoxClass .body_box .el-input {
	display: inline-block;
	width: 215px;
	/* width: 30%; */
	height: 30px;
	font-size: 12px;
}
.dialogBoxClass .el-input .el-input__inner {
	height: 30px;
	padding-right: 15px;
	font-size: 12px;
}
.dialogBoxClass input::-webkit-input-placeholder {
	font-size: 12px;
}
.dialogBoxClass .body_box {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 15px 0px 20px;
	color: #bbbbbb;
}
.dialogBoxClass .el-dialog__wrapper {
	overflow: auto;
}
.dialogBoxClass .time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.dialogBoxClass .img {
	vertical-align: baseline;
}
.dialogBoxClass .el-dialog__footer {
	padding-bottom: 15px;
	margin-top: -15px;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
	padding: 10px 46px 30px;
	box-sizing: border-box;
}
.body {
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
		.body_box_left_txt {
			p {
				margin: 0;
			}
		}
		p {
			margin: 15px 0 0;
			font-family: "PingFangSC-Regular";
			font-size: 13px;
			color: #dddddd;
			// text-align: right;
			line-height: 30px;
		}
	}
	.card_icon_class {
		text-align: left;
		p {
			background: rgba(255, 255, 255, 0.03);
			border-radius: 2px;
			border-radius: 2px;
			font-family: "PingFangSC-Regular";
			font-size: 12px;
			color: #bbbbbb;
			line-height: 35px;
			// margin: 0 20%;
			padding: 0 20px;
			width: 60%;
			text-align: center;
			display: flex;
			justify-content: space-between;
		}
	}
	.finger_icon_class {
		padding-left: 30px;
		font-family: "PingFangSC-Regular";
		font-size: 12px;
		color: #dddddd;
		// text-align: right;
	}
	.deleteIconBox {
		width: 22px;
		height: 22px;
		border-radius: 11px;
		position: absolute;
		right: 3px;
		top: 3px;
		background-color: rgba(17, 17, 17, 0.5);
		img {
			width: 10px;
			height: 10px;
			margin: 6px;
		}
	}

	.el-select {
		.el-input {
			width: 100% !important;
		}
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
