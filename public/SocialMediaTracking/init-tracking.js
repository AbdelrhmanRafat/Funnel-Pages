export async function initTracking({
  facebookPixelID,
  twitterPixelID,
  snapchatPixelID,
  tiktokPixelID
}) {
  if (facebookPixelID) {
    const { initFacebookPixel } = await import('./facebook-tracking.js');
    initFacebookPixel(facebookPixelID);
  }

  if (tiktokPixelID) {
    const { initTikTokPixel } = await import('./tiktok-tracking.js');
    initTikTokPixel(tiktokPixelID);
  }

  if (twitterPixelID) {
    const { initTwitterPixel } = await import('./twitter-tracking.js');
    initTwitterPixel(twitterPixelID);
  }

  if (snapchatPixelID) {
    const { initSnapchatPixel } = await import('./snapchat-tracking.js');
    initSnapchatPixel(snapchatPixelID);
  }
}