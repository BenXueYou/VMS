<template>
  <el-row ref="headerH"
          class="FaceHeader">
    <el-row class>
      <el-col :span="24">
        <el-menu :default-active="$route.path"
                 mode="vertical"
                 background-color
                 text-color="#DDDDDD"
                 active-text-color="#FFFFFF"
                 :router="true"
                 @select="handleSelect">
          <div class="magg">
            <el-menu-item index="/FaceManage/FaceHome"
                          :disabled="!$common.getAuthIsOwn('人脸预览', 'isShow')"
                          :class="{isActive:($route.path == '/FaceHome')}">
              <el-row class="images hover_carflow">
                <img :src="$route.path == '/FaceHome'?require('@/assets/images/faceModule/face_preview_select.png'):require('@/assets/images/faceModule/face_preview_icon.png')" />
              </el-row>人脸预览
            </el-menu-item>
            <el-submenu index="/FaceManage/Search">
              <template slot="title">
                <div class="menuItemTitle">
                  <div class="images">
                    <img :src="recordSearchImgSrc?require('@/assets/images/faceModule/record_search_select.png'):require('@/assets/images/faceModule/record_search_icon.png')"
                         alt />
                  </div>
                  <div class="text_title"
                       :class="{activeClass:this.hoverClass}">检索</div>
                </div>
              </template>
              <el-menu-item index="/FaceManage/FaceRecord"
                            :disabled="!$common.getAuthIsOwn('抓拍查询', 'isShow')">抓拍查询</el-menu-item>
              <el-menu-item index="/FaceManage/CompareRecord"
                            :disabled="!$common.getAuthIsOwn('对比查询', 'isShow')">对比查询</el-menu-item>
              <el-menu-item index="/FaceManage/searchFaceWithFace"
                            :disabled="!$common.getAuthIsOwn('以脸搜脸', 'isShow')">以脸搜脸</el-menu-item>
              <el-menu-item index="/FaceManage/faceAlarm"
                            :disabled="!$common.getAuthIsOwn('报警查询', 'isShow')">报警查询</el-menu-item>
              <el-menu-item index="/FaceManage/judgeAnalysis"
                            :disabled="!$common.getAuthIsOwn('研判查询', 'isShow')">研判查询</el-menu-item>
              <el-menu-item index="/FaceManage/OVO"
                            :disabled="!$common.getAuthIsOwn('1V1对比', 'isShow')">1V1对比</el-menu-item>
            </el-submenu>
            <el-submenu index="/FaceManage/ManBodyAnalysis"
                        :class="{isActive:($route.path == '/ManBodyAnalysis')}">
              <template slot="title">
                <div class="images">
                  <img :src="$route.path == '/ManBodyAnalysis'?require('@/assets/images/faceModule/real_sight_select.png'):require('@/assets/images/faceModule/real_sight_icon.png')" />
                </div>实景战法
              </template>
              <el-menu-item index="/FaceManage/PersonTrace"
                            :disabled="!$common.getAuthIsOwn('人员轨迹', 'isShow')">人员轨迹</el-menu-item>
              <el-menu-item index="/FaceManage/FaceAnalysisTable"
                            :disabled="!$common.getAuthIsOwn('频次分析', 'isShow')">频次分析</el-menu-item>
              <el-menu-item index="/FaceManage/Companion"
                            :disabled="!$common.getAuthIsOwn('同行人分析', 'isShow')">同行人分析</el-menu-item>
            </el-submenu>
            <el-menu-item index="/FaceManage/FaceControl"
                          :disabled="!$common.getAuthIsOwn('人脸布控', 'isShow')"
                          :class="{isActive:($route.path == '/FaceManage/FaceControl')}">
              <div class="images">
                <img :src="$route.path == '/FaceControl'?require('@/assets/images/faceModule/face_task_select.png'):require('@/assets/images/faceModule/face_task_icon.png')" />
              </div>人脸布控
            </el-menu-item>
            <el-menu-item index="/FaceManage/IntelModel"
                          :disabled="!$common.getAuthIsOwn('智能模型', 'isShow')"
                          :class="{isActive:($route.path == '/FaceManage/IntelModel')}"
                          class>
              <div class="images">
                <img :src="$route.path == '/FaceManage/IntelModel'?require('@/assets/images/faceModule/inteligent_model_select.png'):require('@/assets/images/faceModule/inteligent_model_icon.png')" />
              </div>智能模型
            </el-menu-item>
            <el-menu-item index="/FaceManage/faceDB"
                          :disabled="!$common.getAuthIsOwn('人脸库', 'isShow')"
                          :class="{isActive:($route.path == '/faceDB')}"
                          class>
              <div class="images">
                <img :src="$route.path == '/FaceManage/faceDB'?require('@/assets/images/faceModule/face_db_select.png'):require('@/assets/images/faceModule/face_db_icon.png')" />
              </div>人脸库
            </el-menu-item>
            <el-submenu index="/FaceManage/PersonFlowAnalysis">
              <div class="menuItemTitle"
                   slot="title">
                <div class="images">
                  <img :src="recordAnalysisImgSrc?require('@/assets/images/faceModule/static_analysis_select.png'):require('@/assets/images/faceModule/static_analysis_icon.png')" />
                </div>统计
              </div>
              <el-menu-item index="/FaceManage/PersonFlowAnalysis"
                            :disabled="!$common.getAuthIsOwn('抓拍统计', 'isShow')">抓拍统计</el-menu-item>
              <el-menu-item index="/FaceManage/PersonCompareCount"
                            :disabled="!$common.getAuthIsOwn('比对统计', 'isShow')">比对统计</el-menu-item>
              <el-menu-item index="/FaceManage/ModuleCount"
                            :disabled="!$common.getAuthIsOwn('模型统计', 'isShow')">模型统计</el-menu-item>
            </el-submenu>
            <el-submenu index="/FaceManage/Setting">
              <div class="menuItemTitle"
                   slot="title">
                <div class="images">
                  <img :src="recordAnalysisImgSrc?require('@/assets/images/faceModule/setting_select.png'):require('@/assets/images/faceModule/setting_icon.png')" />
                </div>设置
              </div>
              <el-menu-item index="/FaceManage/Settings"
                            :disabled="!$common.getAuthIsOwn('基础设置', 'isShow')">基础设置</el-menu-item>
            </el-submenu>
            <!-- <el-menu-item index="/FaceManage/Settings" :class="{isActive:($route.path == '/Settings')}" class>
							<div class="images">
								<img
									:src="$route.path == '/FaceControl'?require('@/assets/images/faceModule/setting_select.png'):require('@/assets/images/faceModule/setting_icon.png')"
								/>
							</div>设置
						</el-menu-item> -->
          </div>
        </el-menu>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import faceModuleRouter from "@/router/modules/faceModule.js";
