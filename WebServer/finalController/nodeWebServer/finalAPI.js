/**
 * Created by milor on 29.5.2017..
 */

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('TDB.db');
var check;
db.serialize(function() {
    db.run("CREATE TABLE if not exists connections (Id int primary key,Mac text not null,Ip text not null,DBDate datetime not null)");
});

db.close();