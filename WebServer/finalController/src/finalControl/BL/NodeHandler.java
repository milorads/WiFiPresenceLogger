package finalControl.BL;

import java.io.IOException;

/**
 * Created by milor on 28.5.2017..
 */
public class NodeHandler {

    private void NodeLogic() throws IOException {
        String[] args = new String[] {"/bin/bash", "-c", "node ./nodeWebServer/finalTest.js"};
            Process proc = new ProcessBuilder(args).start();

    }
}
