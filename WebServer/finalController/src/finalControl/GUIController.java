package finalControl;

import finalControl.BL.PDatabaseHandler;
import finalControl.BL.ThreadController;
import javafx.fxml.FXML;

import java.awt.*;
import java.sql.*;
import java.io.IOException;
import java.util.Dictionary;
import java.util.Hashtable;

class Home{
    public static String Home = "~/Documents/WiFresenceLogger/WebServer/serviceApp/";
}

public class GUIController extends Home {

//    @FXML
//    private ScrollPane scrollPane;
//
//    public ScrollPane sp(){
//        return scrollPane;
//    }

    @FXML
    public void Runner() throws IOException {

        //String[] args = new String[] {"/bin/bash", "-c", "node ./nodeWebServer/api.js"};
        //Process proc = new ProcessBuilder(args).start();
        ThreadController t = new ThreadController();
        //test
        Thread separate = new Thread(t);

        Hashtable<ThreadController.Parameters, Object> a = new Hashtable<>();
        a.put(ThreadController.Parameters.ClassLength, 5);
        a.put(ThreadController.Parameters.TimeUnit, "seconds");
        t.Settings = a;
        separate.start();
    }
}
