package finalControl.BL;

import java.sql.*;

/**
 * Created by milor on 28.5.2017..
 */
public class TDatabaseHandler implements IDatabase {

    private static TDatabaseHandler instance= null;
    private static Object mutex= new Object();
    private TDatabaseHandler(){
    }

    public static TDatabaseHandler getInstance(){
        if(instance==null){
            synchronized (mutex){
                if(instance==null) instance = new TDatabaseHandler();
            }
        }
        return instance;
    }
    public boolean Initialized(){
        Connection conn = null;
        try {
            String url = "jdbc:sqlite:Databases/TDB.db";
            conn = DriverManager.getConnection(url);
            DatabaseMetaData dbm = conn.getMetaData();
            ResultSet tables = dbm.getTables(null, null, "user_info", null);
            if (tables.next()) {
                return true;
            }
            else {
                return false;
            }
        } catch (SQLException e) {
            return false;
        }
    }
}
