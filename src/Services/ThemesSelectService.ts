import  { FunnelClassicComponents, FunnelNasaComponents, Theme }  from "../Interfaces/Themes";

export function getThemeFromString(themeName: string): Theme | undefined {
  switch (themeName.toLowerCase()) {
    case "classic":
      return Theme.Classic;
    case "dark":
      return Theme.Dark;
    case "light":
      return Theme.Light;
    case "nasa":
      return Theme.Nasa;
    default:
      return undefined;
  }
}

export function getClassicThemeComponent(name: string): FunnelClassicComponents | undefined {
  switch (name.toLowerCase()) {
    case "classic_header":
      return FunnelClassicComponents.ClassicHeader;
    case "classic_form_fields":
      return FunnelClassicComponents.ClassicFormFields;
    case "classic_countdown":
      return FunnelClassicComponents.ClassicCountdown;
    case "classic_today_orders":
      return FunnelClassicComponents.ClassicTodayOrders;
    case "classic_rates":
      return FunnelClassicComponents.ClassicRates;
    case "classic_product_funnel":
      return FunnelClassicComponents.ClassicProductFunnel;
    case "classic_footer":
      return FunnelClassicComponents.ClassicFooter;
    default:
      return undefined;
  }
}

export function getNasaThemeComponent(name: string): FunnelNasaComponents | undefined {
  switch (name.toLowerCase()) {
    case "nasa_header":
      return FunnelNasaComponents.NasaHeader;
    case "nasa_form_fields":
      return FunnelNasaComponents.NasaFormFields;
    case "nasa_countdown":
      return FunnelNasaComponents.NasaCountdown;
    case "nasa_today_orders":
      return FunnelNasaComponents.NasaTodayOrders;
    case "nasa_rates":
      return FunnelNasaComponents.NasaRates;
    case "nasa_product_funnel":
      return FunnelNasaComponents.NasaProductFunnel;
    case "nasa_footer":
      return FunnelNasaComponents.NasaFooter;
    default:
      return undefined;
  }
}

