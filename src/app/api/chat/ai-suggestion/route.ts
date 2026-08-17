import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB()
        const {message, role} = await req.json()

const prompt = `
You are an AI assistant for a delivery app chat.

Context:
- User Role: ${role} (Can be "user" or "delivery boy")
- Last Message Received: "${message}"

Task:
Generate only 3 short, realistic, WhatsApp-style quick reply suggestions for the current role ("${role}").

Rules:
1. Replies must be short, helpful, and natural (1-6 words max per suggestion).
2. If language is Urdu/Hindi/English mixed (Hinglish/Roman Urdu), match the language style naturally.
3. Return ONLY a valid JSON array of 3 to 4 strings. Do NOT include markdown blocks, extra text, or explanations.

Example Output Format:
["Okay, I am downstairs", "Please leave it at the door", "How long will it take?", "Call me when you reach"]
`;

const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
            method: "POST",
            headers: {
                "x-goog-api-key": process.env.GEMINI_API_KEY!,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gemini-3.6-flash",
                input: prompt
            })
        });


        const data = await response.json()
        const replyText = data.steps[1].content[0].text  || ""
        const suggestion = replyText.replace(/[\[\]"]/g, "").split(",").map((s:string)=> s.trim())

        console.log(data)
         return NextResponse.json(suggestion, {status:200})
    } catch (error) {
        return NextResponse.json({message: `gemini  error ${error}`}, {status:200})
    }
}