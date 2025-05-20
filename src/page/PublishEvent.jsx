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
    <div className="min-h-screen bg-gray-900 text-white p-4">
        <header className="flex justify-between items-center mb-6">
            <div className="text-3xl font-bold text-gradient">LET'S PARTY</div>
            <div className="rounded-full bg-white text-black px-4 py-1 font-semibold">
                {organizer?.nombre || "Invitado"}
            </div>
            <a href="/events">Ver eventos</a>
        </header>

        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        
    <form className="space-y-4 text-white" onSubmit={handleEvent}>
        <input 
        type="text"
        placeholder="Add Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 rounded bg-gray-800 border border-cyan-500" 
        />

        <textarea 
        placeholder="Add Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-2 rounded bg-gray-800 border border-cyan-500"
        />

        <input type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
        className="w-full p-2 rounded bg-gray-500 border border-cyan-500"
        />

        <input type="text"
        placeholder="Add Location"
        value={ubication}
        onChange={(e) => setUbication(e.target.value)}
        required
        className="w-full p-2 rounded bg-gray-500 border border-cyan-500" 
        />

        <input type="text"
        placeholder="Add Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required    
        className="w-full p-2 rounded bg-gray-500 border border-cyan-500"
        />

          <div className="flex flex-wrap gap-2">
          {labes.map((label) => (
            <button
              type="button"
              key={label}
              onClick={() => setType(label)}
              className={`border px-3 py-1 rounded-full text-sm ${
                type === label
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-transparent text-cyan-400 border-cyan-400"
              } transition duration-200`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {success && <p className="text-green-500 font-semibold">Evento creado</p>}
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 p-2 w-full rounded font-bold cursor-pointer transition duration-300 ease-in-out">
            POST
          </button>
    </form>
</div>
    );
}