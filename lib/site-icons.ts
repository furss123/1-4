const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function asset(file: string): string {
  return `${basePath}/${file}`;
}

export const SITE_ICONS = {
  favicon: asset("favicon.ico"),
  favicon32: asset("favicon-32.png"),
  apple: asset("apple-touch-icon.png"),
  pwa192: asset("icon-192.png"),
  pwa512: asset("icon-512.png"),
  manifest: asset("manifest.webmanifest"),
} as const;
