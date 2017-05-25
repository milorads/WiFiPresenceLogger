package sample;

import javafx.fxml.FXML;

public class Controller {

    @FXML
    public void Runner(){
        ProcessBuilder b = new ProcessBuilder("node mynodejs.js", "-args");
    }
}
