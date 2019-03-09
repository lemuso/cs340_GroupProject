var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use(express.static('./views')); 

app.get('/',function(req,res){
   var context = {};
  res.render('home'); 
});

function getCharacters(res, mysql, context, complete){
  mysql.pool.query("SELECT a.character_Id, a.character_name, d.character_culture,b.mothers_house, c.fathers_house, e.allegiance, a.is_alive FROM ( SELECT character_Id, character_name, character_culture,mothers_house, fathers_house, allegiance, is_alive FROM characters ) a LEFT JOIN ( SELECT house_id, houses_name AS mothers_house FROM houses ) b ON a.mothers_house =  b.house_id  LEFT JOIN ( SELECT house_id, houses_name AS fathers_house FROM houses ) c ON a.fathers_house =  c.house_id  LEFT JOIN (SELECT culture_id, culture_name AS character_culture FROM cultures) d ON a.character_culture = d.culture_id LEFT JOIN (SELECT house_id, houses_name AS allegiance FROM houses) e ON a.allegiance = e.house_id", function(error, results, fields){
  if(error){
    res.write(JSON.stringify(error));
    res.end();
  }
  context.character = results;
  complete();
  });
}



app.get('/characters',function(req,res, next){
  var context = {};
  var mysql = req.app.get('mysql');
  var callbackCount = 0; 
  getCharacters(res, mysql, context, complete);

   function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                //console.log(context); 
                res.render('characters', context);
  }

  }
}); 



function getCultures(res, mysql, context, complete){
  mysql.pool.query("SELECT * FROM cultures", function(error, results, fields){
  if(error){
    res.write(JSON.stringify(error));
    res.end();
  }
  context.culture = results;
  complete();
  });
}



app.get('/cultures',function(req,res, next){
  var context = {};
  var mysql = req.app.get('mysql');
  var callbackCount = 0; 
  getCultures(res, mysql, context, complete);

   function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                //console.log(context); 
                res.render('cultures', context);
  }

  }
}); 



function getHouses(res, mysql, context, complete){
  mysql.pool.query("SELECT a.house_id, a.houses_name, a.sigil, a.words, b.current_leader, a.is_great_house FROM(SELECT house_id, houses_name, sigil, words, current_leader, is_great_house FROM houses) a LEFT JOIN (SELECT character_Id, character_name AS current_leader FROM characters) b ON a.current_leader = b.character_Id", function(error, results, fields){
  if(error){
    res.write(JSON.stringify(error));
    res.end();
  }
  context.house = results;
  complete();
  });
}



app.get('/houses',function(req,res, next){
  var context = {};
  var mysql = req.app.get('mysql');
  var callbackCount = 0; 
  getHouses(res, mysql, context, complete);

   function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                //console.log(context); 
                res.render('houses', context);
  }

  }
});



function getSeats(res, mysql, context, complete){
  mysql.pool.query("SELECT a.seat_id, a.seat_name, b.current_house, a.region, c.founder FROM(SELECT seat_id, seat_name, current_house, region, founder FROM seats) a LEFT JOIN (SELECT house_id, houses_name AS current_house FROM houses) b ON a.current_house = b.house_id LEFT JOIN (SELECT character_Id, character_name AS founder FROM characters) c ON a.founder = c.character_Id", function(error, results, fields){
  if(error){
    res.write(JSON.stringify(error));
    res.end();
  }
  context.seat = results;
  complete();
  });
}



app.get('/seats',function(req,res, next){
  var context = {};
  var mysql = req.app.get('mysql');
  var callbackCount = 0; 
  getSeats(res, mysql, context, complete);

   function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                //console.log(context); 
                res.render('seats', context);
  }

  }
});  

//app.get('/characters',function(req,res){
//  res.render('characters'); 
//});

//app.get('/cultures',function(req,res){
//  res.render('cultures'); 
//});

//app.get('/houses',function(req,res){
//  res.render('houses'); 
//});

//app.get('/seats',function(req,res){
//  res.render('seats'); 
//});

function isAliveHelper(stuff){
    console.log(stuff); 
}



/*
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
  });
});


///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.get('/simple-update',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
    [req.query.name, req.query.done, req.query.due, req.query.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.render('home',context);
  });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "done BOOLEAN," +
    "due DATE)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});
*/

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});



app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
