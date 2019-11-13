<template>
	<el-row ref="MBARecordHeight" class="MBARecord">
		<el-row class="topBox" type="flex" justify="space-between">
			<el-col :span="3" class="topTitleTxt">
				抓拍相机：
				<elPopverTree
					:channelInfoList="taskItemList"
					:elPopoverClass="MBARecordPopoverClass"
					@transferCheckedChannel="transferCheckedChannel"
					@show="popverShow"
					@hide="popverHidden"
				></elPopverTree>
			</el-col>
			<el-col :span="3" class="topTitleTxt">
				上身服饰：
				<el-select v-model="upWear" clearable placeholder="请选择">
					<el-option
						v-for="item in upWearOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="4" class="topTitleTxt" style="text-align:center">
				上身服饰颜色：
				<el-select v-model="upWearColor" clearable placeholder="请选择">
					<el-option
						v-for="item in upWearColorOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="4" class="topTitleTxt" style="text-align:center">
				上身服饰纹理:
				<el-select v-model="upWearTexture" clearable placeholder="请选择">
					<el-option
						v-for="item in upWearTextureOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="3" class="topTitleTxt" style="text-align:center;max-width:150px">
				性别:
				<el-select v-model="genderOption" placeholder="全部">
					<el-option
						v-for="item in genderOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="9" class="topTitleTxt" style="text-align:left;min-width:540px">
				抓拍时段：
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="startTime"
					type="datetime"
					placeholder="选择日期"
				></el-date-picker>
				<span class="MBARecordTxt">至</span>
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="endTime"
					type="datetime"
					placeholder="选择日期"
				></el-date-picker>
			</el-col>
		</el-row>
		<el-row class="topBox" type="flex" justify="space-between">
			<el-col :span="3" class="topTitleTxt">
				身体朝向：
				<el-select v-model="orientation" clearable placeholder="请选择">
					<el-option
						v-for="item in orientationOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>

			<el-col :span="3" class="topTitleTxt">
				下身服饰：
				<el-select v-model="lowerWear" clearable placeholder="请选择">
					<el-option
						v-for="item in lowerWearOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="4" class="topTitleTxt">
				下身服饰颜色：
				<el-select v-model="lowerWearColor" clearable placeholder="请选择">
					<el-option
						v-for="item in upWearColorOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="4" class="topTitleTxt">
				是否有手提物：
				<el-select v-model="carryingItem" clearable placeholder="请选择">
					<el-option
						v-for="item in carryingOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="4" class="topTitleTxt" style="text-align:center">
				是否戴眼镜：
				<el-select v-model="glasses" clearable placeholder="请选择">
					<el-option
						v-for="item in glassesOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="3" class="topTitleTxt" style="text-align:center;">
				是否戴帽：
				<el-select v-model="headWear" clearable placeholder="请选择">
					<el-option
						v-for="item in headWearOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-col>

			<el-col :span="3" style="text-align:right;padding-right:55px;" class="topTitleTxt">
				<el-button class="search-btn" @click="queryAct" type="primary">开始查询</el-button>
			</el-col>
		</el-row>

		<!-- 右侧人脸对比card list -->

		<el-row
			ref="compareMiddleHeight"
			v-loading="mainScreenLoading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			class="recordBoxClass"
		>
			<div
				class="elCardBoxClass"
				v-for="(o, index) in pageSize"
				:key="index"
				@click="dialogCompareAction(index)"
			>
				<el-row class="elCardBoxHeader">
					<el-col :span="14" class="asidListRowFooter textclipsClass">
						<img style="padding-right:8px" src="@/assets/time.png" alt />
						<span
							class="textclipsClass"
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
						>{{totalCompareItemList[index]?totalCompareItemList[index].time:'---- --:--:--'}}</span>
					</el-col>
					<el-col :span="10" class="asidListRowFooter imgTxtClass" style="justify-content:center">
						<span
							class="textclipsClass"
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
						>{{totalCompareItemList[index]?totalCompareItemList[index].channelName:'----'}}</span>
					</el-col>
				</el-row>
				<el-row class="elCardBoxBody" type="flex" justify="space-between">
					<el-col :span="16" class="relativeClass">
						<div class="asidCompareImgBox">
							<img
								class="asidCardImg"
								:src="totalCompareItemList[index]?totalCompareItemList[index].photouri:require('@/assets/user.png')"
							/>
						</div>
					</el-col>
					<el-col :span="8" class="relativeClass">
						<div class="asidCompareBodyImgBox">
							<img
								class="asidCardImg"
								:src="totalCompareItemList[index]?totalCompareItemList[index].bodyuri:require('@/assets/user.png')"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row type="flex" justify="space-between" class="elCardBoxFooter">
					<el-col :span="12" class="asidCompareTxtClass" style="padding-left:4.5%;">
						<el-row>
							<el-col :span="16" class="foot-asid-txt foot-box-left">
								<span>上身服饰：</span>
								<span>上身服饰纹理:</span>
								<span>下身服饰：</span>
								<span>背包：</span>
								<span>是否戴眼镜：</span>
								<span>是否手提物：</span>
							</el-col>
							<el-col
								:span="8"
								class="foot-asid-txt foot-box foot-box-txt"
								style="border-right:1px dashed rgba(40,255,187,0.3);"
							>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].upperwear)?totalCompareItemList[index].upperwear:''}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].upperweartexture)?totalCompareItemList[index].upperweartexture:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].lowerwear)?totalCompareItemList[index].lowerwear:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].bag)?totalCompareItemList[index].bag:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].glasses)?totalCompareItemList[index].glasses:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].carryingitem)?totalCompareItemList[index].carryingitem.substr(0,1):'--'}}
								</span>
							</el-col>
						</el-row>
					</el-col>

					<el-col :span="12" class="asidCompareTxtClass" style="padding-left:6%">
						<el-row>
							<el-col :span="16" class="foot-asid-txt foot-box-left">
								<span>上身服饰颜色:</span>
								<span>上身服饰分类:</span>
								<span>是否戴帽子：</span>
								<span>下身服饰颜色:</span>
								<span>身体朝向：</span>
							</el-col>
							<el-col :span="8" class="foot-asid-txt foot-box foot-box-txt">
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].uppercolor)?totalCompareItemList[index].uppercolor:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].upperwearfg)?totalCompareItemList[index].upperwearfg:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].headwear)?totalCompareItemList[index].headwear:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].lowercolor)?totalCompareItemList[index].lowercolor:'--'}}
								</span>
								<span>
									{{(totalCompareItemList[index])&&
									(totalCompareItemList[index].orientation)?totalCompareItemList[index].orientation:'--'}}
								</span>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</div>
		</el-row>
		<!-- ======================================================= 分页器 ========================================================== -->
		<el-row ref="footerHeight" class="bottomBox" type="flex" justify="flex-end">
			<el-col :span="24" class="footerPages" style="text-align:right">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total,prev, pager, next,jumper"
					:page-size="pageSize"
					:total="total"
					background
				></el-pagination>
			</el-col>
		</el-row>
	</el-row>
