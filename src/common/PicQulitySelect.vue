<template>
  <div class="main-select-block">
    <template v-for="(item, index) in picQultButtons">
      <div :key="index"
           class="button-item"
           @click="selectPicQult(item)"
           :style="`${item.selected ? 'background: rgba(40, 255, 187, 0.10); border: 1px #226652 solid;' : 'background: rgba(255, 255, 255, 0.1)'};`">
        {{item.text}}
        <img src="@/assets/images/faceModule/selected.png"
             class="selected-img"
             v-if="item.selected">
      </div>
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    selectedButtons: {
      type: Array,
      default: () => []
    },
    isShowLower: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      picQultButtons: [
        {
          value: "HIGH",
          text: "高",
          selected: false
        },
        {
          value: "NORMAL",
          text: "中",
          selected: false
        },
        {
          value: "LOW",
          text: "低",
          selected: false
        }
      ],
      selectedButtonsLocal: [],
      updateFlag: 0
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.initButton();
  },
  methods: {
    initButton() {
      if (this.isShowLower) {
        this.picQultButtons.push(
          {
            value: "LOWER",
            text: "无效",
            selected: false
          }
        );
      }
      this.setButtonsSelect(this.selectedButtons);
      this.updateFlag = 1;
    },
    changeSelect(item) {
      item.selected = !item.selected;
      switch (item.value) {
        case "HIGH":
          this.picQultButtons.forEach((v, i) => {
            if (i > 0 && !item.selected) {
              v.selected = item.selected;
            }
          });
          break;
        case "NORMAL":
          this.picQultButtons.forEach((v, i) => {
            if ((i < 1 && item.selected) || (i > 1 && !item.selected)) {
              v.selected = item.selected;
            }
          });
          break;
        case "LOW":
          this.picQultButtons.forEach((v, i) => {
            if ((i < 2 && item.selected) || (i > 2 && !item.selected)) {
              v.selected = item.selected;
            }
          });
          break;
        case "LOWER":
          this.picQultButtons.forEach((v, i) => {
            if (item.selected) {
              v.selected = item.selected;
            }
          });
          break;
      }
    },
    selectPicQult(item) {
      this.updateFlag = 0;
      this.changeSelect(item);
      this.selectedButtonsLocal = [];
      this.picQultButtons.forEach(v => {
        if (v.selected) {
          this.selectedButtonsLocal.push(v.value);
        }
      });
      this.$emit("update:selectedButtons", this.selectedButtonsLocal);
    },
    setButtonsSelect(val) {
      let obj = {};
      if (val.some(v => v === "LOWER")) {
        obj = {
          value: "LOWER",
          text: "无效",
          selected: false
        };
      } else if (val.some(v => v === "LOW")) {
        obj = {
          value: "LOW",
          text: "低",
          selected: false
        };
      } else if (val.some(v => v === "NORMAL")) {
        obj = {
          value: "NORMAL",
          text: "中",
          selected: false
        };
      } else if (val.some(v => v === "HIGH")) {
        obj = {
          value: "HIGH",
          text: "高",
          selected: false
        };
      }
      this.picQultButtons.forEach((v, i) => {
        if (v.value === obj.value) {
          this.changeSelect(v);
        }
      });
    },
    resetButtons() {
      this.picQultButtons = [
        {
          value: "HIGH",
          text: "高",
          selected: false
        },
        {
          value: "NORMAL",
          text: "中",
          selected: false
        },
        {
          value: "LOW",
          text: "低",
          selected: false
        },
        {
          value: "LOWER",
          text: "无效",
          selected: false
        }
      ];
    }
  },
  watch: {
    selectedButtons: {
      handler(val) {
        if (this.updateFlag) {
          this.resetButtons();
          this.setButtonsSelect(val);
        }
        this.updateFlag = 1;
      },
      deep: true
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-select-block {
  display: flex;
  align-items: center;
  .button-item {
    width: 50px;
    height: 32px;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #ffffff;
    text-align: center;
    line-height: 32px;
    border-radius: 2px;
    margin-right: 7px;
    border: 1px transparent solid;
    cursor: pointer;
    position: relative;
    .selected-img {
      position: absolute;
      right: -4px;
      top: -4px;
    }
  }
}
</style>
