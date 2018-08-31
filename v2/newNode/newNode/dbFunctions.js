/* Pomocne funkcije za rad sa bazama, sistemskim servisima, itd */
/* Pozivaju se unutar routes/index.js (skripta sa definisanim rutama) */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var exec = require('child_process').exec;

/* instanciranje objekta za pristup sqlite3 bazi */
var sqlite3 = require('sqlite3').verbose();

/* LogBase, RegBase, objekti modela baza LogBase.db, RegBase.db */
var LogBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/LogBase.db');
var RegBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/RegBase.db');


/* Definisani SQL query stringovi, radi interfejsa sa bazama */
var table_sql = `CREATE TABLE IF NOT EXISTS regList(RegId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ime TEXT,Prezime TEXT,Id TEXT)`;
var type_table_sql = `CREATE TABLE IF NOT EXISTS typeTable(typeId integer PRIMARY KEY NOT NULL UNIQUE,Type TEXT,UserId integer, FOREIGN KEY(UserId) references regList(RegId))`;
var reg_sql = `SELECT * FROM regList WHERE Mac = ?`;
var insert_sql = `INSERT INTO regList (Mac,Ime,Prezime,Id) VALUES(?,?,?,?)`;
var insert_type_sql = `INSERT INTO typeTable (Type,UserId) VALUES (?,(SELECT RegId FROM regList WHERE Mac = ?))`;
var update_reg_table = `UPDATE regList SET Ime = ?,Prezime = ?,Id = ? WHERE Mac = ?`;
var get_record_sql = `SELECT * FROM regList WHERE MAC = ?`;
var get_join_record_sql = `SELECT Ime,Prezime,Id,Type FROM regList LEFT JOIN typeTable ON regList.RegId = typeTable.UserId WHERE MAC = ?`;

/* Pomocna funkcija koja vraca naziv danasnje tabele (tabela za danasnji dan u formatu Tdd_mm_yy) */
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

/* funkcije definisane unutar module.exports su "vidljive" izvan ovog fajla, mogu se koristiti u drugim skriptama */
module.exports = {
	
	/* funkcija za proveru registracije klijenta. */
	/* kao argumente prima ip adresu klijenta i callback funkciju */
	/* Proverava  da li je klijent sa tom ip i mac adresom vec registrovan u bazi */
	/* Ako jeste, vraca mac adresu klijenta i poruku "postoji" */
	/* Ako nije, vraca mac adresu klijenta i poruku "ne_postoji" */
	clientRegistrationCheck: function(ipv6,clbckFun)
	{
		//obrada ip adrese tako da bude u formatu x.x.x.x
		var ip = ipv6.replace(/^.*:/, '')
		console.log(ip);
		
		//ako ne postoji tabela regList, kreira se
		RegBase.run(table_sql,(err) => {		
			if(err)
			{
				//return "Greska prilikom kreiranja baze [" +console.error(err.message) + "]";
				clbckFun(["undefined","Greska prilikom kreiranja baze [" +console.error(err.message) + "]"]);
			}
			else
			{
				//ako ne postoji typeTable tabela, kreira se
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
					 
						var arp_ip;
						var mac = "undefined";
						
						//izvrsava se komanda za prikaz arp tabele. Unutar arp tabele su parovi Ip/Mac
						exec('arp -a | grep "wlan0"',function(error,stdout,stderr){
							if (error) {
								//return [mac,"Greska prilikom pokusaja konekcije. [" + console.error(err.message) + "]"];
								clbckFun([mac,"Greska prilikom pokusaja konekcije. [" + console.error(err.message) + "]"]);
							}
							else{
								//Uporedjujuci dobijenu Ip adresu i ip adrese iz arp tabele, trazimo odgovarajuci par ip/mac
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
								//ako nismo nasli odg Ip adresu, mac varijabla ostaje undefined, greska u arp tabeli
								if(mac == "undefined")
								{
									console.log("uredjaj sa zadatom ip adresom ne postoji u arp tabeli");
									//return [mac,"Greska: Uredjaj sa zadatom ip adresom ne postoji u arp listi"];
									clbckFun([mac,"Greska: Uredjaj sa zadatom ip adresom ne postoji u arp listi"]);
								}
								else
								{
									console.log(mac);
							  
									//ako smo nasli mac, pretrazujemo da li ima mac adrese u tabeli RegBase, ako ima, 
									//klijent je registrovan, ako ne, nije
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
	/* Funkcija za Unos/Editovanje novog rekorda klijenta u bazu */
	/* Kao argument prihvata Ime, Prezime, Id, Mac adresu, Polje service (new ili edit) i callback funkciju */
	insUpdRecord: function(name,surname,id,mac,type,service,clbckFun)
	{
		//ako je argument service="new", upisuje se novi rekord
		if(service == "new")
		{
			//unos u tabelu regList -> Mac, Ime, Prezime, Id
			RegBase.run(insert_sql,[mac,name,surname,id],function(err){
				if(err)
				{
					//return "Greska prilikom upisa podataka u bazu [" + console.log(err.message) + "]";
					clbckFun("Greska prilikom upisa podataka u bazu [" + console.log(err.message) + "]");
				}
				else
				{
					//unos u tabelu typeList -> Tip,Mac
					RegBase.run(insert_type_sql,[type,mac],function(err1){
						if(err1)
						{
							//return "Greska prilikom upisa podataka u tabelu typeTable";
							clbckFun("Greska prilikom upisa podataka u tabelu typeTable");
						}
						else
						{
							console.log("upis novog korisnika zavrsen");
							//U slucaju uspesnog unosa, callback funkcija vraca poruku success
							clbckFun("success");
						}
					});
				}
			});
		}
		//ako je service edit, edituje se postojeci rekord, na osnovu zadate Mac adrese
		else if(service == "edit")
		{
			//U slucaju editovanja rekorda, ne menja se tip korisnika (typeList) vec samo regList
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
	/* Funkcija get record, vraca rekord korisnika na osnovu njegove mac adrese */
	/* Kao argument prima Mac adresu za koju treba da nadje ostale podatke o korisniku */
	getRecord: function(mac,clbckFun)
	{
		//Uzima podatke iz regList, typeList tabela preko Join querry-ja
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