</template>

<script>
import dialogview from "@/pages/faceModule/components/dialogForm.vue";
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
// let id = 1000;
export default {
  name: "MBAnalysis",
  components: { dialogview, elPopverTree },
  mounted: function() {
    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    let w =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
    h = h - 5;
    this.$refs.MBARecordHeight.$el.style.height = h + "px";
    console.log(w);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      let w =
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth;
      h = h - 5;
      that.$refs.MBARecordHeight.$el.style.height = h + "px";
      console.log(w);
    });
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();

    this.getTaskList(true);
  },

  watch: {},
  activated: function() {
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.getTaskList(false);
  },
  methods: {
    transferCheckedChannel(checkedChannel) {
      console.log(checkedChannel);
      this.checkedChannelsUuidList = [];
      for (var i = 0; i < checkedChannel.length; i++) {
        this.checkedChannelsUuidList.push(checkedChannel[i].id);
      }
    },

    checkFaceDBChanges() {
      this.checkedFaceDB = this.$refs.faceDBTree.getCheckedKeys();
      console.log(this.checkedFaceDB);
    },
    popverHidden(e) {},
    popverShow() {
      console.log("展开------");
    },
    checkBoxAction(data, node) {
      console.log("点击复选框的事件");
    },
    checkChanges(node, e2) {
      this.checkedChannelsUuidList = this.$refs.tree.getCheckedKeys();
    },
    clearAction() {
      console.log("清除----");
      this.checkNameString = "";
    },

    queryAct() {
      if (this.startTime.length > 0 && this.endTime.length > 0) {
        // eslint-disable-next-line no-useless-escape
        var d1 = new Date(this.startTime.replace(/\-/g, "/"));
        // eslint-disable-next-line no-useless-escape
        var d2 = new Date(this.endTime.replace(/\-/g, "/"));
        if (this.startTime !== "" && this.endTime !== "" && d1 >= d2) {
          this.$message({
            message: "开始时间必须小于结束时间！",
            type: "warning"
          });
          return;
        }
      }
      this.currentPage = 1;
      this.totalCompareItemList = [];
      this.total = 0;
      this.getMBARecordList(true);
    },
    getMBARecordList(isTotal) {
      this.mainScreenLoading = true;
      var params = {};
      if (this.upWear) {
        params.upperwear = this.upWear;
      }
      if (this.upWearTexture) {
        params.upWeartexture = this.upWearTexture;
      }
      if (this.lowerWear) {
        params.lowerwear = this.lowerWear;
      }
      if (this.lowerWearColor) {
        params.lowercolor = this.lowerWearColor;
      }
      if (this.upperWear) {
        params.upperwear = this.upperWear;
      }
      if (this.checkedChannelsUuidList && this.checkedChannelsUuidList.length) {
        params.vidname = this.checkedChannelsUuidList;
      }
      if (this.genderOption) {
        params.gender = this.genderOption;
      }
      if (this.upWearColor) {
        params.uppercolor = this.upWearColor;
      }
      if (this.carryingItem) {
        params.carryingitem = this.carryingItem;
      }
      if (this.orientation) {
        params.orientation = this.orientation;
      }
      if (this.glasses) {
        params.glasses = this.glasses;
      }
      if (this.headWear) {
        params.headwear = this.headWear;
      }
      if (this.pageSize) {
        params.pageSize = this.pageSize;
      }
      if (this.currentPage) {
        params.currentPage = this.currentPage;
      }
      if (this.startTime) {
        params.starttime = this.startTime;
      }
      if (this.endTime) {
        params.overtime = this.endTime;
      }

      console.log(params);

      this.$store.dispatch("getMBodyRecordList", params).then(res => {
        // debugger
        this.mainScreenLoading = false;
        if (res.result === 0 && res.data.list && res.data.list.length) {
          this.totalCompareItemList = res.data.list;
          // if(res.data.total && res.data.list.length && isTotal){
          this.total = res.data.total;
          // }
        } else {
          this.$message({ message: "没有查找到相关的记录", type: "warning" });
        }
      });
    },
    closeDialog(e) {
      console.log("父組件==" + e);
      this.dialogVisible = e;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`点击当前页: ${val}`);
      this.currentPage = val;
      this.getMBARecordList(false);
    },
    // 获取任务列表
    getTaskList(isTrue) {
      // 此处有一个BUG，任务列表会有两次返回值，暂未找到原因
      // this.mainScreenLoading=true;

      this.$store.dispatch("getBodyDeviceList").then(res => {
        console.log("getBodyDeviceList", res);
        this.taskItemList = res.data;

        console.log(this.taskItemList);
        if (isTrue) {
          this.getMBARecordList();
        }
      });
    },

    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  data() {
    return {
      MBARecordPopoverClass: "MBARecordPopoverClass",
      totalCompareItemList: new Array(),
      api: this.$store.state.api, // http://172.20.10.11:5000/mppr-face
      checkedChannelsNameList: [], // 当前勾选的通道名称list
      checkedChannelsUuidList: new Array(), // 当前勾选的通道Id的list
      taskItemList: [], // 布控任務列表
      mainScreenLoading: false, // 局部遮罩是否显示
      pageSize: 10,
      total: 0,
      currentPage: 1,
      startTime: "",
      endTime: "",
      dialogVisible: false, // 彈窗顯示標記
      dialogParama: "弹窗视图的参数",
      value5: [],
      value11: [],
      shootPhotoList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkNameString: "",
      faceDBList: [],
      checkedFaceDB: [],
      allFaceDBUuid: [],
      checkFaceDBNameString: "",
      genderOption: "",
      genderOptions: [
        {
          label: "全部",
          value: null
        },
        {
          label: "男",
          value: "男性"
        },
        {
          label: "女",
          value: "女性"
        }
      ],

      upWearOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "长袖",
          label: "长袖"
        },
        {
          value: "短袖",
          label: "短袖"
        }
      ],
      upWearColorOptions: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "红",
          label: "红"
        },
        {
          value: "橙",
          label: "橙"
        },
        {
          value: "黄",
          label: "黄"
        },
        {
          value: "绿",
          label: "绿"
        },
        {
          value: "蓝",
          label: "蓝"
        },
        {
          value: "紫",
          label: "紫"
        },
        {
          value: "粉",
          label: "粉"
        },
        {
          value: "黑",
          label: "黑"
        },
        {
          value: "白",
          label: "白"
        },
        {
          value: "灰",
          label: "灰"
        },
        {
          value: "棕",
          label: "棕"
        }
      ],
      upWearTextureOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "纯色",
          label: "纯色"
        },
        {
          value: "图案",
          label: "图案"
        },
        {
          value: "碎花",
          label: "碎花"
        },
        {
          value: "条纹或格子",
          label: "条纹或格子"
        },
        {
          value: "无法确定",
          label: "无法确定"
        }
      ],
      lowerWearOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "长裤",
          label: "长裤"
        },
        {
          value: "短裤",
          label: "短裤"
        },
        {
          value: "长裙",
          label: "长裙"
        },
        {
          value: "短裙",
          label: "短裙"
        }
      ],
      glassesOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "戴眼镜",
          label: "戴眼镜"
        },
        {
          value: "戴墨镜",
          label: "戴墨镜"
        },
        {
          value: "无眼镜",
          label: "无眼镜"
        }
      ],
      headWearOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "无帽",
          label: "无帽"
        },
        {
          value: "普通帽",
          label: "普通帽"
        },
        {
          value: "安全帽",
          label: "安全帽"
        }
      ],
      orientationOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "正面",
          label: "正面"
        },
        {
          value: "背面",
          label: "背面"
        },
        {
          value: "左侧面",
          label: "左侧面"
        },
        {
          value: "右侧面",
          label: "右侧面"
        }
      ],
      carryingOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "有手提物",
          label: "有"
        },
        {
          value: "无手提物",
          label: "无"
        }
      ],
      upWear: "",
      upWearColor: "",
      upWearTexture: "",
      glasses: "",
      lowerWear: "",
      lowerWearColor: "",
      headWear: "",
      orientation: "",
      carryingItem: ""
    };
  }
};
</script>
<style>
.MBARecord .relativeClass {
	/* position: relative; */
	margin-right: 12px;
}

