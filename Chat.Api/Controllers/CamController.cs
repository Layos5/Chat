using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chat.Api.Controllers
{
    public class CamController : Controller
    {
        // GET: Cam
        public ActionResult Index()
        {
            return View();
        }
    }
}