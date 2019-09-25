<template>
	<div class="tablelist" ref="tablelist">
		<div class="aaaa" v-loading="isloading">
			<div class="fater">
				<div class="item" v-for="(item,index) in tableData" :key="index">
					<recoginize-card
						:recoginizeItem="item"
						@detailClick="openDialog(item.detail)"
            @click="openDialog(item.detail)"
					/>
					<!--	<div class="header1">
						<img
							v-if="!item.alarmed"
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAsJJREFUOBF1U0tIVGEU/v7rI51ZpJipEVHYwnGkFINIQh0V6QVBEi2iAiuiRUGLisLAwGiRtAsirVWLtEWrMppxZjYVgb2mfGQFmYKjERXhI517T98Zu2WWB/77n//7vnPuuf8512CB+SWyVmDvEyAgkJWAMQYywj1C7OaAqRucH2LcQ7VEMsZgt/J8hIFfGPDAAt4DIgJTSKyeXA7x9mx4Tjw2FVMam0ywTl56ZzHezXMZ16U8pLZETWBaBa5tlbdLhjB01oGcJvYqB5k1D83m70neJ6HOIglNFUm43A1YbOcnlvokOMGYO6oxJRKsTgARC9bRPlN7VUG/9KY7iJ8EnC1JEUyXQUFrr/HP6Nkn3YcETpuBqbdsoJHf8cINbhaxHIwGGXyG+Qe4Bh2gycbofeU0Qb+pbefWw9VIwFQwU5cSah0I7+W2CbAq+03dYa6DrC7Ay6y8hfCepIgPC+YesQqLt5vLc9wl+GYG4znf8szF+kzNE74kxrNySWNLx+gss0iMMMnyX7i2ZZzkCrY11cXKpSeNfgHn4ZOLUZfH9g5rBe8I+v4QppOl5caRuFYioTzeev4kvrYxaVYaLHJzxnvx0xtkBYgy07ZyCS5VqtfU9bGqA3QbEpC4jcQo/Z385v0xU/NGNb+02+lGLQ9wg6XZk8AxJdV4cR0p8K5h8h26LHgK2aXbcyygWuIJL+R6EuMQXSiS4LRfQsWuaLFdNarlMLWoJtlXL7Ka2c4Yx7SrVCKrlfif+SW4inNzV7UeZJ9XTTLBU7NhNh0pu3ie+QE7WizhjQsTFEuwjMFRlm6nIq1BY34nUCdmAiMZyKyi+9mB/Yjjepnt8+wWSWG5TbxozgK+pcNUvTZVwxqjRuxv07/uAz5e5KwfJz3Elk5QwZZZV/JhnVr4l/6TwE3nl/B6Bw4vSuffOjd/Ml2N7j8BJgcRwi91UMEAAAAASUVORK5CYII="
							alt
						/>
						<img
							v-else
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAAXNSR0IArs4c6QAAAdNJREFUKBVdkj1IHFEQx2eWvTsRtBOCNoFEQiAEP8o0QpQUFsHWgLd3OS5KPBAsLEMqA4kf4Eehp7ciIihptBHbQBAhSJqIYiOkUAhCtPFc8OU3ezlRB2Zn5j/znzfvzarcEpfJvBbneoBasPWi+hP/m9TVzejUVLlaquZQ3CDX10WKnhFOiuftYS/AnmN70UfkAi2VvuOLOudUgmAb8Jh4UMPw0hK3xaXTb4gnJZFo1WLxty/Z7HuAekkmB3RuLnJB0MFowzEmsiZhOKuqK+BPJIoWwF/5jBDgTMSEdLod/yvjjUA8RUclk6kF+0zTMbm6OnP9/U0eQDOj7WKF4j78aWYvMuYmyDv0raVo+hdzKOXyY4+iMzRhCSTiZOtcEdVaTouqIX5KfP+Pj3MIqY3EL+w8usPF7TFO0BH0I1p5YecapabmyE5ahZizhC4uHhC/QBsIzRZ0ackuD8tl+W7YvtQVCik5P9+n4AP3WI4L7n14uYdAexA7afLDizet2gswTbLrXr2APQDbIv/FCJaP/whzuEc3p62QHJdUavT/Cl6ClUivM4XtLpYbkkUul3vKApcpTBJaV/sPhyCE2Bu5QzLU5fMJdpGH2Ez4CYK94h35BwTZsnFaUjdeAAAAAElFTkSuQmCC"
							alt
						/>
						<span class="adadr" :style="{'color':item.alarmed?'#FF5F5F':''}">
							{{item.zhuapai}}
						</span>
						<span class="aaac" @click="openDialog(item.detail)">
							<span class="xiangqing">详情</span>
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAhNJREFUOBGFU01rE2EQnpl9Q9u0Hqz+gGz9KhQsZHMo0oLYSwvq0aOHfpDQc+ql6EG9qFEQIWmgvfToRfBgvVQPBamwG6lQWlSaCh6FHOyHssmOM2vXLjGpc9gd5nmemXnfeQehyez14gWowxQzjgJyJ8gHGH4hwJsE0MKnTHYrLpH4H7vMb81Xb/OBCIYBuJDsOr28MXBjV9GL60vdPxr74xAEeURcO8k062WyvmJhAhXvVLZeAuNa1cneExIr2GwsbfV9KM0Jb7iX6ZomISWFlUW8k8ndbSdWnmLV9Mx9cVdrGDwKY+GZfVzadnJDcbFdKV6Xs9eqzsyqEuOmndiV+XcJMBMEdZqUgzyOi5VsWYmK1Hxme8WRuFh95RJCoc7+FEm20WTnqVfNpC+D098sY662S9Jjdb+Wi7pCMqWu6LaPS9LnlmU6R/Zx8OaedN5hjkJtPD/oEISA+GcrBslIDgY2nve0As+65TMNCF4g4cR2OufGOY5bTuoDI7mQlf2D7+NxUP3jxIrXkMf0dRKYYFEuKq+jUSAyRj7XqrLiyg2AZw0mFkJ+yis9SbnzdyLx//62V5qz3dJT5YUvMZXuvyXTGJLg7eZO4skUU7HERnqB8or9bftwHx4i8yUgKpywksvhqISky7Tb2BsLGPJS8f0/y6SZIjvvlvt9bExKscN1FiRcZ1wxaBY/O9ObEVf/vwEU9ODwC7zj1QAAAABJRU5ErkJggg=="
								alt
							/>
						</span>
					</div>
					<div class="content">
						<div class="aitem">
							<div class="aitemimg">
								<img
									:src="item.zhuapaipic?item.zhuapaipic:userheader"
									@click="showbig(item.zhuapaipic)"
									alt
								/>
							</div>
							<div class="aitemprogress">
								<el-progress
									class="progressCircle"
									:class="{isactive:item.alarmed}"
									:stroke-width="3"
									:width="progressWidth"
									:color="item.alarmed?'#FF5F5F':'#28FFBB'"
									type="circle"
									:percentage="item.percent"
								></el-progress>
							</div>
							<div class="aitemimg">
								<img :src="item.kulipic?item.kulipic:userheader" @click="showbig(item.kulipic)" alt />
							</div>
							<div class="aitemp">
								<el-tooltip effect="dark" :content="item.alarmtime" placement="right">
									<p>{{item.alarmtime}}&nbsp;</p>
								</el-tooltip>
								<el-tooltip effect="dark" :content="item.staffname" placement="right">
									<p>{{item.staffname}}&nbsp;</p>
								</el-tooltip>
								<p>
									<el-tooltip effect="dark" :content="item.belong" placement="right">
										<span>{{item.belong}}&nbsp;</span>
									</el-tooltip>
									<i class="el-icon-warning" :style="{'color':item.alarmed?'#FF5F5F':item.librarycolor}"></i>
								</p>
							</div>
						</div>
					</div>-->
				</div>
				<div class="item hiddenitem" v-for="(item,index) in getLast" :key="item+index"></div>
			</div>
		</div>

		<div class="footer">
			<el-pagination
				background
				layout="prev, pager, next"
				:page-size="pageSize"
				:current-page="pageNow"
				@current-change="currentChange"
				:total="pageCount"
			></el-pagination>

			<p class="totalpagetitle">共{{pageCount}}条</p>

			<div class="tiaozhuan">
				<span>跳转至</span>
				<el-input class="yeshu" type="number"></el-input>
			</div>
		</div>
		<the-face-alarm-dialog
			title="对比详情"
			:faceDBDialogVisible="facealarmvisible"
			@close="facealarmvisible=false"
		></the-face-alarm-dialog>
		<el-dialog class="FAImageDetailDialog" title="图片详情" :visible.sync="dialogVisible">
			<img
				style="max-width:100%;display:block;margin:0 auto;max-height:400px;"
				:src="dialogImageUrl"
				alt
			/>
		</el-dialog>
	</div>
