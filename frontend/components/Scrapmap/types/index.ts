export interface ScrapbookEntry {
  _id: string
  lat: number
  lng: number
  notes: string
  media?: string[] // Array of Base64 strings for multiple media
  mediaTypes?: string[] // Array of media types
  createdAt?: Date
}

export interface MediaItem {
  data: string // Base64 string
  type: string // MIME type
}

export interface ShareOptions {
  platform: "facebook" | "twitter" | "whatsapp" | "pinterest" | "email"
  title?: string
  text?: string
  url?: string
  media?: string
}

