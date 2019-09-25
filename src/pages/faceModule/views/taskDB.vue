<template>
	<div class="container controlTask" id="container">
		<div class="taskList" v-loading="mainListLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
			<div class="newMonitor">
				<el-button class="add-btn" type="primary" @click="addNewControlTask">新建布控任务</el-button>
			</div>
			<div class="chooseModel">
				<div
					class="inUse"
					:class="[isActive === true?'UseActive':'']"
					@click.stop="chooseInModel"
				>在用任务&nbsp;({{this.enableTask.length}})</div>
				<div
					class="outUse"
					:class="[!isActive === true?'UseActive':'']"
					@click.stop="chooseOutModel"
				>停用任务&nbsp;({{this.disableTask.length}})</div>
			</div>
			<div class="list">
				<el-scrollbar style="height: 100%">
					<div
						class="singleTask"
						:class="[idx === index?'listActive':'']"
						v-for="(item,index) in inUseList"
						:key="index"
						@click="viewTaskDetails(item,index)"
					>{{item.taskname}}</div>
				</el-scrollbar>
			</div>
		</div>
		<div class="taskDetail">
			<div v-loading="mainDetailLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
				<div class="operation">
					<div class="status">
						<el-switch
							v-model="switchTask"
							active-color="rgba(32,204,150,0.2)"
							inactive-color="rgba(255,255,255,0.2)"
							@change="switchChange()"
						></el-switch>
						<span>状态</span>
					</div>
					<div class="status" @click="editTaskInit">
						<img src="@/assets/images/edit.png" />
						<span>编辑</span>
					</div>
					<div class="status" @click="deleteDiglogvisible=true">
						<img src="@/assets/images/delete2.png" />
						<span>删除</span>
					</div>
				</div>
				<div class="createDetail">
					<div>名称：{{taskName}}</div>
					<div>创建人：{{createPeople}}</div>
					<div>创建时间：{{createTime}}</div>
					<div>布控原因：{{taskReason}}</div>
				</div>
				<div class="faceLibsTotal">
					<div class="title" @click.stop="viewFaceLibas">
						<span>人脸库： 共{{viewFaceLibs.length}}个人脸库</span>
						<img src="@/assets/images/select-down.png" />
					</div>
					<div class="list" id="list">
						<div class="libs" id="libs" v-for="(item,index) in viewFaceLibs" :key="index">
							<!-- <img src="@/assets/images/whiteLibs.png" v-if="item.value=='白名单库'"/>
							<img src="@/assets/images/staffLibs.png" v-if="item.value=='工作人员库'"/>
							<img src="@/assets/images/escapedLibs.png" v-if="item.value=='逃犯库'"/>
							<img src="@/assets/images/blackLibs.png" v-if="item.value=='黑名单库'"/>-->
							<span>{{item}}</span>
						</div>
					</div>
				</div>
				<div class="cameraTotal">
					<div class="title" @click.stop="viewAllCamera">
						<span>视频源： 共{{cameraList.length}}个摄像头</span>
						<img src="@/assets/images/select-down.png" />
					</div>
					<div class="list" id="cameraList" v-if="isShowCamera">
						<div class="libs" id="cameraLibs" v-for="(item,index) in cameraList" :key="index">
							<img src="@/assets/images/captureDevice.png" />
							<span>{{item}}</span>
						</div>
						<!-- 	<div class="moreCamera" @click.stop="viewAllCamera" v-show="isShowMore">
							<span>更多</span>
							<img src="@/assets/images/more.png"/>
						</div>-->
					</div>
				</div>
				<div class="createDetail">
					<div>相似度：{{threshold}}%</div>
					<div>
						<el-checkbox v-model="isAlarmResource" disabled></el-checkbox>
						<span>是否做为报警源</span>
					</div>
					<div>
						<el-checkbox v-model="isAlarmDialog" disabled></el-checkbox>
						<span>是否开启布控报警弹窗</span>
					</div>
					<div>人脸抓拍图片需达到的质量：{{imageQuality}}</div>
				</div>
			</div>
			<div class="alarmDetail">
				<div class="total">
					<img src="@/assets/images/alarm.png" />
					<span>共{{totalCompareItemList.length}}个警报</span>
				</div>
				<div class="search">
					<span>时段：</span>
					<el-date-picker
						v-model="startTime"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span>&nbsp;至&nbsp;</span>
					<el-date-picker
						v-model="endTime"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<el-button class="search-btn" type="primary" @click="searchTsakAlarm">查询</el-button>
					<el-button class="route-btn" type="primary" @click.stop="routePage">跳转人脸比对记录</el-button>
				</div>
			</div>
			<div
				class="searchResult"
				v-loading="mainsSearchLoading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			>
				<div class="resultWrap" v-for="(o, index) in pageSize" :key="index">
					<div class="leftCon">
						<img
							:src="totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].zhuapaipic:require('@/assets/user.png')"
						/>
						<div class="similarity">
							<span>相似度：</span>
							<span>{{totalCompareItemList.length>index?parseInt(totalCompareItemList[totalCompareItemList.length-index-1].percent.toFixed(0)):0}}%</span>
						</div>
						<div>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].alarmtime:'抓拍时间'}}</div>
						<div>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].zhuapai:'未知任务通道'}}</div>
					</div>
					<div class="rightCon">
						<img
							:src="totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].kulipic:require('@/assets/user.png')"
						/>
						<div>{{totalCompareItemList.length>index?(totalCompareItemList[totalCompareItemList.length-index-1].staffname?totalCompareItemList[totalCompareItemList.length-index-1].staffname:'姓名'):'姓名'}}</div>
						<div class="libs">
							<span>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].belong:'所属库'}}</span>
							<!-- 				<img src="@/assets/images/whiteLibs.png" v-if="item.value=='白名单库'"/>
							<img src="@/assets/images/staffLibs.png" v-if="item.value=='工作人员库'"/>
							<img src="@/assets/images/escapedLibs.png" v-if="item.value=='逃犯库'"/>-->
							<img src="@/assets/images/blackLibs.png" />
						</div>
						<div>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].idcard:'案件号'}}</div>
					</div>
				</div>
			</div>
		</div>
		<el-dialog
			:title="'新建布控任务'"
			:visible.sync="diglogvisible"
			@close="diglogvisible=false"
			width="680px"
			center
			class="taskDialog"
		>
			<div style="padding: 25px 25px 30px;">
				<div class="dialogItem">
					<div class="title">名称：</div>
					<el-input v-model="newTaskName"></el-input>
				</div>
				<div class="dialogItem">
					<div class="title">人脸库：</div>
					<el-select v-model="newFaceLibs" multiple collapse-tags placeholder="请选择人脸库">
						<el-option
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="dialogItem">
					<div class="title">视频源：</div>
					<!-- <el-select v-model="newVideoSource" multiple collapse-tags placeholder="请选择视频源">
						<el-option
							v-for="item in videoSourceList"
							:key="item.channeluuid"
							:label="item.channelName"
							:value="item.channeluuid"
						></el-option>
					</el-select>-->
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
						<el-select
							slot="reference"
							v-model="newVideoSource"
							multiple
							collapse-tags
							placeholder="请选择视频源"
							disabled
						>
							<el-option
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
					</el-popover>
					<!-- <elPopverTree
						:channelInfoList="videoSourceList"
						:elPopoverClass="CompareRecordPopoverClass"
						:checkedChannelKeys="initChcekedKeys"
						@transferCheckedChannel="transferCheckedChannel"
						@clear="clearAction(2)"
						@show="popverShow(2)"
						@hide="popverHidden(2)"
					></elPopverTree>-->
				</div>
				<div class="dialogItem">
					<div class="title">阙值：</div>
					<el-input v-model="newThreshold"></el-input>
				</div>
				<div class="dialogItem2">
					<div class="title">人脸抓拍图片需达到的质量：</div>
					<el-select v-model="newImageIquality" placeholder="请选择图片质量">
						<el-option
							v-for="item in imageIquality"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
						></el-option>
					</el-select>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isAlarmSource"></el-checkbox>
					</div>
					<div class="text">是否做为报警源</div>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isOpenAlarm"></el-checkbox>
					</div>
					<div class="text">是否开启报警弹窗</div>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isStartTask"></el-checkbox>
					</div>
					<div class="text">是否启动任务</div>
				</div>
				<div class="dialogItem">
					<div class="title">布控原因：</div>
					<el-input v-model="newTaskReason"></el-input>
				</div>
				<div class="btnWrap">
					<div class="confirm" @click="newControlTask">确定</div>
					<div class="cencel" @click="diglogvisible=false">取消</div>
				</div>
			</div>
		</el-dialog>
		<el-dialog
			:title="'编辑布控任务'"
			:visible.sync="editDiglogvisible"
			@close="editDiglogvisible=false"
			width="680px"
			center
			class="taskDialog"
		>
			<div
				style="padding: 25px 25px 30px;"
				v-loading="mainEditLoading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			>
				<div class="dialogItem">
					<div class="title">名称：</div>
					<el-input v-model="editTaskName"></el-input>
				</div>
				<div class="dialogItem">
					<div class="title">人脸库：</div>
					<el-select v-model="editFaceLibs" multiple collapse-tags placeholder="请选择人脸库">
						<el-option
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="dialogItem">
					<div class="title">视频源：</div>
					<!-- <el-select v-model="editVideoSource" multiple collapse-tags placeholder="请选择视频源">
						<el-option
							v-for="item in videoSourceList"
							:key="item.channeluuid"
							:label="item.channelName"
							:value="item.channeluuid"
						></el-option>
					</el-select> -->
					<el-popover placement="bottom-start" width="530" trigger="click">
						<el-checkbox
							:indeterminate="isIndeterminate1"
							v-model="checkAll1"
							@change="handleCheckAllChange1"
							style="margin-bottom: 10px;color: #fff;"
						>全选</el-checkbox>
						<div
							style="width: 530px;height: 350px;overflow-x: auto;overflow-y: hidden; display:flex;flex-wrap:nowrap;justify-content:flex-start;"
							id
						>
							<div class="taskParent">
								<el-checkbox-group v-model="checkedCities1" @change="handleCheckedCitiesChange1">
									<el-checkbox
										v-for="item in cities"
										:key="item.channeluuid"
										:label="item.channeluuid"
									>{{item.channelName}}</el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
						<el-select
							slot="reference"
							v-model="editVideoSource"
							multiple
							collapse-tags
							placeholder="请选择视频源"
							disabled
						>
							<el-option
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
					</el-popover>
				</div>
				<div class="dialogItem">
					<div class="title">阙值：</div>
					<el-input v-model="editThreshold"></el-input>
				</div>
				<div class="dialogItem2">
					<div class="title">人脸抓拍图片需达到的质量：</div>
					<el-select v-model="editImageIquality" placeholder="请选择图片质量">
						<el-option
							v-for="item in imageIquality"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
						></el-option>
					</el-select>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="editAlarmSource"></el-checkbox>
					</div>
					<div class="text">是否做为报警源</div>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="editOpenAlarm"></el-checkbox>
					</div>
					<div class="text">是否开启报警弹窗</div>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="editStartTask"></el-checkbox>
					</div>
					<div class="text">是否启动任务</div>
				</div>
				<div class="dialogItem">
					<div class="title">布控原因：</div>
					<el-input v-model="editTaskReason"></el-input>
				</div>
				<div class="btnWrap">
					<div class="confirm" @click="editControlTask">确定</div>
					<div class="cencel" @click="editDiglogvisible=false">取消</div>
				</div>
			</div>
		</el-dialog>
		<!--删除智能模型-->
		<el-dialog
			:title="'提示'"
			:visible.sync="deleteDiglogvisible"
			@close="deleteDiglogvisible=false"
			width="560px"
			center
			class="deleteDialog"
		>
			<div style="padding: 25px 25px 30px;">
				<div class="deleteText">
					<img src="@/assets/images/delete3.png" />
					<span>是否确定删除？</span>
				</div>
				<div class="deleteBtn">
					<div @click="deleteTask">确定</div>
					<div @click="deleteDiglogvisible=false">取消</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
  activated: function() {
    this.isActive = true;
    this.initTaskList();
    this.taskuuid = this.inUseList[0].modeluuid;
    this.idx = 0;
    this.viewTaskDetails();
  },
  mounted: function() {
    console.log("api==", this.api);
    var h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight; // height
    document.getElementById("container").style.height = h - 5 + "px";
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
    this.initTaskList();
    this.$http
      .post(this.api + "/mppr-model/face/v2/channelInfo/list", [
        "face_ipc",
        "face_recog_ipc",
        "body_snap_ipc"
      ])
      .then(res => {
        console.log("初始化视频源====", res);
        this.videoSourceList = res.data.data;
        for (let i = 0; i < res.data.data.length; i++) {
          // var obj = {
          // 	id:res.data.data[i].channeluuid,
          // 	label:res.data.data[i].channelName
          // }
          this.citiesuuid.push(res.data.data[i].channeluuid);
          // this.videoSourceList[i].channeluuid=this.videoSourceList[i].id;
          // this.videoSourceList[i].channelName=this.videoSourceList[i].label;
        }
        this.cities = res.data.data;
        console.log("this.videoSourceList==", this.videoSourceList);
      })
      .catch(err => {
        console.log("请求错误：" + err);
      });
    this.$http
      .get(this.api + "/mppr-model/face/v2/faceLib/list")
      .then(res => {
        console.log("初始化人脸库====", res);
        this.faceLibsList = res.data.data;
      })
      .catch(err => {
        console.log("请求错误：" + err);
      });
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    filterText1(val) {
      this.$refs.tree3.filter(val);
    }
  },
  methods: {
    routePage() {
      this.$router.push({ path: "/CompareRecord" });
    },
    initTaskList() {
      this.mainListLoading = true;
      this.$http
        .get(this.api + "/mppr-model/face/v2/dispatching/task/list")
        .then(res => {
          console.log("初始化布控任务====", res);
          this.mainListLoading = false;
          this.disableTask = res.data.data.disable;
          this.enableTask = res.data.data.enable;
          this.inUseList = res.data.data.enable;
          console.log("第一个数据的id", res.data.data.enable[0].taskuuid);
          this.taskuuid = res.data.data.enable[0].taskuuid;
          this.viewTaskDetails();
          this.searchTsakAlarm();
          this.$store.commit("setTasks", res.data.data.enable);
        })
        .catch(err => {
          this.mainListLoading = false;
          console.log("请求错误：" + err);
        });
    },
    addNewControlTask() {
      this.checkedCities = [];
      this.diglogvisible = true;
      this.newTaskName = "";
      this.newFaceLibs = [];
      this.newVideoSource = [];
      this.newThreshold = "";
      this.newImageIquality = "HIGH";
      this.isAlarmSource = true;
      this.isOpenAlarm = false;
      this.isStartTask = false;
      this.newTaskReason = "";
    },
    chooseInModel() {
      this.isActive = true;
      this.inUseList = this.enableTask;
      this.taskuuid = this.inUseList[0].taskuuid;
      this.viewTaskDetails();
      this.idx = 0;
    },
    chooseOutModel() {
      this.isActive = false;
      this.inUseList = this.disableTask;
      this.taskuuid = this.inUseList[0].taskuuid;
      this.viewTaskDetails();
      this.idx = 0;
    },
    viewTaskDetails(item, index) {
      // 获取布控任务详情
      this.mainDetailLoading = true;
      if (item) {
        this.taskuuid = item.taskuuid;
        console.log("item==", item);
        this.idx = index;
      }
      this.searchTsakAlarm();
      this.$http
        .get(
          this.api +
						"/mppr-model/face/v2/dispatching/task/detail?taskuuid=" +
						this.taskuuid
        )
        .then(res => {
          console.log("查看布控任务详情====", res);
          this.mainDetailLoading = false;
          this.taskName = res.data.data.taskname;
          this.createPeople = res.data.data.username;
          this.createTime = res.data.data.createtime;
          this.taskReason = res.data.data.reason;
          this.threshold = res.data.data.threshold;
          this.isAlarmDialog = res.data.data.ispopup; // 是否弹窗
          this.isAlarmResource = res.data.data.alarmed; // 是否报警
          this.switchTask = res.data.data.enabled;
          this.imageQuality = "";
          if (res.data.data.level === "HIGH") {
            this.imageQuality = "高";
          } else if (res.data.data.level === "NORMAL") {
            this.imageQuality = "中";
          } else if (res.data.data.level === "LOW") {
            this.imageQuality = "低";
          }
          this.viewFaceLibs = [];
          for (let i = 0; i < res.data.data.faceLibs.length; i++) {
            this.viewFaceLibs.push(res.data.data.faceLibs[i].libraryname);
          }
          this.cameraList = [];
          for (let i = 0; i < res.data.data.channelLibs.length; i++) {
            this.cameraList.push(res.data.data.channelLibs[i].channelName);
          }
          document.getElementById("list").style.height = "40px";
          document.getElementById("cameraList").style.height = "80px";
        })
        .catch(err => {
          this.mainDetailLoading = false;
          console.log("请求错误：" + err);
        });
    },
    viewFaceLibas() {
      // 查询所有的人脸库
      // var height=document.getElementById("libs").offsetHeight;
      // console.log("height==",height);
      // var rows=parseInt(Number(this.faceLibsList.length)/7)+1;
      // console.log("rows==",rows);
      // document.getElementById("list").style.height=rows*height+ "px";
      // if(this.isShowFaceLibs) {
      // 	this.isShowFaceLibs=false;
      // } else {
      //     this.isShowFaceLibs=true;

      // }
      if (this.isShowFaceLibs) {
        var height = document.getElementById("libs").offsetHeight;
        console.log("height==", height);
        var rows = parseInt(Number(this.viewFaceLibs.length) / 6) + 1;
        console.log("rows==", rows);
        document.getElementById("list").style.height = rows * height + "px";
        this.isShowFaceLibs = false;
      } else {
        document.getElementById("list").style.height = "40px";
        this.isShowFaceLibs = true;
      }
    },
    viewAllCamera() {
      if (this.isShowMore) {
        var height = document.getElementById("cameraLibs").offsetHeight;
        console.log("height==", height);
        var rows = parseInt(Number(this.cameraList.length) / 6) + 1;
        console.log("rows==", rows);
        document.getElementById("cameraList").style.height =
					rows * height + "px";
        this.isShowMore = false;
      } else {
        document.getElementById("cameraList").style.height = "80px";
        this.isShowMore = true;
      }
    },
    searchTsakAlarm() {
      this.mainsSearchLoading = true;
      const _this = this;
      // this.taskuuid="";
      // this.startTime="";
      // this.endTime="";
      this.$http
        .get(
          this.api +
						"/mppr-statistics/log/taskInfo?taskUuidList=" +
						this.taskuuid +
						"&starttime=" +
						this.startTime +
						"&overtime=" +
						this.endTime +
						"&alarmed=true"
        )
        .then(res => {
          console.log("查看报警记录====", res);
          this.mainsSearchLoading = false;
          this.totalCompareItemList = [];
          var num = [];

          if (res.data.data) {
            // console.log(data.data);
            for (let i = 0; i < res.data.data.length; i++) {
              var waimian = res.data.data[i];
              var limian = JSON.parse(res.data.data[i].extinfo);
              // if (i==1) {
              //   console.log(waimian);
              //   console.log(limian);
              // }
              if (limian.faceRecognization) {
                var detectedinfo, photoinfo2, staffinfo;
                if (typeof limian.faceRecognization.detectedinfo === "string") {
                  detectedinfo = JSON.parse(
                    limian.faceRecognization.detectedinfo
                  );
                } else {
                  detectedinfo = limian.faceRecognization.detectedinfo;
                }
                if (typeof limian.faceRecognization.photoinfo === "string") {
                  photoinfo2 = JSON.parse(limian.faceRecognization.photoinfo);
                } else {
                  photoinfo2 = limian.faceRecognization.photoinfo;
                }
                if (typeof limian.faceRecognization.staffinfo === "string") {
                  staffinfo = JSON.parse(limian.faceRecognization.staffinfo);
                } else {
                  staffinfo = limian.faceRecognization.staffinfo;
                }
                console.log(staffinfo.staffUuid);
                num.push({
                  detail: {
                    alarminfoid: waimian.alarminfoid,
                    staffuuid: staffinfo.staffUuid,
                    zhuapaiurl: photoinfo2.imageUri,
                    zhuapaiaddress: detectedinfo.channelinfo.channelName,
                    zhuapaitime: res.data.data[i].alarmtime,
                    tezheng: "",
                    taskName: limian.taskname,
                    jindu: parseInt(limian.faceRecognization.scores),
                    kuurl: staffinfo.photoUri || _this.defaultHeader,
                    belong: limian.faceRecognization.staffinfo.libraryName,
                    username: limian.faceRecognization.staffinfo.staffName
                  },
                  alarminfoid: waimian.alarminfoid,
                  zhuapaipic: photoinfo2.imageUri || _this.defaultHeader, //
                  kulipic: staffinfo.photoUri || _this.defaultHeader,
                  taskname: limian.taskname,
                  zhuapai: limian.faceRecognization.channelName,
                  alarmtime: waimian.alarmtime,
                  xiangsidu: parseInt(limian.faceRecognization.scores) + "%",
                  percent: parseInt(limian.faceRecognization.scores),
                  staffname: limian.faceRecognization.staffinfo.staffName,
                  // idcard: limian.faceRecognization.staffinfo.idcard,
                  idcard: "",
                  belong: limian.faceRecognization.staffinfo.libraryName,
                  dealstate: _this.statusChange(waimian.dealstate)
                });
              }
            }
            console.log("num==", num);
            this.totalCompareItemList = num;
            this.totalCompareItemList = this.totalCompareItemList.reverse();
            this.pageSize = parseInt(Math.ceil(Number(this.totalCompareItemList.length) / 4)) * 4;
            if (this.pageSize === "4") {
              this.pageSize = 8;
            } else if (this.pageSize === "0") {
              this.pageSize = 8;
            }
            console.log("pageSize==", this.pageSize);
          }
        })
        .catch(err => {
          this.mainDetailLoading = false;
          console.log("请求错误：" + err);
        });

      // this.pageSize=(parseInt(Number(this.totalCompareItemList1.length)/4)+1)*4;
      // this.totalCompareItemList=this.totalCompareItemList1;
    },
    statusChange(val) {
      var str = val;
      for (let i = 0; i < this.statusZnarr.length; i++) {
        if (this.statusZnarr[i].typestr === val) {
          str = this.statusZnarr[i].typename;
          break;
        }
      }
      return str;
    },
    newControlTask() {
      // 新建布控任务
      var channelArr = [];
      for (let i = 0; i < this.newVideoSource.length; i++) {
        var obj = {
          channelName: "",
          channeltype: "",
          channeluuid: this.newVideoSource[i]
        };
        channelArr.push(obj);
      }
      console.log("channelArr==", channelArr);
      this.$http
        .post(this.api + "/mppr-model/face/v2/dispatching/task", {
          taskname: this.newTaskName,
          faceLibs: this.newFaceLibs,
          channelLibs: channelArr,
          threshold: this.newThreshold,
          level: this.newImageIquality,
          alarmed: this.isAlarmSource,
          ispopup: this.isOpenAlarm,
          enabled: this.isStartTask,
          reason: this.newTaskReason
        })
        .then(res => {
          if (res.data.result === 0) {
            this.diglogvisible = false;
            this.initTaskList();
            console.log("新建布控成功====", res);
          } else {
            this.diglogvisible = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    editControlTask() {
      // 编辑布控任务
      var channelArr = [];
      for (let i = 0; i < this.editVideoSource.length; i++) {
        var obj = {
          channelName: "",
          channeltype: "",
          channeluuid: this.editVideoSource[i]
        };
        channelArr.push(obj);
      }
      console.log("channelArr==", channelArr);
      this.$http
        .post(this.api + "/mppr-model/face/v2/dispatching/task", {
          taskname: this.editTaskName,
          faceLibs: this.editFaceLibs,
          channelLibs: channelArr,
          threshold: this.editThreshold,
          level: this.editImageIquality,
          alarmed: this.editAlarmSource,
          ispopup: this.editOpenAlarm,
          enabled: this.editStartTask,
          reason: this.editTaskReason,
          taskuuid: this.taskuuid
        })
        .then(res => {
          if (res.data.result === 0) {
            this.editDiglogvisible = false;
            this.initTaskList();
            console.log("新建布控成功====", res);
          } else {
            this.editDiglogvisible = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    deleteTask() {
      console.log("删除布控uuid==", this.taskuuid);
      this.$http
        .delete(
          this.api +
						"/mppr-model/face/v2/dispatching/task?taskuuid=" +
						this.taskuuid
        )
        .then(res => {
          console.log("res==", res);
          if (res.data.result === 0) {
            this.deleteDiglogvisible = false;
            this.isActive = true;
            this.initTaskList();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.deleteDiglogvisible = false;
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => {
          this.deleteDiglogvisible = false;
          console.log("请求错误：" + err);
        });
    },
    switchChange(row) {
      // 一键开启或关闭
      console.log("this.switchTask==", this.switchTask);
      this.$http
        .put(
          this.api +
						"/mppr-model/face/v2/dispatching/task/status?taskuuid=" +
						this.taskuuid +
						"&enabled=" +
						this.switchTask
        )
        .then(res => {
          console.log("res==", res);
          if (res.data.result === 0) {
            this.isActive = true;
            this.initTaskList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.switchTask = !this.switchTask;
          }
          this.taskuuid = this.inUseList[0].modeluuid;
          this.idx = 0;
          this.viewTaskDetails();
        })
        .catch(err => {
          this.switchTask = !this.switchTask;
          console.log("请求错误：" + err);
        });
    },
    editTaskInit() {
      this.checkedCities1 = [];
      this.mainEditLoading = true;
      this.$http
        .get(
          this.api +
						"/mppr-model/face/v2/dispatching/task/detail?taskuuid=" +
						this.taskuuid
        )
        .then(res => {
          console.log("查看布控任务详情====", res);
          this.mainEditLoading = false;
          this.editTaskName = res.data.data.taskname;
          this.editTaskReason = res.data.data.reason;
          this.editThreshold = res.data.data.threshold;
          this.editOpenAlarm = res.data.data.ispopup; // 是否弹窗
          this.editAlarmSource = res.data.data.alarmed; // 是否报警
          this.editStartTask = res.data.data.enabled;
          this.editImageIquality = res.data.data.level;
          this.editFaceLibs = [];
          for (let i = 0; i < res.data.data.faceLibs.length; i++) {
            this.editFaceLibs.push(res.data.data.faceLibs[i].libraryuuid);
          }
          this.editVideoSource = [];
          for (let i = 0; i < res.data.data.channelLibs.length; i++) {
            this.editVideoSource.push(res.data.data.channelLibs[i].channeluuid);
          }
          this.checkedCities1 = this.editVideoSource;
        })
        .catch(err => {
          this.mainEditLoading = false;
          console.log("请求错误：" + err);
        });
      this.editDiglogvisible = true;
    },
    clearAction(e) {
      console.log("清除----");
      if (e === 1) {
        this.checkedTaskNameString = "";
        this.checkedTaskUuidList = [];
      } else if (e === 1) {
      } else {
        this.checkFaceDBNameString = "";
        this.checkedFaceUuidList = [];
      }
    },
    // 弹窗展开的回调
    popverShow(e) {
      if (e === 1) {
        // 任务树
        this.$refs.tree1.setCheckedKeys(this.checkedTaskUuidList);
      } else if (e === 2) {
        // 设备树
      } else if (e === 3) {
        // 任务树
      } else {
        console.log("其他异常");
      }
    },
    // 弹窗消失的回调
    popverHidden(e) {
      if (e === 1) {
        // 任务树
        this.getFaceLibsAndDeviceList(this.checkedTaskUuidList);
        if (this.checkedTaskObj && this.checkedTaskObj.length) {
          this.checkedTaskNameString = "";
          for (let i = 0; i < this.checkedTaskObj.length; i++) {
            var item = this.checkedTaskObj[i];
            this.checkedTaskNameString += item.taskname;
            this.checkedTaskNameString += ",";
          }
        } else {
          this.checkedTaskNameString = "全部任务";
        }
      } else if (e === 2) {
      } else if (e === 3) {
        // 任务树
        if (this.checkedFaceLibObj && this.checkedFaceLibObj.length) {
          this.checkFaceDBNameString = "";
          for (let i = 0; i < this.checkedFaceLibObj.length; i++) {
            let item = this.checkedFaceLibObj[i];
            this.checkFaceDBNameString += item.libraryname;
            this.checkFaceDBNameString += ",";
          }
        } else {
          this.checkedTaskNameString = "全部对比库";
        }
      } else {
        console.log("其他异常");
      }
    },
    transferCheckedChannel(checkedChannel) {
      this.checkedChannelObj = checkedChannel;
      this.newVideoSource = [];
      // 设备树
      if (this.checkedChannelObj && this.checkedChannelObj.length) {
        //  this.checkNameString = '';
        for (let i = 0; i < this.checkedChannelObj.length; i++) {
          var item = this.checkedChannelObj[i];
          this.newVideoSource.push(item.id);
          // this.checkNameString += item.channelName;
          // this.checkNameString += ',';
        }
      } else {
        this.checkNameString = "全部设备";
      }
      console.log("checkedChannelsUuidList==", this.newVideoSource);
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.citiesuuid : [];
      this.isIndeterminate = false;
      this.newVideoSource = this.checkedCities;
    },
    handleCheckedCitiesChange(value) {
      console.log("handleCheckedCitiesChange==", value);
      this.newVideoSource = value;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleCheckAllChange1(val) {
      this.checkedCities1 = val ? this.citiesuuid : [];
      this.isIndeterminate1 = false;
      this.editVideoSource = this.checkedCities1;
    },
    handleCheckedCitiesChange1(value) {
      console.log("handleCheckedCitiesChange==", value);
      this.editVideoSource = value;
      let checkedCount = value.length;
      this.checkAll1 = checkedCount === this.cities1.length;
      this.isIndeterminate1 =
				checkedCount > 0 && checkedCount < this.cities1.length;
    }
  },
  data() {
    return {
      checkAll1: false,
      checkedCities1: [],
      cities1: [],
      isIndeterminate1: true,
      citiesuuid: [],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      visible_popver: false,
      visible: false,
      initChcekedKeys: [
        "06D3AE6054044026A7AE1AE361332BBD",
        "26c2bd47ffe04a539839c2ce8445f9a7"
      ],
      CompareRecordPopoverClass: "CompareRecordPopoverClass",
      statusZnarr: [],
      defaultHeader: require("@/assets/user.png"),
      mainsSearchLoading: false,
      taskuuid: "",
      mainEditLoading: false,
      mainDetailLoading: false,
      mainListLoading: false,
      disableTask: [], // 停用任务
      enableTask: [], // 在用任务
      deleteDiglogvisible: false,
      editTaskName: "",
      editFaceLibs: "",
      editVideoSource: "",
      editThreshold: "",
      editImageIquality: "高",
      editAlarmSource: true,
      editOpenAlarm: true,
      editStartTask: true,
      editTaskReason: "",
      newTaskName: "",
      newFaceLibs: "",
      faceLibsList: [],
      newVideoSource: "",
      videoSourceList: [],
      newThreshold: "",
      newImageIquality: "HIGH",
      newTaskReason: "",
      imageIquality: [
        {
          name: "高",
          uuid: "HIGH"
        },
        {
          name: "中",
          uuid: "NORMAL"
        },
        {
          name: "低",
          uuid: "LOW"
        }
      ],
      isActive: true,
      idx: 0, // 任务列表标记
      inUseList: [],
      api: this.$store.state.api, // 接口参数前缀
      isAlarmSource: true, // 是否做为报警源
      isOpenAlarm: false,
      isStartTask: false,
      diglogvisible: false,
      editDiglogvisible: false,
      switchTask: true,
      isShowFaceLibs: true, // 是否显示人脸库
      isShowCamera: true, // 是否显示视频源
      isShowMore: true, // 是否显示更多
      isAlarmResource: false,
      isAlarmDialog: false,
      taskName: "",
      createPeople: "",
      createTime: "",
      taskReason: "",
      threshold: "",
      imageQuality: "", // 抓拍图片质量
      alarmNumber: "",
      startTime: "",
      endTime: "",
      pageSize: 8,
      viewFaceLibs: [],
      cameraList: [],
      totalCompareItemList: []
    };
  }
};
</script>
<style lang="scss">
html {
	background: none;
}
.controlTask .el-scrollbar__wrap {
	overflow-x: hidden;
	overflow-y: auto;
}
.controlTask .el-slider__button-wrapper {
	display: none;
}
.controlTask {
	background: none;
	width: 100%;
	display: flex;
	flex-direction: row;
}
.controlTask .taskList {
	width: 26%;
	height: 100%;
	background: rgba(255, 255, 255, 0.03);
	padding: 40px 50px 0 50px;
	box-sizing: border-box;
}
.controlTask .taskList .list {
	width: 100%;
	height: 80%;
	margin-top: 20px;
}
.controlTask .taskList .list .singleTask {
	width: 98%;
	height: 50px;
	border: 1px solid rgba(40, 255, 187, 0.1);
	border-bottom: none;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.controlTask .taskList .list .listActive {
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
	background: rgba(40, 255, 187, 0.05);
	opacity: 0.8;
}
.controlTask .taskList .list .singleTask:last-child {
	border-bottom: 1px solid rgba(40, 255, 187, 0.1);
}
.controlTask .taskList .newMonitor {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.controlTask .taskList .newMonitor .add-btn {
	width: 140px;
	height: 40px;
	background: rgba(40, 255, 187, 0.15) url("../../../assets/images/add.png")
		no-repeat;
	border: 1px solid rgba(40, 255, 187, 0.7);
	border-radius: 3px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	padding-left: 40px;
	background-position: 20px center;
	background-size: 14px 14px;
	box-sizing: border-box;
}
.controlTask .taskList .chooseModel {
	width: 280px;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-bottom: 1px solid rgba(40, 255, 187, 0.1);
	box-sizing: border-box;
	margin-top: 40px;
}
.controlTask .taskList .chooseModel .inUse {
	width: 140px;
	height: 40px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.controlTask .taskList .chooseModel .outUse {
	width: 140px;
	height: 40px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.controlTask .taskList .chooseModel .UseActive {
	width: 140px;
	height: 40px;
	opacity: 0.6;
	background: rgba(40, 255, 187, 0.1);
	border: 1px solid rgba(40, 255, 187, 0.6);
	border-bottom: none;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.controlTask .taskDetail {
	width: 74%;
	height: 100%;
	background: #1c1d20;
	padding: 0 3%;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-y: scroll;
}
.controlTask .taskDetail .operation {
	width: 100%;
	height: 60px;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
	text-align: center;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
}
.controlTask .taskDetail .operation .status {
	margin-left: 27px;
	height: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
}
.controlTask .taskDetail .operation .status img {
	width: 14px;
}
.controlTask .taskDetail .operation .status span {
	margin-left: 7.7px;
}
.controlTask .taskDetail .operation .status:first-child span {
	margin-left: 2px;
}
.controlTask .taskDetail .operation .status .el-switch__core {
	height: 16px;
}
.controlTask
	.taskDetail
	.operation
	.status
	.el-switch.is-checked
	.el-switch__core::after {
	// left: 102%;
	// margin-left: -17px;
	top: -1px;
}
.controlTask .taskDetail .operation .status .el-switch__core:after {
	top: -1px;
}
.controlTask .taskDetail .createDetail {
	width: 100%;
	height: 40px;
	margin-top: 24px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
}
.controlTask .taskDetail .createDetail div {
	width: 23%;
	height: 40px;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 3px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 27px;
	box-sizing: border-box;
	overflow: hidden;
}
.controlTask .taskDetail .createDetail div span {
	margin-left: 14px;
}
.controlTask .el-checkbox__input.is-disabled .el-checkbox__inner {
	background-color: transparent;
	// border-radius: 2px
}
.controlTask .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
	background-color: #49c373;
	border-color: transparent;
}
.controlTask
	.el-checkbox__input.is-disabled.is-checked
	.el-checkbox__inner::after {
	border-color: #ffffff;
}
.controlTask .el-checkbox__inner {
	background-color: transparent;
}
.controlTask .is-checked .el-checkbox__input {
	background: transparent;
}
.controlTask .taskDetail .faceLibsTotal {
	width: 100%;
	height: auto;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 3px;
	margin-top: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.controlTask .taskDetail .faceLibsTotal .title {
	width: 100%;
	height: 40px;
	padding-left: 27px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.controlTask .taskDetail .faceLibsTotal .title img {
	width: 9px;
	margin-left: 32.5px;
}
.controlTask .taskDetail .faceLibsTotal .list {
	width: 100%;
	height: 40px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	padding-left: 91px;
	overflow: hidden;
	box-sizing: border-box;
}
.controlTask .taskDetail .faceLibsTotal .libs {
	width: 12%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 39px;
	float: left;
}
.controlTask .taskDetail .faceLibsTotal .list .libs img {
	width: 13.4px;
	height: 13.4px;
	margin-right: 5.6px;
}
.controlTask .taskDetail .cameraTotal {
	width: 100%;
	height: auto;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 3px;
	margin-top: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.controlTask .taskDetail .cameraTotal .title {
	width: 100%;
	height: 40px;
	padding-left: 27px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.controlTask .taskDetail .cameraTotal .title img {
	width: 9px;
	margin-left: 32.5px;
}
.controlTask .taskDetail .cameraTotal .list {
	width: 100%;
	height: 80px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	padding-left: 91px;
	overflow: hidden;
	box-sizing: border-box;
	position: relative;
}
.controlTask .taskDetail .cameraTotal .list .moreCamera {
	width: 43px;
	height: 14px;
	position: absolute;
	right: 3%;
	top: 50px;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
}
.controlTask .taskDetail .cameraTotal .list .moreCamera img {
	width: 9.7px;
	height: 11.5px;
	margin-left: 4px;
}
.controlTask .taskDetail .cameraTotal .libs {
	width: 12%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 39px;
	float: left;
}
.controlTask .taskDetail .cameraTotal .list .libs img {
	width: 13.4px;
	height: 13.4px;
	margin-right: 5.6px;
}
.controlTask .taskDetail .cameraTotal .list .libs span {
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	height: 20px;
}
.controlTask .alarmDetail {
	width: 100%;
	height: 80px;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-left: 27px;
	box-sizing: border-box;
}
.controlTask .alarmDetail .total {
	font-family: PingFangSC-Regular;
	font-size: 18px;
	color: #ffffff;
	letter-spacing: 0;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.controlTask .alarmDetail .total img {
	width: 24px;
	margin-right: 11px;
}
.controlTask .alarmDetail .search {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.controlTask .alarmDetail .search-btn {
	width: 120px;
	height: 40px;
	background: rgba(40, 255, 187, 0.1) url("../../../assets/images/search.png")
		no-repeat;
	border: 1px solid rgba(32, 204, 150, 0.6);
	border-radius: 2px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	padding-left: 40px;
	background-position: 36px center;
	background-size: 14px 14px;
	box-sizing: border-box;
	margin-left: 23px;
}
.controlTask .alarmDetail .route-btn {
	width: 166px;
	height: 40px;
	background: rgba(40, 255, 187, 0.1) url("../../../assets/images/record.png")
		no-repeat;
	border: 1px solid rgba(32, 204, 150, 0.6);
	border-radius: 2px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	padding-left: 35px;
	background-position: 17px center;
	background-size: 14px 14px;
	box-sizing: border-box;
	margin-left: 23px;
}
.controlTask .searchResult {
	width: 100%;
	height: 480px;
	padding-top: 24px;
}
.controlTask .searchResult .resultWrap {
	width: 23.8%;
	height: 220px;
	background: rgba(39, 42, 45, 0.5);
	border-radius: 3px;
	float: left;
	margin: 0 1.2% 20px 0;
	padding: 13px 0 15px 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
}
.controlTask .searchResult .resultWrap .leftCon {
	width: 50%;
	height: 100%;
	border-right: 1px dashed rgba(255, 255, 255, 0.05);
	padding: 0 4.5%;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #aaaaaa;
}
.controlTask .searchResult .resultWrap .leftCon img {
	width: 100%;
	height: 117px;
}
.controlTask .searchResult .resultWrap .leftCon div {
	margin-top: 9px;
	text-align: left;
	width: 100%;
	height: 16px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.controlTask .searchResult .resultWrap .leftCon .similarity span:first-child {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
}
.controlTask .searchResult .resultWrap .leftCon .similarity span:last-child {
	font-family: 'PingFangSC-Medium';
	font-size: 14px;
	color: #28ffbb;
}
.controlTask .searchResult .resultWrap .rightCon {
	width: 50%;
	height: 100%;
	padding: 0 4.5%;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #aaaaaa;
}
.controlTask .searchResult .resultWrap .rightCon img {
	width: 100%;
	height: 117px;
}
.controlTask .searchResult .resultWrap .rightCon div {
	margin-top: 9px;
	text-align: left;
}
.controlTask .searchResult .resultWrap .rightCon .libs img {
	width: 11.5px;
	height: 11.5px;
}
.controlTask .taskDialog {
	padding-top: 30px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.controlTask .dialogItem {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	margin-bottom: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	// overflow: hidden;
}
.controlTask .dialogItem .title {
	width: 185px;
	height: 40px;
	text-align: right;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 15px;
}
.controlTask .dialogItem .el-input__inner {
	width: 360px;
	height: 40px;
}
.controlTask .dialogItem .el-input {
	width: 360px;
	height: 40px;
}
.controlTask .dialogItem2 {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	margin-bottom: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.controlTask .dialogItem2 .title {
	width: 306px;
	height: 40px;
	text-align: right;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 15px;
}
.controlTask .dialogItem2 .el-input__inner {
	width: 120px;
	height: 40px;
}
.controlTask .dialogItem2 .el-input {
	width: 120px;
	height: 40px;
}
.controlTask .dialogItem3 {
	width: 100%;
	height: 20px;
	display: flex;
	flex-direction: row;
	margin-bottom: 14px;
	align-items: center;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.controlTask .dialogItem3 .itemLabel {
	width: 240px;
	height: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 13px;
	box-sizing: border-box;
}
.controlTask .btnWrap {
	width: 100%;
	height: 40px;
	margin: 29px 0 40px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 186px;
	box-sizing: border-box;
}
.controlTask .btnWrap .confirm {
	width: 100px;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(40, 255, 187, 0.7);
	border-radius: 3px;
	margin-right: 20px;
}
.controlTask .btnWrap .cencel {
	width: 100px;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(40, 255, 187, 0.7);
	border-radius: 3px;
}
.controlTask .deleteDialog {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
	letter-spacing: 0;
}
.controlTask .deleteDialog .deleteText {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
	letter-spacing: 0;
	width: 100%;
	height: 28px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 35px;
}
.controlTask .deleteDialog .deleteText img {
	width: 26.7px;
	height: 28px;
	margin-right: 24.3px;
}
.controlTask .deleteDialog .deleteBtn {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 60px 0 25px;
}
.controlTask .deleteDialog .deleteBtn div {
	width: 100px;
	height: 40px;
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(40, 255, 187, 0.7);
	border-radius: 3px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.controlTask .deleteDialog .deleteBtn div:first-child {
	margin-right: 25px;
}
.controlTask .el-dialog--center .el-dialog__body {
	padding: 0;
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
