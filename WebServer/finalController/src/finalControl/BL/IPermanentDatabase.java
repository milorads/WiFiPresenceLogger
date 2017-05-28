package finalControl.BL;

import finalControl.Models.PDBModel;

/**
 * Created by milor on 28.5.2017..
 */
public interface IPermanentDatabase {
     PDBModel[] GetAll();// dummy parameter
     boolean AddRecord(PDBModel model);

}
