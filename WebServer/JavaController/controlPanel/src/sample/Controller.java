package sample;

import javafx.fxml.FXML;

import java.io.IOException;

class Home{
    public static String Home = "~/Documents/WiFresenceLogger/WebServer/serviceApp/";
}

public class Controller extends Home{

    @FXML
    public void Runner(){
//        ProcessBuilder b = new ProcessBuilder("node "+Home+"api.js");
//        try {
//            b.start();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        Runtime rt = Runtime.getRuntime();
        String[] commands = {"node "+Home+"api.js"};
        Process proc;
        try {
            proc = rt.exec(commands);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
