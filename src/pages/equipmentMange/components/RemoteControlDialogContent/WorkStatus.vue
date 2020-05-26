<template>
	<div class="wrap deviceInfo">
		<div class="deviceInfoPanel">
			<div class="title cube">查看设备工作状态</div>
			<el-table
				ref="doorTableData"
				:data="doorTableData"
				tooltip-effect="dark"
				class="table"
				style="width: 100%"
			>
				<el-table-column prop="name" width="450" label="门名称">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
						<el-tooltip
							class="item"
							effect="dark"
							content="互锁"
							v-if="scope.row.interlockConfig"
							placement="right"
						>
							<img :src="icons.husuo" alt />
						</el-tooltip>
						<el-tooltip
							class="item"
							effect="dark"
							content="多人组合"
							v-if="scope.row.duoren"
							placement="right"
						>
							<img :src="icons.duoren" alt />
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="lockStatus" label="门锁状态"></el-table-column>
				<el-table-column prop="doorStatus" label="门状态"></el-table-column>
				<el-table-column prop="magnetStatus" label="门磁状态"></el-table-column>
			</el-table>
			<el-table
				ref="dutouTableData"
				:data="dutouTableData"
				tooltip-effect="dark"
				class="table"
				style="width: 100%"
			>
				<el-table-column prop="name" width="200" label="读头"></el-table-column>
				<el-table-column prop="dutouOnlineStatus" width="120" label="读头在线状态"></el-table-column>
				<el-table-column prop="dutouFangchaiStatus" width="120" label="读头防拆状态"></el-table-column>
				<el-table-column prop="verificationStatus" label="验证方式">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.verificationStatus">
							<div>{{scope.row.verificationStatus}}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="dutouDirection" label="读头方向"></el-table-column>
				<el-table-column prop="dutouStatus" label="读头状态"></el-table-column>
			</el-table>
			<el-table
				ref="equipmentTableData"
				:data="equipmentTableData"
				class="table"
				tooltip-effect="dark"
				style="width: 100%"
			>
				<el-table-column prop="name" width="222" label="设备内容"></el-table-column>
				<el-table-column prop="value" label="已使用/总量"></el-table-column>
			</el-table>
			<el-table
				ref="inputTableData"
				:data="inputTableData"
				class="table"
				tooltip-effect="dark"
				style="width: 100%"
			>
				<el-table-column prop="name" width="222" label="报警接入">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.name">
							<div>{{scope.row.name}}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态"></el-table-column>
			</el-table>
			<el-table
				ref="outputTableData"
				:data="outputTableData"
				class="table"
				tooltip-effect="dark"
				style="width: 100%"
			>
				<el-table-column prop="name" width="222" label="报警输出">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.name">
							<div>{{scope.row.name}}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
