<template>
  <div class='wrap theTaggroup'>
    <div class="tablecontent"
         ref="tablecontent">
      <div class="scrollWrap">

        <div class="btn-group">
          <el-button type="primary"
                     @click='exportDoor'>导入通道</el-button>
          <el-button type="primary"
                     @click="removeDoor">移出通道</el-button>

          <div class="rightgroup">
            <span class='title'>通道名称：</span>
            <el-input class='input'
                      v-model='devName'>
            </el-input>

            <span class='title'>类型：</span>
            <el-select v-model="devMode"
                       @change="modeChange">
              <el-option v-for="item in cnOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <span class='title'>所属设备：</span>
            <el-input class='input'
                      v-model='devBelong'>
            </el-input>

            <el-button type="primary"
                       @click="search"
                       icon="el-icon-search"
                       size="small">查询</el-button>
            <el-button type="primary"
                       @click="reset"
                       size="small">重置</el-button>
          </div>
        </div>

        <el-table ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  v-loading="showloading"
                  style="width: 100%;overflow:initial;"
                  :style="{'height':tableHeight+'px'}"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           label="选择"
                           width="55">
          </el-table-column>

          <el-table-column prop="channelName"
                           label="通道名字">
          </el-table-column>
          <el-table-column prop="channelTypeName"
                           label="通道类型">
          </el-table-column>
          <el-table-column prop="deviceName"
                           label="所属设备">
          </el-table-column>
          <el-table-column prop="sign"
                           label="标签">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="deleteText"
                   style="cursor:pointer"
                   @click="deleteDev(scope.row)">移出</div>
            </template>
          </el-table-column>
        </el-table>

        <div class="fenye">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page.sync="pageNow"
                         :page-size="pageSize"
                         background
                         class="pagination"
                         layout="total, prev, pager, next, jumper"
                         :total="dataTotal">
          </el-pagination>

        </div>

      </div>
      <confirm-dialog :visible.sync="ConfirmDialogVisible"
                      confirmText="是否将通道移出标签"
                      @confirm="confirm"
                      @close="close">
      </confirm-dialog>

      <person-tree-tag title="选择要导入的通道"
                       rightTxt="已选择的通道"
                       :options="options"
                       :isShow.sync="exportDialogVisible"
                       :treeType='treeType'
                       treeNodeType="all"
                       :checkedNodeArr='checkedNode'
                       @onCancel="onCancel"
                       @onConfirm="onConfirm"></person-tree-tag>
    </div>
  </div>
</template>

