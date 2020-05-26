<template>
  <div class="map-panel"
       v-loading="isLoading">
    <div class="panel-title">
      <div class="stick-line"></div>
      <div>{{ mapType === 'gis' ? '配置GIS地图' : '配置图片底图'}}</div>
      <div class="button">
        <el-button @click="turnGis"
                   type="primary"
                   v-show="mapType === 'picture'"
                   :disabled="!OwnAuthDisabled"
                   size="small">
          切换成GIS地图
        </el-button>
        <el-button @click="turnPic"
                   type="primary"
                   v-show="mapType === 'gis'"
                   :disabled="!OwnAuthDisabled"
                   size="small">
          切换成图片地图
        </el-button>
        <el-button @click="saveMap"
                   type="primary"
                   :disabled="!OwnAuthDisabled"
                   size="small">
          保存
        </el-button>
      </div>
    </div>
    <div class="panel-main">
      <div class="panel-main-picture"
           v-show="mapType === 'picture'">
        <div class="default-block"
             v-show="isShowDefault">
          <div>
            <img src="@/assets/images/map/default_pic.png">
          </div>
          <div style="margin-top: 20px;">只允许上传JPG\PNG\SVG格式的图片，最大图片为10MB，</div>
          <div>最小图片分辨率为1024×768像素</div>
          <el-upload style="margin-top: 20px;"
                     :action="fileUrl"
                     :disabled="!OwnAuthDisabled"
                     :show-file-list="false"
                     :auto-upload="true"
                     accept=".jpg, .jpeg, .png, .svg, .JPG, .JPEG, .PNG, .SVG,"
                     :before-upload="beforeAvatarUpload"
                     :http-request='httpRequest'>
            <el-button type="primary"
                       :disabled="!OwnAuthDisabled"
                       size="small">
              本地上传
            </el-button>
          </el-upload>
        </div>
        <div class="picture-map"
             v-show="!isShowDefault">
          <div :src="imageFile"
               style="position: absolute"
               id="pic-img">
          </div>
          <!-- <i class="el-icon-delete clearImageIcon"
              @click.stop="deleteUpdateImage()"></i> -->
        </div>
      </div>
      <div class="panel-main-gis"
           id="edit-gis"
           v-show="mapType === 'gis'">
      </div>
      <div class="option-search"
           v-show="mapType === 'gis'">
        <el-input placeholder="输入关键字查找地点"
                  v-model="keyWord"
                  id="suggestId"
                  style="width: 320px"
                  class="input-with-select">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="clickSearch"></el-button>
        </el-input>
        <div id="searchResultPanel"
             style="border:1px solid #C0C0C0;width:320px;height:auto; display:none;"></div>
      </div>
      <div id="r-result"
           class="search-result"
           v-show="mapType === 'gis'"></div>
      <div class="option-button"
           v-show="mapType === 'gis' || imageFile">
        <el-tooltip class="item"
                    effect="dark"
                    content="删除底图"
                    placement="left">
          <div class="button-block"
               v-if="mapType === 'picture'"
               :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`"
               @click="deleteUpdateImage">
            <i class="el-icon-delete"
               style="color: #FFFFFF"></i>
          </div>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    content="回到中心点"
                    placement="left">
          <div class="button-block"
               @click="clickCenter"
               :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
            <img src="@/assets/images/map/location.png" />
          </div>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    content="放大一级"
                    placement="left">
          <div class="button-block"
               @click="clickcLarge"
               :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
            <img src="@/assets/images/map/enlarge.png" />
          </div>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    content="缩小一级"
                    placement="left">
          <div class="button-block"
               @click="clickcReduce"
               :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
            <img src="@/assets/images/map/reduce.png" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    isShowEditPanel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      orgUuid: "",
      orgName: "",
      mapType: "picture",
      fileUrl: "",
      imageFile: "",
      mapBase64: null,
      isShowDefault: true,
      map: null,
      initPoint: null,
      keyWord: "",
      myValue: "",
      nowCenter: null,
      mapInfo: {
        centerPointX: "",
        centerPointY: "",
        centerPointAltitude: "",
        mapLevel: ""
      },
      isLoading: false,
      body: null,
      container: null,
      img: null,
      imgDiv: null,
      isShowTopicFlag: false,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  activated() {
    if (this.ShowAuthDisabled) {
      this.isShowTopicFlag = true;
    }
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isOwn");
    if (this.ShowAuthDisabled) {
      this.$nextTick(() => {
        this.initGisMap();
      });
      this.connectSocket();
      this.body = document.getElementsByTagName("body")[0];
      this.container = document.getElementsByClassName("panel-main-picture")[0];
      this.imgDiv = document.getElementById("pic-img");
    }
  },
  methods: {
    initGisMap() {
      /* eslint-disable */
      this.map = new BMap.Map("edit-gis", {
        enableMapClick: false
      });
      this.initPoint = new BMap.Point(121.481115, 31.23667);
      this.nowCenter = this.initPoint;
      this.map.centerAndZoom(this.initPoint, 11);
      if (this.$store.state.home.mapSetData.onlineMap) {
        this.map.setMapStyleV2({
          styleJson: this.$store.state.home.mapStyle
        });
      }
      // this.map.centerAndZoom("上海", 19);
      this.map.enableScrollWheelZoom();
      // this.map.addControl(
      //   new BMap.MapTypeControl({
      //     mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP],
      //     anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
      //     offset: new BMap.Size(10, 30)
      //   })
      // );
      let ac = new BMap.Autocomplete({
        input: "suggestId",
        location: this.map
      }); //建立一个自动完成的对象
      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        let str = "";
        let _value = e.fromitem.value;
        let value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        document.getElementById("searchResultPanel").innerHTML = str;
      });
      let _this = this;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        let _value = e.item.value;
        _this.myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        document.getElementById("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          _this.myValue;

        _this.setPlace();
      });
    },
    setPlace() {
      let _this = this;
      this.map.clearOverlays(); // 清除地图上所有覆盖物
      function myFun() {
        let pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
        _this.map.centerAndZoom(pp, 17);
        _this.map.addOverlay(new BMap.Marker(pp)); // 添加标注
      }
      let local = new BMap.LocalSearch(this.map, {
        // 智能搜索
        onSearchComplete: myFun,
        onInfoHtmlSet: () => {
          setTimeout(() => {
            let list = document.getElementsByClassName("BMap_bubble_title");
            for (let i = 0; i < list.length; i++) {
              let lista2 = list[i].getElementsByTagName("a");
              for (let i2 = 0; i2 < lista2.length; i2++) {
                lista2[i2].innerText = "";
              }
            }
          }, 100);
        }
      });
      local.search(this.myValue);
      /* eslint-enable */
    },
    turnGis() {
      this.mapType = "gis";
      setTimeout(() => {
        this.map.setCenter(this.nowCenter);
      }, 300);
    },
    turnPic() {
      this.nowCenter = this.map.getCenter();
      this.mapType = "picture";
    },
    setMapInfo() {
      if (this.mapType === "gis") {
        this.mapInfo.centerPointX = this.map.getCenter().lat.toString();
        this.mapInfo.centerPointY = this.map.getCenter().lng.toString();
        this.mapInfo.mapLevel = this.map.getZoom().toString();
      }
    },
    saveMap() {
      if (!this.orgUuid) {
        this.$cToast.warn("请先选择组织区域");
        return;
      }
      if (this.mapType === "picture" && !this.mapBase64) {
        this.$cToast.warn("请先上传图片");
        return;
      }
      this.setMapInfo();
      this.$mapConfigHttp
        .saveMapInfo({
          orgUuid: this.orgUuid,
          mapType: this.mapType,
          mapBase64: this.mapBase64,
          centerPointX: this.mapInfo.centerPointX,
          centerPointY: this.mapInfo.centerPointY,
          centerPointAltitude: "",
          mapLevel: this.mapInfo.mapLevel
        })
        .then(res => {
          this.saveMapInfoSuccess(res.data);
        });
    },
    saveMapInfoSuccess(body) {
      // this.$cToast.success(body.msg);
      this.isLoading = true;
      this.$mapConfigHttp.setMapSysLog({
        logType: "config",
        moduleName: "地图配置",
        logEvent: "add",
        detail: `新增地图-${this.orgName}`
      });
    },
    beforeAvatarUpload(file) {
      let isJPG = false;
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg" ||
        file.type === "image/svg+xml"
      ) {
        isJPG = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$cToast.error("上传图片只能是 JPG 或 PNG 或 SVG 格式!");
      }
      if (!isLt2M) {
        this.$cToast.error("上传图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M && this.chargeImgSize(file);
    },
    chargeImgSize(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = e => {
          let data = e.target.result;
          let image = new Image();
          image.onload = () => {
            let width = image.width;
            let height = image.height;
            if (width >= 1024 && height >= 768) {
              resolve();
            } else {
              this.$cToast.error("最小图片分辨率为1024×768像素");
              reject(new Error("最小图片分辨率为1024×768像素"));
            }
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });
    },
    httpRequest(e) {
      this.imageFile = URL.createObjectURL(e.file);
      this.isShowDefault = false;
      this.setImgContainer();
      this.enableimgDragging();
      this.enableScrollWheelZoom();
      let reader = new FileReader();
      reader.readAsDataURL(e.file);
      let _this = this;
      reader.onload = function(e) {
        _this.mapBase64 = this.result
          .replace("data:image/jpeg;base64,", "jpeg:")
          .replace("data:image/png;base64,", "png:")
          .replace("data:image/svg;base64,", "svg:")
          .replace("data:image/svg+xml;base64,", "svg:")
          .replace("data:image/jpg;base64,", "jpg:");
      };
    },
    deleteUpdateImage() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.imageFile = "";
      this.mapBase64 = null;
      this.isShowDefault = true;
      this.setImgCenter();
      this.imgDiv.style.transform = "scale(1)";
    },
    clickCenter() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      if (this.mapType === "gis") {
        this.map.setCenter(this.initPoint);
      } else {
        this.setImgCenter();
      }
    },
    clickcLarge() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      if (this.mapType === "gis") {
        this.map.zoomIn();
      } else {
        this.imgZoomIn();
      }
    },
    clickcReduce() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      if (this.mapType === "gis") {
        this.map.zoomOut();
      } else {
        this.imgZoomOut();
      }
    },
    clickSearch() {
      /* eslint-disable */
      this.$nextTick(() => {
        this.map.clearOverlays();
        let local = new BMap.LocalSearch(this.map, {
          renderOptions: {
            map: this.map,
            panel: "r-result",
            selectFirstResult: false
          },
          onSearchComplete: results => {
            setTimeout(() => {
              let lista = document
                .getElementById("r-result")
                .getElementsByTagName("a");
              for (let i = 0; i < lista.length; i++) {
                lista[i].innerText = "";
              }
            }, 100);
          },
          onInfoHtmlSet: () => {
            setTimeout(() => {
              let list = document.getElementsByClassName("BMap_bubble_title");
              for (let i = 0; i < list.length; i++) {
                let lista2 = list[i].getElementsByTagName("a");
                for (let i2 = 0; i2 < lista2.length; i2++) {
                  lista2[i2].innerText = "";
                }
              }
            }, 100);
          }
        });
        local.search(this.keyWord);
      });
      /* eslint-enable */
    },
    connectSocket() {
      /* eslint-disable */
      let socket = new SockJS(
        window.config.protocolHeader + window.config.socketIP
      );
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        { projectUuid: this.$store.state.home.projectUuid },
        frame => {
          console.log("edit connect success: ");
          this.stompClient.subscribe(
            "/user/topic/map-1.7/client/config/mapChange",
            greeting => {
              this.handleSubscribe(JSON.parse(greeting.body));
            }
          );
        },
        err => {
          console.log("edit error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    handleSubscribe(body) {
      console.log("edit Subscribe success: ", body);
      if (!body) {
        return;
      }
      this.isLoading = false;
      if (this.isShowTopicFlag) {
        this.$cToast.success("地图信息已变更");
      }
      this.$emit("refreshMapPanelState");
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    resetData() {
      this.mapType = "picture";
      this.fileUrl = "";
      this.imageFile = "";
      this.mapBase64 = null;
      this.isShowDefault = true;
      this.map = null;
      this.initPoint = null;
      this.keyWord = "";
      this.myValue = "";
      this.nowCenter = null;
      this.mapInfo = {
        centerPointX: "",
        centerPointY: "",
        centerPointAltitude: "",
        mapLevel: ""
      };
      this.isLoading = false;
      this.initGisMap();
    },
    enableimgDragging() {
      this.imgDiv.addEventListener("mousedown", e => {
        let disX = e.clientX - this.imgDiv.offsetLeft;
        let disY = e.clientY - this.imgDiv.offsetTop;
        e.preventDefault();
        this.body.onmousemove = ev => {
          ev.preventDefault();
          let x = ev.clientX - disX;
          let y = ev.clientY - disY;
          this.imgDiv.style.left = x + "px";
          this.imgDiv.style.top = y + "px";
        };
        // 鼠标弹起后停止移动
        this.body.onmouseup = ev => {
          ev.preventDefault();
          this.body.onmousemove = null;
          this.body.onmouseup = null;
        };
      });
    },
    setImgCenter() {
      this.imgDiv.style.top = "";
      this.imgDiv.style.left = "";
    },
    enableScrollWheelZoom() {
      this.container.onmousewheel = e => {
        let transform = this.imgDiv.style.transform;
        let scale =
          parseFloat(
            transform.substring(
              transform.indexOf("(") + 1,
              transform.indexOf(")")
            )
          ) || 1;
        scale += e.wheelDelta / 1200;
        if (scale > 0) {
          this.imgDiv.style.transform = "scale(" + scale + ")";
        }
      };
    },
    imgZoomIn() {
      let transform = this.imgDiv.style.transform;
      let scale =
        parseFloat(
          transform.substring(
            transform.indexOf("(") + 1,
            transform.indexOf(")")
          )
        ) || 1;
      scale = scale + 0.1;
      this.imgDiv.style.transform = "scale(" + scale + ")";
    },
    imgZoomOut() {
      let transform = this.imgDiv.style.transform;
      let scale =
        parseFloat(
          transform.substring(
            transform.indexOf("(") + 1,
            transform.indexOf(")")
          )
        ) || 1;
      if (scale > 0.1) {
        scale = scale - 0.1;
      }
      this.imgDiv.style.transform = "scale(" + scale + ")";
    },
    setImgContainer() {
      this.img = document.createElement("img");
      this.img.src = this.imageFile;
      this.img.onload = () => {
        this.imgDiv.style.width = this.img.width + "px";
        this.imgDiv.style.height = this.img.height + "px";
        this.imgDiv.style.backgroundSize = `${this.img.width}px ${this.img.height}px`;
        this.imgDiv.style.backgroundImage = 'url("' + this.img.src + '")';
      };
    }
  },
  watch: {
    keyWord(val) {
      this.$nextTick(() => {
        /* eslint-disable */
        this.map.clearOverlays();
        let local = new BMap.LocalSearch(this.map, {
          renderOptions: { map: this.map, panel: "r-result" }
        });
        local.search("");
      });
    },
    orgUuid(val) {
      this.resetData();
    }
  },
  deactivated() {
    this.isShowTopicFlag = false;
  },
  destroyed() {
    this.disConnectSocket();
  }
};
</script>

<style lang="scss">
.panel-main-picture {
  .el-upload {
    height: 98%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
}
.option-search {
  .el-input__inner {
    background-color: #363b3e !important;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #25d298;
    border: 0px #25d298 solid;
    color: #ffffff;
    font-size: 16px;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-panel {
  width: 100%;
  height: 100%;
  .panel-title {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #ffffff;
    padding: 0 30px;
    box-sizing: border-box;
    .stick-line {
      height: 18px;
      border: {
        width: 0 2px;
        style: solid;
        color: #26d39d;
      }
      margin-right: 9px;
    }
    .button {
      margin-left: auto;
      margin-right: 0px;
    }
  }
  .panel-main {
    width: 100%;
    height: calc(100% - 90px);
    position: relative;
    .panel-main-picture {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .default-block {
        width: 375px;
        height: 350px;
        padding: 20px 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba($color: #ffffff, $alpha: 0.6);
      }
      .picture-map {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        .clearImageIcon {
          position: absolute;
          right: 15px;
          top: 1px;
          // z-index: 99;
          color: #efefef;
          width: 44px;
          height: 44px;
          line-height: 32px;
          font-size: 22px;
          text-align: center;
          background-color: rgba(102, 102, 102, 0.66);
          padding-top: 5px;
          box-sizing: border-box;
          border-radius: 55px;
        }
      }
    }
    .panel-main-gis {
      width: 100%;
      height: 100%;
    }
    .option-search {
      position: absolute;
      left: 40px;
      top: 40px;
    }
    .search-result {
      position: absolute;
      left: 40px;
      top: 80px;
      width: 320px;
    }
    .option-button {
      position: absolute;
      bottom: 55px;
      right: 25px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .button-block {
        background: rgba(102, 102, 102, 0.66);
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        width: 36px;
        height: 36px;
        margin-top: 6px;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
      }
    }
  }
}
</style>
