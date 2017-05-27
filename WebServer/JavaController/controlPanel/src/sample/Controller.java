package sample;

import javafx.fxml.FXML;

<<<<<<< HEAD
import java.sql.*;

public class Controller {
=======
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

class Home{
    public static String Home = "~/Documents/WiFresenceLogger/WebServer/serviceApp/";
}

public class Controller extends Home{
>>>>>>> a79e9ba60ee55f6d09b3742245bfbad22fc2ef2e

    @FXML
    public void Runner() throws IOException {
//        ProcessBuilder b = new ProcessBuilder("node "+Home+"api.js");
//        try {
//            b.start();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

//        Runtime rt = Runtime.getRuntime();
//        String[] commands = {"node ./serviceApp/api.js"};
//        Process proc;
//        try {
//            proc = rt.exec(commands);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        String[] args = new String[] {"/bin/bash", "-c", "node ./serviceApp/api.js"};
        Process proc = new ProcessBuilder(args).start();

//        BufferedReader br = new BufferedReader(new FileReader("./serviceApp/api.js"));
//        try {
//            StringBuilder sb = new StringBuilder();
//            String line = br.readLine();
//
//            while (line != null) {
//                sb.append(line);
//                sb.append(System.lineSeparator());
//                line = br.readLine();
//            }
//            String everything = sb.toString();
//            String a = "";
//        } finally {
//            br.close();
//        }

    }

    @FXML
    public void JDBCTester(){
        Connection conn = null;
        try {
            // db parameters
            String url = "jdbc:sqlite:mydb.db";
            // create a connection to the database
            conn = DriverManager.getConnection(url);

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

    private void selectAll(){

    }
}
