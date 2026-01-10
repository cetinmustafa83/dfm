import { NextRequest, NextResponse } from 'next/server'
import { settingsDb } from '@/lib/settings-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, industry, targetAudience, location } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
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

    const prompt = `Perform comprehensive keyword research for the following:

Topic: ${topic}
${industry ? `Industry: ${industry}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${location ? `Location: ${location}` : ''}

Please provide:
1. Primary keywords (high volume, high competition)
2. Secondary keywords (medium volume, medium competition)
3. Long-tail keywords (low volume, low competition, high intent)
4. Question-based keywords (what, how, why, when questions)
5. Seasonal keywords (if applicable)
6. Competitor keywords
7. LSI (Latent Semantic Indexing) keywords
8. Keyword difficulty estimates
9. Search intent classification
10. Content gap opportunities

Format the response as JSON with the following structure:
{
  "primaryKeywords": [
    {
      "keyword": "keyword phrase",
      "estimatedVolume": "high|medium|low",
      "difficulty": "high|medium|low",
      "intent": "informational|transactional|navigational|commercial",
      "opportunity": "Explanation of opportunity"
    }
  ],
  "secondaryKeywords": [...],
  "longTailKeywords": [...],
  "questionKeywords": [
    {
      "question": "Question phrase",
      "volume": "high|medium|low",
      "answerOpportunity": "Brief explanation"
    }
  ],
  "seasonalKeywords": [
    {
      "keyword": "keyword",
      "season": "Season or time period",
      "peakMonths": ["Month1", "Month2"]
    }
  ],
  "competitorKeywords": [
    {
      "keyword": "keyword",
      "competitorAdvantage": "Why competitors rank well",
      "opportunityGap": "How to compete"
    }
  ],
  "lsiKeywords": ["related term 1", "related term 2"],
  "contentGaps": [
    {
      "topic": "Underserved topic",
      "opportunity": "Detailed opportunity description",
      "suggestedKeywords": ["keyword1", "keyword2"]
    }
  ],
  "recommendations": {
    "focusAreas": ["area1", "area2"],
    "quickWins": ["opportunity1", "opportunity2"],
    "contentStrategy": "Overall strategy recommendation"
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
            content: 'You are an expert SEO and keyword research specialist. Provide comprehensive, data-driven keyword research insights based on current SEO best practices and search trends.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
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
    let keywordResearch
    try {
      keywordResearch = JSON.parse(resultContent)
    } catch {
      // If not JSON, create basic structured response
      keywordResearch = {
        primaryKeywords: [
          {
            keyword: topic,
            estimatedVolume: 'medium',
            difficulty: 'medium',
            intent: 'informational',
            opportunity: resultContent.substring(0, 200),
          },
        ],
        recommendations: {
          focusAreas: [topic],
          quickWins: [],
          contentStrategy: resultContent,
        },
      }
    }

    return NextResponse.json({
      success: true,
      keywordResearch,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Error performing keyword research:', error)
    return NextResponse.json(
      {
        error: 'Failed to perform keyword research',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}