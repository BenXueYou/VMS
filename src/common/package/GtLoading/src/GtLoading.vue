<template>
  <div class="wrap color-A">
    <div class="gt-line gt-lineA-1"
         :style="`background-color:${color}`"></div>
    <div class="gt-line gt-lineA-2"
         :style="`background-color:${color}`"></div>
    <div class="gt-line gt-lineA-3"
         :style="`background-color:${color}`"></div>
    <div class="gt-line gt-lineA-4"
         :style="`background-color:${color}`"></div>
    <div class="gt-line gt-lineA-5"
         :style="`background-color:${color}`"></div>
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: "GtLoading",
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    icon: {
      type: String,
      default: function() {
        return "";
      }
    },
    showClose: {
      type: Boolean,
      default() {
        return true;
      }
    },
    color: {
      type: String,
      default() {
        return "#28FFBB";
      }
    },
    msg: {
      type: String,
      default: "加载中"
    }
  },
  computed: {},
  methods: {
    clickbutton() {
      this.$emit("click");
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #000000;
  .gt-line {
    margin: auto;
    vertical-align: middle;
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    margin-top: 20%;
  }
  .gt-lineA-1 {
    animation: gt-loadingVideo 1.5s 0s infinite;
  }

  .gt-lineA-2 {
    animation: gt-loadingVideo 1.5s 0.3s infinite;
  }

  .gt-lineA-3 {
    animation: gt-loadingVideo 1.5s 0.6s infinite;
  }

  .gt-lineA-4 {
    animation: gt-loadingVideo 1.5s 0.9s infinite;
  }

  .gt-lineA-5 {
    animation: gt-loadingVideo 1.5s 1.2s infinite;
  }
  @keyframes gt-loadingVideo {
    50% {
      height: 40px;
    }
    100% {
      height: 15px;
    }
  }
}
</style>