import { useEffect, useState } from "react";


export default function PublishEvent() {    
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


    useEffect(() => {
        const storedUser = localStorage.getItem("organizer");
        if (storedUser) {
            setOrganizer(JSON.parse(storedUser));
        }
    }, []);

    //Aqui ira el handler para crear el evento
    const handleEvent = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError("");

        if(!type) {
            setError("Por favor selecciona un tipo de evento");
            return;
        }

        const event = {
            title,
            description,
            dateTime,
            ubication,
            image,
            type
        };

        try {
            const res = await fetch("http://localhost:8080/api/eventos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify(event), 
            });

            if(res.ok) {
                setSuccess(true);
                setTitle("");
                setDescription("");
                setDateTime("");
                setUbication("");
                setImage("");
                setType("");
            }else {
                const msg = await res.text();
                setError(msg || "Error al crear el evento");
            }
        }catch (err) {
            setError("Error de conexión con el servidor");
        }

    }


return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-600 to-slate-900">
      {/* Header adaptado a tu estructura */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              {/* Logo de la App */}
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.078-1.343-4.243a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">LET'S PARTY</h1>
          </div>
          <a
            href="/events"
            className="text-white hover:bg-white/10 hidden sm:flex px-3 py-2 rounded-md transition-colors duration-200"
          >
            Ver eventos
          </a>
          
          
          
        </div>
        
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl">
          {/* Header del Card */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-white">Create Event</h2>
            </div>
            <p className="text-white/70">Fill in the details to create your amazing event</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleEvent}>
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-white font-medium">
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Add Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-white font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Add Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 resize-none"
                />
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <label htmlFor="datetime" className="block text-white font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Date & Time
                </label>
                <input
                  id="datetime"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-white font-medium flex items-center gap-2">
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
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="Add Location"
                  value={ubication}
                  onChange={(e) => setUbication(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label htmlFor="image" className="block text-white font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Image URL
                </label>
                <input
                  id="image"
                  type="text"
                  placeholder="Add Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-cyan-500 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Event Type Labels */}
              <div className="space-y-3">
                <label className="block text-white font-medium">Event Type</label>
                <div className="flex flex-wrap gap-2">
                  {labes.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setType(label)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
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
                <div className="flex items-center gap-2 p-4 rounded-lg border border-red-500 bg-red-500/10">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-500 font-semibold">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-4 rounded-lg border border-green-500 bg-green-500/10">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-green-500 font-semibold">{success} Se ha creado correctamente</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-600/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
              >
                POST
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
    );
}