<template>
  <div class="FacultyCard"
       :class="CardItem.sign==='0'?'unSignCardClass':'signCardClass'">
    <el-image :src="$common.setPictureShow(CardItem.staffPic)"></el-image>
    <div class="tipsTxtBox">
      <div class="tipsTxt stressTxt">
        <span class="stressTxtLeft">{{CardItem.staffName || '姓名'}}</span>
        <!-- <span v-if="!CardItem.sign" class="stressTxtRight">{{CardItem.status || '未签到'}}</span> -->
        <span v-if="CardItem.sign==='0'"
              class="stressTxtRight">未签到</span>
      </div>
      <span class="tipsTxt">{{CardItem.phoneNumber || '电话号码'}}</span>
      <span class="tipsTxt">最早签到时间：{{CardItem.firstSign || ''}}</span>
      <span class="tipsTxt">最晚签到时间：{{CardItem.lastSign || ''}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    CardItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {}
};
</script>

<style lang='scss'>
.signCardClass {
  background: rgba(11, 50, 46, 0.4);
}
.unSignCardClass {
  background: rgba(0, 0, 0, 0.05);
  border: 1px dashed rgba(0, 216, 160, 0.25);
}
.FacultyCard {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 4px auto;
  padding: 10px 0 10px 13px;
  box-sizing: border-box;
  border-radius: 2px;
  position: relative;
  .el-image {
    width: 120px;
    height: 120px;
  }
  .tipsTxtBox {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    font-size: 12px;
    color: #54cda9;
    padding-left: 12px;
    .tipsTxt {
      text-align: left;
      img {
        margin-right: 7px;
      }
    }
    .stressTxt {
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      text-align: justify;
      .stressTxtRight {
        position: absolute;
        color: #ff5f5f;
        right: 50px;
      }
    }
  }
  .progressClass {
    margin: auto 10px;
  }
}
.ModelCard {
  margin-bottom: 15px;
  padding: 0px;
  position: relative;
  .el-image {
    width: 100px;
    height: 100px;
  }
  .tipsTxtBox {
    padding: 9px 0 9px 18px;
  }
}
</style>
