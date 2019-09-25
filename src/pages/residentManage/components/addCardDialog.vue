<template>
  <el-dialog class="addCardDialog"
             :title="'新增卡片'"
             :visible.sync="isCurrentShow"
             @close="closeDialog"
             width="380px">
    <div class="con">
      <div class="detail">
        <div class="left">卡片名称：</div>
        <div class="right">
          <el-input v-model="addCardName"
                    style="width: 220px;height: 30px;"></el-input>
        </div>
      </div>
      <div class="detail">
        <div class="left">卡片：</div>
        <div class="right">
          <el-input v-model="addCard"
                    style="width: 220px;height: 30px;"></el-input>
        </div>
      </div>
      <div class="detail">
        <div class="left">禁用/启用：</div>
        <div class="right">
          <el-switch v-model="addCardSwitch"
                     active-color="rgba(32,204,150,0.2)"
                     inactive-color="rgba(255,255,255,0.2)"
                     style="width: 35px;"></el-switch>
        </div>
      </div>
      <div class="detail">
        <div class="left">卡片功能：</div>
        <div class="right">
          <el-select v-model="addCardFunc"
                     placeholder="请选择"
                     style="width: 220px;">
            <el-option v-for="item in cardFuncArr"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr"></el-option>
          </el-select>
        </div>
      </div>
      <div class="btnWrap">
        <el-button style="width: 66px;"
                   @click="addCardConfirm">确认</el-button>
        <el-button style="width: 66px;"
                   @click="closeDialog">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  props: {
    addCardDialog: {
      type: Boolean,
      default: false
    },
    checkedCard: {
      type: Object,
      default() {
        return {};
      }
    },
    cardList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isCurrentShow: false,
      addCardFunc: null,
      cardFuncArr: [],
      addCardSwitch: true,
      addCard: "",
      addCardName: ""
    };
  },
  mounted() {},
  methods: {
    showAct() {
      this.cardFuncArr = this.$common.getEnumByGroupStr("card_u");
      this.addCardFunc = this.cardFuncArr[0].typeStr;
    },
    transferCardName() {
      var addCardFuncName = "";
      for (var i = 0; i < this.cardFuncArr.length; i++) {
        if (this.addCardFunc === this.cardFuncArr[i].typeStr) {
          addCardFuncName = this.cardFuncArr[i].typeName;
          return addCardFuncName;
        }
      }
      return addCardFuncName;
    },
    closeDialog() {
      // this.addCardSwitch = true;
      // this.addCard = "";
      // this.addCardName = "";
      // this.cardFuncArr = this.$common.getEnumByGroupStr("card_u");
      // this.addCardFunc = this.cardFuncArr[0].typeStr;
      this.$emit("update:addCardDialog", false);
    },
    addCardConfirm() {
      var addCardFuncName = "";
      if (!this.addCard && !this.addCard.length) {
        this.$message({ type: "warning", message: "卡片为空" });
        return;
      }
      for (let i = 0; i < this.cardList.length; i++) {
        if (this.addCardName === this.cardList[i].cardName) {
          this.$message.error("卡片名称重复!");
          return;
        }
        if (this.addCard === this.cardList[i].cardId) {
          this.$message.error("卡号重复!");
          return;
        }
      }
      api
        .judgeRepeatCard({
          mediumNo: this.addCard
        })
        .then(res => {
          console.log(res);
          if (!res.data.data) {
            for (var i = 0; i < this.cardFuncArr.length; i++) {
              if (this.addCardFunc === this.cardFuncArr[i].typeStr) {
                addCardFuncName = this.cardFuncArr[i].typeName;
              }
            }
            var obj = {
              cardEnable: this.addCardSwitch,
              cardId: this.addCard,
              cardName: this.addCardName,
              function: this.addCardFunc,
              mediumUuid: "",
              addCardFuncName: addCardFuncName
            };
            console.log(this.addCardFunc);
            this.$emit("transferCard", obj);
          } else {
            this.$message.error("卡号重复");
          }
        });

      // this.$emit("addCardDialogHide");
    }
  },
  watch: {
    checkedCard: {
      handler(val, oldval) {
        if (val.cardEnable !== undefined) {
          this.addCardSwitch = val.cardEnable;
        } else {
          this.addCardSwitch = true;
        }
        console.log(this.addCardSwitch);
        this.addCard = val.cardId || "";
        this.addCardName = val.cardName || "";
        if (val.function) {
          this.addCardFunc = val.function || "";
        } else {
          this.cardFuncArr = this.$common.getEnumByGroupStr("card_u");
          this.addCardFunc = this.cardFuncArr[0].typeStr;
        }
      },
      deep: true
    },
    addCardDialog(val) {
      this.showAct();
      if (val) {
        if (this.checkedCard.cardEnable !== undefined) {
          this.addCardSwitch = this.checkedCard.cardEnable;
        } else {
          this.addCardSwitch = true;
        }
        console.log(this.addCardSwitch);
        this.addCard = this.checkedCard.cardId || "";
        this.addCardName = this.checkedCard.cardName || "";
        if (this.checkedCard.function) {
          this.addCardFunc = this.checkedCard.function || "";
        }
      }
      this.isCurrentShow = val;
      console.log(this.checkedCard);
    }
  }
};
</script>
<style>
.theResidentGroup
  .addCardDialog
  .con
  .el-switch.is-checked
  .el-switch__core::after {
  left: 100%;
  margin-left: -13px;
}
</style>
<style scoped>
.theResidentGroup .addCardDialog .con {
  width: 380px;
  height: 290px;
  padding: 30px 0 43px 0;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  text-align: right;
  box-sizing: border-box;
}
.theResidentGroup .addCardDialog .con .detail {
  width: 380px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}
.theResidentGroup .addCardDialog .con .detail .left {
  width: 110px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  box-sizing: border-box;
}
.theResidentGroup .addCardDialog .con .detail .right {
  flex: 1;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.theResidentGroup .addCardDialog .con .btnWrap {
  margin-top: 21px;
  display: flex;
  padding-left: 110px;
  box-sizing: border-box;
}
.theResidentGroup .addCardDialog .con .btnWrap .el-button {
  height: 32px;
  background: rgba(40, 255, 187, 0.1);
  border: 1px solid rgba(40, 255, 187, 0.35);
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #ffffff;
  position: relative;
  padding: 0 0 0 0;
}
</style>
