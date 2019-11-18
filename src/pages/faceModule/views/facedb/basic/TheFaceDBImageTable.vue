<template>
	<div class="tablelist" ref="tablelist">
		<div class="body" v-loading="listtableloadding">
			<div class="box" v-for="(item,index) in imageTableData " :key="index">
				<div class="headerimg">
					<img :src="$common.setPictureShow(preload[index])" alt />
					<el-checkbox class="checkButton" v-model="item.checked" @change="checkboxchange(index)"></el-checkbox>
					<div class="mask">
						<div class="operator">
							<i class="el-icon-edit-outline" @click="editface(imageTableData[index])">编辑</i>
							<i class="el-icon-delete" @click="deleteface(imageTableData[index])">删除</i>
						</div>
					</div>
				</div>
				<p class="time">
					<span class="item">{{item.staffName||""}} &nbsp;</span>
					<span style="margin:0 5px" class="item">{{item.gender||""}}</span>
					<span
						class="item textclipsClass"
						@mouseover="mymouseover"
						@mouseout="mymouseout"
						@mousemove="mymousemove"
					>{{item.staffType||""}}</span>
				</p>
				<div class="textclipsClass credentialType">{{item.credentialType||"----"}}</div>
				<p
					@mouseover="mymouseover"
					@mouseout="mymouseout"
					@mousemove="mymousemove"
					class="textclipsClass adress"
				>{{item.credentialNo||'----'}}</p>
				<!-- </el-tooltip> -->
			</div>
			<!-- <div class="box hiddenitem" v-for="(item,index) in getLast" :key="item+index"></div> -->
		</div>
		<div class="footer">
			<el-pagination
				background
				layout="prev, pager, next"
				:page-size="imagePageSize"
				:current-page="imagePageNow"
				@current-change="currentChange"
				:total="imagePageCount"
			></el-pagination>
			<p class="totalpagetitle">共{{ imagePageCount}}条</p>
			<div class="tiaozhuan">
				<span>跳转至</span>
				<el-input
					class="pageIndexClass"
					v-model="pageIndex"
					@blur="blur"
					@keyup.enter.native="blur"
					onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
					type="number"
				></el-input>
			</div>
		</div>
	</div>
</template>

