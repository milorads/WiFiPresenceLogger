package finalControl.Models;

/**
 * Created by milor on 28.5.2017..
 */
public class Ip {
    private String[] iParts;

    public Ip(String ip) throws Exception {
        String[] ipParts = ip.split(".");
        if (ipParts.length >= 0) {
            if (ipParts.length == 3) {//valid ip
                boolean ind = true;
                for (String mac : ipParts) {
                    if(mac.length() != 2){ind = false;}
                }
                if(!ind){
                    throw new Exception("Not valid mac");
                }
                else{
                    iParts = ipParts;
                }
            } else {
                throw new Exception("Not valid mac");
            }
        } else {
            throw new Exception("Not valid mac");
        }
    }

    public String Get(){
        return String.join(".",iParts);
    }
}
