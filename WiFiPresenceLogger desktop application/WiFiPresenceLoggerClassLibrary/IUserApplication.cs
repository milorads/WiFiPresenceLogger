using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    // Interfejs koji bi LogIn.cs trebalo da implementira
    // Sluzi Api-u da trazi podatke u slucaju da treba traziti token
    interface IUserApplication
    {
        void AskForCredentials(out string username, out string password);
    }
}
