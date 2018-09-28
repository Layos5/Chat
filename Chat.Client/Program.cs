using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Client
{
    class Program
    {
        private static HubConnection hubConnection;
        private static IHubProxy hubProxy;
        static void Main(string[] args)
        {
            Console.WriteLine("Ingrese nombre de usuario: ");
            string userName = Console.ReadLine();

            hubConnection = new HubConnection("http://chatapitest.azurewebsites.net/", "userMail=" + userName);

            hubProxy = hubConnection.CreateHubProxy("Chat");

            hubProxy.On<string, string>("MessageReceived", (username, message) =>
            {
                Console.WriteLine("{0}: {1}", username, message);
            });

            hubConnection.Start().Wait();

            while (true)
            {
                string message = Console.ReadLine();
                SendMessage(userName, message);
            }
        }


        public static void SendMessage(string username, string text)
        {
            hubProxy.Invoke("SendMessage", username, text).Wait();
        }
    }
}
