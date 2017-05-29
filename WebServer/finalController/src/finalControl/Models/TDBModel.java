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

    public String getMac() {
        return Mac.Get();
    }

    public void setMac(finalControl.Models.Mac mac) {
        Mac = mac;
    }

    public String getIp() {
        return Ip.Get();
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

    public int getCounter() {
        return Counter;
    }

    public void setCounter(int counter) {
        Counter = counter;
    }

    private int Id;
    private Mac Mac;
    private Ip Ip;
    private java.sql.Date Date;
    private int Counter;
}
