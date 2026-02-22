import { NextRequest, NextResponse } from "next/server";
import { getInstructor } from "@/lib/instructors";
import { SessionRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: SessionRequest = await request.json();
    const { instructorId } = body;

    const instructor = getInstructor(instructorId);
    if (!instructor) {
      return NextResponse.json(
        { error: "Invalid instructor ID" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { personaConfig } = instructor;

    // Client tool for real-time error tracking during conversation
    const clientTools = [
      {
        type: "client",
        name: "log_error",
        description:
          "Log a grammar or expression error made by the user during conversation. Call this whenever you notice an error, but do NOT mention the error in your spoken response.",
        parameters: {
          type: "object",
          properties: {
            original: {
              type: "string",
              description: "What the user actually said",
            },
            corrected: {
              type: "string",
              description: "Corrected version",
            },
            explanation: {
              type: "string",
              description: "Brief explanation in Japanese",
            },
            category: {
              type: "string",
              enum: [
                "grammar",
                "vocabulary",
                "expression",
                "pronunciation_hint",
              ],
            },
          },
          required: ["original", "corrected", "explanation", "category"],
        },
      },
    ];

    const response = await fetch(
      "https://api.anam.ai/v1/auth/session-token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personaConfig: {
            name: personaConfig.name,
            avatarId: personaConfig.avatarId,
            voiceId: personaConfig.voiceId,
            llmId: personaConfig.llmId,
            systemPrompt: personaConfig.systemPrompt,
            maxSessionLengthSeconds: personaConfig.maxSessionLengthSeconds,
            skipGreeting: personaConfig.skipGreeting,
            voiceDetectionOptions: personaConfig.voiceDetectionOptions,
          },
          tools: clientTools,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anam API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
