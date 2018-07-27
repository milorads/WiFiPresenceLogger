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
        private static int numOfTries = 5;
        private static int waitTime = 200;

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
                    // API je mozda dao novi token u odgovoru
                    token = response.Headers["token"];
                }
                var result = streamReader.ReadToEnd();
                string err = response.Headers["error"];
                if (err == "signature" || err == "expired" || err == "format") err = "token";
                return new ApiResponse(err, result);
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
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "apiTest", parameters);

                /* Ako je ok, izlazi iz funkcije. Ako je greska zbog tokena, trazi novi token
                 * i ponavlja zahtev. U suprotnom, samo ponavlja zahtev.
                 */
                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
        }

        public void GetToken()
        {
            token = null;
            for (int i = 0; token == null && i < numOfTries; ++i)
            {
                app.AskForCredentials(out string username, out string password);
                string parameters = "{\"usr\":\"" + username + "\",\"pass\":\"" + password + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "getToken", parameters);

                if (res.Error == "ok")
                    token = res.Text;
                else
                    System.Threading.Thread.Sleep(waitTime);
            }
        }

        public string setSystemTime(string actionCode,string adminTimestamp)
        {
            if (token == null) GetToken();
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\",\"actionCode\":\""
                    + actionCode + "\",\"adminTimestamp\":\"" + adminTimestamp + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "setSystemTime", parameters);

                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
        }

        public string getData(string fileName)
        {
            if (token == null) GetToken();
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\",\"file\":\"" + fileName + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "getData", parameters);

                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
        }

        public string deleteData(string fileName)
        {
            if (token == null) GetToken();
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\",\"file\":\"" + fileName + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "deleteData", parameters);

                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
        }

        public string getRegList()
        {
            if (token == null) GetToken();
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "getRegList", parameters);

                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
        }

        public string listData()
        {
            if (token == null) GetToken();
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "listData", parameters);

                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
        }

        public string getTimeShift()
        {
            if (token == null) GetToken();
            for (int i = 0; i < numOfTries; ++i)
            {
                string parameters = "{\"token\":\"" + token + "\"}";
                ApiResponse res = PostApiMethod(gatewayAddr + "getTimeShift", parameters);

                if (res.Error == "ok")
                    return res.Text;
                else if (res.Error == "token")
                    GetToken();
                System.Threading.Thread.Sleep(waitTime);
            }
            return null;
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
