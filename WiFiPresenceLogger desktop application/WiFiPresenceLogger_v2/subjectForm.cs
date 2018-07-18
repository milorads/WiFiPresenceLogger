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

            int startTime = new DateTime(1, 1, 1, (int)numericStart.Value, 0, 0)
                .ToUniversalTime().Hour;
            int endTime = new DateTime(1, 1, 1, (int)numericEnd.Value, 0, 0)
                .ToUniversalTime().Hour;

            object dayOfWeek = domainUpDown1.SelectedItem;
            int userID = db.getLastUser().ID;

            try
            {
                if (name == "")
                {
                    throw new Exception("Ime predmeta nije uneto.");
                }

                if (dayOfWeek == null)
                {
                    throw new Exception("Dan u nedelji odrzavanja predmeta nije unet.");
                }
                string dayOfWeekStr = dayOfWeek.ToString();

                if (startTime >= endTime)
                {
                    throw new Exception("Predavanje mora da pocne pre nego sto se zavrsi.");
                }

                var overlapQuery =
                    from subject in db.Subjects
                    where
                        subject.userID == userID
                        && subject.dayOfWeek == dayOfWeekStr
                    select subject;

                foreach (Subject subject in overlapQuery)
                {
                    if (Convert.ToInt32(subject.startTime) <= startTime
                            && Convert.ToInt32(subject.startTime) + subject.durationTime > startTime
                        || Convert.ToInt32(subject.startTime) < endTime
                            && Convert.ToInt32(subject.startTime) + subject.durationTime >= endTime
                        || startTime <= Convert.ToInt32(subject.startTime)
                            && endTime > Convert.ToInt32(subject.startTime))
                    {
                        throw new Exception("Postoji predmet koji isti profesor drzi u isto vreme");
                    }
                }

                Subject newSubject = new Subject
                {
                    // ID = ???,
                    name = name,
                    userID = userID,
                    startTime = startTime.ToString(),
                    durationTime = endTime - startTime,
                    dayOfWeek = dayOfWeekStr,
                    startDate = startDate.ToString(),
                    endDate = endDate.ToString()
                };
                db.Subjects.Add(newSubject);
                db.SaveChanges();
            }
            catch (Exception exception)
            {
                MessageBox.Show(exception.Message, "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
    }
}
