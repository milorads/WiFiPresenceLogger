using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Excel = Microsoft.Office.Interop.Excel;

namespace WiFiPresenceLogger_v2
{
    public class ExcelRow
    {
        public string StudentName;
        public string StudentSurname;
        public string StudentID;

        //macAddr se ne upisuje u tabelu, on je jedinstveni indetifikator
        public string macAddr;
        //key = date, data = noOFpoints
        public Dictionary<string, int> Termins;
        public int StudentPoint;

        public ExcelRow()
        {
            Termins = new Dictionary<string, int>();
        }
        public ExcelRow(string stdName, string stdSurname, string stdID, string mac,List<string> termins)
        {
            StudentName = stdName;
            StudentSurname = stdSurname;
            StudentID = stdID;
            macAddr = mac;
            Termins = new Dictionary<string, int>();
            foreach (var x in termins)
            {
                Termins.Add(x, 0);
            }
        }
        public void insertTermin(string dateStr, int startTimeStr, int endTimeStr, string entraceTimeStr, string exitTimeStr)
        {
            //provera

            

            DateTime startTime = DateTime.ParseExact(dateStr, "dd_MM_yy", System.Globalization.CultureInfo.InstalledUICulture);
            startTime = startTime.AddHours(startTimeStr);

            DateTime endTime = DateTime.ParseExact(dateStr, "dd_MM_yy", System.Globalization.CultureInfo.InstalledUICulture);
            endTime = endTime.AddHours(endTimeStr);


            DateTime entraceTime = DateTime.ParseExact(entraceTimeStr, "yyyy-MM-dd HH:mm:ss.ffffff", System.Globalization.CultureInfo.InstalledUICulture);

            DateTime exitTime;
            if (exitTimeStr.Equals(""))
            {
                //pretpostavka da ako ne postoji vreme izlaza, klijent je jos uvek prikacen na wifi pa mu dodeljujemo vreme kraja termina
                exitTime = endTime;
            }
            else
            {
                exitTime = DateTime.ParseExact(exitTimeStr, "yyyy-MM-dd HH:mm:ss.ffffff", System.Globalization.CultureInfo.InstalledUICulture);
            }

            if (entraceTime <= startTime && exitTime >= endTime)
            {
                Termins[dateStr] += (int)endTime.Subtract(startTime).TotalMinutes;
            }
            else if (entraceTime < startTime && exitTime < endTime)
            {
                Termins[dateStr] += (int)exitTime.Subtract(startTime).TotalMinutes;
            }
            else if (entraceTime >= startTime && exitTime <= endTime)
            {
                Termins[dateStr] += (int)exitTime.Subtract(entraceTime).TotalMinutes;
            }
            else if (entraceTime >= startTime && exitTime >= endTime)
            {
                Termins[dateStr] += (int)endTime.Subtract(entraceTime).TotalMinutes;
            }

            /*
                DateTime myDate = DateTime.ParseExact("2009-05-08 14:40:52,531", "yyyy-MM-dd HH:mm:ss,fff",
                                        System.Globalization.CultureInfo.InvariantCulture);
                * */
        }

    }
    public class ExcelTable
    {
        public string TableName;
        public string Description;
        public string SubjectName;
        public List<ExcelRow> tableRows;

        public ExcelTable()
        {
            tableRows = new List<ExcelRow>();
        }
        //jos jedna funkcija: prilikom kreiranja novog reda, odmak napravimo listu sa terminima, kasnije necemo moci zbog "Tabela ne postoji"
        public string generateOutputString()
        {
            string output = "";
            foreach (var item in tableRows)
            {
                output += item.StudentName + " " + item.StudentSurname + " " + item.StudentID + "|";
                foreach (var it in item.Termins)
                {
                    output += it.Key + ":[" + it.Value.ToString() + "|";
                }
                output += Environment.NewLine;
            }
            return output;
        }

        public void generateExcellFile()
        {
            var excelApp = new Excel.Application();

            excelApp.Visible = true;

            excelApp.Workbooks.Add();

            Excel._Worksheet workSheet = (Excel.Worksheet)excelApp.ActiveSheet;

            workSheet.Cells[1,1] = "Ime";
            workSheet.Cells[1,2] = "Prezime";
            workSheet.Cells[1,3] = "Index";
            var row = 4;
            foreach (var item in tableRows[0].Termins)
            {
                workSheet.Cells[1, row] = item.Key;
                row++;
            }

            row = 1;
            foreach (var exclRow in tableRows)
            {
                row++;
                workSheet.Cells[row,1] = exclRow.StudentName;
                workSheet.Cells[row,2] = exclRow.StudentSurname;
                workSheet.Cells[row,3] = exclRow.StudentID;
                var row1 = 4;
                foreach (var item in exclRow.Termins)
                {
                    if (item.Value.Equals(0))
                        workSheet.Cells[row, row1] = "/";
                    else
                        workSheet.Cells[row, row1] = item.Value;
                    row1++;
                }
            }
            workSheet.Columns.AutoFit();
        }

        
    }

}
