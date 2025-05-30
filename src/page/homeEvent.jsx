"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HomeEvent() {
  const [events, setEvents] = useState([])
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [organizer, setOrganizer] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("organizer")
    console.log("Valor de localStorage:", storedUser)

    if (storedUser) {
      const organizerData = JSON.parse(storedUser)
      const organizerId = organizerData.id

      // Obtener información del organizador para el perfil
      if (organizerId) {
        fetch(`http://localhost:8080/api/auth/organizer/${organizerId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Error al obtener datos del organizador")
            return res.json()
          })
          .then((data) => {
            console.log("Datos recibidos de la API:", data)
            setOrganizer(data)
          })
          .catch((err) => {
            console.error("Error:", err)
            setOrganizer(null)
          })
      }
    }

    // Obtener TODOS los eventos (de todos los usuarios)
    fetch(`http://localhost:8080/api/eventos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener todos los eventos")
        return res.json()
      })
      .then((data) => {
        console.log("Todos los eventos:", data)
        setEvents(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener eventos:", err)
        setEvents([])
        setLoading(false)
      })
  }, [])

  const getInitials = (nombre, apellido) => {
    if (!nombre || !apellido) return ""
    return `${nombre[0]}${apellido[0]}`.toUpperCase()
  }

  const Navigate = useNavigate()

  // Funciones del menú de usuario
  const handleLogout = () => {
    localStorage.removeItem("organizer")
    sessionStorage.clear()
    setIsUserMenuOpen(false)
    alert("Sesión cerrada exitosamente")
    window.location.href = "/login"
  }

  const handleProfile = () => {
    setIsUserMenuOpen(false)
    Navigate("/profile")
  }

  const handleSettings = () => {
    setIsUserMenuOpen(false)
    window.location.href = "/settings"
  }

  const handleMyEvents = () => {
    setIsUserMenuOpen(false)
    Navigate("/myevents")
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

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "Free":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414L15.414 8H9a1 1 0 01-1-1V5z" />
          </svg>
        )
      case "Concert":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header con usuario */}
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
              className="text-white hover:bg-white/10 hidden sm:flex px-3 py-2 rounded-md transition-colors duration-200 text-sm"
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
                {/* Avatar */}
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

              {/* Menú desplegable del usuario - Ahora con Portal */}
              {isUserMenuOpen && (
                <div
                  className="absolute inset-1 flex items-start pt-16 z-[999]"
                  onClick={(e) => {
                    // Solo cerrar si se hace clic en el fondo, no en el menú
                    if (e.target === e.currentTarget) {
                      setIsUserMenuOpen(false)
                    }
                  }}
                >
                  <div className="w-56 bg-slate-800/98 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl">
                    {/* Header del menú */}
                    <div className="px-4 py-3 border-b border-white/20">
                      <p className="text-sm font-medium text-white">
                        {organizer ? `${organizer.nombre} ${organizer.apellido}` : "Cargando..."}
                      </p>
                      <p className="text-xs text-white/70">{organizer ? organizer.email : ""}</p>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-1">
                      <button
                        onClick={handleProfile}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
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
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
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

                      <button
                        onClick={handleSettings}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                      >
                        <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..."
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Configuración
                      </button>
                    </div>

                    {/* Cerrar sesión */}
                    <div className="border-t border-white/20 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                            handleLogout()
                          }
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200 cursor-pointer"
                      >
                        <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0..."
                          />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header de la página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h1 className="text-4xl font-bold text-white">Todos los Eventos</h1>
          </div>
          <p className="text-white/70 text-lg">Descubre todos los eventos disponibles creados por la comunidad</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          /* Grid de eventos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <svg
                  className="w-16 h-16 text-white/30 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-white/70 mb-2">No hay eventos disponibles</h3>
                <p className="text-white/50 mb-6">Aún no hay eventos publicados por la comunidad</p>
                <a
                  href="/publish"
                  className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Primer Evento
                </a>
              </div>
            ) : (
              events.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Imagen del evento */}
                  {evento.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={evento.image || "/placeholder.svg"}
                        alt={evento.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=200&width=400"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      {/* Badge del tipo de evento */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white ${getEventTypeColor(
                            evento.type,
                          )}`}
                        >
                          {getEventTypeIcon(evento.type)}
                          {evento.type}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contenido del evento */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">{evento.title}</h2>
                    <p className="text-white/70 mb-4 line-clamp-2">{evento.description}</p>

                    {/* Información del organizador */}
                    {evento.organizerName && (
                      <div className="flex items-center gap-2 text-white/60 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-sm">Organizado por: {evento.organizerName}</span>
                      </div>
                    )}

                    {/* Detalles del evento */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-white/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">{new Date(evento.dateTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <span className="text-sm">{evento.ubication}</span>
                      </div>
                    </div>

                    {/* Botón para ver más detalles */}
                    <button
                      onClick={() => Navigate(`/event/${evento.id}`)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
