package finalControl.Models;

/**
 * Created by milor on 28.5.2017..
 */
public class Mac {

    private String[] mParts;

    public Mac(String Mac) throws Exception {
        String[] macParts = Mac.split(":");
        if (macParts.length >= 0) {
            if (macParts.length == 5) {//valid mac
                boolean ind = true;
                for (String mPart : macParts) {
                    if(mPart.length() != 2){ind = false;}
                }
                if(!ind){
                    throw new Exception("Not valid mac");
                }
                else{
                    mParts = macParts;
                }
            } else {
                throw new Exception("Not valid mac");
            }
        } else {
            throw new Exception("Not valid mac");
        }
    }

    public String Get(){
        return String.join(":",mParts);
    }
}
