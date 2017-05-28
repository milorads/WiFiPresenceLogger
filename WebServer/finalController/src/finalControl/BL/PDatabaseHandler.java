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
            // create a connection to the database
            conn = DriverManager.getConnection(url);
            conn.getMetaData().getCatalogs();
            System.out.println("Connection to SQLite has been established.");

            String sql = "SELECT rowid AS id, info  FROM user_info";

            try (
                    Statement stmt  = conn.createStatement();
                    ResultSet rs    = stmt.executeQuery(sql)){

                // loop through the result set
                while (rs.next()) {
                    System.out.println(rs.getInt("id") +  "\t" +
                            rs.getString("info") + "\t");
                }
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }
}
