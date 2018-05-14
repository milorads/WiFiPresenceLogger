using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WiFiPresenceLoggerClassLibrary;


namespace WiFiPresenceLogger_v2
{
    public class TableList
    {
        public List<string> ListOfTables;

        public List<string> ListOfDeletedTables;

        private Api httpApiObj;
        public TableList()
        {
            ListOfTables = new List<string>();
            ListOfDeletedTables = new List<string>();
            httpApiObj = new Api();
        }

        public void getCurrentList()
        {
            string httpResponse = httpApiObj.listData();
            var ListOfTables = httpResponse.Split(';');
            foreach (var item in ListOfTables)
            {
                if (!item.Equals(null))
                    this.ListOfTables.Add(item);
            }
        }
        public void addDeletedTables(List<string> delTables)
        {
            ListOfDeletedTables.AddRange(delTables);
        }
        public void refreshTableState()
        {
            ListOfTables.Clear();
            ListOfDeletedTables.Clear();
            getCurrentList();
        }
        public void deleteTables()
        {
            httpApiObj.deleteData(String.Join<string>(",", ListOfDeletedTables));
            refreshTableState();
        }
    }
}
