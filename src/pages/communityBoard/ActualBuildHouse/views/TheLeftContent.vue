<template>
<div id="CBBHLeftContent" class="CBLeftContentCLass">
	<div class="topMenu">
		<el-dropdown trigger="click">
			<el-button type="primary">
				<img class="img" src="@/assets/images/communityBoard/top_menu_icon.png" alt />
				{{infrastructureName}}
				<i class="el-icon-caret-bottom el-icon--right"></i>
			</el-button>
			<el-dropdown-menu class="CBEldropMenu" slot="dropdown">
				<el-tree
					:data="treeData"
					lazy
					:load="loadNode"
					:props="defaultProps"
					:highlight-current="true"
					:expand-on-click-node="false"
					:default-expanded-keys="defaultExpandedKeys"
					@node-click="handleNodeClick"
				></el-tree>
			</el-dropdown-menu>
		</el-dropdown>
		<span v-if="isLevelOne == 'levelTwo'" style="color: #ffffff">请选择小区：</span>
          <el-select
            v-model="activeProject"
            clearable
            @change="handleStreetChange"
            v-if="isLevelOne == 'levelTwo'"
          >
            <el-option
              v-for="item in selectData"
              :label="item.childName"
              :value="item.childUuid"
              :key="item.childUuid"
            ></el-option>
          </el-select>
	</div>
	<div class="topMenuTips">
		<div v-for="(item, index) in topMenuTipsData" :key="index">
			{{item.value}}
			<span>{{item.tips}}</span>
		</div>
	</div>
	<div class="topCharts">
		<!--人员类型-->
		<build-house-type-pie :pieData='pieData'></build-house-type-pie>
		<!--访客排名TOP5-->
		<build-house-visitor-top5 :activeProject="activeProject" :infrastructureId='infrastructureId'></build-house-visitor-top5>
	</div>
	<div class="bottomCharts singleCharts1">
		<!--房屋居住人数TOP10-->
		<build-house-resident-top10 :residentData="residentData"></build-house-resident-top10>
		<!--通行排名TOP10-->
		<build-house-access-record-top10 :activeProject="activeProject" :infrastructureId='infrastructureId'></build-house-access-record-top10>
	</div>
