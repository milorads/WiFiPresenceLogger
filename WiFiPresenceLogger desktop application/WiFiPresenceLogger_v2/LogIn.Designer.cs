namespace WiFiPresenceLogger_v2
{
    partial class LogIn
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.buttonContinue = new System.Windows.Forms.Button();
            this.labelTitle = new System.Windows.Forms.Label();
            this.linkLabelNotYou = new System.Windows.Forms.LinkLabel();
            this.textBoxUser = new System.Windows.Forms.TextBox();
            this.SignUp = new System.Windows.Forms.Panel();
            this.Choose = new System.Windows.Forms.Panel();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.numericEnd = new System.Windows.Forms.NumericUpDown();
            this.domainUpDown1 = new System.Windows.Forms.DomainUpDown();
            this.numericStart = new System.Windows.Forms.NumericUpDown();
            this.labelEnd = new System.Windows.Forms.Label();
            this.labelStart = new System.Windows.Forms.Label();
            this.monthCalendar1 = new System.Windows.Forms.MonthCalendar();
            this.button1 = new System.Windows.Forms.Button();
            this.buttonSubjects = new System.Windows.Forms.Button();
            this.buttonLogIn = new System.Windows.Forms.Button();
            this.ShowUsers = new System.Windows.Forms.Panel();
            this.buttonDodaj = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxSurname = new System.Windows.Forms.TextBox();
            this.textBoxName = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.SignUp.SuspendLayout();
            this.Choose.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.numericEnd)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericStart)).BeginInit();
            this.SuspendLayout();
            // 
            // buttonContinue
            // 
            this.buttonContinue.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonContinue.Location = new System.Drawing.Point(194, 178);
            this.buttonContinue.Margin = new System.Windows.Forms.Padding(2);
            this.buttonContinue.Name = "buttonContinue";
            this.buttonContinue.Size = new System.Drawing.Size(128, 37);
            this.buttonContinue.TabIndex = 0;
            this.buttonContinue.Text = "Nastavi";
            this.buttonContinue.UseVisualStyleBackColor = true;
            this.buttonContinue.Click += new System.EventHandler(this.buttonContinue_Click);
            // 
            // labelTitle
            // 
            this.labelTitle.AutoSize = true;
            this.labelTitle.Font = new System.Drawing.Font("Microsoft Sans Serif", 22.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelTitle.Location = new System.Drawing.Point(134, 102);
            this.labelTitle.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.labelTitle.Name = "labelTitle";
            this.labelTitle.Size = new System.Drawing.Size(261, 36);
            this.labelTitle.TabIndex = 3;
            this.labelTitle.Text = "Ulogovani ste kao:";
            this.labelTitle.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // linkLabelNotYou
            // 
            this.linkLabelNotYou.AutoSize = true;
            this.linkLabelNotYou.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.linkLabelNotYou.Location = new System.Drawing.Point(228, 217);
            this.linkLabelNotYou.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.linkLabelNotYou.Name = "linkLabelNotYou";
            this.linkLabelNotYou.Size = new System.Drawing.Size(64, 18);
            this.linkLabelNotYou.TabIndex = 5;
            this.linkLabelNotYou.TabStop = true;
            this.linkLabelNotYou.Text = "Niste vi?";
            this.linkLabelNotYou.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.linkLabelNotYou.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkLabelNotYou_LinkClicked);
            // 
            // textBoxUser
            // 
            this.textBoxUser.BackColor = System.Drawing.SystemColors.Menu;
            this.textBoxUser.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.textBoxUser.Location = new System.Drawing.Point(220, 152);
            this.textBoxUser.Margin = new System.Windows.Forms.Padding(2);
            this.textBoxUser.Name = "textBoxUser";
            this.textBoxUser.Size = new System.Drawing.Size(75, 13);
            this.textBoxUser.TabIndex = 6;
            this.textBoxUser.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // SignUp
            // 
            this.SignUp.Controls.Add(this.Choose);
            this.SignUp.Controls.Add(this.ShowUsers);
            this.SignUp.Controls.Add(this.buttonDodaj);
            this.SignUp.Controls.Add(this.label3);
            this.SignUp.Controls.Add(this.label2);
            this.SignUp.Controls.Add(this.textBoxSurname);
            this.SignUp.Controls.Add(this.textBoxName);
            this.SignUp.Controls.Add(this.label1);
            this.SignUp.Dock = System.Windows.Forms.DockStyle.Fill;
            this.SignUp.Location = new System.Drawing.Point(0, 0);
            this.SignUp.Margin = new System.Windows.Forms.Padding(2);
            this.SignUp.Name = "SignUp";
            this.SignUp.Size = new System.Drawing.Size(795, 364);
            this.SignUp.TabIndex = 7;
            this.SignUp.Visible = false;
            // 
            // Choose
            // 
            this.Choose.Controls.Add(this.textBox1);
            this.Choose.Controls.Add(this.numericEnd);
            this.Choose.Controls.Add(this.domainUpDown1);
            this.Choose.Controls.Add(this.numericStart);
            this.Choose.Controls.Add(this.labelEnd);
            this.Choose.Controls.Add(this.labelStart);
            this.Choose.Controls.Add(this.monthCalendar1);
            this.Choose.Controls.Add(this.button1);
            this.Choose.Controls.Add(this.buttonSubjects);
            this.Choose.Controls.Add(this.buttonLogIn);
            this.Choose.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Choose.Location = new System.Drawing.Point(0, 0);
            this.Choose.Margin = new System.Windows.Forms.Padding(2);
            this.Choose.Name = "Choose";
            this.Choose.Size = new System.Drawing.Size(795, 364);
            this.Choose.TabIndex = 16;
            this.Choose.Visible = false;
            this.Choose.Paint += new System.Windows.Forms.PaintEventHandler(this.Choose_Paint);
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(369, 53);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(399, 255);
            this.textBox1.TabIndex = 9;
            // 
            // numericEnd
            // 
            this.numericEnd.Location = new System.Drawing.Point(85, 288);
            this.numericEnd.Maximum = new decimal(new int[] {
            21,
            0,
            0,
            0});
            this.numericEnd.Minimum = new decimal(new int[] {
            8,
            0,
            0,
            0});
            this.numericEnd.Name = "numericEnd";
            this.numericEnd.Size = new System.Drawing.Size(54, 20);
            this.numericEnd.TabIndex = 8;
            this.numericEnd.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            // 
            // domainUpDown1
            // 
            this.domainUpDown1.AllowDrop = true;
            this.domainUpDown1.Items.Add("Monday");
            this.domainUpDown1.Items.Add("Tuesday");
            this.domainUpDown1.Items.Add("Wednesday");
            this.domainUpDown1.Items.Add("Thursday");
            this.domainUpDown1.Items.Add("Friday");
            this.domainUpDown1.Items.Add("Saturday");
            this.domainUpDown1.Items.Add("Sunday");
            this.domainUpDown1.Location = new System.Drawing.Point(152, 288);
            this.domainUpDown1.Name = "domainUpDown1";
            this.domainUpDown1.Size = new System.Drawing.Size(72, 20);
            this.domainUpDown1.TabIndex = 7;
            this.domainUpDown1.SelectedItemChanged += new System.EventHandler(this.domainUpDown1_SelectedItemChanged);
            // 
            // numericStart
            // 
            this.numericStart.Location = new System.Drawing.Point(25, 288);
            this.numericStart.Maximum = new decimal(new int[] {
            21,
            0,
            0,
            0});
            this.numericStart.Minimum = new decimal(new int[] {
            8,
            0,
            0,
            0});
            this.numericStart.Name = "numericStart";
            this.numericStart.Size = new System.Drawing.Size(54, 20);
            this.numericStart.TabIndex = 6;
            this.numericStart.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            // 
            // labelEnd
            // 
            this.labelEnd.AutoSize = true;
            this.labelEnd.Location = new System.Drawing.Point(244, 222);
            this.labelEnd.Name = "labelEnd";
            this.labelEnd.Size = new System.Drawing.Size(0, 13);
            this.labelEnd.TabIndex = 5;
            // 
            // labelStart
            // 
            this.labelStart.AutoSize = true;
            this.labelStart.Location = new System.Drawing.Point(244, 182);
            this.labelStart.Name = "labelStart";
            this.labelStart.Size = new System.Drawing.Size(0, 13);
            this.labelStart.TabIndex = 4;
            // 
            // monthCalendar1
            // 
            this.monthCalendar1.Location = new System.Drawing.Point(25, 114);
            this.monthCalendar1.Name = "monthCalendar1";
            this.monthCalendar1.TabIndex = 3;
            this.monthCalendar1.DateChanged += new System.Windows.Forms.DateRangeEventHandler(this.monthCalendar1_DateChanged);
            this.monthCalendar1.DateSelected += new System.Windows.Forms.DateRangeEventHandler(this.monthCalendar1_DateSelected);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(250, 314);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 2;
            this.button1.Text = "ExcelTable";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // buttonSubjects
            // 
            this.buttonSubjects.Location = new System.Drawing.Point(114, 9);
            this.buttonSubjects.Margin = new System.Windows.Forms.Padding(2);
            this.buttonSubjects.Name = "buttonSubjects";
            this.buttonSubjects.Size = new System.Drawing.Size(110, 36);
            this.buttonSubjects.TabIndex = 1;
            this.buttonSubjects.Text = "LISTA PREDMETA";
            this.buttonSubjects.UseVisualStyleBackColor = true;
            this.buttonSubjects.Click += new System.EventHandler(this.buttonSubjects_Click);
            // 
            // buttonLogIn
            // 
            this.buttonLogIn.Location = new System.Drawing.Point(256, 9);
            this.buttonLogIn.Margin = new System.Windows.Forms.Padding(2);
            this.buttonLogIn.Name = "buttonLogIn";
            this.buttonLogIn.Size = new System.Drawing.Size(110, 36);
            this.buttonLogIn.TabIndex = 0;
            this.buttonLogIn.Text = "ULOGUJ SE";
            this.buttonLogIn.UseVisualStyleBackColor = true;
            this.buttonLogIn.Click += new System.EventHandler(this.buttonLogIn_Click);
            // 
            // ShowUsers
            // 
            this.ShowUsers.AutoScroll = true;
            this.ShowUsers.Location = new System.Drawing.Point(9, 53);
            this.ShowUsers.Margin = new System.Windows.Forms.Padding(2);
            this.ShowUsers.Name = "ShowUsers";
            this.ShowUsers.Size = new System.Drawing.Size(510, 162);
            this.ShowUsers.TabIndex = 15;
            // 
            // buttonDodaj
            // 
            this.buttonDodaj.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonDodaj.Location = new System.Drawing.Point(231, 314);
            this.buttonDodaj.Margin = new System.Windows.Forms.Padding(2);
            this.buttonDodaj.Name = "buttonDodaj";
            this.buttonDodaj.Size = new System.Drawing.Size(72, 32);
            this.buttonDodaj.TabIndex = 14;
            this.buttonDodaj.Text = "Dodaj";
            this.buttonDodaj.UseVisualStyleBackColor = true;
            this.buttonDodaj.Click += new System.EventHandler(this.buttonDodaj_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(127, 271);
            this.label3.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(67, 18);
            this.label3.TabIndex = 13;
            this.label3.Text = "Prezime:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(127, 235);
            this.label2.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(36, 18);
            this.label2.TabIndex = 12;
            this.label2.Text = "Ime:";
            // 
            // textBoxSurname
            // 
            this.textBoxSurname.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textBoxSurname.Location = new System.Drawing.Point(194, 267);
            this.textBoxSurname.Margin = new System.Windows.Forms.Padding(2);
            this.textBoxSurname.Name = "textBoxSurname";
            this.textBoxSurname.Size = new System.Drawing.Size(147, 24);
            this.textBoxSurname.TabIndex = 11;
            // 
            // textBoxName
            // 
            this.textBoxName.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textBoxName.Location = new System.Drawing.Point(194, 232);
            this.textBoxName.Margin = new System.Windows.Forms.Padding(2);
            this.textBoxName.Name = "textBoxName";
            this.textBoxName.Size = new System.Drawing.Size(147, 24);
            this.textBoxName.TabIndex = 10;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 16.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(192, 9);
            this.label1.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(157, 26);
            this.label1.TabIndex = 9;
            this.label1.Text = "LISTA OSOBA";
            // 
            // LogIn
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(795, 364);
            this.Controls.Add(this.SignUp);
            this.Controls.Add(this.textBoxUser);
            this.Controls.Add(this.linkLabelNotYou);
            this.Controls.Add(this.labelTitle);
            this.Controls.Add(this.buttonContinue);
            this.Margin = new System.Windows.Forms.Padding(2);
            this.Name = "LogIn";
            this.Text = "Log In";
            this.SignUp.ResumeLayout(false);
            this.SignUp.PerformLayout();
            this.Choose.ResumeLayout(false);
            this.Choose.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.numericEnd)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericStart)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button buttonContinue;
        private System.Windows.Forms.Label labelTitle;
        private System.Windows.Forms.LinkLabel linkLabelNotYou;
        private System.Windows.Forms.TextBox textBoxUser;
        private System.Windows.Forms.Panel SignUp;
        private System.Windows.Forms.Button buttonDodaj;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBoxSurname;
        private System.Windows.Forms.TextBox textBoxName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel ShowUsers;
        private System.Windows.Forms.Panel Choose;
        private System.Windows.Forms.Button buttonSubjects;
        private System.Windows.Forms.Button buttonLogIn;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.MonthCalendar monthCalendar1;
        private System.Windows.Forms.Label labelEnd;
        private System.Windows.Forms.Label labelStart;
        private System.Windows.Forms.DomainUpDown domainUpDown1;
        private System.Windows.Forms.NumericUpDown numericStart;
        private System.Windows.Forms.NumericUpDown numericEnd;
        private System.Windows.Forms.TextBox textBox1;
    }
}

