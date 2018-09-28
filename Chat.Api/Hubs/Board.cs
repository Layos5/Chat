using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Chat.Api.Hubs
{
    public class Board : Hub
    {

        public class Punto {
            public string x { get; set; }
            public string y { get; set; }
        }

        public class Trazo {
            public List<Punto> Puntos { get; set; }
        }


        public void SendMessage(Trazo trazo)
        {
            Clients.All.MessageReceived(trazo);
        }

        public void ResetBoard()
        {
            Clients.All.ResetBoard();
        }

        public void ResetImage()
        {
            Clients.All.ResetImage();
        }

        public void BoardImages(string image)
        {
            Clients.All.BoardImage(image);
        }
    }
}