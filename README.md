## 项目结构
├─assets
│  ├─icon                          一些图标
│  ├─images                        全局图标
│  │  ├─ActualPopulation              实有人口                v1.8——迭代二新增
│  │  ├─auth                          权限模块                v1.6新增
│  │  ├─bayonet                       车辆识别                v1.8——迭代一新增 
│  │  ├─building                      楼栋
│  │  ├─communityBoard                社区看板                v1.8——迭代五新增
│  │  ├─dataBoard                     数据看板                v2.0新增
│  │  ├─doorAccess                    门禁控制                v1.0
│  │  ├─downTown                      街镇看板                v2.0
│  │  ├─equipment                     设备资源                v1.0
│  │  ├─faceModule                    人脸识别                v1.3
│  │  ├─log                           日志查询                v1.6
│  │  ├─login                         登陆                   v1.6
│  │  ├─map                           地图                   v1.7
│  │  │  └─icon
│  │  ├─personMange                   员工管理
│  │  ├─resident                      居民管理
│  │  ├─SchoolBoard                   学校看板                v1.10
│  │  ├─sys                           系统设置                v1.7
│  │  ├─temperature                   高温预警                v1.10
│  │  ├─treeIcons                     视频模块设备树的图标     v1.4
│  │  ├─Video                         视频模块其他图标         v1.4
│  │  └─vistorManage                  访客管理                v1.2
│  └─temperature                      测温门禁                v1.6.1
├─common                              公共组件
│  ├─baseComponent                        基本拍照弹窗组件，
│  ├─js                                   图标js类
│  └─package                              UI组件类
│      ├─GtBigImage
│      │  └─src
│      ├─GtButton
│      │  └─src
│      ├─GtContextMenu
│      │  └─src
│      ├─GtScroll
│      │  └─src
│      ├─GtTimePicker
│      │  └─src
│      └─GtTree
│          └─src
├─pages                             vue功能模块
│  ├─alarmDialog                        全局报警弹窗              v1.3
│  ├─AreaManagement                     区域组织                  v2.0
│  │  ├─components
│  │  └─views
│  ├─bayonet                            车辆识别                  v1.8
│  │  ├─components
│  │  ├─http
│  │  └─views
│  ├─buildingsHouse                     楼栋房屋 基建组织          v1.0
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─BuildHouseFile                    一房一档                   v1.8
│  │  └─components
│  ├─carManage                          车辆登记                  v1.8
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─communityBoard                      社区看板                 v1.8、v2.1
│  │  ├─ActualBuildHouse                     实有房屋
│  │  │  ├─components
│  │  │  └─views
│  │  ├─ActualEquipment                      实有装备
│  │  │  └─views
│  │  ├─ActualInstallation                   实有安防设施
│  │  │  └─views
│  │  ├─ActualPopulation                     实有人口
│  │  │  └─views
│  │  ├─ActualPopwerStatistics               实有力量与统计
│  │  │  └─views
│  │  ├─ActualUnit                           实有单位
│  │  │  ├─components
│  │  │  └─http
│  │  ├─components
│  │  ├─defanceDev                           设备状态
│  │  │  ├─utils
│  │  │  └─views
│  │  └─utils
│  ├─DataBoard                               数据看板             v2.0
│  │  ├─ActualBuildHouse                     实有房屋
│  │  │  ├─components
│  │  │  └─views
│  │  ├─ActualEquipment                      实有装备
│  │  │  └─views
│  │  ├─ActualInstallation                   实有安防设备
│  │  │  └─views
│  │  ├─ActualPopulation                     实有人口
│  │  │  ├─components
│  │  │  └─views
│  │  ├─ActualPopwerStatistics               实有力量与统计
│  │  │  └─views
│  │  ├─ActualUnit                           实有单位
│  │  │  ├─components
│  │  │  └─http
│  │  ├─components                           实有设备
│  │  ├─defanceDev                           
│  │  │  ├─utils
│  │  │  └─views
│  │  ├─FacePerception                      人脸感知
│  │  └─utils
│  ├─deviceStatus                           设备状态             v2.0
│  │  └─views
│  ├─doorControl                            门禁控制             v1.0、1.2.1
│  │  ├─components
│  │  │  ├─doorAccessConfig
│  │  │  └─doorAccessSetting
│  │  ├─utils
│  │  └─views
│  │      ├─doorAccessConfig
│  │      ├─doorAccessSetting
│  │      ├─doorStatus
│  │      └─recordSearch
│  ├─equipmentMange                        设备管理              v1.0、1.2
│  │  ├─components
│  │  │  └─RemoteControlDialogContent          设备远程控制
│  │  └─views
│  ├─faceModule                            人脸识别              v1.3
│  │  ├─components
│  │  ├─http
│  │  └─views
│  │      ├─companion                       同行人分析
│  │      │  ├─util
│  │      │  └─view
│  │      ├─facealarm
│  │      │  └─basic
│  │      ├─faceControl                      人脸布控
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─facedb                           人脸库
│  │      │  └─basic
│  │      ├─intelModel                       智能模型
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─judgeAnalysis                    研判查询
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─moduleCount                      模型统计
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─personTrace                       人员轨迹
│  │      │  └─view
│  │      ├─searchFaceWithFace                以脸搜脸
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─settings
│  │      │  └─view
│  │      └─statisticalForms                  统计分析
│  │          ├─util
│  │          └─view
│  ├─hardwareManage                         实有装备              v1.8
│  │  ├─components
│  │  └─utils
│  ├─home                                   首页模块菜单
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─log                                    日志                 v1.6
│  │  ├─components
│  │  ├─http
│  │  └─views
│  ├─login                                  登陆页
│  │  └─utils
│  ├─main                                   全局通知             v1.3
│  │  └─views
│  ├─mapConfig                              地图配置             v1.7
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─mapOperate                             地图操作             v1.7
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─peopleFiles                            一人一档             v1.8
│  │  └─components
│  ├─personMange                            员工管理             v1.0
│  │  ├─components
│  │  └─views
│  ├─prewarnMegatemp                        高温预警             v1.10
│  │  ├─components
│  │  └─utils
│  ├─projectManage                         项目切换的菜单
│  │  └─utils
│  ├─residentManage                        居民管理              v1.0、1.8
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─schoolBoard                           学校看板             v1.10
│  │  ├─components
│  │  └─faculty                                在岗安保
│  │      ├─components
│  │      └─utils
│  ├─systemConfig                          系统设置             v1.7
│  │  ├─utils
│  │  └─views
│  ├─unitMange                             单位管理             v1.0、v1.8
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─user                                  用户管理             v1.6
│  │  ├─components
│  │  ├─http
│  │  └─views
│  ├─VideoPlayback                         视频回放             v1.4
│  │  ├─components
│  │  └─views
│  ├─VideoPreview                          视频预览             v1.4
│  │  ├─components
│  │  └─views
│  └─VisitorManage                           访客管理             v1.1
│      ├─components
│      │  ├─vistorAccess
│      │  ├─vistorBlacklist
│      │  ├─vistorRecord
│      │  └─vistorSet
│      ├─utils
│      │  └─vistorAccess
│      └─views
│          ├─vistorAccess
│          ├─vistorBlacklist
│          ├─vistorRecord
│          └─vistorSet
├─router                                   路由模块
│  └─modules
├─store                                    本地存储管理
│  └─modules
├─style                                    全局样式
└─utils                                    全局的函数（http）
    └─restApi                                 全局API


