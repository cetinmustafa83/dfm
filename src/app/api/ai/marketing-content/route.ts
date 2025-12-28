import { NextRequest, NextResponse } from 'next/server'
import { settingsDb } from '@/lib/settings-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentType, topic, platform, tone, targetAudience } = body

    if (!contentType || !topic) {
      return NextResponse.json(
        { error: 'Content type and topic are required' },
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

    const marketingSettings = aiSettings.marketing || {
      platforms: [],
      hashtagGeneration: true,
      targetAudience: '',
    }

    // Content type specific prompts
    const contentTypePrompts: Record<string, string> = {
      'social-post': `Create an engaging social media post for ${platform || 'social media'}`,
      'email-campaign': 'Write a compelling email marketing campaign',
      'ad-copy': 'Create persuasive advertising copy',
      'product-description': 'Write a detailed and appealing product description',
      'landing-page': 'Create compelling landing page copy',
      'newsletter': 'Write an informative newsletter section',
      'press-release': 'Draft a professional press release',
    }

    const basePrompt = contentTypePrompts[contentType] || 'Create marketing content'

    const prompt = `${basePrompt} about "${topic}".

Requirements:
- Platform: ${platform || 'General'}
- Tone: ${tone || 'Professional'}
- Target Audience: ${targetAudience || marketingSettings.targetAudience || 'General audience'}
${marketingSettings.hashtagGeneration ? '- Include relevant hashtags' : ''}
${contentType === 'social-post' ? '- Keep it concise and engaging' : ''}
${contentType === 'email-campaign' ? '- Include subject line and preview text' : ''}
${contentType === 'ad-copy' ? '- Include headline, body, and call-to-action' : ''}

Format the response as JSON with the following structure:
${contentType === 'social-post' ? `{
  "content": "Social media post text",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "platform": "${platform || 'general'}",
  "characterCount": 280,
  "engagementTips": ["tip1", "tip2"],
  "bestTimeToPost": "Suggested posting time",
  "imageDescription": "Suggested image description"
}` : contentType === 'email-campaign' ? `{
  "subjectLine": "Email subject",
  "previewText": "Preview text",
  "body": "Email body content",
  "cta": "Call-to-action text",
  "ctaLink": "Suggested CTA link",
  "personalizedElements": ["element1", "element2"],
  "segmentRecommendations": ["segment1", "segment2"]
}` : contentType === 'ad-copy' ? `{
  "headline": "Attention-grabbing headline",
  "subheadline": "Supporting subheadline",
  "body": "Ad body copy",
  "cta": "Call-to-action text",
  "variations": [
    {"headline": "...", "body": "...", "cta": "..."}
  ],
  "targetKeywords": ["keyword1", "keyword2"],
  "imageDescription": "Suggested image"
}` : `{
  "headline": "Main headline",
  "content": "Main content",
  "cta": "Call-to-action",
  "additionalElements": {
    "subheadings": ["subheading1", "subheading2"],
    "bulletPoints": ["point1", "point2"],
    "stats": ["stat1", "stat2"]
  }
}`}

Additional considerations:
- Make it compelling and actionable
- Focus on benefits, not just features
- Create urgency or FOMO where appropriate
- Align with brand voice and target audience
- Optimize for platform-specific best practices`

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
            content: 'You are an expert marketing copywriter and content strategist. Create compelling, conversion-focused marketing content that resonates with the target audience.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: aiSettings.temperature,
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
    let marketingContent
    try {
      marketingContent = JSON.parse(resultContent)
    } catch {
      // If not JSON, create basic structured response
      marketingContent = {
        content: resultContent,
        contentType,
        platform: platform || 'general',
      }
    }

    return NextResponse.json({
      success: true,
      marketingContent,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Error generating marketing content:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate marketing content',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}