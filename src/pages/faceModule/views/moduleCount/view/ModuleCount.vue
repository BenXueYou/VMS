<template>
	<div class="main-block">
		<module-details :isShow="isShowDetail" @onCancel="onCancelDetail" ref="modelDetails" />
		<div class="main-container">
			<div class="search">
				<div class="search-input">
					<span>抓拍设备：</span>
					<elPopverTree
						:elPopoverClass="faceRecordPopoverClass"
						@transferCheckedChannel="transferCheckedChannel"
						:isCheckedAll="true"
						inputWidth="230px"
					></elPopverTree>
					<span class="left-space">人脸库：</span>
					<el-select
						v-model="faceLibraryList"
						size="small"
						multiple
						style="width: 190px;"
						clearable
						collapse-tags
						placeholder="请选择人脸库"
					>
						<el-option
							v-for="item in libraryOptions"
							:key="item.faceLibraryUuid"
							:label="item.faceLibraryName"
							:value="item.faceLibraryUuid"
						></el-option>
					</el-select>
					<span class="left-space">相似度不低于：</span>
					<el-input v-model="threshold" type="number" style="width: 55px;"></el-input>
					<span class="left-space">时段：</span>
					<el-date-picker
						v-model="startTime"
						type="datetime"
						style="width: 13%;"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="line">—</span>
					<el-date-picker
						v-model="endTime"
						type="datetime"
						style="width: 13%"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
				</div>
				<div class="search-input">
					<span>抓拍总数：</span>
					<el-select style="width: 65px;" v-model="logic" clearable size="small">
						<el-option
							v-for="item in logicOptions"
							:key="item.typeStr"
							:label="item.typeStr"
							:value="item.typeStr"
						></el-option>
					</el-select>
					<el-input v-model="frequency" type="number" style="width: 60px;margin: 0 8px;"></el-input>
					<span>次</span>
					<span class="left-space">至少有抓拍设备数量：</span>
					<el-input v-model="leastNumberOfChannel" type="number" style="width: 60px;margin: 0 8px;"></el-input>
					<span>个</span>
					<span class="left-space">人脸抓拍图片质量：</span>
					<pic-qulity-select :selectedButtons.sync="photoQualitieList" />
					<div class="search-btn">
						<el-button
							@click="queryAct"
							icon="el-icon-search"
							type="primary"
							style="width: 80px"
							size="small"
							:disabled="!ShowAuthDisabled"
						>查询</el-button>
						<el-button
							:disabled="!ShowAuthDisabled"
							@click="reset"
							type="primary"
							style="width: 80px"
							size="small"
						>重置</el-button>
					</div>
				</div>
			</div>
			<div class="result">
				<div class="result-title">
					<el-radio-group :disabled="!ShowAuthDisabled" v-model="typeRadio" @change="handleTypeChange">
						<el-radio label="picture">图片</el-radio>
						<el-radio label="table">列表</el-radio>
					</el-radio-group>
				</div>
				<div class="list-picture" v-if="typeRadio === 'picture'" v-loading="isLoading">
					<template v-for="(item, index) in moduleList">
						<div :key="index" class="list-item" @click="lookDetail(item)">
							<img
								:src="$common.setPictureShow(item.facePhotoUrl, 'facelog')"
								width="95%"
								height="120px"
								class="img-fill"
							/>
							<div class="info-other">
								<div class="other-span">{{item.snapshotDesc}}</div>
								<div class="other-span">{{item.staffName}}&nbsp;&nbsp;{{item.faceLibraryName}}</div>
							</div>
						</div>
					</template>
				</div>
				<div class="list-table" v-else v-loading="isLoading">
					<el-table :data="moduleList" style="width: 100%">
						<el-table-column type="index" label="序号" width="60"></el-table-column>
						<el-table-column label="抓拍摄像机" show-overflow-tooltip width="360">
							<template slot-scope="scope">{{scope.row.channelNames}}</template>
						</el-table-column>
						<el-table-column prop="snapshotNumber" label="抓拍总数" show-overflow-tooltip></el-table-column>
						<el-table-column prop="staffName" label="人员姓名" show-overflow-tooltip></el-table-column>
						<el-table-column prop="faceLibraryName" label="所属库" show-overflow-tooltip></el-table-column>
						<el-table-column prop="captureDatetimeBegin" label="开始时间"></el-table-column>
						<el-table-column prop="captureDatetimeEnd" label="结束时间"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<div class="detail-icon">
									<el-button @click="lookDetail(scope.row)" type="text" size="small">查看</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="footer">
					<el-pagination
						background
						layout="total, prev, pager, next, jumper"
						:page-size="pageInfo.pageSize"
						:current-page="pageInfo.currentPage"
						@current-change="handleCurrentChange"
						:total="pageInfo.total"
					></el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";
import PicQulitySelect from "@/common/PicQulitySelect";
import ModuleDetails from "@/pages/faceModule/views/moduleCount/components/ModuleDetails";