## common目录下面公共组件的使用方法

### icon.js 存放一些图片的引用，这样直接通过变量来引用，不要在每次在写图片路径了。


***

### TreeChangeNameDialog.vue 树节点改变名字弹窗

### props属性
| 参数    | 说明             | 类型    |
| ------- | ---------------- | ------- |
| title   | 弹窗标题         | string  |
| width   | 弹窗宽度         | string  |
| visible | 是否显示弹窗     | boolean |
| value   | 传进来的默认名称 | string  |
### 事件

| 事件名称 | 说明               | 回调参数       |
| -------- | ------------------ | -------------- |
| confirm  | 点击确定按钮的回调 | 修改过后的名字 |
| close    | 点击取消按钮的回调 | --             |


***
### ConfirmDialog.vue 确定弹框
引用：import ComfirmDialog from '@/common/ComfirmDialog.vue'; 然后在components里面注册一下就可以使用了。

### props属性
| 参数        | 说明                   | 类型    |
| ----------- | ----------------------| --------|
| title       | 弹窗标题               | string  |
| width       | 弹窗宽度               | string  |
| visible     | 是否显示弹窗           | boolean |
| confirmText | 提示用户是否确定的文本  | string  |
### 事件

| 事件名称 | 说明               | 回调参数 |
| -------- | ------------------ | -------- |
| confirm  | 点击确定按钮的回调 | --       |
| close    | 点击取消按钮的回调 | --       |


***
### InputRetrieve.vue 其他条件检索的框
tips: 弹框的位置 需要自己设置
### props属性
| 参数    | 说明         | 类型    |
| ------- | ------------ | ------- |
| visible | 是否显示弹窗 | boolean |
### 事件

