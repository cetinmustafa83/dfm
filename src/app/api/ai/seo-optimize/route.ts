import { NextRequest, NextResponse } from 'next/server'
import { settingsDb } from '@/lib/settings-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, title, targetKeywords, url } = body

    if (!content || !title) {
      return NextResponse.json(
        { error: 'Content and title are required' },
        { status: 400 }
      )
    }

    const aiSettings = await settingsDb.getAI()

    if (!aiSettings.apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 400 }
      )
    }

    const seoSettings = aiSettings.seoTools || {
      autoMetaTags: true,
      autoKeywords: true,
      autoDescriptions: true,
      metaDescriptionLength: 160,
      titleLength: 60,
      focusKeywords: [],
    }

    const prompt = `Analyze and optimize the following content for SEO:

Title: ${title}
${url ? `URL: ${url}` : ''}
${targetKeywords ? `Target Keywords: ${targetKeywords}` : ''}

Content:
${content}

Please provide:
1. Optimized SEO title (max ${seoSettings.titleLength} characters)
2. Meta description (max ${seoSettings.metaDescriptionLength} characters)
3. Focus keywords (5-10 keywords)
4. Suggested meta tags
5. Content optimization recommendations
6. Keyword density analysis
7. Readability score and suggestions
8. Internal linking suggestions
9. Image alt text suggestions
10. Schema markup recommendations

Format the response as JSON with the following structure:
{
  "optimizedTitle": "SEO-optimized title",
  "metaDescription": "Compelling meta description",
  "focusKeywords": ["keyword1", "keyword2", ...],
  "metaTags": {
    "og:title": "...",
    "og:description": "...",
    "twitter:card": "...",
    ...
  },
  "recommendations": [
    {
      "category": "content|keywords|structure|technical",
      "priority": "high|medium|low",
      "suggestion": "Detailed recommendation",
      "impact": "Expected impact on SEO"
    }
  ],
  "keywordDensity": {
    "keyword1": 2.5,
    "keyword2": 1.8
  },
  "readabilityScore": 75,
  "readabilitySuggestions": ["suggestion1", "suggestion2"],
  "internalLinks": ["suggested link 1", "suggested link 2"],
  "imageAltTexts": ["alt text 1", "alt text 2"],
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    ...
  }
}`

    const response = await fetch(`${aiSettings.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: aiSettings.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO consultant and content optimizer. Provide detailed, actionable SEO recommendations based on current best practices and search engine guidelines.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent SEO analysis
        max_tokens: aiSettings.maxTokens,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'AI API request failed')
    }

    const data = await response.json()
    const resultContent = data.choices?.[0]?.message?.content

    if (!resultContent) {
      throw new Error('No content generated')
    }

    // Try to parse JSON response
    let seoAnalysis
    try {
      seoAnalysis = JSON.parse(resultContent)
    } catch {
      // If not JSON, create basic structured response
      seoAnalysis = {
        optimizedTitle: title,
        metaDescription: content.substring(0, seoSettings.metaDescriptionLength),
        focusKeywords: targetKeywords?.split(',').map((k: string) => k.trim()) || [],
        recommendations: [
          {
            category: 'general',
            priority: 'medium',
            suggestion: resultContent,
            impact: 'Moderate impact on SEO',
          },
        ],
      }
    }

    return NextResponse.json({
      success: true,
      seoAnalysis,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Error optimizing SEO:', error)
    return NextResponse.json(
      {
        error: 'Failed to optimize SEO',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}