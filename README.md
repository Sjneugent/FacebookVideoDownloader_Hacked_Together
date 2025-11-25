# FacebookVideoDownloader_Hacked_Together

A Chrome extension to download videos from Facebook.

## Updates

**2024 Update**: Updated to work with modern Facebook video delivery system that uses HTML5 video elements instead of Flash embeds.

### New Features:
- **HTML5 Video Support**: Now detects and extracts video URLs from modern HTML5 video elements
- **Multiple Video Format Support**: Supports MP4, WebM, MOV, AVI, and M4V formats
- **Enhanced URL Extraction**: Searches for video URLs in:
  - Direct video `src` attributes
  - `<source>` elements within video tags
  - Data attributes (data-src, data-video-url, etc.)
  - JavaScript variables and JSON data
  - Facebook-specific URL patterns (playable_url, browser_native_*, etc.)
- **Improved Error Handling**: Better user feedback when no videos are found
- **Backward Compatibility**: Still supports the old Flash embed method for older content

### Installation:
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this directory
5. The extension will appear in your Chrome toolbar

### Usage:
1. Navigate to a Facebook page with a video
2. Click the extension icon in your Chrome toolbar
3. If videos are detected, they will be automatically downloaded
4. Check your browser's download manager for the downloaded files

### Technical Details:
The extension now uses a modern approach to detect videos:
- First looks for HTML5 `<video>` elements
- Extracts video URLs from various sources within the page
- Handles Facebook's current video delivery patterns
- Falls back to the original Flash embed detection for compatibility

### Note:
This extension works best with videos that have direct download URLs. Some videos may use streaming protocols that are not directly downloadable.
