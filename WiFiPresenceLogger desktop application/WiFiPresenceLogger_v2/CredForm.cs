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
    public partial class CredForm : Form
    {
        public string Username { get; set; }
        public string Password { get; set; }

        WFPL_Db db;
        public CredForm()
        {
            InitializeComponent();
            try
            {
                db = new WFPL_Db();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        
        private void ok_Click(object sender, EventArgs e)
        {
            try
            {
                Username = usernameTextBox.Text;
                Password = passwordTextBox.Text;
                Close();
            }
            catch (Exception exception)
            {
                MessageBox.Show(exception.Message, "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
    }
}
