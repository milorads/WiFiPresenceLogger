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

        public LogIn()
        {
            InitializeComponent();

            if (db.getLastUser() != null)
            {
                textBoxUser.Text = db.getLastUser().name;
            }

            var subject = new Subject { name = "oop", startTime = prezime, isLast = 1 };
            db.Users.Add(user);
            db.SaveChanges();
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
            Choose.Visible = false;
            SignUp.Visible = false;
            textBoxUser.Text = db.getLastUser().name;
        }
    }
}
