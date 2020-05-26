<template>
  <div class="Fans">
    <div class="people"
         v-for="(item,index) in data "
         :key="index">
      <div class="leftImgWrap cursorClass"
           @click="jumpToPeopleFile(item)">
        <img :src="item.photoUrl"
             alt />
        <div v-if="item.focus"
             class="tipsIconClass">{{'重点'}}</div>
      </div>
      <div class="info">
        <p>姓名：{{$common.plusXing(item.staffName,1,1)}}</p>
        <p>性别：{{$common.getEnumItemName("gender", item.gender)}}</p>
        <p>证件号码：{{$common.plusXing(item.credentialNo,5,1)}}</p>
        <p>联系号码：{{$common.plusXing(item.phoneNo,4,4)}}</p>
        <p>人员类别：{{$common.getEnumItemName("category", item.staffType)}}</p>
        <p>人员类型：{{$common.getEnumItemName("staff_t", item.householdType)}}</p>
      </div>
    </div>
  </div>
</template>
<script>
// import * as api from "@/pages/communityBoard/utils/buildHouseFileAjax.js";
export default {
  name: "Fans",
  props: {
    infrastructureUuid: {
      type: String,
      default() {
        return "";
      }
    },
    projectUuid: {
      type: String,
      default() {
        return this.$store.state.home.projectUuid;
      }
    }
  },
  data() {
    return {
      data: []
    };
  },
  mounted() {
    this.getData();
  },
  destroyed() {
    this.data = [];
  },
  watch: {
    infrastructureUuid(val) {
      this.data = [];
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    jumpToPeopleFile(staffObj) {
      console.log(staffObj);
      this.$emit("jumpToPeopleFile", staffObj);
    },
    getData() {
      if (!this.infrastructureUuid) {
        return;
      }
      this.$BuildHouseFileAjax
        .roomStaffListApi({
          infrastructureUuid: this.infrastructureUuid,
          projectUuid: this.projectUuid
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            console.log(data);
            this.data = data;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.Fans {
  max-height: 680px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  .people {
    width: 420px;
    display: flex;
    background-color: rgb(42, 45, 49);
    margin: 30px 20px 0 0;
    .leftImgWrap {
      width: 180px;
      height: 180px;
      // background-color: #fff;
      text-align: center;
      border: 1px solid rgb(42, 45, 49);
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .tipsIconClass {
        width: 55px;
        height: 20px;
        position: absolute;
        right: -15px;
        top: 5px;
        background-color: rgba(49, 61, 71, 0.6);
        transform: rotate(45deg);
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ff5f5f;
      }
    }
    .info {
      margin: 10px;
      p {
        margin: 0px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #dddddd;
        line-height: 25px;
        white-space: nowrap;
      }
    }
  }
}
</style>
