package finalControl.Models;

import java.sql.Date;

/**
 * Created by milor on 28.5.2017..
 */
public class TDBModel {
    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public finalControl.Models.Mac getMac() {
        return Mac;
    }

    public void setMac(finalControl.Models.Mac mac) {
        Mac = mac;
    }

    public finalControl.Models.Ip getIp() {
        return Ip;
    }

    public void setIp(finalControl.Models.Ip ip) {
        Ip = ip;
    }

    public java.sql.Date getDate() {
        return Date;
    }

    public void setDate(java.sql.Date date) {
        Date = date;
    }

    public long getCounter() {
        return Counter;
    }

    public void setCounter(long counter) {
        Counter = counter;
    }

    public int Id;
    public Mac Mac;
    public Ip Ip;
    public java.sql.Date Date;
    public long Counter;
}
