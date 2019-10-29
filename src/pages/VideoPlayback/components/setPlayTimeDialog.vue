<template>
  <el-dialog :visible.sync="dialogVisible"
             class="dialogCenter"
             title="设置回放时间"
             width="420px"
             :close-on-click-modal="false"
             @close="close"
             :append-to-body="true">
    <div class="body">

      <el-form class="timeForm"
               ref="form"
               label-width="130px">

        <el-form-item label="开始时间："
                      prop="name">
          <el-date-picker v-model="startDate"
                          type="datetime"
                          style='width:200px;'
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间："
                      prop="name">
          <el-date-picker v-model="endDate"
                          type="datetime"
                          style='width:200px;'
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="">

          <el-button @click='confirm'
                     class="surebtn"
                     type="primary">确定</el-button>

          <el-button @click='close'
                     class="cancelbtn"
                     type="primary">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      startDate: "",
      endDate: ""
    };
  },
  mounted() {},
  methods: {
    confirm() {},
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      let d = new Date();
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      this.startDate = d;
      this.endDate = Date();
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  padding: 10px 30px;
  box-sizing: border-box;
  .pagination {
    float: right;
  }
  .block {
    margin: 20px;
    overflow: hidden;
  }
}
</style>
