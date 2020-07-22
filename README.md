# FishingShop
一个小型渔具店商城项目
使用Node的Express+Vue全家桶
vue文件夹为Cli2版本代码
xiaoshop文件夹为Cli4版本文件代码

对于Vue前端：
采用ElementUI和Css完成web端页面布局和页面各组件的封装和实现。
采用SKU算法实现商品不同规格组合的页面效果变化。
通过axios请求与后端实现数据交互。 
实现未登录状态下对用户访问限制。
使用websocket与后台进行全双工通信。

对于Express后台：
进行Babel配置，允许项目环境支持ES6。
使用路由器将项目功能模块化，使用mysql包连接数据库和创建连接池。
使用body-parser包获取post方法传递的参数。
使用express-ws构建websocket服务器。