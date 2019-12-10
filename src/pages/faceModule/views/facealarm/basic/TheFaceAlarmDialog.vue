<template>
	<div class="duibidialogwrap">
		<el-dialog
			:title="title"
			class="detaildialog"
			:visible.sync="diglogvisible"
			@close="close"
			center
		>
			<div class="top">
				<!-- 抓拍图片 -->
				<div class="item">
					<div class="headerimg">
						<img
							:src="$common.setPictureShow(detail.zhuapaiurl,)"
							@click="bigImage(detail.panoramaCapturePhotoUrl)"
							alt
						/>
					</div>
					<p class="imgtitle">抓拍图片</p>
				</div>
				<div class="item iconitem">
					<div style="height:15px;"></div>
					<img src="@/assets/images/faceModule/addr.png" alt />
				</div>
				<div class="item iteminfo">
					<!-- <div style="height:15px;"></div> -->
					<p class="info">{{detail.channelName}}</p>
					<p class="info">{{detail.alarmDatetime || "报警时间：---- ----"}}</p>
					<p class="info">特征识别：{{detail.tezheng}}</p>
					<p class="info">布控任务：{{detail.faceMonitorName}}</p>
				</div>
				<div class="item itemprogress">
					<el-progress
						class="progressCircle"
						:width="progressWidth"
						:stroke-width="3"
						color="#28FFBB"
						type="circle"
						:percentage="detail.similarity"
					></el-progress>
				</div>
				<!-- 在库 图片 -->
				<div class="item">
					<div class="headerimg">
						<img :src="detail.kuurl" @click="bigImage(detail.kuurl)" alt />
					</div>
					<p class="imgtitle">在库图片</p>
				</div>
				<div class="item iconitem">
					<div style="height:15px;"></div>
					<img src="@/assets/images/faceModule/addr.png" alt />
				</div>
				<div class="item iteminfo">
					<!-- <div style="height:15px;"></div> -->
					<p class="info">所属库：{{detail.libraryName}}</p>
					<p class="info">姓名：{{detail.staffName}}</p>
					<p class="info">性别：{{detail2.gender}}</p>
					<p class="info">户籍：{{detail2.huji}}</p>
					<p class="info">民族：{{detail2.minzu}}</p>
				</div>
				<div class="item iteminfo">
					<!-- <div style="height:15px;"></div> -->
					<p class="info">出生年月：{{detail2.bir}}</p>
					<p class="info">证件类型：{{detail2.credentialNo}}</p>
					<p class="info">证件号:{{detail2.credentialNo}}</p>
				</div>
			</div>

			<div class="switchBtn">
				<div class="imagebtn" @click="showindex=0" :class="{'active':showindex===0}">人脸图片</div>
				<div class="imagebtn" @click="showindex=1" :class="{'active':showindex===1}">全景图片</div>
			</div>

			<!-- 抓拍图片展示页面 -->
			<div class="imageWrap" ref="imageWrap ">
				<div class="facewrap" v-if="!(showindex==1)">
					<div class="item" v-for="(item,index) in facearr" :key="index">
						<div class="imgfather">
							<img :src="item.faceCapturePhotoUrl" @click="bigImage(item.faceCapturePhotoUrl)" alt />
						</div>
						<p class="time">{{item.alarmDatetime}}</p>
						<p class="address">{{item.channelName}}</p>
					</div>
				</div>
				<div class="allWrap" v-if="!(showindex==0)">
					<div class="item" v-for="(item,index) in facearr" :key="index">
						<div class="imgfather">
							<img :src="item.panoramaCapturePhotoUrl" @click="bigImage(item.panoramaCapturePhotoUrl)" alt />
						</div>
						<p class="time">{{item.alarmDatetime}}</p>
						<p class="address">{{item.channelName}}</p>
					</div>
				</div>
			</div>

			<!-- 警情处理 -->
			<p class="dealtitle">警情处理</p>

			<!-- 处理流程图 -->
			<div class="flowwrap">
				<div class="item">
					<div class="noname">
						<div class="flowbtn">警情下发</div>
						<div class="arrow"></div>
					</div>
					<!-- 流程详情 -->
					<p class="flowtime">时间：2018-09-01 12:00:00</p>
					<p class="liucheng">以下发民警：民警1、民警2</p>
				</div>
				<div class="item">
					<div class="noname">
						<div class="flowbtn">警情下发</div>
						<div class="arrow"></div>
					</div>
					<!-- 流程详情 -->
					<p class="flowtime">时间：2018-09-01 12:00:00</p>
					<p class="liucheng">以下发民警：民警1、民警2</p>

					<div class="flowimagewrap">
						<img :src="defaulthader" alt />
					</div>
				</div>
				<div class="item">
					<div class="noname">
						<div class="flowbtn">警情下发</div>
						<div class="arrow"></div>
					</div>
					<!-- 流程详情 -->
					<p class="flowtime">时间：2018-09-01 12:00:00</p>
					<p class="liucheng">以下发民警：民警1、民警2</p>
				</div>
				<div class="item">
					<div class="noname">
						<div class="flowbtn">警情下发</div>
						<div class="arrow"></div>
					</div>
					<!-- 流程详情 -->
					<p class="flowtime">时间：2018-09-01 12:00:00</p>
					<p class="liucheng">以下发民警：民警1、民警2</p>
				</div>
			</div>

			<!-- 快速处理 -->
			<p class="dealtitle">快速处理</p>

			<!-- 处理意见状态选择 -->
			<el-radio-group class="radioGrounp" v-model="radio">
				<el-radio label="deal">已解决</el-radio>
				<el-radio label="no">未解决</el-radio>
			</el-radio-group>

			<!-- 提交意见 -->
			<div class="chuli">
				<span class="item itemlabel">处理意见：</span>
				<div class="item iteminput">
					<el-input v-model="suggestion" placeholder></el-input>
				</div>

				<el-button type="primary" @click="sentyijian">确定</el-button>
				<el-button type="primary" @click="resetbtn">重置</el-button>
			</div>
		</el-dialog>

		<el-dialog class="aaaaasdasd" title="图片详情" :visible.sync="dialogVisible">
			<img
				style="max-width:100%;display:block;margin:0 auto;max-height:400px;"
				:src="dialogImageUrl"
				alt
			/>
		</el-dialog>
	</div>
