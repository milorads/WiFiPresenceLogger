import subprocess
import re
import sqlite3
import os
from datetime import datetime
#Skripta koja se periodicno izvrsava na odredjeni vremenski period  unutar run.py skripte
#Evidentira kada su klijenti pristupili mrezi, kada su izasli iz mreze
#Evidencija se vrsi bez obzira da li je klijet registrovan na mrezu

# Logging class
class LoggerLevel:
    def __init__(self):
        pass

    @staticmethod
    def severity():
        global_severity = 1
        # 1 - Trace, 2 - Info, 3 - Warning, 4 - Error
        return global_severity

#presence check exception class
class PresenceCheckerException(Exception):
    def __init__(self, msg, original_exception):
        super(PresenceCheckerException, self).__init__(msg + (": %s" % original_exception))
        self.original_exception = original_exception

# Model for oe record
class ArpModel(object):
    # Attributes:
    # hostName: name of the device that is connected to the ap
    # ipAddress: ip address given to the device connected
    # macAddress: physical address of the connected device
    def __init__(self, ip, mac, host="Unknown", identifier=-1):
        # Constructor with host name defaulted to Unknown in case it cannot be parsed
        self.hostname = host
        self.ip_address = ip
        self.mac_address = mac
        self.id = identifier

    def get_ip(self):
        return self.ip_address

    def get_mac(self):
        return self.mac_address

    def get_host(self):
        return self.hostname

    def get_id(self):
        return self.id

    pass

# method for logging
def log(severity, message, exception = None):
    if severity >= LoggerLevel.severity():
        print(message)
        if exception is not None:
            print exception.message

#metoda za izvrsenje zadate shell komande. Prima kao argument string koji predstavlja
#komandu, vraca rezultat te komande ili "null" u slucaju greske
def subprocess_cmd(command):
	log(2, "Running subprocess command -> "+str(command))
	try:
		output = subprocess.check_output(command, shell=True)
		log(1, "Subprocess out: "+str(output))
		return output
	except Exception:
		return "null"

#metoda check_base - utvrdjuje koji su novi klijenti, kojih nije bilo u prethodnoj iteraciji
# i kojih vise nema. Nove upisuje u bazu, dok starima upisuje vreme izlaska u kolonu Izlaz
#ulazni argumenti: mac_arp_pair - kolekcija Mac adresa klijenata koji su povezani na uredjaj
#Napomena: vise se ne proverava preko arp tabele vec preko wlan0 komande za izlistavanje poveyanih klijenata

#database_records - kolekcija klijenata koji su upisani u bazu da su usli, a nisu izasli
#mac_arp_pair - kolekcija Mac adresa klijenata koji su povezani na uredjaj, dakle koji su trenutno povezani
#presek dve kolekcije su klijenti koji nisu jos uvek izasli iz mreze
#klijeti koji su u bazi, a nisu u mac_arp_pair su izasli
#kljenti koji su u mac_arp_pair a nisu u bazi su novi koje treba upisati
def check_base(mac_arp_pair, table_name):
    log(2, "Check base function")
    log(1, "Connecting to base")
    check_base_connection = sqlite3.connect(os.path.dirname(os.path.realpath(__file__)) + "/LogBase.db")
    log(1, "Getting cursor")
    check_base_cursor = check_base_connection.cursor()
    sql = "SELECT * FROM " + table_name + " WHERE Izlaz IS NULL"
    log(1, "Generating SQL: " + str(sql))
    log(1, "Executing sql")
    check_base_cursor.execute(sql)
    database_records = check_base_cursor.fetchall()
    if len(database_records) == 0:
        log(3, "No records")
	add_to_base(mac_arp_pair, table_name)
    else:
        mac_arp_database_pairs = {}
        log(1, "Database records: " + str(database_records))
        for record in database_records:
            log(1, "Ip:"+str(record[2])+",mac:"+str(record[1])+",id:"+str(record[0]))
            mac_arp_database_pairs[record[1]] = ArpModel(record[2], record[1], "Unknown", record[0])
            log(1, "Obj -->"+str(mac_arp_database_pairs[record[1]]))
            log(1, "Obj.mac -->" + str(mac_arp_database_pairs[record[1]].get_mac()))
        current_date_time = datetime.now()
        log(1, "Current time: " + str(current_date_time))
        for arp_mac, arp_model_object in mac_arp_pair.iteritems():
            log(1, "Arp records-> ip:" + str(arp_model_object.get_ip())+",mac:"+str(arp_model_object.get_mac()))
            if arp_mac not in mac_arp_database_pairs:
                log(1, "mac: " + str(arp_mac) + " not in mac arp database, writing to base")
                new_sql_entry = "INSERT INTO " + table_name + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
                check_base_cursor.execute(new_sql_entry,
                                          [arp_model_object.get_ip(), arp_model_object.get_mac(), current_date_time,
                                           None])
                check_base_connection.commit()
                log(1, "Committing transaction")
        for db_mac, db_model_object in mac_arp_database_pairs.iteritems():
            log(1, "Db records-> ip:" + str(db_model_object.get_ip()) + ",mac:" + str(db_model_object.get_mac()))
            if db_mac not in mac_arp_pair:
                log(1, "mac: " + str(db_mac) + " not in mac arp database, updating")
                existing_sql_update = "UPDATE " + table_name + " SET Izlaz =? WHERE LogBaseId =?"
                check_base_cursor.execute(existing_sql_update, [current_date_time, db_model_object.get_id()])
                check_base_connection.commit()
                log(1, "Committing transaction")
    check_base_connection.close()
    log(1, "Closing database connection")
    log(2, "Finished check base function")

