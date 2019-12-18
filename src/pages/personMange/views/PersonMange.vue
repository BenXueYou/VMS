<template>
  <div class="personMange"
       id="personMange">
    <the-leftmenu @changetab="changetab"
                  ref="leftMenu"
                  @clickNode="clickNodeAll"
                  needType
                  tagType="staff"
                  orgType="staff"
                  style="margin-right: 30px"></the-leftmenu>
    <div class="rightmenu"
         v-loading="mainListLoading1"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <div v-show="isOrganiza">
        <div class="listForm"
             v-show="isListForm"
             @click.stop="isOtherSearch=false">
          <div class="head">
            <div class="title">{{viewGroupName}}&nbsp;&nbsp;({{totalStaff}})</div>
            <div class="carte">
              <div @click="changeLeftMenu('1')"
                   style="cursor:pointer;">
                <img src="./../../../assets/images/personMange/edit.png" />
                <span>修改名称</span>
              </div>
              <div @click="changeLeftMenu('2')"
                   style="cursor:pointer;">
                <img src="./../../../assets/images/personMange/add.png" />
                <span>添加子部门</span>
              </div>
              <div @click="setApartmentLeader"
                   style="cursor:pointer;">
                <img src="./../../../assets/images/personMange/set.png" />
                <span>设置上级</span>
              </div>
            </div>
          </div>
          <div class="listWrap">
            <div class="bthWrap">
              <div class="left">
                <el-button style="width: 90px;"
                           @click="addEditMembers=true,isListForm=false,newPersonList(),addEditMember='add'">添加成员</el-button>
                <el-button style="width: 90px;"
                           @click="importDialog=true">批量导入</el-button>
                <el-button style="width: 90px;"
                           @click="exportDialog=true">批量导出</el-button>
                <el-button style="width: 110px;"
                           @click="getMsgToDeviceDialogVisiable=!getMsgToDeviceDialogVisiable">设置所在部门</el-button>
                <el-button style="width: 80px;"
                           @click="peopleStatistics">统计</el-button>
                <el-button style="width: 80px;"
                           @click="deleteDialog=true">删除</el-button>
              </div>
              <div class="right">
                <span class="sp">姓名：</span>
                <el-input style="width: 160px;height: 32px;margin-right: 10px;"
                          v-model="searchName"></el-input>
                <el-button style="width: 80px;"
                           class="search"
                           @click="isOtherSearch=false,clearSearchInfo(),clickNodeList()">
                  <img src="./../../../assets/images/personMange/search.png" />检索
                </el-button>
                <div class="otherSearch"
                     @click.stop="isOtherSearch=true">
                  <el-button style="width: 110px;"
                             @click.stop="clearSearchInfo(),isOtherSearch=!isOtherSearch">其他检索条件</el-button>
                  <div class="conditionWrap"
                       v-show="isOtherSearch">
                    <div class="infoWrap">
                      <div class="left">性别：</div>
                      <div class="right">
                        <el-select v-model="searchSexVal"
                                   style="width: 120px;">
                          <el-option v-for="item in sexArr"
                                     :key="item.typeStr"
                                     :label="item.typeName"
                                     :value="item.typeStr"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left">创建时间：</div>
                      <div class="right">
                        <el-date-picker v-model="searchStartTime"
                                        type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        style="width: 120px;"></el-date-picker>
                        <span style="margin: 0 6px; color: rgba(255,255,255,0.15);">-</span>
                        <el-date-picker v-model="searchEndTime"
                                        type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        style="width: 120px;"></el-date-picker>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left">手机：</div>
                      <div class="right">
                        <el-input style="width: 160px;height: 30px;"
                                  v-model="searchPhone"></el-input>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left">部门：</div>
                      <div class="right">
                        <el-input style="width: 160px;height: 30px;"
                                  v-model="searchApartment"></el-input>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left"></div>
                      <div class="right">
                        <el-button style="width: 66px;"
                                   @click.stop="clickNodeList(),isOtherSearch=false">检索</el-button>
                        <span class="reset"
                              @click="clearSearchInfo">重置</span>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button style="width: 100px;"
                           class="switch"
                           @click="isTableStyle=false,getImageList()">
                  <img src="./../../../assets/images/personMange/switch.png" />切换视图
                </el-button>
              </div>
            </div>
            <div class="tableWrap">
              <el-table ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange1">
                <el-table-column type="selection"
                                 width="55"></el-table-column>
                <el-table-column prop="staffName"
                                 label="姓名"
                                 width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="orgName"
                                 label="部门"
                                 width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="性别"
                                 width="80">
                  <template slot-scope="scope">
                    <div>
                      <span v-if="scope.row.gender==='male'">男</span>
                      <span v-if="scope.row.gender==='female'">女</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="cellphone"
                                 label="手机"
                                 show-overflow-tooltip
                                 width="180"></el-table-column>
                <el-table-column prop="fixedLine"
                                 label="座机"
                                 show-overflow-tooltip
                                 width="150"></el-table-column>
                <el-table-column prop="netStatus"
                                 label="凭证"
                                 show-overflow-tooltip
                                 width="220">
                  <template slot-scope="scope">
                    <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
                      <span style="display: flex;flex-direction: row;align-items: center;">
                        <img v-if="scope.row.voucher.faceNum!==0"
                             src="./../../../assets/images/personMange/face.png"
                             style="margin-right: 10px" />
                        <img v-if="scope.row.voucher.faceNum===0"
                             src="./../../../assets/images/personMange/faceFade.png"
                             style="margin-right: 10px" />
                        <!-- {{scope.row.voucher.faceNum}} -->
                      </span>
                      <span style="margin: 0 15px 0 7px;display: flex;flex-direction: row;align-items: center;">
                        <img v-if="true"
                             src="./../../../assets/images/personMange/fingerprint.png"
                             style="margin:0 10.2px 0 13px;" />
                        {{scope.row.voucher.fingerprintNum}}
                      </span>
                      <span style="display: flex;flex-direction: row;align-items: center;">
                        <img v-if="true"
                             src="./../../../assets/images/personMange/card.png"
                             style="margin-right: 11.5px" />
                        {{scope.row.voucher.cardNum}}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime"
                                 label="创建时间"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作"
                                 width="200">
                  <template slot-scope="scope">
                    <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
                      <span style="cursor:pointer;font-family: PingFangSC-Regular;font-size: 13px;color: #26D39D;display: flex;flex-direction: row;align-items: center;"
                            @click="viewSingleDetail(scope.row)">
                        <img src="./../../../assets/images/personMange/detail.png"
                             style="margin-right: 5.9px" />详情
                      </span>
                      <span style="cursor:pointer;font-family: PingFangSC-Regular;font-size: 13px;color: #26D39D;margin: 0 22px;"
                            @click="editPersonSingle(scope.row)">编辑</span>
                      <span style="cursor:pointer;font-family: PingFangSC-Regular;font-size: 13px;color: #FF5F5F;"
                            @click="deletePersonSingle(scope.row)">删除</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="imageForm"
             style="min-width: 950px;"
             v-show="isImageForm"
             @click.stop="isOtherSearch=false">
          <div class="head">
            <div class="title">{{viewGroupName}}&nbsp;&nbsp;({{totalStaff}})</div>
            <div class="carte">
              <div @click="changeLeftMenu('1')">
                <img src="./../../../assets/images/personMange/edit.png" />
                <span>修改名称</span>
              </div>
              <div @click="changeLeftMenu('2')">
                <img src="./../../../assets/images/personMange/add.png" />
                <span>添加子部门</span>
              </div>
              <div @click="setApartmentLeader">
                <img src="./../../../assets/images/personMange/set.png" />
                <span>设置上级</span>
              </div>
            </div>
          </div>
          <div class="listWrap">
            <div class="bthWrap">
              <div class="left">
                <el-button style="width: 90px;"
                           @click="addEditMembers=true,isImageForm=false,newPersonList(),addEditMember='add'">添加成员</el-button>
                <el-button style="width: 90px;"
                           @click="importDialog=true">批量导入</el-button>
                <el-button style="width: 90px;"
                           @click="exportDialog=true">批量导出</el-button>
                <el-button style="width: 110px;"
                           @click="getMsgToDeviceDialogVisiable=!getMsgToDeviceDialogVisiable">设置所在部门</el-button>
                <el-button style="width: 80px;"
                           @click="peopleStatistics">统计</el-button>
                <el-button style="width: 80px;"
                           @click="deleteDialog=true">删除</el-button>
              </div>
              <div class="right">
                <div class="otherSearch"
                     @click.stop="isOtherSearch=true">
                  <el-button style="width: 100px;"
                             class="search">
                    <img src="./../../../assets/images/personMange/search.png"
                         @click.stop="isOtherSearch=!isOtherSearch" />人员检索
                  </el-button>
                  <div class="conditionWrap"
                       v-show="isOtherSearch">
                    <div class="infoWrap">
                      <div class="left">性别：</div>
                      <div class="right">
                        <el-select v-model="searchSexVal"
                                   style="width: 120px;">
                          <el-option v-for="item in sexArr"
                                     :key="item.typeStr"
                                     :label="item.typeName"
                                     :value="item.typeStr"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left">创建时间：</div>
                      <div class="right">
                        <el-date-picker v-model="searchStartTime"
                                        type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        style="width: 120px;"></el-date-picker>
                        <span style="margin: 0 6px; color: rgba(255,255,255,0.15);">-</span>
                        <el-date-picker v-model="searchEndTime"
                                        type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        style="width: 120px;"></el-date-picker>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left">手机：</div>
                      <div class="right">
                        <el-input style="width: 160px;height: 30px;"
                                  v-model="searchPhone"
                                  maxlength="11"></el-input>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left">部门：</div>
                      <div class="right">
                        <el-input style="width: 160px;height: 30px;"
                                  v-model="searchApartment"></el-input>
                      </div>
                    </div>
                    <div class="infoWrap">
                      <div class="left"></div>
                      <div class="right">
                        <el-button style="width: 66px;"
                                   @click="clickNodeList(),isOtherSearch=false">检索</el-button>
                        <span class="reset"
                              @click="clearSearchInfo">重置</span>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button style="width: 100px;"
                           class="switch"
                           @click="isTableStyle=true,getFormList()">
                  <img src="./../../../assets/images/personMange/switch.png" />切换视图
                </el-button>
              </div>
            </div>
            <div class="tableWrap">
              <div class="selectWrap">
                <el-checkbox v-model="seleactAll"
                             @change="checkedAllChange">本页全选</el-checkbox>
              </div>
              <div class="inforWrap">
                <div class="singleCell"
                     id="singleCell"
                     v-for="(o, index) in tableData"
                     :key="index"
                     @mouseover.stop="idx = index, isOperationMask=true"
                     @mouseleave.stop="isOperationMask=false">
                  <el-checkbox class="box"
                               v-model="o.checked"
                               @change="checkBoxChange(tableData[tableData.length-index-1])"></el-checkbox>
                  <img :src="tableData.length>index?(tableData[tableData.length-index-1].photoUri?WIamgeurl + tableData[tableData.length-index-1].photoUri:require('@/assets/images/user.png')):require('@/assets/images/user.png')"
                       class="mainImg"
                       id="mainImg" />
                  <div style="height: 16px">
                    {{tableData.length>index?tableData[tableData.length-index-1].staffName:"姓名"}}
                    <span v-if="tableData.length>index">
                      <span v-if="tableData[tableData.length-index-1].gender=='male'">男</span>
                      <span v-if="tableData[tableData.length-index-1].gender=='female'">女</span>
                    </span>
                    <span v-if="tableData.length<=index">性别</span>
                    {{tableData.length>index?tableData[tableData.length-index-1].orgName:"部门"}}
                  </div>
                  <div style="height: 16px">{{tableData.length>index?tableData[tableData.length-index-1].cellphone:"手机"}}</div>
                  <div style="height: 16px">{{tableData.length>index?tableData[tableData.length-index-1].fixedLine:"座机"}}</div>
                  <div class="operationMask"
                       v-if="isOperationMask&idx == index">
                    <div @click.stop="isOperationMask=false,viewSingleDetail(tableData[tableData.length-index-1])">
                      <img src="./../../../assets/images/personMange/detail1.png" />
                      <span>详情</span>
                    </div>
                    <div @click.stop="isOperationMask=false,editPersonSingle(tableData[tableData.length-index-1])">
                      <img src="./../../../assets/images/personMange/edit.png" />
                      <span>编辑</span>
                    </div>
                    <div @click.stop="isOperationMask=false,deletePersonSingle(tableData[tableData.length-index-1])">
                      <img src="./../../../assets/images/personMange/delete1.png" />
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="addMembers"
             id="addMembers"
             v-show="addEditMembers"
             @click.stop="isAccessChoose=false,isAccessChoose1=false"
             style="min-width: 1200px;">
          <el-scrollbar style="width: 64%;height: 100%">
            <div style="width: 100%;background: #212325;padding: 0 44px;box-sizing: border-box;overflow: hidden;">
              <div class="title">
                <div class="text">
                  <span></span>
                  <span v-show="addEditMember==='add'">添加成员</span>
                  <span v-show="addEditMember==='edit'">编辑员工</span>
                </div>
                <div class="btnWrap">
                  <el-button style="width: 120px;"
                             @click="addPersonMember('continue')"
                             v-show="addEditMember==='add'">保存并继续添加</el-button>
                  <el-button style="width: 80px;"
                             @click="addEditPerson()">确认</el-button>
                  <el-button style="width: 80px;margin-right: 15px;"
                             @click="closeAddEdit">取消</el-button>
                </div>
              </div>
              <div class="requireInfo">
                <div class="photoWrap infoWrap">
                  <div class="left">
                    <div class="leftCon">
                      <el-upload class="upload-multiple"
                                 :action="frontPhotoUrl"
                                 accept="image/jpg,image/jpeg"
                                 :headers="myHeaders"
                                 :show-file-list="false"
                                 :auto-upload="true"
                                 :http-request="httpRequest"
                                 :on-change="changeFile">
                        <div class="uploadWrap">
                          <div class="first imgWrap">
                            <img src="./../../../assets/images/personMange/localPhoto.png" />
                            <span>本地</span>
                          </div>
                          <div class="imgWrap"
                               @click.stop="shootPhoto">
                            <img src="./../../../assets/images/personMange/shootPhoto.png" />
                            <span>拍摄</span>
                          </div>
                        </div>
                      </el-upload>
                      <div class="alreadyUploaded"
                           v-show="frontUploaded">
                        <img :src="frontPhoto" />
                        <div class="delete"
                             @click="deleteUpload"></div>
                      </div>
                    </div>
                  </div>
                  <div class="right1">
                    <div>
                      <el-input style="width: 120px;height: 32px;margin-right: 10px;"
                                placeholder="姓名"
                                v-model="staffName"></el-input>
                      <span>*</span>
                    </div>
                    <div>
                      <el-radio v-model="sexVal"
                                label="male">男</el-radio>
                      <el-radio v-model="sexVal"
                                label="female">女</el-radio>
                    </div>
                    <div>
                      <el-input style="width: 220px;height: 32px;margin-right: 10px;"
                                placeholder="手机号"
                                v-model="phoneNum"
                                maxlength="11"></el-input>
                    </div>
                  </div>
                </div>
                <div class="infoWrap"
                     style="height: auto;">
                  <div class="left">部门：</div>
                  <div class="right apartment">
                    <div class="cellComponet"
                         v-for="(item,index) in checkedNode5"
                         :key="index"
                         style="margin-right: 10px;">
                      <img src="./../../../assets/images/personMange/document.png" />
                      <el-popover placement="top-start"
                                  title="标题"
                                  width="200"
                                  trigger="hover"
                                  :content="item.label">
                        <span slot="reference"
                              style=" white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 60px;display: block;">{{item.label}}</span>
                      </el-popover>
                      <div class="delete"
                           @click="deleteAprtment(index,item)"></div>
                    </div>
                    <div class="edit"
                         @click="getMsgToDeviceDialogVisiable5=!getMsgToDeviceDialogVisiable5">
                      <img src="./../../../assets/images/personMange/edit.png" />
                      <span v-show="addEditMember==='edit'">修改</span>
                      <span v-show="addEditMember==='add'">新增</span>
                    </div>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">职务：</div>
                  <div class="right">
                    <el-input style="width: 120px;height: 32px;"
                              v-model="duty"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left"></div>
                  <div class="right">
                    <el-radio v-model="staffInfo"
                              label="0">普通员工</el-radio>
                    <el-radio v-model="staffInfo"
                              label="1">上级</el-radio>
                  </div>
                </div>
                <div class="infoWrap"
                     style="height: auto;"
                     v-show="staffInfo=='1'">
                  <div class="left">负责部门：</div>
                  <div class="right apartment">
                    <el-select v-model="leaderOrgUuid"
                               multiple
                               collapse-tags
                               placeholder="请选择部门">
                      <el-option v-for="item in checkedNode5"
                                 :key="item.id"
                                 :label="item.label"
                                 :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="infoWrap"
                     style="height: auto;margin-bottom: 50px;position: relative;">
                  <div class="left">标签：</div>
                  <div class="right apartment">
                    <div class="cellComponet"
                         v-for="(item,index) in checkedNode2"
                         :key="index"
                         style="margin-right: 10px;">
                      <img src="./../../../assets/images/personMange/document.png" />
                      <span>{{item.label}}</span>
                      <div class="delete"
                           @click="deleteAddCell(index,item)"></div>
                    </div>
                    <div class="edit"
                         @click="addMsgToDeviceDialogVisiable=!addMsgToDeviceDialogVisiable">
                      <img src="./../../../assets/images/personMange/edit.png" />
                      <span v-show="addEditMember==='edit'">修改</span>
                      <span v-show="addEditMember==='add'">新增</span>
                    </div>
                  </div>
                  <div class="more"
                       v-show="isAdditional"
                       @click="isAdditional=false"
                       style="top: 20px;">
                    <span>收起</span>
                    <img src="./../../../assets/images/personMange/more.png" />
                  </div>
                  <div class="more"
                       v-show="!isAdditional"
                       @click="isAdditional=true"
                       style="top: 20px;">
                    <span>展开</span>
                    <img src="./../../../assets/images/personMange/more.png" />
                  </div>
                </div>
              </div>
              <div class="additionalInfo"
                   v-show="isAdditional">
                <div class="infoWrap">
                  <div class="left">别名：</div>
                  <div class="right">
                    <el-input style="width: 120px;height: 30px;margin-right: 10px;"
                              v-model="nickName"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">证件类型：</div>
                  <div class="right">
                    <el-select v-model="idType"
                               placeholder="请选择"
                               style="width: 120px;">
                      <el-option v-for="item in idTypeArr"
                                 :key="item.typeStr"
                                 :label="item.typeName"
                                 :value="item.typeStr"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">证件号码：</div>
                  <div class="right">
                    <el-input style="width: 200px;height: 30px;margin-right: 10px;"
                              v-model="idNumber"
                              placeholder="证件号码"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">民族：</div>
                  <div class="right">
                    <el-select v-model="nation"
                               placeholder="请选择"
                               style="width: 120px;">
                      <el-option v-for="item in nationArr"
                                 :key="item.typeStr"
                                 :label="item.typeName"
                                 :value="item.typeStr"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">文化程度：</div>
                  <div class="right">
                    <el-select v-model="degree"
                               placeholder="学历"
                               style="width: 120px;">
                      <el-option v-for="item in degreeArr"
                                 :key="item.typeStr"
                                 :label="item.typeName"
                                 :value="item.typeStr"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">婚姻状况：</div>
                  <div class="right">
                    <el-select v-model="marital"
                               style="width: 120px;">
                      <el-option v-for="item in maritalArr"
                                 :key="item.typeStr"
                                 :label="item.typeName"
                                 :value="item.typeStr"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">国籍：</div>
                  <div class="right">
                    <el-select v-model="nationality"
                               style="width: 120px;">
                      <el-option v-for="item in nationalityArr"
                                 :key="item.typeStr"
                                 :label="item.typeName"
                                 :value="item.typeStr"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">籍贯：</div>
                  <div class="right">
                    <el-input style="width: 200px;height: 30px;margin-right: 10px;"
                              v-model="nativePlace"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">户籍：</div>
                  <div class="right">
                    <el-input style="width: 200px;height: 30px;margin-right: 10px;"
                              v-model="censusRegister"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">电子邮件：</div>
                  <div class="right">
                    <el-input style="width: 200px;height: 30px;margin-right: 10px;"
                              v-model="email"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">座机：</div>
                  <div class="right">
                    <el-input style="width: 200px;height: 30px;margin-right: 10px;"
                              v-model="telephone"></el-input>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">备注：</div>
                  <div class="right">
                    <el-input style="width: 200px;height: 30px;margin-right: 10px;"
                              v-model="remark"></el-input>
                  </div>
                </div>
              </div>
              <div class="accessCon1"
                   style="margin-bottom: 20px;">
                <div class="accessTitle">
                  <img src="./../../../assets/images/personMange/passAcces.png" />
                  <span>通行权限</span>
                </div>
                <div class="infoWrap">
                  <div class="left">门禁权限组：</div>
                  <div class="right">
                    <div style="width: 260px;position: relative;">
                      <div class="chooseMask"
                           @click.stop="isAccessChoose=!isAccessChoose,isAccessChoose1=false"></div>
                      <el-input v-model="doorAccess"
                                placeholder="请选择门禁权限"
                                style="width: 260px;"
                                disabled></el-input>
                    </div>
                    <div class="accessChoose"
                         v-show="isAccessChoose"
                         @click.stop="isAccessChoose=true">
                      <!-- <div class="wrap">
                        <div class="chooseWrap"><el-checkbox>权限组</el-checkbox></div>
                        <div class="chooseWrap"><el-checkbox>权限组</el-checkbox></div>
											</div>-->
                      <div style="position: relative;">
                        <el-scrollbar style="height: 315px">
                          <el-tree ref="tree2"
                                   class="filter-tree"
                                   :data="data2"
                                   :props="defaultProps1"
                                   default-expand-all
                                   :filter-node-method="filterNode1"
                                   show-checkbox
                                   :expand-on-click-node="false"
                                   :default-checked-keys="InitnickName()"
                                   @check-change="handleCheckChange"
                                   node-key="groupUuid"></el-tree>
                        </el-scrollbar>
                        <el-input placeholder="输入关键字检索"
                                  v-model="filterText"
                                  class="filterText1"></el-input>
                        <div class="search-icon"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="infoWrap"
                     style="height: auto;position: relative;">
                  <div class="left"></div>
                  <div class="right apartment accessAdd">
                    <div class="cellComponet"
                         v-for="(item,index) in cellArr"
                         :key="index">
                      <img src="./../../../assets/images/personMange/document.png" />
                      <span>{{item.groupName}}</span>
                      <div class="delete"
                           @click="deleteCell(item,index)"></div>
                    </div>
                  </div>
                  <div class="more">
                    <span v-show="isAccessCon"
                          @click="isAccessCon=false">收起</span>
                    <span v-show="!isAccessCon"
                          @click="isAccessCon=true">展开</span>
                    <img src="./../../../assets/images/personMange/more.png" />
                  </div>
                </div>
              </div>
              <div class="accessCon2"
                   v-show="isAccessCon">
                <div class="infoWrap">
                  <div class="left">延迟时间：</div>
                  <div class="right">
                    <el-input style="width: 60px;height: 30px;margin-right: 10px;"
                              v-model="delayTime"></el-input>秒
                    <span class="sp">注：</span>为行动不便的人员增加通过门禁的时间。
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">有效期：</div>
                  <div class="right">
                    <el-radio v-model="timeRange"
                              label="1">长期</el-radio>
                    <el-radio v-model="timeRange"
                              label="0">短期</el-radio>
                  </div>
                </div>
                <div class="infoWrap"
                     v-show="timeRange==='0'">
                  <div class="left"></div>
                  <div class="right">
                    <el-date-picker v-model="startTime"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期"
                                    style="width: 160px;"></el-date-picker>
                    <span style="margin: 0 6px;">-</span>
                    <el-date-picker v-model="endTime"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期"
                                    style="width: 160px;"></el-date-picker>
                  </div>
                </div>
                <div class="infoWrap">
                  <div class="left">访客权限：</div>
                  <div class="right">
                    <div style="width: 260px;position: relative;">
                      <div class="chooseMask"
                           @click.stop="isAccessChoose1=!isAccessChoose1,isAccessChoose=false"></div>
                      <el-input v-model="visitorAccess"
                                placeholder="请选择访客权限"
                                style="width: 260px;"
                                disabled></el-input>
                    </div>
                    <div class="accessChoose"
                         v-show="isAccessChoose1"
                         @click.stop="isAccessChoose1=true">
                      <div style="position: relative;">
                        <el-scrollbar style="height: 315px">
                          <el-tree ref="tree3"
                                   class="filter-tree"
                                   :data="data3"
                                   :props="defaultProps2"
                                   default-expand-all
                                   :filter-node-method="filterNode2"
                                   show-checkbox
                                   :expand-on-click-node="false"
                                   @check-change="handleCheckChange1"
                                   :default-checked-keys="InitnickName1()"
                                   node-key="groupUuid"></el-tree>
                        </el-scrollbar>
                        <el-input placeholder="输入关键字检索"
                                  v-model="filterText3"
                                  class="filterText1"></el-input>
                        <div class="search-icon"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="infoWrap"
                     style="height: auto;position: relative;">
                  <div class="left"></div>
                  <div class="right apartment accessAdd">
                    <div class="cellComponet"
                         v-for="(item,index) in cellArr1"
                         :key="index">
                      <img src="./../../../assets/images/personMange/document.png" />
                      <span>{{item.groupName}}</span>
                      <div class="delete"
                           @click="deleteCell1(item,index)"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="cardTitle">
                <img src="./../../../assets/images/personMange/card1.png" />
                <span>卡片：</span>
                <div class="addWrap"
                     @click="addCards">
                  <img src="./../../../assets/images/personMange/addCard.png" />
                  <span>新增卡片</span>
                </div>
                <span class="sp">发卡器配置</span>
							</div>-->
              <div class="accessCon1 accessAdd"
                   style="margin-bottom: 20px;">
                <div class="accessTitle">
                  <img src="./../../../assets/images/personMange/certificate.png" />
                  <span>通行凭证</span>
                </div>
                <div class="infoWrap">
                  <div class="left">卡片：</div>
                  <div class="right">
                    <div @click="addCards">
                      <img src="./../../../assets/images/personMange/addCard.png" />
                      <span>
                        新增卡片&nbsp;&nbsp;
                        <span class="addWrap">|</span>&nbsp;&nbsp;发卡器配置
                      </span>
                    </div>
                  </div>
                </div>
                <div class="cardInfo">
                  <div class="listWrap"
                       v-show="islListWrap1">
                    <div class="left">
                      <span>{{cardNameWrap1}}</span>
                      <span>{{cardNoWrap1}}</span>
                      <span>{{isSwitch1}}</span>
                      <span>{{cardFuncWrap1}}</span>
                    </div>
                    <div class="right">
                      <span @click="editCards('1')">编辑</span>
                      <span @click="deleteCard('1')">删除</span>
                    </div>
                  </div>
                  <div class="listWrap"
                       v-show="islListWrap2">
                    <div class="left">
                      <span>{{cardNameWrap2}}</span>
                      <span>{{cardNoWrap2}}</span>
                      <span>{{isSwitch2}}</span>
                      <span>{{cardFuncWrap2}}</span>
                    </div>
                    <div class="right">
                      <span @click="editCards('2')">编辑</span>
                      <span @click="deleteCard('2')">删除</span>
                    </div>
                  </div>
                  <div class="listWrap"
                       v-show="islListWrap3">
                    <div class="left">
                      <span>{{cardNameWrap3}}</span>
                      <span>{{cardNoWrap3}}</span>
                      <span>{{isSwitch3}}</span>
                      <span>{{cardFuncWrap3}}</span>
                    </div>
                    <div class="right">
                      <span @click="editCards('3')">编辑</span>
                      <span @click="deleteCard('3')">删除</span>
                    </div>
                  </div>
                  <div class="listWrap"
                       v-show="islListWrap4">
                    <div class="left">
                      <span>{{cardNameWrap4}}</span>
                      <span>{{cardNoWrap4}}</span>
                      <span>{{isSwitch4}}</span>
                      <span>{{cardFuncWrap4}}</span>
                    </div>
                    <div class="right">
                      <span @click="editCards('4')">编辑</span>
                      <span @click="deleteCard('4')">删除</span>
                    </div>
                  </div>
                  <div class="listWrap"
                       v-show="islListWrap5">
                    <div class="left">
                      <span>{{cardNameWrap5}}</span>
                      <span>{{cardNoWrap5}}</span>
                      <span>{{isSwitch5}}</span>
                      <span>{{cardFuncWrap5}}</span>
                    </div>
                    <div class="right">
                      <span @click="editCards('5')">编辑</span>
                      <span @click="deleteCard('5')">删除</span>
                    </div>
                  </div>
                </div>
                <!--  <div class="cardTitle">
                <img src="./../../../assets/images/personMange/fingerprint1.png" />
                <span>指纹：</span>
                <div class="addWrap"
                     style="border: none">
                  <img src="./../../../assets/images/personMange/addCard.png" />
                  <span>新增指纹</span>
                </div>
								</div>-->
                <div class="infoWrap">
                  <div class="left">指纹：</div>
                  <div class="right">
                    <img src="./../../../assets/images/personMange/addCard.png" />&nbsp;
                    <span>新增指纹</span>
                  </div>
                </div>
              </div>
              <div class="bottomTitle">
                <div class="text">信息来源：<span v-if="source!='platform'">{{this.source}}设备</span><span v-if="source=='platform'">平台录入</span></div>
                <div class="btnWrap">
                  <el-button style="width: 120px;"
                             @click="addPersonMember('continue')"
                             v-show="addEditMember==='add'">保存并继续添加</el-button>
                  <el-button style="width: 80px;"
                             @click="addEditPerson()">确认</el-button>
                  <el-button style="width: 80px;margin-right: 15px;"
                             @click="closeAddEdit">取消</el-button>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="labelForm"
           v-show="!isOrganiza">
        <div class="head">
          <div class="title">{{labelName}}&nbsp;&nbsp;({{labelNumber}})</div>
          <div class="carte">
            <div @click="changeLeftMenu('1')">
              <img src="./../../../assets/images/personMange/edit.png" />
              <span>修改名称</span>
            </div>
            <div @click="viewLabelDetail">
              <img src="./../../../assets/images/personMange/labelDetail.png" />
              <span>标签详情</span>
            </div>
          </div>
        </div>
        <div class="listWrap">
          <div class="bthWrap">
            <el-button style="width: 110px;"
                       @click="addDeparentment">添加部门/员工</el-button>
            <el-button style="width: 80px;"
                       @click="deleteDialog=true">移出</el-button>
          </div>
          <div class="tableWrap">
            <el-table ref="multipleTable"
                      :data="tableData1"
                      tooltip-effect="dark"
                      style="width: 60%"
                      @selection-change="handleSelectionChange2">
              <el-table-column type="selection"
                               width="100"></el-table-column>
              <el-table-column prop="staffName"
                               label="姓名"></el-table-column>
              <el-table-column prop="orgName"
                               label="部门"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--列表分页-->
      <div class="page-export"
           v-show="isOrganiza&&isListForm">
        <div class="exportWrap">
          <el-pagination @size-change="handleSizeChange1"
                         @current-change="handleCurrentChange1"
                         :current-page="currentPage1"
                         layout="total,prev, pager, next, jumper"
                         :page-size="pageSize1"
                         :pager-count="5"
                         :total="pageTotal1"
                         background></el-pagination>
        </div>
      </div>
      <!--图片分页-->
      <div class="page-export"
           v-show="isOrganiza&&isImageForm">
        <div class="exportWrap">
          <el-pagination @size-change="handleSizeChange1"
                         @current-change="handleCurrentChange1"
                         :current-page="currentPage1"
                         layout="total,prev, pager, next, jumper"
                         :page-size="pageSize1"
                         :pager-count="5"
                         :total="pageTotal1"
                         background></el-pagination>
        </div>
      </div>
      <!--右边标签分页-->
      <div class="page-export page-export1"
           v-show="!isOrganiza">
        <div class="exportWrap">
          <el-pagination @size-change="handleSizeChange2"
                         @current-change="handleCurrentChange2"
                         :current-page="currentPage2"
                         layout="total,prev, pager, next, jumper"
                         :page-size="pageSize2"
                         :pager-count="5"
                         :total="pageTotal2"
                         background></el-pagination>
        </div>
      </div>
    </div>
    <!--详情弹窗-->
    <el-dialog class="detailDialog"
               :title="'员工详情'"
               :visible.sync="detailDialog"
               @close="closeDialog"
               width="580px">
      <div class="detailWrap">
        <div class="linkInfo"
             style="height: 160px;">
          <div class="inforWrap">
            <div class="left">姓名：</div>
            <div class="right">{{this.viewStaffName}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">性别：</div>
            <div class="right">{{this.viewSexVal}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">民族：</div>
            <div class="right">{{this.viewNation}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">证件号：</div>
            <div class="right">{{this.viewIdNumber}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">别名：</div>
            <div class="right">{{this.viewNickName}}</div>
          </div>
          <div class="leftImage">
            <img :src="viewFontPhoto? viewFontPhoto : require('@/assets/images/user.png')" />
          </div>
        </div>
        <div class="linkInfo">
          <div class="inforWrap">
            <div class="left">手机：</div>
            <div class="right">{{this.viewPhoneNum}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">座机：</div>
            <div class="right">{{this.viewTelephone}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">电子邮件：</div>
            <div class="right">{{this.viewEmail}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">文化程度：</div>
            <div class="right">{{this.viewDegree}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">婚姻状况：</div>
            <div class="right">{{this.viewMaritalStatus}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">国籍：</div>
            <div class="right">{{this.viewNationality}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">籍贯：</div>
            <div class="right">{{this.viewNativePlace}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">户籍：</div>
            <div class="right">{{this.viewAdress}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">备注：</div>
            <div class="right">{{this.viewRemarks}}</div>
          </div>
        </div>
        <div class="jobInfo">
          <div class="inforWrap">
            <div class="left">部门：</div>
            <div class="right">
              <span v-for="(item,index) in viewOrgUuid"
                    :key="index"
                    style="margin-right: 5px;">{{item.orgName}}</span>
            </div>
          </div>
          <div class="inforWrap">
            <div class="left">标签：</div>
            <div class="right">
              <span v-for="(item,index) in viewTagUuids"
                    :key="index"
                    style="margin-right: 5px;">
                <img class="img1"
                     src="./../../../assets/images/personMange/equipment.png" />
                {{item.tagName}}
              </span>
            </div>
          </div>
          <div class="inforWrap">
            <div class="left">职务：</div>
            <div class="right">{{this.viewDuty}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">身份：</div>
            <div class="right">{{this.viewIdentity}}</div>
          </div>
          <div class="inforWrap">
            <div class="left">负责部门：</div>
            <div class="right">
              <span style="margin-right: 5px;"
                    v-for="(item,index) in viewApartment"
                    :key="index">{{item.orgName}}</span>
            </div>
          </div>
        </div>
        <div class="accessInfo">
          <div class="inforWrap">
            <div class="left">卡：</div>
            <div class="right">
              <span class="sp1"
                    v-for="(item,index) in viewCardList"
                    :key="index">
                <img class="img1"
                     src="./../../../assets/images/personMange/card.png" />
                {{item.cardId}}
              </span>
            </div>
          </div>
          <div class="inforWrap">
            <div class="left">指纹：</div>
            <div class="right">
              <span class="sp1">
                <img class="img1"
                     src="./../../../assets/images/personMange/fingerprint1.png" />
              </span>
            </div>
          </div>
          <div class="inforWrap colm1Wrap"
               id="trafficAuthList">
            <div class="left">通行权限组：</div>
            <div class="right colm1">
              <span v-for="(item,index) in viewTrafficAuthList"
                    :key="index">{{item.groupName}}</span>
            </div>
          </div>
          <div class="inforWrap colm1Wrap">
            <div class="left">访客权限组：</div>
            <div class="right colm1">
              <span v-for="(item,index) in viewVisitorAuthList"
                    :key="index">{{item.groupName}}</span>
            </div>
          </div>
          <div class="inforWrap"
               style="margin-top: 20px;">
            <div class="left">延长时间：</div>
            <div class="right">{{this.viewDelayTime}}s</div>
          </div>
          <div class="inforWrap">
            <div class="left">有效期：</div>
            <div class="right">
              <span v-if="viewTimeRange">长期有效</span>
              <span v-if="!viewTimeRange">{{this.viewBeginTime}} - {{this.viewEndTime}}</span>
            </div>
          </div>
        </div>
        <div class="closeBthWrap">
          <el-button style="width: 66px;"
                     @click="detailDialog=false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!--删除弹窗-->
    <el-dialog class="deleteDialog"
               :visible.sync="deleteDialog"
               width="400px">
      <div class="con">
        <div class="title">
          <img src="./../../../assets/images/personMange/delete2.png" />
          <span>是否确定删除选中员工？</span>
        </div>
        <div class="btnWrap">
          <el-button style="width: 76px;"
                     @click="deletePerson">确定</el-button>
          <el-button style="width: 76px;"
                     @click="deleteDialog=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--修改名称弹窗-->
    <el-dialog class="editDialog"
               :title="'修改名称'"
               :visible.sync="editDialog"
               close="closeDialog"
               width="440px">
      <div class="con">
        <div class="nameWrap">
          <div class="title">部门名称：</div>
          <el-input v-model="apartmentName"
                    style="width: 260px;height: 30px;"></el-input>
        </div>
        <div class="btnWrap">
          <el-button style="width: 76px;">确定</el-button>
          <el-button style="width: 76px;">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--修改标签弹窗-->
    <el-dialog class="editDialog"
               :title="'修改标签'"
               :visible.sync="editLabelDialog"
               close="closeDialog"
               width="440px">
      <div class="con">
        <div class="nameWrap">
          <div class="title">标签名称：</div>
          <el-input v-model="apartmentName"
                    style="width: 260px;height: 30px;"></el-input>
        </div>
        <div class="btnWrap">
          <el-button style="width: 76px;">保存</el-button>
          <el-button style="width: 76px;">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--新建部门弹窗-->
    <el-dialog class="editDialog"
               :title="'新建部门'"
               :visible.sync="newDialog"
               @close="closeDialog"
               width="440px">
      <div class="con">
        <div class="nameWrap">
          <div class="title">部门名称：</div>
          <el-input v-model="apartmentName"
                    style="width: 260px;height: 30px;"></el-input>
        </div>
        <div class="btnWrap">
          <el-button style="width: 76px;">确定</el-button>
          <el-button style="width: 76px;">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--标签详情弹窗-->
    <el-dialog class="labelDetailDialog"
               :title="'标签详情'"
               :visible.sync="labelDetailDialog"
               @close="closeDialog"
               width="500px">
      <div class="con">
        <div class="detail1">
          <div class="left">
            <img src="./../../../assets/images/personMange/label.png" />
            <span>{{labelName}}：</span>
          </div>
          <div class="right">包含员工 {{viewLalelMember}}人</div>
        </div>
        <div class="detail2">包含部门 {{viewLalelApartment}}个</div>
        <!-- <div class="detail2">包含公司   {{viewLalelCompany}}个</div> -->
        <div class="btnWrap1">
          <el-button style="width: 66px;"
                     @click="labelDetailDialog=false">确定</el-button>
          <el-button style="width: 66px;"
                     @click="labelDetailDialog=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--Excel批量导入人员-->
    <!--------------------------- 导入弹窗 TheResidentImportDialog ---------------------->
    <the-resident-import-dialog :isShow.sync="importDialog"
                                title="批量导入员工"
                                type="personnel"></the-resident-import-dialog>

    <!-- <el-dialog class='importDialog'
               :title="'Excel批量导入人员'"
               :visible.sync="importDialog"
               @close="closeDialog"
               width="540px">
      <div class="con">
        <div class="download">
          <div class="left">批量导入方式：</div>
          <div class="middle">
            <div>1.下载人员模板表格</div>
            <div>2.在表格内填写人员信息</div>
            <div>3.选择文件导入</div>
          </div>
          <div class="right">
            <div><img src="./../../../assets/images/download_template.png" /></div>
            <div>下载人员模版</div>
          </div>
        </div>
        <div class="file">
          <div class="title">导入文件：</div>
          <div class="choose"><img src="./../../../assets/images/select_file.png" /><span>选择文件</span></div>
        </div>
        <div class="btnWrap">
          <el-button style="width: 66px;">导入</el-button>
          <el-button style="width: 66px;">取消</el-button>
        </div>

      </div>
		</el-dialog>-->

    <!--Excel批量导出人员-->
    <el-dialog class="exportDialog"
               :title="'Excel批量导出人员'"
               :visible.sync="exportDialog"
               @close="closeDialog"
               width="540px">
      <div class="con">
        <div class="save">
          <div class="title">保存路径：</div>
          <el-input style="width: 280px;height: 30px;margin-right: 10px;"
                    v-model="delayTime"></el-input>
          <div>
            <img src="./../../../assets/images/personMange/path.png" />
            <span class="sp1">选择地址</span>
          </div>
        </div>
        <div class="text">
          <img src="./../../../assets/images/personMange/attention.png"
               style="width: 12px;height: 12px;margin-right: 8px;" />
          <span>注意：本操作将导出所有人员</span>
        </div>
        <div class="btnWrap">
          <el-button style="width: 66px;">导出</el-button>
          <el-button style="width: 66px;">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--数据统计弹窗-->
    <el-dialog class="StaticsViewDialogClass"
               width="550px"
               :title="chartTitle"
               :visible.sync="dataChartDialog"
               :before-close="onClickCancel"
               :close-on-click-modal="false">
      <el-main>
        <el-row type="flex"
                justify="space-between">
          <el-col :span="14">
            <div id="canvasPie"></div>
          </el-col>
          <el-col :span="10"
                  style="margin: auto;">
            <div class="legendBox"
                 v-for="(item,index) in pieData"
                 :key="index">
              <p class="name"
                 :style="{color:color[index]}">
                <span>{{item.name}}</span>
              </p>
              <p style="text-align:center">{{item.value}}</p>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   class="footer-button"
                   @click="dataChartDialog=false">确定</el-button>
        <el-button type="primary"
                   size="mini"
                   class="footer-button"
                   @click="dataChartDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <!--新增卡片弹窗-->
    <el-dialog class="addCardDialog"
               :title="'新增卡片'"
               :visible.sync="addCardDialog"
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
          <div class="left">启用/禁用：</div>
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
                     @click="addCardDialog=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--编辑卡片弹窗-->
    <el-dialog class="addCardDialog"
               :title="'编辑卡片'"
               :visible.sync="editCardDialog"
               @close="closeDialog"
               width="380px">
      <div class="con">
        <div class="detail">
          <div class="left">卡片名称：</div>
          <div class="right">
            <el-input v-model="editCardName"
                      style="width: 220px;height: 30px;"></el-input>
          </div>
        </div>
        <div class="detail">
          <div class="left">卡片：</div>
          <div class="right">
            <el-input v-model="editCard"
                      style="width: 220px;height: 30px;"></el-input>
          </div>
        </div>
        <div class="detail">
          <div class="left">启用/禁用：</div>
          <div class="right">
            <el-switch v-model="editCardSwitch"
                       active-color="rgba(32,204,150,0.2)"
                       inactive-color="rgba(255,255,255,0.2)"
                       style="width: 35px;"></el-switch>
          </div>
        </div>
        <div class="detail">
          <div class="left">卡片功能：</div>
          <div class="right">
            <el-select v-model="editCardFunc"
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
                     @click="editCardConfirm">确认</el-button>
          <el-button style="width: 66px;"
                     @click="editCardDialog=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--h5拍照-->
    <el-dialog title="拍照"
               center
               :visible.sync="shootPhotoDialogVisible"
               :width="`${canvWidth ? canvWidth + 50 : '1300'}px`"
               :before-close="handleClosePhoto">
      <video v-show="!shootPhotoShow"
             id="video"
             :height="`${canvHeight ? canvHeight : '800'}px`"
             ref="video"></video>
      <img v-show="shootPhotoShow"
           id="img"
           src>
      <span slot="footer"
            style="padding:15px">
        <el-button type="primary"
                   @click="shootAct">拍摄</el-button>
        <el-button type="primary"
                   @click="handleClosePhoto">取消</el-button>
      </span>
    </el-dialog>
    <!--设置部门上级-->
    <tab-tree-tag title="设置部门上级"
                  rightTxt="已选择的员工"
                  :isShow="setAprtmentDialogVisiable"
                  @onCancel="onCancel2"
                  @onConfirm="onConfirm2"></tab-tree-tag>
    <person-tree-tag title="添加部门/员工到标签"
                     rightTxt="已选择的部门或员工"
                     :isShow="addLabelDialogVisiable"
                     treeType="person"
                     :checkedNodeArr="checkedNode3"
                     @onCancel="onCancel4"
                     @onConfirm="onConfirm4"></person-tree-tag>
    <person-tree-tag title="添加部门/员工到标签"
                     rightTxt="已选择的部门或员工"
                     :isShow="addMsgToDeviceDialogVisiable"
                     treeType="staff"
                     :checkedNodeArr="checkedNode2"
                     :isTag="true"
                     @onCancel="onCancel3"
                     @onConfirm="onConfirm3"></person-tree-tag>
    <!-----------------------------------------添加地址居民到标签----------------------------------->
    <person-tree-tag title="设置所在部门"
                     rightTxt="员工将属于以下部门"
                     :isShow="getMsgToDeviceDialogVisiable"
                     treeType="department"
                     :checkedNodeArr="checkedNode1"
                     @onCancel="onCancel"
                     @onConfirm="onConfirm"></person-tree-tag>
    <person-tree-tag title="设置所在部门"
                     rightTxt="员工将属于以下部门"
                     :isShow="getMsgToDeviceDialogVisiable5"
                     treeType="department"
                     :checkedNodeArr="checkedNode5"
                     @onCancel="onCancel5"
                     @onConfirm="onConfirm5"></person-tree-tag>
  </div>
</template>
<script>
import * as api from "@/pages/equipmentMange/ajax.js";
import TheResidentImportDialog from "@/pages/residentManage/components/TheResidentImportDialog";
import TheLeftmenu from "./../../equipmentMange/views/TheLeftmenu";
import tabTreeTag from "@/common/TabTreeTag";
import TheResidentTagTable from "./../../residentManage/components/TheResidentTagTable";
import personTreeTag from "@/common/personTreeTag";
import RestApi from "@/utils/RestApi.js";
export default {
  components: {
    TheLeftmenu,
    tabTreeTag,
    TheResidentTagTable,
    personTreeTag,
    TheResidentImportDialog
  },
  props: {},
  data() {
    return {
      checkedNode5: [],
      WIamgeurl: RestApi.api.imageUrl,
      mainListLoading1: false,
      checkedNode1: [],
      checkedNode2: [],
      checkedNode3: [],
      addEditMember: "add",
      cardFuncName1: "",
      cardFuncName2: "",
      cardFuncName3: "",
      cardFuncName4: "",
      cardFuncName5: "",
      cellArr: [],
      cellArr1: [],
      isAccessCon: false,
      isAdditional: false,
      cardNameWrap1: "",
      cardNoWrap1: "",
      isSwitch1: "",
      cardFuncWrap1: "",
      cardNameWrap2: "",
      cardNoWrap2: "",
      isSwitch2: "",
      cardFuncWrap2: "",
      cardNameWrap3: "",
      cardNoWrap3: "",
      isSwitch3: "",
      cardFuncWrap3: "",
      cardNameWrap4: "",
      cardNoWrap4: "",
      isSwitch4: "",
      cardFuncWrap4: "",
      cardNameWrap5: "",
      cardNoWrap5: "",
      isSwitch5: "",
      cardFuncWrap5: "",
      islListWrap1: false,
      islListWrap2: false,
      islListWrap3: false,
      islListWrap4: false,
      islListWrap5: false,
      editCardFunc: "",
      editCardSwitch: false,
      editCard: "",
      editCardName: "",
      addCardFunc: "normal",
      cardFuncArr: [
        { value: 548, label: "普通" },
        { value: 310, name: "男" },
        { value: 234, name: "女" },
        { value: 135, name: "比对照片数" },
        { value: 48, name: "比对指纹数" },
        { value: 148, name: "比对卡片数" }
      ],
      addCardSwitch: true,
      addCard: "",
      addCardName: "卡1",
      api: window.config.protocolHeader + window.config.ip,
      token: window.config.token,
      isOrganiza: true,
      editCardDialog: false,
      addCardDialog: false,
      labelDetailDialog: false,
      editLabelDialog: false,
      addMsgToDeviceDialogVisiable: false,
      setAprtmentDialogVisiable: false,
      getMsgToDeviceDialogVisiable: false,
      getMsgToDeviceDialogVisiable5: false,
      getMsgToDeviceDialogVisiable6: false,
      addLabelDialogVisiable: false,
      dataChartDialog: false,
      color: ["#0ED0B6", "#05B1EE", "#02CD5E", "#A386F9", "#EF8871", "#F7D953"],
      isCurrentShow: false,
      pieData: [
        { value: 0, name: "员工数" },
        { value: 0, name: "男" },
        { value: 0, name: "女" },
        { value: 0, name: "比对照片数" },
        { value: 0, name: "比对指纹数" },
        { value: 0, name: "比对卡片数" }
      ],
      exportDialog: false,
      importDialog: false,
      apartmentName: "销售部",
      newDialog: false,
      editDialog: false,
      deleteDialog: false,
      detailDialog: false,
      idx: 0, // 任务列表标记
      isOperationMask: false,
      seleactAll: false, // 是否全选本页
      searchApartment: "",
      searchPhone: "",
      isOtherSearch: false, // 其他检索条件
      isAccessChoose: false, // 门禁组权限
      isAccessChoose1: false, // 访客权限
      sex: "male",
      frontPhoto: "",
      frontPhotoUrl:
        this.$store.state.api +
        "/mppr-face/v1/face/image/upload?fileType=full_body_shot",
      myHeaders: { token: this.$store.state.token },
      frontUploaded: false,
      addEditMembers: false,
      isListForm: true,
      isImageForm: false,
      totalStaff: "0",
      // tableData: new Array(10).fill({
      //   devName: "陈婷婷",
      //   ip: "销售一部",
      //   devId: "女",
      //   devMode: "13722345609",
      //   doorCount: "021-23443216",
      //   netStatus: "online",
      //   time: "2018-10-08 13:08:32"
      // }),
      tableData: [],
      tableData1: [],
      imageData: new Array(30).fill({
        devName: "陈婷婷",
        ip: "销售一部",
        devId: "女",
        devMode: "13722345609",
        doorCount: "021-23443216",
        imageSrc: "./../../../assets/images/personMange/fingerprint1.png"
      }),
      dutyArr: [{ value: "选项1", label: "黄金糕" }],
      duty: "",
      sexVal: "male",
      sexArr: [],
      staffInfo: "0",
      nickName: "",
      staffName: "",
      phoneNum: "",
      idType: "",
      idTypeArr: [{ value: "选项1", label: "身份证" }],
      idNumber: "",
      nationArr: [{ value: "选项1", label: "汉" }],
      nation: "",
      degreeArr: [{ value: "选项1", label: "本科" }],
      degree: "",
      maritalArr: [{ value: "选项1", label: "已婚" }],
      marital: "",
      nationalityArr: [{ value: "选项1", label: "中国" }],
      nationality: "",
      nativePlace: "",
      censusRegister: "",
      email: "",
      telephone: "",
      remark: "",
      doorAccess: "",
      delayTime: "0",
      timeRange: "1",
      startTime: null,
      endTime: null,
      startTime1: null, // 检索条件
      endTime1: null,
      visitorAccess: "",
      filterText: "",
      filterText3: "",
      data2: [
        {
          groupUuid: "",
          groupName: "权限组",
          children: []
        }
      ],
      data3: [
        {
          groupUuid: "",
          groupName: "权限组",
          children: []
        }
      ],
      defaultProps1: {
        children: "children",
        label: "groupName"
      },
      defaultProps2: {
        children: "children",
        label: "groupName"
      },
      currentPage1: 1,
      pageSize1: 0,
      pageTotal1: 0,
      currentPage2: 1,
      pageSize2: 15,
      pageTotal2: 0,
      editFlag: "",
      chanelList: [],
      chanelList1: [],
      // projectUuid: window.config.projectUuid,
      projectUuid: this.$store.state.home.projectUuid,
      groupUuid: "2222",
      imageFileData: "",
      leaderOrgUuid: [],
      shootPhotoShow: false,
      shootPhotoDialogVisible: false,
      canvas: null,
      video: null,
      img: null,
      vendorUrl: window.URL || window.webkitURL,
      staffUuid: "4467a9f6313547cd9757dc6c80d7c236",
      staffUuidList: [],
      viewFontPhoto: "",
      viewStaffName: "",
      viewSexVal: "",
      viewNation: "",
      viewIdNumber: "",
      viewNickName: "",
      viewMaritalStatus: "",
      viewRemarks: "",
      viewPhoneNum: "",
      viewTelephone: "",
      viewEmail: "",
      viewDegree: "",
      viewNationality: "",
      viewNativePlace: "",
      viewAdress: "",
      viewOrgUuid: "",
      viewTagUuids: "",
      viewDuty: "",
      viewIdentity: "", // 身份
      viewApartment: "", // 负责部门
      viewCardList: "",
      viewFingerprintList: "", // 指纹信息
      viewTrafficAuthList: "", // 通行权限
      viewVisitorAuthList: "", // 访客权限组
      viewDelayTime: "",
      viewTimeRange: "", // 有效期
      apartmentUuid: [],
      labelUuid: [],
      clickNodeId: "",
      viewGroupName: "组织架构",
      editStaffUuid: "",
      versionName: 0,
      labelName: "标签",
      labelNumber: 0,
      labelTagUuid: "",
      labelVersion: "",
      editLifePicture: "",
      parentNodeId: "",
      searchName: null,
      searchStartTime: null,
      searchEndTime: null,
      searchSexVal: null,
      setOrgUuid: "",
      setStaffOrgUuid: "",
      labelTagType: "",
      viewLalelMember: "",
      viewLalelApartment: "",
      viewBeginTime: "",
      viewEndTime: "",
      isTableStyle: true,
      setOrgName: "",
      chartTitle: "",
      viewLalelCompany: 0,
      isResize: true,
      source: "",
      canvWidth: "",
      canvHeight: "",
      mediaStreamTrack: null
    };
  },
  created() {},
  activated() {
    this.initDoorAccess();
    this.initVisitorAccess();
    this.isResize = true;
  },
  mounted() {
    this.idTypeArr = this.$common.getEnumByGroupStr("cred");
    this.degreeArr = this.$common.getEnumByGroupStr("edu");
    this.nationalityArr = this.$common.getEnumByGroupStr("nationality");
    this.nationArr = this.$common.getEnumByGroupStr("nation");
    this.maritalArr = this.$common.getEnumByGroupStr("marital");
    this.cardFuncArr = this.$common.getEnumByGroupStr("card_u");
    this.sexArr = this.$common.getEnumByGroupStr("gender");
    let that = this;
    setTimeout(function() {
      that.parentNodeId = that.clickNodeId;
    }, 1000);
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight; // height
    document.getElementById("addMembers").style.height = h - 60 + "px";
    this.pageSize1 = parseInt((h - 235) / 52) - 1;
    this.pageSize2 = parseInt((h - 235) / 52) - 1;
    console.log(this.pageSize1);
    // 当窗口发生变化时
    window.addEventListener("resize", function() {
      let height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      document.getElementById("addMembers").style.height = height - 60 + "px";
      if (!that.isResize) return;
      if (that.isOrganiza) {
        if (this.isListForm) {
          that.pageSize1 = parseInt((height - 235) / 52) - 1;
          that.clickNodeList();
        } else {
          var length1 =
            document.getElementById("singleCell").offsetWidth - 16 + "px";
          var elems = document.querySelectorAll("#mainImg");
          for (let index = 0; index < elems.length; index++) {
            elems[index].style.width = length1;
            elems[index].style.height = length1;
            document.querySelectorAll("#singleCell")[index].style.height =
              length1 + 50 + "px";
          }
        }
      } else {
        that.pageSize2 = parseInt((height - 235) / 52) - 1;
        that.clickLabelList();
      }
    });
  },
  deactivated() {
    this.isResize = false;
  },
  methods: {
    addDeparentment() {
      if (this.labelTagUuid) {
        this.addLabelDialogVisiable = !this.addLabelDialogVisiable;
      } else {
        this.$message.error("请选择左边的标签树！");
      }
    },
    initDoorAccess() {
      var that = this;
      this.$http
        .get(
          this.api +
            "/iacapp-v1/project/" +
            this.projectUuid +
            "/permission/list?limit=11111111&page=1&groupType=normal"
        )
        .then(res => {
          console.log("查看门禁权限列表====", res);
          if (res.status === 200) {
            if (res.data.success) {
              let list = res.data.data.list;
              let b = that.data2[0];
              b.children = list;
              that.data2 = [];
              that.data2.push(b);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    initVisitorAccess() {
      var that = this;
      this.$http
        .get(
          this.api +
            "/iacapp-v1/project/" +
            this.projectUuid +
            "/permission/list?limit=11111111&page=1&groupType=visitor"
        )
        .then(res => {
          console.log("查看门禁权限列表====", res);
          if (res.status === 200) {
            if (res.data.success) {
              let list = res.data.data.list;
              let a = that.data3[0];
              a.children = list;
              that.data3 = [];
              that.data3.push(a);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    addPersonMember(title) {
      if (this.apartmentUuid.length === 0) {
        this.$message({
          message: "请选择部门",
          type: "error"
        });
        return;
      }
      if (this.phoneNum && !/^1[3456789]\d{9}$/.test(this.phoneNum)) {
        this.$message({
          type: "warning",
          message: "手机号有误"
        });
        return;
      }
      // 添加成员
      if (this.startTime !== null && this.endTime !== null) {
        var startTime = new Date(this.startTime).getTime();
        var endTime = new Date(this.endTime).getTime();
        if (Number(startTime) >= Number(endTime)) {
          this.$message({
            message: "开始时间不能晚于结束时间",
            type: "error"
          });
          return;
        }
      }
      if (title === "add") {
        this.closeAddEdit();
      } else if (title === "continue") {
        this.addEditMembers = true;
        this.isListForm = false;
      }
      var cardList = [];
      if (this.islListWrap1 === true) {
        var isSwitch1 = true;
        if (this.isSwitch1 === "已启用") {
          isSwitch1 = 1;
        } else {
          isSwitch1 = 0;
        }
        var obj1 = {
          cardEnable: isSwitch1,
          cardId: this.cardNoWrap1,
          function: this.cardFuncName1,
          mediumUuid: this.cardNameWrap1,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj1);
      }
      if (this.islListWrap2 === true) {
        var isSwitch2 = true;
        if (this.isSwitch2 === "已启用") {
          isSwitch2 = 1;
        } else {
          isSwitch2 = 0;
        }
        var obj2 = {
          cardEnable: isSwitch2,
          cardId: this.cardNoWrap2,
          function: this.cardFuncName2,
          mediumUuid: this.cardNameWrap2,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj2);
      }
      if (this.islListWrap3 === true) {
        var isSwitch3 = true;
        if (this.isSwitch3 === "已启用") {
          isSwitch3 = 1;
        } else {
          isSwitch3 = 0;
        }
        var obj3 = {
          cardEnable: isSwitch3,
          cardId: this.cardNoWrap3,
          function: this.cardFuncName3,
          mediumUuid: this.cardNameWrap3,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj3);
      }
      if (this.islListWrap4 === true) {
        var isSwitch4 = true;
        if (this.isSwitch4 === "已启用") {
          isSwitch4 = 1;
        } else {
          isSwitch4 = 0;
        }
        var obj4 = {
          cardEnable: isSwitch4,
          cardId: this.cardNoWrap4,
          function: this.cardFuncName4,
          mediumUuid: this.cardNameWrap4,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj4);
      }
      if (this.islListWrap5 === true) {
        var isSwitch5 = true;
        if (this.isSwitch5 === "已启用") {
          isSwitch5 = 1;
        } else {
          isSwitch5 = 0;
        }
        var obj5 = {
          cardEnable: isSwitch5,
          cardId: this.cardNoWrap5,
          function: this.cardFuncName5,
          mediumUuid: this.cardNameWrap5,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj5);
      }
      if (this.staffInfo === "0") {
        this.leaderOrgUuid = [];
      }
      this.$http
        .post(
          this.api +
            "/sppc-iacapp-service-v1/project/" +
            this.projectUuid +
            "/personnel/info",
          {
            address: this.censusRegister, // 户籍
            beginTime: this.startTime, // 有效开始时间
            cardList: cardList, // 卡片信息
            cellphone: this.phoneNum, // 手机号
            credential: this.idType, // 证件类型
            credentialNo: this.idNumber, // 证件号码
            education: this.degree, // 学历
            email: this.email, // 电子邮箱
            endTime: this.endTime, // 有效结束时间
            fingerprintList: [], // 指纹信息
            fixedLine: this.telephone, // 座机
            gender: this.sexVal, // 性别
            lifePictureUrl: "", // 证件照
            jobTitle: this.duty, // 职务
            lifePictureBase64: this.imageFileData, // 生活照Base64
            longTerm: Number(this.timeRange), // 是否长期有效 0
            maritalStatus: this.marital, // 婚姻状态
            nation: this.nation, // 民族
            nationality: this.nationality, // 国籍
            nativePlace: this.nativePlace, // 籍贯
            openDelayTime: Number(this.delayTime), // 开门延时时间
            orgUuid: this.apartmentUuid, // 部门
            remarks: this.remark, // 备注
            staffName: this.staffName, // 姓名
            tagUuids: this.labelUuid, // 标签
            trafficAuthList: this.trafficAuthList, // 通行权限
            version: Number(this.versionName), // 版本号
            visitorAuthList: this.visitorAuthList, // 访客权限组
            // 2.普通员工和上级的字段
            isLeader: Number(this.staffInfo), // 是否上级
            leaderOrgUuid: this.leaderOrgUuid, // 负责部门
            nickName: this.nickName // 别名
          }
        )
        .then(res => {
          console.log("新增人员====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.clickNodeList();
              this.newPersonList();
              this.$message({
                message: "新增成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    editPersonMember() {
      if (this.apartmentUuid.length === 0) {
        this.$message({
          message: "请选择部门",
          type: "error"
        });
        return;
      }
      if (this.phoneNum && !/^1[3456789]\d{9}$/.test(this.phoneNum)) {
        this.$message({
          type: "warning",
          message: "手机号有误"
        });
        return;
      }
      // 编辑员工
      if (this.startTime !== null && this.endTime !== null) {
        var startTime = new Date(this.startTime).getTime();
        var endTime = new Date(this.endTime).getTime();
        if (Number(startTime) >= Number(endTime)) {
          this.$message({
            message: "开始时间不能晚于结束时间",
            type: "error"
          });
          return;
        }
      }
      this.addEditMembers = false;
      this.isListForm = true;
      var cardList = [];
      if (this.islListWrap1 === true) {
        var isSwitch1 = true;
        if (this.isSwitch1 === "已启用") {
          isSwitch1 = 1;
        } else {
          isSwitch1 = 0;
        }
        var obj1 = {
          cardEnable: isSwitch1,
          cardId: this.cardNoWrap1,
          function: this.cardFuncName1,
          mediumUuid: this.cardNameWrap1,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj1);
      }
      if (this.islListWrap2 === true) {
        var isSwitch2 = true;
        if (this.isSwitch2 === "已启用") {
          isSwitch2 = 1;
        } else {
          isSwitch2 = 0;
        }
        var obj2 = {
          cardEnable: isSwitch2,
          cardId: this.cardNoWrap2,
          function: this.cardFuncName2,
          mediumUuid: this.cardNameWrap2,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj2);
      }
      if (this.islListWrap3 === true) {
        var isSwitch3 = true;
        if (this.isSwitch3 === "已启用") {
          isSwitch3 = 1;
        } else {
          isSwitch3 = 0;
        }
        var obj3 = {
          cardEnable: isSwitch3,
          cardId: this.cardNoWrap3,
          function: this.cardFuncName3,
          mediumUuid: this.cardNameWrap3,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj3);
      }
      if (this.islListWrap4 === true) {
        var isSwitch4 = true;
        if (this.isSwitch4 === "已启用") {
          isSwitch4 = 1;
        } else {
          isSwitch4 = 0;
        }
        var obj4 = {
          cardEnable: isSwitch4,
          cardId: this.cardNoWrap4,
          function: this.cardFuncName4,
          mediumUuid: this.cardNameWrap4,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj4);
      }
      if (this.islListWrap5 === true) {
        var isSwitch5 = true;
        if (this.isSwitch5 === "已启用") {
          isSwitch5 = 1;
        } else {
          isSwitch5 = 0;
        }
        var obj5 = {
          cardEnable: isSwitch5,
          cardId: this.cardNoWrap5,
          function: this.cardFuncName5,
          mediumUuid: this.cardNameWrap5,
          cardName: this.cardNameWrap1
        };
        cardList.push(obj5);
      }
      if (this.staffInfo === "0") {
        this.leaderOrgUuid = [];
      }
      this.$http
        .put(
          this.api +
            "/sppc-iacapp-service-v1/project/" +
            this.projectUuid +
            "/personnel/info",
          {
            address: this.censusRegister, // 户籍
            beginTime: this.startTime, // 有效开始时间
            cardList: cardList, // 卡片信息
            cellphone: this.phoneNum, // 手机号
            credential: this.idType, // 证件类型
            credentialNo: this.idNumber, // 证件号码
            education: this.degree, // 学历
            email: this.email, // 电子邮箱
            endTime: this.endTime, // 有效结束时间
            fingerprintList: [], // 指纹信息
            fixedLine: this.telephone, // 座机
            gender: this.sexVal, // 性别
            lifePictureUrl: this.editLifePicture, // 证件照
            lifePictureBase64: this.imageFileData, // 证件照base64
            jobTitle: this.duty, // 职务
            // lifePictureUrl: "", // 生活照
            longTerm: Number(this.timeRange), // 是否长期有效 0
            maritalStatus: this.marital, // 婚姻状态
            nation: this.nation, // 民族
            nationality: this.nationality, // 国籍
            nativePlace: this.nativePlace, // 籍贯
            openDelayTime: Number(this.delayTime), // 开门延时时间
            orgUuid: this.apartmentUuid, // 部门
            remarks: this.remark, // 备注
            staffName: this.staffName, // 姓名
            tagUuids: this.labelUuid, // 标签
            trafficAuthList: this.trafficAuthList, // 通行权限
            version: Number(this.versionName), // 版本号
            visitorAuthList: this.visitorAuthList, // 访客权限组
            // 2.普通员工和上级的字段
            isLeader: Number(this.staffInfo), // 是否上级
            leaderOrgUuid: this.leaderOrgUuid, // 负责部门
            staffUuid: this.editStaffUuid,
            nickName: this.nickName // 别名
          }
        )
        .then(res => {
          console.log("编辑人员====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.clickNodeList();
              this.$message({
                message: "编辑成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    addEditPerson() {
      //
      if (this.addEditMember === "add") {
        this.addPersonMember("add");
      } else if (this.addEditMember === "edit") {
        this.editPersonMember();
      }
    },
    deleteCell(item, index) {
      this.cellArr.splice(index, 1);
      this.chanelList = [];
      for (var i = 0; i < this.cellArr.length; i++) {
        this.chanelList.push(this.cellArr[i].groupUuid);
      }
      this.$refs.tree2.setCheckedKeys(this.chanelList);
    },
    handleCheckChange(data, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.cellArr = this.$refs.tree2.getCheckedNodes();
      this.trafficAuthList = [];
      var arrAccess = [];
      for (var i = 0; i < this.cellArr.length; i++) {
        if (this.cellArr[i].groupUuid !== "") {
          arrAccess.push(this.cellArr[i].groupName);
          var obj1 = {
            groupName: this.cellArr[i].groupName,
            groupUuid: this.cellArr[i].groupUuid,
            staffSetUuid: this.cellArr[i].staffSetUuid
          };
          this.trafficAuthList.push(obj1);
        }
      }
      for (var j = 0; j < this.cellArr.length; j++) {
        if (this.cellArr[j].groupUuid === "") {
          this.cellArr.splice(j, 1);
        }
      }
      this.doorAccess = arrAccess.join("、");
    },
    deleteCell1(item, index) {
      this.cellArr1.splice(index, 1);
      this.chanelList1 = [];
      for (var i = 0; i < this.cellArr1.length; i++) {
        this.chanelList1.push(this.cellArr1[i].groupUuid);
      }
      this.$refs.tree2.setCheckedKeys(this.chanelList1);
    },
    handleCheckChange1(data, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.cellArr1 = this.$refs.tree3.getCheckedNodes();
      this.visitorAuthList = [];
      var visitorAccess = [];
      for (var i = 0; i < this.cellArr1.length; i++) {
        if (this.cellArr1[i].groupUuid !== "") {
          visitorAccess.push(this.cellArr1[i].groupName);
          var obj1 = {
            groupName: this.cellArr1[i].groupName,
            groupUuid: this.cellArr1[i].groupUuid,
            staffSetUuid: this.cellArr1[i].staffSetUuid
          };
          this.visitorAuthList.push(obj1);
        }
      }
      for (var j = 0; j < this.cellArr1.length; j++) {
        if (this.cellArr1[j].groupUuid === "") {
          this.cellArr1.splice(j, 1);
        }
      }
      this.visitorAccess = visitorAccess.join("、");
    },
    InitnickName() {
      return this.chanelList;
    },
    InitnickName1() {
      return this.chanelList1;
    },
    editCardConfirm() {
      var addCardFunc;
      for (var i = 0; i < this.cardFuncArr.length; i++) {
        if (this.editCardFunc === this.cardFuncArr[i].typeStr) {
          addCardFunc = this.cardFuncArr[i].typeName;
        }
      }
      if (this.editFlag === "1") {
        this.islListWrap1 = true;
        this.cardNameWrap1 = this.editCardName;
        this.cardNoWrap1 = this.editCard;
        if (this.editCardSwitch === true) {
          this.isSwitch1 = "已启用";
        } else {
          this.isSwitch1 = "已停用";
        }
        this.cardFuncName1 = this.editCardFunc;
        this.cardFuncWrap1 = addCardFunc;
      } else if (this.editFlag === "2") {
        this.islListWrap2 = true;
        this.cardNameWrap2 = this.editCardName;
        this.cardNoWrap2 = this.editCard;
        if (this.editCardSwitch === true) {
          this.isSwitch2 = "已启用";
        } else {
          this.isSwitch2 = "已停用";
        }
        this.cardFuncName2 = this.editCardFunc;
        this.cardFuncWrap2 = addCardFunc;
      } else if (this.editFlag === "3") {
        this.islListWrap3 = true;
        this.cardNameWrap3 = this.editCardName;
        this.cardNoWrap3 = this.editCard;
        if (this.editCardSwitch === true) {
          this.isSwitch3 = "已启用";
        } else {
          this.isSwitch3 = "已停用";
        }
        this.cardFuncName3 = this.editCardFunc;
        this.cardFuncWrap3 = addCardFunc;
      } else if (this.editFlag === "4") {
        this.islListWrap4 = true;
        this.cardNameWrap4 = this.editCardName;
        this.cardNoWrap4 = this.editCard;
        if (this.editCardSwitch === true) {
          this.isSwitch4 = "已启用";
        } else {
          this.isSwitch4 = "已停用";
        }
        this.cardFuncName4 = this.editCardFunc;
        this.cardFuncWrap4 = addCardFunc;
      } else if (this.editFlag === "5") {
        this.islListWrap5 = true;
        this.cardNameWrap5 = this.editCardName;
        this.cardNoWrap5 = this.editCard;
        if (this.editCardSwitch === true) {
          this.isSwitch5 = "已启用";
        } else {
          this.isSwitch5 = "已停用";
        }
        this.cardFuncName5 = this.editCardFunc;
        this.cardFuncWrap5 = addCardFunc;
      }
      this.editCardDialog = false;
    },
    editCards(e) {
      this.editFlag = e;
      if (e === "1") {
        this.editCardName = this.cardNameWrap1;
        this.editCard = this.cardNoWrap1;
        if (this.isSwitch1 === "已启用") {
          this.editCardSwitch = true;
        } else {
          this.editCardSwitch = false;
        }
        this.editCardFunc = this.cardFuncName1;
      } else if (e === "2") {
        this.editCardName = this.cardNameWrap2;
        this.editCard = this.cardNoWrap2;
        if (this.isSwitch2 === "已启用") {
          this.editCardSwitch = true;
        } else {
          this.editCardSwitch = false;
        }
        this.editCardFunc = this.cardFuncName2;
      } else if (e === "3") {
        this.editCardName = this.cardNameWrap3;
        this.editCard = this.cardNoWrap3;
        if (this.isSwitch3 === "已启用") {
          this.editCardSwitch = true;
        } else {
          this.editCardSwitch = false;
        }
        this.editCardFunc = this.cardFuncName3;
      } else if (e === "4") {
        this.editCardName = this.cardNameWrap4;
        this.editCard = this.cardNoWrap4;
        if (this.isSwitch4 === "已启用") {
          this.editCardSwitch = true;
        } else {
          this.editCardSwitch = false;
        }
        this.editCardFunc = this.cardFuncName4;
      } else if (e === "5") {
        this.editCardName = this.cardNameWrap5;
        this.editCard = this.cardNoWrap5;
        if (this.isSwitch5 === "已启用") {
          this.editCardSwitch = true;
        } else {
          this.editCardSwitch = false;
        }
        this.editCardFunc = this.cardFuncName5;
      }
      this.editCardDialog = true;
    },
    deleteCard(e) {
      if (e === "1") {
        this.islListWrap1 = false;
      } else if (e === "2") {
        this.islListWrap2 = false;
      } else if (e === "3") {
        this.islListWrap3 = false;
      } else if (e === "4") {
        this.islListWrap4 = false;
      } else if (e === "5") {
        this.islListWrap5 = false;
      }
    },
    addCardConfirm() {
      // for (let i = 0; i < this.cardList.length; i++) {
      //   if (this.addCardName === this.cardList[i].cardName) {
      //     this.$message.error("卡片名称重复!");
      //     return;
      //   }
      //   if (this.addCard === this.cardList[i].cardId) {
      //     this.$message.error("卡号重复!");
      //     return;
      //   }
      // }
      if (
        this.addCardName === this.cardNameWrap1 ||
        this.addCardName === this.cardNameWrap2 ||
        this.addCardName === this.cardNameWrap3 ||
        this.addCardName === this.cardNameWrap4 ||
        this.addCardName === this.cardNameWrap5 ||
        this.addCardName === this.cardNameWrap6
      ) {
        this.$message.error("卡名称重复!");
        return;
      }
      if (
        this.addCard === this.cardNoWrap1 ||
        this.addCard === this.cardNoWrap2 ||
        this.addCard === this.cardNoWrap3 ||
        this.addCard === this.cardNoWrap4 ||
        this.addCard === this.cardNoWrap5 ||
        this.addCard === this.cardNoWrap6
      ) {
        this.$message.error("卡号重复!");
        return;
      }
      api
        .judgeRepeatCard({
          mediumNo: this.addCard
        })
        .then(res => {
          if (!res.data.data) {
            var addCardFunc;
            for (var i = 0; i < this.cardFuncArr.length; i++) {
              if (this.addCardFunc === this.cardFuncArr[i].typeStr) {
                addCardFunc = this.cardFuncArr[i].typeName;
              }
            }
            if (this.islListWrap1 === false) {
              this.islListWrap1 = true;
              this.cardNameWrap1 = this.addCardName;
              this.cardNoWrap1 = this.addCard;
              if (this.addCardSwitch === true) {
                this.isSwitch1 = "已启用";
              } else {
                this.isSwitch1 = "已停用";
              }

              this.cardFuncWrap1 = addCardFunc;
              this.cardFuncName1 = this.addCardFunc;
            } else if (this.islListWrap2 === false) {
              this.islListWrap2 = true;
              this.cardNameWrap2 = this.addCardName;
              this.cardNoWrap2 = this.addCard;
              if (this.addCardSwitch === true) {
                this.isSwitch2 = "已启用";
              } else {
                this.isSwitch2 = "已停用";
              }
              this.cardFuncWrap2 = addCardFunc;
              this.cardFuncName2 = this.addCardFunc;
            } else if (this.islListWrap3 === false) {
              this.islListWrap3 = true;
              this.cardNameWrap3 = this.addCardName;
              this.cardNoWrap3 = this.addCard;
              if (this.addCardSwitch === true) {
                this.isSwitch3 = "已启用";
              } else {
                this.isSwitch3 = "已停用";
              }
              this.cardFuncWrap3 = addCardFunc;
              this.cardFuncName3 = this.addCardFunc;
            } else if (this.islListWrap4 === false) {
              this.islListWrap4 = true;
              this.cardNameWrap4 = this.addCardName;
              this.cardNoWrap4 = this.addCard;
              if (this.addCardSwitch === true) {
                this.isSwitch4 = "已启用";
              } else {
                this.isSwitch4 = "已停用";
              }
              this.cardFuncWrap4 = addCardFunc;
              this.cardFuncName4 = this.addCardFunc;
            } else if (this.islListWrap5 === false) {
              this.islListWrap5 = true;
              this.cardNameWrap5 = this.addCardName;
              this.cardNoWrap5 = this.addCard;
              if (this.addCardSwitch === true) {
                this.isSwitch5 = "已启用";
              } else {
                this.isSwitch5 = "已停用";
              }
              this.cardFuncWrap5 = addCardFunc;
              this.cardFuncName5 = this.addCardFunc;
            }
            this.addCardDialog = false;
          } else {
            this.$message.error("卡号重复");
          }
        });
    },
    addCards() {
      if (
        this.islListWrap1 &&
        this.islListWrap2 &&
        this.islListWrap3 &&
        this.islListWrap4 &&
        this.islListWrap5
      ) {
        return;
      }
      this.addCardName = "卡1";
      this.addCard = "";
      this.addCardSwitch = true;
      this.addCardFunc = "normal";
      this.addCardDialog = true;
    },
    getPersonList() {
      this.$http
        .get(
          this.api + "/basedata-v1/project/test_database_api/baseType/groupStr"
        )
        .then(res => {
          console.log("查看人员信息列表====", res);
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    changetab(tab) {
      console.log("changetab===", tab);
      if (tab.name === "organiza") {
        this.isOrganiza = true;
      } else {
        this.isOrganiza = false;
      }
    },
    onCancel4() {
      this.addLabelDialogVisiable = !this.addLabelDialogVisiable;
    },
    onConfirm4(res) {
      this.addLabelDialogVisiable = !this.addLabelDialogVisiable;
      this.checkedNode3 = res;
      console.log("res==", res);
      var arr = [];
      for (var i = 0; i < res.length; i++) {
        var obj = {
          tagUuid: this.labelTagUuid,
          version: this.labelVersion,
          elementUuid: res[i].id,
          elementType: res[i].type,
          elementSn: i
        };
        arr.push(obj);
      }
      console.log("arr==", arr);
      this.$http
        .post(
          this.api +
            "/basedata-v1/project/" +
            this.projectUuid +
            "/tagElement/add",
          arr
        )
        .then(res => {
          console.log("标签添加元素====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.$refs.leftMenu.getOrgTag(true, this.labelTagUuid);
              this.clickLabelList();
              this.$message({
                message: "新增成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    onCancel3() {
      this.addMsgToDeviceDialogVisiable = !this.addMsgToDeviceDialogVisiable;
    },
    onConfirm3(res) {
      this.addMsgToDeviceDialogVisiable = !this.addMsgToDeviceDialogVisiable;
      this.checkedNode2 = res;
      this.labelUuid = [];
      for (var i = 0; i < res.length; i++) {
        this.labelUuid.push(res[i].id);
      }
    },
    onCancel2() {
      this.setAprtmentDialogVisiable = !this.setAprtmentDialogVisiable;
    },
    onConfirm2() {
      this.setAprtmentDialogVisiable = !this.setAprtmentDialogVisiable;
    },
    onCancel() {
      this.getMsgToDeviceDialogVisiable = !this.getMsgToDeviceDialogVisiable;
    },
    onConfirm(res) {
      this.getMsgToDeviceDialogVisiable = !this.getMsgToDeviceDialogVisiable;
      console.log("res==", res);
      this.checkedNode1 = res;
      this.setStaffOrgUuid = [];
      for (var i = 0; i < res.length; i++) {
        this.setStaffOrgUuid.push(res[i].id);
      }
      this.setStaffApartment();
    },
    onCancel5() {
      this.getMsgToDeviceDialogVisiable5 = !this.getMsgToDeviceDialogVisiable5;
    },
    onConfirm5(res) {
      this.getMsgToDeviceDialogVisiable5 = !this.getMsgToDeviceDialogVisiable5;
      console.log("res==", res);
      this.checkedNode5 = res;
      this.apartmentUuid = [];
      for (var i = 0; i < res.length; i++) {
        this.apartmentUuid.push(res[i].id);
      }
    },
    startDraw() {
      setTimeout(() => {
        this.drawPie();
      }, 0);
    },
    filterNode1(value, data) {
      if (!value) return true;
      return data.groupName.indexOf(value) !== -1;
    },
    filterNode2(value, data) {
      if (!value) return true;
      return data.groupName.indexOf(value) !== -1;
    },
    handleSelectionChange1(res) {
      console.log(res);
      this.staffUuidList = [];
      for (var i = 0; i < res.length; i++) {
        this.staffUuidList.push(res[i].staffUuid);
      }
    },
    handleSelectionChange2(res) {
      console.log(res);
      this.staffUuidList = [];
      for (var i = 0; i < res.length; i++) {
        this.staffUuidList.push(res[i].staffUuid);
      }
    },
    httpRequest(e1) {
      console.log(e1);
    },
    changeFile(file, fileList) {
      console.log("file===", file);
      if (file.raw.type === "image/jpg" || file.raw.type === "image/jpeg") {
        this.frontUploaded = true;
        this.frontPhoto = URL.createObjectURL(file.raw);
        var that = this;
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e) {
          that.imageFileData = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
          that.checkImageQuality(that.imageFileData);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    deleteUpload() {
      // 删除上传图片
      this.frontUploaded = false;
      this.frontPhoto = "";
      this.imageFileData = "";
      this.editLifePicture = "";
    },
    drawPie() {
      var dom = document.getElementById("canvasPie");
      let myChart = this.$echarts.init(dom);
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          show: false,
          itemGap: 50,
          left: "right",
          top: "center",
          data: [
            "员工数",
            "男",
            "女",
            "比对人脸数",
            "比对指纹数",
            "比对卡片数"
          ].reverse()
        },
        color: this.color,
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "80%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData
          }
        ]
      };

      myChart.setOption(option);
    },
    handleCurrentChange1(e) {
      this.currentPage1 = Number(e);
      this.clickNodeList();
    },
    handleSizeChange1(e) {
      console.log("handleSizeChange==", e);
    },
    handleCurrentChange2(e) {
      this.currentPage2 = Number(e);
      this.clickLabelList();
    },
    handleSizeChange2(e) {
      console.log("handleSizeChange==", e);
    },
    closeDialog() {},
    onClickCancel() {
      this.dataChartDialog = false;
    },
    shootAct() {
      var canvas = document.createElement("canvas");
      canvas.width = this.canvWidth;
      canvas.height = this.canvHeight;
      canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, this.canvWidth, this.canvHeight);
      // 把canvas图像转为img图片
      this.img = document.getElementById("img");
      this.img.src = canvas.toDataURL("image/jpeg");
      this.imageUrl = canvas.toDataURL("image/jpeg");
      this.frontUploaded = true;
      this.frontPhoto = canvas.toDataURL("image/jpeg");
      this.imageFileData = this.imageUrl
        .replace("data:image/jpeg;base64,", "jpeg:")
        .replace("data:image/png;base64,", "png:")
        .replace("data:image/jpg;base64,", "jpg:");
      this.checkImageQuality(this.imageFileData);
      this.mediaStreamTrack.stop();
      this.shootPhotoDialogVisible = false;
      // console.log(this.imageFileData);
    },
    shootPhoto() {
      this.canvas = document.getElementById("canvas");
      var _this = this;
      _this.shootPhotoDialogVisible = true;
      _this.shootPhotoShow = false;
      setTimeout(() => {
        _this.video = document.getElementById("video");
        console.log(_this.video);
        // 媒体对象
        window.navigator.getMedia =
          window.navigator.getUserMedia ||
          window.navigator.webkitGetUserMedia ||
          window.navigator.mozGetUserMedia ||
          window.navigator.msGetUserMedia;
        if (window.navigator.getMedia) {
          window.navigator.getMedia(
            {
              // video: {
              //   width: { min: 1024, ideal: 1280, max: 1920 },
              //   height: { min: 776, ideal: 720, max: 1080 }
              // },
              video: {
                width: { min: 1280 },
                height: { min: 720 }
              },
              audio: false // 不适用音频
            },
            function(strem) {
              _this.mediaStreamTrack = strem.getTracks()[0];
              try {
                _this.video.src = _this.vendorUrl.createObjectURL(strem);
              } catch (e) {
                _this.video.srcObject = strem;
              }
              _this.video.play();
              _this.video.addEventListener("loadedmetadata", function() {
                _this.canvWidth = this.videoWidth;
                _this.canvHeight = this.videoHeight;
              });
            },
            function(error) {
              console.log(error);
              _this.shootPhotoDialogVisible = false;
              alert("未捕捉到摄像头");
            }
          );
        } else {
          alert("不支持摄像头");
          _this.shootPhotoDialogVisible = false;
        }
      }, 100);
    },
    handleClosePhoto() {
      this.mediaStreamTrack.stop();
      this.shootPhotoDialogVisible = false;
    },
    viewSingleDetail(row) {
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
      this.detailDialog = true;
      // var that = this;
      this.$http
        .get(
          this.api +
            "/iacapp-v1/project/" +
            this.projectUuid +
            "/personnel/info/" +
            row.staffUuid
        )
        .then(res => {
          console.log("查看人员详情====", res);
          if (res.status === 200) {
            if (res.data.success) {
              if (res.data.data.lifePictureUrl) {
                this.viewFontPhoto =
                  this.WIamgeurl + res.data.data.lifePictureUrl;
              } else {
                this.viewFontPhoto = "";
              }
              this.viewStaffName = res.data.data.staffName;
              this.viewSexVal = this.$common.getEnumItemName(
                "gender",
                res.data.data.gender
              );
              this.viewNation = this.$common.getEnumItemName(
                "nation",
                res.data.data.nation
              );
              this.viewIdNumber = res.data.data.credentialNo;
              this.viewPhoneNum = res.data.data.cellphone;
              this.viewTelephone = res.data.data.fixedLine;
              this.viewEmail = res.data.data.email;
              this.viewDegree = this.$common.getEnumItemName(
                "edu",
                res.data.data.education
              );
              this.viewNationality = this.$common.getEnumItemName(
                "nationality",
                res.data.data.nationality
              );
              this.viewNativePlace = res.data.data.nativePlace;
              this.viewAdress = res.data.data.address;
              this.viewOrgUuid = res.data.data.baseOrgInfos; // 部门
              this.viewTagUuids = res.data.data.tagInofShows; // 标签====
              this.viewDuty = res.data.data.jobTitle;
              if (res.data.data.isLeader === 0) {
                // 身份
                this.viewIdentity = "普通员工";
              } else {
                this.viewIdentity = "上级";
              }
              this.viewApartment = res.data.data.leaderOrg; // 负责部门
              this.viewNickName = res.data.data.nickName; // 别名
              this.viewRemarks = res.data.data.remarks;
              this.viewMaritalStatus = this.$common.getEnumItemName(
                "marital",
                res.data.data.maritalStatus
              );
              this.viewCardList = res.data.data.cardList;
              this.viewFingerprintList = res.data.data.fingerprintList;
              this.viewDelayTime = res.data.data.openDelayTime;
              this.viewTimeRange = res.data.data.longTerm; // 有效期
              this.viewTrafficAuthList = res.data.data.trafficAuthList;
              this.viewVisitorAuthList = res.data.data.visitorAuthList;
              document.getElementById("trafficAuthList").style.height =
                this.viewTrafficAuthList.length * 20 + "px";
              this.viewBeginTime = res.data.data.beginTime;
              this.viewEndTime = res.data.data.endTime;
              if (this.viewBeginTime) {
                var new111 = new Date(this.viewBeginTime);
                this.viewBeginTime =
                  new111.getFullYear() +
                  "-" +
                  addZero(new111.getMonth() + 1) +
                  "-" +
                  addZero(new111.getDate());
              }
              if (this.viewEndTime) {
                var new222 = new Date(this.viewEndTime);
                this.viewEndTime =
                  new222.getFullYear() +
                  "-" +
                  addZero(new222.getMonth() + 1) +
                  "-" +
                  addZero(new222.getDate());
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    deletePersonSingle(res) {
      this.deleteDialog = true;
      this.staffUuidList = [];
      this.staffUuidList.push(res.staffUuid);
    },
    deletePerson() {
      if (this.isOrganiza) {
        this.currentPage1 = 1;
        this.deleteOrgPerson();
      } else {
        this.currentPage2 = 1;
        this.deleteLabelPerson();
      }
    },
    deleteOrgPerson(res) {
      // 删除人员
      if (this.staffUuidList.length === 0) {
        this.$message({
          message: "请选择人员",
          type: "error"
        });
      } else {
        this.$http
          .delete(
            this.api +
              "/iacapp-v1/project/" +
              this.projectUuid +
              "/personnel/info/",
            { data: this.staffUuidList }
          )
          .then(res => {
            if (res.status === 200) {
              if (res.data.success) {
                // this.$refs.leftMenu.getOrgTree();
                this.staffUuidList = [];
                if (this.isOrganiza) {
                  this.clickNodeList();
                } else {
                  this.clickLabelList();
                }
                this.deleteDialog = false;
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            console.log("请求错误：" + err);
          });
      }
    },
    deleteLabelPerson(res) {
      // 删除标签人员
      if (this.staffUuidList.length === 0) {
        this.$message({
          message: "请选择人员",
          type: "error"
        });
      } else {
        let staffUuidList = [];
        for (var i = 0; i < this.staffUuidList.length; i++) {
          var obj = {
            elementUuid: this.staffUuidList[i],
            tagUuid: this.labelTagUuid,
            version: this.labelVersion
          };
          staffUuidList.push(obj);
        }
        this.$http
          .delete(
            this.api +
              "/basedata-v1/project/" +
              this.projectUuid +
              "/tagElement/del/",
            { data: staffUuidList }
          )
          .then(res => {
            if (res.status === 200) {
              if (res.data.success) {
                this.staffUuidList = [];
                if (this.isOrganiza) {
                  this.clickNodeList();
                } else {
                  // this.clickLabelList();
                  this.$refs.leftMenu.getOrgTag(true, this.labelTagUuid);
                }
                this.deleteDialog = false;
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            console.log("请求错误：" + err);
          });
      }
    },
    newPersonList() {
      this.source = "";
      this.frontUploaded = false;
      this.frontPhoto = "";
      this.imageFileData = "";
      this.censusRegister = "";
      this.startTime = null;
      this.phoneNum = "";
      this.idType = "";
      this.idNumber = "";
      this.degree = "";
      this.email = "";
      this.endTime = null;
      this.telephone = "";
      this.sexVal = "male";
      this.imageFileData = "";
      this.duty = "";
      this.timeRange = "1";
      this.marital = "";
      this.nation = "";
      this.nationality = "";
      this.nativePlace = "";
      this.delayTime = 0;
      this.remark = "";
      this.staffName = "";
      this.staffInfo = "0";
      this.leaderOrgUuid = [];
      this.tagUuids = [];
      this.islListWrap1 = false;
      this.islListWrap2 = false;
      this.islListWrap3 = false;
      this.islListWrap4 = false;
      this.islListWrap5 = false;
      this.$refs.tree2.setCheckedKeys([]);
      this.$refs.tree3.setCheckedKeys([]);
      this.checkedNode1 = [];
      this.checkedNode2 = [];
      this.checkedNode3 = [];
      this.labelUuid = [];
      this.nickName = "";
      this.apartmentUuid = [];
      this.initApartmentTree();
    },
    clickNodeAll(res) {
      this.clearSearchInfo();
      if (this.chartTitle === "") {
        this.chartTitle = res.orgName;
      }
      if (this.isOrganiza) {
        this.setOrgUuid = res.id;
        this.setOrgName = res.orgName;
        this.initApartmentTree();
        this.clickNode(res);
      } else {
        this.currentPage2 = 1;
        this.labelName = res.tagName;
        this.labelTagUuid = res.tagUuid;
        this.labelVersion = res.version;
        this.labelTagType = res.tagType;
        this.clickLabelList();
        console.log("查看标签===", res);
      }
    },
    initApartmentTree() {
      this.checkedNode5 = [];
      this.apartmentUuid = [];
      this.apartmentUuid.push(this.setOrgUuid);
      var obj = {
        id: this.setOrgUuid,
        label: this.setOrgName
      };
      this.checkedNode5.push(obj);
    },
    clickNode(res) {
      // 查询员工管理列表
      console.log("res==", res);
      if (res) {
        if (this.isImageForm) {
          this.viewGroupName = res.orgName;
          this.clickNodeId = res.id;
          this.getImageList();
        } else {
          this.viewGroupName = res.orgName;
          this.clickNodeId = res.id;
          let h =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight; // height
          this.pageSize1 = parseInt((h - 235) / 52) - 1;
          this.currentPage1 = 1;
        }
      }
      this.clickNodeList();
    },
    getImageList() {
      // 图片列表
      this.isImageForm = true;
      this.isListForm = false;
      this.pageSize1 = 30;
      this.currentPage1 = 1;
      this.clickNode();
    },
    getFormList() {
      // 表格列表
      this.isImageForm = false;
      this.isListForm = true;
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight; // height
      this.pageSize1 = parseInt((h - 235) / 52) - 1;
      this.currentPage1 = 1;
      this.clickNode();
    },
    clickNodeList() {
      if (this.clickNodeId === "") {
        return;
      }
      this.tableData = [];
      this.mainListLoading1 = true;
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
      if (this.searchEndTime) {
        var new111 = new Date(this.searchEndTime);
        this.searchEndTime =
          new111.getFullYear() +
          "-" +
          addZero(new111.getMonth() + 1) +
          "-" +
          addZero(new111.getDate()) +
          " " +
          "23:59:59";
      }
      this.$http
        .get(
          this.api +
            "/sppc-iacapp-service-v1/project/" +
            this.projectUuid +
            "/personnel/info/list?page=" +
            this.currentPage1 +
            "&limit=" +
            this.pageSize1 +
            "&projectUuid=" +
            this.projectUuid +
            "&queryType=organization" +
            "&queryTypeUuid=" +
            this.clickNodeId +
            "&staffName=" +
            this.searchName +
            "&cellphone=" +
            this.searchPhone +
            "&createTimeStart=" +
            this.searchStartTime +
            "&createTimeOver=" +
            this.searchEndTime +
            "&gender=" +
            this.searchSexVal +
            "&orgName=" +
            this.searchApartment
        )
        .then(res => {
          console.log("查询员工管理列表====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.tableData = res.data.data.list;
              this.pageTotal1 = res.data.data.total;
              this.totalStaff = res.data.data.total;
              console.log("isTableStyle===", this.isTableStyle);
              if (this.isImageForm) {
                this.tableData = res.data.data.list.reverse();
                setTimeout(() => {
                  var elems = document.querySelectorAll("#mainImg");
                  for (let index = 0; index < elems.length; index++) {
                    elems[index].style.width =
                      document.getElementById("singleCell").offsetWidth -
                      16 +
                      "px";
                    elems[index].style.height =
                      document.getElementById("singleCell").offsetWidth -
                      16 +
                      "px";
                  }
                }, 0);
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
          if (this.isImageForm) {
            setTimeout(() => {
              this.mainListLoading1 = false;
            }, 1000);
          } else {
            this.mainListLoading1 = false;
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    clickLabelList() {
      if (this.labelTagUuid === "") {
        return;
      }
      this.mainListLoading1 = true;
      this.$http
        .get(
          this.api +
            "/sppc-iacapp-service-v1/project/" +
            this.projectUuid +
            "/personnel/info/list?page=" +
            this.currentPage2 +
            "&limit=" +
            this.pageSize2 +
            "&projectUuid=" +
            this.projectUuid +
            "&queryType=staffLabel" +
            "&queryTypeUuid=" +
            this.labelTagUuid
        )
        .then(res => {
          console.log("查询标签列表====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.tableData1 = res.data.data.list;
              this.pageTotal2 = res.data.data.total;
              this.labelNumber = res.data.data.total;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
          this.mainListLoading1 = false;
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    editPersonSingle(res) {
      console.log("res==", res);
      this.addEditMembers = true;
      this.isListForm = false;
      this.isImageForm = false;
      this.newPersonList();
      this.addEditMember = "edit";
      this.editStaffUuid = res.staffUuid;
      this.$http
        .get(
          this.api +
            "/iacapp-v1/project/" +
            this.projectUuid +
            "/personnel/info/" +
            res.staffUuid
        )
        .then(res => {
          console.log("编辑人员详情====", res);
          if (res.status === 200) {
            if (res.data.success) {
              if (res.data.data.lifePictureUrl) {
                this.frontPhoto = this.WIamgeurl + res.data.data.lifePictureUrl;
                this.frontUploaded = true;
                this.imageFileData = "";
                this.editLifePicture = res.data.data.lifePictureUrl;
              }
              this.imageFileData = ""; // base64
              this.staffName = res.data.data.staffName;
              this.sexVal = res.data.data.gender
                ? res.data.data.gender
                : "male";
              this.nation = res.data.data.nation;
              this.idNumber = res.data.data.credentialNo;
              this.phoneNum = res.data.data.cellphone;
              this.telephone = res.data.data.fixedLine;
              this.email = res.data.data.email;
              this.degree = res.data.data.education;
              this.nationality = res.data.data.nationality;
              this.nativePlace = res.data.data.nativePlace;
              this.adress = res.data.data.address;
              this.tagUuids = res.data.data.tagInofs; // 标签====
              this.duty = res.data.data.jobTitle;
              this.staffInfo = res.data.data.isLeader.toString(); // 身份
              this.cardList = res.data.data.cardList;
              this.fingerprintList = res.data.data.fingerprintList;
              this.delayTime = res.data.data.openDelayTime;
              this.timeRange = res.data.data.longTerm; // 有效期
              this.trafficAuthList = res.data.data.trafficAuthList;
              this.visitorAuthList = res.data.data.visitorAuthList;
              this.idType = res.data.data.credential;
              this.censusRegister = res.data.data.address;
              this.remark = res.data.data.remarks;
              this.startTime =
                res.data.data.beginTime === "" ? null : res.data.data.beginTime;
              this.endTime =
                res.data.data.endTime === "" ? null : res.data.data.endTime;
              this.marital = res.data.data.maritalStatus;
              this.nickName = res.data.data.nickName;
              this.versionName = res.data.data.version;
              this.source = res.data.data.source;
              if (res.data.data.longTerm) {
                this.timeRange = "1";
              } else {
                this.timeRange = "0";
              }
              var trafficAuthList = [];
              for (var i = 0; i < res.data.data.trafficAuthList.length; i++) {
                trafficAuthList.push(
                  res.data.data.trafficAuthList[i].groupUuid
                );
              }
              var visitorAuthList = [];
              for (var p = 0; p < res.data.data.visitorAuthList.length; p++) {
                visitorAuthList.push(
                  res.data.data.visitorAuthList[p].groupUuid
                );
              }
              this.apartmentUuid = [];
              this.checkedNode5 = [];
              for (var j = 0; j < res.data.data.baseOrgInfos.length; j++) {
                // 部门
                this.apartmentUuid.push(res.data.data.baseOrgInfos[j].orgUuid);
                var node5 = {
                  id: res.data.data.baseOrgInfos[j].orgUuid,
                  label: res.data.data.baseOrgInfos[j].orgName
                };
                this.checkedNode5.push(node5);
              }
              this.leaderOrgUuid = [];
              if (res.data.data.leaderOrg) {
                for (var y = 0; y < res.data.data.leaderOrg.length; y++) {
                  // 部门
                  this.leaderOrgUuid.push(res.data.data.leaderOrg[y].orgUuid);
                }
              }
              this.checkedNode2 = [];
              for (var k = 0; k < res.data.data.tagInofShows.length; k++) {
                // 部门
                this.labelUuid.push(res.data.data.tagInofShows[k].tagUuid);
                var node2 = {
                  id: res.data.data.tagInofShows[k].tagUuid,
                  label: res.data.data.tagInofShows[k].tagName
                };
                this.checkedNode2.push(node2);
              }
              this.$refs.tree2.setCheckedKeys(trafficAuthList);
              this.$refs.tree3.setCheckedKeys(visitorAuthList);
              var cardList = res.data.data.cardList;
              if (cardList.length === 1) {
                this.islListWrap1 = true;
                this.islListWrap2 = false;
                this.islListWrap3 = false;
                this.islListWrap4 = false;
                this.islListWrap5 = false;
                this.cardNoWrap1 = cardList[0].cardId;
                this.cardFuncName1 = cardList[0].function;
                this.cardNameWrap1 = cardList[0].cardName;
                if (cardList[0].cardEnable === 1) {
                  this.isSwitch1 = "已启用";
                } else {
                  this.isSwitch1 = "已禁用";
                }
              }
              if (cardList.length === 2) {
                this.islListWrap1 = true;
                this.islListWrap2 = true;
                this.islListWrap3 = false;
                this.islListWrap4 = false;
                this.islListWrap5 = false;
                this.cardNoWrap1 = cardList[0].cardId;
                this.cardFuncName1 = cardList[0].function;
                this.cardNameWrap1 = cardList[0].cardName;
                if (cardList[0].cardEnable === 1) {
                  this.isSwitch1 = "已启用";
                } else {
                  this.isSwitch1 = "已禁用";
                }
                this.cardNoWrap2 = cardList[1].cardId;
                this.cardFuncName2 = cardList[1].function;
                this.cardNameWrap2 = cardList[1].cardName;
                if (cardList[1].cardEnable === 1) {
                  this.isSwitch2 = "已启用";
                } else {
                  this.isSwitch2 = "已禁用";
                }
              }
              if (cardList.length === 3) {
                this.islListWrap1 = true;
                this.islListWrap2 = true;
                this.islListWrap3 = true;
                this.islListWrap4 = false;
                this.islListWrap5 = false;
                this.cardNoWrap1 = cardList[0].cardId;
                this.cardFuncName1 = cardList[0].function;
                this.cardNameWrap1 = cardList[0].cardName;
                if (cardList[0].cardEnable === 1) {
                  this.isSwitch1 = "已启用";
                } else {
                  this.isSwitch1 = "已禁用";
                }
                this.cardNoWrap2 = cardList[1].cardId;
                this.cardFuncName2 = cardList[1].function;
                this.cardNameWrap2 = cardList[1].cardName;
                if (cardList[1].cardEnable === 1) {
                  this.isSwitch2 = "已启用";
                } else {
                  this.isSwitch2 = "已禁用";
                }
                this.cardNoWrap3 = cardList[2].cardId;
                this.cardFuncName3 = cardList[2].function;
                this.cardNameWrap3 = cardList[2].cardName;
                if (cardList[2].cardEnable === 1) {
                  this.isSwitch3 = "已启用";
                } else {
                  this.isSwitch3 = "已禁用";
                }
              }
              if (cardList.length === 4) {
                this.islListWrap1 = true;
                this.islListWrap2 = true;
                this.islListWrap3 = true;
                this.islListWrap4 = true;
                this.islListWrap5 = false;
                this.cardNoWrap1 = cardList[0].cardId;
                this.cardFuncName1 = cardList[0].function;
                this.cardNameWrap1 = cardList[0].cardName;
                if (cardList[0].cardEnable === 1) {
                  this.isSwitch1 = "已启用";
                } else {
                  this.isSwitch1 = "已禁用";
                }
                this.cardNoWrap2 = cardList[1].cardId;
                this.cardFuncName2 = cardList[1].function;
                this.cardNameWrap2 = cardList[1].cardName;
                if (cardList[1].cardEnable === 1) {
                  this.isSwitch2 = "已启用";
                } else {
                  this.isSwitch2 = "已禁用";
                }
                this.cardNoWrap3 = cardList[2].cardId;
                this.cardFuncName3 = cardList[2].function;
                this.cardNameWrap3 = cardList[2].cardName;
                if (cardList[2].cardEnable === 1) {
                  this.isSwitch3 = "已启用";
                } else {
                  this.isSwitch3 = "已禁用";
                }
                this.cardNoWrap4 = cardList[3].cardId;
                this.cardFuncName4 = cardList[3].function;
                this.cardNameWrap4 = cardList[3].cardName;
                if (cardList[3].cardEnable === 1) {
                  this.isSwitch4 = "已启用";
                } else {
                  this.isSwitch4 = "已禁用";
                }
              }
              if (cardList.length === 4) {
                this.islListWrap1 = true;
                this.islListWrap2 = true;
                this.islListWrap3 = true;
                this.islListWrap4 = true;
                this.islListWrap5 = false;
                this.cardNoWrap1 = cardList[0].cardId;
                this.cardFuncName1 = cardList[0].function;
                this.cardNameWrap1 = cardList[0].cardName;
                if (cardList[0].cardEnable === 1) {
                  this.isSwitch1 = "已启用";
                } else {
                  this.isSwitch1 = "已禁用";
                }
                this.cardNoWrap2 = cardList[1].cardId;
                this.cardFuncName2 = cardList[1].function;
                this.cardNameWrap2 = cardList[1].cardName;
                if (cardList[1].cardEnable === 1) {
                  this.isSwitch2 = "已启用";
                } else {
                  this.isSwitch2 = "已禁用";
                }
                this.cardNoWrap3 = cardList[2].cardId;
                this.cardFuncName3 = cardList[2].function;
                this.cardNameWrap3 = cardList[2].cardName;
                if (cardList[2].cardEnable === 1) {
                  this.isSwitch3 = "已启用";
                } else {
                  this.isSwitch3 = "已禁用";
                }
                this.cardNoWrap4 = cardList[3].cardId;
                this.cardFuncName4 = cardList[3].function;
                this.cardNameWrap4 = cardList[3].cardName;
                if (cardList[3].cardEnable === 1) {
                  this.isSwitch4 = "已启用";
                } else {
                  this.isSwitch4 = "已禁用";
                }
                this.cardNoWrap5 = cardList[4].cardId;
                this.cardFuncName5 = cardList[4].function;
                this.cardNameWrap5 = cardList[4].cardName;
                if (cardList[4].cardEnable === 1) {
                  this.isSwitch5 = "已启用";
                } else {
                  this.isSwitch5 = "已禁用";
                }
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    // 全选或反全选
    checkedAllChange(val) {
      if (val) {
        // 全选了
        this.staffUuidList = [];
        this.tableData.forEach(element => {
          element.checked = true;
          this.staffUuidList.push(element.staffUuid);
        });
      } else {
        // 取消全选
        if (this.tableData.length === this.staffUuidList.length) {
          this.staffUuidList = [];
          this.tableData.forEach(element => {
            element.checked = false;
          });
        }
      }
    },
    checkBoxChange(val) {
      let i = this.staffUuidList.indexOf(val.staffUuid);
      if (i === -1) {
        this.staffUuidList.push(val.staffUuid);
      } else {
        this.staffUuidList.splice(i, 1);
      }
      this.seleactAll = this.staffUuidList.length === this.tableData.length;
    },
    clearSearchInfo() {
      this.searchPhone = null;
      this.searchApartment = null;
      this.searchStartTime = null;
      this.searchEndTime = null;
      this.searchSexVal = null;
    },
    changeLeftMenu(index) {
      if (index === "1") {
        this.$refs.leftMenu.deal("changeName");
      } else if (index === "2") {
        this.$refs.leftMenu.deal("addChildre");
      }
    },
    checkImageQuality(iamge) {
      // 人脸图片质量是否合格
      this.$http
        .post(this.api + "/sppc-iacapp-service-v1/image/isQualified", {
          imageBase64: iamge
        })
        .then(res => {
          console.log("新增人员====", res);
          if (res.status === 200) {
            if (res.data.success) {
              if (res.data.data) {
                this.$message({
                  message: "上传成功",
                  type: "success"
                });
              } else {
                this.deleteUpload();
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            } else {
              this.deleteUpload();
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.deleteUpload();
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.deleteUpload();
          console.log("请求错误：" + err);
        });
    },
    setApartmentLeader() {
      if (this.staffUuidList.length === 0) {
        this.$message({
          message: "请选择人员",
          type: "error"
        });
      } else {
        this.$http
          .post(
            this.api +
              "/iacapp-v1/project/" +
              this.projectUuid +
              "/department/leader",
            {
              orgUuid: this.setOrgUuid,
              staffUuids: this.staffUuidList
            }
          )
          .then(res => {
            console.log("设置部门上级====", res);
            if (res.status === 200) {
              if (res.data.success) {
                this.clickNodeList();
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            console.log("请求错误：" + err);
          });
      }
    },
    setStaffApartment() {
      if (this.staffUuidList.length === 0) {
        this.$message({
          message: "请选择人员",
          type: "error"
        });
      } else {
        this.$http
          .post(
            this.api +
              "/iacapp-v1/project/" +
              this.projectUuid +
              "/department/staff",
            {
              orgUuids: this.setStaffOrgUuid,
              staffUuids: this.staffUuidList
            }
          )
          .then(res => {
            console.log("设置部门上级====", res);
            if (res.status === 200) {
              if (res.data.success) {
                this.clickNodeList();
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            console.log("请求错误：" + err);
          });
      }
    },
    deleteAprtment(index, item) {
      this.checkedNode5.splice(index, 1);
      this.onConfirm5(this.checkedNode5);
      this.getMsgToDeviceDialogVisiable5 = false;
    },
    deleteAddCell(index, item) {
      this.checkedNode2.splice(index, 1);
      this.onConfirm3(this.checkedNode2);
      this.addMsgToDeviceDialogVisiable = false;
    },
    viewLabelDetail() {
      if (!this.labelTagUuid) {
        this.$message.error("请选中标签!");
        return;
      }
      this.labelDetailDialog = true;
      this.$http
        .get(
          this.api +
            "/basedata-v1/project/" +
            this.projectUuid +
            "/tag/" +
            this.labelTagUuid +
            `/tagElement/staff`
        )
        .then(res => {
          console.log("查看标签详情====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.viewLalelApartment = res.data.data.organization || 0;
              this.viewLalelMember = res.data.data.staff || 0;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    },
    closeAddEdit() {
      if (this.isTableStyle) {
        this.addEditMembers = false;
        this.isListForm = true;
        this.isImageForm = false;
      } else {
        this.addEditMembers = false;
        this.isImageForm = true;
        this.isListForm = false;
        var length1 =
          document.getElementById("singleCell").offsetWidth - 16 + "px";
        var elems = document.querySelectorAll("#mainImg");
        for (let index = 0; index < elems.length; index++) {
          elems[index].style.width = length1;
          elems[index].style.height = length1;
          document.querySelectorAll("#singleCell")[index].style.height =
            length1 + 50 + "px";
        }
      }
    },
    peopleStatistics() {
      this.dataChartDialog = true;
      this.$http
        .get(
          this.api +
            "/iacapp-v1/project/" +
            this.projectUuid +
            "/staff/statistics/humanResources"
        )
        .then(res => {
          console.log("查看人员统计====", res);
          if (res.status === 200) {
            if (res.data.success) {
              this.pieData[0].value = res.data.data.total;
              this.pieData[1].value = res.data.data.male;
              this.pieData[2].value = res.data.data.female;
              this.pieData[3].value = res.data.data.photos;
              this.pieData[4].value = res.data.data.fingerprints;
              this.pieData[5].value = res.data.data.mediums;
              this.startDraw();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log("请求错误：" + err);
        });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    filterText3(val) {
      this.$refs.tree3.filter(val);
    },
    isShow(val) {
      console.log(val);
      // 初始化弹窗数据
      setTimeout(() => {
        this.drawPie();
      }, 0);
    },
    getMsgToDeviceDialogVisiable(val) {
      if (val) {
        this.checkedNode1 = [];
        console.log("======chekedNodeArr=======", this.checkedNode);
      }
    },
    addLabelDialogVisiable(val) {
      if (val) {
        this.checkedNode3 = [];
        console.log("======chekedNodeArr=======", this.checkedNode);
      }
    }
  },
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.personMange {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: row;
  justify-content: space-between;
  box-sizing: border-box;
}
.personMange .rightmenu {
  flex: 1;
  margin-right: 15px;
  background: #212325;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.personMange .el-dialog {
  margin-top: 1vh !important;
}
.personMange .el-dialog__footer {
  padding-bottom: 15px;
  margin-top: -15px;
}
.personMange .el-dialog__wrapper {
  overflow: auto;
}
.personMange .rightmenu .listForm {
  width: 100%;
  height: 100%;
}
.personMange .rightmenu .listForm .head {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #1b1b1b;
}
.personMange .rightmenu .listForm .head .title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #dddddd;
  text-align: justify;
  padding-left: 10px;
  box-sizing: border-box;
}
.personMange .rightmenu .listForm .head .carte {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #26d39d;
  text-align: justify;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .listForm .head .carte div:nth-child(1) {
  padding-right: 25px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .listForm .head .carte div:nth-child(1) img {
  width: 12px;
  height: 12px;
  margin-right: 8px;
}
.personMange .rightmenu .listForm .head .carte div:nth-child(2) {
  padding: 0 24px 0 21px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .listForm .head .carte div:nth-child(2) img {
  width: 13px;
  height: 11.4px;
  margin-right: 7px;
}
.personMange .rightmenu .listForm .head .carte div:nth-child(3) {
  padding: 0 26px 0 21px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .listForm .head .carte div:nth-child(3) img {
  width: 12px;
  height: 12px;
  margin-right: 6px;
}
.personMange .rightmenu .listForm .listWrap {
  width: 100%;
  height: 100%;
  background: #212325;
  border-radius: 2px 2px 2px 2px 0px 0px;
  padding: 0 30px;
  box-sizing: border-box;
  margin-bottom: 30px;
}
.personMange .rightmenu .listForm .listWrap .bthWrap {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.personMange .rightmenu .listForm .listWrap .el-button {
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
.personMange .rightmenu .listForm .listWrap .el-input__inner {
  height: 32px;
}
.personMange .rightmenu .listForm .listWrap .bthWrap .right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .listForm .listWrap .sp {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #fff;
  text-align: right;
  margin-right: 4px;
}
.personMange .rightmenu .listForm .listWrap .search {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.personMange .rightmenu .listForm .listWrap .search span {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.personMange .rightmenu .listForm .listWrap .search img {
  margin: 0 7px 0 13px;
}
.personMange .rightmenu .listForm .listWrap .switch {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.personMange .rightmenu .listForm .listWrap .switch span {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.personMange .rightmenu .listForm .listWrap .switch img {
  margin: 0 5px 0 16px;
}
.personMange .el-table--enable-row-transition .el-table__body td {
  height: 50px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
}
.personMange .el-table th.is-leaf {
  height: 36px;
}
.personMange .rightmenu .addMembers {
  width: 100%;
  height: auto;
  border-radius: 2px 2px 2px 2px 0px 0px;
  background: #1b1b1b;
}
.personMange .rightmenu .addMembers .title {
  width: 100%;
  height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.personMange .rightmenu .addMembers .el-button {
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
.personMange .rightmenu .addMembers .el-input__inner {
  height: 30px;
}
.personMange .rightmenu .addMembers .title .text {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 4px;
  box-sizing: border-box;
}
.personMange .rightmenu .addMembers .title .text span:first-child {
  display: block;
  width: 3px;
  height: 14px;
  background: #20cc96;
  margin-right: 10px;
}
.personMange .rightmenu .addMembers .requireInfo {
  width: 100%;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  box-sizing: border-box;
}
.personMange .rightmenu .addMembers .infoWrap {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}
.personMange .rightmenu .addMembers .infoWrap .left {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  font-family: PingFangSC-Regular;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  text-align: right;
}
.personMange .rightmenu .addMembers .infoWrap .right1 {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 0 5px 23px;
  box-sizing: border-box;
  justify-content: space-between;
}
.personMange .rightmenu .addMembers .infoWrap .right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 0 5px 23px;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.personMange .rightmenu .addMembers .infoWrap .apartment {
  display: block;
  flex: none;
  width: 70%;
}
.personMange .rightmenu .addMembers .photoWrap {
  height: 112px;
}
.personMange .rightmenu .addMembers .photoWrap .left {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
}
.personMange .rightmenu .addMembers .photoWrap .leftCon {
  width: 92px;
  height: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 30px;
  box-sizing: border-box;
  position: relative;
}
.personMange .rightmenu .addMembers .photoWrap .leftCon .imgWrap {
  width: 100%;
  height: 17px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.personMange .rightmenu .addMembers .photoWrap .leftCon .first {
  margin: 30px 0 16px 0;
}
.personMange .rightmenu .addMembers .photoWrap .leftCon .imgWrap img {
  width: 14px;
  margin-right: 8px;
}
.personMange .rightmenu .addMembers .photoWrap .upload-multiple {
  width: 92px;
  height: 112px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 500;
}
.personMange .rightmenu .addMembers .photoWrap .upload-multiple .uploadWrap {
  width: 92px;
  height: 112px;
  position: absolute;
  left: 0;
  top: 0;
}
.personMange .rightmenu .addMembers .photoWrap .alreadyUploaded {
  width: 94px;
  height: 114px;
  position: absolute;
  left: -2px;
  top: -2px;
  z-index: 2000;
}
.personMange .rightmenu .addMembers .photoWrap .alreadyUploaded img {
  width: 94px;
  height: 114px;
}
.personMange .rightmenu .addMembers .photoWrap .alreadyUploaded .delete {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  position: absolute;
  right: 4px;
  top: 4px;
  background: url("./../../../assets/images/personMange/delete.png") no-repeat;
  background-position: center center;
  z-index: 2000;
  background-size: 10px 10px;
}
.personMange .rightmenu .addMembers .infoWrap .right1 div:first-child span {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #ff5f5f;
}
.personMange .rightmenu .addMembers .infoWrap .right .el-radio {
  margin-right: 12px;
}
.personMange .cellComponet {
  width: 100px;
  height: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  padding-left: 9px;
  box-sizing: border-box;
  position: relative;
}
.personMange .apartment .cellComponet {
  float: left;
  margin-bottom: 10px;
}
.personMange .cellComponet img {
  margin-right: 7px;
}
.personMange .cellComponet .delete {
  width: 13px;
  height: 13px;
  background: red;
  position: absolute;
  right: -5px;
  top: -5px;
  background: url("./../../../assets/images/personMange/delete.png") no-repeat;
  background-position: center center;
  z-index: 2000;
  background-size: 13px 13px;
}
.personMange .rightmenu .addMembers .infoWrap .right .edit {
  margin-left: 14px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  cursor: pointer;
  margin-top: 7px;
}
.personMange .rightmenu .addMembers .infoWrap .right .edit img {
  width: 9.9px;
  height: 9.9px;
  shape-margin: 7px;
}
.personMange .rightmenu .addMembers .infoWrap .more {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
.personMange .rightmenu .addMembers .infoWrap .more img {
  width: 10px;
  height: 10px;
  margin-left: 4px;
}
.personMange .rightmenu .addMembers .additionalInfo {
  width: 100%;
  height: 565px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  box-sizing: border-box;
  background: #212325;
}
.personMange .rightmenu .addMembers .accessTitle {
  width: 100px;
  height: 51px;
  box-sizing: border-box;
  background: #212325;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  position: absolute;
  top: 10px;
  left: 0;
}
.personMange .rightmenu .addMembers .accessTitle img {
  width: 10px;
  height: 12px;
  margin-right: 12px;
}
.personMange .rightmenu .addMembers .accessCon1 {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: #212325;
  padding-top: 20px;
  position: relative;
}
.personMange .rightmenu .addMembers .accessCon1 .cellComponet {
  float: left;
  margin: 0 15px 10px 0;
}
.personMange .rightmenu .addMembers .cellComponet {
  float: left;
  margin: 0 15px 10px 0;
}
.personMange .rightmenu .addMembers .accessCon1 .cellComponet span {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.personMange .rightmenu .addMembers .accessCon2 {
  width: 100%;
  height: 195px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  background: #212325;
  padding-top: 20px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
}
.personMange .rightmenu .addMembers .accessCon2 .sp {
  color: #ff5f5f;
  margin-left: 17px;
}
.personMange .rightmenu .el-input--prefix .el-input__inner {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
}
.personMange .rightmenu .el-input--prefix .el-input__inner {
  padding-left: 12px;
}
.personMange .el-date-editor .el-input__prefix {
  left: 103%;
  -webkit-transform: translateX(-200%);
  transform: translateX(-200%);
  top: -20%;
  background: url("./../../../assets/images/personMange/calendar.png") no-repeat;
  background-position: center 15px;
  z-index: 2000;
  background-size: 11.9px 10.1px;
}
.personMange .el-icon-date:before {
  content: "";
}
.personMange .rightmenu .addMembers .cardTitle {
  width: 100%;
  height: 51px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  background: #212325;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
}
.personMange .rightmenu .addMembers .cardTitle img {
  width: 12px;
  height: 10px;
  margin-right: 12px;
}
.personMange .rightmenu .addMembers .cardTitle .addWrap {
  padding: 0 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 13px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  letter-spacing: 0;
  cursor: pointer;
}
.personMange .rightmenu .addMembers .cardTitle .sp {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  letter-spacing: 0;
  cursor: pointer;
}
.personMange .rightmenu .addMembers .cardInfo {
  width: 100%;
  height: auto;
  padding-top: 21px;
  box-sizing: border-box;
  background: #212325;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 5px;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  padding-left: 166px;
  box-sizing: border-box;
}
.personMange .rightmenu .addMembers .cardInfo .listWrap {
  width: 540px;
  height: 36px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 17px 0 20px;
  box-sizing: border-box;
  margin-bottom: 21px;
}
.personMange .rightmenu .addMembers .cardInfo .listWrap .left {
  display: flex;
}
.personMange .rightmenu .addMembers .cardInfo .listWrap .left span {
  display: block;
  margin-right: 6px;
}
.personMange
  .rightmenu
  .addMembers
  .cardInfo
  .listWrap
  .right
  span:first-child {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  margin-right: 12px;
}
.personMange .rightmenu .addMembers .cardInfo .listWrap .right span:last-child {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ff5f5f;
  margin-right: 12px;
}
.personMange .rightmenu .addMembers .bottomTitle {
  width: 100%;
  height: 107px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.personMange .rightmenu .addMembers .bottomTitle .text {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  padding-left: 21px;
  box-sizing: border-box;
}
.personMange .accessChoose {
  position: absolute;
  left: 24px;
  top: 29px;
  width: 260px;
  height: 350px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
  z-index: 3000;
  padding: 12px 23px 0;
  box-sizing: border-box;
}
.personMange .accessChoose .chooseWrap {
  padding-bottom: 8px;
}
.personMange .accessChoose .wrap {
  margin-bottom: 13px;
}
.personMange .accessChoose .wrap .chooseWrap:last-child {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}
.personMange .accessChoose .el-icon-caret-right:before {
  content: none;
}
.personMange .accessChoose .el-tree {
  background: none;
}
.personMange .accessChoose .el-tree-node__content > .el-tree-node__expand-icon {
  padding-left: 0;
}
.personMange .accessChoose .el-tree-node.is-expanded > .el-tree-node__children {
  margin-left: -18px;
}
.personMange .accessChoose .el-tree div div div:nth-child(1) div:nth-child(1) {
  margin-top: 19px;
}
.personMange .accessChoose .el-tree .el-tree-node__content {
  height: 30px;
}
.personMange .accessChoose .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}
.personMange .accessChoose .filterText1 {
  width: 140px;
  height: 30px;
  position: absolute;
  right: 0;
  top: 0;
}
.personMange .accessChoose .search-icon {
  width: 12px;
  height: 12px;
  position: absolute;
  left: 82px;
  top: 10px;
  background: url("./../../../assets/images/personMange/searchTree.png")
    no-repeat;
  background-position: center center;
  background-size: contain;
}
.personMange .accessChoose .el-input__inner {
  font-size: 12px;
  padding-left: 26px;
}
.personMange .accessChoose .el-tree__empty-text {
  top: 100%;
}
.personMange .chooseMask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 32px;
  z-index: 1000;
}
.personMange .otherSearch {
  margin: 0 15px;
  position: relative;
}
.personMange .otherSearch .conditionWrap {
  width: 380px;
  height: 260px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 0;
  top: 32px;
  z-index: 1000;
  padding-top: 20px;
  box-sizing: border-box;
}
.personMange .otherSearch .conditionWrap .infoWrap {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}
.personMange .otherSearch .conditionWrap .infoWrap .left {
  width: 94px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  text-align: right;
  padding-right: 10px;
  box-sizing: border-box;
}
.personMange .otherSearch .conditionWrap .infoWrap .right {
  flex: 1;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.personMange .otherSearch .conditionWrap .infoWrap .right .reset {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #26d39d;
  letter-spacing: 0;
  margin-left: 19px;
}
.personMange .rightmenu .imageForm {
  width: 100%;
  height: 100%;
}
.personMange .rightmenu .imageForm .head {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #1b1b1b;
}
.personMange .rightmenu .imageForm .head .title {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  text-align: justify;
  padding-left: 10px;
  box-sizing: border-box;
}
.personMange .rightmenu .imageForm .head .carte {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #26d39d;
  text-align: justify;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .imageForm .head .carte div:nth-child(1) {
  padding-right: 25px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .imageForm .head .carte div:nth-child(1) img {
  width: 12px;
  height: 12px;
  margin-right: 8px;
}
.personMange .rightmenu .imageForm .head .carte div:nth-child(2) {
  padding: 0 24px 0 21px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .imageForm .head .carte div:nth-child(2) img {
  width: 13px;
  height: 11.4px;
  margin-right: 7px;
}
.personMange .rightmenu .imageForm .head .carte div:nth-child(3) {
  padding: 0 26px 0 21px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .imageForm .head .carte div:nth-child(3) img {
  width: 12px;
  height: 12px;
  margin-right: 6px;
}
.personMange .rightmenu .imageForm .listWrap {
  width: 100%;
  height: 100%;
  background: #212325;
  border-radius: 2px 2px 2px 2px 0px 0px;
  padding: 0 30px;
  box-sizing: border-box;
}
.personMange .rightmenu .imageForm .listWrap .bthWrap {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}
.personMange .rightmenu .imageForm .listWrap .el-button {
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
.personMange .rightmenu .imageForm .listWrap .el-input__inner {
  height: 32px;
}
.personMange .rightmenu .imageForm .listWrap .bthWrap .right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .imageForm .listWrap .sp {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #fff;
  text-align: right;
  margin-right: 4px;
}
.personMange .rightmenu .imageForm .listWrap .search {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.personMange .rightmenu .imageForm .listWrap .search span {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.personMange .rightmenu .imageForm .listWrap .search img {
  margin: 0 7px 0 13px;
}
.personMange .rightmenu .imageForm .listWrap .switch {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.personMange .rightmenu .imageForm .listWrap .switch span {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.personMange .rightmenu .imageForm .listWrap .switch img {
  margin: 0 5px 0 16px;
}
.personMange .rightmenu .imageForm .tableWrap .selectWrap {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .imageForm .tableWrap .selectWrap .el-checkbox__label {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
}
.personMange .rightmenu .imageForm .tableWrap .inforWrap {
  width: 100%;
}
.personMange .rightmenu .imageForm .tableWrap .inforWrap .singleCell {
  width: 8.9%;
  // height: 200px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 8px 8px 0 8px;
  box-sizing: border-box;
  position: relative;
  float: left;
  margin-right: 1.22%;
  margin-bottom: 30px;
  overflow: hidden;
}
.personMange
  .rightmenu
  .imageForm
  .tableWrap
  .inforWrap
  .singleCell:nth-child(10n) {
  margin-right: 0;
}
.personMange .rightmenu .imageForm .tableWrap .inforWrap .singleCell .mainImg {
  // width: 100%;
  // min-height: 50px;
  margin-bottom: 5px;
}
.personMange .rightmenu .imageForm .tableWrap .inforWrap .singleCell div {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.personMange .rightmenu .imageForm .tableWrap .inforWrap .singleCell .box {
  position: absolute;
  left: 16px;
  top: 16px;
}
.personMange
  .rightmenu
  .imageForm
  .tableWrap
  .inforWrap
  .singleCell
  .operationMask {
  width: 120px;
  height: 108px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 40px;
  top: 80px;
  z-index: 8000;
}
.personMange
  .rightmenu
  .imageForm
  .tableWrap
  .inforWrap
  .singleCell
  .operationMask
  div {
  width: 100%;
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  box-sizing: border-box;
}
.personMange
  .rightmenu
  .imageForm
  .tableWrap
  .inforWrap
  .singleCell
  .operationMask
  div:hover {
  background: rgba(40, 255, 187, 0.05);
}
.personMange
  .rightmenu
  .imageForm
  .tableWrap
  .inforWrap
  .singleCell
  .operationMask
  img {
  margin-right: 10px;
}
.personMange .detailWrap {
  width: 580px;
  padding: 0 40px;
  box-sizing: border-box;
  overflow: auto;
  height: 70vh;
}
.personMange .detailWrap .imageInfo {
  width: 100%;
  height: 140px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .detailWrap .imageInfo .left {
  width: 96px;
  height: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.personMange .detailWrap .imageInfo .left img {
  width: 90px;
  height: 100px;
}
.personMange .detailWrap .imageInfo .right {
  flex: 1;
  height: 140px;
  padding: 21px 0 0 25px;
  box-sizing: border-box;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
}
.personMange .detailWrap .imageInfo .right div {
  margin-bottom: 8px;
}
.personMange .detailWrap .linkInfo {
  width: 100%;
  height: 260px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding: 21px 0 22px 0;
  box-sizing: border-box;
  position: relative;
}
.personMange .detailWrap .linkInfo .leftImage {
  width: 90px;
  height: 100px;
  position: absolute;
  top: 20px;
  right: 25px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.personMange .detailWrap .linkInfo .leftImage img {
  width: 76px;
  height: 86px;
}
.personMange .detailWrap .inforWrap {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 9px;
}
.personMange .detailWrap .inforWrap .left {
  width: 96px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 2px;
  box-sizing: border-box;
}
.personMange .detailWrap .inforWrap .right {
  flex: 1;
  padding-left: 25px;
  box-sizing: border-box;
}
.personMange .detailWrap .jobInfo {
  width: 100%;
  height: 158px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  box-sizing: border-box;
}
.personMange .detailWrap .accessInfo {
  width: 100%;
  padding: 20px 0 0px 0;
  box-sizing: border-box;
}
.personMange .detailWrap .inforWrap .right .sp1 {
  width: 142px;
  margin-right: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  float: left;
}
.personMange .detailWrap .inforWrap .right .img1 {
  margin-right: 8px;
  width: 14px;
}
.personMange .detailWrap .inforWrap .colm1 {
  height: 12px;
  display: flex;
  flex-direction: column;
}
.personMange .detailWrap .inforWrap .colm1 div {
  margin-bottom: 8px;
}
.personMange .detailWrap .colm1Wrap {
  height: 40px;
}
.personMange .deleteDialog .con {
  width: 400px;
  height: 170px;
  padding-bottom: 57px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.personMange .deleteDialog .con .title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #ffffff;
  height: 21px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .deleteDialog .con .title img {
  width: 20px;
  height: 20.9px;
  margin-right: 10px;
}
.personMange .deleteDialog .con .btnWrap {
  margin-top: 37px;
}
.personMange .deleteDialog .con .btnWrap .el-button {
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
.personMange .deleteDialog .el-dialog__title {
  border-left: none;
}
.personMange .deleteDialog .el-dialog__header {
  border-bottom: none;
}
.personMange .editDialog .con {
  width: 440px;
  height: 190px;
  padding-bottom: 73px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.personMange .editDialog .con .nameWrap {
  width: 440px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .editDialog .con .nameWrap .title {
  width: 104px;
  height: 30px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  padding-right: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.personMange .editDialog .con .btnWrap {
  width: 440px;
  height: 30px;
  margin-top: 26px;
  padding-left: 104px;
  box-sizing: border-box;
}
.personMange .editDialog .con .btnWrap .el-button {
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
.personMange .importDialog .con {
  width: 540px;
  height: 270px;
  padding: 37px 0 56px 0;
  box-sizing: border-box;
}
.personMange .importDialog .con .download {
  width: 540px;
  height: 80px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  display: flex;
  flex-direction: row;
}
.personMange .importDialog .con .download .left {
  width: 137px;
  height: 80px;
  line-height: 17px;
  text-align: right;
}
.personMange .importDialog .con .download .middle {
  width: 200px;
  height: 80px;
  padding-left: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
}
.personMange .importDialog .con .download .right {
  flex: 1;
  height: 80px;
  padding-top: 7px;
  box-sizing: border-box;
}
.personMange .importDialog .con .download .righ img {
  width: 42px;
  height: 42px;
}
.personMange .importDialog .con .download .right div:first-child {
  width: 100%;
  padding-left: 54px;
}
.personMange .importDialog .con .download .right div:last-child {
  width: 100%;
  padding-left: 39px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  margin-top: 14px;
}
.personMange .importDialog .con .file {
  width: 540px;
  height: 17px;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  text-align: right;
}
.personMange .importDialog .con .file .title {
  width: 137px;
  height: 17px;
  line-height: 17px;
  text-align: right;
}
.personMange .importDialog .con .file .choose {
  flex: 1;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  letter-spacing: 0;
  padding-left: 12px;
  box-sizing: border-box;
}
.personMange .importDialog .con .file .choose img {
  width: 10.5px;
  height: 10.5px;
  margin-right: 5.7px;
}
.personMange .importDialog .con .btnWrap {
  width: 540px;
  height: 32px;
  padding-left: 149px;
  box-sizing: border-box;
  margin-top: 20px;
}
.personMange .importDialog .con .btnWrap .el-button {
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
.personMange .exportDialog .con {
  width: 540px;
  height: 230px;
  padding: 30px 0 77px 0;
  box-sizing: border-box;
}
.personMange .exportDialog .con .save {
  width: 540px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  text-align: right;
}
.personMange .exportDialog .con .save .title {
  width: 108px;
  height: 30px;
  padding-right: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.personMange .exportDialog .con .save .sp1 {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  text-align: right;
  margin-left: 7.4px;
}
.personMange .exportDialog .con .text {
  width: 540px;
  height: 17px;
  padding-left: 113px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #aaaaaa;
  text-align: justify;
}
.personMange .exportDialog .con .btnWrap {
  width: 540px;
  height: 32px;
  padding-left: 108px;
  box-sizing: border-box;
  margin-top: 25px;
}
.personMange .exportDialog .con .btnWrap .el-button {
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
.personMange .StaticsViewDialogClass .el-input__prefix {
  position: absolute;
  height: 100%;
  left: 5px !important;
  top: 0;
  text-align: center;
  color: #c0c4cc;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  transform: translateX(0%);
}
.personMange .StaticsViewDialogClass .el-tag-class .el-icon-close {
  color: #ffffff;
  margin-right: -12px;
  margin-top: -30px;
}
.personMange .StaticsViewDialogClass .el-tag-class .el-icon-close:hover {
  background-color: transparent;
  color: #26d39d;
}
.personMange .StaticsViewDialogClass .el-dialog {
  max-height: 58.3%;
  min-height: 40%;
}
.personMange .StaticsViewDialogClass .el-dialog__body {
  padding: 0;
  min-height: 300px;
}
.personMange #canvasPie {
  width: 100%;
  min-height: 300px;
}
.personMange .legendBox {
  font-size: 0px;
}
.personMange .StaticsViewDialogClass .legendBox p {
  font-size: 13px;
  display: inline-block;
  width: 50%;
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #dddddd;
}
$line-color: #24473f;
.personMange .StaticsViewDialogClass .legendBox .name {
  position: relative;
  box-sizing: border-box;
  span {
    display: inline-block;
    padding-left: 20px;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #dddddd;
  }
  &::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
    background-color: currentColor;
    margin-right: 10px;
  }
}
.personMange .el-dialog__body {
  height: 100%;
}
.personMange .StaticsViewDialogClass .el-header {
  width: 50%;
  height: 40px !important;
  line-height: 40px;
  margin-top: 20px;
  padding-left: 35px;
}
.personMange .el-main {
  padding: 10px 25px 10px;
}
.personMange .el-checkbox {
  margin-right: 5px;
}
.personMange .dialog-footer {
  border: {
    width: 1px 0 0 0;
    style: solid;
    color: $line-color;
  }
  .footer-button {
    margin: 17px 28px 17px 0;
  }
}
.personMange .rightmenu .labelForm {
  width: 100%;
}
.personMange .rightmenu .labelForm .head {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #1b1b1b;
}
.personMange .rightmenu .labelForm .head .title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #dddddd;
  text-align: justify;
  padding-left: 10px;
  box-sizing: border-box;
}
.personMange .rightmenu .labelForm .head .carte {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #26d39d;
  text-align: justify;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .labelForm .head .carte div:nth-child(1) {
  padding-right: 25px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .labelForm .head .carte div:nth-child(1) img {
  width: 12px;
  height: 12px;
  margin-right: 8px;
}
.personMange .rightmenu .labelForm .head .carte div:nth-child(2) {
  padding: 0 24px 0 21px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .rightmenu .labelForm .head .carte div:nth-child(2) img {
  width: 13px;
  height: 11.4px;
  margin-right: 7px;
}
.personMange .rightmenu .labelForm .listWrap {
  width: 100%;
  padding-left: 30px;
  box-sizing: border-box;
}
.personMange .rightmenu .labelForm .listWrap .bthWrap {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.personMange .rightmenu .labelForm .listWrap .el-button {
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
.personMange .rightmenu .labelForm .listWrap .el-input__inner {
  height: 32px;
}
.personMange .labelDetailDialog .con {
  width: 500px;
  height: 230px;
  padding: 41px 0 82px 0;
  box-sizing: border-box;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
}
.personMange .labelDetailDialog .con .detail1 {
  width: 500px;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .labelDetailDialog .con .detail1 .left {
  width: 145px;
  height: 17px;
  padding-left: 35px;
  box-sizing: border-box;
}
.personMange .labelDetailDialog .con .detail1 .left img {
  width: 12.2px;
  height: 7.9px;
  margin-right: 8.8px;
}
.personMange .labelDetailDialog .con .detail1 .right {
  flex: 1;
  height: 17px;
}
.personMange .labelDetailDialog .con .detail2 {
  padding-left: 145px;
  box-sizing: border-box;
  margin-top: 12px;
}
.personMange .labelDetailDialog .con .btnWrap1 {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  padding-left: 145px;
  box-sizing: border-box;
}
.personMange .labelDetailDialog .con .btnWrap1 .el-button {
  height: 30px;
  background: rgba(40, 255, 187, 0.1);
  border: 1px solid rgba(40, 255, 187, 0.35);
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  position: relative;
  padding: 0 0 0 0;
}
.personMange .page-export {
  width: 100%;
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 30px;
  box-sizing: border-box;
}
.personMange .page-export1 {
  width: 60%;
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  // padding-left: 50%;
  box-sizing: border-box;
}
.personMange .page-export .exportWrap {
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.personMange .el-pagination__editor.el-input .el-input__inner {
  height: 26px;
}
.personMange .el-pagination__editor.el-input {
  width: 40px;
}
.personMange .addCardDialog .con {
  width: 380px;
  height: 290px;
  padding: 30px 0 43px 0;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  text-align: right;
  box-sizing: border-box;
}
.personMange .addCardDialog .con .detail {
  width: 380px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}
.personMange .addCardDialog .con .detail .left {
  width: 110px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  box-sizing: border-box;
}
.personMange .addCardDialog .con .detail .right {
  flex: 1;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.personMange .addCardDialog .con .btnWrap {
  margin-top: 21px;
  display: flex;
  padding-left: 110px;
  box-sizing: border-box;
}
.personMange .addCardDialog .con .btnWrap .el-button {
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
.personMange .rightmenu .addMembers .infoWrap .rightCon {
  display: inline-block;
  width: 100%;
  flex: none;
  padding-left: 160px;
  box-sizing: border-box;
}
.personMange .rightmenu .addMembers .infoWrap .rightCon .more {
  right: 10px;
}
.personMange .closeBthWrap {
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.personMange .closeBthWrap .el-button {
  height: 30px;
  background: rgba(40, 255, 187, 0.1);
  border: 1px solid rgba(40, 255, 187, 0.35);
  border-radius: 2px;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
  position: relative;
  padding: 0 0 0 0;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #26d39d;
  background-color: transparent;
}
.personMange .rightmenu .addMembers .infoWrap .accessAdd {
  padding-bottom: 30px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}
.personMange .rightmenu .addMembers .accessAdd {
  padding-bottom: 30px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}
.personMange .rightmenu .addMembers .accessAdd .right {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
  letter-spacing: 0;
}
.personMange .rightmenu .addMembers .accessAdd .addWrap {
  color: rgba(255, 255, 255, 0.1);
}
</style>
