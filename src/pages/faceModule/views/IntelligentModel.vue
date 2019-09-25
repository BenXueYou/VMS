<template>
	<div class="container intelligentModel" id="container">
		<div class="taskList" v-loading="mainListLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
			<div class="newMonitor">
				<el-button
					class="add-btn"
					type="primary"
					@click="newModelTask(),diglogvisible=true,checkedCities=[]"
				>新建模型任务</el-button>
			</div>
			<div class="chooseModel">
				<div
					class="inUse"
					:class="[isActive === true?'UseActive':'']"
					@click.stop="chooseInModel"
				>在用模型&nbsp;({{this.enableTask.length}})</div>
				<div
					class="outUse"
					:class="[!isActive === true?'UseActive':'']"
					@click.stop="chooseOutModel"
				>停用模型&nbsp;({{this.disableTask.length}})</div>
			</div>
			<div class="list">
				<el-scrollbar style="height: 100%">
					<div
						class="singleTask"
						:class="[idx === index?'listActive':'']"
						v-for="(item,index) in inUseList"
						:key="index"
						@click="viewTaskDetails(item,index)"
					>{{item.modelname}}</div>
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
					<div class="status" @click="editModelInit">
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
					<div>模型备注：{{taskReason}}</div>
				</div>
				<div class="faceLibsTotal">
					<div class="title" @click.stop="viewFaceLibas">
						<span>人脸库： 共{{viewFaceLibs.length}}个人脸库</span>
						<img src="@/assets/images/select-down.png" />
					</div>
					<div class="list" id="list">
						<div class="libs" id="libs" v-for="(item,index) in viewFaceLibs" :key="index">
							<!--   <img src="@/assets/images/whiteLibs.png" v-if="item.value==='白名单库'"/>
                            <img src="@/assets/images/staffLibs.png" v-if="item.value==='工作人员库'"/>
                            <img src="@/assets/images/escapedLibs.png" v-if="item.value==='逃犯库'"/>
							<img src="@/assets/images/blackLibs.png" v-if="item.value==='黑名单库'"/>-->
							<span>{{item.libraryname}}</span>
						</div>
					</div>
				</div>
				<div class="createDetail">
					<div>相似度：{{threshold}}%</div>
					<div>
						<el-checkbox v-model="isAlarmResource" disabled></el-checkbox>
						<span>是否开启报警弹窗</span>
					</div>
					<div>人脸抓拍图片需达到的质量：{{imageQuality}}</div>
					<div style="background: transparent;"></div>
				</div>
				<div class="cameraTotal">
					<div class="title" @click.stop="viewCamera">
						<span>探测规则</span>
						<img src="@/assets/images/select-down.png" />
					</div>
					<div class="cameraListWrap">
						<div class="timeRange">
							时间段：
							<span
								v-for="(item,index) in timeFieldList"
								:key="index"
							>{{item.beginTime}}至{{item.endTime}}&nbsp;&nbsp;</span>
						</div>
						<div class="recentlyCamera" id="recentlyCamera">
							<div class="title">最近{{viewNearlyDays}}天，{{viewNearlyRule}}满足</div>
							<div class="libs2" id="cameraLibs" v-for="(item,index) in cameraList" :key="index">
								<img src="@/assets/images/captureDevice.png" />
								<span>{{item.channelName}}</span>
							</div>
							<!--    <div class="moreCamera1" @click.stop="viewAllCamera" v-show="cameraList.length>6">
                                <span>更多</span>
                                <img src="@/assets/images/more.png"/>
							</div>-->
						</div>
						<div class="timeRange">抓拍次数 {{viewVideoRule}} {{viewFrequency}}，且至少 {{viewSnapNum}} 个摄像机有抓拍</div>
						<div class="conformCamera" id="conformCamera" v-if="conformCamList.length>0">
							<div class="title">同时符合：</div>
							<div class="libs1" id="cameraLibs" v-for="(item,index) in conformCamList" :key="index">
								<img src="@/assets/images/captureDevice.png" />
								<span>{{item}}</span>
							</div>
							<!--      <div class="moreCamera2" @click.stop="viewAllCamera1" v-show="conformCamList.length>14">
                                <span>更多</span>
                                <img src="@/assets/images/more.png"/>
							</div>-->
						</div>
						<div class="inConformCamera" id="inConformCamera" v-if="inConformCamList.length>0">
							<div class="title">同时不符合：</div>
							<div class="libs1" id="cameraLibs" v-for="(item,index) in inConformCamList" :key="index">
								<img src="@/assets/images/captureDevice.png" />
								<span>{{item}}</span>
							</div>
							<!--  <div class="moreCamera2" @click.stop="viewAllCamera2" v-show="conformCamList.length>14">
                                <span>更多</span>
                                <img src="@/assets/images/more.png"/>
							</div>-->
						</div>
						<div class="timeRange" v-if="excludeFaceLibs.length>0">
							排除人脸库：
							<span v-for="(item,index) in excludeFaceLibs" :key="index">{{item.libraryname}}；</span>
						</div>
						<div class="timeRange" v-if="timeInterval">两次抓拍间隔：{{timeInterval}}秒</div>
					</div>
				</div>
				<div class="createDetail">
					<div>处理确认入库：{{confirmLibName}}</div>
					<div>处理无效入库：{{cancelLibName}}</div>
					<div style="background: transparent;"></div>
					<div style="background: transparent;"></div>
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
				</div>
			</div>
			<div
				class="searchResult"
				v-loading="mainSearchLoading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			>
				<div class="resultWrap" v-for="(o, index) in pageSize" :key="index">
					<img
						:src="totalCompareItemList.length>index?JSON.parse(totalCompareItemList[totalCompareItemList.length-index-1].imageUri):require('@/assets/user.png')"
					/>
					<div>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].time:'抓拍时间'}}</div>
					<div>{{totalCompareItemList.length>index?JSON.parse(totalCompareItemList[totalCompareItemList.length-index-1].channelName):'未知任务通道'}}</div>
				</div>
			</div>
		</div>
		<el-dialog
			:title="'新建模型任务'"
			:visible.sync="diglogvisible"
			@close="diglogvisible=false"
			:close-on-click-modal="false"
			width="920px"
			center
			class="taskDialog"
		>
			<div
				style="padding: 25px 0 30px 25px;height:600px;overflow-y: scroll;overflow-x: hidden;box-sizing: border-box;width: 100%;"
			>
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
					<div class="title">阙值：</div>
					<el-input v-model="newThreshold"></el-input>
				</div>
				<div class="dialogItem">
					<div class="title">备注：</div>
					<el-input v-model="newRemark"></el-input>
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

				<div class="dialogItem">
					<div class="title">时间段：</div>
					<div class="timeWrap">
						<el-time-picker
							v-model="startTimeValue"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
					</div>
				</div>
				<div class="dialogTimeWrap">
					<div class="timeItem" v-show="isTimeWrap1">
						<el-time-picker
							v-model="startTimeValue1"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue1"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap1=false,startTimeValue1='',endTimeValue1=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap2">
						<el-time-picker
							v-model="startTimeValue2"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue2"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap2=false,startTimeValue2='',endTimeValue2=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap3">
						<el-time-picker
							v-model="startTimeValue3"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue3"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap3=false,startTimeValue3='',endTimeValue3=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap4">
						<el-time-picker
							v-model="startTimeValue4"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue4"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap4=false,startTimeValue4='',endTimeValue4=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap5">
						<el-time-picker
							v-model="startTimeValue5"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue5"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap5=false,startTimeValue5='',endTimeValue5=''"
						/>
					</div>
				</div>
				<div class="dialogItem">
					<div class="title">最近</div>
					<div class="recently">
						<el-input v-model="nearlyDays"></el-input>
						<span class="sp1">天</span>
						<el-select v-model="recentlyValue">
							<el-option
								v-for="item in recentlyRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<span class="sp2">满足</span>
					</div>
				</div>
				<div class="videoResouce">
					<!-- <el-select v-model="videoSource" multiple collapse-tags placeholder="请选择视频源" class="vs1">
                            <el-option  style="width: 200px;"
                              v-for="item in videoSourceList"
                              :key="item.channeluuid"
                              :label="item.channelName"
                              :value="item.channeluuid">
                            </el-option>
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
							class="vs1"
							slot="reference"
							v-model="videoSource"
							multiple
							collapse-tags
							placeholder="请选择视频源"
							disabled
						>
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
					</el-popover>
					<el-select v-model="videoRule" placeholder="请选择规则">
						<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
					<el-input v-model="videoFrequency"></el-input>
					<span>次</span>
					<span class="sp1">且至少</span>
					<el-input v-model="newSnapVideoNum"></el-input>
					<span class="sp2">个摄像机有抓拍</span>
					<img src="@/assets/images/plus.png" @click="addVideoRes" />
				</div>
				<div class="videoResWrap" v-show="isVideoResWrap">
					<div class="videoResItem" v-show="isVideoRes1">
						<el-select v-model="conformValue1" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource1" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule1" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency1" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes1=false,videoSource1='',videoRule1='',videoFrequency1=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes2">
						<el-select v-model="conformValue2" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource2" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule2" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency2" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes2=false,videoSource2='',videoRule2='',videoFrequency2=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes3">
						<el-select v-model="conformValue3" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource3" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule3" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency3" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes3=false,videoSource3='',videoRule3='',videoFrequency3=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes4">
						<el-select v-model="conformValue4" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource4" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule4" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency4" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes4=false,videoSource4='',videoRule4='',videoFrequency4=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes5">
						<el-select v-model="conformValue5" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource5" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule5" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency5" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes5=false,videoSource5='',videoRule5='',videoFrequency5=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes6">
						<el-select v-model="conformValue6" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource6" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule6" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency6" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes6=false,videoSource6='',videoRule6='',videoFrequency6=''"
						/>
					</div>
				</div>
				<div class="dialogItem dialogItem1">
					<div class="title">排除</div>
					<el-select v-model="excludeLibs" multiple collapse-tags placeholder="请选择人脸库">
						<el-option
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="snapTimeGap">
					<div class="title">两次抓拍间隔：</div>
					<div class="snapTimeInput">
						<el-input v-model="twoSnapGap"></el-input>
					</div>
					<span>秒</span>
				</div>
				<div class="dealInLib">
					<div class="title">处理确认入库：</div>
					<el-select v-model="confirmLibs" placeholder="请选择人脸库" class="vs1">
						<el-option
							style="width: 200px;"
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="dealInLib">
					<div class="title">处理无效入库：</div>
					<el-select v-model="invalidLibs" placeholder="请选择人脸库" class="vs1">
						<el-option
							style="width: 200px;"
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isStartTask"></el-checkbox>
					</div>
					<div class="text">是否启动任务</div>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isOpenAlarm"></el-checkbox>
					</div>
					<div class="text">是否开启报警弹窗</div>
				</div>
				<div class="btnWrap">
					<div class="confirm" @click="newControlTask">确定</div>
					<div class="cencel" @click="diglogvisible=false">取消</div>
				</div>
			</div>
		</el-dialog>
		<el-dialog
			:title="'编辑模型任务'"
			:visible.sync="editDiglogvisible"
			@close="editDiglogvisible=false"
			width="920px"
			center
			class="taskDialog"
		>
			<div
				style="padding: 25px 0 30px 25px;height:600px;overflow-y: scroll;overflow-x: hidden;box-sizing: border-box;width: 100%;"
				v-loading="mainEditLoading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			>
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
					<div class="title">阙值：</div>
					<el-input v-model="newThreshold"></el-input>
				</div>
				<div class="dialogItem">
					<div class="title">备注：</div>
					<el-input v-model="newRemark"></el-input>
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

				<div class="dialogItem">
					<div class="title">时间段：</div>
					<div class="timeWrap">
						<el-time-picker
							v-model="startTimeValue"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
					</div>
				</div>
				<div class="dialogTimeWrap">
					<div class="timeItem" v-show="isTimeWrap1">
						<el-time-picker
							v-model="startTimeValue1"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue1"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap1=false,startTimeValue1='',endTimeValue1=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap2">
						<el-time-picker
							v-model="startTimeValue2"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue2"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap2=false,startTimeValue2='',endTimeValue2=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap3">
						<el-time-picker
							v-model="startTimeValue3"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue3"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap3=false,startTimeValue3='',endTimeValue3=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap4">
						<el-time-picker
							v-model="startTimeValue4"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue4"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap4=false,startTimeValue4='',endTimeValue4=''"
						/>
					</div>
					<div class="timeItem" v-show="isTimeWrap5">
						<el-time-picker
							v-model="startTimeValue5"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<span>至</span>
						<el-time-picker
							v-model="endTimeValue5"
							value-format="HH:mm:ss"
							format="HH:mm"
							placeholder="请选择时间"
						></el-time-picker>
						<img src="@/assets/images/plus.png" @click="addTimeItem" />
						<img
							src="@/assets/images/subtract.png"
							@click="isTimeWrap5=false,startTimeValue5='',endTimeValue5=''"
						/>
					</div>
				</div>
				<div class="dialogItem">
					<div class="title">最近</div>
					<div class="recently">
						<el-input v-model="nearlyDays"></el-input>
						<span class="sp1">天</span>
						<el-select v-model="recentlyValue">
							<el-option
								v-for="item in recentlyRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<span class="sp2">满足</span>
					</div>
				</div>
				<div class="videoResouce">
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
							v-model="videoSource"
							multiple
							collapse-tags
							placeholder="请选择视频源"
							disabled
							class="vs1"
						>
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
					</el-popover>
					<!-- <el-select v-model="videoSource" multiple collapse-tags placeholder="请选择视频源" class="vs1">
                            <el-option  style="width: 200px;"
                              v-for="item in videoSourceList"
                              :key="item.channeluuid"
                              :label="item.channelName"
                              :value="item.channeluuid">
                            </el-option>
					</el-select>-->
					<el-select v-model="videoRule" placeholder="请选择规则">
						<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
					<el-input v-model="videoFrequency"></el-input>
					<span>次</span>
					<span class="sp1">且至少</span>
					<el-input v-model="newSnapVideoNum"></el-input>
					<span class="sp2">个摄像机有抓拍</span>
					<img src="@/assets/images/plus.png" @click="addVideoRes" />
				</div>
				<div class="videoResWrap" v-show="isVideoResWrap">
					<div class="videoResItem" v-show="isVideoRes1">
						<el-select v-model="conformValue1" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource1" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule1" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency1" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes1=false,videoSource1='',videoRule1='',videoFrequency1=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes2">
						<el-select v-model="conformValue2" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource2" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule2" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency2" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes2=false,videoSource2='',videoRule2='',videoFrequency2=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes3">
						<el-select v-model="conformValue3" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource3" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule3" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency3" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes3=false,videoSource3='',videoRule3='',videoFrequency3=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes4">
						<el-select v-model="conformValue4" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource4" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule4" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency4" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes4=false,videoSource4='',videoRule4='',videoFrequency4=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes5">
						<el-select v-model="conformValue5" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource5" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule5" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency5" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes5=false,videoSource5='',videoRule5='',videoFrequency5=''"
						/>
					</div>
					<div class="videoResItem" v-show="isVideoRes6">
						<el-select v-model="conformValue6" class="vs4">
							<el-option
								style="width: 120px;"
								v-for="item in conformRule"
								:key="item.uuid"
								:label="item.name"
								:value="item.uuid"
							></el-option>
						</el-select>
						<el-select v-model="videoSource6" multiple collapse-tags placeholder="请选择视频源" class="vs1">
							<el-option
								style="width: 200px;"
								v-for="item in videoSourceList"
								:key="item.channeluuid"
								:label="item.channelName"
								:value="item.channeluuid"
							></el-option>
						</el-select>
						<el-select v-model="videoRule6" class="vs2">
							<el-option v-for="item in videoRuleList" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-input v-model="videoFrequency6" class="vs3"></el-input>
						<span>次</span>
						<img class="img1" src="@/assets/images/plus.png" @click="addVideoRes" />
						<img
							src="@/assets/images/subtract.png"
							@click="isVideoRes6=false,videoSource6='',videoRule6='',videoFrequency6=''"
						/>
					</div>
				</div>
				<div class="dialogItem dialogItem1">
					<div class="title">排除</div>
					<el-select v-model="excludeLibs" multiple collapse-tags placeholder="请选择人脸库">
						<el-option
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="snapTimeGap">
					<div class="title">两次抓拍间隔：</div>
					<div class="snapTimeInput">
						<el-input v-model="twoSnapGap"></el-input>
					</div>
					<span>秒</span>
				</div>
				<div class="dealInLib">
					<div class="title">处理确认入库：</div>
					<el-select v-model="confirmLibs" placeholder="请选择视频源" class="vs1">
						<el-option
							style="width: 200px;"
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="dealInLib">
					<div class="title">处理无效入库：</div>
					<el-select v-model="invalidLibs" placeholder="请选择视频源" class="vs1">
						<el-option
							style="width: 200px;"
							v-for="item in faceLibsList"
							:key="item.libraryuuid"
							:label="item.libraryname"
							:value="item.libraryuuid"
						></el-option>
					</el-select>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isStartTask"></el-checkbox>
					</div>
					<div class="text">是否启动任务</div>
				</div>
				<div class="dialogItem3">
					<div class="itemLabel">
						<el-checkbox v-model="isOpenAlarm"></el-checkbox>
					</div>
					<div class="text">是否开启报警弹窗</div>
				</div>
				<div class="btnWrap">
					<div class="confirm" @click="editControlTask">确定</div>
					<div class="cencel" @click="diglogvisible=false">取消</div>
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
					<div @click="deleteModel">确定</div>
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
      .get(this.api + "/mppr-model/face/v2/faceLib/list")
      .then(res => {
        console.log("初始化人脸库=====", res);
        this.faceLibsList = res.data.data;
      })
      .catch(err => {
        console.log("请求错误：" + err);
      });
    this.$http
      .post(this.api + "/mppr-model/face/v2/channelInfo/list", [
        "face_ipc",
        "face_recog_ipc",
        "body_snap_ipc"
      ])
      .then(res => {
        console.log("初始化视频源=====", res);
        this.videoSourceList = res.data.data;
        for (let i = 0; i < res.data.data.length; i++) {
          // let obj = {
          //  id:res.data.data[i].channeluuid,
          //  label:res.data.data[i].channelName
          // }
          this.citiesuuid.push(res.data.data[i].channeluuid);
          // this.videoSourceList[i].channeluuid=this.videoSourceList[i].id;
          // this.videoSourceList[i].channelName=this.videoSourceList[i].label;
        }
        this.cities = res.data.data;
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
    editModelInit() {
      this.checkedCities1 = [];
      this.newModelTask();
      this.editDiglogvisible = true;
      this.mainEditLoading = true;
      this.$http
        .get(
          this.api +
						"/mppr-model/face/v2/analysis/model/detail?modeluuid=" +
						this.modeluuid
        )
        .then(res => {
          console.log("查看智能模型详情=====", res);
          this.mainEditLoading = false;
          this.newTaskName = res.data.data.modelname;
          for (let i = 0; i < res.data.data.faceLibs.length; i++) {
            this.newFaceLibs.push(res.data.data.faceLibs[i].libraryuuid);
          }
          this.newThreshold = res.data.data.threshold;
          this.newRemark = res.data.data.remarks;
          this.newImageIquality = res.data.data.level;
          console.log(res.data.data.detectedrule.timeField.length);
          if (res.data.data.detectedrule.timeField.length === "1") {
            this.isTimeWrap1 = false;
            this.isTimeWrap2 = false;
            this.isTimeWrap3 = false;
            this.isTimeWrap4 = false;
            this.isTimeWrap5 = false;
            this.startTimeValue =
							res.data.data.detectedrule.timeField[0].beginTime;
            this.endTimeValue = res.data.data.detectedrule.timeField[0].endTime;
          } else if (res.data.data.detectedrule.timeField.length === "2") {
            this.isTimeWrap1 = true;
            this.isTimeWrap2 = false;
            this.isTimeWrap3 = false;
            this.isTimeWrap4 = false;
            this.isTimeWrap5 = false;
            this.startTimeValue =
							res.data.data.detectedrule.timeField[0].beginTime;
            this.endTimeValue = res.data.data.detectedrule.timeField[0].endTime;
            this.startTimeValue1 =
							res.data.data.detectedrule.timeField[1].beginTime;
            this.endTimeValue1 =
							res.data.data.detectedrule.timeField[1].endTime;
          } else if (res.data.data.detectedrule.timeField.length === "3") {
            this.isTimeWrap1 = true;
            this.isTimeWrap2 = true;
            this.isTimeWrap3 = false;
            this.isTimeWrap4 = false;
            this.isTimeWrap5 = false;
            this.startTimeValue =
							res.data.data.detectedrule.timeField[0].beginTime;
            this.endTimeValue = res.data.data.detectedrule.timeField[0].endTime;
            this.startTimeValue1 =
							res.data.data.detectedrule.timeField[1].beginTime;
            this.endTimeValue1 =
							res.data.data.detectedrule.timeField[1].endTime;
            this.startTimeValue2 =
							res.data.data.detectedrule.timeField[2].beginTime;
            this.endTimeValue2 =
							res.data.data.detectedrule.timeField[2].endTime;
          } else if (res.data.data.detectedrule.timeField.length === "4") {
            this.isTimeWrap1 = true;
            this.isTimeWrap2 = true;
            this.isTimeWrap3 = true;
            this.isTimeWrap4 = false;
            this.isTimeWrap5 = false;
            this.startTimeValue =
							res.data.data.detectedrule.timeField[0].beginTime;
            this.endTimeValue = res.data.data.detectedrule.timeField[0].endTime;
            this.startTimeValue1 =
							res.data.data.detectedrule.timeField[1].beginTime;
            this.endTimeValue1 =
							res.data.data.detectedrule.timeField[1].endTime;
            this.startTimeValue2 =
							res.data.data.detectedrule.timeField[2].beginTime;
            this.endTimeValue2 =
							res.data.data.detectedrule.timeField[2].endTime;
            this.startTimeValue3 =
							res.data.data.detectedrule.timeField[3].beginTime;
            this.endTimeValue3 =
							res.data.data.detectedrule.timeField[3].endTime;
          } else if (res.data.data.detectedrule.timeField.length === "5") {
            this.isTimeWrap1 = true;
            this.isTimeWrap2 = true;
            this.isTimeWrap3 = true;
            this.isTimeWrap4 = true;
            this.isTimeWrap5 = false;
            this.startTimeValue =
							res.data.data.detectedrule.timeField[0].beginTime;
            this.endTimeValue = res.data.data.detectedrule.timeField[0].endTime;
            this.startTimeValue1 =
							res.data.data.detectedrule.timeField[1].beginTime;
            this.endTimeValue1 =
							res.data.data.detectedrule.timeField[1].endTime;
            this.startTimeValue2 =
							res.data.data.detectedrule.timeField[2].beginTime;
            this.endTimeValue2 =
							res.data.data.detectedrule.timeField[2].endTime;
            this.startTimeValue3 =
							res.data.data.detectedrule.timeField[3].beginTime;
            this.endTimeValue3 =
							res.data.data.detectedrule.timeField[3].endTime;
            this.startTimeValue4 =
							res.data.data.detectedrule.timeField[4].beginTime;
            this.endTimeValue4 =
							res.data.data.detectedrule.timeField[4].endTime;
          } else if (res.data.data.detectedrule.timeField.length === "6") {
            this.isTimeWrap1 = true;
            this.isTimeWrap2 = true;
            this.isTimeWrap3 = true;
            this.isTimeWrap4 = true;
            this.isTimeWrap5 = true;
            this.startTimeValue =
							res.data.data.detectedrule.timeField[0].beginTime;
            this.endTimeValue = res.data.data.detectedrule.timeField[0].endTime;
            this.startTimeValue1 =
							res.data.data.detectedrule.timeField[1].beginTime;
            this.endTimeValue1 =
							res.data.data.detectedrule.timeField[1].endTime;
            this.startTimeValue2 =
							res.data.data.detectedrule.timeField[2].beginTime;
            this.endTimeValue2 =
							res.data.data.detectedrule.timeField[2].endTime;
            this.startTimeValue3 =
							res.data.data.detectedrule.timeField[3].beginTime;
            this.endTimeValue3 =
							res.data.data.detectedrule.timeField[3].endTime;
            this.startTimeValue4 =
							res.data.data.detectedrule.timeField[4].beginTime;
            this.endTimeValue4 =
							res.data.data.detectedrule.timeField[4].endTime;
            this.startTimeValue5 =
							res.data.data.detectedrule.timeField[5].beginTime;
            this.endTimeValue5 =
							res.data.data.detectedrule.timeField[5].endTime;
          }
          this.nearlyDays = res.data.data.detectedrule.days;
          this.recentlyValue = res.data.data.detectedrule.mode.enName;
          for (let i = 0; i < res.data.data.channelLibs.length; i++) {
            this.videoSource.push(res.data.data.channelLibs[i].channeluuid);
          }
          this.checkedCities1 = this.videoSource;
          this.videoRule = res.data.data.detectedrule.compareRule;
          this.videoFrequency = res.data.data.detectedrule.allCounts;
          this.newSnapVideoNum = res.data.data.detectedrule.atLeastCameras;
          console.log("length===", res.data.data.detectedrule.addtional.length);
          if (res.data.data.detectedrule.addtional.length === "1") {
            this.isVideoRes1 = true;
            this.isVideoRes2 = false;
            this.isVideoRes3 = false;
            this.isVideoRes4 = false;
            this.isVideoRes5 = false;
            this.isVideoRes6 = false;
            this.conformValue1 =
							res.data.data.detectedrule.addtional[0].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[0].channels.length;
              i++
            ) {
              this.videoSource1.push(
                res.data.data.detectedrule.addtional[0].channels[i].channeluuid
              );
            }
            this.videoRule1 =
							res.data.data.detectedrule.addtional[0].compareRule;
            this.videoFrequency1 =
							res.data.data.detectedrule.addtional[0].counts;
          } else if (res.data.data.detectedrule.addtional.length === "2") {
            this.isVideoRes1 = true;
            this.isVideoRes2 = true;
            this.isVideoRes3 = false;
            this.isVideoRes4 = false;
            this.isVideoRes5 = false;
            this.isVideoRes6 = false;
            this.conformValue1 =
							res.data.data.detectedrule.addtional[0].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[0].channels.length;
              i++
            ) {
              this.videoSource1.push(
                res.data.data.detectedrule.addtional[0].channels[i].channeluuid
              );
            }
            this.videoRule1 =
							res.data.data.detectedrule.addtional[0].compareRule;
            this.videoFrequency1 =
							res.data.data.detectedrule.addtional[0].counts;
            this.conformValue2 =
							res.data.data.detectedrule.addtional[1].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[1].channels.length;
              i++
            ) {
              this.videoSource2.push(
                res.data.data.detectedrule.addtional[1].channels[i].channeluuid
              );
            }
            this.videoRule2 =
							res.data.data.detectedrule.addtional[1].compareRule;
            this.videoFrequency2 =
							res.data.data.detectedrule.addtional[1].counts;
          } else if (res.data.data.detectedrule.addtional.length === "3") {
            this.isVideoRes1 = true;
            this.isVideoRes2 = true;
            this.isVideoRes3 = true;
            this.isVideoRes4 = false;
            this.isVideoRes5 = false;
            this.isVideoRes6 = false;
            this.conformValue1 =
							res.data.data.detectedrule.addtional[0].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[0].channels.length;
              i++
            ) {
              this.videoSource1.push(
                res.data.data.detectedrule.addtional[0].channels[i].channeluuid
              );
            }
            this.videoRule1 =
							res.data.data.detectedrule.addtional[0].compareRule;
            this.videoFrequency1 =
							res.data.data.detectedrule.addtional[0].counts;
            this.conformValue2 =
							res.data.data.detectedrule.addtional[1].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[1].channels.length;
              i++
            ) {
              this.videoSource2.push(
                res.data.data.detectedrule.addtional[1].channels[i].channeluuid
              );
            }
            this.videoRule2 =
							res.data.data.detectedrule.addtional[1].compareRule;
            this.videoFrequency2 =
							res.data.data.detectedrule.addtional[1].counts;
            this.conformValue3 =
							res.data.data.detectedrule.addtional[2].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[2].channels.length;
              i++
            ) {
              this.videoSource3.push(
                res.data.data.detectedrule.addtional[2].channels[i].channeluuid
              );
            }
            this.videoRule3 =
							res.data.data.detectedrule.addtional[2].compareRule;
            this.videoFrequency3 =
							res.data.data.detectedrule.addtional[2].counts;
          } else if (res.data.data.detectedrule.addtional.length === "4") {
            this.isVideoRes1 = true;
            this.isVideoRes2 = true;
            this.isVideoRes3 = true;
            this.isVideoRes4 = true;
            this.isVideoRes5 = false;
            this.isVideoRes6 = false;
            this.conformValue1 =
							res.data.data.detectedrule.addtional[0].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[0].channels.length;
              i++
            ) {
              this.videoSource1.push(
                res.data.data.detectedrule.addtional[0].channels[i].channeluuid
              );
            }
            this.videoRule1 =
							res.data.data.detectedrule.addtional[0].compareRule;
            this.videoFrequency1 =
							res.data.data.detectedrule.addtional[0].counts;
            this.conformValue2 =
							res.data.data.detectedrule.addtional[1].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[1].channels.length;
              i++
            ) {
              this.videoSource2.push(
                res.data.data.detectedrule.addtional[1].channels[i].channeluuid
              );
            }
            this.videoRule2 =
							res.data.data.detectedrule.addtional[1].compareRule;
            this.videoFrequency2 =
							res.data.data.detectedrule.addtional[1].counts;
            this.conformValue3 =
							res.data.data.detectedrule.addtional[2].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[2].channels.length;
              i++
            ) {
              this.videoSource3.push(
                res.data.data.detectedrule.addtional[2].channels[i].channeluuid
              );
            }
            this.videoRule3 =
							res.data.data.detectedrule.addtional[2].compareRule;
            this.videoFrequency3 =
							res.data.data.detectedrule.addtional[2].counts;
            this.conformValue4 =
							res.data.data.detectedrule.addtional[3].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[3].channels.length;
              i++
            ) {
              this.videoSource4.push(
                res.data.data.detectedrule.addtional[3].channels[i].channeluuid
              );
            }
            this.videoRule4 =
							res.data.data.detectedrule.addtional[3].compareRule;
            this.videoFrequency4 =
							res.data.data.detectedrule.addtional[3].counts;
          } else if (res.data.data.detectedrule.addtional.length === "5") {
            this.isVideoRes1 = true;
            this.isVideoRes2 = true;
            this.isVideoRes3 = true;
            this.isVideoRes4 = true;
            this.isVideoRes5 = true;
            this.isVideoRes6 = false;
            this.conformValue1 =
							res.data.data.detectedrule.addtional[0].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[0].channels.length;
              i++
            ) {
              this.videoSource1.push(
                res.data.data.detectedrule.addtional[0].channels[i].channeluuid
              );
            }
            this.videoRule1 =
							res.data.data.detectedrule.addtional[0].compareRule;
            this.videoFrequency1 =
							res.data.data.detectedrule.addtional[0].counts;
            this.conformValue2 =
							res.data.data.detectedrule.addtional[1].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[1].channels.length;
              i++
            ) {
              this.videoSource2.push(
                res.data.data.detectedrule.addtional[1].channels[i].channeluuid
              );
            }
            this.videoRule2 =
							res.data.data.detectedrule.addtional[1].compareRule;
            this.videoFrequency2 =
							res.data.data.detectedrule.addtional[1].counts;
            this.conformValue3 =
							res.data.data.detectedrule.addtional[2].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[2].channels.length;
              i++
            ) {
              this.videoSource3.push(
                res.data.data.detectedrule.addtional[2].channels[i].channeluuid
              );
            }
            this.videoRule3 =
							res.data.data.detectedrule.addtional[2].compareRule;
            this.videoFrequency3 =
							res.data.data.detectedrule.addtional[2].counts;
            this.conformValue4 =
							res.data.data.detectedrule.addtional[3].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[3].channels.length;
              i++
            ) {
              this.videoSource4.push(
                res.data.data.detectedrule.addtional[3].channels[i].channeluuid
              );
            }
            this.videoRule4 =
							res.data.data.detectedrule.addtional[3].compareRule;
            this.videoFrequency4 =
							res.data.data.detectedrule.addtional[3].counts;
            this.conformValue5 =
							res.data.data.detectedrule.addtional[4].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[4].channels.length;
              i++
            ) {
              this.videoSource5.push(
                res.data.data.detectedrule.addtional[4].channels[i].channeluuid
              );
            }
            this.videoRule5 =
							res.data.data.detectedrule.addtional[4].compareRule;
            this.videoFrequency5 =
							res.data.data.detectedrule.addtional[4].counts;
          } else if (res.data.data.detectedrule.addtional.length === "6") {
            this.isVideoRes1 = true;
            this.isVideoRes2 = true;
            this.isVideoRes3 = true;
            this.isVideoRes4 = true;
            this.isVideoRes5 = true;
            this.isVideoRes6 = true;
            this.conformValue1 =
							res.data.data.detectedrule.addtional[0].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[0].channels.length;
              i++
            ) {
              this.videoSource1.push(
                res.data.data.detectedrule.addtional[0].channels[i].channeluuid
              );
            }
            this.videoRule1 =
							res.data.data.detectedrule.addtional[0].compareRule;
            this.videoFrequency1 =
							res.data.data.detectedrule.addtional[0].counts;
            this.conformValue2 =
							res.data.data.detectedrule.addtional[1].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[1].channels.length;
              i++
            ) {
              this.videoSource2.push(
                res.data.data.detectedrule.addtional[1].channels[i].channeluuid
              );
            }
            this.videoRule2 =
							res.data.data.detectedrule.addtional[1].compareRule;
            this.videoFrequency2 =
							res.data.data.detectedrule.addtional[1].counts;
            this.conformValue3 =
							res.data.data.detectedrule.addtional[2].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[2].channels.length;
              i++
            ) {
              this.videoSource3.push(
                res.data.data.detectedrule.addtional[2].channels[i].channeluuid
              );
            }
            this.videoRule3 =
							res.data.data.detectedrule.addtional[2].compareRule;
            this.videoFrequency3 =
							res.data.data.detectedrule.addtional[2].counts;
            this.conformValue4 =
							res.data.data.detectedrule.addtional[3].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[3].channels.length;
              i++
            ) {
              this.videoSource4.push(
                res.data.data.detectedrule.addtional[3].channels[i].channeluuid
              );
            }
            this.videoRule4 =
							res.data.data.detectedrule.addtional[3].compareRule;
            this.videoFrequency4 =
							res.data.data.detectedrule.addtional[3].counts;
            this.conformValue5 =
							res.data.data.detectedrule.addtional[4].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[4].channels.length;
              i++
            ) {
              this.videoSource5.push(
                res.data.data.detectedrule.addtional[4].channels[i].channeluuid
              );
            }
            this.videoRule5 =
							res.data.data.detectedrule.addtional[4].compareRule;
            this.videoFrequency5 =
							res.data.data.detectedrule.addtional[4].counts;
            this.conformValue6 =
							res.data.data.detectedrule.addtional[5].condition.enName;
            for (
              let i = 0;
              i < res.data.data.detectedrule.addtional[5].channels.length;
              i++
            ) {
              this.videoSource6.push(
                res.data.data.detectedrule.addtional[5].channels[i].channeluuid
              );
            }
            this.videoRule6 =
							res.data.data.detectedrule.addtional[5].compareRule;
            this.videoFrequency6 =
							res.data.data.detectedrule.addtional[5].counts;
          }
          for (let i = 0; i < res.data.data.detectedrule.except.length; i++) {
            this.excludeLibs.push(
              res.data.data.detectedrule.except[i].libraryuuid
            );
          }
          this.twoSnapGap = res.data.data.detectedrule.snapInterval;
          this.confirmLibs = res.data.data.confirmlibrary.libraryuuid;
          this.invalidLibs = res.data.data.cancellibrary.libraryuuid;
          this.isStartTask = res.data.data.enabled;
          this.isOpenAlarm = res.data.data.ispopup;
          // this.videoSource=
          // if(res.data.data.detectedrule.timeField.length)
        })
        .catch(err => {
          this.mainDetailLoading = false;
          console.log("请求错误：" + err);
        });
    },
    newModelTask() {
      this.newTaskName = "";
      this.newFaceLibs = [];
      this.newThreshold = "";
      this.newRemark = "";
      this.newImageIquality = "HIGH";
      this.startTimeValue = "";
      this.endTimeValue = "";
      this.startTimeValue1 = "";
      this.endTimeValue1 = "";
      this.startTimeValue2 = "";
      this.endTimeValue2 = "";
      this.startTimeValue3 = "";
      this.endTimeValue3 = "";
      this.startTimeValue4 = "";
      this.endTimeValue4 = "";
      this.startTimeValue5 = "";
      this.endTimeValue5 = "";
      this.isTimeWrap1 = false;
      this.isTimeWrap2 = false;
      this.isTimeWrap3 = false;
      this.isTimeWrap4 = false;
      this.isTimeWrap5 = false;
      this.nearlyDays = "";
      this.recentlyValue = "everyday";
      this.videoSource = [];
      this.videoRule = ">=";
      this.videoRule1 = ">=";
      this.videoRule2 = ">=";
      this.videoRule3 = ">=";
      this.videoRule4 = ">=";
      this.videoRule5 = ">=";
      this.videoRule6 = ">=";
      this.isVideoRes1 = false;
      this.isVideoRes2 = false;
      this.isVideoRes3 = false;
      this.isVideoRes4 = false;
      this.isVideoRes5 = false;
      this.isVideoRes6 = false;
      this.conformValue1 = "conform";
      this.conformValue2 = "conform";
      this.conformValue3 = "conform";
      this.conformValue4 = "conform";
      this.conformValue5 = "conform";
      this.conformValue6 = "conform";
      this.videoSource1 = [];
      this.videoSource2 = [];
      this.videoSource3 = [];
      this.videoSource4 = [];
      this.videoSource5 = [];
      this.videoSource6 = [];
      this.videoFrequency = "";
      this.videoFrequency1 = "";
      this.videoFrequency2 = "";
      this.videoFrequency3 = "";
      this.videoFrequency4 = "";
      this.videoFrequency5 = "";
      this.videoFrequency5 = "";
      this.excludeLibs = [];
      this.twoSnapGap = "";
      this.confirmLibs = "";
      this.invalidLibs = "";
      this.isStartTask = true;
      this.isOpenAlarm = true;
    },
    initTaskList() {
      this.mainListLoading = true;
      this.$http
        .get(this.api + "/mppr-model/face/v2/analysis/model/list")
        .then(res => {
          console.log("初始化智能模型=====", res);
          this.mainListLoading = false;
          this.disableTask = res.data.data.disable;
          this.enableTask = res.data.data.enable;
          this.inUseList = res.data.data.enable;
          this.modeluuid = res.data.data.enable[0].modeluuid;
          this.viewTaskDetails();
          this.searchTsakAlarm();
        })
        .catch(err => {
          this.mainListLoading = false;
          console.log("请求错误：" + err);
        });
    },
    chooseInModel() {
      this.isActive = true;
      this.inUseList = this.enableTask;
      this.modeluuid = this.inUseList[0].modeluuid;
      this.viewTaskDetails();
      this.idx = 0;
    },
    chooseOutModel() {
      this.isActive = false;
      this.inUseList = this.disableTask;
      this.modeluuid = this.inUseList[0].modeluuid;
      this.viewTaskDetails();
      this.idx = 0;
    },
    viewTaskDetails(item, index) {
      this.mainDetailLoading = true;
      if (item) {
        this.idx = index;
        this.modeluuid = item.modeluuid;
      }
      this.searchTsakAlarm();
      this.$http
        .get(
          this.api +
						"/mppr-model/face/v2/analysis/model/detail?modeluuid=" +
						this.modeluuid
        )
        .then(res => {
          console.log("查看智能模型详情=====", res);
          this.mainDetailLoading = false;
          this.taskName = res.data.data.modelname;
          this.createPeople = res.data.data.username;
          this.createTime = res.data.data.createtime;
          this.taskReason = res.data.data.remarks;
          this.viewFaceLibs = res.data.data.faceLibs;
          this.threshold = res.data.data.threshold;
          this.isAlarmResource = res.data.data.ispopup;
          if (res.data.data.level === "HIGH") {
            this.imageQuality = "高";
          } else if (res.data.data.level === "NORMAL") {
            this.imageQuality = "中";
          } else if (res.data.data.level === "LOW") {
            this.imageQuality = "低";
          }
          this.timeFieldList = res.data.data.detectedrule.timeField;
          this.viewNearlyDays = res.data.data.detectedrule.days;
          this.viewNearlyRule = res.data.data.detectedrule.mode.name;
          this.cameraList = res.data.data.channelLibs;
          this.viewSnapNum = res.data.data.detectedrule.atLeastCameras;
          this.viewVideoRule = res.data.data.detectedrule.compareRule;
          this.viewFrequency = res.data.data.detectedrule.allCounts;
          this.conformCamList = [];
          this.inConformCamList = [];
          var inConformCamList = [],
            conformCamList = [];
          for (
            let i = 0;
            i < res.data.data.detectedrule.addtional.length;
            i++
          ) {
            if (
              res.data.data.detectedrule.addtional[i].condition.name ===
							"同时不符合"
            ) {
              inConformCamList = inConformCamList.concat(
                res.data.data.detectedrule.addtional[i].channels
              );
            } else if (
              res.data.data.detectedrule.addtional[i].condition.name ===
							"同时符合"
            ) {
              conformCamList = inConformCamList.concat(
                res.data.data.detectedrule.addtional[i].channels
              );
            }
          }
          for (let i = 0; i < inConformCamList.length; i++) {
            this.inConformCamList.push(inConformCamList[i].channelName);
          }
          for (let i = 0; i < conformCamList.length; i++) {
            this.conformCamList.push(conformCamList[i].channelName);
          }
          let set = new Set(this.inConformCamList);
          this.inConformCamList = Array.from(set);
          let set1 = new Set(this.conformCamList);
          this.conformCamList = Array.from(set1);
          this.excludeFaceLibs = res.data.data.detectedrule.except;
          this.timeInterval = res.data.data.detectedrule.snapInterval;
          this.confirmLibName = res.data.data.confirmlibrary.libraryname;
          this.cancelLibName = res.data.data.cancellibrary.libraryname;
        })
        .catch(err => {
          this.mainDetailLoading = false;
          console.log("请求错误：" + err);
        });
    },
    viewFaceLibas() {
      // 查询所有的人脸库
      if (this.isShowFaceLibs) {
        var height = document.getElementById("libs").offsetHeight;
        console.log("height===", height);
        var rows = parseInt(Number(this.viewFaceLibs.length) / 7) + 1;
        console.log("rows===", rows);
        document.getElementById("list").style.height = rows * height + "px";
        this.isShowFaceLibs = false;
      } else {
        document.getElementById("list").style.height = "40px";
        this.isShowFaceLibs = true;
      }
    },
    viewCamera() {
      if (this.isShowCamera) {
        this.isShowCamera = false;
        var height = document.getElementById("cameraLibs").offsetHeight;
        var rows1 = parseInt(Number(this.cameraList.length) / 7) + 1;
        document.getElementById("recentlyCamera").style.height =
					rows1 * height + "px";
        var rows2 = parseInt(Number(this.conformCamList.length) / 7) + 1;
        document.getElementById("conformCamera").style.height =
					rows2 * height + "px";
        var rows3 = parseInt(Number(this.inConformCamList.length) / 7) + 1;
        document.getElementById("inConformCamera").style.height =
					rows3 * height + "px";
      } else {
        this.isShowCamera = true;
        document.getElementById("recentlyCamera").style.height = "35px";
        document.getElementById("conformCamera").style.height = "70px";
        document.getElementById("inConformCamera").style.height = "70px";
        // this.isShowMore1=true;
        // this.isShowMore2=true;
        // this.isShowMore3=true;
      }
    },
    viewAllCamera() {
      var height = document.getElementById("cameraLibs").offsetHeight;
      console.log("height===", height);
      var rows = parseInt(Number(this.cameraList.length) / 7) + 1;
      console.log("rows===", rows);
      document.getElementById("recentlyCamera").style.height =
				rows * height + "px";
      this.isShowMore1 = false;
    },
    viewAllCamera1() {
      var height = document.getElementById("cameraLibs").offsetHeight;
      console.log("height===", height);
      var rows = parseInt(Number(this.conformCamList.length) / 7) + 1;
      console.log("rows===", rows);
      document.getElementById("conformCamera").style.height =
				rows * height + "px";
      this.isShowMore2 = false;
    },
    viewAllCamera2() {
      var height = document.getElementById("cameraLibs").offsetHeight;
      console.log("height===", height);
      var rows = parseInt(Number(this.inConformCamList.length) / 7) + 1;
      console.log("rows===", rows);
      document.getElementById("inConformCamera").style.height =
				rows * height + "px";
      this.isShowMore3 = false;
    },
    searchTsakAlarm() {
      this.mainSearchLoading = true;
      this.$http
        .get(
          this.api +
						"/mppr-statistics/log/ModelInfo?modelUuidList=" +
						this.modeluuid +
						"&starttime=" +
						this.startTime +
						"&overtime=" +
						this.endTime
        )
        .then(res => {
          // console.log("查看报警记录=====",res);
          this.mainSearchLoading = false;
          this.totalCompareItemList = [];
          this.totalCompareItemList = res.data.data;
          this.pageSize =
						parseInt(Math.ceil(Number(this.totalCompareItemList.length) / 8)) *
						8;
          if (this.pageSize === "0") {
            this.pageSize = 8;
          }
          console.log("totalCompareItemList===", this.totalCompareItemList);
        })
        .catch(err => {
          this.mainDetailLoading = false;
          console.log("请求错误：" + err);
        });
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
      // 新建模型任务
      var channelArr = [];
      for (let i = 0; i < this.videoSource.length; i++) {
        let obj = {
          channelName: "",
          channeltype: "",
          channeluuid: this.videoSource[i]
        };
        channelArr.push(obj);
      }
      var addtionalArr = [];
      if (this.isVideoRes1) {
        let obj1 = {
          channels: this.videoSource1,
          compareRule: this.videoRule1,
          condition: this.conformValue1,
          counts: this.videoFrequency1
        };
        addtionalArr.push(obj1);
      }
      if (this.isVideoRes2) {
        let obj2 = {
          channels: this.videoSource2,
          compareRule: this.videoRule2,
          condition: this.conformValue2,
          counts: this.videoFrequency2
        };
        addtionalArr.push(obj2);
      }
      if (this.isVideoRes3) {
        let obj3 = {
          channels: this.videoSource3,
          compareRule: this.videoRule3,
          condition: this.conformValue3,
          counts: this.videoFrequency3
        };
        addtionalArr.push(obj3);
      }
      if (this.isVideoRes4) {
        let obj4 = {
          channels: this.videoSource4,
          compareRule: this.videoRule4,
          condition: this.conformValue4,
          counts: this.videoFrequency4
        };
        addtionalArr.push(obj4);
      }
      if (this.isVideoRes5) {
        let obj5 = {
          channels: this.videoSource5,
          compareRule: this.videoRule5,
          condition: this.conformValue5,
          counts: this.videoFrequency5
        };
        addtionalArr.push(obj5);
      }
      if (this.isVideoRes6) {
        let obj6 = {
          channels: this.videoSource6,
          compareRule: this.videoRule6,
          condition: this.conformValue6,
          counts: this.videoFrequency6
        };
        addtionalArr.push(obj6);
      }
      var timeFieldArr = [];
      let obj6 = {
        beginTime: this.startTimeValue,
        endTime: this.endTimeValue
      };
      timeFieldArr.push(obj6);
      if (this.isTimeWrap1) {
        let obj1 = {
          beginTime: this.startTimeValue1,
          endTime: this.endTimeValue1
        };
        timeFieldArr.push(obj1);
      }
      if (this.isTimeWrap2) {
        let obj2 = {
          beginTime: this.startTimeValue2,
          endTime: this.endTimeValue2
        };
        timeFieldArr.push(obj2);
      }
      if (this.isTimeWrap3) {
        let obj3 = {
          beginTime: this.startTimeValue3,
          endTime: this.endTimeValue3
        };
        timeFieldArr.push(obj3);
      }
      if (this.isTimeWrap4) {
        let obj4 = {
          beginTime: this.startTimeValue4,
          endTime: this.endTimeValue4
        };
        timeFieldArr.push(obj4);
      }
      if (this.isTimeWrap5) {
        let obj5 = {
          beginTime: this.startTimeValue5,
          endTime: this.endTimeValue5
        };
        timeFieldArr.push(obj5);
      }
      this.$http
        .post(this.api + "/mppr-model/face/v2/analysis/model", {
          modelname: this.newTaskName, // 分析模型名称
          cancellibrary: this.invalidLibs, // 处理无效入库
          channelLibs: channelArr, // 通道库列表
          confirmlibrary: this.confirmLibs, // 处理确认入库
          detectedrule: {
            // 探测规则
            addtional: addtionalArr, // 额外探测条件???
            allCounts: this.videoFrequency, // 累计多少次
            atLeastCameras: this.newSnapVideoNum, // 至少几个相机有抓拍
            compareRule: this.videoRule, // 比较规则
            days: this.nearlyDays, // 多少天内
            except: this.excludeLibs, // 排除的人员库uuid
            mode: this.recentlyValue, // 统计模式
            snapInterval: this.twoSnapGap, // 两次抓拍间隔
            timeField: timeFieldArr // 探测时间段???
          },
          enabled: this.editStartTask, // 是否开启任务
          faceLibs: this.newFaceLibs, // 人脸库列表
          ispopup: this.isOpenAlarm, // 是否报警弹窗
          level: this.newImageIquality, // 人脸质量
          remarks: this.newRemark, // 模型分析描述
          threshold: this.newThreshold // 相似度
        })
        .then(res => {
          if (res.data.result === 0) {
            this.diglogvisible = false;
            this.initTaskList();
            console.log("新建布控成功=====", res);
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
      // 编辑模型任务
      var channelArr = [];
      for (let i = 0; i < this.videoSource.length; i++) {
        let obj = {
          channelName: "",
          channeltype: "",
          channeluuid: this.videoSource[i]
        };
        channelArr.push(obj);
      }
      var addtionalArr = [];
      if (this.isVideoRes1) {
        let obj1 = {
          channels: this.videoSource1,
          compareRule: this.videoRule1,
          condition: this.conformValue1,
          counts: this.videoFrequency1
        };
        addtionalArr.push(obj1);
      }
      if (this.isVideoRes2) {
        let obj2 = {
          channels: this.videoSource2,
          compareRule: this.videoRule2,
          condition: this.conformValue2,
          counts: this.videoFrequency2
        };
        addtionalArr.push(obj2);
      }
      if (this.isVideoRes3) {
        let obj3 = {
          channels: this.videoSource3,
          compareRule: this.videoRule3,
          condition: this.conformValue3,
          counts: this.videoFrequency3
        };
        addtionalArr.push(obj3);
      }
      if (this.isVideoRes4) {
        let obj4 = {
          channels: this.videoSource4,
          compareRule: this.videoRule4,
          condition: this.conformValue4,
          counts: this.videoFrequency4
        };
        addtionalArr.push(obj4);
      }
      if (this.isVideoRes5) {
        let obj5 = {
          channels: this.videoSource5,
          compareRule: this.videoRule5,
          condition: this.conformValue5,
          counts: this.videoFrequency5
        };
        addtionalArr.push(obj5);
      }
      if (this.isVideoRes6) {
        let obj6 = {
          channels: this.videoSource6,
          compareRule: this.videoRule6,
          condition: this.conformValue6,
          counts: this.videoFrequency6
        };
        addtionalArr.push(obj6);
      }
      var timeFieldArr = [];
      let obj6 = {
        beginTime: this.startTimeValue,
        endTime: this.endTimeValue
      };
      timeFieldArr.push(obj6);
      if (this.isTimeWrap1) {
        let obj1 = {
          beginTime: this.startTimeValue1,
          endTime: this.endTimeValue1
        };
        timeFieldArr.push(obj1);
      }
      if (this.isTimeWrap2) {
        let obj2 = {
          beginTime: this.startTimeValue2,
          endTime: this.endTimeValue2
        };
        timeFieldArr.push(obj2);
      }
      if (this.isTimeWrap3) {
        let obj3 = {
          beginTime: this.startTimeValue3,
          endTime: this.endTimeValue3
        };
        timeFieldArr.push(obj3);
      }
      if (this.isTimeWrap4) {
        let obj4 = {
          beginTime: this.startTimeValue4,
          endTime: this.endTimeValue4
        };
        timeFieldArr.push(obj4);
      }
      if (this.isTimeWrap5) {
        let obj5 = {
          beginTime: this.startTimeValue5,
          endTime: this.endTimeValue5
        };
        timeFieldArr.push(obj5);
      }
      this.$http
        .post(this.api + "/mppr-model/face/v2/analysis/model", {
          modelname: this.newTaskName, // 分析模型名称
          cancellibrary: this.invalidLibs, // 处理无效入库
          channelLibs: channelArr, // 通道库列表
          confirmlibrary: this.confirmLibs, // 处理确认入库
          detectedrule: {
            // 探测规则
            addtional: addtionalArr, // 额外探测条件???
            allCounts: this.videoFrequency, // 累计多少次
            atLeastCameras: this.newSnapVideoNum, // 至少几个相机有抓拍
            compareRule: this.videoRule, // 比较规则
            days: this.nearlyDays, // 多少天内
            except: this.excludeLibs, // 排除的人员库uuid
            mode: this.recentlyValue, // 统计模式
            snapInterval: this.twoSnapGap, // 两次抓拍间隔
            timeField: timeFieldArr // 探测时间段???
          },
          enabled: this.editStartTask, // 是否开启任务
          faceLibs: this.newFaceLibs, // 人脸库列表
          ispopup: this.isOpenAlarm, // 是否报警弹窗
          level: this.newImageIquality, // 人脸质量
          remarks: this.newRemark, // 模型分析描述
          threshold: this.newThreshold, // 相似度
          modeluuid: this.modeluuid
        })
        .then(res => {
          if (res.data.result === 0) {
            this.editDiglogvisible = false;
            this.initTaskList();
            console.log("新建布控成功=====", res);
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
    deleteModel() {
      console.log("删除模型uuid===", this.modeluuid);
      this.$http
        .delete(
          this.api +
						"/mppr-model/face/v2/analysis/model?modeluuid=" +
						this.modeluuid
        )
        .then(res => {
          console.log("res===", res);
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
    addTimeItem() {
      // 新增时间段
      if (this.isTimeWrap1 === false) {
        this.isTimeWrap1 = true;
        this.startTimeValue1 = "";
        this.endTimeValue1 = "";
      } else if (this.isTimeWrap2 === false) {
        this.isTimeWrap2 = true;
        this.startTimeValue2 = "";
        this.endTimeValue2 = "";
      } else if (this.isTimeWrap3 === false) {
        this.isTimeWrap3 = true;
        this.startTimeValue3 = "";
        this.endTimeValue3 = "";
      } else if (this.isTimeWrap4 === false) {
        this.isTimeWrap4 = true;
        this.startTimeValue4 = "";
        this.endTimeValue4 = "";
      } else if (this.isTimeWrap5 === false) {
        this.isTimeWrap5 = true;
        this.startTimeValue5 = "";
        this.endTimeValue5 = "";
      }
    },
    addVideoRes() {
      // 新增视频源规则
      if (this.isVideoRes1 === false) {
        this.isVideoRes1 = true;
      } else if (this.isVideoRes2 === false) {
        this.isVideoRes2 = true;
      } else if (this.isVideoRes3 === false) {
        this.isVideoRes3 = true;
      } else if (this.isVideoRes4 === false) {
        this.isVideoRes4 = true;
      } else if (this.isVideoRes5 === false) {
        this.isVideoRes5 = true;
      } else if (this.isVideoRes6 === false) {
        this.isVideoRes6 = true;
      }
    },
    switchChange(row) {
      // 一键开启或关闭
      console.log("this.switchTask===", this.switchTask);
      // if(this.switchTask===false) {//当前按钮处于开启状态

      // }
      this.$http
        .put(
          this.api +
						"/mppr-model/face/v2/analysis/model/status?modeluuid=" +
						this.modeluuid +
						"&enabled=" +
						this.switchTask
        )
        .then(res => {
          console.log("res===", res);
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
          this.modeluuid = this.inUseList[0].modeluuid;
          this.idx = 0;
          this.viewTaskDetails();
        })
        .catch(err => {
          this.switchTask = !this.switchTask;
          console.log("请求错误：" + err);
        });
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.citiesuuid : [];
      this.isIndeterminate = false;
      this.videoSource = this.checkedCities;
    },
    handleCheckedCitiesChange(value) {
      console.log("handleCheckedCitiesChange===", value);
      this.videoSource = value;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleCheckAllChange1(val) {
      this.checkedCities1 = val ? this.citiesuuid : [];
      this.isIndeterminate1 = false;
      this.videoSource = this.checkedCities1;
    },
    handleCheckedCitiesChange1(value) {
      console.log("handleCheckedCitiesChange==", value);
      this.videoSource = value;
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
      mainSearchLoading: false,
      mainEditLoading: false,
      viewSnapNum: "",
      viewNearlyDays: "",
      viewNearlyRule: "",
      timeFieldList: [], // 时间集合
      mainDetailLoading: false,
      modeluuid: "",
      mainListLoading: false,
      invalidLibs: "", // 无效入库
      confirmLibs: "", // 确认入库
      excludeLibs: "", // 排除库
      conformValue1: "conform",
      conformValue2: "conform",
      conformValue3: "conform",
      conformValue4: "conform",
      conformValue5: "conform",
      conformValue6: "conform",
      conformRule: [
        {
          name: "同时符合",
          uuid: "conform"
        },
        {
          name: "同时不符合",
          uuid: "inconformity"
        }
      ],
      twoSnapGap: "",
      videoRuleList: [">=", "=", "<="],
      newSnapVideoNum: "",
      nearlyDays: "",
      newRemark: "", // 备注
      videoSource: "",
      videoSource1: "",
      videoSource2: "",
      videoSource3: "",
      videoSource4: "",
      videoSource5: "",
      videoSource6: "",
      videoRule: ">=",
      videoRule1: ">=",
      videoRule2: ">=",
      videoRule3: ">=",
      videoRule4: ">=",
      videoRule5: ">=",
      videoRule6: ">=",
      videoFrequency: "",
      videoFrequency1: "3",
      videoFrequency2: "3",
      videoFrequency3: "3",
      videoFrequency4: "3",
      videoFrequency5: "3",
      videoFrequency6: "3",
      isVideoResWrap: true,
      disableTask: [], // 停用任务
      enableTask: [], // 在用任务
      isVideoRes1: true,
      isVideoRes2: true,
      isVideoRes3: true,
      isVideoRes4: false,
      isVideoRes5: false,
      isVideoRes6: false,
      isTimeWrap1: true,
      isTimeWrap2: false,
      isTimeWrap3: false,
      isTimeWrap4: false,
      isTimeWrap5: false,
      startTimeValue: "",
      endTimeValue: "",
      startTimeValue1: "",
      endTimeValue1: "",
      startTimeValue2: "",
      endTimeValue2: "",
      startTimeValue3: "",
      endTimeValue3: "",
      startTimeValue4: "",
      endTimeValue4: "",
      startTimeValue5: "",
      endTimeValue5: "",
      deleteDiglogvisible: false, // 删除弹框
      confirmLibName: "",
      cancelLibName: "",
      timeInterval: "", // 时间间隔
      api: this.$store.state.api, // 接口参数前缀
      isShowMore1: true,
      isShowMore2: true,
      isShowMore3: true,
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
      videoSourceList: [],
      newThreshold: "",
      newImageIquality: "HIGH",
      newTaskReason: "",
      recentlyValue: "everyday",
      recentlyRule: [
        {
          name: "每天",
          uuid: "everyday"
        },
        {
          name: "累计",
          uuid: "total"
        }
      ],
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
      isAlarmSource: true, // 是否做为报警源
      isOpenAlarm: true,
      isStartTask: true,
      diglogvisible: false, // 新建智能模型弹框
      editDiglogvisible: false,
      switchTask: true,
      isShowFaceLibs: true, // 是否显示人脸库
      isShowCamera: true, // 是否显示视频源
      isShowMore: true, // 是否显示更多
      isAlarmResource: true,
      isAlarmDialog: false,
      taskName: "",
      createPeople: "",
      createTime: "",
      taskReason: "",
      threshold: "%",
      imageQuality: "", // 抓拍图片质量
      alarmNumber: "",
      startTime: "",
      endTime: "",
      pageSize: 8,
      viewFaceLibs: [],
      excludeFaceLibs: [],
      cameraList: [],
      conformCamList: [],
      inConformCamList: [],
      totalCompareItemList: []
    };
  }
};
</script>
<style lang="scss">
html {
	background: none;
}
.intelligentModel .el-scrollbar__wrap {
	overflow-x: hidden;
	overflow-y: auto;
}
.intelligentModel .el-slider__button-wrapper {
	display: none;
}
.intelligentModel {
	background: none;
	width: 100%;
	display: flex;
	flex-direction: row;
}
.intelligentModel .taskList {
	width: 26%;
	height: 100%;
	background: rgba(255, 255, 255, 0.03);
	padding: 40px 50px 0 50px;
	box-sizing: border-box;
}
.intelligentModel .taskList .list {
	width: 100%;
	height: 80%;
	margin-top: 20px;
}
.intelligentModel .taskList .list .singleTask {
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
.intelligentModel .taskList .list .listActive {
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
	background: rgba(40, 255, 187, 0.05);
	opacity: 0.8;
}
.intelligentModel .taskList .list .singleTask:last-child {
	border-bottom: 1px solid rgba(40, 255, 187, 0.1);
}
.intelligentModel .taskList .newMonitor {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .taskList .newMonitor .add-btn {
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
.intelligentModel .taskList .chooseModel {
	width: 280px;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-bottom: 1px solid rgba(40, 255, 187, 0.1);
	box-sizing: border-box;
	margin-top: 40px;
}
.intelligentModel .taskList .chooseModel .inUse {
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
.intelligentModel .taskList .chooseModel .outUse {
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
.intelligentModel .taskList .chooseModel .UseActive {
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
.intelligentModel .taskDetail {
	width: 74%;
	height: 100%;
	background: #1c1d20;
	padding: 0 3%;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-y: scroll;
}
.intelligentModel .taskDetail .operation {
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
.intelligentModel .taskDetail .operation .status {
	margin-left: 27px;
	height: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
}
.intelligentModel .taskDetail .operation .status img {
	width: 14px;
}
.intelligentModel .taskDetail .operation .status span {
	margin-left: 7.7px;
}
.intelligentModel .taskDetail .operation .status:first-child span {
	margin-left: 2px;
}
.intelligentModel .taskDetail .operation .status .el-switch__core {
	height: 16px;
}
.intelligentModel
	.taskDetail
	.operation
	.status
	.el-switch.is-checked
	.el-switch__core::after {
	// left: 102%;
	// margin-left: -17px;
	top: -1px;
}
.intelligentModel .taskDetail .operation .status .el-switch__core:after {
	top: -1px;
}
.intelligentModel .taskDetail .createDetail {
	width: 100%;
	height: 40px;
	margin-top: 24px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
}
.intelligentModel .taskDetail .createDetail div {
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
.intelligentModel .taskDetail .createDetail div span {
	margin-left: 14px;
}
.intelligentModel .el-checkbox__input.is-disabled .el-checkbox__inner {
	background-color: transparent;
	// border-radius: 2px
}
.intelligentModel
	.el-checkbox__input.is-disabled.is-checked
	.el-checkbox__inner {
	background-color: #49c373;
	border-color: transparent;
}
.intelligentModel
	.el-checkbox__input.is-disabled.is-checked
	.el-checkbox__inner::after {
	border-color: #ffffff;
}
.intelligentModel .el-checkbox__inner {
	background-color: transparent;
}
.intelligentModel .is-checked .el-checkbox__input {
	background: transparent;
}
.intelligentModel .taskDetail .faceLibsTotal {
	width: 100%;
	height: auto;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 3px;
	margin-top: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .taskDetail .faceLibsTotal .title {
	width: 100%;
	height: 40px;
	padding-left: 27px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.intelligentModel .taskDetail .faceLibsTotal .title img {
	width: 9px;
	margin-left: 32.5px;
}
.intelligentModel .taskDetail .faceLibsTotal .list {
	width: 100%;
	height: 40px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	padding-left: 91px;
	overflow: hidden;
	box-sizing: border-box;
}
.intelligentModel .taskDetail .faceLibsTotal .libs1 {
	width: 10%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 39px;
	float: left;
}
.intelligentModel .taskDetail .faceLibsTotal .list .libs1 img {
	width: 13.4px;
	height: 13.4px;
	margin-right: 5.6px;
}
.intelligentModel .taskDetail .cameraTotal {
	width: 100%;
	height: auto;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 3px;
	margin-top: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .taskDetail .cameraTotal .cameraListWrap {
	width: 100%;
	height: auto;
	padding-left: 7.2%;
	box-sizing: border-box;
}
.intelligentModel .taskDetail .cameraTotal .cameraListWrap .timeRange {
	width: 100%;
	height: 35px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.intelligentModel .taskDetail .faceLibsTotal .libs {
	width: 12%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 39px;
	float: left;
}
.intelligentModel .taskDetail .faceLibsTotal .list .libs img {
	width: 13.4px;
	height: 13.4px;
	margin-right: 5.6px;
}
.intelligentModel .taskDetail .cameraTotal .cameraListWrap .recentlyCamera {
	width: 100%;
	height: 35px;
	padding-left: 20.3%;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
}
.intelligentModel
	.taskDetail
	.cameraTotal
	.cameraListWrap
	.recentlyCamera
	.title {
	position: absolute;
	left: -2.5%;
	top: 0;
	width: 200px;
	height: 35px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .taskDetail .cameraTotal .cameraListWrap .conformCamera {
	width: 100%;
	height: 70px;
	padding-left: 7.7%;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
}
.intelligentModel
	.taskDetail
	.cameraTotal
	.cameraListWrap
	.conformCamera
	.title {
	position: absolute;
	left: -2.5%;
	top: 0;
	width: 120px;
	height: 35px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .taskDetail .cameraTotal .cameraListWrap .inConformCamera {
	width: 100%;
	height: 70px;
	padding-left: 7.7%;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
}
.intelligentModel
	.taskDetail
	.cameraTotal
	.cameraListWrap
	.inConformCamera
	.title {
	position: absolute;
	left: -2.5%;
	top: 0;
	width: 120px;
	height: 35px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .taskDetail .cameraTotal .title {
	width: 100%;
	height: 40px;
	padding-left: 27px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.intelligentModel .taskDetail .cameraTotal .title img {
	width: 9px;
	margin-left: 32.5px;
}
.intelligentModel .taskDetail .cameraTotal .list {
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
.intelligentModel .taskDetail .cameraTotal .list .moreCamera {
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
.intelligentModel .taskDetail .cameraTotal .list .moreCamera img {
	width: 9.7px;
	height: 11.5px;
	margin-left: 4px;
}
.intelligentModel .taskDetail .cameraTotal .moreCamera1 {
	width: 43px;
	height: 14px;
	position: absolute;
	right: 1%;
	top: 8px;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
}
.intelligentModel .taskDetail .cameraTotal .moreCamera1 img {
	width: 9.7px;
	height: 11.5px;
	margin-left: 4px;
}
.intelligentModel .taskDetail .cameraTotal .moreCamera2 {
	width: 43px;
	height: 14px;
	position: absolute;
	right: 1%;
	top: 43px;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
}
.intelligentModel .taskDetail .cameraTotal .moreCamera2 img {
	width: 9.7px;
	height: 11.5px;
	margin-left: 4px;
}
.intelligentModel .taskDetail .cameraTotal .libs1 {
	width: 12%;
	height: 35px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 18px;
	float: left;
}
.intelligentModel .taskDetail .cameraTotal .libs1 img {
	width: 13.4px;
	height: 13.4px;
	margin-right: 5.6px;
}
.intelligentModel .taskDetail .cameraTotal .libs1 span {
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	height: 20px;
}
.intelligentModel .taskDetail .cameraTotal .libs2 {
	width: 14%;
	height: 35px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 18px;
	float: left;
}
.intelligentModel .taskDetail .cameraTotal .libs2 img {
	width: 13.4px;
	height: 13.4px;
	margin-right: 5.6px;
}
.intelligentModel .taskDetail .cameraTotal .libs2 span {
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	height: 20px;
}
.intelligentModel .alarmDetail {
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
.intelligentModel .alarmDetail .total {
	font-family: PingFangSC-Regular;
	font-size: 18px;
	color: #ffffff;
	letter-spacing: 0;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .alarmDetail .total img {
	width: 24px;
	margin-right: 11px;
}
.intelligentModel .alarmDetail .search {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .alarmDetail .search-btn {
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
.intelligentModel .alarmDetail .route-btn {
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
.intelligentModel .searchResult {
	width: 100%;
	height: 180px;
	padding-top: 24px;
}
.intelligentModel .searchResult .resultWrap {
	width: 11.7%;
	height: 178px;
	background: rgba(0, 0, 0, 0.13);
	border: 1px solid rgba(40, 255, 187, 0.1);
	border-radius: 3px;
	float: left;
	margin: 0 0.8% 20px 0;
	padding: 12px 13px;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	display: flex;
	flex-direction: column;
}
.intelligentModel .searchResult .resultWrap img {
	width: 100%;
	height: 114px;
}
.intelligentModel .searchResult .resultWrap div {
	opacity: 0.6;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #ffffff;
	letter-spacing: 0;
	width: 100%;
	height: 25px;
	line-height: 25px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.intelligentModel .taskDialog {
	padding-top: 30px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .dialogItem {
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
.intelligentModel .dialogItem .recently {
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .dialogItem .recently .sp1 {
	margin: 0 29px 0 10px;
}
.intelligentModel .dialogItem .recently .sp2 {
	margin-left: 15px;
}
.intelligentModel .dialogItem .recently .el-input__inner {
	width: 120px;
	height: 40px;
}
.intelligentModel .dialogItem .recently .el-input {
	width: 120px;
	height: 40px;
}
.intelligentModel .dialogItem .timeWrap {
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .dialogItem .timeWrap span {
	margin: 0 7px;
}
.intelligentModel .dialogItem .timeWrap img {
	width: 16px;
	height: 16px;
	margin-left: 12px;
}
.intelligentModel .dialogItem .timeWrap .el-input__inner {
	width: 166px;
	height: 40px;
}
.intelligentModel .dialogItem .timeWrap .el-input {
	width: 166px;
	height: 40px;
}
.intelligentModel .dialogItem .timeWrap .el-icon-time:before {
	display: none;
}
.intelligentModel .dialogItem .title {
	width: 90px;
	height: 40px;
	text-align: right;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 15px;
}
.intelligentModel .dialogItem .el-input__inner {
	width: 360px;
	height: 40px;
}
.intelligentModel .dialogItem .el-input {
	width: 360px;
	height: 40px;
}
.intelligentModel .dialogItem1 .el-input__inner {
	width: 180px;
	height: 40px;
}
.intelligentModel .dialogItem1 .el-input {
	width: 180px;
	height: 40px;
}
.intelligentModel .dialogItem2 {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	margin-bottom: 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	padding-left: 55px;
	box-sizing: border-box;
}
.intelligentModel .dialogItem2 .title {
	width: auto;
	height: 40px;
	text-align: right;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 15px;
}
.intelligentModel .dialogItem2 .el-input__inner {
	width: 120px;
	height: 40px;
}
.intelligentModel .dialogItem2 .el-input {
	width: 120px;
	height: 40px;
}
.intelligentModel .dialogItem3 {
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
.intelligentModel .dialogItem3 .itemLabel {
	width: 240px;
	height: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 13px;
	box-sizing: border-box;
}
.intelligentModel .btnWrap {
	width: 100%;
	height: 40px;
	margin: 29px 0 40px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 105px;
	box-sizing: border-box;
}
.intelligentModel .btnWrap .confirm {
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
.intelligentModel .btnWrap .cencel {
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
.intelligentModel .deleteDialog {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
	letter-spacing: 0;
}
.intelligentModel .deleteDialog .deleteText {
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
.intelligentModel .deleteDialog .deleteText img {
	width: 26.7px;
	height: 28px;
	margin-right: 24.3px;
}
.intelligentModel .deleteDialog .deleteBtn {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 60px 0 25px;
}
.intelligentModel .deleteDialog .deleteBtn div {
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
.intelligentModel .deleteDialog .deleteBtn div:first-child {
	margin-right: 25px;
}
.intelligentModel .dialogTimeWrap {
	width: 100%;
	height: auto;
	padding-left: 105px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .timeItem {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 15px;
}
.intelligentModel .timeItem span {
	margin: 0 7px;
}
.intelligentModel .dialogTimeWrap .timeItem img {
	width: 16px;
	height: 16px;
	margin-left: 12px;
}
.intelligentModel .dialogTimeWrap .timeItem img:last-child {
	margin-left: 10px;
}
.intelligentModel .dialogTimeWrap .el-input__inner {
	width: 166px;
	height: 40px;
}
.intelligentModel .dialogTimeWrap .el-input {
	width: 166px;
	height: 40px;
}
.intelligentModel .dialogTimeWrap .el-icon-time:before {
	display: none;
}
.intelligentModel .videoResouce {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 15px;
	padding-left: 105px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .videoResouce .el-input__inner {
	width: 100px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResouce .el-input {
	width: 100px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResouce .vs1 .el-input__inner {
	width: 200px;
	height: 40px;
}
.intelligentModel .videoResouce .vs1 .el-input {
	width: 200px;
	height: 40px;
}
.intelligentModel .videoResouce .vs4 .el-input__inner {
	width: 120px;
	height: 40px;
}
.intelligentModel .videoResouce .vs4 .el-input {
	width: 120px;
	height: 40px;
}
.intelligentModel .videoResouce .sp1 {
	margin: 0 11px 0 22px;
}
.intelligentModel .videoResouce .sp2 {
	margin: 0 12px 0 6px;
}
.intelligentModel .videoResouce img {
	width: 16px;
	height: 16px;
}
.intelligentModel .videoResWrap {
	width: 100%;
	height: auto;
	padding-left: 105px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .videoResItem {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 15px;
}
.intelligentModel .videoResWrap .el-input__inner {
	width: 120px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .el-input {
	width: 120px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .vs1 .el-input__inner {
	width: 200px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .vs1 .el-input {
	width: 200px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .vs4 .el-input__inner {
	width: 120px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .vs4 .el-input {
	width: 120px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .vs3 {
	width: 100px;
	margin-right: 12px;
}
.intelligentModel .videoResWrap .vs3 .el-input {
	width: 100px;
	height: 40px;
	margin-right: 12px;
}
.intelligentModel .videoResWrap .vs3 .el-input__inner {
	width: 100px;
	height: 40px;
	margin-right: 12px;
}
.intelligentModel .videoResWrap .vs2 .el-input__inner {
	width: 100px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResWrap .vs2 .el-input {
	width: 100px;
	height: 40px;
	margin-right: 10px;
}
.intelligentModel .videoResItem img {
	width: 16px;
	height: 16px;
}
.intelligentModel .videoResItem .img1 {
	margin: 0 11px 0 13px;
}
.intelligentModel .snapTimeGap {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 15px;
	padding-left: 48px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .snapTimeGap .title {
	width: 126px;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.intelligentModel .snapTimeGap .snapTimeInput {
	width: 180px;
	height: 40px;
	margin: 0 10px 0 8px;
}
.intelligentModel .snapTimeGap .snapTimeInput .el-input__inner {
	width: 180px;
	height: 40px;
}
.intelligentModel .snapTimeGap .snapTimeInput .el-input {
	width: 180px;
	height: 40px;
}
.intelligentModel .dealInLib {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 15px;
	padding-left: 48px;
	box-sizing: border-box;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
}
.intelligentModel .dealInLib .el-input__inner {
	width: 210px;
	height: 40px;
}
.intelligentModel .dealInLib .el-input {
	width: 210px;
	height: 40px;
}
.intelligentModel .el-dialog--center .el-dialog__body {
	padding: 0;
	box-sizing: border-box;
}
.intelligentModel .el-input.is-disabled .el-input__inner {
	border-color: rgba(255, 255, 255, 0.4);
}
.intelligentModel .el-select {
	width: auto;
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
