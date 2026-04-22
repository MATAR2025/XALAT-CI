"use client"

import { useState, useRef, useEffect } from "react"
import { uploadReportImage, insertReport, getUserData, saveSenBotChat } from "../lib/report"
import { toast } from "../hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Correction des imports Lucide : ajout de import { et des icônes manquantes (User, MapPin, Camera)
import { 
  Bell,
  User,
  MapPin,
  Camera,
  CheckCircle,
  Megaphone,
  Star,
  ChevronRight,
  Heart,
  GraduationCap,
  Map,
  Users,
  Bot,
  MoreHorizontal,
  Home,
  AlertTriangle,
  Droplet,
  Building2,
  Calendar,
  Plus,
  DollarSign,
  Siren,
} from "lucide-react"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [userData, setUserData] = useState<{name: string, neighborhood: string, points: number} | null>(null)

  // À remplacer par l'ID utilisateur réel via Supabase Auth plus tard
  const user_id = "demo-user-id"

  useEffect(() => {
    if (activeTab === "profil" && !userData) {
      getUserData(user_id).then(setUserData).catch(err => console.error(err))
    }
  }, [activeTab, userData, user_id])

  async function handleReport(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !category) {
      toast({ title: "Erreur", description: "Veuillez choisir une catégorie et prendre une photo.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      })
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      const image_url = await uploadReportImage(file, user_id)
      
      await insertReport({ category, lat, lng, user_id, image_url })
      
      toast({ title: "Signalement envoyé", description: "Merci pour votre contribution !" })
      setCategory("")
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Une erreur est survenue.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-[#0d5c8f] to-[#1a8cba] rounded-b-[2rem] px-4 pt-3 pb-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-lg font-semibold">
            {activeTab === "dashboard" && "Tableau de bord citoyen"}
            {activeTab === "signalements" && "Signalements"}
            {activeTab === "carte" && "Carte"}
            {activeTab === "senbot" && "SenBot IA"}
            {activeTab === "profil" && "Profil"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#0d5c8f] border-2 border-white/30 flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* User card */}
        <div className="bg-[#0a4d75]/60 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3 border border-white/10">
          <div className="w-12 h-12 rounded-full bg-[#5a9ab8] flex items-center justify-center">
            <User className="w-7 h-7 text-[#0a4d75]" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-base">{userData?.name || "Utilisateur"}</p>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>{userData?.neighborhood || "Tivaouane"} · Sénégal</span>
            </div>
          </div>
          <div className="bg-[#2ecc71] text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Vérifié</span>
          </div>
        </div>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {activeTab === "dashboard" && (
          <>
            {/* Stats cards */}
            <div className="flex gap-3 mb-4">
              <StatCard
                icon={<Megaphone className="w-5 h-5 text-[#3498db]" />}
                value="2"
                label="MES SIGNALEMENTS"
                iconBg="bg-[#e8f4fc]"
              />
              <StatCard
                icon={<CheckCircle className="w-5 h-5 text-[#2ecc71]" />}
                value="0"
                label="RÉSOLUS"
                iconBg="bg-[#e8f8f0]"
              />
              <StatCard
                icon={<Star className="w-5 h-5 text-[#f5a623]" fill="#f5a623" />}
                value="847"
                label="POINTS"
                iconBg="bg-[#fef8e8]"
              />
            </div>

            {/* Main action button */}
            <button 
              onClick={() => setActiveTab("signalements")}
              className="w-full bg-[#006d44] hover:bg-[#005a38] text-white rounded-xl py-4 flex items-center justify-center gap-3 font-semibold text-base mb-6 transition-all shadow-lg active:scale-95"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <span>SIGNALER UN PROBLÈME</span>
            </button>

            {/* Services rapides */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Services rapides</h2>
                <button className="text-[#1a8cba] text-sm font-medium flex items-center gap-1">
                  Voir tout <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <ServiceItem icon={<Plus className="w-6 h-6 text-red-500" />} label="Signaler" bgColor="bg-red-50" onClick={() => setActiveTab("signalements")} />
                <ServiceItem icon={<Building2 className="w-6 h-6 text-teal-600" />} label="Santé" bgColor="bg-teal-50" />
                <ServiceItem icon={<DollarSign className="w-6 h-6 text-amber-500" />} label="Paiements" bgColor="bg-amber-50" />
                <ServiceItem icon={<GraduationCap className="w-6 h-6 text-gray-700" />} label="Éducation" bgColor="bg-blue-50" />
              </div>
            </div>

            {/* Urgent banner */}
            <div className="bg-[#fff9e6] border-2 border-[#f5a623] rounded-xl p-3 flex items-center gap-3 mb-6 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0">
                <Droplet className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">Pénurie de sang — B+</p>
                <p className="text-gray-500 text-xs">Hôpital Roi Baudouin · 2,3 km</p>
              </div>
              <span className="bg-[#e74c3c] text-white text-xs font-bold px-3 py-1 rounded-full">URGENT</span>
            </div>
          </>
        )}

        {activeTab === "signalements" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Nouveau signalement</h2>
            <form onSubmit={handleReport} className="w-full bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-md border border-gray-100">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Catégorie du problème</label>
                <select
                  className="border border-gray-200 rounded-lg px-3 py-3 bg-gray-50 focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="">Choisir une catégorie</option>
                  <option value="Voirie">Voirie / Routes</option>
                  <option value="Eau">Eau / Assainissement</option>
                  <option value="Électricité">Éclairage public</option>
                  <option value="Déchets">Gestion des déchets</option>
                  <option value="Autre">Autre incident</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">Prendre une photo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500">{file ? file.name : "Appuyer pour ouvrir l'appareil"}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#006d44] hover:bg-[#005a38] text-white rounded-xl py-4 flex items-center justify-center gap-3 font-semibold text-base transition-all disabled:opacity-50 shadow-md"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : <><Camera className="w-5 h-5" /> <span>ENVOYER LE SIGNALEMENT</span></>}
              </button>
            </form>
          </div>
        )}

        {activeTab === "senbot" && <SenBotComponent />}

        {activeTab === "profil" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Mon Profil</h2>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Nom complet</span>
                <span className="font-semibold">{userData?.name || "Matar Mbow"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Quartier</span>
                <span className="font-semibold">{userData?.neighborhood || "Tivaouane"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Points civiques</span>
                <span className="font-bold text-cyan-600">{userData?.points || 847}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto px-2 pb-safe">
        <div className="flex items-center justify-around py-3">
          <NavItem icon={<Home className="w-6 h-6" />} label="Accueil" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <NavItem icon={<Megaphone className="w-6 h-6" />} label="Signaler" active={activeTab === "signalements"} onClick={() => setActiveTab("signalements")} />
          <NavItem icon={<Bot className="w-6 h-6" />} label="SenBot" active={activeTab === "senbot"} onClick={() => setActiveTab("senbot")} badge />
          <NavItem icon={<User className="w-6 h-6" />} label="Profil" active={activeTab === "profil"} onClick={() => setActiveTab("profil")} />
        </div>
      </nav>
    </div>
  )
}

// Composants internes (SenBot, StatCard, etc.)
function SenBotComponent() {
  const [question, setQuestion] = useState("")
  const [history, setHistory] = useState<{question: string, response: string}[]>([])
  const [loading, setLoading] = useState(false)

  async function askSenBot() {
    if (!question.trim()) return
    setLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent(question)
      const aiResponse = result.response.text()
      setHistory(prev => [...prev, { question, response: aiResponse }])
      setQuestion("")
    } catch (err: any) {
      toast({ title: "Erreur IA", description: "Impossible de contacter SenBot." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {history.length === 0 && (
          <div className="text-center text-gray-400 mt-10">Posez une question sur Tivaouane ou sur les services municipaux.</div>
        )}
        {history.map((chat, i) => (
          <div key={i} className="space-y-2">
            <div className="bg-cyan-100 p-3 rounded-2xl rounded-tr-none ml-auto max-w-[80%] text-sm">{chat.question}</div>
            <div className="bg-white border p-3 rounded-2xl rounded-tl-none mr-auto max-w-[80%] text-sm shadow-sm">{chat.response}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 bg-white p-2 rounded-xl shadow-inner">
        <input
          className="flex-1 outline-none text-sm px-2"
          placeholder="Écrivez ici..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && askSenBot()}
        />
        <button onClick={askSenBot} disabled={loading} className="bg-cyan-600 text-white p-2 rounded-lg">
          {loading ? "..." : "OK"}
        </button>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, iconBg }: any) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center border border-gray-50">
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center mb-2`}>{icon}</div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
      <p className="text-[9px] text-gray-400 text-center font-bold uppercase">{label}</p>
    </div>
  )
}

function ServiceItem({ icon, label, bgColor, onClick }: any) {
  return (
    <button className="flex flex-col items-center gap-2" onClick={onClick}>
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center shadow-sm`}>{icon}</div>
      <span className="text-[10px] font-bold text-gray-600">{label}</span>
    </button>
  )
}

function NavItem({ icon, label, active, onClick, badge }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? "text-cyan-600" : "text-gray-400"}`}>
      <div className="relative">
        {icon}
        {badge && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  )
}