<template>
	<div class="dialogwrap">
		<el-dialog :title="title" :visible.sync="diglogvisible" width="650px" center>
			<el-form ref="form" label-width="150px">
				<el-form-item label="人脸库：">
					<el-input :value="library" readonly class="myinput"></el-input>
				</el-form-item>
				<el-form-item label="导入类型：">
					<el-input :value="templatetype" readonly class="myinput"></el-input>
				</el-form-item>
				<div class="daorutips">
					注：该功能只支持Excel文件，格式必须与模板一致
					<span>模板下载</span>
				</div>
				<el-form-item label="文件路径：">
					<el-input class="myinput" :value="filename" readonly></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
export default {
  name: "TheFaceDBDialog",
  props: {
    title: {
      type: String,
      default: "导库任务详情"
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    kuname: {
      type: String,
      default: function() {
        return "";
      }
    },
    library: {
      type: String,
      default: function() {
        return "";
      }
    },
    templatetype: {
      type: String,
      default: function() {
        return "";
      }
    },
    filename: {
      type: String,
      default: function() {
        return "";
      }
    },
    exprotway: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  mounted() {},
  data() {
    return {
      diglogvisible: false,
      showcustomize: false
    };
  },
  computed: {},
  watch: {
    faceDBDialogVisible: function(val) {
      this.diglogvisible = this.faceDBDialogVisible;
    },
    diglogvisible() {
      if (this.diglogvisible !== this.faceDBDialogVisible) {
        this.$emit("close");
      }
    }
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.color {
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: middle;
	border-radius: 2px;
	background-color: #fff;
}
.btn-center {
	position: absolute;
	left: 50%;
	height: 50px;
	transform: translateX(-50%);
}
.myinput {
	width: 260px;
}
.daorutips {
	margin: 10px 0px 20px 150px;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	span {
		color: #28ffbb;
		cursor: pointer;
	}
}
.mybutton {
	width: 80px;
	padding: 6px 27px;
	position: absolute;
	right: 61px;
	border: 0px;
	height: 30px;
	top: 4px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
	background: rgba($color: #ffffff, $alpha: 0.1);
	border-radius: 2px;
}
.customize {
	border-top: 1px dashed #666;
	border-bottom: 1px dashed #666;
	height: 150px;
	overflow: hidden;
	.wrap {
		width: 555px;
		margin: 0 auto;
		padding: 20px 0px;
		line-height: 50px;
		font-size: 0px;
		.itemlabel {
			font-family: "PingFangSC-Regular";
			display: inline-block;
			width: 120px;
			font-size: 14px;
			text-align: right;
			color: #dddddd;
		}
		.itemInput {
			display: inline-block;
			.el-input {
				width: 65px;
			}
		}
	}
}
</style>

<style lang='scss'>
// 下拉上弹动画
.slideDownOrUp-enter-active {
	transition: all 0.3s;
}
.slideDownOrUp-enter {
	transform: scale(1, 0);
}
.slideDownOrUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
	transform: scale(1, 1);
}

/* 本页面自定义 */
.dialogwrap {
	.el-form-item {
		margin-bottom: 10px;
		.buttoninput {
			width: 400px;
			.el-input__inner {
				width: 320px;
			}
		}
	}
	.el-input__inner {
		padding: 0px 5px 0px 8px;
		border: 1px solid rgba($color: #ffffff, $alpha: 0.15);
		border-radius: 2px;
	}
	.el-form-item__label {
		font-family: "PingFangSC-Regular";
		display: inline-block;
		width: 120px;
		font-size: 14px;
		text-align: right;
		color: #dddddd;
	}
}
</style>