</div>
</template>
<script>
import icons from "@/common/icon.js";
import * as Api from "../../utils/town";
import * as api from "../ajax";
import buildHouseTypePie from "../components/BuildHouseTypePie.vue";
import buildHouseVisitorTop5 from "../components/buildHouseVisitorTop5.vue";
import BuildHouseResidentTop10 from "../components/BuildHouseResidentTop10.vue";
import BuildHouseAccessRecordTop10 from "../components/BuildHouseAccessRecordTop10.vue";
import { mapState } from "vuex";
export default {
  name: "CBLeftContentCLass",
  components: {
    buildHouseTypePie,
    buildHouseVisitorTop5,
    BuildHouseResidentTop10,
    BuildHouseAccessRecordTop10
  },
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      selectData: [],
      activeProject: "",
      residentData: null,
      infrastructureName: "",
      topMenuTipsData: [
        {
          name: "building",
          tips: "楼栋总数",
          value: "0"
        },
        {
          name: "house",
          tips: "房屋总数",
          value: "0"
        },
        {
          name: "resident",
          tips: "住户人口",
          value: "0"
        }
      ],
      defaultProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf"
      },
      perceptionList: [],
      duration: 8,
      changeTitle: "",
      addTitle: "",
      icons,
      treeData: [],
      infrastructureId: "",
      color: ["#F05F75", "#5EF3FF", "#FFBA22"],
      defaultExpandedKeys: [],
      pieData: []
    };
  },
  mounted() {
    this.isLevelOne === "levelTwo"
      ? this.handleGetAllProject()
      : this.handleGetUnit();
    // this.initData();
  },
  activated() {},
  computed: {
    ...mapState({}),
    isLevelOne() {
      return this.$store.state.home.projectType.platformLevel;
    }
  },
  methods: {
    handleStreetChange() {
      console.log("project===", this.activeProject);
      // this.handleGetUnit();
    },
    handleGetUnit() {
      // 根据点击的基建节点获取统计数据
      // api
      //   .getInfrastructureStaticsApi(this.infrastructureId)
      //   .then(res => {
      //     if (res.data.success) {
      //       this.handleGetInfrastructureStaticsData(res.data.data);
      //     } else {
      //     }
      //   })
      //   .catch(() => {});
      this.initData();
    },
    handleGetAllProject() {
      Api.getStreetList({
        projectName: "",
        limit: 1000000,
        page: 1
      })
        .then(res => {
          let list = res.data.data.list;
          this.selectData = [...list];
          if (this.selectData.length) {
            this.activeProject = this.selectData[0].childUuid;
          } else {
            this.activeProject = "";
          }
          this.handleGetUnit();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 初始化刷新树的结构，需要拿到根节点的id
    initData() {
      let data = {
        projectUuid: this.activeProject
      };
      this.$ResidentManageAjax
        .getResidentTreeDataApi(data)
        .then(res => {
          console.log(res.data);
          this.treeData = [];
          if (res.data.success && res.data.data) {
            this.treeData.push(res.data.data);
            this.defaultExpandedKeys.push(this.treeData[0].id);
            this.infrastructureId = this.defaultExpandedKeys[0];
            this.infrastructureName = res.data.data.label;
            this.handleNodeClick(res.data.data);
          } else {
            this.$message({
              type: "warning",
              message: "没有获取到居民基建树"
            });
          }
        });
    },
    // 懒加载树
    loadNode(node, resolve) {
      if (node.level === 0) {
        resolve([]);
        return;
      }
      console.log("node====", node);
      this.$ResidentManageAjax
        .getResidentLeftMenuSubDataApi(node.data)
        .then(res => {
          console.log(res.data.data);
          if (res.data.data && res.data.data.length) {
            for (let item of res.data.data) {
              if (
                item.nodeType === "area" ||
							item.nodeType === "phase" ||
							item.nodeType === "unit" ||
							item.nodeType === "building"
              ) {
                this.$set(item, "leaf", true);
                if (item.nextCount !== 0) {
                  this.$set(item, "leaf", false);
                }
              } else {
                this.$set(item, "leaf", false);
                break;
              }
            }
            resolve(res.data.data);
          } else {
            resolve([]);
          }
        });
    },
    handleNodeClick(data, node) {
      this.infrastructureId = data.id;
      let data1 = {
        uuid: data.id,
        projectUuid: this.activeProject
      };
      let modelName;
      if (this.$store.state.home.projectType.platformType === "neighborhood") {
        modelName = "居委看板";
      } else if (this.$store.state.home.projectType.platformType === "community") {
        modelName = "社区看板";
      }
      let headerCon = {
        modelName: modelName,
        detailContent: "查看实有房屋"
      };
      // 根据点击的基建节点获取统计数据
      api
        .getInfrastructureStaticsApi(data1, headerCon)
        .then(res => {
          if (res.data.success) {
            this.handleGetInfrastructureStaticsData(res.data.data);
          } else {
          }
        })
        .catch(() => {});
    },
    handleGetInfrastructureStaticsData(data) {
      let topMenuArr = JSON.parse(JSON.stringify(this.topMenuTipsData));
      for (let i = 0; i > topMenuArr.length; i++) {
        if (topMenuArr[i].name) {
          topMenuArr[i].value = data[topMenuArr[i].name];
        }
      }
      console.log("组件数据====", data);
      this.topMenuTipsData = topMenuArr;
      this.residentData = data.liveRank ? data.liveRank : null;
      // this.pieData = [data.statistics.live, data.statistics.rent, data.statistics.unuse];
      console.log("rent====", data.statistics.rent);
      this.topMenuTipsData[0].value = data.statistics.building;
      this.topMenuTipsData[1].value = data.statistics.house;
      this.topMenuTipsData[2].value = data.statistics.resident;
      let rent = data.statistics.rent === 0 ? "" : data.statistics.rent;
      let unuse = data.statistics.unuse === 0 ? "" : data.statistics.unuse;
      let live = data.statistics.live === 0 ? "" : data.statistics.live;
      // let house = data.statistics.house === 0 ? "" : data.statistics.house;
      // let alarm = data.statistics.alarm === 0 ? "" : data.statistics.alarm;
      this.pieData = [];
      this.pieData.push({value: rent, name: "出租"});
      this.pieData.push({value: unuse, name: "闲置"});
      this.pieData.push({value: live, name: "自住"});
      // this.pieData.push({value: house, name: "重点关注"});
      // this.pieData.push({value: alarm, name: "报警"});
      console.log("pieData=====", this.pieData);
      this.$emit('changetab', data);
      this.$emit('clickNode', data);
    }
  },
  watch: {
    activeProject(val) {
      if (val) {
        // this.projectId = val;
        // console.log("val===", val);
        this.initData();
        this.$emit('chanegeProject', this.activeProject);
      }
    }
  }
};
</script>
<style>
.CBLeftContentCLass .topMenu {
margin: 0 24px 20px;
background: url(/static/img/top_menu_bg.2aa23e3.png) no-repeat;
}
.CBEldropMenu.el-dropdown-menu {
width: 200px !important;
}
.CBLeftContentCLass .topMenu .el-button--primary,
.CBLeftContentCLass .topMenu .el-button--primary:hover,
.CBLeftContentCLass .topMenu .el-button--primary:active,
.CBLeftContentCLass .topMenu .el-button--primary:focus {
width: 200px;
background: none;
border: 0px solid rgba(40, 255, 187, 0.45);
border-radius: 2px;
text-align: left;
}
.CBLeftContentCLass .topMenuTips {
display: flex;
justify-content: space-around;
margin-bottom: 25px;
padding-right: 20%;
}
.CBLeftContentCLass .topMenuTips div {
font-size: 36px;
font-family: "PingFangSC-Regular";
color: #43fbef;
text-align: justify;
}
.CBLeftContentCLass .topMenuTips div span {
font-size: 16px;
font-family: "PingFangSC-Regular";
color: #dddddd;
text-align: justify;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.CBLeftContentCLass {
width: 800px;
height: 100%;
padding-top: 30px;
box-sizing: border-box;
.topCharts {
	width: 100%;
	height: 302px;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	margin-bottom: 24px;
	.singleCharts {
		width: 370px;
		height: 302px;
		opacity: 0.8;
		background: rgba(67, 251, 239, 0.07);
		border: 1px solid rgba(37, 210, 152, 0.3);
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
		border-radius: 2px;
		position: relative;
		.title {
			width: 100%;
			height: 60px;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			padding-left: 23px;
			margin-bottom: 30px;
			.icon {
				width: 4px;
				height: 16px;
				opacity: 0.79;
				background-image: linear-gradient(-180deg, #4cebc9 0%, #25d298 100%);
				border-radius: 1px;
				border-radius: 1px;
				margin-right: 9px;
			}
			.text {
				font-family: PingFangSC-Medium;
				font-size: 18px;
				color: #25d298;
				text-align: justify;
			}
		}
	}
}
.bottomCharts {
	width: 100%;
	height: 550px;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: flex-start;
	.singleCharts {
		width: 370px;
		height: 550px;
		opacity: 0.8;
		background: rgba(67, 251, 239, 0.07);
		border: 1px solid rgba(37, 210, 152, 0.3);
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
		border-radius: 2px;
		position: relative;
		.title {
			width: 100%;
			height: 60px;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			padding-left: 23px;
			margin-bottom: 30px;
			.icon {
				width: 4px;
				height: 16px;
				opacity: 0.79;
				background-image: linear-gradient(-180deg, #4cebc9 0%, #25d298 100%);
				border-radius: 1px;
				border-radius: 1px;
				margin-right: 9px;
			}
			.text {
				font-family: PingFangSC-Medium;
				font-size: 18px;
				color: #25d298;
				text-align: justify;
			}
		}
		.statisticsWrap {
			width: 100%;
			height: 60px;
			display: flex;
			flex-direction: row;
			justify-content: space-evenly;
			align-items: center;
			.singleStatistics {
				width: auto;
				height: 34px;
				display: flex;
				flex-direction: row;
				.imgWrap {
					.img1 {
						width: 26px;
						margin-right: 12.2px;
					}
					.img2 {
						width: 15.5px;
						margin-right: 11.6px;
					}
					.img3 {
						width: 17px;
						margin-right: 11.1px;
					}
				}
				.textWrap {
					.name {
						opacity: 0.8;
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #ffffff;
						text-align: justify;
					}
					.number {
						font-family: PingFangSC-Medium;
						font-size: 20px;
						color: #ffffff;
						text-align: justify;
					}
				}
			}
		}
		.title1 {
			width: 100%;
			height: 60px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding-left: 23px;
			.left {
				width: 150px;
				height: 60px;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				.icon {
					width: 4px;
					height: 16px;
					opacity: 0.79;
					background-image: linear-gradient(
						-180deg,
						#4cebc9 0%,
						#25d298 100%
					);
					border-radius: 1px;
					border-radius: 1px;
					margin-right: 9px;
				}
				.text {
					font-family: PingFangSC-Medium;
					font-size: 18px;
					color: #25d298;
					text-align: justify;
				}
			}
			.right {
				width: 250px;
				height: 60px;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				font-family: PingFangSC-Regular;
				font-size: 16px;
				color: #aaaaaa;
				text-align: justify;
				input {
					background: rgba(255, 255, 255, 0.05);
				}
			}
		}
		.title2 {
			width: 100%;
			height: 40px;
			padding: 0 20px;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #dddddd;
			text-align: justify;
			.name {
				width: 82px;
				height: 40px;
				background: rgba(37, 210, 152, 0.15);
				border-radius: 2px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
			.address {
				width: 152px;
				height: 40px;
				background: rgba(37, 210, 152, 0.15);
				border-radius: 2px;
				border-width: 0 1px;
				border-style: solid;
				border-color: #000000;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
			.event {
				flex: 1;
				background: rgba(37, 210, 152, 0.15);
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.singleCharts1 {
		width: 370px;
		height: 550px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		.titleWrap {
			width: 370px;
			height: 100px;
		}
		.listWrap {
			width: 100%;
			flex: 1;
			.singleList {
				width: 100%;
				height: 40px;
				padding: 0 20px;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #dddddd;
				text-align: justify;
				.name {
					width: 82px;
					height: 40px;
					border-radius: 2px;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
				}
				.address {
					width: 152px;
					height: 40px;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
				}
				.event {
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
	.singleCharts:before {
		content: "";
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: linear-gradient(to left, #25d298, #25d298) left top no-repeat,
			linear-gradient(to bottom, #25d298, #25d298) left top no-repeat,
			linear-gradient(to left, #25d298, #25d298) right top no-repeat,
			linear-gradient(to bottom, #25d298, #25d298) right top no-repeat,
			linear-gradient(to left, #25d298, #25d298) left bottom no-repeat,
			linear-gradient(to bottom, #25d298, #25d298) left bottom no-repeat,
			linear-gradient(to left, #25d298, #25d298) right bottom no-repeat,
			linear-gradient(to left, #25d298, #25d298) right bottom no-repeat;
		background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
	}
}
}
</style>
