"use client";

import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PublishEvent() {
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);

  //Campos del formulario para crear un evento
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [ubication, setUbication] = useState("");
  const [image, setImage] = useState(""); //por el momento sera URL
  const [type, setType] = useState("");
  const labes = ["cover", "Free", "concert", "OpenBar", "Special Guest", "VIP"];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Estado para el menú de usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem("organizer");
  console.log("Valor de localStorage:", storedUser);

  if (storedUser) {
    const organizerData = JSON.parse(storedUser);
    const organizerId = organizerData.id;
    console.log("ID del organizador:", organizerId);

    if (organizerId) {
      fetch(`http://localhost:8080/api/auth/organizer/${organizerId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener datos");
          return res.json();
        })
        .then((data) => {
          console.log("Datos recibidos de la API:", data);
          setOrganizer(data);
        })
        .catch((err) => {
          console.error("Error:", err);
          setOrganizer(null);
        });
    }
  }
}, []);



  const getInitials = (nombre, apellido) => {
    if (!nombre || !apellido) return "";
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  };

  // Funciones del menú de usuario - ADAPTADAS A REACT ROUTER
  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("organizer");
    sessionStorage.clear();

    // Cerrar el menú
    setIsUserMenuOpen(false);

    // Mostrar mensaje de confirmación (opcional)
    alert("Sesión cerrada exitosamente");

    // Redirigir al login usando React Router
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    setIsUserMenuOpen(false);
    // Redirigir al perfil usando React Router
    navigate("/profile");
  };

  const handleSettings = () => {
    setIsUserMenuOpen(false);
    // Redirigir a configuración usando React Router
    navigate("/settings");
  };

  const handleViewEvents = () => {
    setIsUserMenuOpen(false);
    // Redirigir a eventos usando React Router
    navigate("/events");
  };

  //Aqui ira el handler para crear el evento
  const handleEvent = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    if (!type) {
      setError("Por favor selecciona un tipo de evento");
      return;
    }

    const event = {
      title,
      description,
      dateTime,
      ubication,
      image,
      type,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/eventos?organizerId=${organizer.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (res.ok) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setDateTime("");
        setUbication("");
        setImage("");
        setType("");

        // Opcional: redirigir a la lista de eventos después de crear
        setTimeout(() => {
          navigate("/events");
        }, 2000);
      } else {
        const msg = await res.text();
        setError(msg || "Error al crear el evento");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header con usuario - Z-INDEX MEJORADO */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-[100]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              {/* Logo de la App */}
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Ver eventos - USANDO REACT ROUTER */}
            <button
              onClick={handleViewEvents}
              className="text-white hover:bg-white/10 hidden sm:flex px-3 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              Ver eventos
            </button>

            {/* Perfil de Usuario - RESPONSIVE MEJORADO */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 px-2 sm:px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-cyan-400 bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {organizer
                      ? getInitials(organizer.nombre, organizer.apellido)
                      : "?"}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">
                    {organizer
                      ? `${organizer.nombre} ${organizer.apellido}`
                      : "Cargando..."}
                  </p>
                  <p className="text-xs text-white/70">Organizador</p>
                </div>
              </button>

              {/* Menú desplegable - TODAS LAS NAVEGACIONES CON REACT ROUTER */}
              {/* Overlay para cerrar el menú - DEBE IR ANTES DEL MENÚ */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800/98 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-[9999]">
                  {/* Header del menú */}
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-medium text-white">
                      {organizer
                        ? `${organizer.nombre} ${organizer.apellido}`
                        : "Cargando..."}
                    </p>
                    <p className="text-xs text-white/70">
                      {organizer ? organizer.email : ""}
                    </p>
                  </div>

                  {/* Opciones */}
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg
                        className="mr-3 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      <svg
                        className="mr-3 h-4 w-4"
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
                      Mis Eventos
                    </button>

                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg
                        className="mr-3 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "¿Estás seguro de que quieres cerrar sesión?"
                          )
                        ) {
                          handleLogout();
                        }
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200 cursor-pointer"
                    >
                      <svg
                        className="mr-3 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para cerrar el menú - Z-INDEX CORRECTO */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-[99]"
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}

      {/* Main Content - Z-INDEX BAJO */}
      <main className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Crear Evento
              </h2>
            </div>
            <p className="text-white/70 text-sm sm:text-base">
              Completa los detalles para crear tu evento increíble
            </p>
          </div>

          {/* Form Content - CAMPOS MEJORADOS PARA RESPONSIVE */}
          <div className="p-4 sm:p-6">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleEvent}>
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-white font-medium text-sm sm:text-base"
                >
                  Título del Evento
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ingresa el título de tu evento..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{
                    WebkitAppearance: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-white font-medium text-sm sm:text-base"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  placeholder="Describe tu evento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                  style={{
                    WebkitAppearance: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                />
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <label
                  htmlFor="datetime"
                  className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4"
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
                  Fecha y Hora
                </label>
                <input
                  id="datetime"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{
                    WebkitAppearance: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  id="location"
                  type="text"
                  placeholder="Ingresa la ubicación del evento..."
                  value={ubication}
                  onChange={(e) => setUbication(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{
                    WebkitAppearance: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-white font-medium flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  type="text"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  style={{
                    WebkitAppearance: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                />
              </div>

              {/* Event Type Labels */}
              <div className="space-y-3">
                <label className="block text-white font-medium text-sm sm:text-base">
                  Tipo de Evento
                </label>
                <div className="flex flex-wrap gap-2">
                  {labes.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setType(label)}
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        type === label
                          ? "bg-cyan-600 text-white border-2 border-cyan-600 shadow-lg shadow-cyan-600/25"
                          : "bg-transparent text-cyan-400 border-2 border-cyan-400 hover:border-cyan-300 hover:text-cyan-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg border border-red-500 bg-red-500/10">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-500 font-semibold text-sm sm:text-base">
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg border border-green-500 bg-green-500/10">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-green-500 font-semibold text-sm sm:text-base">
                    Evento creado correctamente. Redirigiendo...
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-600/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
              >
                CREAR EVENTO
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
