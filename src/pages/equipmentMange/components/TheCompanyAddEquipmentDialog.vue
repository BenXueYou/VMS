<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='body'>
      <div class="title">
        <span class="tips">未添加的设备：{{tableData.length}}</span>
        <div class='righttips'>
          <span class='test'>
            每60秒自动刷新
          </span>
          <span class='refresh'
                @click='refresh'>
            <img :src="icons.refresh"
                 alt="">
            刷新
          </span>
        </div>
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;height:300px;"
                max-height="300"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>

        <el-table-column prop="model"
                         width='120'
                         label="设备型号">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.model">
              <div>
                {{scope.row.model}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="ip"
                         label="IP">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.ip">
              <div>
                {{scope.row.ip}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="devAddress"
                         label="设备地址">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.devAddress">
              <div>
                {{scope.row.devAddress}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="mac"
                         label="MAC地址">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.mac">
              <div>
                {{scope.row.mac}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="serialNo"
                         label="设备ID">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.serialNo">
              <div>
                {{scope.row.serialNo}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="upodateItem(scope.row)"
                       type="text"
                       size="small">升级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot='footer'
         class='footer'>

      <el-button @click='confirm'
                 type="primary">确定</el-button>
      <el-button @click='close'
                 type="primary">取消</el-button>
    </div>

    <the-company-update-dialog :visible.sync="updateDialogVisible"
                               :data="selectDevice">

    </the-company-update-dialog>
  </el-dialog>
</template>

<script>
import TheCompanyUpdateDialog from "@/pages/equipmentMange/components/TheCompanyUpdateDialog";
import icons from "@/common/icon.js";
import * as api from "../ajax";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    deviceType: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "添加设备";
      }
    },
    orgUuid: {
      type: String,
      default() {
        return "";
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      icons,
      updateDialogVisible: false,
      multipleSelection: [],
      tableData: [
        // {
        //   ip: "192.128.1.1",
        //   devId: "123456789",
        //   devMode: "VB510F",
        //   mac: "MAC地址",
        //   devAddress: "123131231231231",
        //   deviceUuid: "1"
        // },
        // {
        //   ip: "192.128.1.1",
        //   devId: "123456789",
        //   devMode: "VB510F",
        //   mac: "MAC地址",
        //   devAddress: "123131231231231",
        //   deviceUuid: "2"
        // },
        // {
        //   ip: "192.128.1.1",
        //   devId: "123456789",
        //   devMode: "VB510F",
        //   mac: "MAC地址",
        //   devAddress: "123131231231231",
        //   deviceUuid: "3"
        // },
        // {
        //   ip: "192.128.1.1",
        //   devId: "123456789",
        //   devMode: "VB510F",
        //   mac: "MAC地址",
        //   devAddress: "123131231231231",
        //   deviceUuid: "4"
        // }
      ],
      TreechangeNameDialogVisible: false,
      selectDevice: [],
      timer: null
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
  },
  methods: {
    refresh() {
      this.getAAList();
    },
    getAAList() {
      api
        .getNoGuanLi({
          viewType: this.deviceType
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.tableData = res.data.data.list || [];
          }
        });
      // this.$store.commit("SET_PROJECT_UUID", Math.random() * 1000000);
      // console.log(this.$store);
    },
    handleSelectionChange(val) {
      this.selectDevice = val;
    },
    upodateItem(row) {
      console.log(row);
      console.log(this.selectDevice);
      let flag = false;
      for (let i = 0; i < this.selectDevice.length; i++) {
        if (this.selectDevice[i].deviceUuid === row.deviceUuid) {
          flag = true;
        }
      }
      if (!flag) {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
      this.updateDialogVisible = true;
    },
    confirm() {
      console.log(this.selectDevice);
      if (!this.selectDevice.length) {
        this.$message.error("请选择添加到管理的设备！");
        return;
      }
      // let num = this.selectDevice.reduce((sum, val, i) => {
      //   return sum + (i === 0 ? "" : ",") + val.deviceUuid;
      // }, "");
      let num = this.selectDevice.map(val => {
        return val.deviceUuid;
      });
      let data = {
        orgUuid: this.orgUuid,
        deviceIdArr: num
      };
      api.addNewDevice(data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("添加成功");
        }
        this.$emit("confirm", this.name);
        this.$emit("update:visible", false);
      });
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    loop() {
      this.timer = setTimeout(() => {
        api.getNoGuanLi().then(res => {
          console.log(res);
          if (res.data.success) {
            this.tableData = res.data.data.list || [];
            this.loop();
          }
        });
      }, 60 * 1000);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
        this.getAAList();
        this.loop();
      } else {
        this.tableData = [];
        clearTimeout(this.timer);
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  },
  components: {
    TheCompanyUpdateDialog
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
  padding: 10px 46px 30px;
  box-sizing: border-box;
}
.body {
  @include padding;
  .title {
    height: 40px;
    line-height: 30px;
    @include font-s;
  }
  .righttips {
    float: right;
    .test {
      padding-right: 20px;
    }
    .refresh {
      cursor: pointer;
      img {
        display: inline-block;
        vertical-align: middle;
      }
      color: $add-text-color;
    }
  }
}
.footer {
  @include padding;
  overflow: hidden;
  button {
    height: 30px;
    padding: 7px 21px;
    background: rgba(40, 255, 187, 0.12);
    border: 1px solid rgba(40, 255, 187, 0.8);
    border-radius: 2px;
    border-radius: 2px;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
  }
}
</style>
