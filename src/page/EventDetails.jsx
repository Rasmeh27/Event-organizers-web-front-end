"use client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
// import Image from "next/image"

export default function EventDetails({ eventId }) {
  const [event, setEvent] = useState(null)
  const [organizer, setOrganizer] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAttending, setIsAttending] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    // Obtener información del organizador logueado
    const storedUser = localStorage.getItem("organizer")
    if (storedUser) {
      const organizerData = JSON.parse(storedUser)
      const organizerId = organizerData.id

      if (organizerId) {
        fetch(`http://localhost:8080/api/auth/organizer/${organizerId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Error al obtener datos del organizador")
            return res.json()
          })
          .then((data) => {
            setOrganizer(data)
          })
          .catch((err) => {
            console.error("Error:", err)
            setOrganizer(null)
          })
      }
    }

    // Obtener detalles del evento específico
    if (id) {
      fetch(`http://localhost:8080/api/eventos/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener el evento")
          return res.json()
        })
        .then((data) => {
          setEvent(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error al obtener evento:", err)
          setLoading(false)
        })
    }
  }, [id])

  const getInitials = (nombre, apellido) => {
    if (!nombre || !apellido) return ""
    return `${nombre[0]}${apellido[0]}`.toUpperCase()
  }

  const handleLogout = () => {
    localStorage.removeItem("organizer")
    sessionStorage.clear()
    setIsUserMenuOpen(false)
    alert("Sesión cerrada exitosamente")
    window.location.href = "/login"
  }

  const handleProfile = () => {
    setIsUserMenuOpen(false)
    navigate("/profile")
  }

  const handleMyEvents = () => {
    setIsUserMenuOpen(false)
    navigate("/MyEvents")
  }

  const handleBackToEvents = () => {
    navigate("/home")
  }

  const getEventTypeColor = (type) => {
    const colors = {
      Free: "bg-green-500",
      Concert: "bg-purple-500",
      OpenBar: "bg-orange-500",
      "Special Guest": "bg-yellow-500",
      VIP: "bg-pink-500",
      Cover: "bg-blue-500",
    }
    return colors[type] || "bg-gray-500"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAttendance = () => {
    setIsAttending(!isAttending)
    // Aquí iría la lógica para confirmar/cancelar asistencia
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white/70">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-4">Evento no encontrado</h2>
          <p className="text-white/70 mb-6">El evento que buscas no existe o ha sido eliminado</p>
          <button
            onClick={handleBackToEvents}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
          >
            Volver a eventos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm z-50 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">LET'S PARTY</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botón volver */}
            <button
              onClick={handleBackToEvents}
              className="text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200 text-sm flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>

            {/* Notificaciones */}
            <button className="text-white hover:bg-white/10 p-2 rounded-md transition-colors duration-200 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={handleMyEvents}
              className="text-white hover:bg-white/10 hidden sm:flex px-3 py-2 rounded-md transition-colors duration-200 text-sm cursor-pointer"
            >
              Ver mis eventos
            </button>

            {/* Crear evento */}
            <a
              href="/publish"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium hidden sm:flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Evento
            </a>

            {/* Perfil de Usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-cyan-400 bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {organizer ? getInitials(organizer.nombre, organizer.apellido) : "?"}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">
                    {organizer ? `${organizer.nombre} ${organizer.apellido}` : "Cargando..."}
                  </p>
                  <p className="text-xs text-white/70">Usuario</p>
                </div>
              </button>

              {/* Menú desplegable del usuario */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800/98 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-medium text-white">
                      {organizer ? `${organizer.nombre} ${organizer.apellido}` : "Cargando..."}
                    </p>
                    <p className="text-xs text-white/70">{organizer ? organizer.email : ""}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi Perfil
                    </button>

                    <button
                      onClick={handleMyEvents}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Mis Eventos
                    </button>
                  </div>

                  <div className="border-t border-white/20 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3v-1"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {event.title}
          </h1>
          <p className="text-xl text-white/70 mb-6">{event.organizerName || "Discoteca"}</p>

          {/* Event Type Badge */}
          <div className="flex justify-center mb-8">
            <span
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white ${getEventTypeColor(event.type)} shadow-lg`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {event.type}
            </span>
          </div>
        </div>

        {/* Event Image */}
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={event.image || "/placeholder.svg?height=400&width=800"}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=400&width=800"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Floating Action Buttons */}
          <div className="absolute bottom-6 right-6 flex gap-3">
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>

            <button
              onClick={handleAttendance}
              className={`backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 shadow-lg ${
                isAttending ? "bg-green-500/80 hover:bg-green-600/80" : "bg-cyan-500/80 hover:bg-cyan-600/80"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Detalles */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Detalles</h2>
            </div>
            <p className="text-white/80 leading-relaxed">{event.description}</p>
          </div>

          {/* Fecha y Hora */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Fecha y Hora</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="capitalize">{formatDate(event.dateTime)}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatTime(event.dateTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="p-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Ubicación</h2>
            </div>
            <p className="text-white/80 text-lg mb-4">{event.ubication}</p>
          </div>

          {/* Mapa */}
          <div className="h-64 relative">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.google.com/maps?q=${encodeURIComponent(event.ubication)}&output=embed`}
              allowFullScreen
              className="rounded-b-2xl"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAttendance}
            className={`flex-1 text-white px-8 py-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-3 shadow-lg ${
              isAttending ? "bg-green-600 hover:bg-green-700" : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isAttending ? "Asistencia Confirmada" : "Confirmar Asistencia"}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-3 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Compartir Evento
          </button>
        </div>
      </main>
    </div>
  )
}
