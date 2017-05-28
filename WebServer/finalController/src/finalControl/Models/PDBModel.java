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

    public finalControl.Models.Mac getMac() {
        return Mac;
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

    public int Id;
    public Mac Mac;
    public String Index;
}
