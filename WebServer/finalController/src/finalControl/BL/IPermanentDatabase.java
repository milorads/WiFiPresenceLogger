package finalControl.BL;

import finalControl.Models.PDBModel;

import java.util.ArrayList;

/**
 * Created by milor on 28.5.2017..
 */
public interface IPermanentDatabase {
     ArrayList<PDBModel> GetAll();// dummy parameter
     boolean AddRecord(PDBModel model);

}
