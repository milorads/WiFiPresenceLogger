using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WiFiPresenceLoggerClassLibrary
{
    public class Api
    {
        public string deviceCode = "bfa86fdd-398c-462e-9b4e-9cb52ffafb58";
        public string gatewayAddr = "http://192.168.4.1:3002/";

        public static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString().ToLower();
            }
        }
        //kodovi za status request-a??
        public string apiMethod(string url)
        {
            //https:// ??
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "Get";

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string myResponse = "";
            using (System.IO.StreamReader sr = new System.IO.StreamReader(response.GetResponseStream()))
            {
                myResponse = sr.ReadToEnd();
            }
            return myResponse;
        }
        public string getTimestamp()
        {
            return apiMethod(gatewayAddr + "getTimestamp");
        }
        public string apiTest()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            System.Diagnostics.Debug.WriteLine(gatewayAddr + "apiTest?" + "code=" + hash + "&timestamp=" + deviceTimeStamp);
            System.Diagnostics.Debug.WriteLine("hello");
            return apiMethod(gatewayAddr + "apiTest?" + "code=" + hash + "&timestamp=" + deviceTimeStamp);
        }
        public string setTimestamp()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);

            return apiMethod(gatewayAddr + "setTimeStamp?" + "code=" + hash + "&timestamp=" + deviceTimeStamp);
        }
        public string getData(string fileName)
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);

            return apiMethod(gatewayAddr + "getData?" + "code=" + hash + "&timestamp=" + deviceTimeStamp + "&file=" + fileName);
        }
        public string deleteData(string fileName)
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);

            return apiMethod(gatewayAddr + "deleteData?" + "code=" + hash + "&timestamp=" + deviceTimeStamp + "&file=" + fileName);
        }
        public string getRegList()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);

            return apiMethod(gatewayAddr + "getRegList?" + "code=" + hash + "&timestamp=" + deviceTimeStamp);
        }
    }
}
