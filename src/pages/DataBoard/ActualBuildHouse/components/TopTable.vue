<template>
  <div class="table_wrap">
    <el-table :data="list"
              border
              stripe
              style="width: 100%;height:384px">
      <el-table-column width="50"
                       type="index"
                       label="排名"
                       v-if="isPass"></el-table-column>
      <el-table-column width="50"
                       prop="rankOrder"
                       label="排名"
                       v-else></el-table-column>
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       v-for="(item, index) in columns"
                       :key="index"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TopTable",
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default: true
    },
    OwnAuthDisabled: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    isPass: {
      type: Boolean,
      default() {
        return false;
      }
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    list() {
      let list = this.tableData;
      if (this.columns[0].prop === "address") {
        list.map(e => {
          return (e.perAcreage = e.perAcreage + "㎡");
        });
      }
      return list;
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.columns);
    console.log(this.tableData);
  },
  methods: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.table_wrap {
  width: 100%;
  >>> .el-table__row--striped {
    td {
      background: rgba(255, 255, 255, 0.08) !important;
    }
  }
  >>> .el-table td {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>
