using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WiFiPresenceLoggerClassLibrary;



namespace WiFiPresenceLogger_v2
{   
    public partial class LogIn : Form
    {
        WFPL_Db db = new WFPL_Db();
        DateTime startDate, endDate;

        bool dateCnt = false;

        public LogIn()
        {
            InitializeComponent();

            try
            {
                if (db.getLastUser() != null)
                {
                    textBoxUser.Text = db.getLastUser().name;
                }
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            monthCalendar1.MaxDate = DateTime.Now;
            //var user = new Subject { name = "oop", surname = "", ID = 1, isLast = 1 };// e sad vidji samo sta ti je islast i id  i prezime :) jer ovo bi puklo, users je set User klase, tako da si pokusao dodati subject
            //db.Users.Add(user);
            //db.SaveChanges();
        }

        private void buttonContinue_Click(object sender, EventArgs e)
        {

        }

        private void linkLabelNotYou_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            SignUp.Visible = true;

            var query = from user in db.Users
                        orderby user.ID
                        select user;

            int y = 10;
            foreach (var item in query)
            {
                LinkLabel linkLabel = new LinkLabel();
                linkLabel.Text = item.name + ' ' + item.surname;
                linkLabel.LinkClicked += new LinkLabelLinkClickedEventHandler(LinkedLabelClicked);
                linkLabel.Location = new Point(300, y);
                ShowUsers.Controls.Add(linkLabel);
                y += 30;
            }
        }

        private void LinkedLabelClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            var person = sender.ToString().Substring(38).Split(' ');
            var personName = person[0];
            var personSurname = person[1];

            db.getLastUser().isLast = 0;

            var query = from user in db.Users
                        where user.name == personName
                        select user;

            foreach (var item in query)
            {
                item.isLast = 1;
            }

            db.SaveChanges();
            Choose.Visible = true;
        }

        private void buttonDodaj_Click(object sender, EventArgs e)
        {
            var ime = textBoxName.Text;
            var prezime = textBoxSurname.Text;

            if (db.getLastUser() != null)
            {
                db.getLastUser().isLast = 0;
            }

            var user = new User { name = ime, surname = prezime, isLast = 1 };
            db.Users.Add(user);
            db.SaveChanges();

            SignUp.Visible = false;
            textBoxUser.Text = db.getLastUser().name;
        }

        private void buttonSubjects_Click(object sender, EventArgs e)
        {

        }

        private void buttonLogIn_Click(object sender, EventArgs e)
        {
            //

            //
            Choose.Visible = false;
            SignUp.Visible = false;
            textBoxUser.Text = db.getLastUser().name;
        }

        private void Choose_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            Api api = new Api();
            List<string> lista = new List<string>();

            //"ana voli milovana"=="ana voli milovana"
            //    string hga = "";
            //string c = "";
            //bool y = hga.Equals(c);
            //int a = lista.Where(x => x.Equals("")).ToList().Count;
            //var b = (from x in lista where string.IsNullOrEmpty(x.Trim()) select x).ToList().Count;
            
            //odredjivanje datuma
            List<string> dayOFTheWeek = new List<string>();
            for (DateTime i = startDate.Date; i <= endDate.Date; i = i.AddDays(1))
            {
                if (i.DayOfWeek.ToString().Equals(domainUpDown1.Text))
                    dayOFTheWeek.Add(i.ToString("dd_MM_yy"));
            }

            //upis tabela
            Dictionary<string, string> tableData = new Dictionary<string, string>();
            
            foreach (var item in dayOFTheWeek)
            {
                string httpResponse = api.getData(item);
                tableData.Add(item, httpResponse);

            }

            //upis studenata u db
            List<string> arrayOfRegStudents = new List<string>(api.getRegList().Split(';'));
            arrayOfRegStudents.RemoveAll(o => o.Equals(""));
            foreach (string row in arrayOfRegStudents)
            {
                List<string> oneRow = new List<string>(row.Split('|'));
                Student student = new Student {name = oneRow.ElementAt(2), surname = oneRow.ElementAt(3), macAddr = oneRow.ElementAt(1),StudentID = oneRow.ElementAt(4) };
                if (db.Students.Where(o => o.macAddr == student.macAddr).Count() == 0)
                {
                    db.Students.Add(student);
                }
            }
            db.SaveChanges();

            ExcelTable excelTbl = new ExcelTable();
            MessageBox.Show("prenos zavrsen", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            //MessageBox.Show(String.Join(" ; ", ableData.Select(x => x.Key + "=" + x.Value)), "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

            //dictionary sa svim tabelama
            foreach (var item in tableData)
            {
                //lista izparsirane tabele po redovima
                if (item.Value.Equals("Tabela ne postoji"))
                    continue;
                List<string> oneTable = new List<string>(item.Value.Split(';'));
                foreach (var item1 in oneTable)
                {
                    //lista izparsiranog reda
                    List<string> oneRow = new List<string>(item1.Split('|'));

                    //ako kojim slucajem nemamo izlazni datum
                    if (oneRow.ElementAt(4).Equals(null))
                        continue;
                    //ako je postojeca mac adresa:
                    string macH = oneRow.ElementAt(1);
                    Student std = db.Students.Where(x => x.macAddr.Equals(macH)).FirstOrDefault();
                    if (std != null)
                    {
                        //Student std = db.Students.Where(x => x.macAddr.ToString().Equals(oneRow.ElementAt(1))).First();

                        if (!excelTbl.tableRows.Exists(o => o.macAddr.Equals(oneRow.ElementAt(1))))
                        {
                            ExcelRow excRw = new ExcelRow(std.name,std.surname,std.StudentID,std.macAddr,dayOFTheWeek);
                            excelTbl.tableRows.Add(excRw);
                        }
                        excelTbl.tableRows.Where(it => it.macAddr.Equals(oneRow.ElementAt(1))).FirstOrDefault().insertTermin(item.Key, (int)numericStart.Value, (int)numericEnd.Value, oneRow.ElementAt(3), oneRow.ElementAt(4));;
                    }
                }
            }
            MessageBox.Show(excelTbl.generateOutputString(), "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            excelTbl.generateExcellFile();
        }

        private void monthCalendar1_DateChanged(object sender, DateRangeEventArgs e)
        {

        }

        private void domainUpDown1_SelectedItemChanged(object sender, EventArgs e)
        {

        }
        private void monthCalendar1_DateSelected(object sender, DateRangeEventArgs e)
        {
            if (dateCnt)
            {

                endDate = monthCalendar1.SelectionRange.Start;
                labelEnd.Text = monthCalendar1.SelectionRange.Start.ToShortDateString().ToString();
            }
            else
            {
                startDate = monthCalendar1.SelectionRange.Start;
                labelStart.Text = monthCalendar1.SelectionRange.Start.ToShortDateString().ToString();
            }
            dateCnt = !dateCnt;
        }
    }
}
