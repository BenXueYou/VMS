<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='body'>
      <el-table ref="multipleTable"
                :data="data"
                tooltip-effect="dark"
                style="width: 100%;height:600px;overflow:auto"
                class="infinite-list"
                v-el-table-infinite-scroll="load"
                max-height="600">

        <el-table-column prop="staffName"
                         width='120'
                         label="姓名">
        </el-table-column>

        <el-table-column prop="sex"
                         label="性别">

        </el-table-column>
        <el-table-column prop="address"
                         label="地址">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.address">
              <div>
                {{scope.row.address}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="nation"
                         label="民族">
        </el-table-column>
        <el-table-column prop="remarks"
                         label="备注">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.remarks">
              <div>
                {{scope.row.remarks}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "showStaffDialog.vue",
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  props: {
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "人员列表";
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
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      icons,
      updateDialogVisible: false,
      tableData: [],
      TreechangeNameDialogVisible: false,
      selectDevice: [],
      currentPage: 1
    };
  },
  mounted() {},
  methods: {
    load(data) {
      this.$emit("loadNextPage", data);
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      this.TreechangeNameDialogVisible = this.visible;
    }
  },
  components: {}
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
