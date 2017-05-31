package finalControl.BL;

import javax.xml.bind.SchemaOutputResolver;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Created by milor on 29.5.2017..
 */
public class ThreadController {
    // from here Python and Node Handlers will be run into two separate threads

    public enum Parameters{
        clsLen,
        numOfCls,
        breakLen,
        clsName,
        faculty,
        yr,
        professorName
    }

    public void StartLogging(Dictionary<String,String> dict) throws InterruptedException {
        ExecutorService pythonExecutor = Executors.newSingleThreadExecutor();
        //ExecutorService nodeExecutor = Executors.newSingleThreadExecutor();
        pythonExecutor.invokeAll(Arrays.asList(new testA(), new testB()), 5, TimeUnit.SECONDS);
        //nodeExecutor.invokeAll(Arrays.asList(new testA()), 5, TimeUnit.SECONDS);
        pythonExecutor.shutdown();
        //nodeExecutor.shutdown();
    }


}

class testA implements Callable<String>{
    private static int i =0;

    private static void test(){
        System.out.println(i++);

    }

    @Override
    public String call() throws Exception {
        while(true){
        test();
            if(Thread.interrupted()){
                System.out.println("task interrupted");
                break;
            }
        }


        return null;
    }
}
class testB implements Callable<String>{
    private static int i =0;

    private static void test(){
        System.out.println(i++);

    }

    @Override
    public String call() throws Exception {
        while(true){
            test();
            if(Thread.interrupted()){
                System.out.println("task interrupted");
                break;
            }
        }


        return null;
    }
}