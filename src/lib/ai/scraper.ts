/**
 * Web Scraper Service
 * Scrapes web content for AI blog generation
 * 
 * Note: Install cheerio for HTML parsing: npm install cheerio
 */

interface ScrapedContent {
  title: string
  content: string
  description?: string
  author?: string
  publishDate?: string
  url: string
  images?: string[]
  links?: string[]
}

interface ScrapeOptions {
  includeImages?: boolean
  includeLinks?: boolean
  maxContentLength?: number
  timeout?: number
}

/**
 * Fetch and parse HTML content
 */
async function fetchHTML(url: string, timeout: number = 10000): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.text()
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Extract main content from HTML
 */
function extractContent(html: string): string {
  // Remove script and style tags
  let content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  
  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, ' ')
  
  // Clean up whitespace
  content = content.replace(/\s+/g, ' ').trim()
  
  return content
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string {
  // Try og:title first
  const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)
  if (ogTitle && ogTitle[1]) {
    return ogTitle[1]
  }

  // Try title tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1]
  }

  // Try h1 tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  if (h1Match && h1Match[1]) {
    return h1Match[1]
  }

  return 'Untitled'
}

/**
 * Extract description from HTML
 */
function extractDescription(html: string): string | undefined {
  // Try og:description
  const ogDesc = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)
  if (ogDesc && ogDesc[1]) {
    return ogDesc[1]
  }

  // Try meta description
  const metaDesc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)
  if (metaDesc && metaDesc[1]) {
    return metaDesc[1]
  }

  return undefined
}

/**
 * Extract images from HTML
 */
function extractImages(html: string): string[] {
  const images: string[] = []
  const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/gi
  let match

  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1] && !match[1].includes('data:image')) {
      images.push(match[1])
    }
  }

  return images
}

/**
 * Extract links from HTML
 */
function extractLinks(html: string): string[] {
  const links: string[] = []
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>/gi
  let match

  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1] && match[1].startsWith('http')) {
      links.push(match[1])
    }
  }

  return links
}

/**
 * Scrape content from URL
 */
export async function scrapeUrl(
  url: string,
  options: ScrapeOptions = {}
): Promise<ScrapedContent> {
  try {
    const {
      includeImages = false,
      includeLinks = false,
      maxContentLength = 10000,
      timeout = 10000
    } = options

    console.log('Scraping URL:', url)

    // Fetch HTML
    const html = await fetchHTML(url, timeout)

    // Extract content
    const title = extractTitle(html)
    const description = extractDescription(html)
    let content = extractContent(html)

    // Limit content length
    if (content.length > maxContentLength) {
      content = content.substring(0, maxContentLength) + '...'
    }

    // Build result
    const result: ScrapedContent = {
      title,
      content,
      description,
      url
    }

    if (includeImages) {
      result.images = extractImages(html)
    }

    if (includeLinks) {
      result.links = extractLinks(html)
    }

    console.log('Scraping completed:', {
      url,
      titleLength: title.length,
      contentLength: content.length
    })

    return result
  } catch (error) {
    console.error('Scraping error:', error)
    throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Scrape multiple URLs
 */
export async function scrapeMultipleUrls(
  urls: string[],
  options: ScrapeOptions = {}
): Promise<ScrapedContent[]> {
  const results: ScrapedContent[] = []

  for (const url of urls) {
    try {
      const content = await scrapeUrl(url, options)
      results.push(content)
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error)
      // Continue with next URL
    }
  }

  return results
}

/**
 * Search Google for URLs (using custom search API)
 */
export async function searchGoogle(
  query: string,
  numResults: number = 5
): Promise<string[]> {
  try {
    // This would use Google Custom Search API
    // You need to set up API key and search engine ID
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

    if (!apiKey || !searchEngineId) {
      throw new Error('Google Search API not configured')
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=${numResults}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.statusText}`)
    }

    const data = await response.json()
    const urls = data.items?.map((item: any) => item.link) || []

    console.log('Google search completed:', {
      query,
      resultsFound: urls.length
    })

    return urls
  } catch (error) {
    console.error('Google search error:', error)
    return []
  }
}

/**
 * Research topic and gather content
 */
export async function researchTopic(
  topic: string,
  numSources: number = 3
): Promise<ScrapedContent[]> {
  try {
    console.log('Researching topic:', topic)

    // Search for URLs
    const urls = await searchGoogle(topic, numSources)

    if (urls.length === 0) {
      throw new Error('No search results found')
    }

    // Scrape content from URLs
    const contents = await scrapeMultipleUrls(urls, {
      includeImages: false,
      includeLinks: false,
      maxContentLength: 5000
    })

    console.log('Research completed:', {
      topic,
      sourcesFound: contents.length
    })

    return contents
  } catch (error) {
    console.error('Research error:', error)
    throw error
  }
}

/**
 * Extract article metadata
 */
export function extractMetadata(html: string): {
  author?: string
  publishDate?: string
  category?: string
} {
  const metadata: any = {}

  // Extract author
  const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"[^>]*>/i)
  if (authorMatch && authorMatch[1]) {
    metadata.author = authorMatch[1]
  }

  // Extract publish date
  const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"[^>]*>/i)
  if (dateMatch && dateMatch[1]) {
    metadata.publishDate = dateMatch[1]
  }

  // Extract category
  const categoryMatch = html.match(/<meta[^>]*property="article:section"[^>]*content="([^"]*)"[^>]*>/i)
  if (categoryMatch && categoryMatch[1]) {
    metadata.category = categoryMatch[1]
  }

  return metadata
}

/**
 * Clean and format scraped content
 */
export function cleanContent(content: string): string {
  // Remove extra whitespace
  let cleaned = content.replace(/\s+/g, ' ').trim()
  
  // Remove common footer/header text
  const removePatterns = [
    /cookie policy/gi,
    /privacy policy/gi,
    /terms of service/gi,
    /all rights reserved/gi,
    /subscribe to newsletter/gi,
    /follow us on/gi
  ]

  removePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '')
  })

  return cleaned.trim()
}