<template>
  <div>
    <div class="item"
         v-for="(data,index) in allData"
         :key="index">
      <span class='labelname'>
        视频通道
      </span>
      <el-checkbox v-model="data.checkAll"
                   style="float:left;margin-right:30px;"
                   @change="handleCheckAllChange(data)">全选</el-checkbox>
      <el-checkbox-group v-model="data.checkedNum"
                         style="float:left;"
                         @change="handleCheckedCitiesChange(data)">
        <el-checkbox v-for="item in enumArr"
                     :label="item"
                     :key="item">{{item}}</el-checkbox>
      </el-checkbox-group>
      <div class="dash-line">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "choosePannel",
  props: {
    enumArr: {
      type: Array,
      default() {
        return [];
      }
    },
    allData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      checkedData: []
    };
  },
  mounted() {},
  methods: {
    handleCheckAllChange(data) {
      // this.$emit("checkedNum")
      console.log(data);
      if (data.checkAll) {
        data.checkedNum = this.enumArr;
      } else {
        data.checkedNum = [];
      }
    },
    handleCheckedCitiesChange(data) {
      // handleCheckedCitiesChange;
      // 这里需要改变他哪里被选中了，哪里没有被选中
      console.log(data);
      if (data.checkedNum.length === this.enumArr.length) {
        data.checkAll = true;
      } else {
        data.checkAll = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  margin: 10px auto;
  .labelname {
    float: left;
    color: #fff;
    margin-right: 30px;
  }
  overflow: hidden;
  .dash-line {
    margin-top: 30px;
  }
}
</style>
