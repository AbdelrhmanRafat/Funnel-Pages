export async function initTracking({
  facebookPixelID,
  twitterPixelID,
  snapchatPixelID,
  tiktokPixelID
}: {
  facebookPixelID?: string;
  twitterPixelID?: string;
  snapchatPixelID?: string;
  tiktokPixelID?: string;
}) {
  if (facebookPixelID) {
    const { initFacebookPixel } = await import('./facebook-tracking');
    initFacebookPixel(facebookPixelID);
  }
    if (tiktokPixelID) {
    const { initTikTokPixel } = await import('./tiktok-tracking');
      initTikTokPixel(tiktokPixelID);
}

  if (twitterPixelID) {
    const { initTwitterPixel } = await import('./twitter-tracking');
    initTwitterPixel(twitterPixelID);
  }

  if (snapchatPixelID) {
    const { initSnapchatPixel } = await import('./snapchat-tracking');
    initSnapchatPixel(snapchatPixelID);
  }
}