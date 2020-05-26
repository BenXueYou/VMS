<template>
  <div class="table_wrap">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column type="index" width="50" label="排名"></el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in columns"
        :key="index"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TopTable",
  props: {
    columns: {
      type: Array,
      default() {
        return [
          { prop: "address", label: "地址" },
          { prop: "people", label: "居住人数（次）" },
          { prop: "cross", label: "通行次数（次）" }
        ];
      }
    }
  },
  data() {
    return {
      tableData: [
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 },
        { address: "恒丰路222号地铁站", people: 50, cross: 45 }
      ]
    };
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.table_wrap {
  width: 100%;
  height: 400px;
  /deep/.el-table__row--striped {
    td {
      background: rgba(255, 255, 255, 0.08) !important;
    }
  }
}
</style>
