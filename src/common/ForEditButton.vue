<template>
  <transition name="el-zoom-in-center">
    <div class="edit-button"
         v-if="!isDelete">
      <div class="box-main"
           v-if="isText"
           @click="onClickEdit"
           :style="`width: ${width}px; height: ${height}px; line-height: ${height}px;${!isDisableEdit ? 'cursor: pointer' : '' }`">
        <span class="text-style">{{floorName}}</span>
        <div class="close-button"
             @click="onClickDelete">
          <i class="el-icon-error"
             style="color: #A6A7A7"></i>
        </div>
      </div>
      <el-input :style="`width: ${width}px;height: ${height}px;`"
                size="small"
                @blur="onBlurInput"
                v-else
                v-focus
                v-model="textValue"></el-input>
    </div>
  </transition>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: String,
      default: "66"
    },
    height: {
      type: String,
      default: "30"
    },
    floorName: {
      type: String,
      default: ""
    },
    isDisableEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isText: true,
      isDelete: false,
      textValue: ""
    };
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        // 聚焦元素
        el.querySelector("input").focus();
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onClickEdit() {
      if (!this.isDisableEdit) {
        this.isText = false;
        this.textValue = this.floorName;
      }
    },
    onBlurInput(val) {
      this.$emit("setFloorName", val);
      this.isText = true;
    },
    onClickDelete() {
      this.isDelete = true;
      this.$emit("deleteFloor");
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style>
.el-input__inner {
  display: block;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box-main {
  background: rgba($color: #ffffff, $alpha: 0.05);
  border-radius: 3px;
  text-align: center;
  position: relative;
  .close-button {
    position: absolute;
    top: -13px;
    right: -5px;
    cursor: pointer;
  }
  .text-style {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
  }
  .edit-button {
    line-height: 30px !important;
  }
}
</style>