</template>

<script>
import * as api from "@/pages/faceModule/api.js";
export default {
  name: "TheFaceDBDialog",
  props: {
    alarminfoid: {
      type: String,
      default: function() {
        return "";
      }
    },
    progressWidth: {
      type: Number,
      default: function() {
        return 55;
      }
    },
    facearr: {
      type: Array,
      default() {
        return [
          {
            channelName: "192.168.9.198_通道1",
            panoramauri: "http://192.168.9.170:9082/17,97ce71e2776b.png",
            photouri: "http://192.168.9.170:9081/15,97cfb2f9891e.png",
            time: "2019-01-04 16:02:07"
          }
        ];
      }
    },
    detail: {
      type: Object,
      default: function() {
        return {
          zhuapaiurl: "",
          zhuapaiaddress: "",
          zhuapaitime: "",
          tezheng: "",
          taskName: "",
          jindu: 80,
          kuurl: "",
          belong: "",
          username: ""
        };
      }
    },
    detail2: {
      type: Object,
      default: function() {
        return {
          sex: "",
          huji: "",
          minzu: "",
          bir: "",
          cardtype: "",
          idcard: ""
        };
      }
    },
    title: {
      type: String,
      default: "新建人脸库"
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    kucolor: {
      type: Array,
      default: function() {
        return [
          "rgb(88,121,253)",
          "rgb(1,181,255)",
          "yellow",
          "rgb(255,295,95)"
        ];
      }
    }
  },
  mounted() {},
  data() {
    return {
      radio: "deal",
      diglogvisible: false,
      suggestion: "",
      showindex: 0,
      defaulthader: require("@/assets/user.png"),
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  watch: {
    faceDBDialogVisible: function(val) {
      this.diglogvisible = this.faceDBDialogVisible;
      if (val === true) {
        this.resetbtn();
        this.$nextTick(function() {
          var el = document.querySelector(".el-dialog__body"),
            el2 = document.querySelector(".el-imageWrap");
          if (el && el.scrollTop) {
            el.scrollTop = 0;
          }
          if (el2 && el2.scrollTop) {
            el2.scrollTop = 0;
          }
        });
      }
    }
  },
  methods: {
    resetbtn() {
      this.radio = "deal";
      this.suggestion = "";
    },
    bigImage(src) {
      this.dialogImageUrl = src;
      this.dialogVisible = true;
    },
    sentyijian() {
      if (this.suggestion.length > 50) {
        this.$message.info("处理意见不可以超过50个字符");
        return;
      }
      if (!this.alarminfoid) {
        this.$message.info("alarminfoid为空");
        return;
      }
      api
        .setyijian({
          alarminfoid: this.alarminfoid,
          suggestion: this.suggestion
        })
        .then(res => {
          console.log(res);
          if (res.data.result === 0) {
            this.$message.success("提交成功！");
            this.close();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    judge() {
      // 用于判断自定义数字
      if (this.zhuanjiao > 30) {
        this.$message.error("请填写库名称");
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.kuname) {
        this.$message.error("请填写库名称");
        return;
      }
      if (!this.kudescri) {
        this.$message.error("请填写库描述");
        return;
      }
      if (!this.shitu) {
        this.$message.error("请选择视图区域");
        return;
      }
      if (!this.kuyanse) {
        this.$message.error("请选择颜色");
        return;
      }
      if (!this.quality) {
        this.$message.error("请选择人脸质量");
        return;
      }
      if (this.quality && this.quality === "自定义" && !this.judge()) {
        return;
      }
      console.log("submit!");
    },
    close() {
      this.$emit("close");
    },
    changequality(val) {
      console.log(val);
      if (val === "自定义") {
        this.showcustom();
      } else {
        this.hidecustom();
      }
    },
    hidecustom() {
      this.showcustomize = false;
    },
    showcustom() {
      this.mohu = 0.6;
      this.wanzheng = 1;
      this.zhedang = 0.6;
      this.zhuanjiao = 15;
      this.yangfu = 15;
      this.qingxie = 15;
      this.showcustomize = true;
    }
  }
};
</script>

<style lang='scss' scoped>
@mixin info {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #dddddd;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
@mixin imgtitle {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
}
@mixin themcolor {
	font-family: "PingFangSC-Regular";
	font-size: 16px;
	color: #28ffbb;
}
$imageSize: 130px;
.chuli {
	overflow: hidden;
	.item {
		float: left;
	}
	.iteminput {
		width: 600px;
	}
	.itemlabel {
		line-height: 40px;
		@include info;
		width: 100px;
	}
	button {
		width: 120px;
		margin-left: 20px;
	}
}
.radioGrounp {
	margin-left: 100px;
}
.flowwrap {
	overflow: hidden;
	.item {
		float: left;
		p {
			@include info;
		}
		.noname {
			overflow: hidden;
			height: 42px;
			.flowbtn {
				float: left;
				text-align: center;
				background: rgb(33, 35, 38);
				border: 1px solid #28ffbb;
				border-radius: 2px;
				line-height: 40px;
				width: 120px;
				box-sizing: border-box;
				@include info;
			}
			.arrow {
				float: left;
				width: 120px;
				height: 3px;
				margin-top: 18px;
				// background-color: #aaa;
			}
		}
		.flowtime {
			margin-top: 20px;
		}
		.flowimagewrap {
			margin: 20px 0px;
			width: 100px;
			height: 100px;
			// background-color: #fff;
		}
	}
}
.dealtitle {
	position: relative;
	line-height: 60px;
	@include themcolor;
	overflow: hidden;
	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 70px;
		transform: translateY(-50%);
		height: 1px;
		width: 100%;
		background: linear-gradient(
			to right,
			#28ffbb 0%,
			#28ffbb 50%,
			transparent 50%,
			transparent 100%
		);
		background-size: 6px 1px;
	}
}
.imageWrap {
	margin-top: 5px;
	width: 100%;
	max-height: 370px;
	box-sizing: border-box;
	overflow-y: auto;
	.allWrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-content: flex-start;
		.item {
			width: 210px;
			height: 170px;
			box-sizing: border-box; // border: 1px solid #000;
			margin-right: 4px;
			margin-top: 10px;
			.imgfather {
				width: 184px;
				height: 104px;
				margin: 12px auto 0px; // background-color: #fff;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.time,
			.address {
				text-align: center;
				@include imgtitle;
			}
			.time {
				margin-top: 5px;
				line-height: 20px;
			}
			.address {
				line-height: 16px;
			}
		}
	}
	.facewrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-content: flex-start;
		.item {
			width: 144px;
			height: 178px;
			box-sizing: border-box; // border: 1px solid #000;
			margin-right: 12px;
			margin-top: 10px;
			.imgfather {
				width: 114px;
				height: 114px;
				margin: 12px auto 0px; // background-color: #fff;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.time,
			.address {
				text-align: center;
				@include imgtitle;
			}
			.time {
				margin-top: 5px;
				line-height: 20px;
			}
			.address {
				line-height: 16px;
			}
			&:nth-child(7n) {
				margin-right: 0px;
			}
		}
	}
}
.switchBtn {
	margin-top: 15px;
	width: 100%;
	height: 45px;
	text-align: left;
	font-size: 0px;
  overflow: hidden;
	.imagebtn {
		display: inline-block;
		width: 140px;
		line-height: 40px;
		background: rgb(45, 47, 50);
		border: 1px solid rgba(136, 136, 136, 0.6);
		text-align: center;
		cursor: pointer;
		@include info;
	}
	.active {
		background: rgb(37, 56, 54);
		border: 1px solid rgba(40, 255, 187, 0.6);
	}
}
.top {
	height: 160px;
	width: 100%;
	// border: 1px solid #000;
	box-sizing: border-box;
	.item {
		max-width: 220px;
		float: left;
		.headerimg {
			width: $imageSize;
			height: $imageSize; // background-color: #fff;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.imgtitle {
			line-height: 30px;
			text-align: center;
			@include imgtitle;
		}
		.info {
			@include info;
			padding-right: 15px;
			line-height: 24px;
		}
	}
	.iconitem {
		text-align: center;
		margin: 0px 15px;
	}
	.iteminfo {
		margin-right: 13px;
    p{
      margin: 5px 0;
    }
		.info {
			@include info;
			padding-right: 15px;
			line-height: 24px;
		}
	}
	.itemprogress {
		width: 150px;
		position: relative;
		height: 100%;
		// background-color: green;
		.progressCircle {
			width: 55px;
			height: 55px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>

<style lang='scss'>
/* 本页面自定义 */
.duibidialogwrap {
	.el-form-item {
		margin-bottom: 10px;
	}
	.el-input__inner {
		padding: 0px 5px 0px 8px;
	}
	.detaildialog .el-dialog {
		margin-top: 10vh !important;
		width: 1200px;
		height: 780px;
		padding: 30px;
		box-sizing: border-box;
	}
	.detaildialog .el-dialog__body {
		height: 630px;
		overflow-x: hidden;
		overflow-y: auto;
	}
}
</style>
