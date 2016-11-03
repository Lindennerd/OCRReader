using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace TessOCR_Prototipo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
            return View();
        }

        [HttpPost]
        public ActionResult Save()
        {
            Models.PersonalData personalData = JsonConvert.DeserializeObject<Models.PersonalData>(Request.Form["personalData"]);
            Models.FinancialData financialData = GetFinancialData(Request.Form["financialData"]); 
            Models.RevenueData revenueData = JsonConvert.DeserializeObject<Models.RevenueData>(Request.Form["revenueData"]);

            var identity = Request.Files["identity"];
            var powerbill = Request.Files["powerbill"];
            var IRPF = Request.Files["IRPF"];
            var additional = Request.Files["additional"];

            var storePath = ConfigurationManager.AppSettings.Get("store");
            var folder = new Random().Next(9999, 99999).ToString();
            if (!Directory.Exists(Path.Combine(storePath, folder)))
            {
                Directory.CreateDirectory(Path.Combine(storePath, folder));
            }


            var pdf = BuildPDF(personalData, financialData, revenueData, Path.Combine(storePath, folder));
            SaveFiles(identity, powerbill, IRPF, additional, Path.Combine(storePath, folder));
            SendEmail(pdf, personalData.Email, folder);

            return RedirectToAction("Index");
        }

        private void SendEmail(string pdfPath, string to, string folder)
        {
            using (var email = new EmailService.EmailServiceClient())
            {
                email.SendEmail("Registro de Cliente", new EmailService.EmailDto
                {
                    Tok__BackingField = new string[] { to },
                    Bodyk__BackingField = string.Format("Aqui está o email com as informações do seu cadastro. \n"
                                                       +"Segue o link para download dos arquivos {0}", 
                                                       ConfigurationManager.AppSettings.Get("serverPath")+folder), //"Aqui está o seu email com as informações do cadastro",
                    Subjectk__BackingField = "Informações do Cadastro",
                    Attachmentk__BackingField = new EmailService.AttachmentDto 
                    {
                        _content = System.IO.File.ReadAllBytes(pdfPath),
                        _filename = new FileInfo(pdfPath).Name
                    }
                });
            }
        }

        private void  SaveFiles(HttpPostedFileBase identity, HttpPostedFileBase powerbill, HttpPostedFileBase IRPF, HttpPostedFileBase additional, string store)
        {
            if(identity != null )identity.SaveAs(Path.Combine(store,identity.FileName));
            if(powerbill != null ) powerbill.SaveAs(Path.Combine(store,  powerbill.FileName));
            if(IRPF != null) IRPF.SaveAs(Path.Combine(store,  IRPF.FileName));
            if(additional != null) additional.SaveAs(Path.Combine(store, additional.FileName));
        }

        private string BuildPDF(Models.PersonalData personalData, Models.FinancialData financialData, Models.RevenueData revenueData, string store)
        {
            string fileNameExisting = ConfigurationManager.AppSettings.Get("template");
            string fileNameNew = Path.Combine(store, personalData.RG + "_" + new Random().Next(9999, 99999) + ".pdf");

            using (var existingFileStream = new FileStream(fileNameExisting, FileMode.Open))
            using (var newFileStream = new FileStream(fileNameNew, FileMode.Create))
            {
                var pdfReader = new PdfReader(existingFileStream);
                var stamper = new PdfStamper(pdfReader, newFileStream);

                var form = stamper.AcroFields;
                form.GenerateAppearances = true;
                var fieldKeys = form.Fields.Keys;

                foreach (string fieldKey in fieldKeys)
                {
                    foreach (var property in typeof(Models.PersonalData).GetProperties())
                    {
                        if (property.Name == fieldKey)
                        {
                            form.SetField(fieldKey, property.GetValue(personalData).ToString());
                        }
                    }

                    foreach (var property in typeof(Models.Accounts).GetProperties())
                    {
                        if (financialData.AccountsList == null)
                        {
                            break;
                        }

                        foreach (var account in financialData.AccountsList)
                        {
                            if (property.Name == fieldKey)
                            {
                                form.SetField(fieldKey, property.GetValue(account).ToString());
                            }
                        }
                    }

                    foreach (var property in typeof(Models.RevenueData).GetProperties())
                    {
                        if (property.Name == fieldKey)
                        {
                            form.SetField(fieldKey, property.GetValue(revenueData).ToString());
                        }
                    }
                }

                stamper.FormFlattening = true;

                stamper.Close();
                pdfReader.Close();

                return fileNameNew;
            }
        }

        private Models.FinancialData GetFinancialData(string myJSON)
        {
            var financialTemp = (Models.FinancialData)JsonConvert.DeserializeObject(Request.Form["financialData"], typeof(Models.FinancialData));
            var financialData = new Models.FinancialData();
            var accounts = JsonConvert.DeserializeObject(financialTemp.Accounts) as JArray;

            foreach (var account in accounts)
            {
                if (financialData.AccountsList == null)
                {
                    financialData.AccountsList = new List<Models.Accounts>();
                }

                financialData.AccountsList.Add(JsonConvert.DeserializeObject<Models.Accounts>(account.ToString()));
            }

            return financialData;
        }
    }
}
