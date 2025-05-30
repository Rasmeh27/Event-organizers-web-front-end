"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState({
    title: "",
    description: "",
    dateTime: "",
    ubication: "",
    image: "",
    type: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Estado para el menú de usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Usuario actual
  const currentUser = {
    name: "María González",
    email: "maria@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MG",
  }

  // Array de tipos de evento
  const eventTypes = ["Free", "Concert", "OpenBar", "Special Guest", "VIP", "Cover"]

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/eventos/${id}`)
      .then((res) => {
        setEvent(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error al obtener evento:", error)
        setError("Error al cargar el evento")
        setLoading(false)
      })
  }, [id])

  // Funciones del menú de usuario
  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("organizer")
    sessionStorage.clear()
    setIsUserMenuOpen(false)
    alert("Sesión cerrada exitosamente")
    navigate("/login", { replace: true })
  }

  const handleProfile = () => {
    setIsUserMenuOpen(false)
    navigate("/profile")
  }

  const handleSettings = () => {
    setIsUserMenuOpen(false)
    navigate("/settings")
  }

  const handleViewEvents = () => {
    setIsUserMenuOpen(false)
    navigate("/home")
  }

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value })
    setError("")
  }

  const handleTypeSelect = (type) => {
    setEvent({ ...event, type })
    setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    if (!event.type) {
      setError("Por favor selecciona un tipo de evento")
      setSaving(false)
      return
    }

    axios
      .put(`http://localhost:8080/api/eventos/${id}`, event)
      .then(() => {
        setSaving(false)
        setSuccess(true)
        setTimeout(() => {
          navigate("/MyEvents")
        }, 1500)
      })
      .catch((error) => {
        console.error("Error al actualizar evento:", error)
        setError("Error al actualizar el evento")
        setSaving(false)
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando evento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header con usuario */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-[100]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.078-1.343-4.243a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-xl sm:text-2xl font-bold text-white tracking-tight hover:text-cyan-400 transition-colors duration-200"
            >
              LET'S PARTY
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
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

            {/* Ver eventos */}
            <button
              onClick={handleViewEvents}
              className="text-white hover:bg-white/10 hidden sm:flex px-3 py-2 rounded-md transition-colors duration-200 text-sm cursor-pointer"
            >
              Ver eventos
            </button>

            {/* Crear evento */}
            <button
              onClick={() => navigate("/publish")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium hidden sm:flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Evento
            </button>

            {/* Perfil de Usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-md transition-colors duration-200"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-cyan-400 bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">{currentUser.initials}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-white/70">Usuario</p>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menú desplegable */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800/98 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-[9999]">
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-white/70">{currentUser.email}</p>
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
                      onClick={handleViewEvents}
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

                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
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

                  <div className="border-t border-white/20 py-1">
                    <button
                      onClick={() => {
                        if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                          handleLogout()
                        }
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
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

      {/* Overlay para cerrar el menú */}
      {isUserMenuOpen && <div className="fixed inset-0 z-[9998]" onClick={() => setIsUserMenuOpen(false)}></div>}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-white/60">
            <button onClick={() => navigate("/home")} className="hover:text-cyan-400 transition-colors">
              Inicio
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => navigate("/MyEvents")} className="hover:text-cyan-400 transition-colors">
              Mis Eventos
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-cyan-400">Editar Evento</span>
          </nav>
        </div>

        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl">
          {/* Header del Card */}
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Editar Evento</h1>
            </div>
            <p className="text-white/70 text-sm sm:text-base">Modifica los detalles de tu evento</p>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-white font-medium text-sm sm:text-base">
                  Título del Evento
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ingresa el título de tu evento..."
                  value={event.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent" }}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-white font-medium text-sm sm:text-base">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe tu evento..."
                  value={event.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                  style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent" }}
                />
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <label
                  htmlFor="dateTime"
                  className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Fecha y Hora
                </label>
                <input
                  id="dateTime"
                  name="dateTime"
                  type="datetime-local"
                  value={event.dateTime ? new Date(event.dateTime).toISOString().slice(0, 16) : ""}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent" }}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="ubication"
                  className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base"
                >
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
                  Ubicación
                </label>
                <input
                  id="ubication"
                  name="ubication"
                  type="text"
                  placeholder="Ingresa la ubicación del evento..."
                  value={event.ubication}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent" }}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  URL de Imagen del Evento
                </label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={event.image}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{ WebkitAppearance: "none", WebkitTapHighlightColor: "transparent" }}
                />
              </div>

              {/* Event Type Labels */}
              <div className="space-y-3">
                <label className="block text-white font-medium text-sm sm:text-base">Tipo de Evento</label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        event.type === type
                          ? "bg-cyan-600 text-white border-2 border-cyan-600 shadow-lg shadow-cyan-600/25"
                          : "bg-transparent text-cyan-400 border-2 border-cyan-400 hover:border-cyan-300 hover:text-cyan-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg border border-red-500 bg-red-500/10">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-500 font-semibold text-sm sm:text-base">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg border border-green-500 bg-green-500/10">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-green-500 font-semibold text-sm sm:text-base">
                    Evento actualizado correctamente. Redirigiendo...
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/events")}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-600/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </div>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
