package finalControl.BL;

import finalControl.Models.TDBModel;

import java.util.ArrayList;

/**
 * Created by milor on 28.5.2017..
 */
public interface ITemporaryDatabase {
    ArrayList<TDBModel> GetAll();
    boolean AddRecord(TDBModel model);
}
