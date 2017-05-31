package finalControl.BL;

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
        serverExecutor.invokeAll(callables, 5, TimeUnit.SECONDS);
        serverExecutor.shutdown();
        //nodeExecutor.shutdown();
        System.out.println("i have shut down the thread");
        // run excel creator

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