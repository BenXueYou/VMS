<template>
	<div id="noteaacx" class="wrap">
		<div class="left" :style="{'margin-left':(issuoxiao?-470:0)+'px'}">
			<div class="rightarrow" @click="suoxiao">
				<img :src="rightarrow" :style="{'transform':(issuoxiao?'rotate(180deg)':'rotate(0deg)')}" alt />
			</div>

			<div class="leftHeader">
				<img src="@/assets/facedb/twopeople.png" alt />
				人脸库
			</div>

			<div class="title button-div">
				<el-button type="primary" icon="el-icon-plus" class="addnewdb" @click="addfacedb">新建人像库</el-button>
				<span class="tips">人像库总数：{{tableData.length}} &nbsp;&nbsp;&nbsp;&nbsp; 总人脸数：{{totalrenshu}}</span>
			</div>

			<div class="leftasda">
				<el-table
					:data="tableData"
					border
					ref="multipleTable"
					v-loading="loadding"
					@row-click="selectedRow"
					style="width: 100%"
				>
					<el-table-column prop="libraryName" label="库名称" width="180"></el-table-column>
					<el-table-column prop="libraryNumber" label="人员数量" width="100"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button @click.stop="lookface(scope.row)" type="text" size="small">
								<i class="el-icon-edit-outline"></i>
								编辑
							</el-button>

							<el-button type="text" size="small" @click.stop="openDeleteDialog('deleteface',scope.row)">
								<i class="el-icon-delete"></i>
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="right" :style="{'width': 'calc(100% - '+(issuoxiao?30:500)+'px)'}">
			<div class="rightheader">
				<ul>
					<li>
						<img src="@/assets/facedb/onepeople.png" alt />
						{{libraryname}}
					</li>
					<li>
						<el-checkbox v-model="selectall" @change="selectAll">本页全选</el-checkbox>
					</li>
					<li class="active" @click="addfile">
						<img src="@/assets/facedb/onepeople.png" alt />
						<span>新增</span>
					</li>
					<li class="active" @click="deletefile">
						<img src="@/assets/facedb/onepeople.png" alt />
						<span>删除</span>
					</li>
					<li class="active" @click="exportExcel2">
						<img src="@/assets/facedb/onepeople.png" alt />
						<span>导出</span>
					</li>
					<li class="active" @click="gengxinlishi">
						<img src="@/assets/facedb/onepeople.png" alt />
						<span>更新历史</span>
					</li>
					<li class="active" @click="kugengxin">
						<img src="@/assets/facedb/onepeople.png" alt />
						<span>库更新</span>
					</li>

					<li class="rightoperat button-div">
						<el-input class="searchinput" v-model="staffname" placeholder="请输入关键词搜索"></el-input>
						<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
					</li>
				</ul>
			</div>

			<div class="typeoperator">
				<el-radio v-model="typeradio" @change="changetype" label="TheFaceDBImageTable">图片</el-radio>
				<el-radio v-model="typeradio" @change="changetype" label="TheFaceDBListTable">列表</el-radio>
			</div>

			<div class="dataWrap" ref="dataWrap">
				<!-- 这里面有用了双变量 保存切换视图，保存另一个的状态 -->
				<keep-alive>
					<component
						:is="currentcomponents"
						:selectall="selectall"
						:listPageSize="listPageSize"
						:imagePageSize="imagePageSize"
						:listPageCount="listPageCount"
						:imagePageCount="imagePageCount"
						:listPageNow="listPageNow"
						:imagePageNow="imagePageNow"
						:listTableData="listTableData"
						:imageTableData="imageTableData"
						:listtableloadding="listtableloadding"
						:listtablecolumns="listtablecolumns"
						@lookvip="lookvip"
						@updatevip="editstaff"
						@deletevip="deletevip"
						@checkall="checkall"
						@changepage="changepage"
					></component>
				</keep-alive>
				<!-- <the-face-d-b-image-table
          :style="{display:currentcomponents=='TheFaceDBImageTable'?'block':'none'}"
                    :selectall="selectall"
                     :imagePageSize="imagePageSize"
                     :imagePageCount="imagePageCount"
                     :imagePageNow="imagePageNow"
                     :imageTableData="imageTableData"
                     :listtableloadding="listtableloadding"
                     @lookvip="lookvip"
                     @updatevip="editstaff"
                     @deletevip="deletevip"
                     @checkall="checkall"
                     @changepage='changepage'
        ></the-face-d-b-image-table>

        <the-face-d-b-list-table
              :style="{display:currentcomponents=='TheFaceDBListTable'?'block':'none'}"
                   :selectall="selectall"
                     :listPageSize="listPageSize"
                     :listPageCount="listPageCount"
                     :listPageNow="listPageNow"
                     :listTableData="listTableData"
                     :listtableloadding="listtableloadding"
                     :listtablecolumns="listtablecolumns"
                     @lookvip="lookvip"
                     @updatevip="editstaff"
                     @deletevip="deletevip"
                     @checkall="checkall"
                     @changepage='changepage'
				></the-face-d-b-list-table>-->
			</div>
		</div>

		<!-- 新建人脸库弹窗 -->
		<the-face-d-b-dialog
			:faceDBDialogVisible="faceDBDialogVisible"
			:colorarr="colorarr"
			:shituarr="shituarr"
			:title="newtitle"
			:isaddface="isaddface"
			:updatefacedata="updatefacedata"
			@updatestaffku="updatestaffku"
			@addstaffku="addstaffku"
			@close="faceDBDialogVisible=false"
		></the-face-d-b-dialog>
		<!-- 库更新弹窗 -->
		<the-face-d-b-d-k-dialog
			:faceDBDialogVisible="faceDBDialogDKVisible"
			:libraryarr="libraryarr"
			:libraryuuid="taofanlibraryuuid"
			@getstafflirary="getstafflirary"
			@close="faceDBDialogDKVisible=false"
			@addDaoKuTask="addDaoKuTask"
		></the-face-d-b-d-k-dialog>
		<!-- 更新历史弹窗 -->
		<the-face-d-b-update-history-dialog
			:faceDBDialogVisible="faceDBDialogUpdateHistoryVisible"
			:idtypearr="idtypearr"
			:uploadstatusZnarr="uploadstatusZnarr"
			:libraryname="libraryname"
			:libraryuuid="libraryuuid"
			:realtimeNum="realtimeNum"
			@close="faceDBDialogUpdateHistoryVisible=false"
		></the-face-d-b-update-history-dialog>
		<!-- 增加弹窗 -->
		<the-face-d-b-add
			:faceDBDialogVisible="faceDBDialogAddVisible"
			:libraryarr="libraryarr"
			:libraryuuid="libraryuuid"
			:idtypearr="idtypearr"
			:isUpdate="isUpdate"
			:parentForm="vipinfo"
			:title="addtitle"
			@submitStaff="submitStaff"
			@updatevip="updatevip"
			@getstafflirary="getstafflirary"
			@close="faceDBDialogAddVisible=false"
		></the-face-d-b-add>

		<el-dialog title="提示" width="30%" class="aaaaa" :visible.sync="dialogVisible">
			<p class="mydelete">
				<img src="@/assets/delete.png" alt />
				<span>是否确定删除</span>
			</p>
			<span slot="footer" class="dialog-footer aaaaa">
				<el-button type="primary" @click="deletesurt">确 定</el-button>
				<el-button type="primary" @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 用于导出excel的 -->
		<table
			id="tableExcel"
			style="display:none;"
			width="100%"
			border="1"
			cellspacing="0"
			cellpadding="0"
		>
			<tr>
				<td>序号</td>
				<td>车牌号</td>
				<td>车主</td>
				<td>车闸名称</td>
				<td>进出</td>
				<td>时间</td>
			</tr>
			<tr v-for="(item,index) in exporTableData" :key="index">
				<td>{{item.xuhao}}</td>
				<td>{{item.chepai}}</td>
				<td>{{item.chezhu}}</td>
				<td>{{item.chezha}}</td>
				<td>{{item.jinchu}}</td>
				<td>{{item.shijian}}</td>
			</tr>
		</table>

		<el-dialog class="aaaaasdasd" title="导出模板选择" width="350px" :visible.sync="exportdialogVisible">
			<div style="margin:50px auto;">
				<el-select
					v-model="choosetemplate"
					collapse-tags
					placeholder="请选择"
					style="width:150px;display:block;margin:0px auto;"
					class="myinput"
				>
					<el-option
						v-for="item in templatetypearr"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</div>
			<div style="height:80px;">
				<el-button
					type="primary"
					style="width:120px;display:block;margin:0px auto 30px;"
					@click="sureExport"
				>确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import TheFaceDBDialog from "@/pages/faceModule/views/page/facedb/basic/TheFaceDBDialog";
