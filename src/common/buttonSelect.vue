<template>
  <div :style="{'width':width}"
       ref="selctWrap"
       class='buttonSelect'>
    <el-input readonly="readonly"
              class="selectInput"
              v-model="selectvalue"
              @click.native='show'>

    </el-input>
    <span class='icon'>
      <i class="el-icon-caret-bottom"></i>
    </span>
    <el-collapse-transition>
      <div class='selectWrap'
           v-show="showSelect">

        <div style="height:180px;overflow:auto;">
          <div class="selectItem"
               v-for="(item,index) in options"
               @click.stop='clickMenu(index)'
               :class="{'checked':value==item.value}"
               :key="index">
            {{item.label}}
            <img class='checkedIcon'
                 v-if="value==item.value"
                 :src="icons.checked_icon"
                 alt="">
          </div>
        </div>

        <div class="diviedline"></div>
        <div class="Sbutton"
             @click='add'>
          <i class="el-icon-circle-plus-outline"></i>
          {{buttonName}}
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import icons from "@/common/js/icon.js";
export default {
  name: "buttonSelect",
  props: {
    buttonName: {
      type: String,
      default() {
        return " 新增时间段";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    name: {
      type: String,
      default() {
        return "";
      }
    },
    width: {
      type: String,
      default: "217px"
    }
  },
  mounted() {},
  watch: {
    showSelect(val) {
      const _this = this;
      function documentClick(e) {
        if (!e.target || !_this.$refs.selctWrap) {
          return;
        }
        if (!_this.$refs.selctWrap.contains(e.target)) {
          _this.hide();
        }
      }
      // 这里不知道为什么removeEventListener不起作用。
      if (val && !_this.isFirst) {
        _this.isFirst = true;
        document.body.addEventListener("click", documentClick, false);
      } else {
        document.body.removeEventListener("click", documentClick, false);
      }
    },
    options() {
      console.log(this.options);
    }
  },
  computed: {
    selectvalue() {
      let val = this.value,
        index = -1;
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value === this.value) {
          index = i;
          val = this.options[i].label;
          break;
        }
      }
      if (index === -1) {
        return "";
      }
      return val;
    }
  },
  data() {
    return {
      icons,
      showSelect: false,
      isFirst: false
    };
  },
  methods: {
    hide() {
      this.showSelect = false;
    },
    add() {
      this.$emit("add");
      this.showSelect = false;
    },
    clickMenu(index) {
      this.$emit("update:value", this.options[index].value);
      this.showSelect = false;
    },
    show() {
      this.showSelect = !this.showSelect;
    }
  }
};
</script>
<style lang="scss" scoped>
.buttonSelect {
  position: relative;
  .selectInput {
    cursor: pointer;
  }
  .selectWrap {
    position: absolute;
    z-index: 100;
    width: 100%;
    background: #2a2e31;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);

    $hoverColor: rgba(40, 255, 187, 0.05);

    .selectItem {
      position: relative;
      text-indent: 25px;
      line-height: 36px;
      font-family: " PingFangSC-Regular";
      font-size: 13px;
      color: #ffffff;
      cursor: pointer;
      &:hover {
        background: $hoverColor;
      }
    }
    .diviedline {
      height: 1px;
      opacity: 0.05;
      background: #ffffff;
    }
    .Sbutton {
      line-height: 36px;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #26d39d;
      text-indent: 10px;
      cursor: pointer;
    }
    .checked {
      background: $hoverColor;
    }
    .checkedIcon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
  .icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
    i {
      font-size: 14px;
      opacity: 0.8;
      color: #aaaaaa;
    }
  }
}
</style>


