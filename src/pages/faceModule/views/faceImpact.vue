<template>
	<div class="container faceImpact" id="container">
		<!-- @click="chooseCheckDev" -->
		<div class="search">
			<div class="uploadImg">
				<div class="uploadIcon">
					<div class="alreadyUploaded" v-show="frontUploaded1" @click.stop="viewSingleDetail(1)">
						<img :src="frontPhoto1" />
						<div class="delete" @click="deleteUpload1"></div>
					</div>
					<div>
						<!-- <img src="@/assets/images/add.png" class="add-icon"> -->
						<span class="el-icon-circle-plus-outline" style="color: #20735C">&nbsp;添加图片</span>
					</div>
					<el-upload
						class="upload-multiple"
						:action="frontPhotoUrl"
						:headers="myHeaders"
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest1"
						:on-change="changeFile1"
					>
						<div></div>
					</el-upload>
				</div>
			</div>
			<div class="uploadImg" v-if="uploadImg1">
				<div class="uploadIcon">
					<div class="alreadyUploaded" v-show="frontUploaded2" @click.stop="viewSingleDetail(2)">
						<img :src="frontPhoto2" />
						<div class="delete" @click="deleteUpload2"></div>
					</div>
					<div>
						<!-- <img src="@/assets/images/add.png" class="add-icon"> -->
						<span class="el-icon-circle-plus-outline" style="color: #20735C">&nbsp;添加图片</span>
					</div>
					<el-upload
						class="upload-multiple"
						:action="frontPhotoUrl"
						:headers="myHeaders"
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest2"
						:on-change="changeFile2"
					>
						<div></div>
					</el-upload>
				</div>
			</div>
			<div class="uploadImg" v-if="uploadImg2">
				<div class="uploadIcon">
					<div class="alreadyUploaded" v-show="frontUploaded3" @click.stop="viewSingleDetail(3)">
						<img :src="frontPhoto3" />
						<div class="delete" @click="deleteUpload3"></div>
					</div>
					<div>
						<!-- <img src="@/assets/images/add.png" class="add-icon"> -->
						<span class="el-icon-circle-plus-outline" style="color: #20735C">&nbsp;添加图片</span>
					</div>
					<el-upload
						class="upload-multiple"
						:action="frontPhotoUrl"
						:headers="myHeaders"
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest3"
						:on-change="changeFile3"
					>
						<div></div>
					</el-upload>
				</div>
			</div>
			<div class="uploadImg" v-if="uploadImg3">
				<div class="uploadIcon">
					<div class="alreadyUploaded" v-show="frontUploaded4" @click.stop="viewSingleDetail(4)">
						<img :src="frontPhoto4" />
						<div class="delete" @click="deleteUpload4"></div>
					</div>
					<div>
						<!-- <img src="@/assets/images/add.png" class="add-icon"> -->
						<span class="el-icon-circle-plus-outline" style="color: #20735C">&nbsp;添加图片</span>
					</div>
					<el-upload
						class="upload-multiple"
						:action="frontPhotoUrl"
						:headers="myHeaders"
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest4"
						:on-change="changeFile4"
					>
						<div></div>
					</el-upload>
				</div>
			</div>
			<div class="uploadImg" v-if="uploadImg4">
				<div class="uploadIcon">
					<div class="alreadyUploaded" v-show="frontUploaded5" @click.stop="viewSingleDetail(5)">
						<img :src="frontPhoto5" />
						<div class="delete" @click="deleteUpload5"></div>
					</div>
					<div>
						<!-- <img src="@/assets/images/add.png" class="add-icon"> -->
						<span class="el-icon-circle-plus-outline" style="color: #20735C">&nbsp;添加图片</span>
					</div>
					<el-upload
						class="upload-multiple"
						:action="frontPhotoUrl"
						:headers="myHeaders"
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest5"
						:on-change="changeFile5"
					>
						<div></div>
					</el-upload>
				</div>
			</div>
		</div>
		<div class="condition">
			<div class="timeWrap">
				<span class="bth-title">时段：</span>
				<el-date-picker
					class="left-space"
					style="width: 200px;margin-left: 8px;"
					v-model="startTime"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
				></el-date-picker>
				<span class="timeText">至</span>
				<el-date-picker
					class="left-space"
					style="width: 200px;"
					v-model="endTime"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
				></el-date-picker>
			</div>
			<div class="conditionItem">
				<span class="bth-title">抓拍设备：</span>
				<!--     <div class="chanelListWrap">
                      <el-input v-model="chanelListName" placeholder="全部摄像机" style="width:200px;margin-left: 10px;" disabled></el-input>
				</div>-->
				<el-popover placement="bottom-start" width="530" trigger="click">
					<el-checkbox
						:indeterminate="isIndeterminate"
						v-model="checkAll"
						@change="handleCheckAllChange"
						style="margin-bottom: 10px;color: #fff;"
					>全选</el-checkbox>
					<div
						style="width: 530px;height: 350px;overflow-x: auto;overflow-y: hidden; display:flex;flex-wrap:nowrap;justify-content:flex-start;"
						id
					>
						<div class="taskParent">
							<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
								<el-checkbox
									v-for="item in cities"
									:key="item.channeluuid"
									:label="item.channeluuid"
								>{{item.channelName}}</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
					<!--  <div slot="reference" class="chanelListWrap" > -->
					<!--         <el-input v-model="chanelListName" placeholder="全部摄像机" style="width:200px;margin-left: 10px;" disabled></el-input> -->
					<el-select
						slot="reference"
						v-model="chanelList"
						multiple
						collapse-tags
						placeholder="全部摄像机"
						disabled
						style="width:200px;margin-left: 30px;"
					>
						<el-option
							v-for="item in cities"
							:key="item.channeluuid"
							:label="item.channelName"
							:value="item.channeluuid"
						></el-option>
					</el-select>
					<!--       </div> -->
				</el-popover>
				<!--  <div class="treeResult" style="height: 540px;width:240px" v-show="chooseDevide">
                      <el-scrollbar style="height: 540px;width:240px;padding-top: 10px;">
                          <el-tree
                              ref="tree2"
                              :data="treeResultData"
                              show-checkbox
                              node-key="channelName"
                              :props="defaultProps" default-expand-all :expand-on-click-node="false" class="filter-tree" :filter-node-method="filterNode">
                          </el-tree>
                      </el-scrollbar>
				</div>-->
			</div>
			<div class="conditionItem">
				<span class="bth-title">相似度不低于：</span>
				<el-input v-model="similarityValue" style="width: 100px;height: 40px;margin: 0 10px 0 12px;"></el-input>
				<span class="percent">%</span>
			</div>
			<div class="conditionItem">
				<span style="margin-right: 15px;">对比库:</span>
				<el-radio-group v-model="searchLibs" style="line-height: 88px; margin: 6px 20px 0 5px;">
					<el-radio :label="'person'">抓拍库</el-radio>
					<el-radio :label="'image1'">静态库</el-radio>
					<el-radio :label="'image2'">动态库</el-radio>
				</el-radio-group>
			</div>
			<div class="conditionItem">
				<el-button class="search-btn" type="primary" @click="searchFace">开始搜索</el-button>
			</div>
		</div>
		<div class="faceTitle">
			<img src="@/assets/images/faceDatabase.png" />
			<span>人脸库比对结果</span>
		</div>
		<div
			class="faceListWrap"
			v-loading="mainScreenLoading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
		>
			<div
				class="resultDetail"
				v-for="(o, index) in pageSize"
				:key="index"
				@mouseover.stop="dialogCompareAction(item,index)"
				@mouseleave.stop="isFaceMask=false"
			>
				<div class="imgWrap">
					<img
						:src="totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].photouri:require('@/assets/user.png')"
					/>
					<div class="faceMask" v-if="isFaceMask&idx === index">
						<div>
							<img src="@/assets/images/files.png" />
							<span>查看档案</span>
						</div>
						<div
							@click.stop="analysisAct(totalCompareItemList[totalCompareItemList.length-index-1],index,'/Companion')"
						>
							<img src="@/assets/images/faceImpact.png" />
							<span>同行人分析</span>
						</div>
						<div
							@click.stop="analysisAct(totalCompareItemList[totalCompareItemList.length-index-1],index,'/CarFellow')"
						>
							<img src="@/assets/images/video.png" />
							<span>同车人分析</span>
						</div>
						<div
							@click.stop="tempCtrlTask(totalCompareItemList[totalCompareItemList.length-index-1].photouri)"
						>
							<img src="@/assets/images/control.png" />
							<span>临时布控</span>
						</div>
						<!--     <div @click="viewImageDiglogvisible=true" v-show="isSnapLib"><img :src="bigViewImage"/><span>查看大图</span></div> -->
						<div
							@click="viewImageDiglogvisible=true,leftBigImage=totalCompareItemList[totalCompareItemList.length-index-1].photouri,rightBigImage=totalCompareItemList[totalCompareItemList.length-index-1].panoramauri"
						>
							<img :src="bigViewImage" />
							<span>查看大图</span>
						</div>
						<div @click.stop="downloadImg(totalCompareItemList[totalCompareItemList.length-index-1])">
							<img src="@/assets/images/export.png" />
							<span>导出图片</span>
						</div>
					</div>
				</div>
				<div class="textWrap">
					<div class="circle">
						<span
							v-if="!isSnapLib"
						>{{totalCompareItemList.length>index?(totalCompareItemList[totalCompareItemList.length-index-1].staffname?totalCompareItemList[totalCompareItemList.length-index-1].staffname:'姓名'):'姓名'}}</span>
						<span
							v-if="isSnapLib"
							style="font-family: PingFangSC-Regular;font-size: 12px;color: #888888;"
						>性别:</span>
						<span
							v-if="totalCompareItemList.length>index&&isSnapLib"
							style="font-family: PingFangSC-Regular;font-size: 12px;color: #888888;"
						>
							<span
								v-if="totalCompareItemList[totalCompareItemList.length-index-1].staffsex==='male'"
								style="font-family: PingFangSC-Regular;font-size: 12px;color: #888888;"
							>男</span>
							<span
								v-if="totalCompareItemList[totalCompareItemList.length-index-1].staffsex==='female'"
								style="font-family: PingFangSC-Regular;font-size: 12px;color: #888888;"
							>女</span>
							<!--   <span v-if="totalCompareItemList[totalCompareItemList.length-index-1].staffsex===null">性别</span> -->
						</span>
						<el-progress
							type="circle"
							:percentage="totalCompareItemList.length>index?parseInt(totalCompareItemList[totalCompareItemList.length-index-1].score.toFixed(0)):0"
							:width="45"
							color="#259A76"
							style="margin:auto;"
							:stroke-width="3"
						></el-progress>
					</div>
					<div class="describle">
						<div v-if="!isSnapLib">
							性别：
							<span v-if="totalCompareItemList.length>index">
								<span v-if="totalCompareItemList[totalCompareItemList.length-index-1].staffsex==='male'">男</span>
								<span v-if="totalCompareItemList[totalCompareItemList.length-index-1].staffsex==='female'">女</span>
								<span v-if="totalCompareItemList[totalCompareItemList.length-index-1].staffsex===null">性别</span>
							</span>
							<span v-if="totalCompareItemList.length<=index">性别</span>
							<!--  {{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].staffsex:'性别'}} -->
						</div>
						<div>所属库：{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].libraryname:'所属库'}}</div>
						<div
							v-if="!isSnapLib"
						>{{totalCompareItemList.length>index?(totalCompareItemList[totalCompareItemList.length-index-1].createtime?totalCompareItemList[totalCompareItemList.length-index-1].createtime:'抓拍时间'):'抓拍时间'}}</div>
						<div
							v-if="isSnapLib"
						>{{totalCompareItemList.length>index?(totalCompareItemList[totalCompareItemList.length-index-1].time?totalCompareItemList[totalCompareItemList.length-index-1].time :'时间'):'时间'}}</div>
						<div
							v-if="isSnapLib"
						>{{totalCompareItemList.length>index?(totalCompareItemList[totalCompareItemList.length-index-1].channelname?totalCompareItemList[totalCompareItemList.length-index-1].channelname:'未知人脸通道'):'未知人脸通道'}}</div>
					</div>
				</div>
				<!--     <div class="snapMask">

				</div>-->
			</div>
		</div>
		<div class="page-export">
			<!--   <div>
              <span style="color:#ccc;font-size:14px;line-height: 30px">当前位置&nbsp;&nbsp;第{{this.currentPage}}页&nbsp;&nbsp;&nbsp;&nbsp;共{{this.pageTotal}}条</span>
			</div>-->
			<div class="exportWrap">
				<!-- <span style="color:#ccc;font-size:14px;line-height: 30px" @click="fistIndexClick">首页</span> -->
				<span
					style="color:#ccc;font-size:14px;line-height: 30px;margin-right: 20px;"
				>共{{this.pageTotal}}条</span>
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="prev, pager, next, jumper"
					:page-size="pageSize"
					:pager-count="5"
					:total="pageTotal"
					background
				></el-pagination>
				<!--  <span style="color:#ccc;font-size:14px;line-height: 30px" @click="lastIndexClick">&nbsp;&nbsp;&nbsp;&nbsp;末页</span> -->
			</div>
		</div>
		<!-- ======================================================== 详情弹 窗 ========================================================== -->
		<el-dialog class="dialogClass" :visible.sync="dialogVisible" @close="closeDialog">
			<el-row>
				<div class="my_el-dialog__header">
					<img src="@/assets/images/dialogTitle.svg" alt />
					<span class="el-dialog__title">对比详情</span>
					<button type="button" aria-label="Close" class="el-dialog__headerbtn">
						<i class="el-dialog__close el-icon el-icon-close" @click="dialogVisible = false"></i>
					</button>
				</div>
			</el-row>
			<keep-alive v-loading="mainVideoScreenLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
				<dialogview
					:dialogParama="dialogParama"
					:shootPhotoList="shootPhotoList"
					:showImg="showImg"
					@cs="changeShowStatus"
				></dialogview>
			</keep-alive>
		</el-dialog>
		<!--查看大图-->
		<el-dialog
			:title="'查看大图'"
			:visible.sync="viewImageDiglogvisible"
			@close="viewImageDiglogvisible=false"
			width="680px"
			center
			class="viewImageDialog"
		>
			<div class="imgWrap">
				<img :src="leftBigImage" alt />
				<img :src="rightBigImage" alt />
			</div>
		</el-dialog>
	</div>
