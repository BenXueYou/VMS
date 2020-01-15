<template>
  <div class='gt-tree'
       ref='gtTree'>
    <div class='gt-tree-node'
         v-for="(item,index) in root"
         :key="item.label+index">
      <div class="gt-tree-node-header"
           :style='{"padding-left":nodeLevel*paddingLeft+"px"}'
           :class='{"selected":item.selected}'
           :havechildren="item.havechildren"
           :parent='parent+"-"+index'
           @click='selectRow(index,parent+"-"+index)'>

        <span v-if='item.havechildren'
              class='triangle'
              @click.stop='toggleExtend(index,parent+"-"+index)'
              :class='!item.isextend?"roatetriangle":""'></span>
        <span v-else
              class='whitespan'></span>

        <img v-if='item.icon'
             :src="item.icon"
             alt="">

        <span class='treename'
              :title="item.label">
          {{item.label}}
        </span>

        <span class="threeline"
              @click.stop.prevent='$emit("clickmenu",{index:index,version:item.version,rankOrder:item.rankOrder,orgUuid:item.orgUuid,sliblings:root,isLastOne:index===(root.length-1),node:parent+"-"+index,value:item.label,e:$event})'>

        </span>
      </div>
      <transition v-on:before-enter="beforeEnter"
                  v-on:enter="enter"
                  v-on:after-enter="afterEnter"
                  v-on:before-leave="beforeLeave"
                  v-on:leave="leave"
                  v-on:after-leave="afterLeave">
        <div class="gt-tree-node-children"
             v-if='item.isextend&&item.havechildren'>
          <gt-tree-node :data='item.children'
                        :changeparent="changeparent"
                        :parent='parent+"-"+index'
                        :nodeLevel="nodeLevel+1"
                        @operator='$emit("operator",$event)'
                        @clickmenu='$emit("clickmenu",$event)'
                        @updateExtend="$emit('updateExtend',$event)"
                        @updateSelect="$emit('updateSelect',$event)"
                        @updatestate='changeSelf'></gt-tree-node>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from "../../dom.js";
let initData = function(root) {
  return root;
};

