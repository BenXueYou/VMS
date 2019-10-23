<template>
  <div class='role'>
    <div class='table'>
      <div class="title">
        账户管理
      </div>

      <div class="content">
        <div class='header'>
          <el-button type="primary"
                     @click="visible=true"
                     size="small">测试</el-button>
          <el-button type="primary"
                     size="small">新增</el-button>
          <el-button type="primary"
                     size="small">刪除</el-button>
          <el-button type="primary"
                     size="small">启用</el-button>
          <el-button type="primary"
                     size="small">禁用</el-button>
          <el-button type="primary"
                     size="small">密码重置</el-button>
        </div>
      </div>
    </div>
    <auth-tree :visible.sync="visible">

    </auth-tree>
  </div>
</template>

<script>
import authTree from "@/pages/user/components/authTree";
export default {
  name: "role",
  components: {
    authTree
  },
  data() {
    return {
      visible: false
    };
  }
};
</script>
<style lang="scss" scoped>
.role {
  height: 100%;
  .table {
    height: 100%;
  }
  .title {
    position: relative;
    height: 60px;
    line-height: 60px;
    padding-left: 60px;
    background: #212325;
    &::after {
      content: "";
      width: 3px;
      height: 14px;
      position: absolute;
      top: 23px;
      left: 40px;
      background: #26d39d;
    }
  }
  .content {
    height: calc(100% - 80px);
    margin-top: 20px;
    background: #212325;
    .header {
      padding: 25px;
    }
  }
}
</style>
