var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var exec = require('child_process').exec;

var sqlite3 = require('sqlite3').verbose();
var LogBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/LogBase.db');
var RegBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/RegBase.db');

var table_sql = `CREATE TABLE IF NOT EXISTS regList(RegId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ime TEXT,Prezime TEXT,Id TEXT)`;
var type_table_sql = `CREATE TABLE IF NOT EXISTS typeTable(typeId integer PRIMARY KEY NOT NULL UNIQUE,Type TEXT,UserId integer, FOREIGN KEY(UserId) references regList(RegId))`;
var reg_sql = `SELECT * FROM regList WHERE Mac = ?`;
var insert_sql = `INSERT INTO regList (Mac,Ime,Prezime,Id) VALUES(?,?,?,?)`;
var insert_type_sql = `INSERT INTO typeTable (Type,UserId) VALUES (?,(SELECT RegId FROM regList WHERE Mac = ?))`;
var update_reg_table = `UPDATE regList SET Ime = ?,Prezime = ?,Id = ? WHERE Mac = ?`;
var get_record_sql = `SELECT * FROM regList WHERE MAC = ?`;
var get_join_record_sql = `SELECT Ime,Prezime,Id,Type FROM regList LEFT JOIN typeTable ON regList.RegId = typeTable.UserId WHERE MAC = ?`;
function getDateTableName()
{
	var today = new Date();
	var dayString = today.getDate();
	var monthString = today.getMonth();
	var yearString = Math.floor(today.getFullYear()%1000);
	if(Math.floor(today.getDate()/10) == 0)
	{
		dayString = "0" + today.getDate();
	}
	if(Math.floor((today.getMonth()+1)/10) == 0)
	{
		monthString = "0" + (today.getMonth()+1);
	}
	return 'Td_m_Y'.replace('Y', yearString).replace('m', monthString).replace('d', dayString);
}


module.exports = {
	clientRegistrationCheck: function(ipv6,clbckFun)
	{
		var ip = ipv6.replace(/^.*:/, '')
		console.log(ip);

		RegBase.run(table_sql,(err) => {		
			if(err)
			{
				//return "Greska prilikom kreiranja baze [" +console.error(err.message) + "]";
				clbckFun(["undefined","Greska prilikom kreiranja baze [" +console.error(err.message) + "]"]);
			}
			else
			{
				console.log("dovde")
				RegBase.run(type_table_sql,(err1) => {
					if(err1)
					{
						console.log("err1")
						clbckFun(["undefined","Greska prilikom kreiranja baze [" +console.error(err.message) + "]"]);
					}
					else
					{
						console.log("nez errora1")
						var tableName = getDateTableName();
						var mac_sql = 'SELECT * FROM '+tableName + ' WHERE Ip = ? LIMIT 1';
					 
						var arp_ip;
						var mac = "undefined";
						
						exec('arp -a | grep "wlan0"',function(error,stdout,stderr){
							if (error) {
								//return [mac,"Greska prilikom pokusaja konekcije. [" + console.error(err.message) + "]"];
								clbckFun([mac,"Greska prilikom pokusaja konekcije. [" + console.error(err.message) + "]"]);
							}
							else{
								parsedStdout = stdout.split('\n');
								for(key=0;key<parsedStdout.length-1;key++)
								{
									parsedRow = parsedStdout[key].split(' ');
									arp_ip = parsedRow[1].replace('(','').replace(')','');
									console.log("arp_ip:"+arp_ip + "mac:" + parsedRow[3]);
									
									if(arp_ip == ip)
									{
										console.log(mac);
										mac = parsedRow[3];
									}
								}
								if(mac == "undefined")
								{
									console.log("uredjaj sa zadatom ip adresom ne postoji u arp tabeli");
									//return [mac,"Greska: Uredjaj sa zadatom ip adresom ne postoji u arp listi"];
									clbckFun([mac,"Greska: Uredjaj sa zadatom ip adresom ne postoji u arp listi"]);
								}
								else
								{
									console.log(mac);
							  
								
									RegBase.all(reg_sql,mac,(err,rows) => {
										if(err){
											//return [mac,"Greska prilikom citanja baze:" + console.error(err.message)];
											clbckFun([mac,"Greska prilikom citanja baze:" + console.error(err.message)]);
										}
										else
										{
											if(rows == 0)
											{
												//return [mac,"ne_postoji"];
												console.log("ne postoji ova mac adresa u bazi, sledi upis");
												clbckFun([mac,"ne_postoji"]);
											}
											else
											{
												console.log("vec postoji mac adresa u regList tabeli"); 
												//return [mac,"postoji"];
												clbckFun([mac,"postoji"]);
											}
										}
									});
							
								}
							}
						});						
					}
				});
			}
		});
	},
	insUpdRecord: function(name,surname,id,mac,type,service,clbckFun)
	{
		if(service == "new")
		{
			RegBase.run(insert_sql,[mac,name,surname,id],function(err){
				if(err)
				{
					//return "Greska prilikom upisa podataka u bazu [" + console.log(err.message) + "]";
					clbckFun("Greska prilikom upisa podataka u bazu [" + console.log(err.message) + "]");
				}
				else
				{
					RegBase.run(insert_type_sql,[type,mac],function(err1){
						if(err1)
						{
							//return "Greska prilikom upisa podataka u tabelu typeTable";
							clbckFun("Greska prilikom upisa podataka u tabelu typeTable");
						}
						else
						{
							console.log("upis novog korisnika zavrsen");
							//return "success";
							clbckFun("success");
						}
					});
				}
			});
		}
		else if(service == "edit")
		{
			//regbase run update record.. u tom slucaju se ne menja type korisnika
			RegBase.run(update_reg_table,[name,surname,id,mac],function(err){
				if(err)
				{
					//return "Greska prilikom azuriranja podataka";
					clbckFun("Greska prilikom azuriranja podataka");
				}
				else
				{
					//return "success";
					clbckFun("success");
				}
			})
		}
	},
	getRecord: function(mac,clbckFun)
	{
		//treba dodati join za tim korisnika
		RegBase.get(get_join_record_sql,[mac],function(err,row){
			if(err)
			{
				//return "ERROR";
				clbckFun("ERROR");
			}
			//return [row.Ime,row.Prezime,row.Id]
			
			clbckFun([[row.Ime,row.Prezime,row.Id,row.Type]]);
		});
	}
}
