using SQLite.CodeFirst;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    public class WFPL_Db : DbContext
    {
        public DbSet<Device> Devices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Subject> Subjects { get; set; }

        public User getLastUser()
        {
            if (Users.Where(o => o.isLast == 1).SingleOrDefault() != null)
            {
                return Users.Where(o => o.isLast == 1).SingleOrDefault();
            }
            else
            {
                return null;
            }
        }
    }
}
