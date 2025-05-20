import React, {useEffect, useState} from "react";
import axios from "axios";


export default function ViewEventPage() {
    const [event, setEvent] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:8080/api/eventos")
        .then(response => setEvent(response.data))
        .catch(error => console.error("Error al mostrar eventos:", error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Eventos publicados</h1>
            <a href="/publish">Publicar evento</a>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.map((evento) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-md p-4">
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
                    </div>
                ))}
            </div>
        </div>
    );
}