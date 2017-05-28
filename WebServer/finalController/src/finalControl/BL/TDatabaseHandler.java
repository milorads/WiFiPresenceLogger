package finalControl.BL;

/**
 * Created by milor on 28.5.2017..
 */
public class TDatabaseHandler {

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
}
