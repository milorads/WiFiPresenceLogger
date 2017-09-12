package finalControl.BL;

import finalControl.Models.PDBModel;
import finalControl.Models.TDBModel;

import javax.xml.bind.SchemaOutputResolver;
import java.util.*;
import java.util.concurrent.*;

/**
 * Created by milor on 29.5.2017..
 */
public class ThreadController implements Runnable {

    public static Hashtable<Parameters, Object> Settings;
    @Override
    public void run() {
        try {
            StartLogging(Settings);
        } catch (InterruptedException e) {
            System.out.println(e.getMessage());
        }
    }
    // from here Python and Node Handlers will be run into two separate threads

    public enum Parameters{
        ClassLength,
        TimeUnit,
        NumberOfClasses,
        BreakLength,
        ClassName,
        FacultyName,
        YearOfStudies,
        ProfessorName
    }

    public void StartLogging(Hashtable<Parameters,Object> dict) throws InterruptedException {
        ExecutorService serverExecutor = Executors.newFixedThreadPool(2);
        //(int)dict.get(Parameters.ClassLength)
        //getTimeUnit((String)dict.get(Parameters.TimeUnit))
        Set<Callable<String>> callables = new HashSet<Callable<String>>();
        callables.add(new PythonHandler());
        callables.add(new NodeHandler());
        serverExecutor.invokeAll(callables, 5, TimeUnit.MINUTES);
        serverExecutor.shutdown();
        //nodeExecutor.shutdown();
        System.out.println("i have shut down the thread");
        // run excel creator
        TDatabaseHandler tempDB = TDatabaseHandler.getInstance();
        PDatabaseHandler permDB = PDatabaseHandler.getInstance();
        ArrayList<TDBModel> listOfTempRecords = tempDB.GetAll();
        ArrayList<PDBModel> listOfPermRecords = permDB.GetAll();
        for (TDBModel tRecord:listOfTempRecords) {
            String toWrite = "IP:"+tRecord.getIp()+
                    ", MAC:"+tRecord.getMac()+
                    ", DATE:"+tRecord.getDate();
            System.out.println(toWrite);
        }
        for (PDBModel tRecord:listOfPermRecords) {
            String toWrite = "INDEX:"+tRecord.getIndex()+
                    ", MAC:"+tRecord.getMac();
            System.out.println(toWrite);
        }
    }

    public TimeUnit getTimeUnit(String input){
        switch (input) {
            case "seconds":
                return  TimeUnit.SECONDS;
            case "minutes":
                return TimeUnit.MINUTES;
            case "hours":
                return TimeUnit.HOURS;
            default:
                return null;
        }
    }
}