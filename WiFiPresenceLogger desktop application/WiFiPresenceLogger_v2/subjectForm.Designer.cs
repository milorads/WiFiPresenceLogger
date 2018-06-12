﻿namespace WiFiPresenceLogger_v2
{
    partial class subjectForm
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
            this.addSub = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.numericEnd = new System.Windows.Forms.NumericUpDown();
            this.domainUpDown1 = new System.Windows.Forms.DomainUpDown();
            this.numericStart = new System.Windows.Forms.NumericUpDown();
            this.monthCalendar1 = new System.Windows.Forms.MonthCalendar();
            this.labelEnd = new System.Windows.Forms.Label();
            this.labelStart = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.numericEnd)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericStart)).BeginInit();
            this.SuspendLayout();
            // 
            // addSub
            // 
            this.addSub.Location = new System.Drawing.Point(64, 294);
            this.addSub.Name = "addSub";
            this.addSub.Size = new System.Drawing.Size(75, 23);
            this.addSub.TabIndex = 0;
            this.addSub.Text = "Dodaj";
            this.addSub.UseVisualStyleBackColor = true;
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(117, 25);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(100, 20);
            this.textBox1.TabIndex = 1;
            // 
            // numericEnd
            // 
            this.numericEnd.Location = new System.Drawing.Point(78, 246);
            this.numericEnd.Maximum = new decimal(new int[] {
            23,
            0,
            0,
            0});
            this.numericEnd.Name = "numericEnd";
            this.numericEnd.Size = new System.Drawing.Size(54, 20);
            this.numericEnd.TabIndex = 12;
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
            this.domainUpDown1.Location = new System.Drawing.Point(145, 246);
            this.domainUpDown1.Name = "domainUpDown1";
            this.domainUpDown1.Size = new System.Drawing.Size(72, 20);
            this.domainUpDown1.TabIndex = 11;
            // 
            // numericStart
            // 
            this.numericStart.Location = new System.Drawing.Point(18, 246);
            this.numericStart.Maximum = new decimal(new int[] {
            23,
            0,
            0,
            0});
            this.numericStart.Name = "numericStart";
            this.numericStart.Size = new System.Drawing.Size(54, 20);
            this.numericStart.TabIndex = 10;
            this.numericStart.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            // 
            // monthCalendar1
            // 
            this.monthCalendar1.Location = new System.Drawing.Point(18, 57);
            this.monthCalendar1.Name = "monthCalendar1";
            this.monthCalendar1.TabIndex = 9;
            // 
            // labelEnd
            // 
            this.labelEnd.AutoSize = true;
            this.labelEnd.Location = new System.Drawing.Point(243, 178);
            this.labelEnd.Name = "labelEnd";
            this.labelEnd.Size = new System.Drawing.Size(0, 13);
            this.labelEnd.TabIndex = 14;
            // 
            // labelStart
            // 
            this.labelStart.AutoSize = true;
            this.labelStart.Location = new System.Drawing.Point(243, 138);
            this.labelStart.Name = "labelStart";
            this.labelStart.Size = new System.Drawing.Size(0, 13);
            this.labelStart.TabIndex = 13;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(15, 228);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 15;
            this.label1.Text = "label1";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(75, 228);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(35, 13);
            this.label2.TabIndex = 16;
            this.label2.Text = "label2";
            // 
            // subjectForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(486, 329);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.labelEnd);
            this.Controls.Add(this.labelStart);
            this.Controls.Add(this.numericEnd);
            this.Controls.Add(this.domainUpDown1);
            this.Controls.Add(this.numericStart);
            this.Controls.Add(this.monthCalendar1);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.addSub);
            this.Name = "subjectForm";
            this.Text = "subjectForm";
            ((System.ComponentModel.ISupportInitialize)(this.numericEnd)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericStart)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button addSub;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.NumericUpDown numericEnd;
        private System.Windows.Forms.DomainUpDown domainUpDown1;
        private System.Windows.Forms.NumericUpDown numericStart;
        private System.Windows.Forms.MonthCalendar monthCalendar1;
        private System.Windows.Forms.Label labelEnd;
        private System.Windows.Forms.Label labelStart;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
    }
}