using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.IO; 
namespace WiFiPresenceLoggerClassLibrary
{
    public class Api
    {
        public string deviceCode = "bfa86fdd-398c-462e-9b4e-9cb52ffafb58";
        public string gatewayAddr = "http://192.168.4.1:3002/";

        public static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.SHA256 sha256 = System.Security.Cryptography.SHA256.Create())
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = sha256.ComputeHash(inputBytes);

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
        // Univerzalni metod za POST zahteve
        public string PostApiMethod(string url, string jsonParameters)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentType = "application/json";
            request.Method = "POST";
            
            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                streamWriter.Write(jsonParameters);
                streamWriter.Flush();
                streamWriter.Close();
            }
            HttpWebResponse response;
            try
            {
                response = (HttpWebResponse)request.GetResponse();
            }
            catch (WebException ex)
            {
                response = ex.Response as HttpWebResponse;
            }
            
            using (var streamReader = new StreamReader(response.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                return result;
            }
        }
        public string apiMethod(string url)
        {
            try
            {
                //https:// ??
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "Get";

                //dodati exception na gresku u konekciji
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                string myResponse = "";
                using (System.IO.StreamReader sr = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    myResponse = sr.ReadToEnd();
                }
                return myResponse;
            }
            catch (Exception e)
            {
                return "Error:" + e;
            }
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

        public string apiTest1()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "PostApiTest", parameters);
        }

        public string setSystemTime(string actionCode,string adminTimestamp)
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp
                    + "\",\"actionCode\":\"" + actionCode + "\",\"adminTimestamp\":\"" + adminTimestamp
                    + "\"}";
            return PostApiMethod(gatewayAddr + "postSetSystemTime", parameters);
        }

        public string getData(string fileName)
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp
                    + "\",\"file\":\"" + fileName + "\"}";
            return PostApiMethod(gatewayAddr + "postGetData", parameters);
        }

        public string deleteData(string fileName)
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp
                    + "\",\"file\":\"" + fileName + "\"}";
            return PostApiMethod(gatewayAddr + "postDeleteData", parameters);
        }

        public string getRegList()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "postGetRegList", parameters);
        }

        public string listData()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "postListData", parameters);
        }

        public string getTimeShift()
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{ \"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "postGetTimeShift", parameters);
        }

        public string wifiSetting(string ssid, string passwrd)
        {
            string deviceTimeStamp = apiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            return apiMethod(gatewayAddr + "wifiSetting?" + "code=" + hash + "&timestamp=" + deviceTimeStamp + "&ssid=" + ssid + "&passwrd=" + passwrd);
        }
    }
}
