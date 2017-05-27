package sample;

import javafx.fxml.FXML;

import java.sql.*;

public class Controller {

    @FXML
    public void Runner(){
        ProcessBuilder b = new ProcessBuilder("node mynodejs.js", "-args");
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
