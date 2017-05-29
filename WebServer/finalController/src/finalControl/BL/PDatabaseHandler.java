package finalControl.BL;

import finalControl.Models.Mac;
import finalControl.Models.PDBModel;

import java.sql.*;
import java.util.ArrayList;

public class PDatabaseHandler implements IDatabase, IPermanentDatabase {

    private static String url = "jdbc:sqlite:Databases/PDB.db";
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

            conn = connect();
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

    @Override
    public ArrayList<PDBModel> GetAll() {
        String sql = "SELECT Id, Mac, Index FROM users";
        ArrayList<PDBModel> listOfRecords  = new ArrayList<PDBModel>();

        try(Connection conn = this.connect();
            Statement statement = conn.createStatement();
            ResultSet rs = statement.executeQuery(sql)){
            while(rs.next()){
                PDBModel mod = new PDBModel();
                mod.setId(rs.getInt("Id"));
                mod.setMac(new Mac(rs.getString("Mac")));
                mod.setIndex(rs.getString("Index"));
                listOfRecords.add(mod);
            }
        }
        catch(SQLException e ){} catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return listOfRecords;
    }

    @Override
    public boolean AddRecord(PDBModel model) {
        String sql = "INSERT INTO users(Mac, Index) VALUES(?,?)";

        try(Connection conn = this.connect();
            PreparedStatement pstatement = conn.prepareStatement(sql)){
            pstatement.setString(1, model.getMac());
            pstatement.setString(2, model.getIndex());
            pstatement.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    private Connection connect(){
        Connection conn = null;
        try{
            conn = DriverManager.getConnection(url);
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }
        return conn;
    }
}
