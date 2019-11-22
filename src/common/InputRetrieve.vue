<template>
  <div class='retrieve'
       v-show='visible'>
    <div class="form-item">
      <label for="">IP：</label>
      <el-input class='input'
                @change='change'
                v-model='ip'></el-input>
    </div>
    <div class="form-item">
      <label for="">型号：</label>
      <el-input class='input'
                @change='change'
                v-model='mode'></el-input>
    </div>
    <div class="btn-group">
      <span class='btn-text'
            @click='query'>查询</span>
      <span class='btn-text'
            @click='resetValue'>重置</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputRetrieve",
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
      ip: "",
      mode: ""
    };
  },
  methods: {
    change(val) {
      this.$emit("updateIpAndType", this.ip, this.mode);
    },
    query() {
      this.$emit("query", this.ip, this.mode);
    },
    resetValue() {
      this.ip = "";
      this.mode = "";
      this.$emit("updateIpAndType", this.ip, this.mode);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.retrieve {
  .input {
    input {
      @include input30;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.retrieve {
  width: 270px;
  height: 150px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
  padding: 30px 20px;
  box-sizing: border-box;
  .btn-group {
    float: right;
    .btn-text {
      display: inline-block;
      padding: 0px 10px;
      color: $add-text-color;
      cursor: pointer;
    }
  }
  .form-item {
    margin-bottom: 10px;
    label {
      display: inline-block;
      width: 50px;
      text-align: right;
      @include font-s;
    }
    .input {
      width: calc(100% - 60px);
    }
  }
}
</style>