export default {
  mounted: function() {
    console.log(faceModuleRouter);
  },
  data: function() {
    return {
      hoverClass: false,
      hoverClass2: false,
      textTitle: null,
      textTitle2: null,
      hoverRoute: false,
      hoverRoute2: false
    };
  },
  computed: {
    recordSearchImgSrc: function() {
      return (
        this.$route.path == "/faceAnalysis" ||
        this.$route.path == "/faceAlarm" ||
        this.$route.path == "/PersonTrace" ||
        this.$route.path == "/OVO" ||
        this.$route.path == "/CompareRecord" ||
        this.$route.path == "/MBAnalysisRecord" ||
        this.$route.path == "/FaceRecord"
      );
    },
    recordAnalysisImgSrc: function() {
      return (
        this.$route.path == "/PersonFlowAnalysis" ||
        this.$route.path == "/PersonCompareCount" ||
        this.$route.path == "/FaceAnalysisTable" ||
        this.$route.path == "/Companion" ||
        this.$route.path == "/CarFellow" ||
        this.$route.path == "/SingleCaptureAnalysis" ||
        this.$route.path == "/SingleMissionAnalysis"
      );
    }
  },
  watch: {
    "$route.path": function(newVal, oldVal) {},
    hoverClass: function(newVal, oldVal) {}
  },
  methods: {
    handleSelect: function(key, keyPath) {
      // this.$router.push({ path: "/" + key });
      // this.routerIndex = this.$route.path;
      // console.log(key,keyPath);
      // console.log(this.$route.path);
    }
  }
};
</script>
<style>
.FaceHeader .el-submenu__icon-arrow {
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: 0px;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  font-size: 12px;
}
.FaceHeader .face_left_menu_right_icon {
  width: 9.2px;
  height: 6px;
  position: absolute;
  top: 24px;
  right: 18px;
}
.FaceHeader .el-submenu.is-active .el-submenu__title {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
/* .FaceHeader .el-menu-item:focus, */
.FaceHeader .magg .el-menu-item.is-active {
  background-color: rgba(38, 211, 157, 0.6) !important;
  color: #ffffff;
}
.FaceHeader .el-menu--collapse {
  width: 100%;
}
.FaceHeader {
  width: 100%;
  max-width: 200px;
  background: rgba(39, 42, 45, 0.8);
  box-sizing: border-box;
  overflow: auto;
}
.FaceHeader .el-submenu {
  line-height: 50px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.FaceHeader .magg .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px 0 20%;
  box-sizing: border-box;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.FaceHeader .menuItemTitle {
  /* height: 50px;
  line-height: 50px; */
  display: flex;
  align-items: center;
}
.FaceHeader .el-submenu .el-menu-item {
  font-size: 13px;
  font-family: "PingFangSC-Regular";
  padding-left: 53px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: rgba(27, 27, 27, 0.8);
}
.FaceHeader .el-submenu__title:hover,
.FaceHeader .el-menu-item:hover {
  background-color: rgba(40, 255, 187, 0.08);
}
.FaceHeader .magg {
  background-color: rgba(39, 42, 45, 0.8);
}
.FaceHeader .el-menu li .images {
  text-align: center;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  display: inline-block;
  vertical-align: baseline;
  margin-right: 13px;
}
.FaceHeader .el-menu li .images img {
  width: 14px;
  height: 14px;
  display: inline-block;
  position: relative;
  left: 0;
  margin-left: 0;
  vertical-align: initial;
}
.FaceHeader .el-menu li .text_title {
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  font-family: "PingFangSC-Regular";
  color: #dddddd;
  letter-spacing: 0;
}
a:-webkit-any-link {
  color: -webkit-link;
  text-decoration: none;
  cursor: auto;
}
</style>
