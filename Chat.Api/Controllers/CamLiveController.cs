using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chat.Api.Controllers
{
    public class CamLiveController : Controller
    {
        // GET: CamLive
        public ActionResult Index()
        {
            return View();
        }
    }
}