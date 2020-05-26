<template>
  <div class="SearchLog">
    <div class="form-item">
      <label for>账号：</label>
      <el-input class="input"
                v-model="SearchObj.accountName"></el-input>
    </div>
    <div class="form-item">
      <label for>模块：</label>
      <el-select v-model="SearchObj.modelName"
                 placeholder="请选择验证">
        <el-option v-for="item in modelNameOptions"
                   :key="item"
                   :label="item"
                   :value="item"></el-option>
      </el-select>
    </div>
    <div class="form-item">
      <label for>类型：</label>
      <el-select v-model="SearchObj.eventType"
                 placeholder="请选择事件类型">
        <el-option v-for="item in eventTypeOptions"
                   :key="item.typeStr"
                   :label="item.typeName"
                   :value="item.typeStr"></el-option>
      </el-select>
    </div>
    <div class="form-item">
      <label for>IP：</label>
      <el-input class="input"
                v-model="SearchObj.IP"></el-input>
    </div>
    <div class="btn-group">
      <!-- <el-button type="primary" size="small" @click="query">查询</el-button> -->
      <span class="btn-text"
            @click="query">查询</span>
      <span class="btn-text"
            @click="resetValue">重置</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchLog",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      modelNameOptions: [],
      eventTypeOptions: [],
      modelName: "全部",
      SearchObj: {
        IP: null,
        modelName: "全部",
        eventType: null,
        accountName: null
      }
    };
  },
  mounted() {
    this.eventTypeOptions.unshift({ typeName: "全部", typeStr: null });
    // this.SearchObj.modelName = this.modelNameOptions[0];
    this.SearchObj.eventType = this.eventTypeOptions[0].typeStr;
  },
  computed: {
    setEvents() {
      return this.$store.state.auth.SetModuleList;
    },
    setLogEventEnum() {
      return this.$common.getEnumByGroupStr("setLogEventEnum");
    },
    operationLogEventEnum() {
      return this.$common.getEnumByGroupStr("operationLogEventEnum");
    },
    operationEvents() {
      return this.$store.state.auth.OperateModuleList;
    }
  },
  methods: {
    query() {
      // this.SearchObj.modelName =
      //   this.modelName === "全部" ? null : this.modelName;
      // if (this.SearchObj.modelName === "全部") {
      //   this.SearchObj.modelName = null;
      // }
      // this.SearchObj.modelName === "全部" ? null : this.SearchObj.modelName;
      console.log("搜索条件：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        IP: null,
        modelName: "全部",
        eventType: null,
        accountName: ""
      };
      // this.SearchObj.modelName =
      //   this.modelName === "全部" ? null : this.modelName;
      // if (this.SearchObj.modelName === "全部") {
      //   this.SearchObj.modelName = null;
      // }
      // this.SearchObj.modelName === "全部" ? null : this.SearchObj.modelName;
      this.$emit("query", this.SearchObj);
    }
  },
  watch: {
    visible(val) {
      if (sessionStorage.getItem("eventType") === "set") {
        this.modelNameOptions = this.setEvents;
        this.eventTypeOptions = this.setLogEventEnum;
        this.SearchObj.modelName = "全部";
      } else if (sessionStorage.getItem("eventType") === "operation") {
        this.modelNameOptions = this.operationEvents;
        this.eventTypeOptions = this.operationLogEventEnum;
        this.SearchObj.modelName = "全部";
      }
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.SearchLog {
  .input {
    input {
      @include input30;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.SearchLog {
  background: #2a2e31;
  padding: 10px 10px 10px 15px;
  box-sizing: border-box;
  .btn-group {
    // float: right;
    text-align: left;
    .btn-text {
      display: inline-block;
      padding-left: 30px;
      color: $add-text-color;
      cursor: pointer;
    }
    margin-top: 25px;
    padding-left: 40px;
  }
  .form-item {
    margin-bottom: 15px;
    label {
      display: inline-block;
      width: 40px;
      text-align: right;
      @include font-s;
    }
    .el-select,
    .input {
      width: calc(100% - 80px);
      margin-left: 10px;
    }
  }
}
</style>
