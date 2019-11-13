<template>
  <div class="submenu">
    <ul class="submenu-ul">
      <li v-for="(item,index) in data "
          :key="index"
          :onmouseover="item.hover=true"
          :mouseout="item.hover=false"
          @click="chooseItem(item.value)"
          :class="{'next':item.children&&item.children.length}"
          class="submenu-li">
        {{item.label}}

        <sub-menu :data="item.children||[]" @chooseItem="chooseItem">

        </sub-menu>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "SubMenu",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    chooseItem(item) {
      this.$emit("chooseItem", item);
    }
  },
  watch: {
    data() {}
  }
};
</script>
<style lang="scss">
.submenu {
  position: relative;
  top: -36px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .submenu-ul {
    background-color: rgb(42, 46, 49);
    display: inline-block;
    position: relative;
    list-style: none;
    width: 120px;
    border-right: 1px solid grey;
    box-sizing: border-box;
    vertical-align: top;
    padding: 0px;
    margin: 0px;
    position: absolute;
    right: 0px;
    transform: translateX(100%);
    .next {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 15px;
        width: 7px;
        height: 7px;
        border-top: 1px solid #ddd;
        border-right: 1px solid #ddd;
        transform: translateY(-50%) rotate(45deg);
      }
    }
    .submenu-li {
      position: relative;
      line-height: 36px;
      color: #dddddd;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      margin: 0px;
      padding: 0px;
      &:hover {
        background-color: rgba(40, 255, 187, 0.05);
      }
      & > .submenu {
        display: none;
      }
      &:hover > .submenu {
        display: block;
      }
    }
    .divide {
      display: block;
      height: 1px;
      width: 100%;
      background-color: #000;
      margin: 5px 0px;
    }
    &:last-child {
      border-right: none;
    }
  }
}
</style>

