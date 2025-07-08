// This file contains functions to convert theme strings to `Theme` enum values and to get theme-specific component names.
import { FunnelClassicComponents, FunnelNasaComponents, FunnelTroyComponents, Theme } from "../constants/themes";

// Converts a theme string to a Theme enum value.
export function getThemeFromString(themeName: string): Theme | undefined {
  switch (themeName.toLowerCase()) {
    case "classic":
      return Theme.Classic;
    case "troy":
      return Theme.Troy;
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

// Gets the available components for the Classic theme.
export function getClassicThemeComponent(name: string): FunnelClassicComponents | undefined {
  switch (name.toLowerCase()) {
    case "classic_header":
      return FunnelClassicComponents.ClassicHeader;
    case "classic_form_fields":
      return FunnelClassicComponents.ClassicFormFields;
    case "classic_countdown":
      return FunnelClassicComponents.ClassicCountdown;
    case "classic_today_statistics":
      return FunnelClassicComponents.classicTodayStatistics;
    case "classic_logos_carousel":
      return FunnelClassicComponents.classicLogosCarousel;
    case "classic_rates":
      return FunnelClassicComponents.ClassicRates;
    case "classic_visitors":
      return FunnelClassicComponents.ClassicVisitors;
    case "classic_product_funnel":
      return FunnelClassicComponents.ClassicProductFunnel;
    case "classic_footer":
      return FunnelClassicComponents.ClassicFooter;
    case "classic_order_confirmation_notice":
      return FunnelClassicComponents.ClassicOrderConfirmationNotice;
    case "classic_order_through_whatsapp":
      return FunnelClassicComponents.ClassicOrderThroughWhatsapp;
    case "classic_faq":
      return FunnelClassicComponents.ClassicFaq;
    case "classic_product_preview":
      return FunnelClassicComponents.ClassicProductPreview;
    case "classic_product_usage":
      return FunnelClassicComponents.ClassicProductUsage;
    case "classic_product_features":
      return FunnelClassicComponents.ClassicProductFeatures;
    case "classic_delivery_features":
      return FunnelClassicComponents.ClassicDeliveryFeatures;
    case "classic_button_with_link":
      return FunnelClassicComponents.ClassicButtonWithLink;
    case "classic_coupon":
      return FunnelClassicComponents.ClassicCoupon;
    case "classic_reviews":
      return FunnelClassicComponents.ClassicReviews;
    case "classic_text-bar":
      return FunnelClassicComponents.ClassicTextBar;
    case "classic_image_text_overlay":
      return FunnelClassicComponents.ClassicImageTextOverLay;
    case "classic_image_text_beside":
      return FunnelClassicComponents.ClassicImageTextBeside;
    case "classic_before_&_after":
      return FunnelClassicComponents.Classic_Before_After;
    case "classic_gallery":
      return FunnelClassicComponents.ClassicGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Troy theme.
export function getTroyThemeComponent(name: string): FunnelTroyComponents | undefined {
  switch (name.toLowerCase()) {
    case "troy_header":
      return FunnelTroyComponents.TroyHeader;
    case "troy_form_fields":
      return FunnelTroyComponents.TroyFormFields;
    case "troy_countdown":
      return FunnelTroyComponents.TroyCountdown;
    case "troy_today_statistics":
      return FunnelTroyComponents.troyTodayStatistics;
    case "troy_logos_carousel":
      return FunnelTroyComponents.troyLogosCarousel;
    case "troy_rates":
      return FunnelTroyComponents.TroyRates;
    case "troy_visitors":
      return FunnelTroyComponents.TroyVisitors;
    case "troy_product_funnel":
      return FunnelTroyComponents.TroyProductFunnel;
    case "troy_footer":
      return FunnelTroyComponents.TroyFooter;
    case "troy_order_confirmation_notice":
      return FunnelTroyComponents.TroyOrderConfirmationNotice;
    case "troy_order_through_whatsapp":
      return FunnelTroyComponents.TroyOrderThroughWhatsapp;
    case "troy_faq":
      return FunnelTroyComponents.TroyFaq;
    case "troy_product_preview":
      return FunnelTroyComponents.TroyProductPreview;
    case "troy_product_usage":
      return FunnelTroyComponents.TroyProductUsage;
    case "troy_product_features":
      return FunnelTroyComponents.TroyProductFeatures;
    case "troy_delivery_features":
      return FunnelTroyComponents.TroyDeliveryFeatures;
    case "troy_button_with_link":
      return FunnelTroyComponents.TroyButtonWithLink;
    case "troy_coupon":
      return FunnelTroyComponents.TroyCoupon;
    case "troy_reviews":
      return FunnelTroyComponents.TroyReviews;
    case "troy_textbar":
      return FunnelTroyComponents.TroyTextBar;
    case "troy_image_text_overlay":
      return FunnelTroyComponents.TroyImageTextOverLay;
    case "troy_image_text_beside":
      return FunnelTroyComponents.TroyImageTextBeside;
    case "troy_before_&_after":
      return FunnelTroyComponents.Troy_Before_After;
    case "troy_gallery":
      return FunnelTroyComponents.TroyGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Nasa theme.
export function getNasaThemeComponent(name: string): FunnelNasaComponents | undefined {
  switch (name.toLowerCase()) {
    case "nasa_header":
      return FunnelNasaComponents.NasaHeader;
    case "nasa_form_fields":
      return FunnelNasaComponents.NasaFormFields;
    case "nasa_countdown":
      return FunnelNasaComponents.NasaCountdown;
    case "nasa_today_statistics":
      return FunnelNasaComponents.NasaTodayStatistics;
    case "nasa_logos_carousel":
      return FunnelNasaComponents.NasaLogosCarousel;
    case "nasa_rates":
      return FunnelNasaComponents.NasaRates;
    case "nasa_visitors":
      return FunnelNasaComponents.NasaVisitors;
    case "nasa_product_funnel":
      return FunnelNasaComponents.NasaProductFunnel;
    case "nasa_footer":
      return FunnelNasaComponents.NasaFooter;
    case "nasa_order_confirmation_notice":
      return FunnelNasaComponents.NasaOrderConfirmationNotice;
    case "nasa_order_through_whatsapp":
      return FunnelNasaComponents.NasaOrderThroughWhatsapp;
    case "nasa_faq":
      return FunnelNasaComponents.NasaFaq;
    case "nasa_product_preview":
      return FunnelNasaComponents.NasaProductPreview;
    case "nasa_product_usage":
      return FunnelNasaComponents.NasaProductUsage;
    case "nasa_product_features":
      return FunnelNasaComponents.NasaProductFeatures;
    case "nasa_delivery_features":
      return FunnelNasaComponents.NasaDeliveryFeatures;
    case "nasa_button_with_link":
      return FunnelNasaComponents.NasaButtonWithLink;
    case "nasa_coupon":
      return FunnelNasaComponents.NasaCoupon;
    case "nasa_reviews":
      return FunnelNasaComponents.NasaReviews;
    case "nasa_text_bar":
      return FunnelNasaComponents.NasaTextBar;
    case "nasa_image_text_overlay":
      return FunnelNasaComponents.NasaImageTextOverLay;
    case "nasa_image_text_beside":
      return FunnelNasaComponents.NasaImageTextBeside;
    case "nasa_before_&_after":
      return FunnelNasaComponents.Nasa_Before_After;
    case "nasa_gallery":
      return FunnelNasaComponents.NasaGallery;
    default:
      return undefined;
  }
}

// Generic function to get theme component based on theme type
export function getThemeComponent(
  themeName: string,
  componentName: string
): FunnelClassicComponents | FunnelNasaComponents | FunnelTroyComponents | undefined {
  const theme = getThemeFromString(themeName);
  switch (theme) {
    case Theme.Classic:
      return getClassicThemeComponent(componentName);
    case Theme.Troy:
      return getTroyThemeComponent(componentName);
    case Theme.Nasa:
      return getNasaThemeComponent(componentName);
    default:
      return undefined;
  }
}