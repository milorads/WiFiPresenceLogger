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
        public WFPL_Db(): base()
        {
            Database.SetInitializer<WFPL_Db>(new DropCreateDatabaseIfModelChanges<WFPL_Db>());
        }

        public DbSet<Device> Devices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Student> Students { get; set; }
        public User getLastUser()
        {
            try
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
            catch (Exception e)
            {
                throw e;
            }
        }
        private bool checkIntervalCollision(string startTime1, int classDuration1, string startTime2,int classDuration2)
        {
            DateTime strTime1 = DateTime.ParseExact(startTime1, "yyyy-MM-dd HH:mm:ss.ffffff", System.Globalization.CultureInfo.InstalledUICulture);
            DateTime strTime2 = DateTime.ParseExact(startTime2, "yyyy-MM-dd HH:mm:ss.ffffff", System.Globalization.CultureInfo.InstalledUICulture);
            return strTime1.AddMinutes(classDuration1) > strTime2 || (strTime1 > strTime2 && strTime1 < strTime2.AddMinutes(classDuration2));
        }

        public bool addSubject(User currentUser,Subject sub)
        {
            //provera da nije doslo do kolizije
            try
            {
                if (Subjects.Where(o => (o.dayOfWeek == sub.dayOfWeek && checkIntervalCollision(sub.startTime,sub.durationTime,o.startTime,o.durationTime))).Count() == 0)
                {
                    Subjects.Add(sub);
                    SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        

    }
}
