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
    public partial class subjectForm : Form
    {
        WFPL_Db db;
        public subjectForm()
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
        }
        private void addSub_Click(object sender, EventArgs e)
        {
            string name = textBox1.Text;
            DateTime startDate = monthCalendar1.SelectionStart;
            DateTime endDate = monthCalendar1.SelectionEnd;
            decimal startTime = numericStart.Value;
            decimal endTime = numericEnd.Value;
            object dayOfWeek = domainUpDown1.SelectedItem;
            int userID = db.getLastUser().ID;

            if (name == "")
            {
                MessageBox.Show("Ime predmeta nije uneto.", "Warning",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (dayOfWeek == null)
            {
                MessageBox.Show("Dan u nedelji odrzavanja predmeta nije unet.", "Warning",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            string dayOfWeekStr = dayOfWeek.ToString();

            if (startTime > endTime)
            {
                MessageBox.Show("Vreme pocetka ne moze da bude vece od vremena zavrsetka", "Warning",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            var overlapQuery =
                from subject in db.Subjects
                where
                    subject.userID == userID
                    && subject.dayOfWeek == dayOfWeekStr
                select subject;

            foreach (Subject subject in overlapQuery)
            {
                if (Convert.ToInt32(subject.startTime) < startTime
                        && Convert.ToInt32(subject.startTime) + subject.durationTime >= startTime
                    || Convert.ToInt32(subject.startTime) < endTime
                        && Convert.ToInt32(subject.startTime) + subject.durationTime >= endTime
                    || startTime < Convert.ToInt32(subject.startTime)
                        && endTime > Convert.ToInt32(subject.startTime))
                {
                    MessageBox.Show("Postoji predmet koji isti profesor drzi u isto vreme", "Warning",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
            }

            Subject newSubject = new Subject
            {
                // ID = ???,
                userID = userID,
                dayOfWeek = dayOfWeekStr,
                startTime = startTime.ToString(),
                durationTime = (int)(endTime - startTime),
                name = name
            };
            db.Subjects.Add(newSubject);
            db.SaveChanges();
        }
    }
}
