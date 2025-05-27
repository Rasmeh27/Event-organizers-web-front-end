import React, {useEffect, useState} from "react";
import axios from "axios";

export default function ViewEventPage() {
    const [event, setEvent] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios.get("http://localhost:8080/api/eventos")
            .then(response => setEvent(response.data))
            .catch(error => console.error("Error al mostrar eventos:", error));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/eventos/${id}`);
            setEvent(event.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error al eliminar evento:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-600 to-slate-900">
            <h1 className="text-3xl font-bold mb-6 text-white">Eventos publicados</h1>
            <a href="/publish" className="text-blue-500 ">Publicar evento</a>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.map((evento) => (
                    <div key={evento.id} className="bg-white rounded-xl shadow-md p-4">
                        {evento.image && (
                            <img
                                src={evento.image}
                                className="w-full h-48 object-cover rounded-t-xl mb-4"
                            />
                        )}
                        <h2 className="text-xl font-semibold mb-2">{evento.title}</h2>  
                        <p className="text-gray-700 mb-2">{evento.description}</p>
                        <p className="text-gray-500 mb-2">Fecha: {new Date(evento.dateTime).toLocaleString()}</p>
                        <p className="text-gray-500 mb-2">Ubicación: {evento.ubication}</p>
                        <p className="text-gray-500 mb-2">Tipo: {evento.type}</p>
                        <button
                            onClick={() => handleDelete(evento.id)}
                            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}