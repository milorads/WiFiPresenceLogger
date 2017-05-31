package finalControl.BL;

import finalControl.Models.Ip;
import finalControl.Models.Mac;

import javax.script.*;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.StringWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.concurrent.Callable;

/**
 * Created by milor on 28.5.2017..
 */
public class PythonHandler implements Callable{
    private static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public void PythonLogic(){
       String callOutput = PythonCaller();
        //parse mac and ip, add current datetime
        //write to database
        //run this thread until it is stopped by timer logic
    }

    public String PythonCaller(){
        StringWriter writer = new StringWriter(); //ouput will be stored here

        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptContext context = new SimpleScriptContext();

        context.setWriter(writer); //configures output redirection
        ScriptEngine engine = manager.getEngineByName("python");
        try {
            engine.eval(new FileReader("src/sample/hello.py"), context);
        } catch (ScriptException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return writer.toString();
    }

    private Mac MacParser() throws Exception {
        return new Mac("a");
    }
    private Ip IpParser() throws Exception {
        return new Ip("");
    }

    private static int i=0;
    private static void test(){
        System.out.println(i+++"++");
    }

    @Override
    public String call() throws Exception {
        while(true){
            test();
            if(Thread.interrupted()){
                System.out.println("task ++ interrupted");
                break;
            }
        }


        return null;
    }

}
