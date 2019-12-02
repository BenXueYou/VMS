<template>
	<div class="ProjectWrap">
		<div class="projectItem" v-for="(item,index) in data" @click="selectRow(index)" :key="index">
			<div class="imgWrap"></div>
			<div class="imgInfo">
				<p>{{item.projectName}}</p>
				<p>{{item.projectStatus}}</p>
				<p>{{item.projectPerson}}</p>
				<p>{{item.projectPhone}}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "projectManage",
  data() {
    return {
      data: []
    };
  },
  activated() {
    // console.log(this.$store.state.home.projectList);
    this.$nextTick(() => {
      // alert(1);
      // this.data = this.$store.state.home.projectList;
      this.data = this.$store.state.home.projectList;
    });
  },
  mounted() {
    console.log(this.$store.state.home.projectList);
    this.data = this.$store.state.home.projectList;
  },
  methods: {
    selectRow(index) {
      let uuid = this.data[index].projectUuid;
      this.$store.dispatch("setProjectUuid", uuid);
      this.$ProjectManageAjax.setLogUuid({
	      logUuid: localStorage.getItem("logUuid")
	    })
	    .then(res => {
	    	
	      // let body = res.data;
	      // this.loginSuccessResponse(body);
	    });
      // 刷新页面以便于更新projectUuid
      this.$nextTick(() => {
        this.$router.push("/home");
        window.location.reload();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ProjectWrap {
	width: 80%;
	margin: 100px auto;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.projectItem {
		cursor: pointer;
		margin-bottom: 15px;
		width: 360px;
		height: 180px;
		padding: 20px 10px;
		box-sizing: border-box;
		background: #25292d;
		border-radius: 3px;
		vertical-align: top;
		.imgWrap {
			display: inline-block;
			width: 160px;
			height: 140px;
		}
		.imgInfo {
			vertical-align: top;
			width: 160px;
			height: 140px;
			display: inline-block;
			p {
				margin: 0px;
				line-height: 30px;
				text-indent: 15px;
				font-family: "PingFangSC-Regular";
				font-size: 14px;
				color: #dddddd;
			}
		}
	}
}
</style>
