<template>
  <div class="section door"
       v-if="oData.length">
    <div class="head">
      <img :src="icons.door"
           alt>
      {{name}}
    </div>
    <div class="form-item"
         v-for="(item,index) in oData"
         :key="index">
      <label class="label">{{name}}{{index+1}}：</label>
      <el-input v-model="item.nickName"></el-input>
      <label class="label">通道类型：</label>
      <el-select v-model="item.channelType"
                 @change="gogo"
                 placeholder="请选择">
        <el-option v-for="item in options"
                   :key="item.key"
                   :label="item.value"
                   :value="item.key">
        </el-option>
      </el-select>
      <label class="label">能力：</label>
      <el-select v-model="item.ability"
                 style='width:230px;'
                 placeholder="请选择"
                 @change="gogo"
                 multiple>
        <el-option v-for="item in abilityOption"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <div class='videoSetingaa'>
        <label class="label">通道国标码：</label>
        <el-input v-model="item.gBCode"
                  @focus="gogo"
                  @change="gogo"></el-input>
        <label class="label">经度：</label>
        <el-input v-model="item.longitude"
                  type="number"
                  @focus="gogo"
                  @change="gogo"></el-input>
        <label class="label">纬度：</label>
        <el-input v-model="item.latitude"
                  type="number"
                  @focus="gogo"
                  @change="gogo"></el-input>
      </div>
      <div class="mytagWrap">
        <gt-button class="button"
                   @close="deleteTag(2,index,x)"
                   v-for="(i,x) in item.tagPOList"
                   :key="x">{{i.tagName}}</gt-button>
        <el-button class="addIcon"
                   type="primary"
                   @click="chooseTag(2,index)"
                   size="small">
          <i class="el-icon-circle-plus-outline"></i>
          选择标签
        </el-button>
      </div>

      <person-tree-tag title="请选择要添加的标签"
                       rightTxt="已选择的标签"
                       :isShow.sync="isShow"
                       :treeType="treeType"
                       :isTag="true"
                       :checkedNodeArr="checkedNode"
                       @onCancel="onCancel"
                       @onConfirm="onConfirm"></person-tree-tag>
    </div>
  </div>
</template>

<script>
import icons from "@/common/js/icon.js";
import * as api from "../ajax";
import personTreeTag from "@/common/personTreeTag";
export default {
  name: "channelSetRow",
  components: {
    personTreeTag
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    channelType: {
      type: String,
      default() {
        return "通道名称";
      }
    },
    index: {
      type: Number,
      default() {
        return 0;
      }
    },
    abilityOption: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      icons,
      oData: [],
      options: [],
      isShow: false,
      treeType: window.config.tagType,
      checkedNode: [],
      whichType: 0,
      whichIndex: 0,
      name: ""
    };
  },
  mounted() {
    this.oData = this.data;
    this.getOptions();
    this.initName();
  },
  watch: {
    oData(val) {
      this.$emit("update", this.index, this.data);
    }
  },
  methods: {
    initName() {
      // console.log(window.c)
      let resourceType = window.config.resourceType;
      for (let k in resourceType) {
        let arr = resourceType[k];
        for (let i = 0, len = arr.length; i < len; i++) {
          // console.log(arr[i].id + " " + this.channelType);
          if (arr[i].id === this.channelType) {
            this.name = arr[i].label;
          }
        }
      }
    },
    getOptions() {
      api.getTongDaoType(this.channelType).then(res => {
        console.log(res);
        if (res.data.success) {
          this.options = res.data.data || [];
        }
      });
    },
    gogo() {
      console.log(this.oData);
      // this.$emit("update", this.index, this.data);
    },
    elteTagChannel(data, channelUuid, channelType) {
      api.deleteChannelTagUrl(data, channelUuid, channelType).then(res => {
        console.log(res);
      });
    },
    deleteTag(i, j) {
      this.oData[i].tagPOList.splice(j, 1);
      this.delteTagChannel(
        this.oData[i].tagPOList,
        this.oData[i].channelUuid,
        this.oData[i].channelType
      );
      this.oData.concat();
    },
    chooseTag(whichType, index, x) {
      this.whichType = whichType;
      this.whichIndex = parseInt(index);
      let data = [];
      console.log(this.oData);
      console.log(whichType, index, x);
      data = this.oData[this.whichIndex].tagPOList;
      for (let i = 0; i < data.length; i++) {
        data[i].id = data[i].tagUuid;
        data[i].label = data[i].tagName;
      }
      this.checkedNode = JSON.parse(JSON.stringify(data));
      this.isShow = true;
    },
    onCancel() {
      this.isShow = false;
    },
    delteTagChannel(data, channelUuid, channelType) {
      api.deleteChannelTagUrl(data, channelUuid, channelType).then(res => {
        console.log(res);
      });
    },
    onConfirm(data) {
      console.log(data);
      this.oData[this.whichIndex].tagPOList = data;
      this.oData.concat();
      let channelUuid = this.oData[this.whichIndex].channelUuid;
      let channelType = this.oData[this.whichIndex].channelType;
      this.delteTagChannel(data, channelUuid, channelType);
      this.isShow = false;
    }
  }
};
</script>
<style>
</style>