<script>
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  name: "facedblist",
  props: {
    listtableloadding: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    imageTableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    selectall: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    imagePageNow: {
      type: Number,
      default() {
        return 1;
      }
    },
    imagePageSize: {
      type: Number,
      default() {
        return 15;
      }
    },
    imagePageCount: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      imageHeader: RestApi.api.imageUrl,
      pageIndex: "",
      multipleSelection: [],
      pageSize: 24,
      pagenow: 1,
      total: 1000,
      countdata: 10000,
      preload: []
    };
  },
  computed: {
    getLast() {
      var len = this.imagePageSize - this.imageTableData.length;
      var a = [];
      while (len--) {
        a.push("kj");
      }
      return a;
    }
  },
  mounted() {
    // this.$nextTick(function() {
    //   var win_h = window.innerHeight;
    //   var tableheight =
    //     parseInt(getComputedStyle(this.$refs.tablelist).height) - 40;
    //   this.pageSize = Math.floor(tableheight / 43);
    //   //   alert(this.pageSize);
    // });
  },
  methods: {
    blur() {
      if (this.pageIndex !== "") {
        if (
          this.pageIndex > Math.ceil(this.listPageCount / this.listPageSize)
        ) {
          this.pageIndex = Math.ceil(this.listPageCount / this.listPageSize);
        }
        this.pageIndex = parseInt(this.pageIndex);
        this.$emit("changepage", parseInt(this.pageIndex));
      }
    },
    editface(row) {
      console.log(row.staffName);
      this.$emit("getFaceDetail", row.faceUuid, row.faceLibraryUuid);
    },
    deleteface(row) {
      this.$emit("deleteStaffFace", [row.faceUuid]);
    },
    currentChange(index) {
      this.$emit("changepage", index);
    },
    checkboxchange() {
      var flag = this.judgeallchecked();
      this.$emit("checkall", flag);
    },
    judgeallchecked() {
      var flag = true;
      for (var i = 0, len = this.imageTableData.length; i < len; i++) {
        if (!this.imageTableData[i].checked) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    downloadImage(url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = this.imageHeader + url;
        if (img.complete) resolve();
        img.onload = function() {
          resolve();
        };
        img.onerror = function() {
          resolve();
        };
      });
    },
    async preloadImage() {
      //   var url = "";
      for (var i = 0; i < this.imageTableData.length; i++) {
        let url = this.imageTableData[i].facePhotoUrl;
        this.preload[i] = url;
        this.preload.splice(i, 1, url);
      }
    },
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
  deactivated() {
    this.imageTableData.map(row => {
      row.checked = false;
      return row;
    });
  },
  watch: {
    imageTableData: function() {
      this.preload = new Array(this.imageTableData.length);
      this.preloadImage();
    },
    selectall: function() {
      // alert(this.selectall);
      if (this.selectall) {
        this.imageTableData.map(row => {
          row.checked = true;
          return row;
        });
      } else {
        var flag = this.judgeallchecked();
        if (flag) {
          this.imageTableData.map(row => {
            row.checked = false;
            return row;
          });
        }
      }
    }
  }
};
</script>
<style>
#noteaacx .checkButton .el-checkbox__inner::after {
	-webkit-box-sizing: content-box;
	box-sizing: content-box;
	border: 1px solid #ffffff;
	border-left: 0;
	border-top: 0;
	height: 7px;
	left: 4px;
	position: absolute;
	top: 1px;
}
.checkButton .el-checkbox__input.is-checked .el-checkbox__inner {
	background-color: #26d39d;
	border-color: #26d39d;
}
</style>
<style lang="scss" scoped>
$fontcolor: #aaa;
.tablelist {
	height: 100%;
	// height: calc(100vh - 76px - 57px - 70px);
}
.body {
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-content: space-between;
	// overflow: auto;
	overflow: hidden;
	.hiddenitem {
		opacity: 0;
		pointer-events: none;
	}
	.box {
		width: 140px;
		min-height: 178px;
		// background-color: rgb(36, 39, 42);
		background: rgba(0, 0, 0, 0.1);
		border: 0 solid #ffffff;
		border-radius: 2px;
		font-size: 12px;
		color: $fontcolor;
		box-sizing: border-box;
		overflow: auto;
		padding: 10px 11px 8px;
		margin: 0px 5px 8px;
		.headerimg {
			position: relative;
			width: 114px;
			height: 114px;
			// background-color: cornflowerblue;
			margin: 5px auto;
			&:hover .mask {
				display: block;
			}
			img {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
				z-index: 1;
			}
			.checkButton {
				position: absolute;
				top: 5px;
				left: 5px;
				z-index: 11;
				&:hover ~ .mask {
					display: none;
				}
			}
			.mask {
				display: none;
				position: absolute;
				top: 0px;
				right: 0px;
				bottom: 0px;
				left: 0px;
				z-index: 2;
				// background-color: rgba(0, 0, 0, 0.6);
				// box-shadow: 0px 0px 0px 110px rgba(0, 0, 0, 0.7);
				.operator {
					margin-top: 50px;
					margin-left: 12px;
					margin-right: 2px;
					background: rgba(17, 17, 17, 0.9);
				}
				.operator i {
					cursor: pointer;
					display: block;
					line-height: 30px;
					font-family: " PingFangSC-Regular";
					padding-left: 10px;
					font-size: 12px;
					color: #dddddd;
					letter-spacing: 0;
					background: rgba(17, 17, 17, 0.9);
					box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
					border-radius: 1px;
					border-radius: 1px;
					&:before {
						padding-right: 7px;
					}
					&:hover {
						color: #ffffff;
						background-color: rgba(40, 255, 187, 0.3);
						// background-color: rgba(38,211,157,0.3);
					}
				}
			}
		}
		p {
			text-align: left;
			line-height: 16px;
			font-family: " PingFangSC-Regular";
			font-size: 12px;
			color: rgba(255, 255, 255, 0.6);
			letter-spacing: 0;
			display: flex;
			justify-content: space-between;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			margin: 3px 0;
		}
		.adress {
			cursor: pointer;
			display: flex;
			justify-content: center;
		}
		.credentialType {
			text-align: center !important;
		}
		.textclipsClass {
			font-family: "PingFangSC-Regular";
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}
}
.footer {
	position: relative;
	margin: 10px 0px;
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
		.pageIndexClass {
			display: inline-block;
			width: 90px;
			input {
				padding: 0px;
			}
		}
	}
}
</style>

<style  lang="scss">
.tiaozhuan {
	span {
		display: inline-block;
		vertical-align: middle;
	}
	.pageIndexClass {
		display: inline-block;
		width: 90px;
		vertical-align: middle;
		height: 40px;

		.el-input__inner {
			margin-top: 5px;
			width: 50px;
			height: 28px;
			line-height: 28px;
			padding: 0px 5px;
		}
	}
}
</style>
