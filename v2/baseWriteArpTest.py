import subprocess
import re
import sqlite3
from datetime import datetime


class PresenceCheckerException(Exception):
    def __init__(self, msg, original_exception):
        super(PresenceCheckerException, self).__init__(msg + (": %s" % original_exception))
        self.original_exception = original_exception


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


def subprocess_cmd(command):
    output = subprocess.check_output(command, shell=True)
    return output


def check_base(mac_arp_pair, table_name):
    check_base_connection = sqlite3.connect("LogBase.db")
    check_base_cursor = check_base_connection.cursor()
    sql = "SELECT * FROM " + table_name + " WHERE Izlaz IS NULL"
    check_base_cursor.execute(sql)
    database_records = check_base_cursor.fetchall()
    if len(database_records) == 0:
        print("no items")
    else:
        mac_arp_database_pairs = {}
        for record in database_records:
            mac_arp_database_pairs[record[1]] = ArpModel(record[2], record[1], "Unknown", record[0])
        current_date_time = datetime.now()
        for arp_mac, arp_model_object in mac_arp_pair.iteritems():
            if arp_mac not in mac_arp_database_pairs:
                new_sql_entry = "INSERT INTO " + table_name + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
                check_base_cursor.execute(new_sql_entry,
                                          [arp_model_object.GetIp(), arp_model_object.GetMac(), current_date_time,
                                           None])
                check_base_connection.commit()
        for db_mac, db_model_object in mac_arp_database_pairs.iteritems():
            if db_mac not in mac_arp_database_pairs:
                existing_sql_update = "UPDATE " + table_name + " SET Izlaz =? WHERE LogBaseId =?"
                check_base_cursor.execute(existing_sql_update, [current_date_time, db_model_object.GetId()])
                check_base_connection.commit()
    check_base_connection.close()


def add_to_base(mac_arp_pair, table_name):
    add_to_base_connection = sqlite3.connect("LogBase.db")
    add_to_base_cursor = add_to_base_connection.cursor()
    sql = "INSERT INTO " + table_name + " (Ip,Mac,Ulaz,Izlaz) VALUES(?,?,?,?)"
    add_to_base_date_time = datetime.now()
    for key, arp_model_object in mac_arp_pair.iteritems():
        add_to_base_cursor.execute(sql,
                                   [arp_model_object.GetIp(), arp_model_object.GetMac(), add_to_base_date_time, None])
        add_to_base_connection.commit()
        add_to_base_connection.close()


try:
    try:
        arp_call = subprocess_cmd("arp -a")
    except Exception, e:
        raise PresenceCheckerException("Error in arp table fetching", e)
    regular_expression = r'(?P<host>([^\s]+))[\s][(](?P<ip>\b(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\b)[)][\s][aA][tT][\s](?P<mac>((\d|([a-f]|[A-F])){2}:){5}(\d|([a-f]|[A-F])){2})(([\s][\[][eE][tT][hH][eE][rR][\]][\s][oO][nN][\s])|([\s][oO][nN][\s]))(?P<iface>.*)\r'
    pairOfMacArpModel = {}
    try:
        pattern = re.compile(regular_expression)
        presentDevices = [m.groupdict() for m in pattern.finditer(arp_call)]
        for re_found_object in presentDevices:
            if "wlan0" not in re_found_object["iface"]:
                continue
            pairOfMacArpModel[re_found_object["mac"]] = ArpModel(re_found_object["ip"], re_found_object["mac"],
                                                                 re_found_object["host"])
    except Exception, e:
        raise PresenceCheckerException("Error in RegEx matching", e)
    try:
        current_table_name = "T" + datetime.now().strftime('%d_%m_%y')
        main_connection = sqlite3.connect("LogBase.db")
        main_cursor = main_connection.cursor()
        main_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (current_table_name,))
        number_of_tables = main_cursor.fetchall()
    except Exception, e:
        raise PresenceCheckerException("Error in getting the table name", e)
    if len(number_of_tables) == 0:
        try:
            main_cursor.execute(
                "CREATE TABLE " + current_table_name + " (LogBaseId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ip TEXT,Ulaz DATETIME,Izlaz DATETIME)")
            main_connection.close()
            add_to_base(pairOfMacArpModel, current_table_name)
        except Exception, e:
            raise PresenceCheckerException("Error in Table Create or add to base", e)
    else:
        try:
            main_connection.close()
            check_base(pairOfMacArpModel, current_table_name)
        except Exception, e:
            raise PresenceCheckerException("Error in Check Base", e)
except PresenceCheckerException, e:
    print e.message
