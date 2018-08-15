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
    public partial class LogIn : Form, IUserApplication
    {
        WFPL_Db db;
        DateTime startDate, endDate;
        TableList currentTableListState;
        Api api;
        User currentUser;
        bool dateOK;
        Form form1;
        bool dateCnt = false;

        public LogIn()
        {
            InitializeComponent();
            try
            {
                db = new WFPL_Db();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            
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

            currentTableListState = new TableList();
            //currentTableListState.getCurrentList();

            api = new Api(this);
            string res = api.apiTest1();
            MessageBox.Show(res, "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        //
        // Forma u kojoj se popunjavaju username i password korisnika
        //
        public void AskForCredentials(out string username, out string password)
        {
            CredForm form = new CredForm();
            form.ShowDialog(this);
            
            username = form.Username;
            password = form.Password;
        }
        //
        // Korisnik se ulogovao sa vec ulogovanim nalogom
        //
        private void buttonContinue_Click(object sender, EventArgs e)
        {
            Choose.Show();
            SignUp.Show();
        }
        //
        // Korisnik je kliknuo da trenutni ulogovani nalog nije njegov
        //
        private void linkLabelNotYou_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            SignUp.Show();
            Choose.Hide();

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
        //
        // Korisnik je izabrao jedan od ponudjenih naloga
        //
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
            Choose.Show();
            currentUser = db.getLastUser();
        }
        //
        // Dodavanje novog naloga u sistem
        //
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

            SignUp.Hide();
            textBoxUser.Text = db.getLastUser().name;
        }
        //
        // Ispis svih predmeta
        //
        private void buttonSubjects_Click(object sender, EventArgs e)
        {
            var query = from subject in db.Subjects select subject;
            string message = "";

            foreach (Subject subject in query)
            {
                if (DateTime.Parse(subject.startDate) <= DateTime.Now
                    && DateTime.Now <= DateTime.Parse(subject.endDate))
                {
                    string subjectString = subject.name + '\t' + subject.dayOfWeek + '\t'
                        + subject.startTime + '\t' + subject.durationTime + '\n';
                    message += subjectString;
                }
                MessageBox.Show(message);
            }
        }
        //
        // Ponovno logovanje (iz glavnog prozora)
        //
        private void buttonLogIn_Click(object sender, EventArgs e)
        {
            Choose.Hide();
            SignUp.Hide();
            textBoxUser.Text = db.getLastUser().name;
        }
        //
        // Poziva se pri Show-ovanju Choose panela
        //
        private void Choose_Paint(object sender, PaintEventArgs e)
        {

        }
        //
        // Pravljenje excel tabele
        //
        private void button1_Click(object sender, EventArgs e)
        {
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
                if (item.Value.Equals("Tabela ne postoji") || item.Value.Equals(""))
                    continue;
                List<string> oneTable = new List<string>(item.Value.Split(';'));
                foreach (var item1 in oneTable)
                {
                    //lista izparsiranog reda
                    List<string> oneRow = new List<string>(item1.Split('|'));

                    //ako kojim slucajem nemamo izlazni datum
                    if (oneRow.ElementAt(4).Equals(""))
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
            //textBox1.Text = excelTbl.generateOutputString();
            excelTbl.generateExcellFile();

            /***************************************************************/
            foreach (var item in dayOFTheWeek)
            {
                //tableListBox.Items.Remove(item);
                tablesDeleteListBox.Items.Add("T" + item);
                currentTableListState.ListOfDeletedTables.Add("T" + item.ToString());
                tableListBox.Items.Remove("T" + item);
            }
            foreach (var item in currentTableListState.ListOfTables)
            {
                tableListBox.Items.Add(item.ToString());
            }
            //for (int i = dayOFTheWeek.Count - 1; i >= 0; i--)
            //    tableListBox.Items.Remove(i);
            /***************************************************************/
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
                if (endDate < startDate)
                {
                    startDate = default(DateTime);
                    endDate = default(DateTime);
                    labelStart.Text = "";
                    labelEnd.Text = "";
                    MessageBox.Show("neispravni unos!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                else
                    labelEnd.Text = endDate.ToShortDateString().ToString();
                dateOK = true;
            }
            else
            {
                startDate = default(DateTime);
                endDate = default(DateTime);
                labelStart.Text = "";
                labelEnd.Text = "";

                startDate = monthCalendar1.SelectionRange.Start;
                labelStart.Text = startDate.ToShortDateString().ToString();
            }
            dateCnt = !dateCnt;
        }
        //
        // Prebacivanje iz liste tabela u listu obrisanih tabela
        //
        private void addToDeleteListBtn_Click(object sender, EventArgs e)
        {
            foreach (var item in tableListBox.SelectedItems)
            {
                //tableListBox.Items.Remove(item);
                tablesDeleteListBox.Items.Add(item);
                currentTableListState.ListOfDeletedTables.Add(item.ToString());
            }
            for (int i = tableListBox.SelectedItems.Count - 1; i >= 0; i--)
                tableListBox.Items.Remove(tableListBox.SelectedItems[i]);
        }
        //
        // Prebacivanje iz liste obrisanih tabela u listu tabela
        //
        private void removeFromDeleteListBtn_Click(object sender, EventArgs e)
        {
            foreach (var item in tablesDeleteListBox.SelectedItems)
            {
                tableListBox.Items.Add(item);
                currentTableListState.ListOfDeletedTables.Remove(item.ToString());
            }
            for (int i = tablesDeleteListBox.SelectedItems.Count - 1; i >= 0; i--)
                tablesDeleteListBox.Items.Remove(tablesDeleteListBox.SelectedItems[i]);
        }
        //
        // Refresh-ovanje lista tabela
        //
        private void refreshBtn_Click(object sender, EventArgs e)
        {
            currentTableListState.refreshTableState();
            tableListBox.Items.Clear();
            tablesDeleteListBox.Items.Clear();
            foreach (var item in currentTableListState.ListOfTables)
            {
                tableListBox.Items.Add(item.ToString());
            }
            tablesDeleteListBox.Items.Clear();
        }
        //
        // Brisanje tabela izabranih za brisanje
        //
        private void tableDeleteBtn_Click(object sender, EventArgs e)
        {
            currentTableListState.deleteTables();
            currentTableListState.refreshTableState();
            for (int i = tablesDeleteListBox.Items.Count - 1; i >= 0; i--)
                tablesDeleteListBox.Items.Remove(tablesDeleteListBox.Items[i]);
        }
        //
        // Broj sekundi za koji kasni vreme na uredjaju
        //
        private void rtcShiftBtn_Click(object sender, EventArgs e)
        {
            string shiftSeconds = api.getTimeShift();
            rtcShiftLabel.Text = "time shift:" + shiftSeconds + " s";
        }
        //
        // Set-ovanje vremena na uredjaju
        //
        private void setTimeBtn_Click(object sender, EventArgs e)
        {
            //exitTime = DateTime.ParseExact(exitTimeStr, "yyyy-MM-dd HH:mm:ss.ffffff", System.Globalization.CultureInfo.InstalledUICulture);
            DateTime utcTimestamp = DateTime.UtcNow;
            string response = api.setSystemTime("0",utcTimestamp.ToString("o"));
            MessageBox.Show("Vreme je setovano na (UTC):" + utcTimestamp.ToString("o"), "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        //
        // Menjanje ssid-a pritiskom na 'set WiFi parameters'
        //
        private void ssidCheckBox_CheckedChanged(object sender, EventArgs e)
        {
            if (ssidCheckBox.CheckState == CheckState.Checked)
                ssidTextBox.Enabled = true;
            else
                ssidTextBox.Enabled = false;
        }
        //
        // Menjanje password-a pritiskom na 'set WiFi parameters'
        //
        private void passwordCheckBox_CheckedChanged(object sender, EventArgs e)
        {
            if (passwordCheckBox.CheckState == CheckState.Checked)
                passwordTextBox.Enabled = true;
            else
                passwordTextBox.Enabled = false;
        }
        //
        // 'set WiFI parameters' dugme
        //
        private void button2_Click(object sender, EventArgs e)
        {
            api.wifiSetting(ssidTextBox.Text, passwordTextBox.Text);
            MessageBox.Show("Connect again to WiFi network", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        //
        //
        //
        private void subjectAddBtn_Click(object sender, EventArgs e)
        {
            var subjectForm = new subjectForm();
            subjectForm.Show();
        }
        //
        // API test dugme
        //
        private void button3_Click(object sender, EventArgs e)
        {
            MessageBox.Show(api.apiTest1(), "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

    }
}
