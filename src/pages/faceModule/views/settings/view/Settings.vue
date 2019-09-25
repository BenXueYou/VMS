<template>
  <div class="face-main">
    <div class="face-select">
      <div class="title-text">模块：</div>
      <el-select v-model="devicename"
                 filterable
                 collapse-tags
                 placeholder="请选择"
                 class='dev-select'>
        <el-option v-for="item in devicearr"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">

        </el-option>
      </el-select>
      <div class="title-text left-space">操作：</div>
      <el-select v-model="conditionVal"
                 filterable
                 collapse-tags
                 placeholder="请选择"
                 class='dev-select'>
        <el-option v-for="item in conditionArr"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <div class="title-text left-space">时段：</div>
      <el-date-picker v-model="startTime"
                      type="datetime"
                      class='dev-select'
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <span class="time-text">至</span>
      <el-date-picker v-model="endTime"
                      type="datetime"
                      class='dev-select'
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <el-button class="search-btn"
                 @click="queryAct"
                 type="primary">开始查询</el-button>
    </div>
    <div class="face-table">
      <el-scrollbar style="height: 92%;transition:0.2s">
        <el-table :data="tableData"
                  border
                  :row-style="rowStyle"
                  style="width: 100%">
          <el-table-column label="序号"
                           type="index"
                           width="90">
          </el-table-column>
          <el-table-column prop="modules"
                           label="模块"
                           width="280">
          </el-table-column>
          <el-table-column prop="options"
                           label="操作"
                           width="190">
          </el-table-column>

          <el-table-column prop="optionsDetails"
                           label="操作详情"
                           width="190">
          </el-table-column>
          <el-table-column prop="name"
                           label="姓名"
                           width="190">
          </el-table-column>
          <el-table-column prop="account"
                           label="账号"
                           width="190">
          </el-table-column>
          <el-table-column prop="time"
                           label="操作时间">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="footer">
        <el-pagination background
                       layout="total, prev, pager, next, jumper"
                       :page-size="pageSize"
                       :current-page="currentPage"
                       @current-change='currentChange'
                       :total="17">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        for (var i = 0; i < 14; i++) {
          num.push({
            modules: "以脸搜脸",
            options: "临时布控",
            optionsDetails: "修改了布控任务详情",
            name: "李一一",
            account: "admin",
            time: "2018-11-12 16:34:45"
          });
        }
        return num;
      }
    }
  },
  data() {
    return {
      startTime: "",
      endTime: "",
      devicename: "",
      interalVal: 1,
      devicearr: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "1",
          value: "1"
        },
        {
          label: "2",
          value: "2"
        },
        {
          label: "3",
          value: "3"
        }
      ],
      conditionVal: "",
      conditionArr: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "1",
          value: "1"
        },
        {
          label: "2",
          value: "2"
        },
        {
          label: "3",
          value: "3"
        },
        {
          label: "4",
          value: "4"
        },
        {
          label: "5",
          value: "5"
        }
      ],
      multipleSelection: [],
      pageSize: 14,
      currentPage: 1,
      countdata: 0,
      isShow: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    queryAct() {},
    rowStyle({row, rowIndex}) {
      return "height: 46px;";
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.face-main {
  width: 100%;
  height: 100%;
  padding: 2% 2.5% 1% 2.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  $bg-color: #202326;
  .face-select {
    height: 12%;
    padding: 0 2%;
    box-sizing: border-box;
    background: $bg-color;
    border-radius: 3px;
    margin-bottom: 1.5%;
    display: flex;
    align-items: center;
    .time-text {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #888888;
      margin: 0 5px;
    }
    .search-btn {
      margin-left: auto;
    }
  }
  .face-table {
    height: 84.5%;
    background: $bg-color;
    border-radius: 3px;
    padding: 2% 2%;
    box-sizing: border-box;
    box-sizing: border-box;
  }
}
.title-text {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
}
.time-param {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
  margin-left: 4px;
}
.left-space {
  margin-left: 5%;
}
.dev-select {
  width: 13%;
}
.dev-input {
  width: 4.5%;
  margin-left: 6px;
}
.footer {
  margin-top: 30px;
  width:100%;
  display: flex;
  justify-content: flex-end;
}
.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
