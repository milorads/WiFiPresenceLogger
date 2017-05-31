package finalControl;

import finalControl.BL.PDatabaseHandler;
import finalControl.BL.ThreadController;
import javafx.fxml.FXML;

import java.awt.*;
import java.sql.*;
import java.io.IOException;
import java.util.Dictionary;

class Home{
    public static String Home = "~/Documents/WiFresenceLogger/WebServer/serviceApp/";
}

public class GUIController extends Home {

//    @FXML
//    private ScrollPane scrollPane;
//
//    public ScrollPane sp(){
//        return scrollPane;
//    }

    @FXML
    public void Runner() throws IOException {

        //String[] args = new String[] {"/bin/bash", "-c", "node ./nodeWebServer/api.js"};
        //Process proc = new ProcessBuilder(args).start();
        ThreadController t = new ThreadController();
        Dictionary<String, String> a = null;
        try {
            t.StartLogging(a);
        } catch (InterruptedException e) {
            System.out.println(e.getMessage());
        }
    }

    @FXML
    public void JDBCTester(){
//        Connection conn = null;
//        try {
//            // db parameters
//            String url = "jdbc:sqlite:mydb.db";
//            // create a connection to the database
//            conn = DriverManager.getConnection(url);
//
//            System.out.println("Connection to SQLite has been established.");
//
//            String sql = "SELECT rowid AS id, info  FROM user_info";
//
//            try (
//                    Statement stmt  = conn.createStatement();
//                    ResultSet rs    = stmt.executeQuery(sql)){
//
//                // loop through the result set
//                while (rs.next()) {
//                    System.out.println(rs.getInt("id") +  "\t" +
//                            rs.getString("info") + "\t");
//                }
//            } catch (SQLException e) {
//                System.out.println(e.getMessage());
//            }
//
//        } catch (SQLException e) {
//            System.out.println(e.getMessage());
//        } finally {
//            try {
//                if (conn != null) {
//                    conn.close();
//                }
//            } catch (SQLException ex) {
//                System.out.println(ex.getMessage());
//            }
//        }

        PDatabaseHandler p = PDatabaseHandler.getInstance();
        boolean a = p.Initialized();
    }

    @FXML
    public void TempDatabase(){

    }
}
