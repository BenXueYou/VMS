<template>
  <div class='tablelist'
       ref='tablelist'>
    <div style='height: calc(100vh - 76px - 57px - 60px);'>
      <el-table :data="listTableData"
                border
                style="width: 100%;"
                v-loading='listtableloadding'>

        <el-table-column prop="index"
                         label="序号"
                         width="120">
          <template slot-scope="scope">

            <el-checkbox v-model="scope.row.checked"
                         @change='selectchange'>
              {{("0"+(parseInt(scope.$index)+1)).slice(-2)}}
            </el-checkbox>

          </template>

        </el-table-column>

        <el-table-column v-for='(item,index) in listaa'
                         :key='index'
                         :prop="item.enname"
                         :label="item.name">
          <template slot-scope="scope">
            <span :title='scope.row[item.enname]'>
              {{scope.row[item.enname]}}
            </span>
            <!-- <el-tooltip class="item"
                        effect="dark"
                        content="Left Top 提示文字"
                        placement="left-start">
                  123123123
            </el-tooltip> -->
          </template>
        </el-table-column>

        <!-- <el-table-column prop="staffName"
                         label="姓名"
                         width="140">
        </el-table-column>

        <el-table-column prop="staffsexName"
                         label="性别"
                         width="100">
        </el-table-column>
        <el-table-column prop="credentialno"
                         label="身份证">
        </el-table-column>
        <el-table-column prop="libraryuuidNmae"
                         label="所属库"
                         width="140">
        </el-table-column>
        <el-table-column prop="createtime"
                         label="创建时间">
        </el-table-column> -->

        <el-table-column label="操作">
          <template slot-scope="scope">

            <!-- <el-button @click="lookface(scope.row)"
                       type="text"
                       size="small">
              <i class='el-icon-search'></i>
              查看
            </el-button> -->

            <el-button type="text"
                       size="small"
                       @click='editface(scope.row)'>
              <i class='el-icon-edit-outline'></i>
              查看/编辑</el-button>

            <el-button type="text"
                       size="small"
                       @click='deleteface(scope.row)'>
              <i class='el-icon-delete'></i>
              删除</el-button>

          </template>
        </el-table-column>
      </el-table>

    </div>

    <div class="footer">
      <el-pagination background
                     layout="prev, pager, next"
                     :page-size="listPageSize"
                     :current-page="listPageNow"
                     @current-change='currentChange'
                     :total="listPageCount">
      </el-pagination>

      <p class='totalpagetitle'> 共{{listPageCount}}条</p>

      <div class='tiaozhuan'>
        <span>跳转至</span>
        <el-input class='yeshu'
                  v-model="yeshu"
                  @blur="blur"
                  type='number'>
        </el-input>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "facedblist",
  props: {
    listtableloadding: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    listTableData: {
      type: Array,
      default: function() {
        var num = [];
        return num;
      }
    },
    listtablecolumns: {
      type: Array,
      default: function() {
        var num = [];
        return num;
      }
    },
    selectall: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    listPageNow: {
      type: Number,
      default() {
        return 1;
      }
    },
    listPageSize: {
      type: Number,
      default() {
        return 15;
      }
    },
    listPageCount: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      yeshu: ""
    };
  },
  computed: {
    listaa() {
      var num = [];
      console.log(this.listtablecolumns);
      console.log(this.listTableData);
      for (var i = 0; i < this.listtablecolumns.length; i++) {
        if (this.listtablecolumns[i].enname !== "libraryuuidNmae") {
          num.push(this.listtablecolumns[i]);
        }
      }
      return num;
    }
  },
  mounted() {
    console.log(this.listTableData);
    // this.$nextTick(function() {
    //   var win_h = window.innerHeight;
    //   var tableheight =
    //     parseInt(getComputedStyle(this.$refs.tablelist).height) - 40;
    //   this.listPageSize = Math.floor(tableheight / 43);
    //   //   alert(this.listPageSize);
    // });
  },
  methods: {
    blur() {
      if (this.yeshu !== "") {
        if (this.yeshu > Math.ceil(this.listPageCount / this.listPageSize)) {
          this.yeshu = Math.ceil(this.listPageCount / this.listPageSize);
        }
        this.yeshu = parseInt(this.yeshu);
        this.$emit("changepage", parseInt(this.yeshu));
      }
    },
    lookface(row) {
      this.$emit("lookvip", row.staffUuid);
    },
    editface(row) {
      this.$emit("updatevip", row.staffUuid, row.libraryuuid);
    },
    deleteface(row) {
      this.$emit("deletevip", [row.staffUuid]);
    },

    currentChange(index) {
      this.$emit("changepage", index);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectchange() {
      var flag = this.judgeallchecked();
      this.$emit("checkall", flag);
    },
    judgeallchecked() {
      var flag = true;
      for (var i = 0, len = this.listTableData.length; i < len; i++) {
        if (!this.listTableData[i].checked) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  },
  deactivated() {
    this.listTableData.map(row => {
      row.checked = false;
      return row;
    });
  },
  watch: {
    selectall: function() {
      if (this.selectall) {
        this.listTableData.map(row => {
          row.checked = true;
          return row;
        });
      } else {
        var flag = this.judgeallchecked();
        if (flag) {
          this.listTableData.map(row => {
            row.checked = false;
            return row;
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tablelist {
  height: 100%;
  height: calc(100vh - 76px - 57px - 80px);
}
.footer {
  position: relative;
  .totalpagetitle {
    font-size: 14px;
    color: #fff;
    float: right;
    margin-right: 20px;
    margin-top: 17px;
  }
  .el-pagination {
    margin-right: 180px;
    margin-top: 10px;
    float: right;
  }
  .tiaozhuan {
    position: absolute;
    right: 20px;
    top: 6px;
    span {
      font-size: 14px;
      color: #fff;
      padding-right: 20px;
    }
    .yeshu {
      display: inline-block;
      width: 90px;
      input {
        padding: 0px;
      }
    }
  }
}
</style>

<style  lang="scss">
.tiaozhuan {
  span {
    display: inline-block;
    vertical-align: middle;
  }
  .yeshu {
    display: inline-block;
    width: 90px;
    vertical-align: middle;
    height: 40px;

    .el-input__inner {
      margin-top: 5px;
      width: 50px;
      height: 28px;
      line-height: 28px;
      padding: 0px 5px;
    }
  }
}
</style>