import icons from "@/common/icon.js";
export default {
  name: "DeviceInfo",
  props: {
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  methods: {
    getWorkStatus() {
      // alert(this.deviceUuid);
      let localEnums = sessionStorage.getItem("localEnums");
      if (!localEnums) {
        localEnums = "";
      }
      let fanyi = JSON.parse(localEnums);
      console.log(fanyi.alarm_s);
      api.getDeivceWorkStatus(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let channelMapList = res.data.data.channelMapList;

          const deal1 = data => {
            let num = [];
            for (let i = 0, len = data.length; i < len; i++) {
              let name = "",
                lockStatus = "",
                doorStatus = "",
                magnetStatus = "";
              name = data[i].name;
              let statusArr = data[i].statusList;
              for (let j = 0; j < statusArr.length; j++) {
                if (statusArr[j].statusType === "doorlock_s") {
                  lockStatus = fanyi.doorlock_s[statusArr[j].statusValue];
                } else if (statusArr[j].statusType === "door_s") {
                  doorStatus = fanyi.door_s[statusArr[j].statusValue];
                } else if (statusArr[j].statusType === "doorcontact_enable_s") {
                  magnetStatus =
										fanyi.doorcontact_enable_s[statusArr[j].statusValue];
                }
              }
              num.push({
                duoren: 0,
                interlockConfig: data[i].interlockConfig,
                name,
                lockStatus,
                doorStatus,
                magnetStatus
              });
            }
            return num;
          };

          const deal2 = data => {
            let num = [];
            for (let i = 0, len = data.length; i < len; i++) {
              let name = "",
                dutouOnlineStatus = "",
                dutouFangchaiStatus = "",
                verificationStatus = "",
                dutouDirection = "",
                dutouStatus = "";
              name = data[i].name;
              let statusArr = data[i].statusList;
              for (let j = 0; j < statusArr.length; j++) {
                if (statusArr[j].statusType === "tamperEnable") {
                  dutouFangchaiStatus =
										statusArr[j].statusValue === "0" ? "否" : "是";
                } else if (statusArr[j].statusType === "onoffline") {
                  dutouOnlineStatus = fanyi.onoffline[statusArr[j].statusValue];
                } else if (statusArr[j].statusType === "verificationMode") {
                  if (statusArr[j].statusValue) {
                    let numValue = statusArr[j].statusValue.split(",");
                    verificationStatus = numValue.map(item => {
                      return fanyi.pass[item];
                    });
                    verificationStatus = verificationStatus.join(",");
                  } else {
                    verificationStatus = "";
                  }
                } else if (statusArr[j].statusType === "direction") {
                  dutouDirection =
										statusArr[j].statusValue === "in" ? "进" : "出";
                } else if (statusArr[j].statusType === "alarm_s") {
                  dutouStatus = fanyi.doorcontact_s[statusArr[j].statusValue];
                }
              }
              dutouStatus = data[i].antisubmarineConfig ? "反潜回" : "普通";
              num.push({
                name,
                dutouOnlineStatus,
                dutouFangchaiStatus,
                verificationStatus,
                dutouDirection,
                dutouStatus
              });
            }
            return num;
          };

          const deal3 = data => {
            let num = [];
            for (let i = 0, len = data.length; i < len; i++) {
              let name = "",
                status = [];
              name = data[i].name;
              let statusArr = data[i].statusList;
              for (let j = 0; j < statusArr.length; j++) {
                if (statusArr[j].statusType === "alarm_s") {
                  status.push(
                    fanyi[statusArr[j].statusType][statusArr[j].statusValue]
                  );
                }
                // if (statusArr[j].statusType === "onoffline") {
                //   status.push( fanyi.onoffline[statusArr[j].statusValue]);
                // }
                // console.log(fanyi[statusArr[j].statusType]);
                // console.log(statusArr[j].statusValue);
                // console.log(
                //   fanyi[statusArr[j].statusType][statusArr[j].statusValue]
                // );
                // status.push(
                //   fanyi[statusArr[j].statusType][statusArr[j].statusValue]
                // );
              }
              num.push({
                name,
                status: status.join("/")
              });
            }
            return num;
          };
          const deal4 = data => {
            let num = [];
            for (let i = 0, len = data.length; i < len; i++) {
              let name = "",
                status = [];
              name = data[i].name;
              let statusArr = data[i].statusList;
              for (let j = 0; j < statusArr.length; j++) {
                if (statusArr[j].statusType === "aos") {
                  status.push(
                    fanyi[statusArr[j].statusType][statusArr[j].statusValue]
                  );
                }
                // if (statusArr[j].statusType === "onoffline") {
                // }
              }
              num.push({
                name,
                status: status.join("/")
              });
            }
            return num;
          };
          // 获取门状态的数组
          for (let k in channelMapList) {
            if (k === "door") {
              this.doorTableData = deal1(channelMapList[k]);
            } else if (k === "readhead") {
              this.dutouTableData = deal2(channelMapList[k]);
            } else if (k === "door_aic") {
              this.inputTableData = deal3(channelMapList[k]);
            } else if (k === "door_aoc") {
              this.outputTableData = deal4(channelMapList[k]);
            }
          }
          let num = [
            {
              name: "人员",
              value: res.data.data.person
            },
            {
              name: "记录",
              value: res.data.data.record
            },
            {
              name: "卡片",
              value: res.data.data.card
            },
            {
              name: "指纹",
              value: res.data.data.fingerprint
            }
          ];
          this.equipmentTableData = num;
          console.log(this.doorTableData);
        }
      });
    }
  },
  data() {
    return {
      icons,
      inputTableData: [],
      outputTableData: [],
      equipmentTableData: [],
      dutouTableData: [],
      doorTableData: []
    };
  },
  mounted() {
    this.getWorkStatus();
  }
};
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
	height: 100%;
	padding: 13px 15px;
	box-sizing: border-box;
	overflow: auto;
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	.title {
		display: block;
		width: 100%;
		height: 40px;
		line-height: 40px;
		@include font-s;
	}
	.cube {
		position: relative;
		padding-left: 18px;
		box-sizing: border-box;
		&::after {
			content: "";
			position: absolute;
			left: 0px;
			top: 50%;
			transform: translateY(-50%);
			width: 5px;
			height: 5px;
			background-color: #aaa;
		}
	}
	.deviceInfoPanel {
		width: 750px;
		margin: 0 auto;
	}
	.table {
		margin-bottom: 25px;
	}
}
</style>
