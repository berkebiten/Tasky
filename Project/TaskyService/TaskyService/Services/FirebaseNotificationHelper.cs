using System.Net;
using System.Net.Http;
using Newtonsoft.Json;

namespace TaskyService.Services
{
    public static class FirebaseNotificationService
    {

        public static void PushNotification(FBNotification notification)
        {
            WebClient client = new WebClient();
            var pushData = new
            {
                to = notification.To,
                collapse_key = ".com.tasky",
                notification = new
                {
                    body = notification.Body,
                    title = notification.Title
                }
            };
            client.Headers.Add("Authorization", "key=AAAAyk2HkQQ:APA91bHKJ7xs4b6Qda2vw0yujHnrpSnc15xO9EIhMmsrNcfh52bLcz-MSdjCEi4BaPZVIxVLbfORV8t0AaWthiF6bAMEziK2lsfDY4JMONykwjsxssAoXRcGOLywfWS_XzN0Te6PUBa2");
            client.Headers.Add("Content-Type", "application/json");
            var res = client.UploadString("https://fcm.googleapis.com/fcm/send", JsonConvert.SerializeObject(pushData, Formatting.Indented));
        }

    }

    public class FBNotification
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public string To { get; set; }
        public string Collapse_Key { get; set; }
    }
}
