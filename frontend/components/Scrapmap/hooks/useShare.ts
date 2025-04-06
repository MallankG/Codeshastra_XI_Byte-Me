"use client"

import { useState } from "react"
import type { ShareOptions } from "@/components/Scrapmap/types"

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  const shareContent = async (options: ShareOptions): Promise<boolean> => {
    setIsSharing(true)
    setShareError(null)

    try {
      const { platform, title, text, url, media } = options

      // Base URL for the current page if none provided
      const shareUrl = url || window.location.href

      switch (platform) {
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
          break

        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || "")}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          )
          break

        case "whatsapp":
          window.open(`https://wa.me/?text=${encodeURIComponent((text || "") + " " + shareUrl)}`, "_blank")
          break

        case "pinterest":
          if (!media) {
            throw new Error("Media URL is required for Pinterest sharing")
          }
          window.open(
            `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(text || "")}`,
            "_blank",
          )
          break

        case "email":
          window.location.href = `mailto:?subject=${encodeURIComponent(title || "Check this out!")}&body=${encodeURIComponent((text || "") + "\n\n" + shareUrl)}`
          break

        default:
          // Try to use the Web Share API if available
          if (navigator.share) {
            await navigator.share({
              title: title,
              text: text,
              url: shareUrl,
            })
          } else {
            throw new Error("Sharing method not supported")
          }
      }

      setIsSharing(false)
      return true
    } catch (error) {
      setShareError((error as Error).message)
      setIsSharing(false)
      return false
    }
  }

  return {
    shareContent,
    isSharing,
    shareError,
  }
}

