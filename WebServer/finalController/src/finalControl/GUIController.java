package finalControl;

import finalControl.BL.PDatabaseHandler;
import finalControl.BL.ThreadController;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.scene.control.*;

import java.sql.*;
import java.io.IOException;
import java.util.Calendar;
import java.util.Dictionary;
import java.util.Hashtable;

class Home{
    public static String Home = "~/Documents/WiFresenceLogger/WebServer/serviceApp/";
}

public class GUIController extends Home {

    @FXML
    private Button runner;
    @FXML
    private ProgressBar progress;
    @FXML
    private TextField clsLen;
    @FXML
    private ComboBox tmUnit;
    @FXML
    private TextField numOfCls;
    @FXML
    private TextField breakLen;
    @FXML
    private TextField clsName;
    @FXML
    private TextField faculty;
    @FXML
    private TextField yr;
    @FXML
    private TextField professorName;

    @FXML
    public void Runner() throws IOException {
        if(Validation()){
        //String[] args = new String[] {"/bin/bash", "-c", "node ./nodeWebServer/api.js"};
        //Process proc = new ProcessBuilder(args).start();
        ThreadController t = new ThreadController();
        //test
        Thread separate = new Thread(t);
        //tester
        Hashtable<ThreadController.Parameters, Object> a = new Hashtable<>();
        a.put(ThreadController.Parameters.ClassLength, 5);
        a.put(ThreadController.Parameters.TimeUnit, "seconds");
        t.Settings = a;
        //tester

        //later
        // add validation
        t.Settings = generateDictionary();
        //later
        separate.start();
        int seconds = 0;
        switch ((String)t.Settings.get(ThreadController.Parameters.TimeUnit)){
            case "seconds":
                seconds = (int)t.Settings.get(ThreadController.Parameters.ClassLength)*(int)t.Settings.get(ThreadController.Parameters.NumberOfClasses)+
                        (int)t.Settings.get(ThreadController.Parameters.BreakLength);
            case "minutes":
                seconds = (int)t.Settings.get(ThreadController.Parameters.ClassLength)*60*(int)t.Settings.get(ThreadController.Parameters.NumberOfClasses)+
                        (int)t.Settings.get(ThreadController.Parameters.BreakLength)*60;
            case "hours":
                seconds = (int)t.Settings.get(ThreadController.Parameters.ClassLength)*3600*(int)t.Settings.get(ThreadController.Parameters.NumberOfClasses)+
                        (int)t.Settings.get(ThreadController.Parameters.BreakLength)*3600;
            default:
                seconds = 0;
        }
        // turn on progress bar
        }
        else{
            //alert
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Data error");
            alert.setHeaderText("Some of data you entered needs to be changed in order to start server.");
            alert.setContentText(errorMessage);
            alert.showAndWait();
        }
    }

    private String errorMessage = "";

    private Hashtable<ThreadController.Parameters, Object> generateDictionary(){
        Hashtable<ThreadController.Parameters, Object> dict = new Hashtable<>();
        int len = Integer.parseInt(clsLen.getText());
        dict.put(ThreadController.Parameters.ClassLength, len);
        String tmUnits = tmUnit.getValue().toString();
        dict.put(ThreadController.Parameters.TimeUnit, tmUnits);
        int numCls = Integer.parseInt(numOfCls.getText());
        dict.put(ThreadController.Parameters.NumberOfClasses, numCls);
        int brkLen = Integer.parseInt(breakLen.getText());
        dict.put(ThreadController.Parameters.BreakLength, brkLen);
        String classNm = clsName.getText().toString();
        dict.put(ThreadController.Parameters.ClassName, classNm);
        String faxName = faculty.getText().toString();
        dict.put(ThreadController.Parameters.FacultyName, faxName);
        int year = Integer.parseInt(yr.getText());
        dict.put(ThreadController.Parameters.YearOfStudies, year);
        String prName = professorName.getText().toString();
        dict.put(ThreadController.Parameters.ProfessorName, prName);
        return dict;
    }

    private boolean Validation(){
        boolean indicator = true;
        try{
            int len = Integer.parseInt(clsLen.getText());
            String tmUnits = tmUnit.getValue().toString();
            int numCls = Integer.parseInt(numOfCls.getText());
            int brkLen = Integer.parseInt(breakLen.getText());
            String classNm = clsName.getText().toString();
            String faxName = faculty.getText().toString();
            int year = Integer.parseInt(yr.getText());
            String prName = professorName.getText().toString();
            if (len <= 0 || numCls <= 0 || brkLen <= 0 || year <=0){ indicator = false; errorMessage = "Some of the number fields are either 0 or less.";}
        }
        catch(Exception e){
            errorMessage = e.getMessage();
            indicator = false;
        }
        return indicator;
    }
}
