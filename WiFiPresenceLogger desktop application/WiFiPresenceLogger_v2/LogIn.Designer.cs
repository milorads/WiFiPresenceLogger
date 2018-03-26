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
            this.ShowUsers = new System.Windows.Forms.Panel();
            this.buttonDodaj = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.textBoxSurname = new System.Windows.Forms.TextBox();
            this.textBoxName = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.Choose = new System.Windows.Forms.Panel();
            this.buttonLogIn = new System.Windows.Forms.Button();
            this.buttonSubjects = new System.Windows.Forms.Button();
            this.SignUp.SuspendLayout();
            this.Choose.SuspendLayout();
            this.SuspendLayout();
            // 
            // buttonContinue
            // 
            this.buttonContinue.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonContinue.Location = new System.Drawing.Point(259, 219);
            this.buttonContinue.Name = "buttonContinue";
            this.buttonContinue.Size = new System.Drawing.Size(170, 45);
            this.buttonContinue.TabIndex = 0;
            this.buttonContinue.Text = "Nastavi";
            this.buttonContinue.UseVisualStyleBackColor = true;
            this.buttonContinue.Click += new System.EventHandler(this.buttonContinue_Click);
            // 
            // labelTitle
            // 
            this.labelTitle.AutoSize = true;
            this.labelTitle.Font = new System.Drawing.Font("Microsoft Sans Serif", 22.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelTitle.Location = new System.Drawing.Point(178, 126);
            this.labelTitle.Name = "labelTitle";
            this.labelTitle.Size = new System.Drawing.Size(332, 44);
            this.labelTitle.TabIndex = 3;
            this.labelTitle.Text = "Ulogovani ste kao:";
            this.labelTitle.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // linkLabelNotYou
            // 
            this.linkLabelNotYou.AutoSize = true;
            this.linkLabelNotYou.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.linkLabelNotYou.Location = new System.Drawing.Point(304, 267);
            this.linkLabelNotYou.Name = "linkLabelNotYou";
            this.linkLabelNotYou.Size = new System.Drawing.Size(80, 24);
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
            this.textBoxUser.Location = new System.Drawing.Point(294, 187);
            this.textBoxUser.Name = "textBoxUser";
            this.textBoxUser.Size = new System.Drawing.Size(100, 15);
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
            this.SignUp.Name = "SignUp";
            this.SignUp.Size = new System.Drawing.Size(704, 448);
            this.SignUp.TabIndex = 7;
            this.SignUp.Visible = false;
            // 
            // ShowUsers
            // 
            this.ShowUsers.AutoScroll = true;
            this.ShowUsers.Location = new System.Drawing.Point(12, 65);
            this.ShowUsers.Name = "ShowUsers";
            this.ShowUsers.Size = new System.Drawing.Size(680, 199);
            this.ShowUsers.TabIndex = 15;
            // 
            // buttonDodaj
            // 
            this.buttonDodaj.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonDodaj.Location = new System.Drawing.Point(308, 386);
            this.buttonDodaj.Name = "buttonDodaj";
            this.buttonDodaj.Size = new System.Drawing.Size(96, 39);
            this.buttonDodaj.TabIndex = 14;
            this.buttonDodaj.Text = "Dodaj";
            this.buttonDodaj.UseVisualStyleBackColor = true;
            this.buttonDodaj.Click += new System.EventHandler(this.buttonDodaj_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(169, 333);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(84, 24);
            this.label3.TabIndex = 13;
            this.label3.Text = "Prezime:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(169, 289);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(46, 24);
            this.label2.TabIndex = 12;
            this.label2.Text = "Ime:";
            // 
            // textBoxSurname
            // 
            this.textBoxSurname.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textBoxSurname.Location = new System.Drawing.Point(259, 329);
            this.textBoxSurname.Name = "textBoxSurname";
            this.textBoxSurname.Size = new System.Drawing.Size(195, 28);
            this.textBoxSurname.TabIndex = 11;
            // 
            // textBoxName
            // 
            this.textBoxName.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textBoxName.Location = new System.Drawing.Point(259, 285);
            this.textBoxName.Name = "textBoxName";
            this.textBoxName.Size = new System.Drawing.Size(195, 28);
            this.textBoxName.TabIndex = 10;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 16.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(256, 11);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(201, 32);
            this.label1.TabIndex = 9;
            this.label1.Text = "LISTA OSOBA";
            // 
            // Choose
            // 
            this.Choose.Controls.Add(this.buttonSubjects);
            this.Choose.Controls.Add(this.buttonLogIn);
            this.Choose.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Choose.Location = new System.Drawing.Point(0, 0);
            this.Choose.Name = "Choose";
            this.Choose.Size = new System.Drawing.Size(704, 448);
            this.Choose.TabIndex = 16;
            this.Choose.Visible = false;
            // 
            // buttonLogIn
            // 
            this.buttonLogIn.Location = new System.Drawing.Point(363, 187);
            this.buttonLogIn.Name = "buttonLogIn";
            this.buttonLogIn.Size = new System.Drawing.Size(147, 44);
            this.buttonLogIn.TabIndex = 0;
            this.buttonLogIn.Text = "ULOGUJ SE";
            this.buttonLogIn.UseVisualStyleBackColor = true;
            this.buttonLogIn.Click += new System.EventHandler(this.buttonLogIn_Click);
            // 
            // buttonSubjects
            // 
            this.buttonSubjects.Location = new System.Drawing.Point(173, 187);
            this.buttonSubjects.Name = "buttonSubjects";
            this.buttonSubjects.Size = new System.Drawing.Size(147, 44);
            this.buttonSubjects.TabIndex = 1;
            this.buttonSubjects.Text = "LISTA PREDMETA";
            this.buttonSubjects.UseVisualStyleBackColor = true;
            this.buttonSubjects.Click += new System.EventHandler(this.buttonSubjects_Click);
            // 
            // LogIn
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(704, 448);
            this.Controls.Add(this.SignUp);
            this.Controls.Add(this.textBoxUser);
            this.Controls.Add(this.linkLabelNotYou);
            this.Controls.Add(this.labelTitle);
            this.Controls.Add(this.buttonContinue);
            this.Name = "LogIn";
            this.Text = "Log In";
            this.SignUp.ResumeLayout(false);
            this.SignUp.PerformLayout();
            this.Choose.ResumeLayout(false);
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
    }
}