import TheFaceDBImageTable from "@/pages/faceModule/views/page/facedb/basic/TheFaceDBImageTable";
import TheFaceDBListTable from "@/pages/faceModule/views/page/facedb/basic/TheFaceDBListTable";
import TheFaceDBDKDialog from "@/pages/faceModule/views/page/facedb/basic/TheFaceDBDKDialog";
import TheFaceDBUpdateHistoryDialog from "@/pages/faceModule/views/page/facedb/basic/TheFaceDBUpdateHistoryDialog";
import TheFaceDBAdd from "@/pages/faceModule/views/page/facedb/basic/TheFaceDBAdd";
import * as api from "@/pages/faceModule/api.js";
import { setTimeout } from "timers";
export default {
  name: "faceDB",
  components: {
    TheFaceDBDialog,
    TheFaceDBImageTable,
    TheFaceDBListTable,
    TheFaceDBDKDialog,
    TheFaceDBUpdateHistoryDialog,
    TheFaceDBAdd
  },
  data() {
    return {
      taofanlibraryuuid: "", // 逃犯库的UUID记录
      issuoxiao: false,
      rightarrow: require("@/assets/facedb/rightarrow.png"),
      choosetemplate: "scalper",
      templatetypearr: [],
      exportdialogVisible: false,
      faceDBDialogVisible: false, // 新建人脸库的
      faceDBDialogDKVisible: false,
      faceDBDialogUpdateHistoryVisible: false,
      faceDBDialogAddVisible: false,
      kutotal: 4,
      facetotal: "100万",
      tableData: [],
      selectall: false,
      typeradio: "TheFaceDBImageTable",
      currentcomponents: "TheFaceDBImageTable",
      listPageSize: 15,
      imagePageSize: 24,
      listPageCount: 1000,
      imagePageCount: 1000,
      listPageNow: 1,
      imagePageNow: 1,
      imageTableData: [],
      listTableData: [],
      libraryarr: [],
      staffname: "",
      libraryuuid: "",
      loadding: false, //
      dynamicFlag: false, // 是否是动态库的标识
      listtableloadding: false,
      idtypearr: [], // 证件类型数组
      colorarr: [], // 颜色数组
      shituarr: [], // 视图数组
      isUpdate: false, // false 添加vip true为修改vip
      vipinfo: {}, // 当isUpdate为true 储存编辑人员的信息
      taskNum: [],
      realtimeNum: [], // 实时更新的数据的进度
      addtitle: "添加人脸",
      newtitle: "新建人脸库",
      isaddface: true,
      updatefacedata: {}, // 编辑人员数据库，存储的数据
      dialogVisible: false, // 删除的弹窗。
      deleteWay: "",
      row: "",
      exporTableData: [],
      uploadstatusZnarr: [],
      libraryname: "",
      defaultHeader: require("@/assets/user.png"),
      listtablecolumns: [], // 右边表格，显示哪些数据
      ws: "" // 定义全局的websocket对象
    };
  },
  computed: {
    totalrenshu() {
      return this.tableData.reduce(function(sum, val) {
        return (sum += val.libraryNumber);
      }, 0);
    }
  },
  methods: {
    suoxiao() {
      this.issuoxiao = !this.issuoxiao;
      if (this.issuoxiao) {
        this.$nextTick(() => {
          var el = this.$refs.dataWrap;
          var w = el.offsetWidth;
          this.imagePageSize = 4 * Math.floor(w / 150);
          if (this.typeradio === "TheFaceDBImageTable") {
            this.ajaxdata();
          }
        });
      } else {
        this.$nextTick(() => {
          var el = this.$refs.dataWrap;
          var w = el.offsetWidth;
          this.imagePageSize = 4 * Math.floor(w / 150);
          // this.ajaxdata();
          this.imageTableData.splice(this.imagePageSize, 20000);
        });
      }
    },
    sureExport() {
      var num = [];
      if (this.typeradio === "TheFaceDBImageTable") {
        for (let i = 0, len = this.imageTableData.length; i < len; i++) {
          if (this.imageTableData[i].checked) {
            num.push(this.imageTableData[i].staffUuid);
          }
        }
      } else {
        for (let i = 0, len = this.listTableData.length; i < len; i++) {
          if (this.listTableData[i].checked) {
            num.push(this.listTableData[i].staffUuid);
          }
        }
      }
      this.exportdialogVisible = false;
      if (!num.length) {
        return;
      }
      window.location.href = api.getExcel({
        staffuuidList: num.toString(),
        libraryuuid: this.libraryuuid,
        templatetype: this.choosetemplate
      });
    },
    // 后端导出方法
    exportExcel2() {
      var num = [];
      if (this.typeradio === "TheFaceDBImageTable") {
        for (let i = 0, len = this.imageTableData.length; i < len; i++) {
          if (this.imageTableData[i].checked) {
            num.push(this.imageTableData[i].staffUuid);
          }
        }
      } else {
        for (let i = 0, len = this.listTableData.length; i < len; i++) {
          if (this.listTableData[i].checked) {
            num.push(this.listTableData[i].staffUuid);
          }
        }
      }
      if (!num.length) {
        this.$message.error("未选中人员");
        return;
      }
      this.exportdialogVisible = true;
    },
    // 前端导出方法
    exportExcel() {
      const _this = this;

      var num = [
        {
          xuhao: 1,
          chepai: 2,
          chezhu: 2,
          chezha: 3,
          jinchu: 3,
          shijian: 4
        }
      ];
      _this.exporTableData = num;
      _this.$nextTick(function() {
        var wb = XLSX.utils.table_to_book(
          document.querySelector("#tableExcel")
        );
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "binary"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "1.xls"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      });
    },
    openDeleteDialog(way, row) {
      if (this.dynamicFlag) {
        this.$message.error("不可以删除该库数据");
        return;
      }
      // if(row.libraryuuid=="temp_libraryuuid"){
      //   this.$message.error("不可以删除临时库数据");
      //   return ;
      // }
      this.row = row;
      this.dialogVisible = true;
      this.deleteWay = way;
    },
    deletesurt() {
      this.dialogVisible = false;
      this[this.deleteWay]();
    },
    gettranslate(zidian, value) {
      console.log(zidian);
      console.log(value);
      var str = value;
      for (let i = 0, len = zidian.length; i < len; i++) {
        if (zidian[i].typestr === value) {
          str = zidian[i].typename;
        }
      }
      return str;
    },
    ajaxdata() {
      // 这里发起请求数据，然后更新数据，子组件更新。
      // console.log("请求数据");
      this.selectall = false;
      var pageSize = 1,
        pageNow = 1;
      if (!this.libraryuuid) {
        return;
      }
      if (this.typeradio === "TheFaceDBListTable") {
        pageSize = this.listPageSize;
        pageNow = this.listPageNow;
      } else {
        pageSize = this.imagePageSize;
        pageNow = this.imagePageNow;
      }
      this.listtableloadding = true;
      console.log(`第${pageNow}页，一页${pageSize}条`);
      api
        .queryvipinfo({
          libraryuuid: this.libraryuuid,
          staffname: this.staffname,
          page: pageNow,
          limit: pageSize
        })
        .then(res => {
          this.listtableloadding = false;
          if (this.typeradio === "TheFaceDBListTable") {
            this.listTableData = [];
            this.listPageCount = 0;
          } else {
            this.imageTableData = [];
            this.imagePageCount = 0;
          }
          if (!res.data.data || !res.data.data.list) {
            return;
          }
          var num = [];
          for (let i = 0, len = res.data.data.list.length; i < len; i++) {
            res.data.data.list[i].checked = false;
            if (
              !res.data.data.list[i].photoUri ||
							res.data.data.list[i].isshow === false
            ) {
              res.data.data.list[i].photoUri = this.defaultHeader;
            }
            res.data.data.list[i].checked = false;
            num.push({
              checked: false,
              staffUuid: res.data.data.list[i].staffUuid,
              photoUri: res.data.data.list[i].photoUri,
              staffName: res.data.data.list[i].staffName,
              staffsexName: res.data.data.list[i].staffsexName,
              age: res.data.data.list[i].age,
              credentialno: res.data.data.list[i].credentialno,
              address: res.data.data.list[i].address
            });
          }
          if (this.typeradio === "TheFaceDBListTable") {
            this.listTableData = res.data.data.list;
            this.listPageCount = res.data.data.total;
            for (let i = 0; i < res.data.data.list.length; i++) {
              if (res.data.data.list[i].credentialtype) {
                res.data.data.list[i].credentialtype = this.gettranslate(
                  this.idtypearr,
                  res.data.data.list[i].credentialtype
                );
              }
            }
            this.listTableData.concat();
          } else {
            this.imageTableData = num;
            this.imagePageCount = res.data.data.total;
            this.imageTableData.concat();
            console.log(this.imageTableData);
          }
          if (!res.data.data.list.length) {
            this.$message.success(this.libraryname + "没有数据");
          }
        })
        .catch(err => {
          console.log(err);
          this.listtableloadding = false;
        });
    },
    search() {
      // 点击搜索按钮从而发起请求
      if (this.typeradio === "TheFaceDBListTable") {
        this.listPageNow = 1;
      } else {
        this.imagePageNow = 1;
      }
      this.ajaxdata();
    },
    changepage(index) {
      // 改变页数
      // console.log(index);
      if (this.typeradio === "TheFaceDBListTable") {
        this.listPageNow = index;
      } else {
        this.imagePageNow = index;
      }
      this.ajaxdata();
    },
    checkall(flag) {
      //
      this.selectall = flag;
    },
    selectAll(val) {
      // 选择全部
      this.selectall = val;
    },
    // 新增人脸库
    addfacedb() {
      this.newtitle = "新建人脸库";
      this.isaddface = true;
      this.faceDBDialogVisible = true;
    },
    // 编辑人脸库
    lookface(row) {
      this.newtitle = "编辑人脸库";
      this.isaddface = false;
      api
        .querystaffbyuuid({
          libraryuuid: row.libraryuuid
        })
        .then(res => {
          console.log(res);
          this.updatefacedata = res.data.data;
          this.faceDBDialogVisible = true;
        });
    },
    deleteface() {
      api.deletestaffku(this.row.libraryuuid).then(res => {
        if (res.data.status === 0) {
          this.$message.success("删除成功！");
          this.ajaxdata();
          this.querystafflibrary();
        }
      });
    },
    changetype(val) {
      this.currentcomponents = val;
      this.selectall = false;

      if (
        this.typeradio === "TheFaceDBListTable" &&
				!this.listTableData.length
      ) {
        this.ajaxdata();
      }
      if (this.typeradio === "TheFaceDBImageTable") {
        if (this.issuoxiao) {
          this.$nextTick(() => {
            var el = this.$refs.dataWrap;
            var w = el.offsetWidth;
            var size = this.imagePageSize;
            this.imagePageSize = 4 * Math.floor(w / 150);
            if (
              this.typeradio === "TheFaceDBImageTable" &&
							size !== this.imagePageSize
            ) {
              this.ajaxdata();
            }
          });
        } else {
          if (this.imageTableData.length) {
            this.$nextTick(() => {
              var el = this.$refs.dataWrap;
              var w = el.offsetWidth;
              var size = this.imagePageSize;
              this.imagePageSize = 4 * Math.floor(w / 150);
              this.imageTableData.splice(this.imagePageSize, 20000);
              if (size !== this.imagePageSize) {
              }
            });
          } else {
            this.$nextTick(() => {
              var el = this.$refs.dataWrap;
              var w = el.offsetWidth;
              this.imagePageSize = 4 * Math.floor(w / 150);
              this.ajaxdata();
            });
          }
        }
      }
    },

    kugengxin() {
      this.faceDBDialogDKVisible = true;
    },
    gengxinlishi() {
      this.faceDBDialogUpdateHistoryVisible = true;
    },
    addfile() {
      this.isUpdate = false;
      this.faceDBDialogAddVisible = true;
    },
    exportfile() {},
    deletefile() {
      if (this.dynamicFlag) {
        this.$message.error("不可以删除该库数据");
        return;
      }
      // if (this.libraryuuid === "temp_libraryuuid") {
      //   this.$message.error("不可以删除临时库数据");
      //   return;
      // }
      var num = [];
      if (this.typeradio === "TheFaceDBImageTable") {
        for (let i = 0, len = this.imageTableData.length; i < len; i++) {
          if (this.imageTableData[i].checked) {
            num.push(this.imageTableData[i].staffUuid);
          }
        }
      } else {
        for (let i = 0, len = this.listTableData.length; i < len; i++) {
          if (this.listTableData[i].checked) {
            num.push(this.listTableData[i].staffUuid);
          }
        }
      }
      if (!num.length) {
        this.$message.error("未选中人员");
        return;
      }
      this.deletevip(num);
    },
    addDaoKuTask({ time, data, num, uploader }) {
      if (!this.ws) {
        // alert("建立socket库了！");
        // this.conSocket(); //建立socket,本来想延迟建立socket
      }
      api.addDaoKuTask(data).then(res => {
        console.log(res);
        if (res.data.result === 0) {
          this.taskNum.push({
            time: time,
            num: num,
            uploader: uploader,
            isUpload: false
          });
          console.log(this.taskNum);
          this.faceDBDialogDKVisible = false;
          this.$message.success("任务添加完成，请不要关闭客户端！");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getstafflirary() {
      // 获取到所有的人员库
      // 这边用坐标的表格也可以获取到所有的数据，所以不用在获取一遍
      // 要是以后有左边的表格分页了，就不可以使用这种方法了。
      console.log(this.tableData);
      this.libraryarr = this.tableData;
      // api.querystafflibrarylist().then(res => {
      //   if (res.data && res.data.data) {
      //     this.libraryarr = res.data.data || [];
      //     console.log(this.libraryarr);
      //   }
      // });
    },
    getkucolor() {
      api
        .getIdCardType({
          typegroupstring: "staff_lib_clr"
        })
        .then(res => {
          this.colorarr = res.data.data || [];
        });
    },
    addstaffku(data) {
      const _this = this;
      api.addstaffku(data).then(res => {
        console.log(res);
        if (res.data.result === 0) {
          _this.faceDBDialogVisible = false;
          _this.$message.success("添加人员库成功");
          _this.querystafflibrary();
        }
      });
    },
    updatestaffku(data, libraryuuid) {
      const _this = this;
      api.updatestaffku(data, libraryuuid).then(res => {
        if (res.data.result === 0) {
          _this.faceDBDialogVisible = false;
          _this.$message.success("修改人员库成功");
          _this.querystafflibrary();
        }
      });
    },
    getshitu() {
      api.getshitu().then(res => {
        this.shituarr = res.data.data || [];
      });
    },
    getidtype() {
      api
        .getIdCardType({
          typegroupstring: "credential"
        })
        .then(res => {
          this.idtypearr = res.data.data || [];
        });
    },
    resetall() {
      this.listPageNow = 1;
      this.imagePageNow = 1;
      this.listTableData = [];
      this.imageTableData = [];
    },
    selectedRow(row, event, column) {
      // 当点击左边的列表，右边进行更新
      console.log(document.querySelector(".index"));
      if (document.querySelector(".index")) {
        if (document.querySelector(".index").classList) {
          document.querySelector(".index").classList.remove("index");
        }
      }
      console.log(document.getElementsByClassName("el-table__row")[row.index]);
      if (document.getElementsByClassName("el-table__row")[row.index]) {
        if (
          document.getElementsByClassName("el-table__row")[row.index].classList
        ) {
          document
            .getElementsByClassName("el-table__row")[row.index].classList.add("index");
        }
      }
      // ;

      if (this.libraryuuid !== row.libraryuuid) {
        this.libraryuuid = row.libraryuuid;
        this.libraryname = row.libraryName;
        this.dynamicFlag = row.dynamicFlag;
        console.log(row.columns);
        var columndata = JSON.parse(row.columns);
        var namearr = columndata.name.split(",");
        var namearr2 = columndata.columns.split(",");
        var arr = [];
        for (var k = 0; k < namearr.length; k++) {
          arr.push({
            name: namearr[k],
            enname: namearr2[k]
          });
        }
        this.listtablecolumns = arr;
        this.selectall = false;
        this.resetall();
        this.ajaxdata();
      }
    },
    submitStaff(data) {
      console.log(data);
      api.addvip(data).then(res => {
        console.log(res);

        if (res.data.status === 0) {
          this.$message.success("添加成功！");
          this.isUpdate = false;
          this.faceDBDialogAddVisible = false;
          this.ajaxdata();
          this.querystafflibrary();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    updatevip(data) {
      console.log(data);
      api.updatevip(data).then(res => {
        if (res.data.status === 0) {
          this.$message.success("修改成功！");
          this.isUpdate = false;
          this.faceDBDialogAddVisible = false;
          this.ajaxdata();
          this.querystafflibrary();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    lookvip(uuid) {
      this.addtitle = "添加人脸";
      api
        .queryvip({
          staffUuid: uuid
        })
        .then(res => {
          // console.log("查询到vip用户的详细信息1");
          // console.log(res);
        });
    },
    editstaff(uuid, libraryuuid) {
      // 点击编辑的时候获取人员信息
      if (this.dynamicFlag) {
        this.$message.error("不可以编辑动态库人员");
        return;
      }
      this.addtitle = "修改人脸";
      api
        .queryvip({
          staffUuid: uuid
        })
        .then(res => {
          if (res.data.data) {
            console.log("+++++++++TTTTTTTTTTTTTTTTTTTTTT+++++++++++++++++++");
            console.log(res.data.data);
            this.isUpdate = true;
            res.data.data.photos = res.data.data.photos || [];
            for (let i = 0, len = res.data.data.photos.length; i < len; i++) {
              console.log(res.data.data.photos[i]);
              if (res.data.data.photos[i].isshow === false) {
                res.data.data.photos[i].nowUrl = this.defaultHeader;
              } else {
                res.data.data.photos[i].nowUrl =
									res.data.data.photos[i].photoUri;
              }
            }

            this.vipinfo = res.data.data;
            this.vipinfo.libraryuuid = libraryuuid;
            this.faceDBDialogAddVisible = true;
          } else {
            this.$message.error("获取数据为空!");
          }
        });
    },

    deletevip(uuid) {
      if (this.dynamicFlag) {
        this.$message.error("不可以删除该库人员");
        return;
      }
      this.row = uuid;
      this.dialogVisible = true;
      this.deleteWay = "deleteviprealy";
    },
    deleteviprealy() {
      var uuid = this.row;
      api.deletevip(uuid).then(res => {
        if (res.data.status === 0) {
          this.$message.success("删除成功！");
          this.ajaxdata();
          this.querystafflibrary();
        }
      });
    },
    querystafflibrary(flag = false) {
      const _this = this;
      this.loadding = true;
      api
        .querystaff()
        .then(res => {
          // console.log(res);
          // 这里没有做判断

          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].index = i;
            if (res.data.data[i].libraryName === "逃犯库") {
              this.taofanlibraryuuid = res.data.data[i].libraryuuid;
            }
          }

          this.tableData = res.data.data;
          setTimeout(() => {
            if (document.getElementsByClassName("el-table__row")[0]) {
              if (
                !document.querySelector(".index") &&
								document.getElementsByClassName("el-table__row")[0].classList
              ) {
                document
                  .getElementsByClassName("el-table__row")[0]
                  .classList.add("index");
              }
            }
          }, 10);
          if (res.data && res.data.data.length) {
            if (!this.libraryuuid) {
              this.libraryuuid = res.data.data[0].libraryuuid;
              this.libraryname = res.data.data[0].libraryName;
              console.log("----------------------");
              console.log(res.data.data[0].columns);
              var columndata = JSON.parse(res.data.data[0].columns);
              var namearr = columndata.name.split(",");
              var namearr2 = columndata.columns.split(",");
              var arr = [];
              for (var k = 0; k < namearr.length; k++) {
                arr.push({
                  name: namearr[k],
                  enname: namearr2[k]
                });
              }
              this.listtablecolumns = arr;
            }
            if (flag) {
              this.ajaxdata();
            }
          }
          _this.loadding = false;
        })
        .catch(() => {
          _this.loadding = false;
        });
    },
    conSocket() {
      const _this = this;
      console.log(window.config.socketIP);
      this.ws = new WebSocket(window.config.socketIP);
      this.ws.onopen = function() {};
      // test
      this.ws.onmessage = function(e) {
        console.log("socket有数据过来了!");
        // console.log(typeof e.data);
        // if (typeof e.data !==  "object") {
        //   console.log('456465466')
        //   return;
        // }
        if (!e.data) {
          console.log("暂无消息推送");
        } else {
          try {
            if (
              JSON.parse(e.data) &&
							JSON.parse(e.data).topic === "TOPIC_FILE_UPLOAD_PROCESS"
            ) {
              let data = JSON.parse(JSON.parse(e.data).data);
              console.log(data);
              if (data.socketType === "startStaffImport") {
                var needdata = data.clientImportInfoDTO.allNeedFileNamelist;
                console.log(needdata);
                console.log(_this.taskNum);
                if (needdata.length) {
                  for (var j = 0; j < _this.taskNum.length; j++) {
                    if (
                      _this.taskNum[j].isUpload === false &&
											_this.taskNum[j].time ===
												data.clientImportInfoDTO.filepath
                    ) {
                      // 去除需要上传的文件

                      for (let i = 0; i < _this.taskNum[j].num.length; i++) {
                        var flag = false;
                        for (var k = 0; k < needdata.length; k++) {
                          if (_this.taskNum[j].num[i].name === needdata[k]) {
                            flag = true;
                            break;
                          }
                        }
                        if (!flag) {
                          _this.taskNum[j].uploader.removeFile(
                            _this.taskNum[j].num[i].id
                          );
                        } else {
                          console.log(
                            "-------------------------" +
															_this.taskNum[j].num[i].name
                          );
                        }
                      }
                      console.log("找到相同时间戳的任务了，我要开始上传了。");
                      _this.taskNum[j].uploader.start();
                      _this.taskNum[j].isUpload = true;
                      break;
                    }
                  }
                } else {
                  // console.log("上传完毕，调用分析接口");
                  // api.fenxi().then(res => {});
                }
              } else if ((data.socketType === " staffImportProcess")) {
                // var data = data.clientImportInfoDTO;
                // var needdata = data.allNeedFileNamelist;
                // if (data.progress === 0.33 && !needdata.length) {
                //   console.log("上传完毕，调用分析接口");
                //   api.fenxi().then(res => {});
                // }

                _this.querystafflibrary();
                _this.realtimeNum.push({
                  progress: data.progress,
                  taskuuid: data.taskuuid,
                  status: data.status
                });
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      };
      this.ws.onclose = function() {
        console.log("socket关闭了");
      };
    }
  },
  mounted() {
    this.templatetypearr = window.face.kutemplate;
    this.$nextTick(function() {
      this.getidtype(); // 获取证件类型
      this.getkucolor(); // 获取颜色和库
      this.getshitu(); // 获取视图
      var el = this.$refs.dataWrap;
      var w = el.offsetWidth;
      var h = el.offsetHeight;
      this.imagePageSize = 4 * Math.floor(w / 150);
      this.listPageSize = Math.floor((h - 50) / 43);
    });
    api
      .gettranslateword({
        typegroupstring: "staff_i_status"
      })
      .then(res => {
        if (res.data && res.data.data) {
          this.uploadstatusZnarr = res.data.data || [];
        }
      });

    // alert('mounted');
  },
  activated() {
    if (this.listTableData.length || this.imageTableData.length) {
      this.querystafflibrary(false); // 如果有数据就不用在请求一次了。
    } else {
      this.querystafflibrary(true);
    }
    this.getidtype(); // 获取证件类型
    this.getkucolor(); // 获取颜色和库
    this.getshitu(); // 获取视图

    // alert('activeted');
    // this.querystafflibrary(true);
    // this.getidtype(); //获取证件类型
    // this.getkucolor(); //获取颜色和库
    // this.getshitu(); //获取视图
    this.conSocket(); // 建立socket
  },
  deactivated() {
    if (this.ws) {
      this.ws.close();
      this.ws = "";
    }
  },
  destroyed() {
    // alert('destroyed')
    // this.ws.close();
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
#noteaacx {
	.el-checkbox__label {
		color: rgba(255, 255, 255, 0.8);
	}
	.aaaaa {
		.mydelete {
			text-align: center;
			font-size: 0px;
			line-height: 150px;
			img {
				display: inline-block;
				vertical-align: middle;
			}

			span {
				display: inline-block;
				font-family: " PingFangSC-Regular";
				font-size: 16px;
				color: #ffffff;
				letter-spacing: 0;
				padding-left: 30px;
				vertical-align: middle;
			}
		}
		.el-dialog__footer {
			text-align: center;
		}
		.el-dialog {
			height: 300px;
		}
	}
}
</style>
