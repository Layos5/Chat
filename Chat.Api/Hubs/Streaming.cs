using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chat.Api.Hubs
{
    public class Streaming : Hub
    {
        public void Send(string message)
        {
            Clients.All.MessageReceived(message);
        }
    }
}