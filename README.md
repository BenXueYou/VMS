## 项目结构
├─assets                                  图片资源
│  ├─icon
│  └─images
│      ├─building
│      ├─doorAccess
│      ├─equipment
│      ├─faceModule
│      ├─login
│      ├─personMange
│      ├─resident
│      └─vistorManage
├─common                                 公共组件
│  ├─baseComponent
│  ├─js
│  └─package                             自定义树控件
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
├─pages                                  模块代码
│  ├─alarmDialog                         报警弹窗
│  ├─buildingsHouse                      楼栋房屋
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─doorControl                         门禁控制
│  │  ├─components
│  │  │  ├─doorAccessConfig
│  │  │  └─doorAccessSetting
│  │  ├─utils
│  │  └─views
│  │      ├─doorAccessConfig
│  │      ├─doorAccessSetting
│  │      ├─doorStatus
│  │      └─recordSearch
│  ├─equipmentMange                       设备管理
│  │  ├─components
│  │  │  └─RemoteControlDialogContent     远程控制
│  │  ├─utils
│  │  └─views
│  ├─faceModule                           人脸识别
│  │  ├─components
│  │  └─views
│  │      ├─companion                     同行人
│  │      │  ├─util
│  │      │  └─view
│  │      ├─facealarm                     人脸报警
│  │      │  └─basic
│  │      ├─faceControl                   人脸布控
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─facedb                        人脸库
│  │      │  └─basic
│  │      ├─intelModel                    智能模型
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─judgeAnalysis                 研判报警
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─moduleCount                    模型统计
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─personTrace                    人员轨迹
│  │      │  ├─components
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─searchFaceWithFace             以脸搜脸
│  │      │  ├─utils
│  │      │  └─view
│  │      ├─settings                       基础设置
│  │      │  ├─util
│  │      │  └─view
│  │      └─statisticalForms               统计分析
│  │          ├─util
│  │          └─view
│  ├─home                              首页tab组件                             
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─login                             登陆页
│  │  ├─utils
│  │  └─views
│  ├─main                              首页顶部tab组件
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─personMange                       员工管理
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─projectManage                     多项目弹窗
│  ├─residentManage                    居民管理
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  ├─unitMange                         单位管理
│  │  ├─components
│  │  ├─utils
│  │  └─views
│  └─vistorMange                       访客管理
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
├─router                              路由
│  └─modules
├─store                               vuex
│  └─modules                          
├─style                               全局样式  
└─utils                               全局函数
    └─restApi                         全局API


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
        > 1、person     表示该树为 员工管理 组织架构树
        > 2、orgAndDev  表示该树为 设备 组织架构树
        > 3、resident   表示该树为 楼栋房屋 基建树
        > 4、department 表示该树为 员工管理 组织架构树 末节点为部门
        * 当isTag为true时 树不展开 没有末节点
        > 5、staff      表示该标签树为 员工管理 标签树 
        > 6、resident   表示该标签树为 居民管理 标签树 
        > 7、person     表示该标签树为 员工和居民 标签树
        > 8、device     表示该标签树为 设备 标签树

      *** treeNodeType 表示末节点类型 区分组织架构树的资源类型
      > 1、door     // 楼栋房屋基建树节点到 门
      > 2、device   // 组织架构树节点到 设备
      > 3、staff    // 组织架构树节点到 人员
      > 4、channel  // 组织树节点到通道 读头

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