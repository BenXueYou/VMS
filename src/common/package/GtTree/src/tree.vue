<template>
  <gt-tree-node :isdrag='isdrag'
                :sereach='search'
                :operatorDisabled="operatorDisabled"
                :searchtype="searchtype"
                :data='newData'
                :show-checkbox="showCheckbox"
                @clickmenu='clickmenu'
                @updateExtend="updateExtend"
                @updateSelect="updateSelect"
                @operator='operator'></gt-tree-node>
</template>

<script>
import GtTreeNode from "./tree-node.vue";

export default {
  name: "GtTree",
  components: {
    GtTreeNode
  },
  computed: {},
  methods: {
    // 筛选数据
    filter(str) {
      this.search = str;
      this.fliterData();
    },
    filterType(str) {
      this.searchtype = str;
      this.fliterData();
    },
    fliterData() {
      // console.log(this.data);
      let cnt = 1;
      var newData = filterByName(this.data, this.search, this.searchtype);

      function filterByName(menu, name, type) {
        var menuNew = [];
        for (var i = 0; i < menu.length; i++) {
          var nodeNew = undefined;
          var node = menu[i];
          var childrenNode = node.children;

          var childrenMenu = [];
          if (childrenNode) {
            if (childrenNode.length > 0) {
              childrenMenu = filterByName(childrenNode, name, type);
            }
          }

          if (childrenMenu) {
            if (childrenMenu.length > 0) {
              nodeNew = new Object();
              nodeNew = Object.assign(nodeNew, node);
              nodeNew.children = childrenMenu;
            } else {
              // 根据节点type来筛选类型
              if (!type || node.type === type) {
                // 根据的节点label来筛选名字
                if (node.label && node.label.indexOf(name) != -1) {
                  nodeNew = new Object();
                  nodeNew = Object.assign(nodeNew, node);
                  nodeNew.children = null;
                }
              }
            }
          }
          if (nodeNew) {
            menuNew.push(nodeNew);
          }
        }

        return menuNew;
      }
      this.newData = newData;

      return newData;
    },
    getParentAndSlefUuid(parent) {
      let node = parent.split("-");
      let parentUuid = "",
        uuid = "";
      let data = this.data;
      // console.log(parent);
      // console.log(data);
      for (let i = 1; i < node.length; i++) {
        let index = node[i];
        if (i === node.length - 1) {
          uuid = data[index].orgUuid;
        } else if (i === node.length - 2) {
          parentUuid = data[index].orgUuid;
        }
        data = data[index].children;
      }
      return {
        parentUuid,
        uuid
      };
    },
    clickmenu(data) {
      // index
      // version,
      // rankOrder,
      // orgUuid,
      // sliblings,
      // isLastOne,
      // node,
      // value,
      // e
      let nodeData = {
        parentUuid: "",
        uuid: ""
      };
      // 这里不应该p.length-1 因为序号可能不是个位数
      let index = data.index;
      let isLastOne = data.isLastOne;
      let p = data.node;
      let last = p.substr(p.lastIndexOf("-") + 1);
      let upParent =
        p.substr(0, p.lastIndexOf("-")) + "-" + (parseInt(last) - 2);
      let downParent =
        p.substr(0, p.lastIndexOf("-")) + "-" + (parseInt(last) + 1);
      let now = this.getParentAndSlefUuid(p);
      let lastNode =
        parseInt(index) === 0 || parseInt(index) === 1
          ? nodeData
          : this.getParentAndSlefUuid(upParent);
      let downNode = isLastOne
        ? nodeData
        : this.getParentAndSlefUuid(downParent);
      // 现在parentuuid都是当前节点的父节点。
      let upData = {
        beforeUuid: lastNode.uuid,
        fromUuid: lastNode.parentUuid,
        myUuid: now.uuid,
        toUuid: now.parentUuid
      };
      let downData = {
        beforeUuid: downNode.uuid,
        fromUuid: now.parentUuid,
        myUuid: now.uuid,
        toUuid: now.parentUuid
      };
      data.upData = upData;
      data.downData = downData;
      this.$emit("clickmenu", data);
    },
    addTreeKey(data, key, value) {
      if (!data || !data.length) {
        return;
      }
      for (var i = 0, len = data.length; i < len; i++) {
        data[i][key] = value;
        if (data[i].children && data[i].children.length) {
          this.addTreeKey(data[i].children, key, value);
        }
      }
    },
    updateSelect({ orgUuid, parent, selected, root, rankOrder, oneData }) {
      // 点击选中这边需要去除不同层级的选中的状态，只能一个个遍历，没有记忆保存

      let node = parent.split("-");
      let data = this.fliterData();
      let str = "data",
        index;
      this.addTreeKey(data, "selected", false);
      node.shift();
      for (let i = 0, len = node.length; i < len; i++) {
        if (i != len - 1) {
          str += `[${node[i]}].children`;
        } else {
          index = parseInt(node[i]);
        }
      }
      let noSelected = false;
      if (this.lastSelect) {
        eval(this.lastSelect);
      }
      this.lastSelect = str + `[${node[node.length - 1]}].selected=noSelected`;

      str += `[${node[node.length - 1]}].selected=selected`;

      eval(str);
      this.data = data;
      this.fliterData();
      this.$emit("exportData", orgUuid, root, rankOrder, oneData, parent);
    },
    updateExtend({ orgUuid, parent, isextend, ishavechildren }) {
      let node = parent.split("-");
      let data = this.fliterData();
      let str = "data",
        index;
      node.shift();
      for (let i = 0, len = node.length; i < len; i++) {
        if (i != len - 1) {
          str += `[${node[i]}].children`;
        } else {
          index = parseInt(node[i]);
        }
      }
      str += `[${node[node.length - 1]}].isextend=isextend`;
      eval(str);
      this.data = data;
      this.fliterData();
      this.$emit("getChidrendata", orgUuid, isextend, parent);
    },
    getParentKey(parent, key) {
      let node = parent.split("-");
      let data = this.fliterData();
      let parentKey = "";
      for (let i = 1; i < node.length - 1; i++) {
        parentKey = data[node[i]][key];
        data = data[node[i]].children;
      }
      return parentKey;
    },
    operator(opeartordata) {
      this.lastSelect = "";
      // {operator,value,node}
      // operator表示操作 value 添加的值 node节点路径

      // console.log(opeartordata);
      let node = [];
      if (opeartordata.node) {
        node = opeartordata.node.split("-");
        node.splice(0, 1);
      }
      let operator = opeartordata.operator;
      let findNode = null,
        cnt = 0;
      let data = this.fliterData();
      // console.log(JSON.parse(JSON.stringify(data)));
      // console.log(JSON.parse(JSON.stringify(this.initdata)));
      // console.log(data);
      // while (cnt < node.length) {
      //   console.log(cnt+" ___  "+node[cnt]);
      //   if(cnt==0){
      //     data=data[node[cnt++]];
      //   }else{
      //     data=data.children[node[cnt++]];
      //   }
      //   console.log(data);
      // }
      // console.log(data);
      let str = "data",
        index;
      // console.log(node);
      for (let i = 0, len = node.length; i < len; i++) {
        if (i != len - 1) {
          str += `[${node[i]}].children`;
        } else {
          index = parseInt(node[i]);
        }
      }
      let isSelect = false;
      // console.log(str + "  ---  " + index);
      // this.data = data;
      if (operator === "addChildre") {
        str += `[${index}]`;
        console.log(str);
        console.log(opeartordata);
        eval(str).havechildren = true;
        eval(str).isextend = true;
        // 添加选中状态则去除其他选中状态
        this.addTreeKey(data, "selected", false);
        eval(str).selected = true;
        eval(str).children = eval(str).children || [];
        // 这里将所有的isextend变成false  ------
        for (var i = 0; i < opeartordata.value.length; i++) {
          opeartordata.value[i].isextend = false;
        }
        eval(str).children = opeartordata.value;
        // 如果children是空数组，将倒三角去掉
        eval(str).havechildren = false;
        eval(str).KuoZha = false;
        this.data = data;
        // console.log(this.data);
      } else if (operator === "changeName") {
        let name = opeartordata.value;
        let namStr = str + `[${node[node.length - 1]}].label=name`;
        // console.log(namStr);
        eval(namStr);
        let orgNameStr = str + `[${node[node.length - 1]}].orgName=name`;
        // console.log(namStr);
        eval(orgNameStr);
        let version = opeartordata.version;
        let versionStr = str + `[${node[node.length - 1]}].version=version`;
        // console.log(versionStr);
        eval(versionStr);
        // console.log(data);
        this.data = data;
      } else if (operator === "selected") {
        let selected = opeartordata.selected;
        // isSelect = selected;
        let namStr = str + `[${node[node.length - 1]}].selected=selected`;
        // console.log(namStr);
        eval(namStr);
        this.data = data;
      } else if (operator === "moveup") {
        if (index == 0) {
          // alert("已经是第一个，上移不了");
        } else {
          //  先删除本身，然后在自己添加到前一个;
          let middle = eval(str).splice(index, 1);
          eval(str).splice(index - 1, 0, middle[0]);
          this.data = data;
        }
      } else if (operator === "movedown") {
        let len = eval(str).length;
        if (index + 1 < len) {
          let middle = eval(str).splice(index, 1);
          eval(str).splice(index + 1, 0, middle[0]);
          this.data = data;
        } else {
          // alert("已经是最后一个，下移不了");
        }
      } else if (operator == "delete") {
        // console.log(str);
        eval(str).splice(index, 1);
        if (!eval(str).length) {
          let s = str.split(".");
          // console.log(s);
          s.pop();
          // console.log(s);
          let s3 = s.join(".");
          // console.log(s3);
          eval(s3).havechildren = false;
          eval(s3).isextend = false;
        }
        this.data = data;
      } else if (operator == "findParentById") {
        // console.log(this.newData);
        // console.log(opeartordata.parentUuid);
        // 通过id来获取path
        let id = opeartordata.parentUuid;
        let t = this.newData;
        this.findParent = "";
        this.dfs(t, id, "0");
      }
      this.initDataSX(this.data, isSelect);
      this.fliterData();
      return this.findParent;
      // console.log(this.newData);
    },
    dfs(data, id, parent) {
      if (this.findParent || !data) {
        return;
      }
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i].id + "    " + id);
        if (data[i].id === id) {
          this.findParent = parent + "-" + i;
          return;
        }
        if (data[i].children && data[i].children.length) {
          this.dfs(data[i].children, id, parent + "-" + i);
        }
      }
    },
    initDataSX(data, isSelect = false) {
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].isextend === true) {
          data[i].isextend = true;
        } else {
          data[i].isextend = false;
        }
        // data[i].isextend = false;
        // if (!data[i].selected) {
        //   data[i].selected = false;
        // }
        if (data[i].selected === true) {
          data[i].selected = true;
        } else {
          data[i].selected = false;
        }
        // data[i].selected = isSelect && data[i].selected === true;
        // console.log(data[i].label + "  " + data[i].children);
        if (data[i].children && data[i].children.length) {
          data[i].havechildren = true;
          this.initDataSX(data[i].children);
        } else {
          // 这里默认都是有children
          // console.log(data[i].havechildren);
          if (data[i].KuoZha !== false) {
            if (data[i].havechildren !== "no") {
              if (parseInt(data[i].nextCount) > 0) {
                data[i].havechildren = true;
              } else {
                data[i].havechildren = false;
              }
            } else {
              data[i].havechildren = false;
              // console.log("aaaaaaaaaaaaaa");
            }
          }
        }
      }
    }
  },
  props: {
    showCheckbox: {
      type: Boolean,
      default() {
        return false;
      }
    },
    operatorDisabled: {
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
    },
    initdata: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      newData: [], //存储变更的数据
      search: "",
      searchtype: "",
      data: [],
      lastSelect: "", //上一个被选中的
      findParent: "" // 通过id 查找的id值
    };
  },
  mounted() {
    this.data = this.initdata;
    this.initDataSX(this.data);
    this.fliterData();
  },
  watch: {
    initdata(val) {
      this.data = [];
      this.data = JSON.parse(JSON.stringify(this.initdata));
      this.lastSelect = "";
      this.initDataSX(this.data);
      this.fliterData();
    }
  }
};
</script>

<style>
.slideMaxHeight-enter-active,
.slideMaxHeight-leave-active {
  transition: all 0.5s;
}

.slideMaxHeight-enter,
.slideMaxHeight-leave-to {
  max-height: 0px;
}
</style>


