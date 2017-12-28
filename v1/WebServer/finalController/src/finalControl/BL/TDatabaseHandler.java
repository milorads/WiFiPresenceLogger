package finalControl.BL;

import finalControl.Models.Ip;
import finalControl.Models.Mac;
import finalControl.Models.TDBModel;

import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

/**
 * Created by milor on 28.5.2017..
 */
public class TDatabaseHandler implements IDatabase, ITemporaryDatabase {

    private static String url = "jdbc:sqlite:Databases/TDB.db";
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
            conn = this.connect();
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
    public ArrayList<TDBModel> GetAll() {
        String sql = "SELECT Id, Mac, Ip, DBDate FROM connections";
        ArrayList<TDBModel> listOfRecords  = new ArrayList<TDBModel>();

        try(Connection conn = this.connect();
            Statement statement = conn.createStatement();
            ResultSet rs = statement.executeQuery(sql)){
            while(rs.next()){
                TDBModel mod = new TDBModel();
                mod.setId(rs.getInt("Id"));
                mod.setMac(new Mac(rs.getString("Mac")));
                mod.setDate(rs.getDate("Date"));
                //mod.setCounter(rs.getInt("Counter"));
                mod.setIp(new Ip(rs.getString("Ip")));
                listOfRecords.add(mod);
            }
        }
        catch(SQLException e ){} catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return listOfRecords;
    }

    @Override
    public boolean AddRecord(TDBModel model) {
        String sql = "INSERT INTO users(Mac, Ip, DBDate) VALUES(?,?,?)";

        try(Connection conn = this.connect();
            PreparedStatement pstatement = conn.prepareStatement(sql)){
            pstatement.setString(1, model.getMac());
            pstatement.setString(2, model.getIp());
            //pstatement.setInt(3, model.getCounter());
            pstatement.setDate(3, model.getDate());
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
