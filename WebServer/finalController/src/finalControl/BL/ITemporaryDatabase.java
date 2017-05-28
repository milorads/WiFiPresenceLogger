package finalControl.BL;

import finalControl.Models.TDBModel;

/**
 * Created by milor on 28.5.2017..
 */
public interface ITemporaryDatabase {
    TDBModel[] GetAll();
    boolean AddRecord(TDBModel model);
}