</template>

<script>
import TheFaceAlarmDialog from "@/pages/faceModule/views/page/search/facealarm/basic/TheFaceAlarmDialog.vue";
import RecoginizeCard from "@/pages/faceModule/components/RecoginizeCard.vue";
export default {
  name: "facedblist",
  props: {
    isloading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    progressWidth: {
      type: Number,
      default() {
        return 45;
      }
    },
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        for (var i = 0; i < 13; i++) {
          num.push({
            index: ("0" + (i + 1)).slice(-2),
            name: "王小虎",
            sex: "男",
            time: "2018-10-18 12:00:00",
            id: "342626199411060399",
            ku: "住户"
          });
        }
        return num;
      }
    },
    pageSize: {
      type: Number,
      default: function() {
        return 12;
      }
    },
    pageNow: {
      type: Number,
      default: function() {
        return 1111;
      }
    },
    pageCount: {
      type: Number,
      default: function() {
        return 1000;
      }
    }
  },
  computed: {
    getLast() {
      var len = this.pageSize - this.tableData.length;
      len = Math.max(0, len);
      var a = [];
      while (len--) {
        a.push("kj");
      }
      return a;
    }
  },
  data() {
    return {
      multipleSelection: [],
      facealarmvisible: false,
      arr: [1, 1, 1, 1, 1],
      dialogImageUrl: "",
      dialogVisible: false,
      userheader: require("@/assets/user.png")
    };
  },
  mounted() {
    // this.$nextTick(function() {
    //   var win_h = window.innerHeight;
    //   var tableheight =
    //     parseInt(getComputedStyle(this.$refs.tablelist).height) - 40;
    //   this.pageSize = Math.floor(tableheight / 43);
    //   //   alert(this.pageSize);
    // });
    var num = [];
    for (var i = 0; i < 12; i++) {
      num.push({
        index: ("0" + (i + 1)).slice(-2),
        name: "王小虎",
        sex: "男",
        time: "2018-10-18 12:00:00",
        id: "342626199411060399",
        ku: "住户"
      });
    }
    this.tableData = num;
  },
  methods: {
    showbig(url) {
      if (url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      }
    },
    openDialog(detail) {
      this.$emit("lookface", detail);
    },
    lookface() {
      this.facealarmvisible = true;
    },
    currentChange(index) {
      this.$emit("pagechange", index);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  components: {
    TheFaceAlarmDialog,
    RecoginizeCard
  }
};
</script>

<style lang="scss" scoped>
@mixin active {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #fff;
	letter-spacing: 0;
}
@mixin fontsa {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
}
.aaaa {
	height: calc(100% - 115px);
	.fater {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: space-between;
		overflow: auto;
		.item {
			background-color: rgb(27, 30, 33);
			box-sizing: border-box;
			margin-bottom: 30px;
			margin-left: 12px;
			.content {
				padding: 10px 12px;
				box-sizing: border-box;
				overflow: hidden;
				.aitem {
					float: left;
					width: 100%;

					overflow: hidden;
					.aitemp {
						text-indent: 8px;
						line-height: 30px;
						@include fontsa;
						p {
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}

					.aitemimg {
						position: relative;
						float: left;
						width: 25%;
						overflow: hidden;
						padding-bottom: 25%;
						// width:100px;
						// height: 100px;
						// background-color: #aaa;
						img {
							position: absolute;
							top: 0px;
							left: 0px;
							width: 100%;
							height: 100%;
						}
					}
					.aitemprogress {
						float: left;
						width: 60px;
						height: 100px;
					}
				}
			}
			.header1 {
				width: 100%;
				vertical-align: middle;
				padding: 10px 12px;
				box-sizing: border-box;
				@include active;
				border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
				margin-bottom: 10px;
				.adadr {
					display: inline-block;
					vertical-align: middle;
				}
				.aaac {
					cursor: pointer;
					float: right;
					.xiangqing {
						display: inline-block;
						vertical-align: middle;
						// color: rgb(39, 150, 119);
						color: #28ffbb;
					}
				}

				img {
					vertical-align: middle;
					width: 16px;
				}
			}
		}
		.hiddenitem {
			opacity: 0;
		}
	}
}
.footer {
	position: relative;
	// margin: 30px 0px;
	.totalpagetitle {
		font-size: 14px;
		color: #fff;
		float: right;
		margin-right: 20px;
		margin-top: 17px;
	}
	.el-pagination {
		margin-right: 180px;
		margin-top: 10px;
		float: right;
	}
	.tiaozhuan {
		position: absolute;
		right: 20px;
		top: 6px;
		span {
			font-size: 14px;
			color: #fff;
			padding-right: 20px;
		}
		.yeshu {
			display: inline-block;
			width: 90px;
			input {
				padding: 0px;
			}
		}
	}
}
</style>

<style lang='scss'>
// .FAImageDetailDialog {
//   .el-dialog {
//     // height:400px!important;
//   }
// }
.progressCircle {
	margin: 20px 10px;
	.el-progress__text {
		font-family: "PingFangSC-Regular";
		font-size: 14px !important;
		color: #28ffbb;
		letter-spacing: 0;
	}
}
.isactive {
	.el-progress__text {
		color: #ff5f5f;
	}
}
</style>
