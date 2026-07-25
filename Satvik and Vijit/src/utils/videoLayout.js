export function getDrillVideosClass(videoLayout) {
  return videoLayout === 'side-by-side'
    ? 'drill-item__videos drill-item__videos--side-by-side'
    : 'drill-item__videos'
}