#funkcija za dodavanje novog rekorda u LogBase.db
#ova funkcija ne popunjava ceo rekord, vec samo za one klijente 
#koji su usli u tekucoj iteraciji skripte, dakle, ne upisuje se kolona Izlaz
#ulazni argumenti su mac_arp_pair - kolekcija ArpModel instanci
#ime tabele gde se upisuju rekordi
def add_to_base(mac_arp_pair, table_name):
    log(2, "Add to base function")
    log(1, "Connecting to base")
    add_to_base_connection = sqlite3.connect(os.path.dirname(os.path.realpath(__file__)) + "/LogBase.db")
    log(1, "Getting cursor")
    add_to_base_cursor = add_to_base_connection.cursor()
    sql = "INSERT INTO " + table_name + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
    add_to_base_date_time = datetime.now()
    log(1, "Creating query ->" + str(sql) + "\r\nTime ->" + str(add_to_base_date_time))
    for key, arp_model_object in mac_arp_pair.iteritems():
        log(1, "Executing")
	print "printing ip and mac"
	print arp_model_object.get_ip()
	print arp_model_object.get_mac()
        add_to_base_cursor.execute(sql,
                                   [arp_model_object.get_ip(), arp_model_object.get_mac(), add_to_base_date_time, None])
        log(1, "Committing")
        add_to_base_connection.commit()
    log(1, "Closing connection")
    add_to_base_connection.close()
    log(2, "Finished add to base function")


try:
    try:
		#poziv komande koja izlistava Mac adrese svih klijenata
		log(2,"Calling iw dev wlan0 station dump | grep wlan0")
		stat_call = subprocess_cmd('iw dev wlan0 station dump | grep "wlan0"')
		log(1,str(stat_call))
    except Exception, e:
		log(3,"Error in station dump fetching")
		raise PresenceCheckerException("Error in arp table fetching",e)
	##regular_expression = r'(?P<host>([^\s]+))[\s][(](?P<ip>\b(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\b)[)][\s][aA][tT][\s](?P<mac>((\d|([a-f]|[A-F])){2}:){5}(\d|([a-f]|[A-F])){2})(([\s][\[][eE][tT][hH][eE][rR][\]][\s][oO][nN][\s])|([\s][oO][nN][\s]))(?P<iface>.*)'
    pairOfMacArpModel = {}
    try:
        ##log(2, "Executing regex on found records")
        ##pattern = re.compile(regular_expression)
        ##presentDevices = [m.groupdict() for m in pattern.finditer(arp_call)]
        ##log(1, str(presentDevices))
        ##for re_found_object in presentDevices:
        ##    log(1, "Mac:"+re_found_object["mac"]+",Ip:"+re_found_object["ip"]+",Host:"+re_found_object["host"]+",iface:"+re_found_object["iface"])
         ##   if "wlan0" not in re_found_object["iface"]:
         ##       continue
         ##   pairOfMacArpModel[re_found_object["mac"]] = ArpModel(re_found_object["ip"], re_found_object["mac"],re_found_object["host"])
        ##log(2, "Successfully finished regex parsing to objects")
		
		#rezultat komande je string sa mac adresama odvojenim '\n', pa se parsira
		#svaka se upisuje u ArpModel instancu
		#Napomena: u ArpModel se upisuje Mac i Ip adresa 1.1.1.1, jer u prethodnoj verziji skripte,
		#izlistavanje je islo preko ARP tabele, koja je davala podatke i o Ip adresi, sada se prilikom regitrovanja klijenata
		#povezuje Ip i Mac ARP tabelom.
		if(stat_call != "null"):
			deviceRows = stat_call.split('\n')
			del deviceRows[-1]
			for dev in deviceRows:
				row = dev.split()
				pairOfMacArpModel[row[1]] = ArpModel("1.1.1.1",row[1],"def_host")
			log(2,"Successfully finished station list parsing");
    except Exception, e:
        log(3, "Error in RegEx matching")
        raise PresenceCheckerException("Error in RegEx matching", e)
    try:
		#Kreiranje Imena tabele danasnjeg dana, ako ne postoji, kreira se
        log(2, "Looking for database tables")
        current_table_name = "T" + datetime.now().strftime('%d_%m_%y')
        main_connection = sqlite3.connect(os.path.dirname(os.path.realpath(__file__)) +"/LogBase.db")
	print current_table_name
        main_cursor = main_connection.cursor()
        main_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (current_table_name,))
        number_of_tables = main_cursor.fetchall()
        log(2, "Got all the tables from db")
    except Exception, e:
        log(3, "Error in getting the table name")
        raise PresenceCheckerException("Error in getting the table name", e)
    if len(number_of_tables) == 0:
        log(2, "No tables for today")
        try:
            log(2, "Creating table")
            main_cursor.execute(
                "CREATE TABLE " + current_table_name + " (LogBaseId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ip TEXT,Ulaz DATETIME,Izlaz DATETIME)")
            main_connection.close()
            add_to_base(pairOfMacArpModel, current_table_name)
        except Exception, e:
            log(3, "Error in Table Create or add to base")
            raise PresenceCheckerException("Error in Table Create or add to base", e)
    else:
        log(2, "Table for today's log exists")
        try:
			#izvrsava se provera prisutnosti klijenata u odnosu na prethodu instancu poziva skripte
            main_connection.close()
            check_base(pairOfMacArpModel, current_table_name)
        except Exception, e:
            log(3, "Error in Check Base")
            raise PresenceCheckerException("Error in Check Base", e)
except PresenceCheckerException, e:
    log(4, e.message, e)
