import  { FunnelClassicComponents, Theme }  from "../Interfaces/Themes";

export function getThemeFromString(themeName: string): Theme | undefined {
  switch (themeName.toLowerCase()) {
    case "classic":
      return Theme.Classic;
    case "dark":
      return Theme.Dark;
    case "light":
      return Theme.Light;
    // add more cases if needed
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

