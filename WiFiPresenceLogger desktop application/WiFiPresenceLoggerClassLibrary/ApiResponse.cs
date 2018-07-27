using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    public class ApiResponse
    {
        public string Error { get; }
        public string Text { get; }

        public ApiResponse(string error, string text)
        {
            Error = error;
            Text = text;
        }
        public override string ToString()
        {
            return Error + ": " + Text;
        }
    }
}
