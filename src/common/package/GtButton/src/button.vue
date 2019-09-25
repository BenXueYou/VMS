<template>
  <button class='gt-button'
          @click="clickbutton">
    <img v-if='icon'
         :src="icon"
         alt="">
    <span class='text'>
      <slot></slot>
    </span>
    <span class="close"
          v-if="showClose"
          @click='close'>
    </span>
  </button>
</template>

<script>
export default {
  name: "GtButton",
  props: {
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
    }
  },
  computed: {},
  methods: {
    clickbutton() {},
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
$height: 30px;
.gt-button {
  position: relative;
  height: $height;
  box-sizing: border-box;
  padding: 7px 10px;
  border: none;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.05);
  font-size: 0px;
  outline: none;
  img {
    display: inline-block;
    margin-right: 5px;
    min-height: 12px;
  }
  .text {
    min-width: 50px;
    text-align: left;
    text-indent: 5px;
  }
  span {
    vertical-align: top;
    display: inline-block;
    line-height: 12px;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #dddddd;
  }
  .close {
    $closeWidth: 12px;

    position: absolute;
    top: -$closeWidth/4;
    right: -$closeWidth/4;
    background-color: gray;
    color: #333;
    border-radius: 50%;
    width: $closeWidth;
    height: $closeWidth;
    cursor: pointer;

    &::after,
    &::before {
      content: "";
      width: $closeWidth * 0.6;
      height: 1px;
      background-color: #333;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 1px;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  &:hover,
  &:active {
    outline: none;
  }
}
</style>


