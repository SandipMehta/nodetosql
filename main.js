var express = require('express'); // Web Framework
var app = express();
var sql = require('mssql'); // MS Sql Server client

// Connection string parameters.
var sqlConfig = {
    user: 'sa',
    password: 'Atera#1',
    server: 'localhost\\SQLEXPRESS',
    database: 'AlabamaSystem'
}

// Start server and listen on http://localhost:8081/
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});

app.get('/db/:query/:query2?', function (req, res) {
console.log(req.originalUrl);

new sql.ConnectionPool(sqlConfig).connect().then(pool => {
    var sqry;
    
    if (!req.params.query2)
    {
        sqry = 'select * from ' + req.params.query;
    }
    else {
        sqry = 'select * from ' + req.params.query + ' where ' + req.params.query2;
    }
    console.log(sqry);
    return pool.request().query(sqry)
    }).then(result => {
      let rows = result.recordset
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json(rows);
      sql.close();
    }).catch(err => {
      res.status(500).send({ message: `${err}`})
      sql.close();
    });


    // sql.connect(sqlConfig).then(function (connection) {
    //     var request = new sql.Request(connection);
    //     console.log(req.params.query);
    //     request.query('select * from ' + req.params.query, function(err, recordset) {
    //         if(err) console.log(err);
    //         res.end(JSON.stringify(recordset)); // Result in JSON format
    //     });
    // });
})