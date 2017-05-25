package sample;

import javafx.fxml.FXML;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

class Home{
    public static String Home = "~/Documents/WiFresenceLogger/WebServer/serviceApp/";
}

public class Controller extends Home{

    @FXML
    public void Runner() throws IOException {
//        ProcessBuilder b = new ProcessBuilder("node "+Home+"api.js");
//        try {
//            b.start();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

//        Runtime rt = Runtime.getRuntime();
//        String[] commands = {"node ./serviceApp/api.js"};
//        Process proc;
//        try {
//            proc = rt.exec(commands);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        String[] args = new String[] {"/bin/bash", "-c", "node ./serviceApp/api.js"};
        Process proc = new ProcessBuilder(args).start();

//        BufferedReader br = new BufferedReader(new FileReader("./serviceApp/api.js"));
//        try {
//            StringBuilder sb = new StringBuilder();
//            String line = br.readLine();
//
//            while (line != null) {
//                sb.append(line);
//                sb.append(System.lineSeparator());
//                line = br.readLine();
//            }
//            String everything = sb.toString();
//            String a = "";
//        } finally {
//            br.close();
//        }

    }
}
