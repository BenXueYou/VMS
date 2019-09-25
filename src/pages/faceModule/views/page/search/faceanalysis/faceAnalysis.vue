<template>
	<div class="facealarm">
		<div class="facealarm-header">
			<div class="header-line">
				<span class="header-line-label">报警时段：</span>

				<el-date-picker
					class="header-line-time"
					v-model="startTime"
					@change="timeChange"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
				></el-date-picker>
				<span class="header-line-time-label">至</span>
				<el-date-picker
					class="header-line-time"
					v-model="endTime"
					@change="timeChange"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
				></el-date-picker>

				<span class="header-line-label" style="padding-left:30px;">模型名称：</span>
				<el-select
					v-model="modeltype"
					multiple
					@visible-change="selectvisiblechange"
					@change="selectChange"
					collapse-tags
					placeholder="请选择"
					class="header-line-input"
				>
					<el-option
						v-for="item in modeltypearr"
						:key="item.modeluuid"
						:label="item.modelname"
						:value="item.modeluuid"
					></el-option>
				</el-select>
				<!--
        <el-input class='header-line-input'
				v-model='modeltype'></el-input>-->

				<span class="header-line-label">状态：</span>
				<el-select
					v-model="status"
					filterable
					@visible-change="selectvisiblechange"
					@change="selectChange"
					collapse-tags
					placeholder="请选择"
					class="header-line-input"
				>
					<el-option
						v-for="item in statusZnarr"
						:key="item.typestr"
						:label="item.typename"
						:value="item.typestr"
					></el-option>
				</el-select>

				<el-button class="search" @click="search" type="primary">查询</el-button>
			</div>
		</div>

		<div class="facealarm-table">
			<face-alarm-table
				:pageSize="pageSize"
				:pageNow="pageNow"
				:pageCount="pageCount"
				:tableData="tableData"
				:loding="loding"
				@pagechange="pagechange"
			></face-alarm-table>
		</div>
	</div>
</template>