</template>
<script>
import dialogview from "@/pages/faceModule/components/dialogFace.vue";
export default {
  components: { dialogview },
  activated: function() {
    if (this.$route.query.imgObj) {
      console.log("this.$route.query==", this.$route.query.imgObj);
      var imgObj = this.$route.query.imgObj;
      this.frontUploaded1 = true;
      this.uploadImg1 = true;
      this.fileName1 = imgObj.detecteduuid;
      this.frontPhoto1 = imgObj.imageBase64;
      var obj = {
        imageBase64: imgObj.imageBase64.replace(
          "data:application/force-download;base64,",
          ""
        ),
        imageName: imgObj.detecteduuid
      };
      this.fileList1 = obj;
    }
  },
  mounted: function() {
    // let  token = this.$store.state.token;
    var h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight; // height
    document.getElementById("container").style.height = h - 0 + "px";
    // document.getElementById("el-table").style.height=h/2 - 0 + "px";
    function addZero(num) {
      if (num < 10) return "0" + num;
      return num;
    }
    var new111 = new Date();
    this.startTime =
			new111.getFullYear() +
			"-" +
			addZero(new111.getMonth() + 1) +
			"-" +
			addZero(new111.getDate()) +
			" " +
			"00:00:00";
    this.endTime =
			new111.getFullYear() +
			"-" +
			addZero(new111.getMonth() + 1) +
			"-" +
			addZero(new111.getDate()) +
			" " +
			"23:59:59";
    this.$http
      .post(this.api + "/mppr-model/face/v2/channelInfo/list", [
        "face_ipc",
        "face_recog_ipc",
        "body_snap_ipc"
      ])
      .then(res => {
        console.log("初始化视频源====", res);
        for (let i = 0; i < res.data.data.length; i++) {
          this.citiesuuid.push(res.data.data[i].channeluuid);
        }
        this.cities = res.data.data;
      })
      .catch(err => {
        console.log("请求错误：" + err);
      });
    // this.initFaceLibs();
  },
  methods: {
    changeFile1(file, fileList) {
      console.log("file===", file);
      this.frontUploaded1 = true;
      this.uploadImg1 = true;
      alert("上传成功");
      this.fileName1 = file.name;
      this.frontPhoto1 = URL.createObjectURL(file.raw);
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        console.log(" 这个就是base64编码了==", this.result); // 这个就是base64编码了
        // This.imageUrl = this.result;
        var imageBase64 = this.result
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpg;base64,", "");
        var obj = {
          imageBase64: imageBase64,
          imageName: This.fileName1
        };
        This.fileList1 = obj;
        console.log("fileList1111111============", This.fileList1);
      };
    },
    changeFile2(file, fileList) {
      console.log("file===", file);
      this.frontUploaded2 = true;
      this.uploadImg2 = true;
      alert("上传成功");
      this.fileName2 = file.name;
      this.frontPhoto2 = URL.createObjectURL(file.raw);
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        console.log(" 这个就是base64编码了==", this.result); // 这个就是base64编码了
        // This.imageUrl = this.result;
        var imageBase64 = this.result
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpg;base64,", "");
        var obj = {
          imageBase64: imageBase64,
          imageName: This.fileName2
        };
        This.fileList2 = obj;
        console.log("fileList2222222============", This.fileList2);
      };
    },
    changeFile3(file, fileList) {
      console.log("file===", file);
      this.frontUploaded3 = true;
      this.uploadImg3 = true;
      alert("上传成功");
      this.fileName3 = file.name;
      this.frontPhoto3 = URL.createObjectURL(file.raw);
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        console.log(" 这个就是base64编码了==", this.result); // 这个就是base64编码了
        // This.imageUrl = this.result;
        var imageBase64 = this.result
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpg;base64,", "");
        var obj = {
          imageBase64: imageBase64,
          imageName: This.fileName3
        };
        This.fileList3 = obj;
        console.log("fileList33333333============", This.fileList3);
      };
    },
    changeFile4(file, fileList) {
      console.log("file===", file);
      this.frontUploaded4 = true;
      this.uploadImg4 = true;
      alert("上传成功");
      this.fileName4 = file.name;
      this.frontPhoto4 = URL.createObjectURL(file.raw);
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        console.log(" 这个就是base64编码了==", this.result); // 这个就是base64编码了
        // This.imageUrl = this.result;
        var imageBase64 = this.result
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpg;base64,", "");
        var obj = {
          imageBase64: imageBase64,
          imageName: This.fileName4
        };
        This.fileList4 = obj;
        console.log("fileList44444444444============", This.fileList4);
      };
    },
    changeFile5(file, fileList) {
      console.log("file===", file);
      this.frontUploaded5 = true;
      this.uploadImg5 = true;
      alert("上传成功");
      this.fileName5 = file.name;
      this.frontPhoto5 = URL.createObjectURL(file.raw);
      var This = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        console.log(" 这个就是base64编码了==", this.result); // 这个就是base64编码了
        // This.imageUrl = this.result;
        var imageBase64 = this.result
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpg;base64,", "");
        var obj = {
          imageBase64: imageBase64,
          imageName: This.fileName5
        };
        This.fileList5 = obj;
        console.log("fileList5555============", This.fileList5);
      };
    },
    httpRequest1(e1) {},
    httpRequest2(e1) {},
    httpRequest3(e1) {},
    httpRequest4(e1) {},
    httpRequest5(e1) {},
    initFaceLibs() {
      // 初始化人脸库目录
    },
    handlePreview(file) {
      console.log("handlePreview===", file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    deleteUpload1() {
      // 删除上传图片
      this.frontUploaded1 = false;
      this.fileList1 = "";
      this.frontPhoto1 = "";
      this.fileName1 = "";
    },
    deleteUpload2() {
      this.frontUploaded2 = false;
      this.fileList2 = "";
      this.frontPhoto2 = "";
      this.fileName2 = "";
    },
    deleteUpload3() {
      this.frontUploaded3 = false;
      this.fileList3 = "";
      this.frontPhoto3 = "";
      this.fileName3 = "";
    },
    deleteUpload4() {
      this.frontUploaded4 = false;
      this.fileList4 = "";
      this.frontPhoto4 = "";
      this.fileName4 = "";
    },
    deleteUpload5() {
      this.frontUploaded5 = false;
      this.fileList5 = "";
      this.frontPhoto5 = "";
      this.fileName5 = "";
    },
    clearChanelList() {
      // 清空设备列表
      this.chooseDevide = false;
      this.chanelListName = "";
      this.chanelList = [];
    },
    searchListFace() {
      // 抓拍库
      this.mainScreenLoading = true;
      this.isFaceMask = false;
      this.totalCompareItemList = [];
      console.log(this.chanelList);
      // var url = "http://192.168.9.166:9400/v2/face/search/library/staticAndDynamic/oneByone";
      var url =
				this.api +
				"/mppr-baseface/v2/face/search/library/capture/oneByone/base64";
      var param = {
        imageInfobeanList: this.imageFilesList,
        channelUuidList: this.chanelList,
        endtime: this.endTime,
        scores: Number(this.similarityValue),
        starttime: this.startTime,
        libraryType: "capture"
      };
      this.$http
        .post(url, param)
        .then(res => {
          if (res.data.result === 0) {
            console.log("抓拍库res===", res);
            this.isSnapLib = true;
            this.searchResult = res.data.data;
            this.totalCompareItemList1 =
							res.data.data[0].searchCaptureLibDtoList;
            // this.totalCompareItemList1 = this.totalCompareItemList1.reverse();
            this.pageTotal = this.totalCompareItemList1.length;
            console.log("totalCompareItemList1===", this.totalCompareItemList1);
            for (let i = 0; i < 18; i++) {
              if (this.totalCompareItemList1[i]) {
                this.totalCompareItemList.unshift(
                  this.totalCompareItemList1[i]
                );
              }
            }
            this.currentPage = 1;
            console.log("totalCompareItemList===", this.totalCompareItemList);
            // this.totalCompareItemList = res.data.data.list;
            // this.totalCompareItemList = this.totalCompareItemList.reverse();
            // this.pageTotal=res.data.data.total;
            // // this.pagerCount = Math.ceil(Number(res.data.data.total)/Number(this.pageSize));
            this.mainScreenLoading = false;
          } else {
            this.mainScreenLoading = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => {
          this.mainScreenLoading = false;
          console.log("请求错误：" + err);
        });
    },
    searchImageFace1() {
      // 静态库
      this.mainScreenLoading = true;
      this.isFaceMask = false;
      this.totalCompareItemList = [];
      console.log(this.chanelList);
      // var url = "http://192.168.9.166:9400/v2/face/search/library/staticAndDynamic/oneByone";
      var url =
				this.api +
				"/mppr-baseface/v2/face/search/library/staticAndDynamic/oneByone/base64";
      var param = {
        imageInfobeanList: this.imageFilesList,
        channelUuidList: this.chanelList,
        endtime: this.endTime,
        scores: Number(this.similarityValue),
        starttime: this.startTime,
        libraryType: "static"
      };
      this.$http
        .post(url, param)
        .then(res => {
          if (res.data.result === 0) {
            console.log("静态库res===", res);
            this.isSnapLib = false;
            this.searchResult = res.data.data;
            this.totalCompareItemList1 =
							res.data.data[0].searchStaticDynaLibDtoList;
            this.pageTotal = this.totalCompareItemList1.length;
            console.log("totalCompareItemList1===", this.totalCompareItemList1);
            for (let i = 0; i < 18; i++) {
              if (this.totalCompareItemList1[i]) {
                this.totalCompareItemList.unshift(
                  this.totalCompareItemList1[i]
                );
              }
            }
            this.currentPage = 1;
            // this.totalCompareItemList = res.data.data.list;
            // this.totalCompareItemList = this.totalCompareItemList.reverse();
            // this.pageTotal=res.data.data.total;
            // // this.pagerCount = Math.ceil(Number(res.data.data.total)/Number(this.pageSize));
            this.mainScreenLoading = false;
          } else {
            this.mainScreenLoading = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => {
          this.mainScreenLoading = false;
          console.log("请求错误：" + err);
        });
    },
    searchImageFace2() {
      // 动态库
      this.mainScreenLoading = true;
      this.isFaceMask = false;
      this.totalCompareItemList = [];
      console.log(this.chanelList);
      // var url = "http://192.168.9.166:9400/v2/face/search/library/staticAndDynamic/oneByone";
      var url =
				this.api +
				"/mppr-baseface/v2/face/search/library/staticAndDynamic/oneByone/base64";
      var param = {
        imageInfobeanList: this.imageFilesList,
        channelUuidList: this.chanelList,
        endtime: this.endTime,
        scores: Number(this.similarityValue),
        starttime: this.startTime,
        libraryType: "dynamic"
      };
      this.$http
        .post(url, param)
        .then(res => {
          if (res.data.result === 0) {
            console.log("动态库res===", res);
            this.isSnapLib = false;
            this.searchResult = res.data.data;
            this.totalCompareItemList1 =
							res.data.data[0].searchStaticDynaLibDtoList;
            this.pageTotal = this.totalCompareItemList1.length;
            console.log("totalCompareItemList1===", this.totalCompareItemList1);
            for (let i = 0; i < 18; i++) {
              if (this.totalCompareItemList1[i]) {
                this.totalCompareItemList.unshift(
                  this.totalCompareItemList1[i]
                );
              }
            }
            this.currentPage = 1;
            // this.totalCompareItemList = this.totalCompareItemList.reverse();
            // this.pageTotal=res.data.data.total;
            // // this.pagerCount = Math.ceil(Number(res.data.data.total)/Number(this.pageSize));
            this.mainScreenLoading = false;
          } else {
            this.mainScreenLoading = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => {
          this.mainScreenLoading = false;
          console.log("请求错误：" + err);
        });
    },
    searchFace() {
      this.imageFilesList = [];
      if (this.frontUploaded1 === true) {
        this.imageFilesList.push(this.fileList1);
      }
      if (this.frontUploaded2 === true) {
        this.imageFilesList.push(this.fileList2);
      }
      if (this.frontUploaded3 === true) {
        this.imageFilesList.push(this.fileList3);
      }
      if (this.frontUploaded4 === true) {
        this.imageFilesList.push(this.fileList4);
      }
      if (this.frontUploaded5 === true) {
        this.imageFilesList.push(this.fileList5);
      }
      console.log("所有图片文件===", this.imageFilesList);
      this.totalCompareItemList = [];
      this.pageTotal = 0;
      if (Number(this.imageFilesList.length) !== 0) {
        if (this.searchLibs === "person") {
          console.log("抓拍库");
          this.searchListFace();
        } else if (this.searchLibs === "image1") {
          console.log("静态库");
          this.searchImageFace1();
        } else if (this.searchLibs === "image2") {
          console.log("动态库");
          this.searchImageFace2();
        }
      } else {
        this.$message({
          message: "请上传比对图片",
          type: "success"
        });
      }
    },
    chooseDevideList() {
      this.chooseDevide = true;
    },
    filterNode(value, data) {
      console.log(value);
      if (!value) return true;
      return data.channelName.indexOf(value) !== -1;
    },
    handleSelectionChange(res) {
      console.log(res);
    },
    handleCurrentChange(e) {
      console.log("handleCurrentChange1111111===", e);
      this.totalCompareItemList = [];
      this.currentPage = Number(e);
      for (let i = (e - 1) * 18; i < e * 18; i++) {
        if (this.totalCompareItemList1[i]) {
          this.totalCompareItemList.unshift(this.totalCompareItemList1[i]);
        }
      }

      // this.handlePageClick();
    },
    handleSizeChange(e) {
      console.log("handleSizeChange===", e);
    },
    fistIndexClick() {
      // 首页
      this.currentPage = 1;
      this.currentPage4 = "1";
      this.handlePageClick();
      console.log("首页");
    },
    lastIndexClick() {
      // 末页
      console.log("末页===", this.pagerCount);
      this.currentPage = Number(this.pagerCount);
      this.currentPage4 = this.pagerCount;
      this.handlePageClick();
      console.log("末页");
    },
    handlePageClick(data) {
      console.log(data);
      this.searchFace();
    },
    chooseCheckDev() {
      this.chooseDevide = false;
      this.chanelList = [];
      var nameArr = [];
      var chanelListArr = this.$refs.tree2.getCheckedNodes();
      for (let i = 0; i < chanelListArr.length; i++) {
        console.log(chanelListArr[i].channeluuid);
        if (chanelListArr[i].channeluuid) {
          this.chanelList.push(chanelListArr[i].channeluuid);
        }
        nameArr.push(chanelListArr[i].channelName);
      }
      let set3 = new Set(this.chanelList);
      this.chanelList = Array.from(set3);
      this.chanelListName = nameArr.join(",");
      console.log("chanelList===", this.chanelList);
      console.log("nameArr===", this.chanelListName);
    },
    // 弹窗的传值
    dialogCompareAction(item, index) {
      // this.doComparethis(e);
      console.log("searchLibs===", this.searchLibs);
      // if(this.isFaceMask||this.isSnapMask) {
      //   this.isFaceMask=false;
      //   this.isSnapMask=false
      // } else if(this.searchLibs==="person") {
      //    this.isFaceMask=true;
      // } else if(this.searchLibs==="image") {
      //    this.isSnapMask=true;
      // }
      this.idx = index;
      this.isFaceMask = true;
    },
    doComparethis(e) {
      console.log(e);

      if (this.totalCompareItemList.length - e > 0) {
        // this.comparePhotoList[comparePhotoList.length-e];
        console.log(
          this.totalCompareItemList[this.totalCompareItemList.length - e - 1]
        );
        this.dialogParama = this.totalCompareItemList[this.totalCompareItemList.length - e - 1];
        this.getAlarmShootPhotoList();
      } else {
      }
    },
    // 根据客户端的传的人员staffUuid查找抓拍图片 //GET /v1/face/dispatching/compare/history/list/staff
    getAlarmShootPhotoList(currentPage = 1, pageSize = 24) {
      this.dialogVisible = true;
      this.mainVideoScreenLoading = true;
      this.updatedFlag = true;
      this.$store
        .dispatch("getShootPhotosForStaffUuid", this.dialogParama.staffUuid)
        .then(res => {
          this.mainVideoScreenLoading = false;
          console.log(res.data, "===人脸记录照片：=====");
          if (res.result === 0) {
            this.dialogParama.shootPhotoList = res.data.list;
            this.dialogParama.aroundPhotoList = res.data.list;
            this.shootPhotoList = res.data.list;
            this.dialogParama.showImg = false;
            console.log("dialogParama====", this.dialogParama);
          } else {
            this.$message({
              message: "没有找到更多相关的人脸记录",
              type: "warning"
            });
          }
        });
    },
    closeDialog(e) {
      console.log("父組件===" + e);
      this.dialogVisible = e;
      this.showImg = false;
    },
    changeShowStatus(flag) {
      this.showImg = flag;
    },
    viewSingleDetail(e) {
      // 查看单个搜图结果
      console.log("e===", e);
      this.serchFileName = "";
      if (e === "1") {
        this.serchFileName = this.fileName1;
      } else if (e === "2") {
        this.serchFileName = this.fileName2;
      } else if (e === "3") {
        this.serchFileName = this.fileName3;
      } else if (e === "4") {
        this.serchFileName = this.fileName4;
      } else if (e === "5") {
        this.serchFileName = this.fileName5;
      }
      console.log("this.searchResult====", this.searchResult);
      this.totalCompareItemList1 = [];
      this.totalCompareItemList = [];
      for (let i = 0; i < this.searchResult.length; i++) {
        console.log("i====", this.searchResult[i]);
        if (this.searchResult[i].imageFileName === this.serchFileName) {
          if (this.isSnapLib) {
            this.totalCompareItemList1 = this.searchResult[i].searchCaptureLibDtoList;
            this.pageTotal = this.totalCompareItemList1.length;
            console.log("totalCompareItemList1===", this.totalCompareItemList1);
            for (let i = 0; i < 18; i++) {
              if (this.totalCompareItemList1[i]) {
                this.totalCompareItemList.unshift(
                  this.totalCompareItemList1[i]
                );
              }
            }
            this.currentPage = 1;
          } else {
            this.totalCompareItemList1 = this.searchResult[i].searchStaticDynaLibDtoList;
            this.pageTotal = this.totalCompareItemList1.length;
            console.log("totalCompareItemList1===", this.totalCompareItemList1);
            for (let i = 0; i < 18; i++) {
              if (this.totalCompareItemList1[i]) {
                this.totalCompareItemList.unshift(
                  this.totalCompareItemList1[i]
                );
              }
            }
            this.currentPage = 1;
          }
        }
      }
    },
    // 临时布控
    tempCtrlTask(e) {
      console.log("photouri===", e);
      this.$store.dispatch("tempCtrlTask", e).then(res => {
        console.log(res);
        if (res.result === 0) {
          this.$message({
            message: res.data,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data,
            type: "warning"
          });
        }
      });
    },
    analysisAct(o, index, routeName) {
      console.log("o===", o);
      console.log("index===", index);
      console.log("routeName===", routeName);
      if (o.staffuuid) {
        this.$router.push({ path: routeName, query: { imgObj: o } });
      } else if (o.detecteduuid) {
        this.$store
          .dispatch("photoRecordToAnalysis", o.detecteduuid)
          .then(res => {
            console.log(res);
            if (res.result === 0 && res.data) {
              o.staffuuid = res.data;
              this.$router.push({ path: routeName, query: { imgObj: o } });
            } else {
              this.$message({
                message: "未找到分析记录",
                type: "warning"
              });
            }
          });
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.citiesuuid : [];
      this.isIndeterminate = false;
      this.chanelList = this.checkedCities;
      console.log("chanelList===", this.chanelList);
    },
    handleCheckedCitiesChange(value) {
      this.chanelList = value;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.cities.length;
      console.log("chanelList===", this.chanelList);
    },
    // 下载导出图片
    downloadImg(o) {
      var url =
				this.$store.state.api +
				"/mppr-baseface/v2/face/search/downloadImage/imageUrl?imageUrl=" +
				o.photouri;
      window.location.href = url;
    }
  },
  data() {
    return {
      totalCompareItemList1: [], // 抓拍库全部数据
      citiesuuid: [],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      visible_popver: false,
      leftBigImage: "",
      rightBigImage: "",
      idx: 0, // 任务列表标记
      isSnapLib: true, // 是否是抓拍库
      bigViewImage: "", // 查看大图
      searchResult: [],
      imageFilesList: [],
      viewImageDiglogvisible: false, // 查看大图
      isFaceMask: false,
      uploadImg1: false,
      uploadImg2: false,
      uploadImg3: false,
      uploadImg4: false,
      searchLibs: "person",
      shootPhotoList: [],
      dialogParama: "弹窗视图的参数",
      dialogVisible: false,
      mainVideoScreenLoading: false, // 详情弹框
      mainScreenLoading: false, // 局部遮罩是否显示
      api: this.$store.state.api, // 接口参数前缀
      frontUploaded1: false,
      frontUploaded2: false,
      frontUploaded3: false,
      frontUploaded4: false,
      frontUploaded5: false,
      frontPhoto1: "", // 上传图片主图
      frontPhoto2: "", // 上传图片主图
      frontPhoto3: "", // 上传图片主图
      frontPhoto4: "", // 上传图片主图
      frontPhoto5: "", // 上传图片主图
      frontPhotoUrl:
				this.$store.state.api +
				"/mppr-face/v1/face/image/upload?fileType=full_body_shot", // 上传照片主图接口
      myHeaders: { token: this.$store.state.token },
      photoRequests: [], // 上传照片集合
      fileList1: "",
      fileList2: "",
      fileList3: "",
      fileList4: "",
      fileList5: "",
      fileName1: "",
      fileName2: "",
      fileName3: "",
      fileName4: "",
      fileName5: "",
      serchFileName: "",
      upLoadData: {},
      startTime: "",
      endTime: "",
      treeResultData: [
        {
          channeluuid: "",
          channelName: "设备列表",
          children: []
        }
      ],
      chanelList: [], // 人脸通道列表
      chanelListName: "",
      similarityValue: "80", // 相似度
      defaultProps: {
        children: "children",
        label: "channelName"
      },
      chooseDevide: false, // 是否选择设备
      currentPage4: 1, // 当前页数
      currentPage: 1,
      pageSize: 18,
      num8: 0.0,
      pageTotal: 1,
      pagerCount: "1", // 总页数
      uploadImageUrl: "",
      uploadImageUuid: "",
      totalCompareItemList: [],
      showImg: false
    };
  }
};
</script>
<style lang="scss">
html {
	background: #1c1d20;
}
.faceImpact {
	background: #1c1d20;
	padding: 40px 2.7% 0 2.7%;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #cccccc;
}
.faceImpact .el-radio__input.is-checked + .el-radio__label {
	color: #ffffff;
}
.faceImpact .conditionItem {
	height: 100px;
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
}
.faceImpact .el-button--primary {
	width: 120px;
	height: 40px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	border: 1px solid rgba(40, 255, 187, 0.7);
	border-radius: 3px;
}
.faceImpact .search {
	// width: auto;
	height: 160px;
	// background: rgba(36,39,42,0.65);
	border-radius: 3px;
	display: flex;
}
.faceImpact .search .uploadImg {
	width: 120px;
	height: 160px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background: rgba(36, 39, 42, 0.65);
}
.faceImpact .search .uploadImg:first-child {
	padding-left: 10px;
}
.faceImpact .search .uploadImg:last-child {
	padding-right: 10px;
}
.faceImpact .search .el-input__inner {
	height: 40px;
}
.faceImpact .search .uploadIcon {
	width: 100px;
	height: 125px;
	background: #1b1e21 url("../../../assets/images/addImg2.png") no-repeat;
	background-size: 41px 36px;
	background-position: center 33px;
	padding-top: 83px;
	position: relative;
	box-sizing: border-box;
	position: relative;
	border: 1px dashed #3c3f42;
}
.faceImpact .search .uploadIcon .alreadyUploaded {
	width: 104px;
	height: 129px;
	position: absolute;
	left: -2px;
	top: -2px;
	z-index: 2000;
	// background: red;
}
.faceImpact .search .uploadIcon .alreadyUploaded img {
	width: 104px;
	height: 129px;
}
.faceImpact .search .uploadIcon .alreadyUploaded .delete {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: red;
	position: absolute;
	right: 4px;
	top: 4px;
	background: rgba(17, 17, 17, 0.6) url("../../../assets/icon/delete.png")
		no-repeat;
	background-position: center center;
	z-index: 2000;
	background-size: 10px 10px;
}
.faceImpact .search .uploadIcon div {
	width: 100%;
	height: 17px;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #cccccc;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.faceImpact .search .uploadIcon div .add-icon {
	margin-right: 8px;
}
.faceImpact .search .uploadIcon .upload-multiple {
	width: 100px;
	height: 125px;
	position: absolute;
	left: 0;
	top: 0;
	opacity: 0;
	z-index: 500;
}
.faceImpact .search .uploadIcon .upload-multiple div {
	width: 100px;
	height: 125px;
	position: absolute;
	left: 0;
	top: 0;
}
.faceImpact .el-select {
	display: inline-block;
	position: relative;
	width: 24px;
}
.faceImpact .top-space {
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 20px;
	position: relative;
}
.faceImpact .top-space .bth-title {
	width: 115px;
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.faceImpact .timeText {
	margin: 0 8px;
}
.el-loading-spinner .path {
	stroke: #20cc96;
}
.faceImpact .el-input.is-disabled .el-input__inner {
	background: none;
	color: #ccc;
	border-color: rgba(220, 223, 230, 0.5);
}
.faceImpact .percent {
	// margin: 0 27px 0 12px;
	font-size: 16px;
}
.faceImpact .top-space .search-btn {
	width: 140px;
	height: 40px;
	opacity: 0.8;
	background: rgba(40, 255, 187, 0.05) url("../../../assets/images/search.png")
		no-repeat;
	border: 1px solid rgba(32, 204, 150, 0.7);
	border-radius: 3px;
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
	padding-left: 45px;
	background-position: 22px 11px;
	background-size: 16px 16px;
}
.faceImpact .condition {
	width: 100%;
	height: 100px;
	display: flex;
	flex-direction: row;
	align-items: center;
	background: rgba(36, 39, 42, 0.65);
	margin: 20px 0;
	padding: 0 36px 0 26px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #cccccc;
	justify-content: space-between;
}
.faceImpact .condition .el-input--prefix .el-input__inner {
	padding-left: 11px;
	color: #888888;
}
.faceImpact .condition .timeWrap {
	width: 480px;
	height: 100px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.faceImpact .treeResult {
	position: absolute;
	left: 58px;
	top: 70px;
	z-index: 3000;
	background: rgba(36, 39, 42, 1);
}
.faceImpact .el-tree {
	background: rgba(36, 39, 42, 1);
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #cccccc;
	// padding-top: 5px;
}
.faceImpact .el-tree .el-tree-node {
	white-space: nowrap;
	outline: 0;
	padding: 0 0 21px 14px;
	box-sizing: border-box;
}
.el-tree-node:focus > .el-tree-node__content {
	background: #242932;
}
.el-tree-node__content:hover {
	background: #242932;
}
.faceImpact .el-tree-node__content:hover {
	background: #242932;
}
.faceImpact .el-checkbox__inner {
	background: none;
}
.faceImpact .el-tree-node__expand-icon {
	position: absolute;
	left: 100px;
	top: 0;
	// color: #28FFBB;
}
.faceImpact .el-checkbox__input.is-checked .el-checkbox__inner {
	color: #28ffbb;
	background: none;
}
.faceImpact .faceTitle {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	align-items: center;
	background: rgba(36, 39, 42, 0.65);
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
}
.faceImpact .faceTitle img {
	width: 14px;
	height: 14px;
	margin: 0 11px 0 26px;
}
.faceImpact .faceListWrap {
	width: 100%;
	display: flex;
	background: rgba(36, 39, 42, 0.65);
	flex-direction: row;
	flex-wrap: wrap;
	padding: 0 0 42px 2%;
	box-sizing: border-box;
}
.faceImpact .faceListWrap .resultDetail {
	width: 15.5%;
	height: 150px;
	background: rgba(0, 0, 0, 0.13);
	border: 1px solid rgba(40, 255, 187, 0.13);
	border-radius: 3px;
	margin: 0 0.8% 20px 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: center;
	overflow: hidden;
	cursor: pointer;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .snapMask {
	width: 100%;
	height: 150px;
	position: absolute;
	left: 0;
	top: 0;
	background: rgba(1, 1, 1, 0.8);
	box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
	border-radius: 2px;
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	color: #ffffff;
	letter-spacing: 0;
	padding-top: 11px;
	box-sizing: border-box;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .snapMask div {
	width: 100%;
	height: 14px;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 18px;
	box-sizing: border-box;
	margin-bottom: 9px;
	font-size: 10px;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .snapMask div:hover {
	color: #28ffbb;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .snapMask img {
	width: 10px;
	height: 10px;
	margin-right: 7px;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .faceMask {
	width: 100%;
	height: 150px;
	position: absolute;
	left: 0;
	top: 0;
	background: rgba(1, 1, 1, 0.8);
	box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
	border-radius: 2px;
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	color: #ffffff;
	letter-spacing: 0;
	padding-top: 11px;
	box-sizing: border-box;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .faceMask div {
	width: 100%;
	height: 14px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 9px;
	font-size: 10px;
	padding-left: 10px;
	box-sizing: border-box;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .faceMask div span {
	font-size: 14px;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .faceMask div:hover {
	color: #28ffbb;
}
.faceImpact .faceListWrap .resultDetail .imgWrap .faceMask img {
	width: 10px;
	height: 10px;
	margin-right: 7px;
}
.faceImpact .faceListWrap .resultDetail .imgWrap {
	width: 46%;
	height: 150px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	position: relative;
}
.faceImpact .faceListWrap .resultDetail .imgWrap img {
	width: 86%;
	height: 124px;
}
.faceImpact .faceListWrap .resultDetail .textWrap {
	width: 51%;
	height: 125px;
	margin-left: 4.7%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-top: 6px;
	box-sizing: border-box;
	padding-bottom: 3px;
}
.faceImpact .faceListWrap .resultDetail .textWrap .circle {
	width: 100%;
	height: 45px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.faceImpact .faceListWrap .resultDetail .textWrap .circle span {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
}
.faceImpact .faceListWrap .resultDetail .textWrap .describle {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #888888;
}
.faceImpact .faceListWrap .resultDetail .textWrap .describle div {
	margin-top: 6px;
	text-align: left;
}
.faceImpact .page-export .exportWrap {
	width: 100%;
	height: 64px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	background: rgba(36, 39, 42, 0.65);
	padding-right: 2.5%;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #888888;
}
.faceImpact .el-pagination.is-background .el-pager li.active {
	background: rgba(40, 255, 187, 0.1);
	border-radius: 2px;
}
.faceImpact .el-pagination.is-background .btn-next,
.faceImpact .el-pagination.is-background .btn-prev,
.faceImpact .el-pagination.is-background .el-pager li {
	color: #ccc;
	background: none;
}
.faceImpact .el-pager li {
	background: none;
}
.faceImpact .el-pagination.is-background .el-pager li.active {
	opacity: 0.8;
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
}
.faceImpact .el-icon-arrow-left:before {
	content: "上一页";
	font-size: 14px;
}
.faceImpact .el-icon-arrow-right:before {
	content: "下一页";
	font-size: 14px;
}
.faceImpact .el-pagination__total {
	font-size: 14px;
	font-weight: 100;
	color: #cccccc;
	// margin: 0 57px 0 27px;
}
.faceImpact .el-pagination__jump {
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #cccccc;
	letter-spacing: 0;
	text-align: justify;
}
.el-picker-panel__icon-btn {
	color: #fff;
}
.faceImpact .el-progress__text {
	font-size: 12px !important;
	color: rgba(40, 255, 187, 0.6);
	display: inline-block;
	vertical-align: middle;
	/* margin-left: 10px; */
	line-height: 1;
}
// .faceImpact .dialogClass .el-dialog__body {
//     padding: 0;
//     color: #606266;
//     font-size: 14px;
// }
// .faceImpact .dialogClass{
//   text-align: left;
// }
// .my_el-dialog__header {
//   padding: 20px 20px 10px;
//   height: 58px;
//   box-sizing: border-box;
//   border-bottom: 1px solid rgba(40,255,187,0.20);
// }
// .faceImpact .el-dialog__title {
//     line-height: 24px;
//     font-family: PingFangSC-Regular;
//     font-size: 20px;
//     color: #FFFFFF;
//     text-align: left;
//     margin-left: 11px;

// }
// .faceImpact .el-dialog {
//     position: relative;
//     margin: 0 auto 50px;
//     background-image: linear-gradient(-180deg, #16171F 0%, #10131A 100%);
//     border-radius: 3px;
//     -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
//     box-shadow: 0 1px 3px rgba(0,0,0,.3);
//     -webkit-box-sizing: border-box;
//     box-sizing: border-box;
//     /* width: 50%; */
//     color: #fff;
// }
// .faceImpact .el-dialog__header {
//     display: none;
//     padding: 20px 20px 10px;
// }
.faceImpact .fontColor {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #cccccc;
	letter-spacing: 0;
}
.faceImpact .fontTheme {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgb(39, 150, 119) !important;
	letter-spacing: 0;
	cursor: pointer;
}
.faceImpact .viewImageDialog .imgWrap {
	width: 100%;
	height: 220px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.faceImpact .viewImageDialog .imgWrap img:first-child {
	width: 220px;
	height: 220px;
}
.faceImpact .viewImageDialog .imgWrap img:last-child {
	width: 390px;
	height: 220px;
}
.faceImpact .el-dialog--center .el-dialog__body {
	padding-bottom: 25px;
}
.faceImpact .el-dialog__title {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
}
.taskParent .el-checkbox-group {
	width: 530px;
	height: 350px;
	line-height: 20px;
	text-align: center;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}
.taskParent .el-checkbox {
	width: 40%;
	height: 10%;
	text-align: left;
}
.taskParent .el-checkbox__label {
	color: #fff;
}
.taskParent .el-checkbox + .el-checkbox {
	margin-left: 10px;
}
</style>
