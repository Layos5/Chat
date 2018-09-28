using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Chat.Api.Hubs
{
    public class ConnectedUsers
    {
        public string UserName { set; get; }
        public Guid UserConnecionId { set; get; }
    }

    public class Chat : Hub
    {
        public static List<ConnectedUsers> currentUsers = new List<ConnectedUsers>();

        public void GetConnectedUsers()
        {
            Clients.All.showUsersOnline(currentUsers);
        }

        public void SendMessage(string username, string message)
        {
            //Clients.Client(currentUsers[0].UserConnecionId.ToString()).broadcastMessage(username, message);
            Clients.All.MessageReceived(username, message);
        }

        public override Task OnConnected()
        {
            UpdateStateUsers(Context.QueryString["userMail"].ToString());
            GetConnectedUsers();
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            UpdateStateUsers(new Guid(Context.ConnectionId));
            GetConnectedUsers();
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            UpdateStateUsers(Context.QueryString["userMail"].ToString());
            GetConnectedUsers();
            return base.OnReconnected();
        }

        // To disconnect 
        private void UpdateStateUsers(Guid connectionId)
        {
            ConnectedUsers user = currentUsers
                        .Where(p => p.UserConnecionId == connectionId)
                        .FirstOrDefault();

            if (user != null)
            {
                currentUsers.Remove(user);

            }
        }

        // to connect
        private void UpdateStateUsers(string name)
        {
            ConnectedUsers user = currentUsers
                                    .Where(p => p.UserName == name)
                                    .FirstOrDefault();

            if (user != null)
                currentUsers.Remove(user);

            currentUsers
                .Add(new ConnectedUsers()
                {
                    UserName = name,
                    UserConnecionId = new Guid(Context.ConnectionId)
                });
        }

    }
}