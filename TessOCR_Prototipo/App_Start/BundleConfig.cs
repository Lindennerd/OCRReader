﻿using System.Web;
using System.Web.Optimization;

namespace TessOCR_Prototipo
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/Libraries/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/caman").Include("~/Scripts/CamanJS/caman.full.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/Libraries/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/watch").Include("~/Scripts/Libraries/watch.min.js"));
            bundles.Add(new ScriptBundle("~/bundles/regex").Include("~/Scripts/Libraries/OCRRegexParser.js"));

            bundles.Add(new ScriptBundle("~/bundles/Application").IncludeDirectory("~/Scripts/App", "*.js"));
            bundles.Add(new ScriptBundle("~/bundles/Tesseract").IncludeDirectory("~/Scripts/Tesseract", "*.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css", "~/Content/Site.css"));

        }
    }
}