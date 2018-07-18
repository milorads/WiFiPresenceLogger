using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    public class Subject
    {
        public int ID { get; set; }
        public string name { get; set; }
        public string startTime { get; set; }
        public int durationTime { get; set; }
        public string dayOfWeek { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public int userID { get; set; }
        
    }
}
