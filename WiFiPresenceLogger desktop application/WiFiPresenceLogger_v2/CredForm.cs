using System;
using System.Windows.Forms;
using WiFiPresenceLoggerClassLibrary;

namespace WiFiPresenceLogger_v2
{
    public partial class CredForm : Form
    {
        public string Username { get { return usernameTextBox.Text; } }
        public string Password { get { return passwordTextBox.Text; } }

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

            FormBorderStyle = FormBorderStyle.FixedDialog;
            StartPosition = FormStartPosition.CenterScreen;
            MaximizeBox = false;
            MinimizeBox = false;
        }
        
        private void ok_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