let sereachData = function(root, parent) {
  let data = root,
    num = parent.split("-");
  num.splice(0, 1);
  for (let i = 0, len = num.length; i < len; i++) {
    if (i != len - 1) {
      data = data[num[i]].children;
    } else {
      data = data[num[i]];
    }
  }

  return data;
};
let deleteData = function(root, parent) {
  let data = root,
    num = parent.split("-");
  num.splice(0, 1);
  let str = "data",
    index = 0;
  //修改数组的数据
  for (let i = 0, len = num.length; i < len; i++) {
    if (i != len - 1) {
      str += `[${num[i]}].children`;
    } else {
      index = num[i];
    }
  }
  // console.log(data);
  // console.log(str);
  // console.log(index);
  eval(str).splice(index, 1); // this.root[0].children[0].children.splice(1,1);
  return data;
  // eval(str).splice(index,1);
};
let addChildrenData = function(root, parent, childrenData) {
  let data = root,
    num = parent.split("-");
  num.splice(0, 1);
  let str = "data";
  //修改数组的数据
  for (let i = 0, len = num.length; i < len; i++) {
    if (i != len - 1) {
      str += `[${num[i]}].children`;
    } else {
      str += `[${num[i]}]`;
    }
  }
  // console.log(data);
  // console.log(str);
  eval(str).children = eval(str).children || [];
  eval(str).children.push(childrenData);
  // console.log(data);
  return data;
};
let addBeforeBrotherData = function(root, parent, childrenData) {
  let data = root,
    num = parent.split("-"),
    index = 0;
  num.splice(0, 1);
  let str = "data";
  //修改数组的数据
  for (let i = 0, len = num.length; i < len; i++) {
    if (i != len - 1) {
      str += `[${num[i]}].children`;
    } else {
      index = num[i];
    }
  }
  // console.log("change index" + index);
  // console.log(data);
  // console.log(eval(str));
  // eval(str).children = eval(str).children || [];
  eval(str).splice(index, 0, childrenData);
  // console.log(data);
  return data;
};
let addLastBrotherData = function(root, parent, childrenData) {
  let data = root,
    num = parent.split("-");
  num.splice(0, 1);
  let str = "data",
    index = 0;
  //修改数组的数据
  for (let i = 0, len = num.length; i < len; i++) {
    if (i != len - 1) {
      str += `[${num[i]}].children`;
    } else {
      index = num[i];
    }
  }
  // console.log("++++++++++++++++++++++++");
  // console.log(index);
  // console.log(str);
  // eval(str).children = eval(str).children || [];
  eval(str).splice(index, 0, childrenData);
  // console.log(data);

  // eval(str).push(childrenData);
  // console.log(data);
  return data;
};
export default {
  name: "GtTreeNode",
  componentName: "GtTreeNode",
  components: {},
  computed: {
    childrenData() {
      return this.root.filter(val => val.children && val.children.length);
    }
  },
  props: {
    data: {
      //传递的数据
      type: Array,
      default() {
        return [];
      }
    },
    changeparent: {
      type: Number,
      default() {
        return 0;
      }
    },
    sereach: {
      type: String,
      default() {
        return "";
      }
    },
    nodeLevel: {
      type: Number,
      default() {
        return 0;
      }
    },
    paddingLeft: {
      type: Number,
      default() {
        return 13;
      }
    },
    parent: {
      type: String,
      default() {
        return "0";
      }
    },
    showCheckbox: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isdrag: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      operator: "in", //up in down up表示移动到当前节点的前面，in表示作为当前节点子节点，down 表示移动当前节点的后面
      beforeparent: "", //移动前的parent信息，parent信息用来获取当前数据的
      afterparent: "", //移动后的parent信息
      ismousedown: false,
      copyEle: null,
      root: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      //有子节点的时候，会重复执行这个监听事件，因为这个是document监听 的全局事件，所以只要监听一次就可以了。
      if (this.nodeLevel == 0 && this.isdrag) {
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mousemove", this.mousemove);
        document.addEventListener("mouseup", this.mouseup);
      }
    });
  },
  destroyed() {
    if (this.nodeLevel == 0 && this.isdrag) {
      document.removeEventListener("mousedown", this.mousedown);
      document.removeEventListener("mousemove", this.mousemove);
      document.removeEventListener("mouseup", this.mouseup);
    }
  },
  methods: {
    checkitem(item) {
      // console.log("--------------------------------------");
      // console.log(item);
    },
    changeSelf() {
      setTimeout(() => {
        this.root = initData(this.root);
        this.root.splice(0, 0);
      }, 50);
    },
    mousedown(e) {
      if (this.ismousedown || !this.$refs.gtTree.contains(e.target)) {
        return;
      }
      this.ismousedown = true;
      let ele = e.target;
      while (!ele.classList.contains("gt-tree-node-header")) {
        ele = ele.parentNode;
      }
      this.beforeparent = ele.getAttribute("parent");
      if (ele.getAttribute("havechildren") == "true") {
        ele = ele.parentNode;
      }
      this.copyEle = ele.cloneNode(true);
      return false;
    },
    mousemove(e) {
      if (this.ismousedown && this.$refs.gtTree.contains(e.target)) {
        if (!document.querySelector(".copymove")) {
          this.copyEle.classList.add("copymove");
          document.body.appendChild(this.copyEle);
        }
        this.setCopyElePos(e.clientX, e.clientY); //设置拖拽复制元素的位置
        //移动到哪个元素上面就添加被选中的样式
        let ele = e.target;
        while (!ele.classList.contains("gt-tree-node-header")) {
          ele = ele.parentNode;
        }

        let hoverEle = document.querySelector(".hover");
        if (hoverEle) {
          hoverEle.classList.remove("hover");
        }
        let topLine = document.querySelector(".topLine");
        if (topLine) {
          topLine.classList.remove("topLine");
        }
        let downLine = document.querySelector(".downLine");
        if (downLine) {
          downLine.classList.remove("downLine");
        }

        this.afterparent = ele.getAttribute("parent");
        let rect = ele.getBoundingClientRect();
        let jianxi = 4;
        if (this.beforeparent == this.afterparent) {
          this.operator = "";
          return;
        }
        if (this.afterparent.startsWith(this.beforeparent)) {
          this.operator = "";
          return;
        }
        if (e.clientY - rect.top <= jianxi) {
          this.operator = "up";
          ele.classList.add("topLine");
        } else if (
          e.clientY - rect.top > jianxi &&
          rect.bottom - e.clientY > jianxi
        ) {
          this.operator = "in";
          ele.classList.add("hover");
        } else {
          ele.classList.add("downLine");
          this.operator = "down";
        }
      }
    },
    mouseup(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.ismousedown) {
        //删除移动的时候DOM
        if (document.querySelector(".copymove")) {
          this.copyEle.parentNode.removeChild(this.copyEle);
          this.copyEle = null;
        }
        this.ismousedown = false; //鼠标已经弹起来
        //获取移动的时候数据
        // console.log(this.beforeparent);
        // console.log(this.afterparent);
        if (!this.beforeparent || !this.afterparent) {
          return;
        }
        let opeartorData = sereachData(this.root, this.beforeparent);
        if (this.operator == "up") {
          // 将一个节点当做兄弟节点，前兄弟节点
          this.root = addBeforeBrotherData(
            this.root,
            this.afterparent,
            opeartorData
          );

          //没有考虑到节点插入被插节点的前面。父节点，也会造成移动位置。
          let num1 = this.beforeparent.split("-"),
            num2 = this.afterparent.split("-");
          let len = num2.length,
            flag = true;
          for (var i = 0; i < len - 1; i++) {
            if (num1[i] != num2[i]) {
              flag = false;
              break;
            }
          }
          if (flag && num1[len - 1] >= num2[len - 1]) {
            num1[len - 1]++;
          }

          this.beforeparent = num1.join("-");
          // console.log(this.beforeparent);
          this.root = deleteData(this.root, this.beforeparent);
          // console.log(this.root);
        } else if (this.operator == "down") {
          // 将一个节点当后兄弟节点

          //没有考虑到节点插入被插节点的前面。父节点，也会造成移动位置。
          let num1 = this.beforeparent.split("-"),
            num2 = this.afterparent.split("-");
          let len = num2.length,
            flag = true;
          for (var i = 0; i < len - 1; i++) {
            if (num1[i] != num2[i]) {
              flag = false;
              break;
            }
          }
          if (flag && num1[len - 1] >= num2[len - 1]) {
            // num1[len - 1]++;
          }
          if (this.beforeparent.startsWith(this.afterparent)) {
            num2[len - 1]++;
          }
          if (flag && num1.length == num2.length) {
            num2[len - 1]++;
          }
          this.afterparent = num2.join("-");
          // console.log(this.afterparent);
          this.root = addLastBrotherData(
            this.root,
            this.afterparent,
            opeartorData
          );
          this.beforeparent = num1.join("-");
          // console.log(this.beforeparent);
          this.root = deleteData(this.root, this.beforeparent);
          // console.log(this.root);
        } else if (this.operator == "in") {
          //   判断条件：移动到的还是当前节点本身则不进行操作。

          if (this.beforeparent != this.afterparent) {
            // 更新移动之后的节点
            this.root = addChildrenData(
              this.root,
              this.afterparent,
              opeartorData
            );
            this.root = deleteData(this.root, this.beforeparent);
          }
        }
        this.changeparent++;

        this.beforeparent = null;
        this.afterparent = null;
        this.operator = "";

        let hoverEle = document.querySelector(".hover");
        if (hoverEle) {
          hoverEle.classList.remove("hover");
        }
        let topLine = document.querySelector(".topLine");
        if (topLine) {
          topLine.classList.remove("topLine");
        }
        let downLine = document.querySelector(".downLine");
        if (downLine) {
          downLine.classList.remove("downLine");
        }
      }
    },
    setCopyElePos(x, y) {
      this.copyEle.style.left = x + "px";
      this.copyEle.style.top = y + "px";
    },
    dealClickMenu(node, item) {
      // console.log("dealClickMenu----------------");
      // console.log(node);
      this.$emit("operator", { node, item });
    },
    showOperatorMenu(item) {
      // console.log("点击了三条线的菜单");
      this.$emit("operator", item);
    },
    selectRow(index, parent) {
      // console.log("点击展开和关闭的菜单");
      if (!this.root[index].selected) {
        let data = {
          orgUuid: this.root[index].orgUuid,
          parent: parent,
          selected: !this.root[index].selected,
          root: this.root,
          rankOrder: this.root[index].rankOrder,
          oneData: this.root[index]
        };
        this.$emit("updateSelect", data);
      }
    },
    toggleExtend(index, parent) {
      let dd = {
        orgUuid: this.root[index].orgUuid,
        parent: parent,
        isextend: !this.root[index].isextend,
        ishavechildren: this.root[index].ishavechildren
      };
      this.$emit("updateExtend", dd);
    },
    init() {
      this.root = this.data;
      // console.log(this.data);
    },
    beforeEnter(el) {
      addClass(el, "collapse-transition");
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;

      el.style.height = "0";
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },
    enter(el) {
      el.dataset.oldOverflow = el.style.overflow;
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + "px";
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      } else {
        el.style.height = "";
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      }

      el.style.overflow = "hidden";
    },
    afterEnter(el) {
      removeClass(el, "collapse-transition");
      el.style.height = "";
      el.style.overflow = el.dataset.oldOverflow;
    },
    beforeLeave(el) {
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      el.style.height = el.scrollHeight + "px";
      el.style.overflow = "hidden";
    },
    leave(el) {
      if (el.scrollHeight !== 0) {
        addClass(el, "collapse-transition");
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
      }
    },
    afterLeave(el) {
      removeClass(el, "collapse-transition");
      el.style.height = "";
      el.style.overflow = el.dataset.oldOverflow;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
  },
  created() {
    this.init();
  },
  watch: {
    data: {
      handler() {
        this.init();
      },
      deep: true
    },
    changeparent() {
      setTimeout(() => {
        initData(this.root);
        this.root.splice(0, 0);
      });
    }
  }
};
</script>



