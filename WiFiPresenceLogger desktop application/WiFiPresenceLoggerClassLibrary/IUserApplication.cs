using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    /* Interfejs koji bi LogIn.cs trebalo da implementira. Sluzi Api-u da trazi
     * podatke od korisnika u slucaju da treba traziti token.
     */
    public interface IUserApplication
    {
        /* Metod treba da pita korisnika za username i password i da ih vrati
         * kao parametre.
         */ 
        void AskForCredentials(out string username, out string password);
    }
}
