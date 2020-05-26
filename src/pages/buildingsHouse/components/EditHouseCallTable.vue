<template>
  <div class="EditHouseCallTable">
    <el-table :data="dataArr"
              border
              style="width: 100%">
      <el-table-column type="index"
                       label="呼叫顺序"
                       :index='tableIndex'
                       width="90">
      </el-table-column>
      <el-table-column prop="staffName"
                       label="姓名"
                       width="80">
      </el-table-column>
      <el-table-column prop="contactInfo"
                       label="电话"
                       width="150">
      </el-table-column>
      <el-table-column prop="address"
                       label="操作">
        <template slot-scope="scope">
          <el-button :disabled="!scope.$index"
                     @click="handleBtnAct(scope, 'up')"
                     type="text">上移</el-button>
          <el-button :disabled="scope.$index === tableData.length-1"
                     @click="handleBtnAct(scope,'down')"
                     type="text">下移</el-button>
          <el-switch v-model="scope.row.callEnable"
                     :active-value='1'
                     :inactive-value='0'
                     @change="transferAct"
                     active-color="rgb(38,75,67)"
                     inactive-color="rgb(72,75,78)"></el-switch>
          {{scope.row.callEnable}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "EditHouseCallTable",
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dataArr: []
    };
  },
  mounted() {
    this.dataArr = JSON.parse(JSON.stringify(this.tableData));
  },
  methods: {
    handleBtnAct(data, dir) {
      let index = data.$index;
      let dataArr = JSON.parse(JSON.stringify(this.dataArr));
      if (dir === "down") {
        index += 1;
      }
      [dataArr[index], dataArr[index - 1]] = [
        dataArr[index - 1],
        dataArr[index]
      ];
      this.dataArr = dataArr;
      this.$emit("transferAct", this.dataArr);
    },
    transferAct() {
      this.$emit("transferAct", this.dataArr);
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    }
  },
  watch: {
    tableData(val) {
      if (!val) {
        this.dataArr = [];
      }
      this.dataArr = JSON.parse(JSON.stringify(val));
    },
    dataArr: {
      handler() {},
      deep: true,
      immediate: true
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.EditHouseCallTable {
  >>> .el-switch {
    margin-bottom: 0px !important;
    margin-left: 10px;
  }
}
</style>
