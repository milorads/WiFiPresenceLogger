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
                for (String ipPart : ipParts) {
                    try{
                        int parsed = Integer.parseInt(ipPart);
                        if(parsed > 255){ind = false;}
                    }
                    catch (Exception e){throw new Exception("Not valid ip");}
                }
                if(!ind){
                    throw new Exception("Not valid ip");
                }
                else{
                    iParts = ipParts;
                }
            } else {
                throw new Exception("Not valid ip");
            }
        } else {
            throw new Exception("Not valid ip");
        }
    }

    public String Get(){
        return String.join(".",iParts);
    }
}
