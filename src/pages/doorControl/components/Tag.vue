<template>
  <div class="tagBox">
    <template v-for="( tag , index) in dynamicTags">
      <el-tag
        class="el-tag-class"
        :key="index"
        closable
        :disable-transitions="false"
        @close="handleClose(tag,index)"
      >
        <img
          class="img"
          v-if="tag.children"
          src="../../../assets/images/doorAccess/tag_floor.png"
          alt
        >
        <img class="img" v-else src="../../../assets/images/doorAccess/tag_door.png" alt>
        {{tag.label}}
        <!-- {{tag}} -->
        <div v-if="tag.children" :key="index" class="tag-hover-box">
          <template v-for="(item , i) in childrenTags(tag)">
            <el-tag class="el-tag-class" :key="i" :disable-transitions="false">
              <img
                class="img"
                v-if="item.children"
                src="../../../assets/images/doorAccess/tag_floor.png"
                alt
              >
              <img class="img" v-else src="../../../assets/images/doorAccess/tag_door.png" alt>
              {{item.label}}
            </el-tag>
          </template>
        </div>
      </el-tag>
    </template>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dynamicTags: []
    };
  },
  mounted() {
    console.log(this.tags);
    this.dynamicTags = this.tags;
  },
  watch: {
    tags(val) {
      this.dynamicTags = val;
    }
  },
  methods: {
    childrenTags(children) {
      console.log(children);
      var arr = [];
      this.$common.getChildren(children.children, arr);
      console.log(arr);
      return arr;
    },
    handleClose(tag, index) {
      console.log(tag, index);
      this.dynamicTags.splice(index, 1);
      //   this.checkeTreedNodes = this.dynamicTags;
      this.$emit("handleClose", this.dynamicTags);
    }
  }
};
</script>
<style lang="scss" scoped>
.tagBox {
  // width: 100%;
  // height: 200px;
  // border: 1px solid red;
  .el-tag-class {
    margin: 15px 12px 0;
    background-color: rgb(48, 51, 55);
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    border: 0;
    position: relative;
  }
  .el-tag-class .el-icon-close:hover {
    background-color: transparent;
    color: #26D39D;
  }
  .tag-hover-box {
    display: none;
    justify-content: flex-start;
    width: 400%;
    max-width: 320px;
    /* border: 1px solid red; */
    /* background-color: rgba(42,46,49,0.3); */
    background: #2a2e31;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
    height: auto;
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 99;
    flex-wrap: wrap;
    padding: 9px 11px;
  }
  .el-tag-class:hover .tag-hover-box {
    display: flex !important;
  }
}
</style>
