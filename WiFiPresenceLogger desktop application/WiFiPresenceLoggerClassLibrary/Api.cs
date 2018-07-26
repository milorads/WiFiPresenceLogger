using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Security.Cryptography;
using System.Web.Script.Serialization;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace WiFiPresenceLoggerClassLibrary
{
    public class Api
    {
        public string deviceCode = "bfa86fdd-398c-462e-9b4e-9cb52ffafb58";
        public string gatewayAddr = "https://192.168.4.1:3002/";

        private string token = null;
        private IUserApplication app = null;

        public Api(IUserApplication app)
        {
            this.app = app;
        }
        
        private static string CreateMD5(string input)
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
        private ApiResponse PostApiMethod(string url, string jsonParameters)
        {
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);
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
                if (response.Headers["token"] != null)
                {
                    token = response.Headers["token"];
                }
                var result = streamReader.ReadToEnd();
                return new ApiResponse(response.Headers["error"], result);
            }
        }

        private string ApiMethod(string url)
        {
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "Get";

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                using (var streamReader = new StreamReader(response.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    return result;
                }
            }
            catch(WebException)
            {
                return null;
            }
            //https:// ??
        }

        public string getTimestamp()
        {
            return ApiMethod(gatewayAddr + "getTimestamp");
        }

        public string apiTest()
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            System.Diagnostics.Debug.WriteLine(gatewayAddr + "apiTest?" + "code=" + hash + "&timestamp=" + deviceTimeStamp);
            System.Diagnostics.Debug.WriteLine("hello");
            return ApiMethod(gatewayAddr + "apiTest?" + "code=" + hash + "&timestamp=" + deviceTimeStamp);
        }

        public string apiTest1()
        {
            if (token == null) GetToken();

            ApiResponse res;
            do
            {
                string parameters = "{\"token\":\"" + token + "\"}";
                res = PostApiMethod(gatewayAddr + "tokenApiTest", parameters);
                if (!"ok".Equals(res.Error)) GetToken();
            }
            while (!"ok".Equals(res.Error));

            return res.Text;
        }

        public void GetToken()
        {
            ApiResponse res;
            do
            {
                app.AskForCredentials(out string username, out string password);
                string parameters = "{\"usr\":\"" + username + "\",\"pass\":\"" + password + "\"}";
                res = PostApiMethod(gatewayAddr + "getToken", parameters);
            }
            while (!"ok".Equals(res.Error));
            
            token = res.Text;
        }

        public string setSystemTime(string actionCode,string adminTimestamp)
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{\"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp
                    + "\",\"actionCode\":\"" + actionCode + "\",\"adminTimestamp\":\"" + adminTimestamp
                    + "\"}";
            return PostApiMethod(gatewayAddr + "postSetSystemTime", parameters).Text;
        }

        public string getData(string fileName)
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{\"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp
                    + "\",\"file\":\"" + fileName + "\"}";
            return PostApiMethod(gatewayAddr + "postGetData", parameters).Text;
        }

        public string deleteData(string fileName)
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{\"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp
                    + "\",\"file\":\"" + fileName + "\"}";
            return PostApiMethod(gatewayAddr + "postDeleteData", parameters).Text;
        }

        public string getRegList()
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{\"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "postGetRegList", parameters).Text;
        }

        public string listData()
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{\"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "postListData", parameters).Text;
        }

        public string getTimeShift()
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            string parameters = "{\"code\":\"" + hash + "\",\"timestamp\":\"" + deviceTimeStamp + "\"}";
            return PostApiMethod(gatewayAddr + "postGetTimeShift", parameters).Text;
        }

        public string wifiSetting(string ssid, string passwrd)
        {
            string deviceTimeStamp = ApiMethod(gatewayAddr + "getTimestamp");
            string hash = CreateMD5(deviceCode + deviceTimeStamp);
            return ApiMethod(gatewayAddr + "wifiSetting?" + "code=" + hash + "&timestamp=" + deviceTimeStamp + "&ssid=" + ssid + "&passwrd=" + passwrd);
        }

        private bool AcceptAllCertifications(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            return true;
        }
    }
}
