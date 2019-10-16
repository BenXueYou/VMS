<template>
  <div class='accout'>
    <div class="title">
      账户管理
    </div>

    <div class="content">

    </div>
  </div>
</template>
<script>
export default {
  name: "accout"
};
</script>
<style lang="scss" scoped>
.accout {
  height: 100%;
  .title {
    position: relative;
    height: 60px;
    line-height: 60px;
    padding-left: 60px;
    background: #212325;
    &::after {
      content: "";
      width: 3px;
      height: 14px;
      position: absolute;
      top: 23px;
      left: 40px;
      background: #26d39d;
    }
  }
  .content {
    height: calc(100% - 80px);
    margin-top:20px;
    background: #212325;
  }
}
</style>