<script>
import * as api from "@/pages/faceModule/api";
import faceAlarmTable from "@/pages/faceModule/views/page/search/faceanalysis/basic/TheFaceAlarmTable.vue";
export default {
  name: "facealarm",
  components: {
    faceAlarmTable
  },
  data() {
    return {
      startTime: "",
      endTime: "",
      modeltype: [],
      modeltypearr: [],
      status: "",
      statusarr: [],
      pageSize: 2,
      pageNow: 1,
      pageCount: 0,
      tableData: [],
      statusZnarr: [],
      loding: false
    };
  },
  mounted() {
    this.startTime = this.$common.getYesterday(new Date());
    this.endTime = this.$common.formatDate(new Date());

    this.statusarr = window.face.dealstate;

    api.getModelArr().then(res => {
      if (res.data && res.data.data) {
        var num1 = res.data.data.disable || [];
        var num2 = res.data.data.enable || [];
        num1 = num1.concat(num2);
        this.modeltypearr = num1;
      }
    });
    this.init();
    this.gettranslate();
  },
  methods: {
    gettranslate() {
      if (!this.statusZnarr.length) {
        // 点击搜索按钮从而发起请求
        api
          .gettranslateword({
            typegroupstring: "alarm_receiving"
          })
          .then(res => {
            console.log(res);
            if (res.data && res.data.data) {
              this.statusZnarr = [{ typename: "全部", typestr: "" }].concat(
                res.data.data
              );
            }
          })
          .catch(err => {
            console.log(err);
            console.log("-------------------------------------");
            this.$message.error("获取请求失败1！");
          });
      }
      this.pageNow = 1; // 点击搜索条件变更,当前页设置为第一页
      this.ajaxdata();
    },
    init() {
      var _w =
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth;
      var _h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;

      this.pageSize = Math.floor((_h - 330) / 43);
      console.log(_w);
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
    ajaxdata() {
      console.log(`请求数据：第${this.pageNow}页，一页${this.pageSize}条`);
      const _this = this;
      this.loding = true;
      api
        .getModelRecord({
          modelUuid: this.modeltype.toString(),
          state: this.status,
          starttime: this.startTime,
          overtime: this.endTime,
          currentPage: this.pageNow,
          pageSize: this.pageSize
        })
        .then(res => {
          this.loding = false;
          console.log(res);
          var data = res.data.data;
          _this.tableData = [];
          _this.pageCount = data.total || 0;
          if (data.list) {
            var waimian = res.data.data.list[0];
            var limian = JSON.parse(waimian.extinfo);
            console.log(waimian);
            console.log(limian);
            // console.log(JSON.parse(
            //         data.list[i].disAlarmInfoBean[0].detectedinfo
            //       ))
            for (let i = 0, len = data.list.length; i < len; i++) {
              var zhuapaiarr = [];

              if (data.list[i].disAlarmInfoBean) {
                for (
                  var j = 0, jlen = data.list[i].disAlarmInfoBean.length;
                  j < jlen;
                  j++
                ) {
                  var channelinfo = JSON.parse(
                    data.list[i].disAlarmInfoBean[j].detectedinfo
                  );
                  var photo = JSON.parse(
                    data.list[i].disAlarmInfoBean[j].photoinfo
                  );
                  zhuapaiarr.push({
                    headerurl:
											photo.imageUri ||
											photo.photoUri ||
											require("@/assets/user.png"),
                    time: data.list[i].disAlarmInfoBean[j].time,
                    devicesname: channelinfo.channelinfo.channelName,
                    feature: "" // 特征
                  });
                }
              }
              var firststaffinfo = {};
              if (
                data.list[i].disAlarmInfoBean &&
								data.list[i].disAlarmInfoBean[0].staffinfo
              ) {
                firststaffinfo = JSON.parse(
                  data.list[i].disAlarmInfoBean[0].staffinfo
                );
              }
              var photoinfo = {};
              if (
                data.list[i].disAlarmInfoBean &&
								data.list[i].disAlarmInfoBean[0].photoinfo
              ) {
                photoinfo = JSON.parse(
                  data.list[i].disAlarmInfoBean[0].photoinfo
                );
              }
              var comfiruuid = null,
                vdetecteduuid = null;
              if (
                data.list[i].disAlarmInfoBean &&
								data.list[i].disAlarmInfoBean[0]
              ) {
                comfiruuid = data.list[i].disAlarmInfoBean[0].vconfirmuuid;
                vdetecteduuid = data.list[i].disAlarmInfoBean[0].vdetecteduuid;
              }
              data.list[i].alarminfoid = data.list[i].modeluuid =
								limian.modeluuid;
              data.list[i].vconfirmuuid = comfiruuid;
              data.list[i].vdetecteduuid = vdetecteduuid;
              data.list[i].photouri = photoinfo.imageUri;
              data.list[i].photoUuid = photoinfo.photoUuid;
              data.list[i].modelname = limian.modelname;
              data.list[i].belong = firststaffinfo.libraryName;
              data.list[i].staffUuid = firststaffinfo.staffUuid;
              data.list[i].libraryUuid = firststaffinfo.libraryUuid;
              data.list[i].remarks = limian.remarks;
              data.list[i].status = _this.statusChange(data.list[i].dealstate);
              data.list[i].zhuapaiarr = zhuapaiarr;
            }
            _this.tableData = data.list;
            console.log(_this.tableData);
          }
        })
        .catch(err => {
          this.loding = false;
          console.log(err);
        });
    },
    search() {
      // 点击搜索按钮从而发起请求
      this.pageNow = 1; // 点击搜索条件变更,当前页设置为第一页
      this.ajaxdata();
    },
    pagechange(index) {
      this.pageNow = index;
      this.ajaxdata();
    },
    selectvisiblechange() {},
    selectChange() {
      this.ajaxdata();
    },
    timeChange() {
      if (this.startTime && this.endTime) {
        if (new Date(this.startTime) > new Date(this.endTime)) {
          var t = this.startTime;
          this.startTime = this.endTime;
          this.endTime = t;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
