import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, category, existingDescription } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Product name and category are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to .env' },
        { status: 500 }
      )
    }

    // Build the prompt for the AI
    const prompt = `Write a compelling product description for a Sri Lankan online nut shop called "Ceylon Crunch". The product is "${name}" which belongs to the category "${category}".

The description should:
- Be 1-2 sentences
- Highlight quality, sourcing, or flavor
- Match the brand voice: premium, artisanal, Sri Lankan heritage
- Be SEO-friendly but natural-sounding

${
  existingDescription
    ? `Current description to improve: "${existingDescription}"`
    : 'Create a new description from scratch.'
}

Respond with only the description text, no additional formatting.`

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Ceylon Crunch',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const generatedDescription = data.choices?.[0]?.message?.content?.trim()

    if (!generatedDescription) {
      return NextResponse.json(
        { error: 'No description generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({ description: generatedDescription })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}
