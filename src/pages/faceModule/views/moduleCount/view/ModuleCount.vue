<template>
  <div class="main-block">
    <module-details :isShow="isShowDetail"
                    @onCancel="onCancelDetail"
                    @onConfirm="onConfirmDetail" />
    <div class="main-container">
      <div class="search">
        <div class="search-input">
          <span>抓拍设备：</span>
          <elPopverTree :channelInfoList="deviceList"
                        :elPopoverClass="faceRecordPopoverClass"
                        :checkedChannelKeys="checkedChannelKeys"
                        @transferCheckedChannel="transferCheckedChannel"
                        inputWidth="220px"
                        @show="popverShow"
                        @hide="popverHidden"></elPopverTree>
          <span class="left-space">人脸库：</span>
          <el-select style="width: 160px;"
                     v-model="faceDataBase"
                     clearable
                     size="small">
            <el-option v-for="item in faceDataBaseOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
          <span class="left-space">相似度不低于：</span>
          <el-input v-model="num"
                    type="number"
                    style="width: 55px;"></el-input>
          <span class="left-space">时段：</span>
          <el-date-picker v-model="startTime"
                          type="datetime"
                          style="width: 13%;"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span class="line">—</span>
          <el-date-picker v-model="endTime"
                          type="datetime"
                          style="width: 13%"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </div>
        <div class="search-input">
          <span>抓拍总数：</span>
          <el-select style="width: 60px;"
                     v-model="faceDataBase"
                     clearable
                     size="small">
            <el-option v-for="item in faceDataBaseOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
          <el-input v-model="num"
                    type="number"
                    style="width: 60px;margin: 0 8px;"></el-input>
          <span>次</span>
          <span class="left-space">至少有抓拍设备数量：</span>
          <el-input v-model="num"
                    type="number"
                    style="width: 60px;margin: 0 8px;"></el-input>
          <span>个</span>
          <span class="left-space">人脸抓拍图片质量：</span>
          <pic-qulity-select @onSelect="onSelectPicQul" />
          <span class="left-space">抓拍间隔时间：</span>
          <el-input v-model="num"
                    type="number"
                    style="width: 60px;margin: 0 8px;"></el-input>
          <span>秒</span>
          <div class="search-btn">
            <el-button @click="queryAct"
                       icon="el-icon-search"
                       type="primary"
                       style="width: 80px"
                       size="small">查询</el-button>
            <el-button @click="reset"
                       type="primary"
                       style="width: 80px"
                       size="small">重置</el-button>
          </div>
        </div>
      </div>
      <div class="result">
        <div class="result-title">
          <el-radio-group v-model="typeRadio"
                          @change="handleTypeChange">
            <el-radio label="picture">图片</el-radio>
            <el-radio label="table">列表</el-radio>
          </el-radio-group>
        </div>
        <div class="list-picture"
             v-if="typeRadio === 'picture'">
          <template v-for="(item, index) in moduleList">
            <div :key="index"
                 class="list-item">
              <img :src="$common.setPictureShow(item.pictureUrl)"
                   width="95%"
                   height="120px"
                   class="img-fill">
              <div class="info-other">
                <div class="other-span">{{`在${item.devList.length}个抓拍设备出现${item.times}次`}}</div>
                <div class="other-span">{{item.name}}&nbsp;&nbsp;{{item.dataBase}}</div>
              </div>
            </div>
          </template>
        </div>
        <div class="list-table"
             v-else>
          <el-table :data="moduleList"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="60">
            </el-table-column>
            <el-table-column label="抓拍摄像机"
                             show-overflow-tooltip
                             width="360">
              <template slot-scope="scope">
                {{showCamera(scope.row)}}
              </template>
            </el-table-column>
            <el-table-column prop="times"
                             label="抓拍总数"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name"
                             label="人员姓名"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="dataBase"
                             label="所属库"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="startTime"
                             label="开始时间">
            </el-table-column>
            <el-table-column prop="endTime"
                             label="结束时间">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="detail-icon">
                  <el-button @click="lookDetail(scope.row)"
                             type="text"
                             size="small">
                    查看
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :page-size="pageInfo.pageSize"
                         :current-page="pageInfo.currentPage"
                         @current-change='handleCurrentChange'
                         :total="pageInfo.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";
