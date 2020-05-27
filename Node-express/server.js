import express from 'express'
import bodyParser from 'body-parser'

import expressWs from 'express-ws'

import productRouter from './Router/product'
import userRouter from './Router/user'
import orderRouter from './Router/order'
import socketRouter from './Router/socket'

const server = express();
expressWs(server);

server.use(express.static('./static'));
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());


server.use('/product', productRouter)
server.use('/user', userRouter)
server.use('/order', orderRouter)
server.use('/socket',socketRouter)

// expressWs(server);
// server.ws('/', function (ws, req){
//     ws.send('你连接成功了')
//     ws.on('message', function (msg) {
//         // 业务代码
//         console.log(msg);
//         console.log(req);
//     })
// })
// server.get('*',function(req,res){
//     res.sendFile(__dirname+"/static/001.jpg")
//     //res.redirect('/001.jpg')
// })

server.listen(3000,()=>{
    console.log("ok!");
});
