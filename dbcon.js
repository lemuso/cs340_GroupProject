var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_tones',
  password        : '5288',
  database        : 'cs340_tones'
});
module.exports.pool = pool;