<script>
import TheTagTableExportDialog from "./TheTagTableExportDialog";
import personTreeTag from "@/common/personTreeTag";
import ConfirmDialog from "@/common/ConfirmDialog";
import { mapState } from "vuex";
import * as api from "../ajax";
export default {
  name: "TheTagTable",
  props: {
    uuid: {
      type: String,
      default() {
        return "";
      }
    },
    viewType: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      options: [
        {
          value: null,
          label: "全部通道类型"
        },
        {
          label: "门禁报警输入",
          value: "door_aic"
        },
        {
          label: "门禁报警输出",
          value: "door_aoc"
        },
        {
          label: "门",
          value: "door"
        },
        {
          label: "读头",
          value: "readhead"
        },
        {
          label: "门禁视频",
          value: "chn_door_ipc"
        }
      ],
      cnOptions: [
        {
          value: null,
          label: "全部通道类型"
        },
        {
          label: "门禁报警输入",
          value: "door_aic"
        },
        {
          label: "门禁报警输出",
          value: "door_aoc"
        },
        {
          label: "门",
          value: "door"
        },
        {
          label: "读头",
          value: "readhead"
        },
        {
          label: "门禁视频",
          value: "chn_door_ipc"
        }
      ],
      exportDialogVisible: false,
      tableHeight: 0,
      dataTotal: 0,
      pageSize: 10,
      pageNow: 1,
      retrieveVisible: false,
      addEquipMentDialgoVisible: false,
      editEquipMentDialgoVisible: false,
      ConfirmDialogVisible: false,
      deleteConfirmDialogVisible: false,
      index: 0,
      remoteControlDialogVisiable: false,
      updateDialogVisible: false,
      tableData: [],
      multipleSelection: [],
      devName: "",
      devMode: null,
      devBelong: "",
      checkedNode: [],
      treeType: "orgAndAllDev",
      showloading: false
    };
  },
  components: {
    ConfirmDialog,
    TheTagTableExportDialog,
    personTreeTag
  },
  computed: {
    ...mapState({
      tagUuid: state => {
        return state.equipment.tagUuid;
      }
    })
  },
  methods: {
    search() {
      if (!this.tagUuid) {
        this.$message.error("请选择左边导入的标签!");
        return;
      }
      this.pageNow = 1;
      this.getTagList();
    },
    modeChange() {
      this.getTagList();
    },
    getTagList() {
      let data = {
        page: this.pageNow,
        limit: this.pageSize,
        tagUuid: this.tagUuid,
        channelName: this.devName,
        channelType: this.devMode,
        devName: this.devBelong
      };
      // console.log(this.$store.state.equipment.tagData.tagName);
      let sign = this.$store.state.equipment.tagData.tagName;
      this.showloading = true;
      api
        .getChannelByTag(data)
        .then(res => {
          this.showloading = false;
          console.log(res);
          let fanyi = JSON.parse(localStorage.localEnums);
          if (res.data.success && res.data.data) {
            let num = res.data.data.list || [];
            for (let i = 0, len = num.length; i < len; i++) {
              num[i].channelTypeName = fanyi.chn[num[i].channelType];
              num[i].sign = sign;
            }
            this.tableData = num;
            this.dataTotal = res.data.data.total || 0;
          } else {
            this.tableData = [];
            this.dataTotal = 0;
          }
        })
        .catch(() => {
          this.showloading = false;
        });
    },
    deleteDev(row) {
      let key = "deviceUuid";
      let flag = false;
      for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
        if (row[key] === this.multipleSelection[i][key]) {
          flag = true;
        }
      }
      if (!flag) {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
      this.ConfirmDialogVisible = true;
    },
    reset() {
      this.devName = "";
      this.devMode = null;
      this.devBelong = "";
    },
    exportDoor() {
      // if (!this.tagUuid) {
      //   this.$message.error("请选择左边导入的标签!");
      //   return;
      // }
      // 导入通道的时候去获取下拉列表
      api.getScond(this.viewType).then(res => {
        console.log(res);
        if (res.data.data) {
          let data = res.data.data || [];
          data.unshift({
            value: null,
            label: "全部通道类型"
          });
          this.options = data;
        }
      });
      this.checkedNode = [];
      this.exportDialogVisible = true;
    },
    removeDoor() {
      if (!this.multipleSelection.length) {
        this.$message.error("未选中需要删除的数据！");
      } else {
        this.ConfirmDialogVisible = true;
      }
    },
    handleCurrentChange(val) {
      this.pageNow = val;
      this.getTagList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    confirm() {
      console.log(this.$store.state.equipment.tagData);
      let tag = this.$store.state.equipment.tagData;
      let num = this.multipleSelection.map(item => {
        return {
          elementUuid: item.channelUuid,
          tagUuid: tag.tagUuid,
          version: tag.version
        };
      });
      console.log(num);
      api.removeTag(num).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("通道移出成功！");
          this.$emit("updateTree", this.tagUuid);
          this.getTagList();
        }
      });
    },
    close() {},
    onCancel() {},
    onConfirm(checkedData) {
      console.log(checkedData);
      let data = checkedData.map(item => {
        let resType = "org";
        if (item.hasOwnProperty("channelType")) {
          resType = "channel";
        }
        if (item.hasOwnProperty("deviceType")) {
          resType = "device";
        }
        let tag = this.$store.state.equipment.tagData;
        return {
          chnType: item.chnType,
          resType,
          uuid: item.id,
          version: tag.version
        };
      });
      api.importElement(data, this.tagUuid).then(res => {
        if (res.data.success) {
          this.$message.success("添加通道成功了！");
          this.exportDialogVisible = false;
          // alert(this.tagUuid);
          this.$emit("updateTree", this.tagUuid);
          this.getTagList();
        }
      });
    }
  },
  mounted() {
    let info = this.$refs.tablecontent.getBoundingClientRect();
    this.tableHeight = info.height - 30 - 60 - 36 - 40;
    this.pageSize = ~~(this.tableHeight / 50);
    // 获取标签列表
    // this.getTagList();
    // for (let i = 0; i < this.pageSize; i++) {
    //   this.tableData.push({
    //     chanelName: "192.128.1.门" + (i + 1),
    //     chanelMode: "xxxx门",
    //     belong: "1313123131",
    //     sign: "特殊区域",
    //     status: "移出"
    //   });
    // }
  },
  watch: {
    tagUuid(val) {
      this.getTagList();
    }
  }
};
</script>
<style lang='scss'>
@import "@/style/variables.scss";
.theTaggroup {
  .btn-group {
    input {
      @include input30;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  height: 100%;
  .btn-group {
    position: relative;
    height: 60px;
    $defaultColor: rgb(44, 44, 44);
    .retrieve {
      position: absolute;
      top: 35px;
      right: 0px;
      z-index: 1;
    }
    button {
      padding: 10px 40px;
    }
    .default {
      background: $defaultColor;
      border: 1px solid $defaultColor;
    }
    .rightgroup {
      float: right;
      .title {
        font-family: " PingFangSC-Regular";
        font-size: 13px;
        color: #dddddd;
        margin-right: 12px;
      }
      .input {
        width: 160px;
        margin-right: 13px;
      }
    }
  }
  .tablecontent {
    background-color: rgb(37, 41, 45);
    height: 100%;
    padding: $rightContentPadding;
    box-sizing: border-box;
    overflow: auto hidden;
    .scrollWrap {
      min-width: 1100px;
    }
    .btn-group {
      button {
        height: 30px;
        padding: 6px 15px;
      }
    }
  }
  .fenye {
    margin-top: 40px;
    span {
      @include font-s;
      float: right;
    }
    .pagination {
      float: right;
    }
  }
}
</style>
