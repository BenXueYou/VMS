<template>
	<div class="login-div">
		<div class="login-head">
			<div style="width: 10%">
				<img src="@/assets/images/login/logo_big.png" width="100%" />
			</div>
			<div class="head-title">
				<span class="title" @click="hrefToCloud">后台管理系统登录</span>
				<img
					src="@/assets/images/login/change.png"
					width="20px"
					class="change-but"
					@click="hrefToCloud"
				/>
			</div>
		</div>
		<div class="login-main">
			<div class="main-block">
				<div class="block-title">云平台登录</div>
				<el-form :rules="rules" ref="loginForm" :model="formLabelAlign" class="info-form">
					<el-form-item prop="username">
						<el-input
							placeholder="手机号/账号"
							v-model="formLabelAlign.username"
							@keyup.enter.native="login"
							style="width: 100%; margin-top: 34px;"
						>
							<img slot="prefix" src="@/assets/images/login/head.png" />
						</el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input
							placeholder="密码"
							type="password"
							v-model="formLabelAlign.password"
							@keyup.enter.native="login"
							style="width: 100%;"
						>
							<img slot="prefix" src="@/assets/images/login/pwd.png" />
						</el-input>
					</el-form-item>
				</el-form>
				<div class="login-buttons">
					<el-checkbox v-model="isRembAccount">是否记住账号</el-checkbox>
					<div style="margin-right: 4px">
						<span class="button-text" style="cursor: pointer">忘记密码</span>
						<span class="button-text">|</span>
						<span class="button-text" style="cursor: pointer">注册</span>
					</div>
				</div>
				<el-button style="width: 100%; margin-top: 48px;" type="primary" @click="login" size="small">登录</el-button>
			</div>
		</div>
		<div class="login-foot">
			<div class="foot-item">
				<div class="item-text" v-for="(item,index) in alinkArr" :key="index">
					<a :href="item.strValue" target="_blank">{{item.strName}}</a>
				</div>
				<!-- <div >关于广拓</div>
				<div class="item-text">联系我们</div>
				<div class="item-text">产品中心</div>
				<div class="item-text">解决方案</div>
				<div class="item-text">成功案例</div>
				<div class="item-text">服务支持</div>
				<div class="item-text">资质荣誉</div>
				<div class="item-text">新闻中心</div>-->
			</div>
			<div style="margin:0px auto;font-size:14px;text-algin:center;padding:20px 0 10px">
				<p
					style="height:0px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;text-algin:center"
				>2019© 上海广拓 沪ICP备09001829号-3</p>
			</div>
			<div style="margin:0 auto; padding:20px 0;">
				<a
					target="_blank"
					href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010602003853"
					style="display:inline-block;text-decoration:none;height:20px;line-height:20px;display:flex;justify-content:center;"
				>
					<img src="@/assets/images/login/copyRight_icon.png" />
					<p
						style="height:0px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393; font-size:14px"
					>沪公网安备 31010602003853号</p>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  components: {},
  // inject: ['reload'],
  props: {},
  data() {
    let validateAccount = (rule, value, callback) => {
      /* eslint-disable */
			var eReg = /^[^\[\]\?\|\\\/\:\;\+\*\<\>]*$/;
			if (!eReg.test(value)) {
				callback(new Error("不能包含特殊字符 /[]:;丨+*?<>"));
			} else {
				callback();
			}
			/* eslint-enable */
    };
    let validatePwd = (rule, value, callback) => {
      /* eslint-disable */
			var eReg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
			if (!eReg.test(value)) {
				callback(new Error("至少包含数字，字母这两种（区分大小写）"));
			} else {
				callback();
			}
			/* eslint-enable */
    };
    let noSpace = (rule, value, callback) => {
      /* eslint-disable */
			var eReg = /^[^\s]*$/;
			if (!eReg.test(value)) {
				callback(new Error("字符中不能包含空格"));
			} else {
				callback();
			}
			/* eslint-enable */
    };
    return {
      alinkArr: window.config.alinkArr,
      formLabelAlign: {
        username: "",
        password: ""
      },
      isRembAccount: true,
      rules: {
        username: [
          { required: true, message: "手机号或账号不能为空", trigger: "blur" },
          {
            whitespace: true,
            type: "string",
            message: "不允许输入空格",
            trigger: "blur"
          },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符",
            trigger: "blur"
          },
          { validator: validateAccount, trigger: "blur" },
          { validator: noSpace, trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePwd, trigger: "blur" },
          { validator: noSpace, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // this.$store.dispatch("setAuthorization", window.config.Authorization);
  },
  mounted() {
    this.formLabelAlign.username = this.$store.state.home.account;
    window.addEventListener("beforeunload", e => this.browerStatus(e));
    window.addEventListener("onunload", e => this.browerStatusOff(e));
    if (this.$store.state.home.projectUuid) {
      let index = window.location.href.lastIndexOf("/");
      let suffix = window.location.href.substring(0, index + 1);
      window.location.href = suffix + "Home";
    }
  },
  methods: {
    browerStatus(e) {
      e = window.event || e;
      //   e.returnValue = "确定离开当前页面吗？";
      console.log("---------------");
    },
    browerStatusOff() {
      console.log("完善登出事件");
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("setAuthorization", window.config.Authorization);
          this.$loginAjax
            .login({
              username: this.formLabelAlign.username,
              password: this.formLabelAlign.password,
              grant_type: "password"
            })
            .then(res => {
              let body = res && res.data;
              if (body) {
                this.loginSuccessResponse(body);
              }
            });
        } else {
          this.$cToast.error("请正确填写内容");
        }
      });
    },
    loginSuccessResponse(body) {
      if (body) {
        if (this.isRembAccount) {
          this.$store.dispatch("setAccount", this.formLabelAlign.username);
          this.$store.dispatch("SET_USERUUID", body.data.adminUser.useruuid);
        } else {
          this.$store.dispatch("setAccount", "");
          this.$store.dispatch("SET_USERUUID", "");
        }
        // TOKEN
        let Authorization =
					body.data.token.tokenType + " " + body.data.token.accessToken;
        this.$store.dispatch("setAuthorization", Authorization);

        // 存储ProjectList
        let projects = body.data.adminUser.projects || [];
        this.$store.commit("SET_PROJECT_LIST", projects);

        // 设置ProjectUuid 默认设置第一个，其他Uuid可以在切换项目更改
        sessionStorage.setItem("username", body.data.adminUser.username);
        // 这里存储userUuid, 后面调用菜单的时候会使用到
        sessionStorage.setItem("useruuid", body.data.adminUser.useruuid);
        // 这里存储logUuid, 后面选择项目的时候会使用到
        sessionStorage.setItem("logUuid", body.data.adminUser.logUuid);
        // this.$store.dispatch("setUserName", body.data.adminUser.username);
        if (projects.length > 1) {
          // 如果要从登陆页面跳转到项目选择的页面，则执行下面的代码
          this.$router.push("/projectManage");
        } else {
          this.$store.dispatch(
            "setProjectUuid",
            body.data.adminUser.projects[0].projectUuid
          );
          this.$loginAjax
            .setLogUuidByNoPrjectUuid({
              projectUuid: body.data.adminUser.projects[0].projectUuid,
              logUuid: sessionStorage.getItem("logUuid")
            })
            .then(res => {});
          // 刷新页面以便于更新projectUuid
          this.$nextTick(() => {
            window.location.reload();
            // let index = window.location.href.lastIndexOf("/");
            // let suffix = window.location.href.substring(0, index + 1);
            // window.location.href = suffix + "Home";
          });
        }
      }
    },

    hrefToCloud() {
      window.location.href =
				window.config.protocolHeader +
				window.location.host +
				"/project/#/Login";
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<style lang="scss">
.login-div {
	.el-input__prefix {
		position: absolute;
		left: 38px;
		top: 6px;
	}
	.el-input--prefix .el-input__inner {
		padding-left: 28px;
	}
	.el-input__inner {
		background: rgba($color: #000000, $alpha: 0.05) !important;
		height: 46px;
		font-family: "PingFangSC-Regular";
		font-size: 14px;
		color: #575757;
		letter-spacing: 0;
	}
	.el-input__icon {
		line-height: 46px;
	}
	.el-checkbox__input.is-checked .el-checkbox__inner {
		background-color: #26d39d;
	}
	.el-checkbox__input.is-checked .el-checkbox__inner:after {
		border-color: #ffffff !important;
	}
	.el-checkbox__label {
		font-family: PingFangSC-Regular;
		font-family: "PingFangSC-Regular";
		font-size: 12px;
		color: #999999;
		letter-spacing: 0;
	}
	.el-button--primary {
		background-color: #26d39d !important;
		height: 46px;
		font-family: "PingFangSC-Regular";
		font-size: 14px;
		color: #ffffff;
		letter-spacing: 0;
	}
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-div {
	width: 100%;
	height: 100%;
	background: #222222;
	.login-head {
		height: 13%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 2% 3%;
		box-sizing: border-box;
		.head-title {
			font-family: "PingFangSC-Regular";
			font-size: 16px;
			color: #dddddd;
			display: flex;
			align-items: center;
			&:hover {
				color: #26ca96;
			}
			.title {
				cursor: pointer;
			}
			.change-but {
				margin-left: 8px;
				cursor: pointer;
			}
		}
	}
	.login-main {
		height: 72%;
		width: 100%;
		background: url("../../assets/images/login/bg_pic.png") no-repeat;
		background-size: 100% 100%;
		padding: 0 10% 0 65%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.main-block {
			width: 86%;
			min-width: 300px;
			height: 400px;
			background: #ffffff;
			padding: 8%;
			box-sizing: border-box;
			.block-title {
				font-family: "PingFangSC-Medium";
				font-size: 30px;
				color: #333333;
				text-align: center;
				width: 100%;
			}
			.login-buttons {
				display: flex;
				width: 94%;
				margin-top: 20px;
				margin-left: 10px;
				justify-content: space-between;
				.button-text {
					font-family: "PingFangSC-Regular";
					font-size: 12px;
					color: #999999;
					letter-spacing: 0;
				}
			}
		}
	}
	.login-foot {
		height: 15%;
		width: 100%;
		padding: 0 26%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-content: space-between;
		justify-content: center;
		.foot-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 18px;
			.item-text {
				font-family: "PingFangSC-Regular";
				font-size: 16px;
				color: #999999;
				cursor: pointer;
				a {
					cursor: pointer;
					color: #999999;
					text-decoration: none;
				}
			}
		}
		.foot-text {
			margin-top: 14px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #555555;
			letter-spacing: 1.17px;
			text-align: center;
			img {
				vertical-align: baseline;
				width: 14px;
				height: 14px;
			}
		}
	}
}
</style>
