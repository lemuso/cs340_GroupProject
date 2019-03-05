var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lemuso',
  password        : '5813',
  database        : 'cs340_lemuso'
});
module.exports.pool = pool;