.el-select-dropdown__wrap {
	max-height: none;
}
.MBARecord .el-pagination__jump {
	margin-left: 24px;
	font-weight: 400;
	color: #cccccc;
}
.MBARecordTxt {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #888888;
}
.MBARecord .foot-box-txt {
	color: #ffffff !important;
}
.MBARecord .foot-box {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.75);
	margin-top: 2px;
}
.MBARecord .foot-box-left span {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #888888;
	letter-spacing: 0;
	line-height: 20px;
}
.MBARecord .foot-box span {
	padding: 1px 0px;
	line-height: 18px;
}
.MBARecord .foot-asid-txt {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: flex-start;

	/* padding-left:20px;  */
}
.MBARecordPopoverClass .is-checked .el-checkbox__inner,
.MBARecordPopoverClass
	.el-checkbox__input.is-indeterminate
	.el-checkbox__inner {
	background-color: transparent;
	border-color: #28ffbb;
	/* color:#28FFBB; */
}
.MBARecordPopoverClass .el-checkbox__inner::after {
	-webkit-box-sizing: content-box;
	box-sizing: content-box;
	content: "";
	border: 1px solid #28ffbb;
	border-left: 0;
	border-top: 0;
	height: 7px;
	left: 4px;
	position: absolute;
	top: 1px;
	-webkit-transform: rotate(45deg) scaleY(0);
	transform: rotate(45deg) scaleY(0);
	width: 3px;
	-webkit-transition: -webkit-transform 0.15s ease-in 0.05s;
	transition: -webkit-transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s,
		-webkit-transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s,
		-webkit-transform 0.15s ease-in 0.05s;
	-webkit-transform-origin: center;
	transform-origin: center;
}
.el-time-spinner__item.active:not(.disabled) {
	color: #ffffff;
	font-weight: 700;
}

