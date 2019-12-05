<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='c'>
      <el-tree :data="data"
               node-key="featureUuid"
               :props="props"
               default-expand-all
               :expand-on-click-node="false">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <div class='labelName'>{{ node.label }}
          </div>
          <div class='groupButton'>
            <el-checkbox :indeterminate="data.isIndeterminate"
                         v-model="data.checkAll"
                         style="float:left;"
                         @change="handleCheckAllChange(node,data)">全选</el-checkbox>
            <el-checkbox-group v-model="data.checkAuth"
                               v-if="data.auth.length"
                               style="float:left;"
                               @change="handleCheckedCitiesChange(node,data)">
              <el-checkbox v-for="city in data.auth"
                           :label="city.authName"
                           :key="city.authName">{{city.authName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </span>
      </el-tree>
    </div>
    <div class="ss">
      <el-button type="primary"
                 class="butttt"
                 @click="close"
                 size="small">取消</el-button>
      <el-button type="primary"
                 class="butttt"
                 @click="confirm"
                 size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
let id = 1000;
let string = "string",
  int = "int";
let auth = [
  {
    authUuid: "a1",
    authName: "新增",
    authNo: int,
    isOwn: 1
  },
  {
    authUuid: "a2",
    authName: "修改",
    authNo: int,
    isOwn: 1
  },
  {
    authUuid: "a3",
    // 功能权限uuid
    authName: "删除",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a4",
    // 功能权限uuid
    authName: "查看",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a5",
    // 功能权限uuid
    authName: "导入",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a6",
    // 功能权限uuid
    authName: "导出",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  }
];
let auth2 = [
  {
    authUuid: "a1",
    authName: "新增",
    authNo: int,
    isOwn: 0
  },
  {
    authUuid: "a2",
    authName: "修改",
    authNo: int,
    isOwn: 0
  },
  {
    authUuid: "a3",
    // 功能权限uuid
    authName: "删除",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 0
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a4",
    // 功能权限uuid
    authName: "查看",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 0
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a5",
    // 功能权限uuid
    authName: "导入",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a6",
    // 功能权限uuid
    authName: "导出",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  }
];
let auth3 = [
  {
    authUuid: "a1",
    authName: "新增",
    authNo: int,
    isOwn: 0
  },
  {
    authUuid: "a2",
    authName: "修改",
    authNo: int,
    isOwn: 1
  },
  {
    authUuid: "a3",
    // 功能权限uuid
    authName: "删除",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a4",
    // 功能权限uuid
    authName: "查看",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a5",
    // 功能权限uuid
    authName: "导入",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a6",
    // 功能权限uuid
    authName: "导出",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  }
];
let data = [
  {
    featureUuid: "string1",
    // 功能uuid
    parentUuid: string,
    // 父节点uuid
    nodeName: "门禁管理",
    // 节点名称
    nodeType: string,
    // 节点类型
    nodeNo: int,
    checkAuth: [],
    // 节点序号
    auth: [
      // 非叶子节点时，此数组size为0
    ],
    childNodes: [
      {
        featureUuid: "string2",
        // 功能uuid
        parentUuid: string,
        // 父节点uuid
        nodeName: "权限组",
        // 节点名称
        nodeType: string,
        // 节点类型
        nodeNo: int,
        checkAuth: [],
        // 节点序号
        auth: [],
        childNodes: [
          {
            featureUuid: "string3",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "权限组",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth,
            childNodes: []
          },
          {
            featureUuid: "string4",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "通行时间段",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth2,
            childNodes: []
          },
          {
            featureUuid: "string5",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "特殊日期",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth3,
            childNodes: []
          }
        ]
      },
      {
        featureUuid: "string11",
        // 功能uuid
        parentUuid: string,
        // 父节点uuid
        nodeName: "高级配置",
        // 节点名称
        nodeType: string,
        // 节点类型
        nodeNo: int,
        checkAuth: [],
        // 节点序号
        auth: [],
        childNodes: [
          {
            featureUuid: "string13",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "互锁",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth,
            childNodes: []
          },
          {
            featureUuid: "string14",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "反潜回",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth2,
            childNodes: []
          },
          {
            featureUuid: "string15",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "首卡开门",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth3,
            childNodes: []
          },
          {
            featureUuid: "string35",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "多人组合开门",
            // 节点名称
            nodeType: string,
            checkAuth: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth3,
            childNodes: []
          }
        ]
      }
    ]
  }
];
// console.log(data);
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "900px";
      }
    },
    title: {
      type: String,
      default() {
        return "功能模块权限";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    roleUuid: {
      type: String,
      default() {
        return "0c691cd5845b4b4a918cc710e10985ea";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    selectAuthUuid:{
      type:Array,
      default(){
        return [];
      }
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      data: [],
      props: {
        label: "nodeName",
        children: "childNodes"
      },
      allData: ["新增", "修改", "删除", "查看", "导入", "导出"],
      checkedNum: [],
      showNum: []
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
  },
  methods: {
    initData() {
      let d = JSON.parse(JSON.stringify(this.data));
      this.dpTree(d);
      this.data = JSON.parse(JSON.stringify(d));
    },
    handleCheckAllChange(node, data) {
      // 点击全选按钮
      // console.log(node);
      // console.log(data);
      if (data.checkAll) {
        data.checkAuth = this.allData;
      } else {
        data.checkAuth = [];
      }
      data.lastCheckCities = data.checkAuth;
      data.isIndeterminate = false;
      // 点击全选不是叶子节点的情况
      if (node.childNodes.length) {
        this.dealParentOperator(node.childNodes, data.checkAuth);
        //
      }
      this.traverseUpwrad(node, data.checkAuth);
    },
    traverseUpwrad(node, checkAuth) {
      node.data.checkAuth = checkAuth;
      node.data.checkAll = checkAuth.length === auth.length;
      node.data.isIndeterminate =
        checkAuth.length > 0 && checkAuth.length < auth.length;
      let arr = checkAuth;
      let last = node;
      let previous = node;
      while (1) {
        if (!last && !previous) {
          break;
        }
        if (last) {
          arr = this.concat(arr, last.data.checkAuth);
          last = last.nextSibling;
        }
        if (previous) {
          arr = this.concat(arr, previous.data.checkAuth);
          previous = previous.previousSibling;
        }
      }
      // console.log(arr);
      if (node.parent) {
        this.traverseUpwrad(node.parent, arr);
      }
    },
    dealParentOperator(data, checkAuth) {
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].data.checkAuth = checkAuth;
        data[i].data.checkAll = checkAuth.length === auth.length;
        data[i].data.isIndeterminate =
          checkAuth.length > 0 && checkAuth.length < auth.length;
        if (data[i].childNodes.length) {
          this.dealParentOperator(data[i].childNodes, checkAuth);
        }
      }
    },
    handleCheckedCitiesChange(node, data) {
      // console.log(node);
      data.checkAll = data.checkAuth.length === data.auth.length;
      data.isIndeterminate =
        data.checkAuth.length > 0 && data.checkAuth.length < data.auth.length;
      // 点击选项不是叶子点击的情况
      if (node.childNodes.length) {
        let xxx = this.getDifferent(data.checkAuth, data.lastCheckCities);
        // console.log(xxx);
        // lastCheckCities的作用记录修改的是哪个按钮的状态，这个按钮是被选中了还是取消了
        data.lastCheckCities = data.checkAuth;
        // 这里的函数名字起的比较随意
        this.dealParentOperator222(node.childNodes, xxx.name, xxx.isAdd);
      }
      this.traverseUpwrad(node, data.checkAuth);
    },
    dealParentOperator222(data, name, isAdd) {
      for (let i = 0, len = data.length; i < len; i++) {
        let checkAuth = data[i].data.checkAuth;
        if (isAdd) {
          if (checkAuth.indexOf(name) === -1) {
            checkAuth.push(name);
          }
        } else {
          let index = checkAuth.indexOf(name);
          if (index !== -1) {
            checkAuth.splice(index, 1);
          }
        }
        // console.log(checkAuth);
        data[i].data.checkAuth = checkAuth;
        data[i].data.checkAll = checkAuth.length === auth.length;
        data[i].data.isIndeterminate =
          checkAuth.length > 0 && checkAuth.length < auth.length;
        if (data[i].childNodes.length) {
          this.dealParentOperator222(data[i].childNodes, name, isAdd);
        }
      }
    },
    getDifferent(target, num) {
      let newArr = target.filter(item => {
        return num.indexOf(item) === -1;
      });
      let newArr2 = num.filter(item => {
        return target.indexOf(item) === -1;
      });
      if (newArr.length) {
        return {
          name: newArr[0],
          isAdd: true
        };
      } else {
        return {
          name: newArr2[0],
          isAdd: false
        };
      }
    },
    getCheckedNodes(data) {
      // 这里新增判断外面传进来的selectAuthUuid数组，根据里面的uuid判断选不选中
      console.log(data);
      data=data.sort((v1,v2)=>{
        return v1.authName-v2.authName;
      })
      let arr = [];
      for (let i = 0, len = data.length; i < len; i++) {
        // console.log(this.selectAuthUuid);
        // if (data[i].isOwn === 1) {
        if(this.selectAuthUuid.indexOf(data[i].authUuid)!=-1){
          arr.push(data[i].authName);
        }
      }
      return arr;
    },
    // 循环遍历，判断是否有全选按钮
    dpTree(data) {
      let checkAuth = [],
        arr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].childNodes) {
          if (data[i].childNodes.length) {
            data[i].auth = [];
            data[i].checkAuth = [];
            data[i].lastCheckCities = [];
            data[i].checkAll = false;
            data[i].isIndeterminate = false;
            checkAuth = this.dpTree(data[i].childNodes);
          }
          // console.log(data[i].nodeName);
        }
        // 表示这个是叶子节点了F
        if (data[i].auth.length) {
          data[i].auth=data[i].auth.sort((v1,v2)=>{
            return v1.authNo-v2.authNo;
          })
          data[i].checkAuth = this.getCheckedNodes(data[i].auth);
          data[i].checkAll = data[i].checkAuth.length === data[i].auth.length;
          data[i].isIndeterminate =
            data[i].checkAuth.length > 0 &&
            data[i].checkAuth.length < data[i].auth.length;
        } else {
          // console.log(checkAuth);
          data[i].auth = auth;
          data[i].checkAuth = checkAuth;
          data[i].lastCheckCities = checkAuth;
          data[i].checkAll = checkAuth.length === data[i].auth.length;
          data[i].isIndeterminate =
            checkAuth.length > 0 && checkAuth.length < data[i].auth.length;
        }
        if (!arr.length) {
          arr = data[i].checkAuth;
        } else {
          arr = this.concat(arr, data[i].checkAuth);
        }
        // console.log(arr);
      }
      return arr;
    },
    concat(target, num) {
      return num.filter(item => {
        return target.indexOf(item) !== -1;
      });
    },
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      // console.log(node);
      // console.log(data);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    getUuid(auth, chekcedNum) {
      return auth
        .filter(item => {
          return chekcedNum.indexOf(item.authName) !== -1;
        })
        .map(item => {
          return item.authUuid;
        });
    },
    getAllCheckedLeafUuid(data) {
      // 遍历数据
      for (let i = 0, len = data.length; i < len; i++) {
        // 判断是不是叶子节点
        if (data[i].childNodes && data[i].childNodes.length) {
          this.getAllCheckedLeafUuid(data[i].childNodes);
        } else {
          let num = this.getUuid(data[i].auth, data[i].checkAuth);
          console.log(num);
          this.checkedNum.push(...num);
          if (num.length) {
            // num有长度则表示要显示
            this.showNum.push({
              featureName: data[i].nodeName,
              featureUuid: data[i].featureUuid,
              authUuids:num
            });
          }
        }
      }
    },
    confirm() {
      // 获取所有的叶子节点被选中的uuid
      this.checkedNum = [];
      this.showNum = [];
      this.getAllCheckedLeafUuid(this.data);
      // console.log(this.checkedNum);
      // console.log(this.showNum);

      this.$emit("confirm", this.checkedNum, this.showNum);
      this.close();
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    getData() {
      api
        .getAuth({
          roleUuid: this.roleUuid
        })
        .then(res => {
          // console.log(res);
          let data = res.data.data || [];
          this.data = data;
          this.initData();
        });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
        this.getData();
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  .labelName {
    width: 200px;
  }
  .groupButton {
    width: calc(100% - 200px);
  }
}

$labelwidth: 5em;
.ss {
  padding: 15px;
  .butttt {
    float: right;
    margin-right: 30px;
  }
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}
.c {
  overflow: auto;
  max-height: 65vh;
  min-height: 30vh;
  padding: 10px 20px;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      font-family: "PingFangSC-Regular";
      padding-right: 5px;
      box-sizing: border-box;
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
      box-sizing: border-box;
      button {
        height: 30px;
        padding: 7px 21px;
        background: rgba(40, 255, 187, 0.12);
        border: 1px solid rgba(40, 255, 187, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
}
</style>
