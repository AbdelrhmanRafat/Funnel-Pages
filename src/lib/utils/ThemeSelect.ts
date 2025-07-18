// This file contains functions to convert theme strings to `Theme` enum values and to get theme-specific component names.
import { 
  FunnelClassicComponents, 
  FunnelTechnoComponents,
  FunnelMinimalComponents,
  FunnelElegantComponents,
  FunnelBoldComponents,
  FunnelPopComponents,
  FunnelArabicTouchComponents,
  FunnelNeonComponents,
  FunnelZenComponents,
  FunnelUrbanComponents,
  FunnelRetroComponents,
  FunnelProComponents,
  FunnelFreshComponents,
  Theme 
} from "../constants/themes";

// Converts a theme string to a Theme enum value.
export function getThemeFromString(themeName: string): Theme | undefined {
  switch (themeName.toLowerCase()) {
    case "classic":
      return Theme.Classic;
    case "techno":
      return Theme.Techno;
    case "minimal":
      return Theme.Minimal;
    case "elegant":
      return Theme.Elegant;
    case "bold":
      return Theme.Bold;
    case "pop":
      return Theme.Pop;
    case "arabic_touch":
      return Theme.ArabicTouch;
    case "neon":
      return Theme.Neon;
    case "zen":
      return Theme.Zen;
    case "urban":
      return Theme.Urban;
    case "retro":
      return Theme.Retro;
    case "pro":
      return Theme.Pro;
    case "fresh":
      return Theme.Fresh;
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

// Gets the available components for the Techno theme.
export function getTechnoThemeComponent(name: string): FunnelTechnoComponents | undefined {
  switch (name.toLowerCase()) {
    case "techno_header":
      return FunnelTechnoComponents.TechnoHeader;
    case "techno_form_fields":
      return FunnelTechnoComponents.TechnoFormFields;
    case "techno_countdown":
      return FunnelTechnoComponents.TechnoCountdown;
    case "techno_today_statistics":
      return FunnelTechnoComponents.TechnoTodayStatistics;
    case "techno_logos_carousel":
      return FunnelTechnoComponents.TechnoLogosCarousel;
    case "techno_rates":
      return FunnelTechnoComponents.TechnoRates;
    case "techno_visitors":
      return FunnelTechnoComponents.TechnoVisitors;
    case "techno_product_funnel":
      return FunnelTechnoComponents.TechnoProductFunnel;
    case "techno_footer":
      return FunnelTechnoComponents.TechnoFooter;
    case "techno_order_confirmation_notice":
      return FunnelTechnoComponents.TechnoOrderConfirmationNotice;
    case "techno_order_through_whatsapp":
      return FunnelTechnoComponents.TechnoOrderThroughWhatsapp;
    case "techno_faq":
      return FunnelTechnoComponents.TechnoFaq;
    case "techno_product_preview":
      return FunnelTechnoComponents.TechnoProductPreview;
    case "techno_product_usage":
      return FunnelTechnoComponents.TechnoProductUsage;
    case "techno_product_features":
      return FunnelTechnoComponents.TechnoProductFeatures;
    case "techno_delivery_features":
      return FunnelTechnoComponents.TechnoDeliveryFeatures;
    case "techno_button_with_link":
      return FunnelTechnoComponents.TechnoButtonWithLink;
    case "techno_coupon":
      return FunnelTechnoComponents.TechnoCoupon;
    case "techno_reviews":
      return FunnelTechnoComponents.TechnoReviews;
    case "techno_text-bar":
      return FunnelTechnoComponents.TechnoTextBar;
    case "techno_image_text_overlay":
      return FunnelTechnoComponents.TechnoImageTextOverLay;
    case "techno_image_text_beside":
      return FunnelTechnoComponents.TechnoImageTextBeside;
    case "techno_before_&_after":
      return FunnelTechnoComponents.Techno_Before_After;
    case "techno_gallery":
      return FunnelTechnoComponents.TechnoGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Minimal theme.
export function getMinimalThemeComponent(name: string): FunnelMinimalComponents | undefined {
  switch (name.toLowerCase()) {
    case "minimal_header":
      return FunnelMinimalComponents.MinimalHeader;
    case "minimal_form_fields":
      return FunnelMinimalComponents.MinimalFormFields;
    case "minimal_countdown":
      return FunnelMinimalComponents.MinimalCountdown;
    case "minimal_today_statistics":
      return FunnelMinimalComponents.MinimalTodayStatistics;
    case "minimal_logos_carousel":
      return FunnelMinimalComponents.MinimalLogosCarousel;
    case "minimal_rates":
      return FunnelMinimalComponents.MinimalRates;
    case "minimal_visitors":
      return FunnelMinimalComponents.MinimalVisitors;
    case "minimal_product_funnel":
      return FunnelMinimalComponents.MinimalProductFunnel;
    case "minimal_footer":
      return FunnelMinimalComponents.MinimalFooter;
    case "minimal_order_confirmation_notice":
      return FunnelMinimalComponents.MinimalOrderConfirmationNotice;
    case "minimal_order_through_whatsapp":
      return FunnelMinimalComponents.MinimalOrderThroughWhatsapp;
    case "minimal_faq":
      return FunnelMinimalComponents.MinimalFaq;
    case "minimal_product_preview":
      return FunnelMinimalComponents.MinimalProductPreview;
    case "minimal_product_usage":
      return FunnelMinimalComponents.MinimalProductUsage;
    case "minimal_product_features":
      return FunnelMinimalComponents.MinimalProductFeatures;
    case "minimal_delivery_features":
      return FunnelMinimalComponents.MinimalDeliveryFeatures;
    case "minimal_button_with_link":
      return FunnelMinimalComponents.MinimalButtonWithLink;
    case "minimal_coupon":
      return FunnelMinimalComponents.MinimalCoupon;
    case "minimal_reviews":
      return FunnelMinimalComponents.MinimalReviews;
    case "minimal_text-bar":
      return FunnelMinimalComponents.MinimalTextBar;
    case "minimal_image_text_overlay":
      return FunnelMinimalComponents.MinimalImageTextOverLay;
    case "minimal_image_text_beside":
      return FunnelMinimalComponents.MinimalImageTextBeside;
    case "minimal_before_&_after":
      return FunnelMinimalComponents.Minimal_Before_After;
    case "minimal_gallery":
      return FunnelMinimalComponents.MinimalGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Elegant theme.
export function getElegantThemeComponent(name: string): FunnelElegantComponents | undefined {
  switch (name.toLowerCase()) {
    case "elegant_header":
      return FunnelElegantComponents.ElegantHeader;
    case "elegant_form_fields":
      return FunnelElegantComponents.ElegantFormFields;
    case "elegant_countdown":
      return FunnelElegantComponents.ElegantCountdown;
    case "elegant_today_statistics":
      return FunnelElegantComponents.ElegantTodayStatistics;
    case "elegant_logos_carousel":
      return FunnelElegantComponents.ElegantLogosCarousel;
    case "elegant_rates":
      return FunnelElegantComponents.ElegantRates;
    case "elegant_visitors":
      return FunnelElegantComponents.ElegantVisitors;
    case "elegant_product_funnel":
      return FunnelElegantComponents.ElegantProductFunnel;
    case "elegant_footer":
      return FunnelElegantComponents.ElegantFooter;
    case "elegant_order_confirmation_notice":
      return FunnelElegantComponents.ElegantOrderConfirmationNotice;
    case "elegant_order_through_whatsapp":
      return FunnelElegantComponents.ElegantOrderThroughWhatsapp;
    case "elegant_faq":
      return FunnelElegantComponents.ElegantFaq;
    case "elegant_product_preview":
      return FunnelElegantComponents.ElegantProductPreview;
    case "elegant_product_usage":
      return FunnelElegantComponents.ElegantProductUsage;
    case "elegant_product_features":
      return FunnelElegantComponents.ElegantProductFeatures;
    case "elegant_delivery_features":
      return FunnelElegantComponents.ElegantDeliveryFeatures;
    case "elegant_button_with_link":
      return FunnelElegantComponents.ElegantButtonWithLink;
    case "elegant_coupon":
      return FunnelElegantComponents.ElegantCoupon;
    case "elegant_reviews":
      return FunnelElegantComponents.ElegantReviews;
    case "elegant_text-bar":
      return FunnelElegantComponents.ElegantTextBar;
    case "elegant_image_text_overlay":
      return FunnelElegantComponents.ElegantImageTextOverLay;
    case "elegant_image_text_beside":
      return FunnelElegantComponents.ElegantImageTextBeside;
    case "elegant_before_&_after":
      return FunnelElegantComponents.Elegant_Before_After;
    case "elegant_gallery":
      return FunnelElegantComponents.ElegantGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Bold theme.
export function getBoldThemeComponent(name: string): FunnelBoldComponents | undefined {
  switch (name.toLowerCase()) {
    case "bold_header":
      return FunnelBoldComponents.BoldHeader;
    case "bold_form_fields":
      return FunnelBoldComponents.BoldFormFields;
    case "bold_countdown":
      return FunnelBoldComponents.BoldCountdown;
    case "bold_today_statistics":
      return FunnelBoldComponents.BoldTodayStatistics;
    case "bold_logos_carousel":
      return FunnelBoldComponents.BoldLogosCarousel;
    case "bold_rates":
      return FunnelBoldComponents.BoldRates;
    case "bold_visitors":
      return FunnelBoldComponents.BoldVisitors;
    case "bold_product_funnel":
      return FunnelBoldComponents.BoldProductFunnel;
    case "bold_footer":
      return FunnelBoldComponents.BoldFooter;
    case "bold_order_confirmation_notice":
      return FunnelBoldComponents.BoldOrderConfirmationNotice;
    case "bold_order_through_whatsapp":
      return FunnelBoldComponents.BoldOrderThroughWhatsapp;
    case "bold_faq":
      return FunnelBoldComponents.BoldFaq;
    case "bold_product_preview":
      return FunnelBoldComponents.BoldProductPreview;
    case "bold_product_usage":
      return FunnelBoldComponents.BoldProductUsage;
    case "bold_product_features":
      return FunnelBoldComponents.BoldProductFeatures;
    case "bold_delivery_features":
      return FunnelBoldComponents.BoldDeliveryFeatures;
    case "bold_button_with_link":
      return FunnelBoldComponents.BoldButtonWithLink;
    case "bold_coupon":
      return FunnelBoldComponents.BoldCoupon;
    case "bold_reviews":
      return FunnelBoldComponents.BoldReviews;
    case "bold_text-bar":
      return FunnelBoldComponents.BoldTextBar;
    case "bold_image_text_overlay":
      return FunnelBoldComponents.BoldImageTextOverLay;
    case "bold_image_text_beside":
      return FunnelBoldComponents.BoldImageTextBeside;
    case "bold_before_&_after":
      return FunnelBoldComponents.Bold_Before_After;
    case "bold_gallery":
      return FunnelBoldComponents.BoldGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Pop theme.
export function getPopThemeComponent(name: string): FunnelPopComponents | undefined {
  switch (name.toLowerCase()) {
    case "pop_header":
      return FunnelPopComponents.PopHeader;
    case "pop_form_fields":
      return FunnelPopComponents.PopFormFields;
    case "pop_countdown":
      return FunnelPopComponents.PopCountdown;
    case "pop_today_statistics":
      return FunnelPopComponents.PopTodayStatistics;
    case "pop_logos_carousel":
      return FunnelPopComponents.PopLogosCarousel;
    case "pop_rates":
      return FunnelPopComponents.PopRates;
    case "pop_visitors":
      return FunnelPopComponents.PopVisitors;
    case "pop_product_funnel":
      return FunnelPopComponents.PopProductFunnel;
    case "pop_footer":
      return FunnelPopComponents.PopFooter;
    case "pop_order_confirmation_notice":
      return FunnelPopComponents.PopOrderConfirmationNotice;
    case "pop_order_through_whatsapp":
      return FunnelPopComponents.PopOrderThroughWhatsapp;
    case "pop_faq":
      return FunnelPopComponents.PopFaq;
    case "pop_product_preview":
      return FunnelPopComponents.PopProductPreview;
    case "pop_product_usage":
      return FunnelPopComponents.PopProductUsage;
    case "pop_product_features":
      return FunnelPopComponents.PopProductFeatures;
    case "pop_delivery_features":
      return FunnelPopComponents.PopDeliveryFeatures;
    case "pop_button_with_link":
      return FunnelPopComponents.PopButtonWithLink;
    case "pop_coupon":
      return FunnelPopComponents.PopCoupon;
    case "pop_reviews":
      return FunnelPopComponents.PopReviews;
    case "pop_text-bar":
      return FunnelPopComponents.PopTextBar;
    case "pop_image_text_overlay":
      return FunnelPopComponents.PopImageTextOverLay;
    case "pop_image_text_beside":
      return FunnelPopComponents.PopImageTextBeside;
    case "pop_before_&_after":
      return FunnelPopComponents.Pop_Before_After;
    case "pop_gallery":
      return FunnelPopComponents.PopGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Arabic Touch theme.
export function getArabicTouchThemeComponent(name: string): FunnelArabicTouchComponents | undefined {
  switch (name.toLowerCase()) {
    case "arabic_touch_header":
      return FunnelArabicTouchComponents.ArabicTouchHeader;
    case "arabic_touch_form_fields":
      return FunnelArabicTouchComponents.ArabicTouchFormFields;
    case "arabic_touch_countdown":
      return FunnelArabicTouchComponents.ArabicTouchCountdown;
    case "arabic_touch_today_statistics":
      return FunnelArabicTouchComponents.ArabicTouchTodayStatistics;
    case "arabic_touch_logos_carousel":
      return FunnelArabicTouchComponents.ArabicTouchLogosCarousel;
    case "arabic_touch_rates":
      return FunnelArabicTouchComponents.ArabicTouchRates;
    case "arabic_touch_visitors":
      return FunnelArabicTouchComponents.ArabicTouchVisitors;
    case "arabic_touch_product_funnel":
      return FunnelArabicTouchComponents.ArabicTouchProductFunnel;
    case "arabic_touch_footer":
      return FunnelArabicTouchComponents.ArabicTouchFooter;
    case "arabic_touch_order_confirmation_notice":
      return FunnelArabicTouchComponents.ArabicTouchOrderConfirmationNotice;
    case "arabic_touch_order_through_whatsapp":
      return FunnelArabicTouchComponents.ArabicTouchOrderThroughWhatsapp;
    case "arabic_touch_faq":
      return FunnelArabicTouchComponents.ArabicTouchFaq;
    case "arabic_touch_product_preview":
      return FunnelArabicTouchComponents.ArabicTouchProductPreview;
    case "arabic_touch_product_usage":
      return FunnelArabicTouchComponents.ArabicTouchProductUsage;
    case "arabic_touch_product_features":
      return FunnelArabicTouchComponents.ArabicTouchProductFeatures;
    case "arabic_touch_delivery_features":
      return FunnelArabicTouchComponents.ArabicTouchDeliveryFeatures;
    case "arabic_touch_button_with_link":
      return FunnelArabicTouchComponents.ArabicTouchButtonWithLink;
    case "arabic_touch_coupon":
      return FunnelArabicTouchComponents.ArabicTouchCoupon;
    case "arabic_touch_reviews":
      return FunnelArabicTouchComponents.ArabicTouchReviews;
    case "arabic_touch_text-bar":
      return FunnelArabicTouchComponents.ArabicTouchTextBar;
    case "arabic_touch_image_text_overlay":
      return FunnelArabicTouchComponents.ArabicTouchImageTextOverLay;
    case "arabic_touch_image_text_beside":
      return FunnelArabicTouchComponents.ArabicTouchImageTextBeside;
    case "arabic_touch_before_&_after":
      return FunnelArabicTouchComponents.ArabicTouch_Before_After;
    case "arabic_touch_gallery":
      return FunnelArabicTouchComponents.ArabicTouchGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Neon theme.
export function getNeonThemeComponent(name: string): FunnelNeonComponents | undefined {
  switch (name.toLowerCase()) {
    case "neon_header":
      return FunnelNeonComponents.NeonHeader;
    case "neon_form_fields":
      return FunnelNeonComponents.NeonFormFields;
    case "neon_countdown":
      return FunnelNeonComponents.NeonCountdown;
    case "neon_today_statistics":
      return FunnelNeonComponents.NeonTodayStatistics;
    case "neon_logos_carousel":
      return FunnelNeonComponents.NeonLogosCarousel;
    case "neon_rates":
      return FunnelNeonComponents.NeonRates;
    case "neon_visitors":
      return FunnelNeonComponents.NeonVisitors;
    case "neon_product_funnel":
      return FunnelNeonComponents.NeonProductFunnel;
    case "neon_footer":
      return FunnelNeonComponents.NeonFooter;
    case "neon_order_confirmation_notice":
      return FunnelNeonComponents.NeonOrderConfirmationNotice;
    case "neon_order_through_whatsapp":
      return FunnelNeonComponents.NeonOrderThroughWhatsapp;
    case "neon_faq":
      return FunnelNeonComponents.NeonFaq;
    case "neon_product_preview":
      return FunnelNeonComponents.NeonProductPreview;
    case "neon_product_usage":
      return FunnelNeonComponents.NeonProductUsage;
    case "neon_product_features":
      return FunnelNeonComponents.NeonProductFeatures;
    case "neon_delivery_features":
      return FunnelNeonComponents.NeonDeliveryFeatures;
    case "neon_button_with_link":
      return FunnelNeonComponents.NeonButtonWithLink;
    case "neon_coupon":
      return FunnelNeonComponents.NeonCoupon;
    case "neon_reviews":
      return FunnelNeonComponents.NeonReviews;
    case "neon_text-bar":
      return FunnelNeonComponents.NeonTextBar;
    case "neon_image_text_overlay":
      return FunnelNeonComponents.NeonImageTextOverLay;
    case "neon_image_text_beside":
      return FunnelNeonComponents.NeonImageTextBeside;
    case "neon_before_&_after":
      return FunnelNeonComponents.Neon_Before_After;
    case "neon_gallery":
      return FunnelNeonComponents.NeonGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Zen theme.
export function getZenThemeComponent(name: string): FunnelZenComponents | undefined {
  switch (name.toLowerCase()) {
    case "zen_header":
      return FunnelZenComponents.ZenHeader;
    case "zen_form_fields":
      return FunnelZenComponents.ZenFormFields;
    case "zen_countdown":
      return FunnelZenComponents.ZenCountdown;
    case "zen_today_statistics":
      return FunnelZenComponents.ZenTodayStatistics;
    case "zen_logos_carousel":
      return FunnelZenComponents.ZenLogosCarousel;
    case "zen_rates":
      return FunnelZenComponents.ZenRates;
    case "zen_visitors":
      return FunnelZenComponents.ZenVisitors;
    case "zen_product_funnel":
      return FunnelZenComponents.ZenProductFunnel;
    case "zen_footer":
      return FunnelZenComponents.ZenFooter;
    case "zen_order_confirmation_notice":
      return FunnelZenComponents.ZenOrderConfirmationNotice;
    case "zen_order_through_whatsapp":
      return FunnelZenComponents.ZenOrderThroughWhatsapp;
    case "zen_faq":
      return FunnelZenComponents.ZenFaq;
    case "zen_product_preview":
      return FunnelZenComponents.ZenProductPreview;
    case "zen_product_usage":
      return FunnelZenComponents.ZenProductUsage;
    case "zen_product_features":
      return FunnelZenComponents.ZenProductFeatures;
    case "zen_delivery_features":
      return FunnelZenComponents.ZenDeliveryFeatures;
    case "zen_button_with_link":
      return FunnelZenComponents.ZenButtonWithLink;
    case "zen_coupon":
      return FunnelZenComponents.ZenCoupon;
    case "zen_reviews":
      return FunnelZenComponents.ZenReviews;
    case "zen_text-bar":
      return FunnelZenComponents.ZenTextBar;
    case "zen_image_text_overlay":
      return FunnelZenComponents.ZenImageTextOverLay;
    case "zen_image_text_beside":
      return FunnelZenComponents.ZenImageTextBeside;
    case "zen_before_&_after":
      return FunnelZenComponents.Zen_Before_After;
    case "zen_gallery":
      return FunnelZenComponents.ZenGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Urban theme.
export function getUrbanThemeComponent(name: string): FunnelUrbanComponents | undefined {
  switch (name.toLowerCase()) {
    case "urban_header":
      return FunnelUrbanComponents.UrbanHeader;
    case "urban_form_fields":
      return FunnelUrbanComponents.UrbanFormFields;
    case "urban_countdown":
      return FunnelUrbanComponents.UrbanCountdown;
    case "urban_today_statistics":
      return FunnelUrbanComponents.UrbanTodayStatistics;
    case "urban_logos_carousel":
      return FunnelUrbanComponents.UrbanLogosCarousel;
    case "urban_rates":
      return FunnelUrbanComponents.UrbanRates;
    case "urban_visitors":
      return FunnelUrbanComponents.UrbanVisitors;
    case "urban_product_funnel":
      return FunnelUrbanComponents.UrbanProductFunnel;
    case "urban_footer":
      return FunnelUrbanComponents.UrbanFooter;
    case "urban_order_confirmation_notice":
      return FunnelUrbanComponents.UrbanOrderConfirmationNotice;
    case "urban_order_through_whatsapp":
      return FunnelUrbanComponents.UrbanOrderThroughWhatsapp;
    case "urban_faq":
      return FunnelUrbanComponents.UrbanFaq;
    case "urban_product_preview":
      return FunnelUrbanComponents.UrbanProductPreview;
    case "urban_product_usage":
      return FunnelUrbanComponents.UrbanProductUsage;
    case "urban_product_features":
      return FunnelUrbanComponents.UrbanProductFeatures;
    case "urban_delivery_features":
      return FunnelUrbanComponents.UrbanDeliveryFeatures;
    case "urban_button_with_link":
      return FunnelUrbanComponents.UrbanButtonWithLink;
    case "urban_coupon":
      return FunnelUrbanComponents.UrbanCoupon;
    case "urban_reviews":
      return FunnelUrbanComponents.UrbanReviews;
    case "urban_text-bar":
      return FunnelUrbanComponents.UrbanTextBar;
    case "urban_image_text_overlay":
      return FunnelUrbanComponents.UrbanImageTextOverLay;
    case "urban_image_text_beside":
      return FunnelUrbanComponents.UrbanImageTextBeside;
    case "urban_before_&_after":
      return FunnelUrbanComponents.Urban_Before_After;
    case "urban_gallery":
      return FunnelUrbanComponents.UrbanGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Retro theme.
export function getRetroThemeComponent(name: string): FunnelRetroComponents | undefined {
  switch (name.toLowerCase()) {
    case "retro_header":
      return FunnelRetroComponents.RetroHeader;
    case "retro_form_fields":
      return FunnelRetroComponents.RetroFormFields;
    case "retro_countdown":
      return FunnelRetroComponents.RetroCountdown;
    case "retro_today_statistics":
      return FunnelRetroComponents.RetroTodayStatistics;
    case "retro_logos_carousel":
      return FunnelRetroComponents.RetroLogosCarousel;
    case "retro_rates":
      return FunnelRetroComponents.RetroRates;
    case "retro_visitors":
      return FunnelRetroComponents.RetroVisitors;
    case "retro_product_funnel":
      return FunnelRetroComponents.RetroProductFunnel;
    case "retro_footer":
      return FunnelRetroComponents.RetroFooter;
    case "retro_order_confirmation_notice":
      return FunnelRetroComponents.RetroOrderConfirmationNotice;
    case "retro_order_through_whatsapp":
      return FunnelRetroComponents.RetroOrderThroughWhatsapp;
    case "retro_faq":
      return FunnelRetroComponents.RetroFaq;
    case "retro_product_preview":
      return FunnelRetroComponents.RetroProductPreview;
    case "retro_product_usage":
      return FunnelRetroComponents.RetroProductUsage;
    case "retro_product_features":
      return FunnelRetroComponents.RetroProductFeatures;
    case "retro_delivery_features":
      return FunnelRetroComponents.RetroDeliveryFeatures;
    case "retro_button_with_link":
      return FunnelRetroComponents.RetroButtonWithLink;
    case "retro_coupon":
      return FunnelRetroComponents.RetroCoupon;
    case "retro_reviews":
      return FunnelRetroComponents.RetroReviews;
    case "retro_text-bar":
      return FunnelRetroComponents.RetroTextBar;
    case "retro_image_text_overlay":
      return FunnelRetroComponents.RetroImageTextOverLay;
    case "retro_image_text_beside":
      return FunnelRetroComponents.RetroImageTextBeside;
    case "retro_before_&_after":
      return FunnelRetroComponents.Retro_Before_After;
    case "retro_gallery":
      return FunnelRetroComponents.RetroGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Pro theme.
export function getProThemeComponent(name: string): FunnelProComponents | undefined {
  switch (name.toLowerCase()) {
    case "pro_header":
      return FunnelProComponents.ProHeader;
    case "pro_form_fields":
      return FunnelProComponents.ProFormFields;
    case "pro_countdown":
      return FunnelProComponents.ProCountdown;
    case "pro_today_statistics":
      return FunnelProComponents.ProTodayStatistics;
    case "pro_logos_carousel":
      return FunnelProComponents.ProLogosCarousel;
    case "pro_rates":
      return FunnelProComponents.ProRates;
    case "pro_visitors":
      return FunnelProComponents.ProVisitors;
    case "pro_product_funnel":
      return FunnelProComponents.ProProductFunnel;
    case "pro_footer":
      return FunnelProComponents.ProFooter;
    case "pro_order_confirmation_notice":
      return FunnelProComponents.ProOrderConfirmationNotice;
    case "pro_order_through_whatsapp":
      return FunnelProComponents.ProOrderThroughWhatsapp;
    case "pro_faq":
      return FunnelProComponents.ProFaq;
    case "pro_product_preview":
      return FunnelProComponents.ProProductPreview;
    case "pro_product_usage":
      return FunnelProComponents.ProProductUsage;
    case "pro_product_features":
      return FunnelProComponents.ProProductFeatures;
    case "pro_delivery_features":
      return FunnelProComponents.ProDeliveryFeatures;
    case "pro_button_with_link":
      return FunnelProComponents.ProButtonWithLink;
    case "pro_coupon":
      return FunnelProComponents.ProCoupon;
    case "pro_reviews":
      return FunnelProComponents.ProReviews;
    case "pro_text-bar":
      return FunnelProComponents.ProTextBar;
    case "pro_image_text_overlay":
      return FunnelProComponents.ProImageTextOverLay;
    case "pro_image_text_beside":
      return FunnelProComponents.ProImageTextBeside;
    case "pro_before_&_after":
      return FunnelProComponents.Pro_Before_After;
    case "pro_gallery":
      return FunnelProComponents.ProGallery;
    default:
      return undefined;
  }
}

// Gets the available components for the Fresh theme.
export function getFreshThemeComponent(name: string): FunnelFreshComponents | undefined {
  switch (name.toLowerCase()) {
    case "fresh_header":
      return FunnelFreshComponents.FreshHeader;
    case "fresh_form_fields":
      return FunnelFreshComponents.FreshFormFields;
    case "fresh_countdown":
      return FunnelFreshComponents.FreshCountdown;
    case "fresh_today_statistics":
      return FunnelFreshComponents.FreshTodayStatistics;
    case "fresh_logos_carousel":
      return FunnelFreshComponents.FreshLogosCarousel;
    case "fresh_rates":
      return FunnelFreshComponents.FreshRates;
    case "fresh_visitors":
      return FunnelFreshComponents.FreshVisitors;
    case "fresh_product_funnel":
      return FunnelFreshComponents.FreshProductFunnel;
    case "fresh_footer":
      return FunnelFreshComponents.FreshFooter;
    case "fresh_order_confirmation_notice":
      return FunnelFreshComponents.FreshOrderConfirmationNotice;
    case "fresh_order_through_whatsapp":
      return FunnelFreshComponents.FreshOrderThroughWhatsapp;
    case "fresh_faq":
      return FunnelFreshComponents.FreshFaq;
    case "fresh_product_preview":
      return FunnelFreshComponents.FreshProductPreview;
    case "fresh_product_usage":
      return FunnelFreshComponents.FreshProductUsage;
    case "fresh_product_features":
      return FunnelFreshComponents.FreshProductFeatures;
    case "fresh_delivery_features":
      return FunnelFreshComponents.FreshDeliveryFeatures;
    case "fresh_button_with_link":
      return FunnelFreshComponents.FreshButtonWithLink;
    case "fresh_coupon":
      return FunnelFreshComponents.FreshCoupon;
    case "fresh_reviews":
      return FunnelFreshComponents.FreshReviews;
    case "fresh_text-bar":
      return FunnelFreshComponents.FreshTextBar;
    case "fresh_image_text_overlay":
      return FunnelFreshComponents.FreshImageTextOverLay;
    case "fresh_image_text_beside":
      return FunnelFreshComponents.FreshImageTextBeside;
    case "fresh_before_&_after":
      return FunnelFreshComponents.Fresh_Before_After;
    case "fresh_gallery":
      return FunnelFreshComponents.FreshGallery;
    default:
      return undefined;
  }
}

// Generic function to get theme component based on theme type
export function getThemeComponent(
  themeName: string,
  componentName: string
): FunnelClassicComponents | FunnelTechnoComponents | FunnelMinimalComponents | FunnelElegantComponents | FunnelBoldComponents | FunnelPopComponents | FunnelArabicTouchComponents | FunnelNeonComponents | FunnelZenComponents | FunnelUrbanComponents | FunnelRetroComponents | FunnelProComponents | FunnelFreshComponents | undefined {
  const theme = getThemeFromString(themeName);
  switch (theme) {
    case Theme.Classic:
      return getClassicThemeComponent(componentName);
    case Theme.Techno:
      return getTechnoThemeComponent(componentName);
    case Theme.Minimal:
      return getMinimalThemeComponent(componentName);
    case Theme.Elegant:
      return getElegantThemeComponent(componentName);
    case Theme.Bold:
      return getBoldThemeComponent(componentName);
    case Theme.Pop:
      return getPopThemeComponent(componentName);
    case Theme.ArabicTouch:
      return getArabicTouchThemeComponent(componentName);
    case Theme.Neon:
      return getNeonThemeComponent(componentName);
    case Theme.Zen:
      return getZenThemeComponent(componentName);
    case Theme.Urban:
      return getUrbanThemeComponent(componentName);
    case Theme.Retro:
      return getRetroThemeComponent(componentName);
    case Theme.Pro:
      return getProThemeComponent(componentName);
    case Theme.Fresh:
      return getFreshThemeComponent(componentName);
    default:
      return undefined;
  }
}