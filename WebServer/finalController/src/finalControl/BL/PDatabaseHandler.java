package finalControl.BL;

import java.sql.*;

public class PDatabaseHandler implements IDatabase {

    private static PDatabaseHandler instance= null;
    private static Object mutex= new Object();
    private PDatabaseHandler(){
    }

    public static PDatabaseHandler getInstance(){
        if(instance==null){
            synchronized (mutex){
                if(instance==null) instance = new PDatabaseHandler();
            }
        }
        return instance;
    }

    public boolean Initialized(){
        Connection conn = null;
        try {
            // db parameters
            String url = "jdbc:sqlite:Databases/PDB.db";
            ResultSet catalogs = null;

            // create a connection to the database
            conn = DriverManager.getConnection(url);
            DatabaseMetaData dbm = conn.getMetaData();
            // check if "employee" table is there
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
