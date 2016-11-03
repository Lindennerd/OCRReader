using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TessOCR_Prototipo.Models
{
    public class PersonalData
    {
        public string Name { get; set; }
        public string RG { get; set; }
        public string BirthDate { get; set; }
        public string Email { get; set; }
        public string CivilState { get; set; }
        public string Link { get; set; }
        public string Profession { get; set; }
        public string Company { get; set; }
        public string IsUnemployed { get; set; }
    }

    public class RevenueData
    {
        public string MontlyRevenue { get; set; }
        public string OtherRevenue { get; set; }
        public string FinancialApply { get; set; }
        public string Possession { get; set; }
        public string RealState { get; set; }
    }

    public class FinancialData
    {
        public string Accounts { get; set; }
        public List<Accounts> AccountsList { get; set; }
    }
}