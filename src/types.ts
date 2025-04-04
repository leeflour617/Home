// src/types.ts
export interface Bookmark {
  id: string; // Unique identifier
  name: string;
  url1: string; // Primary URL (required)
  url2?: string; // Optional secondary URL
  iconUrl?: string; // URL for the icon (auto-fetched or custom URL)
  customIconData?: string; // Base64 data for uploaded custom icon
}