<style lang="scss">
.triangle {
  display: inline-block;
  width: 0px;
  height: 0px;
  $borderWidth: 6px;
  border: $borderWidth solid #c0c4cc;
  border-bottom-width: 0px;
  border-left: #{$borderWidth/1.2} solid transparent;
  border-right: #{$borderWidth/1.2} solid transparent;
  vertical-align: middle;
  margin: 5px 0px 5px;
  transition: transform 0.3s;
  position: relative;
  margin-left: 10px;
}
.triangle::before {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // background-color: red;
  background-color: transparent;
}
.roatetriangle {
  transform: rotate(-90deg);
}

.copymove {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  pointer-events: none;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
}
.gt-tree {
  position: relative;
  user-select: none;
  color: #ccc;
  .gt-tree-node {
    position: absolute;
    left: 0px;
    width: 100%;
    line-height: 24px;
    position: relative;
    .gt-tree-node-children {
      box-sizing: border-box;
      overflow: hidden;
    }
    $iconleft: 0px;
    .gt-tree-node-header {
      line-height: 32px;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      font-size: 0px;
      vertical-align: middle;
      cursor: pointer;
      .checkbox {
        display: inline-block;
        vertical-align: middle;
        margin-left: $iconleft;
      }
      img {
        display: inline-block;
        vertical-align: middle;
        border: none;
        padding: 0px;
        margin: 0px 4px 0px 4px;
      }
      .whitespan {
        margin-left: $iconleft;
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 12px;
      }
      .treename {
        margin-left: $iconleft;
        font-size: 14px;
        display: inline-block;
        vertical-align: middle;
        color: #ddd;
        white-space: nowrap;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @mixin line {
        width: 16px;
        height: 1px;
        border-radius: 1px;
        background-color: rgb(37, 170, 127);
      }
      .threeline {
        display: none;
        position: absolute;
        top: 50%;
        right: 10px;
        border: 7px solid transparent;
        background-clip: content-box;
        transform: translateY(-50%);
        @include line;
        &::after {
          content: "";
          position: absolute;
          left: 0px;
          top: -7px;
          @include line;
        }
        &::before {
          content: "";
          position: absolute;
          left: 0px;
          bottom: -7px;
          @include line;
        }
      }

      &:hover {
        background-color: rgba(40, 255, 187, 0.05);
        .treename {
          color: #fff;
        }
      }
      &:hover .threeline {
        display: block;
      }
    }
    .selected {
      background-color: rgba(40, 255, 187, 0.05);
      .treename {
        color: #fff;
      }
    }
    .hover {
      background-color: bisque;
    }
    .topLine ::before {
      content: "";
      position: absolute;
      height: 3px;
      width: 100%;
      top: 0px;
      left: 0px;
      background-color: rgb(3, 159, 255);
    }
    .downLine ::after {
      content: "";
      position: absolute;
      height: 3px;
      width: 100%;
      bottom: 0px;
      left: 0px;
      background-color: rgb(3, 159, 255);
    }
  }
}
</style>


