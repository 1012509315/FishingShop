import express from 'express'
import pool from '../pool'

var router = express.Router();

router.post('/login',(req,res)=>{
    var phone = req.body.phone;
    var pwd = req.body.pwd;
    pool.query('SELECT * FROM user WHERE phone=? AND password=?', [phone, pwd], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({ code: 200, data: result });
        } else {
            res.send({ code: 301 });
        }
    });
})

router.post('/regist',(req,res)=>{
    
    var sql = "INSERT INTO user(name,password,phone) values (?,?,?)";
    pool.query(sql, [req.body.id,req.body.pwd,req.body.phone], (err,result) => {
        try {
            if (err) throw err;
        } catch (error) {
            return res.send({ code: 301 });
        }
       
        if (result.affectedRows > 0) {
            res.send({ code: 200 });
        } else {
            res.send({ code: 301 });
        }
    })
})

router.get("/checkid",(req,res)=>{
    var sql = "select id from user where name=?";
    pool.query(sql,[req.query.id],(err,result)=>{
        if (err) throw err;
        if (result.length > 0) {
          res.send({ code: 200 });
        } else {
          res.send({ code: 301 });
        }
    })
});

router.get('/searchByname',(req,res)=>{
    var sql = 'select * from user where name=?';
    pool.query(sql,[req.query.name],(err,result)=>{
        if (err) throw err;
        if (result.length > 0) {
            res.send({ code: 200, data: result });
        } else {
            res.send({ code: 301 });
        }
    })
})

router.post('/updateUser',(req,res)=>{
    
    var sql = 'update user set password=?,adress=? where name=?';
    pool.query(sql, [req.body.password,req.body.adress,req.body.name], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ code: 200 });
        } else {
            res.send({ code: 301 });
        }
    })
})


export default router;