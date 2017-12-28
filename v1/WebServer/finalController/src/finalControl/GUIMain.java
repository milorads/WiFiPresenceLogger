package finalControl;

import javafx.application.Application;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

import java.awt.*;

public class GUIMain extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception{
        FXMLLoader loader = new FXMLLoader(getClass().getResource("GUIStyle.fxml"));
        Parent root = loader.load();
        //Parent root = FXMLLoader.load(getClass().getResource("GUIStyle.fxml"));
        primaryStage.setTitle("Kontrola registracije");
        primaryStage.setScene(new Scene(root, 320, 480));
        primaryStage.setResizable(false);
        primaryStage.initStyle(StageStyle.UTILITY); // to be UNDECORATED with additional buttons to shutdown system and exit program
        primaryStage.show();
        //ScrollPane sp = (ScrollPane)loader.getNamespace().get("scrollPane");
    }



    public static void main(String[] args) {
        launch(args);
    }
}
