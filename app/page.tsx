"use client"

import { useState, useRef } from "react"
import { uploadReportImage, insertReport } from "../lib/report"
import { toast } from "../hooks/use-toast"
import {
  Bell,
  User,
  Camera,
  MapPin,
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Remplacer par l'ID utilisateur réel si besoin
  const user_id = "demo-user-id"

  async function handleReport(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !category) {
      toast({ title: "Erreur", description: "Veuillez choisir une catégorie et prendre une photo.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      // Géolocalisation navigateur
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      })
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      // Upload image
      const image_url = await uploadReportImage(file, user_id)
      // Insert report
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
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-[#0d5c8f] to-[#1a8cba] rounded-b-[2rem] px-4 pt-3 pb-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-lg font-semibold">Tableau de bord citoyen</h1>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#0d5c8f] border-2 border-white/30 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* User card */}
        <div className="bg-[#0a4d75]/60 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#5a9ab8] flex items-center justify-center">
            <User className="w-7 h-7 text-[#0a4d75]" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-base">Bonjour, Matar Mbow</p>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>Tivaouane · Région de Thiès</span>
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
            label="PROBLÈMES RÉSOLUS"
            iconBg="bg-[#e8f8f0]"
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-[#f5a623]" fill="#f5a623" />}
            value="847"
            label="POINTS CIVIQUES"
            iconBg="bg-[#fef8e8]"
          />
        </div>

        {/* Formulaire de signalement */}
        <form onSubmit={handleReport} className="w-full bg-white rounded-xl p-4 mb-6 flex flex-col gap-4 shadow">
          <label className="font-medium text-gray-700">Catégorie</label>
          <select
            className="border rounded px-3 py-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Choisir une catégorie</option>
            <option value="Voirie">Voirie</option>
            <option value="Eau">Eau</option>
            <option value="Électricité">Électricité</option>
            <option value="Déchets">Déchets</option>
            <option value="Autre">Autre</option>
          </select>
          <label className="font-medium text-gray-700">Photo (caméra)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="border rounded px-3 py-2"
            onChange={e => setFile(e.target.files?.[0] || null)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#006d44] hover:bg-[#005a38] text-white rounded-xl py-3 flex items-center justify-center gap-3 font-semibold text-base transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : (<><Camera className="w-5 h-5" /> <span>SIGNALER UN PROBLÈME</span></>)}
          </button>
        </form>

        {/* Services rapides */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Services rapides</h2>
            <button className="text-[#1a8cba] text-sm font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <ServiceItem icon={<Plus className="w-6 h-6 text-red-500" />} label="Signaler" bgColor="bg-red-50" />
            <ServiceItem icon={<Building2 className="w-6 h-6 text-teal-600" />} label="Santé" bgColor="bg-teal-50" />
            <ServiceItem icon={<DollarSign className="w-6 h-6 text-amber-500" />} label="Paiements" bgColor="bg-amber-50" />
            <ServiceItem icon={<GraduationCap className="w-6 h-6 text-gray-700" />} label="Éducation" bgColor="bg-blue-50" />
            <ServiceItem icon={<Map className="w-6 h-6 text-orange-500" />} label="Carte" bgColor="bg-orange-50" />
            <ServiceItem icon={<Users className="w-6 h-6 text-pink-500" />} label="Aides sociales" bgColor="bg-pink-50" />
            <ServiceItem icon={<Bot className="w-6 h-6 text-blue-600" />} label="SenBot IA" bgColor="bg-blue-50" />
            <ServiceItem icon={<MoreHorizontal className="w-6 h-6 text-gray-500" />} label="Plus" bgColor="bg-gray-100" />
          </div>
        </div>

        {/* Urgent banner */}
        <div className="bg-[#fff9e6] border-2 border-[#f5a623] rounded-xl p-3 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0">
            <Droplet className="w-5 h-5 text-white" fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm">
              Pénurie de sang — Groupe B+
            </p>
            <p className="text-gray-500 text-xs">
              Hôpital Roi Baudouin · Thiès · 2,3 km
            </p>
          </div>
          <span className="bg-[#e74c3c] text-white text-xs font-bold px-3 py-1 rounded-full flex-shrink-0">
            URGENT
          </span>
        </div>

        {/* Urgences & Santé */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Urgences & Santé</h2>
          <div className="grid grid-cols-2 gap-4">
            <EmergencyCard
              icon={<Siren className="w-8 h-8 text-red-500" />}
              label="Bouton SOS"
              bgColor="bg-red-50"
              iconBg="bg-white"
            />
            <EmergencyCard
              icon={<Calendar className="w-8 h-8 text-teal-600" />}
              label="Rdv Médical"
              bgColor="bg-teal-50"
              iconBg="bg-white"
            />
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          <NavItem
            icon={<Home className="w-6 h-6" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<Megaphone className="w-6 h-6" />}
            label="Signalements"
            active={activeTab === "signalements"}
            onClick={() => setActiveTab("signalements")}
          />
          <NavItem
            icon={<Map className="w-6 h-6" />}
            label="Carte"
            active={activeTab === "carte"}
            onClick={() => setActiveTab("carte")}
          />
          <NavItem
            icon={<Bot className="w-6 h-6" />}
            label="SenBot"
            active={activeTab === "senbot"}
            onClick={() => setActiveTab("senbot")}
            badge
          />
          <NavItem
            icon={<User className="w-6 h-6" />}
            label="Profil"
            active={activeTab === "profil"}
            onClick={() => setActiveTab("profil")}
          />
        </div>
      </nav>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  iconBg,
}: {
  icon: React.ReactNode
  value: string
  label: string
  iconBg: string
}) {
  return (
    <div className="flex-1 bg-white rounded-xl p-3 shadow-sm flex flex-col items-center">
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-xl font-bold text-[#1a8cba]">{value}</p>
      <p className="text-[10px] text-gray-500 text-center font-medium leading-tight">{label}</p>
    </div>
  )
}

function ServiceItem({
  icon,
  label,
  bgColor,
}: {
  icon: React.ReactNode
  label: string
  bgColor: string
}) {
  return (
    <button className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs text-gray-600 text-center leading-tight">{label}</span>
    </button>
  )
}

function EmergencyCard({
  icon,
  label,
  bgColor,
  iconBg,
}: {
  icon: React.ReactNode
  label: string
  bgColor: string
  iconBg: string
}) {
  return (
    <button className={`${bgColor} rounded-2xl p-4 flex flex-col items-start gap-3`}>
      <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
      <span className="font-semibold text-gray-800 text-sm">{label}</span>
    </button>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-1 relative ${
        active ? "text-[#1a8cba]" : "text-gray-400"
      }`}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}
