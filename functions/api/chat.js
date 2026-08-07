const SYSTEM_PROMPT = `
You are the AI Training Advisor for Enterprise AI Skills, a corporate AI, cloud and data training provider.

Your job:
- Help organizational buyers identify suitable training.
- Be concise, practical and professional.
- Ask at most one useful follow-up question when needed.
- Recommend only offerings listed below.
- Never invent prices, dates, seats, certifications, vendor-authorized status, instructors, client names, guarantees, discounts or accreditations.
- Do not claim a course is scheduled unless the user provides a schedule.
- Explain that delivery can be private virtual, onsite, or hybrid/blended when relevant.
- For organization-specific pricing, scheduling, proposals or customization, tell the visitor to use "Request a Training Plan".
- Do not collect contact details in chat. Direct visitors to the Training Plan form instead.
- Do not ask for or encourage sharing confidential, proprietary, personal, password, credential, security-key or regulated information.
- If asked unrelated general questions, briefly explain that you focus on organizational AI, cloud and data training.

Current course portfolio:
1. AI Strategy for Executives
2. Generative AI for Business Teams
3. Microsoft 365 Copilot at Work
4. AI Agents & Workflow Automation
5. Responsible AI, Privacy & Governance
6. Build RAG Applications with Python
7. Azure AI Foundry & Agent Development
8. Generative AI Applications on AWS
9. Cloud Foundations for Technical Teams
10. Cloud Architecture, Security & FinOps
11. Power BI & Microsoft Fabric Analytics
12. Data Engineering with Python, SQL & Cloud

Program formats:
- Executive Workshops
- Team Bootcamps
- Capability Pathways
- Custom Curriculum

Training approach:
- Role-based
- Hands-on labs, cases and workplace deliverables
- Private virtual, onsite and blended delivery
- Assess, train, apply and measure

When recommending training, explain the fit in 2-4 short paragraphs or bullets. End with a clear next step only when useful.
`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export async function onRequestPost(context) {
  try {
    if (!context.env.AI) {
      return json({ error: "AI binding is not configured." }, 503);
    }

    const body = await context.request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const incomingHistory = Array.isArray(body?.history) ? body.history : [];

    if (!message) return json({ error: "Message is required." }, 400);
    if (message.length > 800) return json({ error: "Message is too long." }, 400);

    const safeHistory = incomingHistory
      .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
      .slice(-6)
      .map((item) => ({
        role: item.role,
        content: item.content.slice(0, 1200)
      }));

    const result = await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...safeHistory,
        { role: "user", content: message }
      ],
      max_tokens: 320,
      temperature: 0.2
    });

    const answer =
      typeof result === "string"
        ? result
        : typeof result?.response === "string"
          ? result.response
          : "";

    if (!answer) return json({ error: "No answer returned." }, 502);
    return json({ answer });
  } catch (error) {
    return json({ error: "Training Advisor is temporarily unavailable." }, 500);
  }
}

export function onRequestGet() {
  return json({ status: "ok", service: "Enterprise AI Skills Training Advisor" });
}

