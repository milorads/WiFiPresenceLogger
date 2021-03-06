﻿namespace WiFiPresenceLogger_v2
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
            this.subjectAddBtn = new System.Windows.Forms.Button();
            this.passwordCheckBox = new System.Windows.Forms.CheckBox();
            this.ssidCheckBox = new System.Windows.Forms.CheckBox();
            this.button2 = new System.Windows.Forms.Button();
            this.passwordTextBox = new System.Windows.Forms.TextBox();
            this.ssidTextBox = new System.Windows.Forms.TextBox();
            this.setTimeBtn = new System.Windows.Forms.Button();
            this.rtcShiftLabel = new System.Windows.Forms.Label();
            this.rtcShiftBtn = new System.Windows.Forms.Button();
            this.removeFromDeleteListBtn = new System.Windows.Forms.Button();
            this.addToDeleteListBtn = new System.Windows.Forms.Button();
            this.tablesDeleteListBox = new System.Windows.Forms.ListBox();
            this.tableListBox = new System.Windows.Forms.ListBox();
            this.tableDeleteBtn = new System.Windows.Forms.Button();
            this.refreshBtn = new System.Windows.Forms.Button();
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
            this.button3 = new System.Windows.Forms.Button();
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
            this.Choose.Controls.Add(this.button3);
            this.Choose.Controls.Add(this.subjectAddBtn);
            this.Choose.Controls.Add(this.passwordCheckBox);
            this.Choose.Controls.Add(this.ssidCheckBox);
            this.Choose.Controls.Add(this.button2);
            this.Choose.Controls.Add(this.passwordTextBox);
            this.Choose.Controls.Add(this.ssidTextBox);
            this.Choose.Controls.Add(this.setTimeBtn);
            this.Choose.Controls.Add(this.rtcShiftLabel);
            this.Choose.Controls.Add(this.rtcShiftBtn);
            this.Choose.Controls.Add(this.removeFromDeleteListBtn);
            this.Choose.Controls.Add(this.addToDeleteListBtn);
            this.Choose.Controls.Add(this.tablesDeleteListBox);
            this.Choose.Controls.Add(this.tableListBox);
            this.Choose.Controls.Add(this.tableDeleteBtn);
            this.Choose.Controls.Add(this.refreshBtn);
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
            // subjectAddBtn
            // 
            this.subjectAddBtn.Location = new System.Drawing.Point(664, 24);
            this.subjectAddBtn.Margin = new System.Windows.Forms.Padding(2);
            this.subjectAddBtn.Name = "subjectAddBtn";
            this.subjectAddBtn.Size = new System.Drawing.Size(110, 36);
            this.subjectAddBtn.TabIndex = 25;
            this.subjectAddBtn.Text = "Dodaj Predmet";
            this.subjectAddBtn.UseVisualStyleBackColor = true;
            this.subjectAddBtn.Click += new System.EventHandler(this.subjectAddBtn_Click);
            // 
            // passwordCheckBox
            // 
            this.passwordCheckBox.AutoSize = true;
            this.passwordCheckBox.Location = new System.Drawing.Point(294, 236);
            this.passwordCheckBox.Name = "passwordCheckBox";
            this.passwordCheckBox.Size = new System.Drawing.Size(95, 17);
            this.passwordCheckBox.TabIndex = 24;
            this.passwordCheckBox.Text = "WiFi password";
            this.passwordCheckBox.UseVisualStyleBackColor = true;
            this.passwordCheckBox.CheckedChanged += new System.EventHandler(this.passwordCheckBox_CheckedChanged);
            // 
            // ssidCheckBox
            // 
            this.ssidCheckBox.AutoSize = true;
            this.ssidCheckBox.Location = new System.Drawing.Point(294, 207);
            this.ssidCheckBox.Name = "ssidCheckBox";
            this.ssidCheckBox.Size = new System.Drawing.Size(75, 17);
            this.ssidCheckBox.TabIndex = 23;
            this.ssidCheckBox.Text = "WiFi SSID";
            this.ssidCheckBox.UseVisualStyleBackColor = true;
            this.ssidCheckBox.CheckedChanged += new System.EventHandler(this.ssidCheckBox_CheckedChanged);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(390, 259);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(113, 23);
            this.button2.TabIndex = 22;
            this.button2.Text = "set WiFi parameters";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // passwordTextBox
            // 
            this.passwordTextBox.Enabled = false;
            this.passwordTextBox.Location = new System.Drawing.Point(390, 230);
            this.passwordTextBox.Name = "passwordTextBox";
            this.passwordTextBox.Size = new System.Drawing.Size(113, 20);
            this.passwordTextBox.TabIndex = 21;
            // 
            // ssidTextBox
            // 
            this.ssidTextBox.Enabled = false;
            this.ssidTextBox.Location = new System.Drawing.Point(390, 204);
            this.ssidTextBox.Name = "ssidTextBox";
            this.ssidTextBox.Size = new System.Drawing.Size(113, 20);
            this.ssidTextBox.TabIndex = 20;
            // 
            // setTimeBtn
            // 
            this.setTimeBtn.Location = new System.Drawing.Point(602, 261);
            this.setTimeBtn.Name = "setTimeBtn";
            this.setTimeBtn.Size = new System.Drawing.Size(93, 23);
            this.setTimeBtn.TabIndex = 19;
            this.setTimeBtn.Text = "set System time";
            this.setTimeBtn.UseVisualStyleBackColor = true;
            this.setTimeBtn.Click += new System.EventHandler(this.setTimeBtn_Click);
            // 
            // rtcShiftLabel
            // 
            this.rtcShiftLabel.AutoSize = true;
            this.rtcShiftLabel.Location = new System.Drawing.Point(695, 212);
            this.rtcShiftLabel.Name = "rtcShiftLabel";
            this.rtcShiftLabel.Size = new System.Drawing.Size(0, 13);
            this.rtcShiftLabel.TabIndex = 18;
            // 
            // rtcShiftBtn
            // 
            this.rtcShiftBtn.Location = new System.Drawing.Point(602, 212);
            this.rtcShiftBtn.Name = "rtcShiftBtn";
            this.rtcShiftBtn.Size = new System.Drawing.Size(93, 23);
            this.rtcShiftBtn.TabIndex = 17;
            this.rtcShiftBtn.Text = "show RTC Shift";
            this.rtcShiftBtn.UseVisualStyleBackColor = true;
            this.rtcShiftBtn.Click += new System.EventHandler(this.rtcShiftBtn_Click);
            // 
            // removeFromDeleteListBtn
            // 
            this.removeFromDeleteListBtn.Location = new System.Drawing.Point(465, 102);
            this.removeFromDeleteListBtn.Name = "removeFromDeleteListBtn";
            this.removeFromDeleteListBtn.Size = new System.Drawing.Size(38, 23);
            this.removeFromDeleteListBtn.TabIndex = 16;
            this.removeFromDeleteListBtn.Text = "<<";
            this.removeFromDeleteListBtn.UseVisualStyleBackColor = true;
            this.removeFromDeleteListBtn.Click += new System.EventHandler(this.removeFromDeleteListBtn_Click);
            // 
            // addToDeleteListBtn
            // 
            this.addToDeleteListBtn.Location = new System.Drawing.Point(465, 56);
            this.addToDeleteListBtn.Name = "addToDeleteListBtn";
            this.addToDeleteListBtn.Size = new System.Drawing.Size(38, 23);
            this.addToDeleteListBtn.TabIndex = 15;
            this.addToDeleteListBtn.Text = ">>";
            this.addToDeleteListBtn.UseVisualStyleBackColor = true;
            this.addToDeleteListBtn.Click += new System.EventHandler(this.addToDeleteListBtn_Click);
            // 
            // tablesDeleteListBox
            // 
            this.tablesDeleteListBox.FormattingEnabled = true;
            this.tablesDeleteListBox.Location = new System.Drawing.Point(509, 53);
            this.tablesDeleteListBox.Name = "tablesDeleteListBox";
            this.tablesDeleteListBox.ScrollAlwaysVisible = true;
            this.tablesDeleteListBox.SelectionMode = System.Windows.Forms.SelectionMode.MultiExtended;
            this.tablesDeleteListBox.Size = new System.Drawing.Size(120, 95);
            this.tablesDeleteListBox.TabIndex = 14;
            // 
            // tableListBox
            // 
            this.tableListBox.FormattingEnabled = true;
            this.tableListBox.Location = new System.Drawing.Point(337, 53);
            this.tableListBox.Name = "tableListBox";
            this.tableListBox.ScrollAlwaysVisible = true;
            this.tableListBox.SelectionMode = System.Windows.Forms.SelectionMode.MultiExtended;
            this.tableListBox.Size = new System.Drawing.Size(120, 95);
            this.tableListBox.TabIndex = 13;
            // 
            // tableDeleteBtn
            // 
            this.tableDeleteBtn.Location = new System.Drawing.Point(509, 154);
            this.tableDeleteBtn.Name = "tableDeleteBtn";
            this.tableDeleteBtn.Size = new System.Drawing.Size(120, 23);
            this.tableDeleteBtn.TabIndex = 12;
            this.tableDeleteBtn.Text = "delete Table(s)";
            this.tableDeleteBtn.UseVisualStyleBackColor = true;
            this.tableDeleteBtn.Click += new System.EventHandler(this.tableDeleteBtn_Click);
            // 
            // refreshBtn
            // 
            this.refreshBtn.Location = new System.Drawing.Point(337, 154);
            this.refreshBtn.Name = "refreshBtn";
            this.refreshBtn.Size = new System.Drawing.Size(120, 23);
            this.refreshBtn.TabIndex = 10;
            this.refreshBtn.Text = "refresh list";
            this.refreshBtn.UseVisualStyleBackColor = true;
            this.refreshBtn.Click += new System.EventHandler(this.refreshBtn_Click);
            // 
            // numericEnd
            // 
            this.numericEnd.Location = new System.Drawing.Point(85, 288);
            this.numericEnd.Maximum = new decimal(new int[] {
            23,
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
            23,
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
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(600, 326);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 26;
            this.button3.Text = "PostTest";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
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
        private System.Windows.Forms.Button refreshBtn;
        private System.Windows.Forms.Button tableDeleteBtn;
        private System.Windows.Forms.Button removeFromDeleteListBtn;
        private System.Windows.Forms.Button addToDeleteListBtn;
        private System.Windows.Forms.ListBox tablesDeleteListBox;
        private System.Windows.Forms.ListBox tableListBox;
        private System.Windows.Forms.Label rtcShiftLabel;
        private System.Windows.Forms.Button rtcShiftBtn;
        private System.Windows.Forms.Button setTimeBtn;
        private System.Windows.Forms.CheckBox passwordCheckBox;
        private System.Windows.Forms.CheckBox ssidCheckBox;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.TextBox passwordTextBox;
        private System.Windows.Forms.TextBox ssidTextBox;
        private System.Windows.Forms.Button subjectAddBtn;
        private System.Windows.Forms.Button button3;
    }
}

