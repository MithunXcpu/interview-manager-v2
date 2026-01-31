// ============================================================================
// AI Chat API Route -- POST /api/ai/chat
// ============================================================================
// Mock implementation: returns context-aware responses based on keywords.
// Will be replaced with Anthropic Claude API integration later.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const MOCK_USER_ID = 'mock-user-id';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  context?: {
    page?: string;
    companyId?: string;
  };
}

// ---------------------------------------------------------------------------
// Mock response generators
// ---------------------------------------------------------------------------

function getResearchResponse(): string {
  return `Here's what I found about the company:

**Overview**
- Founded in 2018, Series C funded ($120M total raised)
- ~850 employees across 4 offices (SF, NYC, London, Singapore)
- Core product is an enterprise data platform

**Recent News**
- Announced Q4 earnings beat expectations by 12%
- Launched new AI-powered analytics module
- Named to Forbes Cloud 100 list

**Interview Insights**
- Strong engineering culture with emphasis on system design
- Values: ownership, transparency, customer obsession
- Common interview topics: distributed systems, API design, data modeling

Would you like me to dig deeper into any of these areas?`;
}

function getEmailResponse(): string {
  return `Here's a draft follow-up email:

---

**Subject:** Thank you for the conversation - [Your Name]

Hi [Interviewer Name],

Thank you for taking the time to speak with me today about the [Role Title] position. I really enjoyed learning about the team's approach to [specific topic discussed].

Our conversation about [key discussion point] particularly resonated with me, and I'm excited about the opportunity to contribute to [specific project or goal].

I look forward to the next steps in the process. Please don't hesitate to reach out if you need any additional information from me.

Best regards,
[Your Name]

---

Feel free to customize the bracketed sections. Would you like me to adjust the tone or add specific details?`;
}

function getInterviewResponse(): string {
  return `Here are some interview preparation tips:

**Before the Interview**
- Research the company's recent product launches and press releases
- Review the job description and prepare STAR-format stories for each requirement
- Prepare 3-5 thoughtful questions about the role and team

**Technical Preparation**
- Practice system design: focus on scalability, trade-offs, and clear communication
- Review data structures and algorithms relevant to the role
- Be ready to discuss past projects in depth -- focus on your specific contributions

**During the Interview**
- Use the STAR method: Situation, Task, Action, Result
- Think out loud during technical questions
- Ask clarifying questions before jumping into solutions
- Show genuine curiosity about the company and role

**Common Behavioral Questions**
1. Tell me about a time you disagreed with a teammate
2. Describe a project where you had to learn something new quickly
3. How do you prioritize when everything seems urgent?

Would you like me to help you practice any of these?`;
}

function getPipelineResponse(): string {
  return `Here's your pipeline summary:

**Active Applications:** 12
- 3 in Initial Screen stage
- 4 in Technical Interview stage
- 2 in Final Round stage
- 2 in Offer stage
- 1 in Negotiation stage

**This Week's Action Items**
- Follow up with Acme Corp (no response in 5 days)
- Prepare for Google technical interview on Thursday
- Submit references for Stripe final round
- Review offer letter from Vercel

**Suggested Priorities**
1. Focus on the two offers -- they have the nearest deadlines
2. Send follow-up to Acme Corp before it goes cold
3. Block time for Google interview prep

Need me to help with any of these tasks?`;
}

function getAnalyzeResponse(): string {
  return `**Pipeline Analysis**

Your pipeline is healthy with good stage distribution. Here are my observations:

**Strengths**
- Strong conversion rate from screen to technical (75%)
- Multiple offers in progress gives you negotiating leverage
- Good mix of company sizes and stages

**Areas to Watch**
- 2 applications have been in "Technical Interview" for 10+ days with no update
- Your response rate to recruiter outreach has dropped this week
- Consider adding more early-stage pipeline to maintain flow

**Recommendations**
- Set a 48-hour follow-up rule for any stage that goes silent
- Aim for 3-5 new applications per week to keep the pipeline full
- Track prep time per interview to optimize your schedule

Want me to generate a detailed breakdown of any stage?`;
}

function getSuggestResponse(): string {
  return `**Suggested Next Steps**

Based on your current pipeline, here are my top recommendations:

1. **Respond to Stripe** -- Their recruiter reached out 2 days ago and you haven't replied yet. Quick response time signals interest.

2. **Schedule mock interview** -- Your Google onsite is in 4 days. Consider practicing system design with a peer.

3. **Update Notion tracker** -- 3 applications are missing notes from recent calls. Capture those insights while they're fresh.

4. **Send thank-you notes** -- You had 2 interviews yesterday but no follow-ups sent yet.

5. **Review compensation data** -- Before the Vercel offer negotiation, research market rates on levels.fyi.

Should I help draft any of these follow-ups?`;
}

function getDefaultResponse(lastMessage: string): string {
  return `I can help you with various aspects of your interview pipeline. Here are some things I can assist with:

- **Research companies** -- Get background info, recent news, and interview insights
- **Draft emails** -- Follow-ups, thank-you notes, and outreach messages
- **Interview prep** -- Practice questions, tips, and strategies
- **Pipeline analysis** -- Review your application status and suggest next steps
- **Weekly reports** -- Summarize your progress and upcoming tasks

What would you like help with?`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty.' },
        { status: 400 }
      );
    }

    // Get the last user message for keyword matching
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user');

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'At least one user message is required.' },
        { status: 400 }
      );
    }

    const content = lastUserMessage.content.toLowerCase();

    // Simulate a brief processing delay (200-600ms)
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 400)
    );

    // Route to mock response based on keywords
    let response: string;

    if (content.includes('research') || content.includes('company')) {
      response = getResearchResponse();
    } else if (
      content.includes('email') ||
      content.includes('draft') ||
      content.includes('follow-up') ||
      content.includes('follow up')
    ) {
      response = getEmailResponse();
    } else if (
      content.includes('interview') ||
      content.includes('prep') ||
      content.includes('practice') ||
      content.includes('tips')
    ) {
      response = getInterviewResponse();
    } else if (
      content.includes('pipeline') ||
      content.includes('summary') ||
      content.includes('report') ||
      content.includes('weekly')
    ) {
      response = getPipelineResponse();
    } else if (
      content.includes('analyze') ||
      content.includes('analysis') ||
      content.includes('insight')
    ) {
      response = getAnalyzeResponse();
    } else if (
      content.includes('suggest') ||
      content.includes('next step') ||
      content.includes('recommend') ||
      content.includes('what should')
    ) {
      response = getSuggestResponse();
    } else {
      response = getDefaultResponse(lastUserMessage.content);
    }

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error('[AI Chat API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
