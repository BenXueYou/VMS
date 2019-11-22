<template>
  <transition name='fade'>
    <div class='bigimageMask '
         v-if='isshow'
         @click='hideMask'>
      <img class="bigimagepic zoom"
           @click.stop
           :src='src'
           alt="">
    </div>
  </transition>

</template>
<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.isshow = true;
    });
  },
  methods: {
    hideMask() {
      this.isshow = false;
    }
  }
};
</script>

<style lang='scss'>
.bigimageMask {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 111111;
  display: flex;
  align-items: center;
  justify-content: center;
  .bigimagepic {
    display: block;
  }
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  transition: none;
}
.fade-enter,
.fade-leave-to {
  opacity: 0.3;
}
.zoom {
  animation: zoom 0.3s linear both;
}
@keyframes zoom {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
}
</style>

