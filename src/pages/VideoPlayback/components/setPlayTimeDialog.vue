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
                          @change="change"
                          type="datetime"
                          style='width:220px;'
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间："
                      prop="name">
          <el-date-picker v-model="endDate"
                          @change="change"
                          type="datetime"
                          style='width:220px;'
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
    change() {
      if (
        new Date(this.startDate).getTime() > new Date(this.endDate).getTime()
      ) {
        [this.startDate, this.endDate] = [this.endDate, this.startDate];
      }
    },
    getFormatTime(t) {
      const change = t => {
        return ("0" + t).slice(-2);
      };
      const d = new Date(t);
      let year = d.getFullYear();
      let month = change(d.getMonth() + 1);
      let day = change(d.getDate());
      let hour = change(d.getHours());
      let minute = change(d.getMinutes());
      let second = change(d.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    confirm() {
      this.$emit(
        "confirm",
        this.getFormatTime(this.startDate),
        this.getFormatTime(this.endDate)
      );
      this.close();
    },
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
