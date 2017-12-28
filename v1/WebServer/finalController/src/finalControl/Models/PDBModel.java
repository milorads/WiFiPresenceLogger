package finalControl.Models;

import java.sql.Date;

/**
 * Created by milor on 28.5.2017..
 */
public class PDBModel {
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

    public String getIndex() {
        return Index;
    }

    public void setIndex(String index) {
        Index = index;
    }

    private int Id;
    private Mac Mac;
    private String Index;
}
