//创建连接池，哪一个模块需要连接，只需要引入此模块即可
import { createPool } from "mysql";

var pool = createPool({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "root",
  database: "fishshop",
  connectionLimit: 20
});

//导出连接池对象pool
export default pool;

//import async from 'async'
// exports.querys = function (sqls, params, callback) {
//   pool.getConnection(function (err, connection) {
//     if (err) {
//       return callback(err, null);
//     }
//     connection.beginTransaction(err => {
//       if (err) {
//         return callback(err, null);
//       }
//       console.log("开始执行事务，共执行" + sqls.length + "条数据");
//       var funcAry = [];
//       sqls.forEach((sql, index) => {
//         var temp = function (cb) {
//           connection.query(sql, params[index], function (terr, row, fields) {
//             if (terr) {
//               console.log("事务失败，" + sql + "Error:" + terr)
//               throw terr
//             } else {
//               return cb(null, 'ok');
//             }
//           })
//         };
//         funcAry.push(temp);
//       });
//       async.series(funcAry, function (err, result) {
//         if (err) {
//           connection.rollback(function (err) {
//             console.log("transaction error: " + err);
//             connection.release();
//             return callback(err, null);
//           });
//         } else {
//           connection.commit(function (err, info) {
//             if (err) {
//               console.log("执行事务失败，" + err);
//               connection.rollback(function (err) {
//                 // console.log("transaction error: " + err);
//                 connection.release();
//                 return callback(err, null);
//               });
//             } else {
//               connection.release();
//               return callback(null, info);
//             }
//           })
//         }
//       })
//     })
//   })
// }
