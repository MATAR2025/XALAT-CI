"use client"

import { useState, useEffect } from "react"
import { saveSenBotChat } from "../lib/report"
import { toast } from "../hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export default function SenBotPage() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{question: string, response: string}[]>([])

  const user_id = "demo-user-id"

  async function askSenBot() {
    if (!question.trim()) return
    setLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent(question)
      const aiResponse = result.response.text()
      setResponse(aiResponse)
      setHistory(prev => [...prev, { question, response: aiResponse }])
      await saveSenBotChat({ user_id, question, response: aiResponse })
      setQuestion("")
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">SenBot IA</h1>
      <div className="flex-1 overflow-y-auto mb-4">
        {history.map((chat, index) => (
          <div key={index} className="mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mb-2">
              <p className="font-semibold">Vous:</p>
              <p>{chat.question}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="font-semibold">SenBot:</p>
              <p>{chat.response}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 border rounded px-3 py-2"
          onKeyPress={e => e.key === 'Enter' && askSenBot()}
        />
        <button
          onClick={askSenBot}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  )
}