.el-picker-panel__icon-btn {
	font-size: 12px;
	color: #f2f6fc;
	border: 0;
	background: 0 0;
	cursor: pointer;
	outline: 0;
	margin-top: 8px;
}

.el-time-panel {
	margin: 5px 0;
	border: 1px solid #e4e7ed;
	background: #202127;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	position: absolute;
	width: 180px;
	left: 0;
	z-index: 1000;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.MBARecordPopoverClass .el-checkbox__inner {
	display: inline-block;
	position: relative;
	border: 1px solid #dcdfe6;
	border-radius: 2px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	width: 14px;
	height: 12px;
	background-color: transparent;
	z-index: 1;
	margin: 0px;
	-webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
		background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
	transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
		background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.MBARecordPopoverClass
	.el-tree--highlight-current
	.el-tree-node.is-current
	> .el-tree-node__content {
	background-color: transparent;
}
.MBARecordPopoverClass .el-tree {
	position: relative;
	cursor: default;
	background: #202127;
	color: #efefee;
}
.MBARecordPopoverClass .el-tree-node__content:hover {
	background-color: #000000;
	/* color: #; */
}

.MBARecordPopoverClass .el-tree {
	color: #aaaaaa;
	background: none;
}
.MBARecordPopoverClass .el-tree-node__content:hover {
	background: none;
}
.MBARecordPopoverClass .el-tree-node:focus > .el-tree-node__content {
	background: none;
	/* color: #28FFBB; */
}
.MBARecordPopoverClass .el-tree-node__expand-icon {
	color: #28ffbb;
	display: none;
}
.MBARecordPopoverClass {
	width: 50%;
	height: 45%;
	position: absolute;
	background: #202127;
	min-width: 150px;
	max-height: 80%;
	/* border: 1px solid rgba(40,255,187, 1); */
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	overflow: auto;
	box-sizing: border-box;
}
.MBARecord .el-date-editor.el-input,
.MBARecord .el-date-editor.el-input__inner {
	/* width: 220px; */
	/* width: 30%; */
	max-width: 200px;
}
.MBARecord .dialogClass .el-dialog__body {
	padding: 0;
	color: #606266;
	font-size: 14px;
}
.MBARecord .textclipsClass {
	display: inline-block;
	/* width: 100%; */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	/* autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
}
.MBARecord .el-button--primary {
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
	font-family: PingFangSC-Regular;
	font-size: 18px;
	color: #ffffff;
	margin-left: 2.8%;
}
.MBARecord .el-input--prefix .el-input__inner {
	padding-left: 15px;
}
.MBARecord .el-input--suffix .el-input__inner {
	padding-right: 15px;
}
.MBARecord .el-progress .el-progress-circle {
	transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-webkit-transform: rotate(90deg);
}
.el-picker-panel__footer {
	border-top: 1px solid #e4e4e4;
	padding: 4px;
	text-align: right;
	background-color: transparent;
	position: relative;
	font-size: 0;
}
.el-picker-panel__footer .el-button:hover {
	background: transparent;
}
.el-picker-panel__footer .el-button {
	display: inline-block;
	line-height: 1;
	white-space: nowrap;
	cursor: pointer;
	background: transparent;
	border: 1px solid #dcdfe6;
	color: #606266;
	-webkit-appearance: none;
	text-align: center;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	-webkit-transition: 0.1s;
	transition: 0.1s;
	font-weight: 500;
	padding: 12px 20px;
	font-size: 14px;
	border-radius: 4px;
}
.MBARecord .dialogClass {
	text-align: left;
}
.my_el-dialog__header {
	padding: 20px 20px 10px;
	height: 58px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(40, 255, 187, 0.2);
}
.MBARecord .el-dialog__title {
	line-height: 24px;
	font-family: PingFangSC-Regular;
	font-size: 20px;
	color: #ffffff;
	text-align: left;
	margin-left: 11px;
}
.MBARecord .el-dialog {
	position: relative;
	margin: 0 auto 50px;
	background-image: linear-gradient(-180deg, #16171f 0%, #10131a 100%);
	border-radius: 3px;
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	/* width: 50%; */
	color: #fff;
}
.MBARecord .fontColor {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #cccccc;
	letter-spacing: 0;
}
.MBARecord .fontTheme {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgb(39, 150, 119) !important;
	letter-spacing: 0;
	cursor: pointer;
}
.MBARecord .el-dialog__header {
	display: none;
	padding: 20px 20px 10px;
}
.MBARecord .el-progress__text {
	font-size: 14px !important;
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	/*margin-left: 10px;*/
	line-height: 1;
}
.MBARecord .elCardBoxClass {
	width: calc((100% - 110px) / 5);
	height: calc((100% - 280px) / 2);
	margin: 20px 20px 0 0;
	color: #ffffff;
	box-sizing: border-box;
	background: rgba(27, 30, 33, 1);
	border: 1px solid rgba(33, 63, 58, 1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	border-radius: 2px;
}

.MBARecord .elCardBoxHeader {
	/* border-bottom: 1px dashed rgba(255,255,255,0.1); */

	padding: 15px;
}
.MBARecord .elCardBoxBody {
	width: 100%;
	padding: 0px 17px 0px 30px;
	height: 45%;
	/* min-height: 150px; */
	box-sizing: border-box;
}
.MBARecord .asidCompareBodyImgBox {
	width: 100%;
	box-sizing: border-box;
	height: 0;
	padding-bottom: 200%;
	position: relative;
}
.MBARecord .asidCompareImgBox {
	width: 100%;
	box-sizing: border-box;
	height: 0;
	padding-bottom: 100%;
	position: relative;
}

.MBARecord .elCardBoxFooter {
	height: calc(55% - 50px);
}
.MBARecord .asidCompareTxtClass {
	height: 100%;
	text-align: left;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 13px 0px 15px;
}

.MBARecord .asidCardImg {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0px;
	top: 0px;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-clip: content-box;
}
.MBARecord .asidListRowFooter {
	/* line-height: 35px; */
	font-size: 14px;
	text-align: left;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.MBARecord .asidListRowFooter span {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	letter-spacing: 0;
}
.MBARecord .el-select-dropdown__item {
	font-size: 14px;
	padding: 0 20px;
	position: relative;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: #efefef;
	height: 34px;
	line-height: 34px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	cursor: pointer;
}
.el-select-dropdown {
	position: absolute;
	z-index: 1001;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background: rgba(39, 42, 45, 0.9);
	box-shadow: 2px 2px 16px 0 rgba(2, 0, 14, 0.3);
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	margin: 5px 0;
}
.el-select {
	width: 50%;
	display: inline-block;
	position: relative;
}
.el-select .el-tag {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-color: transparent;
	margin: 2px 0 2px 6px;
	color: #e4e7ed;
	background-color: transparent;
}
.MBARecord .el-button--primary {
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
	font-family: PingFangSC-Regular;
	font-size: 18px;
	color: #ffffff;
	margin-left: 2.8%;
}
.MBARecord .recordCellFooterTxt {
	/* opacity: 0.8; */
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	letter-spacing: 0;
}
.MBARecord .recordCellFooter {
	width: 100%;
	/* height: 80px; */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 9px;
}
.MBARecord .recordBoxClass {
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding-left: 20px;
	background: rgba(36, 39, 42, 1);

	margin-top: 20px;
	box-sizing: border-box;
}
.textclipClass {
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	/* autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
}
.MBARecord {
	font-family: Helvetica, sans-serif;
	text-align: center;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	background: rgb(28, 29, 32);
	padding: 40px 50px 30px;
}
.MBARecord .bottomBox {
	padding: 20px 50px 20px 15px;
	display: flex;
	align-items: center;
	width: 100%;
	height: 65px;
	background: rgba(36, 39, 42, 1);
}
.MBARecord .topBox {
	padding: 20px 3px 20px 33px;
	display: flex;
	align-items: center;
	width: 100%;
	height: 80px;
	background: rgba(36, 39, 42, 1);

	/* border:1px solid red; */
}
.topBox .bth-title {
	opacity: 0.8;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
}
.MBARecord .topTitleTxt {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	display: block;
	text-align: left;
	color: #cccccc;
}
</style>