import PicQulitySelect from "@/common/PicQulitySelect";
import ModuleDetails from "@/pages/faceModule/views/moduleCount/components/ModuleDetails";

export default {
  components: {
    ElPopverTree,
    PicQulitySelect,
    ModuleDetails
  },
  props: {},
  data() {
    return {
      startTime: "",
      endTime: "",
      faceDataBase: "",
      faceDataBaseOptions: [],
      num: 80,
      typeRadio: "picture",
      moduleList: [
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        },
        {
          pictureUrl: "",
          devList: [
            {
              name: "设备1"
            },
            {
              name: "设备2"
            },
            {
              name: "设备3"
            }
          ],
          times: 90,
          name: "程某某",
          dataBase: "员工库",
          startTime: "2019-12-25 12:00:00",
          endTime: "2019-12-25 12:00:00"
        }
      ],
      pageInfo: {
        total: 0,
        pageSize: 12,
        currentPage: 1
      },
      deviceList: [],
      faceRecordPopoverClass: "faceRecordPopoverClass",
      checkedChannelKeys: [],
      channelUuids: [],
      isShowDetail: false
    };
  },
  created() {},
  activated() {},
  mounted() {},
  methods: {
    handleCurrentChange() {},
    handleTypeChange(val) {
      console.log(val);
    },
    search() {},
    getChannelUuids() {},
    transferCheckedChannel(checkedChannel) {
      this.channelUuids = [];
      if (!checkedChannel || checkedChannel.length === 0) {
        this.getChannelUuids(this.deviceList);
      } else {
        for (var i = 0; i < checkedChannel.length; i++) {
          this.channelUuids.push(checkedChannel[i].id);
        }
      }
    },
    popverShow() {},
    popverHidden() {},
    onSelectPicQul(val) {
      console.log("onSelectPicQul: ", val);
    },
    queryAct() {},
    reset() {},
    showCamera(row) {
      let camStr = "";
      row.devList.forEach((v, i) => {
        if (i === 0) {
          camStr = v.name;
        } else {
          camStr = camStr + "，" + v.name;
        }
      });
      return camStr;
    },
    lookDetail(row) {
      this.isShowDetail = true;
    },
    onConfirmDetail() {
      this.isShowDetail = false;
    },
    onCancelDetail() {
      this.isShowDetail = false;
    }
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<style>
.faceRecordPopoverClass {
  width: 380px;
  height: 230px;
  position: absolute;
  background: #202127;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-block {
  padding: 1.6%;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .main-container {
    padding: 1.8% 3%;
    box-sizing: border-box;
    background: #212325;
    width: 100%;
    height: 100%;
    .search {
      height: 120px;
      width: 100%;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      .search-input {
        height: 50%;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #ffffff;
        .left-space {
          margin-left: 6%;
        }
        .line {
          color: rgba($color: #ffffff, $alpha: 0.15);
          margin: 0 2px;
        }
        .search-btn {
          margin-left: auto;
          margin-right: 0;
        }
      }
    }
    .result {
      padding: 20px 0;
      box-sizing: border-box;
      height: 85%;
      .result-title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ffffff;
      }
      .list-picture {
        height: 89%;
        overflow-y: auto;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        .list-item {
          width: 142px;
          height: 180px;
          background: rgba($color: #000000, $alpha: 0.1);
          border: 1px solid #2a2c2e;
          margin-right: 14px;
          margin-bottom: 10px;
          padding: 10px 5px 0 5px;
          box-sizing: border-box;
          .info-other {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #dddddd;
            letter-spacing: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            .other-span {
              margin-bottom: 2px;
            }
          }
        }
      }
      .list-table {
        height: 89%;
        overflow-y: auto;
      }
      .footer {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
