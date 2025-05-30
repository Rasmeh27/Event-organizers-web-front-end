"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    description: "",
    dateTime: "",
    ubication: "",
    image: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/eventos/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener evento:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .put(`http://localhost:8080/api/eventos/${id}`, event)
      .then(() => {
        setSaving(false);
        navigate("/MyEvents"); // Redirige a la página de eventos después de guardar
      })
      .catch((error) => {
        console.error("Error al actualizar evento:", error);
        setSaving(false);
      });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-10">
        
      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-xl bg-slate-800 p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Editar Evento</h1>

        <label className="block text-white mb-2">Título</label>
        <input
          name="title"
          type="text"
          value={event.title}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          required
        />

        <label className="block text-white mb-2">Descripción</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          required
        ></textarea>

        <label className="block text-white mb-2">Fecha y hora</label>
        <input
          name="dateTime"
          type="datetime-local"
          value={new Date(event.dateTime).toISOString().slice(0,16)}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          required
        />

        <label className="block text-white mb-2">Ubicación</label>
        <input
          name="ubication"
          type="text"
          value={event.ubication}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          required
        />

        <label className="block text-white mb-2">Imagen (URL)</label>
        <input
          name="image"
          type="url"
          value={event.image}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        />

        <label className="block text-white mb-2">Tipo</label>
        <select
          name="type"
          value={event.type}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-6"
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="Free">Free</option>
          <option value="Concert">Concert</option>
          <option value="OpenBar">OpenBar</option>
          <option value="Special Guest">Special Guest</option>
          <option value="VIP">VIP</option>
          <option value="Cover">Cover</option>
        </select>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 w-full font-medium"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}