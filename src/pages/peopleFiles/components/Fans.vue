<template>
  <div class='Fans'>
    <div class="people"
         v-for="(item,index) in data "
         :key="index">
      <div class="leftImgWrap">
        <img :src="item.photoUri"
             style="cursor:pointer;"
             @click="clickHead(item)"
             alt="">
        <div class="important"
             v-if="item.isFocus">重点</div>
      </div>
      <div class="info">
        <p>姓名：{{hideName(item.staffName,1)}}</p>
        <p>性别：{{$common.getEnumItemName("gender", item.gender)}}</p>
        <p>证件号码：{{hideName(item.credentialNo,4)}}</p>
        <p>联系号码：{{hideName(item.contactInfo,3)}}</p>
        <p>住户类型：{{$common.getEnumItemName("staff_t", item.staffType)}}</p>
        <p v-if="house && house.length">住址：<template v-for="(it,ix) in house">
            <span :key="ix">
              {{it.infrastructureAddress.replace(/\／/g,"/")}}
            </span>
          </template></p>
        <p v-else>住址：{{item.address}}</p>
      </div>

    </div>
  </div>
</template>
<script>
import * as api from "@/pages/communityBoard/utils/ajax.js";
export default {
  name: "Fans",
  props: {
    staffUuid: {
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
    },
    house: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      peopleStaffUuid: "",
      data: []
    };
  },
  components: {},
  mounted() {
    this.getData();
  },
  methods: {
    hideName(str, len) {
      console.log(str);
      if (!str) {
        return "";
      }
      let s = str.substr(0, len);
      s += "*".repeat(str.length - len * 2);
      s += str.substr(str.length - len, len);
      return s;
    },
    clickHead(data) {
      this.$emit("update", data.staffUuid);
    },
    getData() {
      api
        .getResident({
          staffUuid: this.staffUuid,
          projectUuid: this.projectUuid
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data || [];
            this.data = data.filter(item => {
              return item.staffUuid !== this.staffUuid;
            });
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.Fans {
  max-height: 680px;
  overflow-y: auto;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  .people {
    width: 420px;
    display: flex;
    background-color: rgb(42, 45, 49);
    margin-left: 20px;
    margin-bottom: 22px;

    position: relative;
    overflow: hidden;
    .important {
      position: absolute;
      right: -16px;
      top: 0px;
      line-height: 24px;
      padding: 0px 15px;
      transform: rotate(-315deg);
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #ff5f5f;
      text-align: center;
      background: rgba(0, 0, 0, 0.8);
    }
    .leftImgWrap {
      position: relative;
      width: 180px;
      height: 180px;
      // background-color: #fff;
      text-align: center;
      border: 1px solid rgb(42, 45, 49);
      img {
        width: 100%;
        height: 100%;
      }
      overflow: hidden;
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
