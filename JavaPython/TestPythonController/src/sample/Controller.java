package sample;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;

import javax.script.*;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.StringWriter;
import org.python.util.PythonInterpreter;
import org.python.core.*;

public class Controller {
    @FXML
    private void handleButtonAction(ActionEvent event) throws FileNotFoundException, ScriptException {
        // Button was clicked, do something...
        int a = 0;
        System.out.println("hi there");

        //test1
//        Process p = Runtime.getRuntime().exec("python yourapp.py");

        //test2
        StringWriter writer = new StringWriter(); //ouput will be stored here

        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptContext context = new SimpleScriptContext();

        context.setWriter(writer); //configures output redirection
        ScriptEngine engine = manager.getEngineByName("python");
        engine.eval(new FileReader("src/sample/hello.py"), context);
        System.out.println(writer.toString());


        pythonInterpreter();
    }

    private static void pythonInterpreter(){
        PythonInterpreter python = new PythonInterpreter();

        int number1 = 10;
        int number2 = 32;
        python.set("number1", new PyInteger(number1));
        python.set("number2", new PyInteger(number2));
        python.exec("number3 = number1+number2");
        PyObject number3 = python.get("number3");
        System.out.println("val : "+number3.toString());
    }


}
