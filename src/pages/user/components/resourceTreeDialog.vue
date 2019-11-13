<template>
  <el-dialog width="760px"
             title="关联的通道资源"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :append-to-body="true"
             :close-on-click-modal="false">
  </el-dialog>
</template>

<script>
export default {
  name:"resourceDialog",
  data(){
    
  },
  methods:{

  }
}
</script>