export default {
  components: {
    ElPopverTree,
    PicQulitySelect,
    ModuleDetails
  },
  props: {},
  data() {
    return {
      startTime: "",
      endTime: "",
      faceLibraryList: [],
      libraryOptions: [],
      logic: ">=",
      frequency: 2,
      logicOptions: [],
      threshold: 80,
      typeRadio: "picture",
      moduleList: [],
      pageInfo: {
        total: 0,
        pageSize: 30,
        currentPage: 1
      },
      faceRecordPopoverClass: "popoverClass",
      channelUuids: [],
      isShowDetail: false,
      isLoading: false,
      leastNumberOfChannel: 2,
      photoQualitieList: ["HIGH", "NORMAL", "LOW"],
      checkedChannel: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  activated() {
    this.init();
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("模型统计", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("模型统计", "isOwn");
  },
  methods: {
    init() {
      if (!this.ShowAuthDisabled) return;
      this.startTime = this.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.getLibrarys();
      this.logicOptions = this.$common.getEnumByGroupStr("compare_r");
      this.getModelList();
    },
    getStartTime() {
      var new111 = new Date();
      var hours = new111.getHours();
      if (hours > 1) {
        return (
          new111.getFullYear() +
					"-" +
					addZero(new111.getMonth() + 1) +
					"-" +
					addZero(new111.getDate()) +
					" " +
					addZero(hours - 1) +
					":" +
					addZero(new111.getMinutes()) +
					":" +
					addZero(new111.getSeconds())
        );
      } else {
        return (
          new111.getFullYear() +
					"-" +
					addZero(new111.getMonth() + 1) +
					"-" +
					addZero(new111.getDate()) +
					" " +
					"00:00:00"
        );
      }
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
    },
    getLibrarys() {
      this.$faceControlHttp
        .getFacedbList({
          faceLibraryType:
						"systemFaceLib,captureFaceLib,dynamicFaceLib,staticFaceLib"
        })
        .then(res => {
          let body = res.data;
          this.getFacedbListSuccess(body);
        });
    },
    getFacedbListSuccess(body) {
      this.libraryOptions = body.data;
      // this.faceLibraryList = [];
      // if (this.libraryOptions.length !== 0) {
      //   this.faceLibraryList.push(this.libraryOptions[0].faceLibraryUuid);
      // }
    },
    handleTypeChange(val) {
      if (this.typeRadio === "picture") {
        this.pageInfo.total = 0;
        this.pageInfo.pageSize = 30;
        this.pageInfo.currentPage = 1;
      } else {
        this.pageInfo.total = 0;
        this.pageInfo.pageSize = 12;
        this.pageInfo.currentPage = 1;
      }
      this.getModelList();
    },
    transferCheckedChannel(checkedChannel) {
      this.channelUuids = [];
      this.checkedChannel = checkedChannel;
      for (let i = 0; i < checkedChannel.length; i++) {
        this.channelUuids.push(checkedChannel[i].channelUuid);
      }
    },
    queryAct() {
      this.getModelList();
    },
    reset() {},
    lookDetail(row) {
      this.$refs.modelDetails.modelItem = this.$common.copyObject(
        row,
        this.$refs.modelDetails.modelItem
      );
      this.$refs.modelDetails.devices = this.$common.copyArray(
        this.checkedChannel,
        this.$refs.modelDetails.devices
      );
      this.$refs.modelDetails.startTime = this.startTime;
      this.$refs.modelDetails.endTime = this.endTime;
      this.$refs.modelDetails.faceSimilarity = this.threshold;
      this.$refs.modelDetails.photoQualitieList = this.photoQualitieList;
      this.isShowDetail = true;
    },
    onCancelDetail() {
      this.isShowDetail = false;
    },
    getModelList() {
      this.isLoading = true;
      this.$moduleCountHttp
        .getModelList({
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage,
          channelUuidList: this.channelUuids.toString(),
          faceLibraryList: this.faceLibraryList.toString(),
          threshold: this.threshold,
          startTime: this.startTime,
          endTime: this.endTime,
          logic: this.logic,
          frequency: this.frequency,
          leastNumberOfChannel: this.leastNumberOfChannel,
          photoQualitieList: this.photoQualitieList.toString()
        })
        .then(res => {
          let body = res.data;
          this.getModelListSuccess(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getModelListSuccess(body) {
      this.moduleList = body.data.list;
      this.handlePageInfo(body.data);
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getModelList();
    }
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<style>
.popoverClass {
	width: 500px;
	height: 230px;
	position: absolute;
	background: #202127;
	min-width: 150px;
	border: 1px solid #ebeef5;
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	max-height: 80%;
	overflow: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-block {
	padding: 1.6%;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	.main-container {
		padding: 1% 3%;
		box-sizing: border-box;
		background: #212325;
		width: 100%;
		height: 100%;
		.search {
			height: 130px;
			width: 100%;
			border: {
				width: 0 0 1px 0;
				style: dashed;
				color: rgba($color: #ffffff, $alpha: 0.2);
			}
			.search-input {
				height: 45%;
				display: flex;
				align-items: center;
				font-family: PingFangSC-Regular;
				font-size: 13px;
				color: #ffffff;
				.left-space {
					margin-left: 6%;
				}
				.line {
					color: rgba($color: #ffffff, $alpha: 0.15);
					margin: 0 2px;
				}
				.search-btn {
					margin-left: auto;
					margin-right: 0;
				}
			}
		}
		.result {
			padding: 20px 0;
			box-sizing: border-box;
			height: 85%;
			.result-title {
				margin-bottom: 20px;
				display: flex;
				align-items: center;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #ffffff;
			}
			.list-picture {
				height: 89%;
				overflow-y: auto;
				display: flex;
				flex-flow: row wrap;
				align-content: flex-start;
				.list-item {
					width: 142px;
					height: 180px;
					cursor: pointer;
					background: rgba($color: #000000, $alpha: 0.1);
					border: 1px solid #2a2c2e;
					margin-right: 12px;
					margin-bottom: 10px;
					padding: 10px 5px 0 5px;
					box-sizing: border-box;
					.info-other {
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #dddddd;
						letter-spacing: 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						.other-span {
							margin-bottom: 2px;
						}
					}
				}
			}
			.list-table {
				height: 89%;
				overflow-y: auto;
			}
			.footer {
				margin-top: 30px;
				width: 100%;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
}
</style>