| 事件名称 | 说明               | 回调参数 |
| -------- | ------------------ | -------- |
| query    | 点击查询事件的回调 | --       |


***

### GtBigImage 自定义指令，点击图片放大效果
### 使用方法
````
  在需要放大的img标签，添加v-show-bigimage属性既可使用
  
  <img v-show-bigimage
         src="1.jpg"
         alt="">
````

***

###  GtContextMenu 点击菜单
### 使用方法
    待补充

***

###  GtContextMenu 点击菜单
### 使用方法：
`
 this.$ContextMenu({
    data: data,
    event: e,
    callback(value) {
    }
  });
`
- data表示显示菜单的结构
- e event事件对象
- callback 回调函数 返回data的value，表示点了哪个按钮

***

### GtTree 树形组件
### 使用方法:
````
    示例代码
  <gt-tree
      :inintdata="data"
      @clickmenu="handler"
      ref='tree'>
  </gt-tree>

````
initdata是树的数据

clickmenu监听点击右边菜单事件：返回个对象({isLastOne,node,value,e})
* isLastOne表示是否同级节点中的最后一个
* node tree在树中的路径
* value 点击树的label,用于修改参数
* e 表示事件对象，用于后面动态设置菜单的位置
  
#### gt-tree提供的方法
* filter：用于筛选树中的label值
* filterType：用于筛选树中的type值
* operator: 用于操作树

> operator(operator,node,name);
> 1. operator 选项: addChild changeName moveup movedown delete  
> 2. node 是clickmenu事件传过来的，标记操作的节点
> 3. name 是修改名字之后的新的值

### tabTree 弹窗树组件
### 使用方法：

````
  实例代码
  <tab-tree :tabs="tabs"
            :visible="isCurrentShow"
            :show-input="true"
            @transferCheckedNodes="transferCheckedNodes"
            :defaultExpandedKeys="defaultExpandedKeys"
            :checkeTreedNodes="checkeTreedNodes">
  </tab-tree>
````


### tabs 组件树的配置项
     类型：array
     实例：

        tabs: [
                {
                  id: "1",
                  label: "设备树",
                  treeType: "orgAndDev",
                  treeRef: "tree1",
                  nodeKey: "id",
                  selectSingleNode: "door"
                },
                {
                  id: "2",
                  label: "地址",
                  treeType: "resident",
                  treeNodeType: "door",
                  treeRef: "tree2",
                  nodeKey: "id",
                  selectSingleNode: "door"
                },
                {
                  id: "3",
                  label: "标签",
                  treeType: "device",
                  treeNodeType: "door",
                  treeRef: "tree3",
                  isTag: true,
                  nodeKey: "tagUuid",
                  selectSingleNode: "door" 
                }
              ]


### 字段说明              
      1. id 表示树在组件的id
      2. label 表示树类型文字描述，在tab按键显示
      3. isTag 表示树类型是否是标签树 true 表示为标签树 ，默认false
      4. treeType 表示树的类型
        - person     表示该树为 员工管理 组织架构树
        - orgAndDev  表示该树为 设备 组织架构树
        - resident   表示该树为 楼栋房屋 基建树
        - department 表示该树为 员工管理 组织架构树 末节点为部门
        * 当isTag为true时 树不展开 没有末节点
        - staff      表示该标签树为 员工管理 标签树 
        - resident   表示该标签树为 居民管理 标签树 
        - person     表示该标签树为 员工和居民 标签树
        - device     表示该标签树为 设备 标签树

      *** treeNodeType 表示末节点类型 区分组织架构树的资源类型
       - door     // 楼栋房屋基建树节点到 门
       - device   // 组织架构树节点到 设备
       - staff    // 组织架构树节点到 人员
       - channel  // 组织树节点到通道 读头

      *** treeLeafType 
          只有treeNodeType === door时 
          有效树就只能选择到设备，其他节点不被选择 

      *** selectSingleNode 表示单选的节点类型
          新增选择节点的类型字段，只有当点击节点type跟传进来的type一样才会选中

			if (this.selectSingleNode !== "" && 
          this.selectSingleNode !== data.type) {
				return;
			}

      *** radio  是否单选   表示节点是否单选

      *** showInput 是否显示输入框 默认false

      *** checkeTreedNodes 默认选中的节点

      *** hasDoor 针对组织架构树类型有效 （即 当treeType === resident 无效）

transferCheckedNodes 监听点击右边菜单事件：返回三个参数({data,isBool,treeName})
* data   Object 表示点击的节点的数据对象
* isBool Boolean 表示该节点是否选中
* treeName 拓展字段，备用