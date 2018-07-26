using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    public class ApiResponse
    {
        public string Status { get; }
        public string Text { get; }

        public ApiResponse(string status, string text)
        {
            Status = status;
            Text = text;
        }
        public override string ToString()
        {
            return Status + ": " + Text;
        }
    }
}
