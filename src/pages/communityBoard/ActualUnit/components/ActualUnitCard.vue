<template>
  <div class="ActualUnitCard">
    <div class="imageBox">
      <el-image :src="data.picture" v-if="data.picture"></el-image>
      <div class="no-img" v-else>
        <img src="@/assets/unit-noimg.png" alt="" />
      </div>
    </div>
    <div class="cardBody">
      <div>单位名称：{{ data.companyName }}</div>
      <el-tooltip :content="address">
        <div class="address">地址：{{ address }}</div>
      </el-tooltip>
      <div>联系人：{{ data.chargePersonName }}</div>
      <div>联系电话：{{ data.chargePersonPhone }}</div>
      <div class="cardBodyBtn" @click="detailBtnAct">
        <img
          class="img"
          src="@/assets/images/communityBoard/actual_unit_staff_detail.png"
          alt
        />从业人员详情
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    address() {
      let dataObj = this.data;
      let strArr = [];
      if (dataObj.infrastructure) {
        dataObj.infrastructure.forEach(e => {
          strArr.push(e.infrastructureUri);
        });
        return strArr.join(",");
      } else {
        return "";
      }
    }
  },
  methods: {
    detailBtnAct() {
      this.$emit("actualUnitCardDetail", { ...this.data });
    }
  }
};
</script>
<style lang="scss" scoped>
.ActualUnitCard {
  height: 100%;
  .imageBox {
    width: 320px;
    height: 180px;
    .el-image {
      width: 100%;
      height: 100%;
    }
    .no-img {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      background: rgba(0, 216, 160, 0.12);
      img {
        display: block;
        width: 123px;
        height: 108px;
      }
    }
  }
  .cardBody {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px 17px;
    height: 180px;
    box-sizing: border-box;
    div {
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: justify;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    .address {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cardBodyBtn {
      font-family: "PingFangSC-Regular";
      font-size: 16px;
      color: #26d39d;
      letter-spacing: 0;
      text-align: justify;
      cursor: pointer;
    }
  }
}
</style>
