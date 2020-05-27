import express from 'express'
import pool from '../pool'

var router = express.Router();

router.post('/insertList',(req,res)=>{
    var skuid = req.body.sid;
    var num = req.body.num;
    var sname = req.body.sname;
    var uname = req.body.uname;
    
    var selectprice = ()=>{  //查询价格和商品id编号
        var sql = 'select * from sku where id=' + skuid;
        return new Promise((resolve,reject)=>{
            pool.query(sql, (err, result) => {
                if (err) throw err;
                return resolve(result);
            })
        })
    }
    // var updataShoplist = (sult)=>{
    //     var updatasql = 'update shoplist set num=? where uname=? and skuid=?'
    //     var snum = Number(num) + sult[0].num
    //     return pool.query(updatasql,[snum,uname,skuid],(err,result)=>{
    //         if (result.affectedRows > 0) {
    //             res.send({ code: 200 });
    //         } else {
    //             res.send({ code: 301 });
    //         }
    //     })
    // }

    new Promise((resolve,reject)=>{
        var selectsql = 'select * from shoplist where uname=? and skuid=?'
        pool.query(selectsql, [uname, skuid], (err, result) => {
            if (result.length === 0) {
                return resolve();
            }else{
                return reject(result);
            }
        })
    })
    .then(selectprice)
    .then((result)=>{
        var query = 'insert into shoplist (uname,shopid,skuid,sname,price,num) values (?,?,?,?,?,?)'
        pool.query(query, [uname, result[0].sid, skuid, sname, result[0].price, num], (err, result) => {
            if (result.affectedRows > 0) {
                res.send({ code: 200 });
            } else {
                res.send({ code: 301 });
            }
        })
    })
    .catch((sult) => {
        var updatasql = 'update shoplist set num=? where uname=? and skuid=?'
        var snum = Number(num) + sult[0].num
        pool.query(updatasql, [snum, uname, skuid], (err, result) => {
            if (result.affectedRows > 0) {
                res.send({ code: 200 });
            } else {
                res.send({ code: 301 });
            }
        })
    })   
    // pool.query(sql, (err, result) => {
    //     if (err) throw err;
    //     pool.query(query, [uname, result[0].sid, skuid, sname, result[0].price, num], (err, result) => {
    //         if (result.affectedRows > 0) {
    //             res.send({ code: 200 });
    //         } else {
    //             res.send({ code: 301 });
    //         }
    //     })
    // })
})

router.post('/selectShop',(req,res)=>{
    var shop = req.body.shop;
    //cconsole.log(shop)
    let index = 1;
    var sql = 'SELECT id,sid,price,sku1,sku2,sku3 from sku where id='+shop[0].id;
    while(index<shop.length){
        sql = sql+' or id='+shop[index].id;
        index++;
    }
    //console.log(sql)
    pool.query(sql,(err,result)=>{
        //console.log('1')
        if(err) throw err;
        shop = result.reduce((prev,ele)=>{
            const target = prev.find(e=>e.id===ele.id)
            if(target){
                Object.assign(target,ele);
            }else{
                prev.push(ele);
            }
            return prev;
        },shop)
        res.send(shop);
        //console.log(shop)
    })
    //console.log(shop)
})

router.post('/selectShopList',(req,res)=>{
    var sql = 'select * from shoplist where uname=?';
    pool.query(sql,[req.body.uname],(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

router.post('/insertOrder',(req,res)=>{
    var shop = req.body.shop;
    var username = req.body.name;
    console.log("shop", shop)
    console.log("name",username)
    new Promise((resolve,reject)=>{
        var sql = 'select id,adress,phone from user where name=?';
        pool.query(sql, [username], (err, result) => {
            if (err) throw err;
            console.log(result)
            if (result.length > 0) {
                console.log("第一步查询user的信息")
                let a = result[0]
                return resolve(a)
            }
        })
    }).then((sult)=>{
        let index = 1;
        var sql = 'SELECT id,price from sku where id=' + shop[0].id;
        while (index < shop.length) {
            sql = sql + ' or id=' + shop[index].id;
            index++;
        }
        return new Promise((resolve)=>{
            pool.query(sql, (err, result) => {
                console.log("第二步查询商品信息")
                if (err) throw err;
                shop = result.reduce((prev, ele) => {
                    const target = prev.find(e => e.id === ele.id)
                    if (target) {
                        Object.assign(target, ele);
                    } else {
                        prev.push(ele);
                    }
                    return prev;
                }, shop)
                console.log(shop)
                return resolve({ shop, user: sult });
            })
        })  
    }).then((sult)=>{
        console.log("第三步插入订单信息")
        let index = 0;
        var sql = "INSERT INTO shoporder (userId,skuId,num,shijian,state,price,phone,adress) "
            + "VALUES(" + sult.user.id + "," + sult.shop[index].id + "," + sult.shop[index].number
            + ",DATE_FORMAT(NOW(),'%y-%m-%d'),0," + sult.shop[index].price+",'" 
            + sult.user.phone + "','" + sult.user.adress +"')";
        let deletesql = 'delete from shoplist where uname="' + username + '" and skuid=' 
            + sult.shop[index].id
        index++;
        while (index < shop.length) {
            sql += ", (" + sult.user.id + "," + sult.shop[index].id + "," + sult.shop[index].number
                + ",DATE_FORMAT(NOW(),'%y-%m-%d'),0," + sult.shop[index].price + ",'"
                + sult.user.phone + "','" + sult.user.adress + "')";
            deletesql += ' or uname="' + username + '" and skuid='+sult.shop[index].id
            index++;
        }
        sql = sql +";"
        console.log(sql)
        pool.query(sql,(err,result)=>{
            if (result.affectedRows > 0) {
                console.log(deletesql)
                pool.query(deletesql,(err,r)=>{ //删除购物车中的物件
                    if (r.affectedRows > 0){
                        res.send({ code: 200 })
                    }
                })
            }
        })
    })
})

export default router;