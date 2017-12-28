package finalControl.BL;

import java.io.IOException;
import java.util.concurrent.Callable;

/**
 * Created by milor on 28.5.2017..
 */
public class NodeHandler implements Callable{

    private void NodeLogic() throws IOException {
        String[] args = new String[] {"/bin/bash", "-c", "node ./nodeWebServer/finalTest.js"};
            Process proc = new ProcessBuilder(args).start();

    }

    private static int i=0;
    private static void test(){
        System.out.println(i++ +"--");
    }

    @Override
    public String call() throws Exception {
        while(true){
            test();
            if(Thread.interrupted()){
                System.out.println("task -- interrupted");
                break;
            }
        }


        return null;
    }
}
