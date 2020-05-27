import express from "express";
import expressWs from "express-ws";

var router = express.Router();

expressWs(router);
var reg = [
  {
    mark: "你好",
    msg: "你好",
  },
  {
    mark: "时间",
    msg: function(){
      return new Date().toLocaleString()
    },
  },
  {
    mark: "李白",
    msg: "他是诗人",
  }, 
  {
    mark: "优惠",
    msg: "现在优惠活动有。。。。",
  },
  {
    mark: "a标签",
    msg: "<a href='http://localhost:8080/'>123</a>",
  },
];

router.ws("/", function (ws, req) {
  ws.send("你好！我是机器人笨笨");
  ws.on("message", function (msg) {
    console.log(msg);
    msg = '^'+msg+'$'
    let r = new RegExp(msg,'i');
    var a = reg.find((item)=>r.test(item.mark))
    if(a){
      if(typeof a.msg === 'function'){
        ws.send("我要告诉你：" + a.msg());
      }else{
        ws.send("我要告诉你：" + a.msg);
      }
    }else{
        ws.send("我还不知道！");
    }
    
  });
});

export default router;