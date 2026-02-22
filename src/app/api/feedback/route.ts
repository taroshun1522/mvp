import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FeedbackRequest, FeedbackData, OverallLabel } from "@/types";

function deriveLabel(score: number): OverallLabel {
  if (score >= 8) return "Great";
  if (score >= 5) return "Good";
  return "Keep Practicing";
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    const { conversationHistory, errors } = body;

    if (!conversationHistory || conversationHistory.length === 0) {
      return NextResponse.json(
        { error: "No conversation data provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `あなたは英会話講師のフィードバック担当です。以下の会話ログとリアルタイムで検出されたエラーを基に、
日本人上級英語学習者向けのフィードバックレポートを生成してください。

## 会話ログ
${conversationHistory.map((m) => `${m.role}: ${m.content}`).join("\n")}

## リアルタイム検出エラー
${JSON.stringify(errors, null, 2)}

## 出力フォーマット（JSON）
以下のJSON形式で出力してください。JSON以外のテキストは一切含めないでください。
{
  "overallScore": 1-10の評価,
  "summary": "全体的な講評（日本語、2-3文）",
  "errors": [
    {
      "original": "ユーザーが言った表現",
      "corrected": "正しい表現",
      "explanation": "日本語での解説",
      "category": "grammar|vocabulary|expression",
      "severity": "minor|moderate|major"
    }
  ],
  "strengths": ["良かった点1（英語）", "良かった点2（英語）"],
  "suggestions": ["改善アドバイス1（英語）", "改善アドバイス2（英語）"],
  "naturalExpressions": [
    {
      "used": "ユーザーが使った良い表現",
      "comment": "なぜ良いかの解説（英語）"
    }
  ]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    const feedbackData: FeedbackData = {
      overallScore: parsed.overallScore,
      overallLabel: deriveLabel(parsed.overallScore),
      summary: parsed.summary,
      errors: parsed.errors || [],
      strengths: parsed.strengths || [],
      suggestions: parsed.suggestions || [],
      naturalExpressions: parsed.naturalExpressions || [],
    };

    return NextResponse.json(feedbackData);
  } catch (error) {
    console.error("Feedback generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
