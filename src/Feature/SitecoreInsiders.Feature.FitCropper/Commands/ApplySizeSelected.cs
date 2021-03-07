using Sitecore;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Globalization;
using Sitecore.Shell.Applications.WebEdit.Commands;
using Sitecore.Web.UI.Sheer;
using System;
using System.Text.RegularExpressions;

namespace SitecoreInsiders.Feature.FitCropper.Commands
{
    [Serializable]
    public class ApplySizeSelected : EditImage
    {
        private static Language ContentLanguage
        {
            get
            {
                Language result;
                if (!Language.TryParse(Context.Request.QueryString["la"], out result))
                    result = Context.ContentLanguage;
                return result;
            }
        }

        protected static void Run(ClientPipelineArgs args)
        {
            Assert.ArgumentNotNull((object)args, nameof(args));
            string parameter1 = args.Parameters["language"];
            Language language = string.IsNullOrEmpty(parameter1) ? ContentLanguage : Language.Parse(parameter1);
            Item obj1 = Context.ContentDatabase.GetItem(args.Parameters["itemid"], language);
            Assert.IsNotNull((object)obj1, typeof(Item));
            Field field = obj1.Fields[args.Parameters["fieldid"]];
            Assert.IsNotNull((object)field, typeof(Field));
            string parameter2 = args.Parameters["controlid"];

            var widthHeight=  (args.Parameters["webeditparams"] ?? "").Split('|');

            var result = Regex.Replace(field.Value, "width=\\\"(.*?)\\\"", $"width=\"{widthHeight[0]}\"");
            result = Regex.Replace(result, "height=\\\"(.*?)\\\"", $"height=\"{widthHeight[1]}\"");

            string str = WebEditImageCommand.RenderImage(args, result);
            SheerResponse.SetAttribute("scHtmlValue", "value", str);
            SheerResponse.SetAttribute("scPlainValue", "value", result + str);
            SheerResponse.Eval("scSetHtmlValue('" + parameter2 + "')");
        }

    }
}
