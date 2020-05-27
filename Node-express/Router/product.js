import express from 'express'
import pool from '../pool'

var router = express.Router();

router.get('/list',(req,res)=>{
    
    if(req.query.type){
        var query = 'SELECT * FROM shop where type='+req.query.type
    }else{
        query = 'SELECT * FROM shop'
    }
    
    pool.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.get('/shopSku',(req,res)=>{
    var id = req.query.id;
    var sku1 = [];      //规格一
    var sku2 = [];      //规格二
    var sku3 = [];      //规格三
    var stock0 = [];    //存库为0的规格参数
    var query = 'SELECT * FROM sku where sid=' + id
    pool.query(query, (err, result) => {
        if (err) throw err;
        result.forEach(ele => {
            sku1.push(ele.sku1)
            sku2.push(ele.sku2)
            sku3.push(ele.sku3)
            if(ele.stock === 0){
                stock0.push([ele.sku1, ele.sku2, ele.sku3])
            }
        });
        sku1 = [...new Set(sku1)];
        sku2 = [...new Set(sku2)];
        sku3 = [...new Set(sku3)];
        
    })
    query = 'SELECT * FROM shop where id=' + id
    pool.query(query,(err,result)=>{
        if (err) throw err;
        res.send({ sku1, sku2, sku3, stock0 , shop:result});
    })
})

router.get('/comment',(req,res)=>{
    
    var shopid = req.query.id;
    var query = 'select * from comment where shopid=?'
    pool.query(query, [shopid], (err,result)=>{
        if (err) throw err;
        var firstarr=[];
        var secondarr={};
        result.forEach((ele)=>{
            if(ele.sid === 0){
                firstarr.push( ele );
            }else{
                if (!secondarr[ele.sid]){
                    secondarr[ele.sid]=[];
                    secondarr[ele.sid].push(ele);
                }else{
                    secondarr[ele.sid].push(ele);
                }
            }
            
        })
        res.send({firstarr,secondarr});
    })
})

router.post('/insertComment',(req,res)=>{
    var query = 'INSERT INTO comment(sid,shopid,name,content) values (?,?,?,?)'
    pool.query(query, [req.body.sid, req.body.shopid, req.body.name, req.body.content],(err,result)=>{
        if(err) throw err;
        if (result.affectedRows > 0) {
            res.send({ code: 200 });
        } else {
            res.send({ code: 301 });
        }
    })
})

router.post('/price',(req,res)=>{
    var sku1 = req.body.sku1 ;
    var sku2 = req.body.sku2 ;
    var sku3 = req.body.sku3 ;
    if(sku3){
        var query = "SELECT id,price from sku where sid=? and sku1=? and sku2=? and sku3=?"
    }else if(sku2){
        var query = "SELECT id,price from sku where sid=? and sku1=? and sku2=?"
    }else{
        var query = "SELECT id,price from sku where sid=? and sku1=? "
    }
    pool.query(query,[req.body.sid, sku1, sku2, sku3],(err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

router.post('/skuName',(req,res)=>{
    var sql = 'select sku1,sku2,sku3 from sku where id=?'
    pool.query(sql,[req.body.skuid],(err,result)=>{
        res.send(result);
    })
})

export default router;