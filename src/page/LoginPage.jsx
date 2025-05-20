import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password}),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("usuario", JSON.stringify(data));
        window.location.href = "/publish"; // redirige a la página principal del organizador
      } else {
        const errMsg = await res.text();
        setError(errMsg || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background-gif/login-party.jpg')" }}
    >
      <div className="bg-black/70 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-pink-500">
        <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 mb-2">
          LET’S PARTY
        </h1>
        <h2 className="text-center text-xl text-white mb-6">Log In</h2>

        <form className="space-y-4 text-white" onSubmit={handleLogin}>

          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-2 rounded border outline-none bg-transparent border-gray-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 p-2 rounded border outline-none bg-transparent border-gray-500"
            />
            <span
              onClick={togglePassword}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-400"
            >
              👁️
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded cursor-pointer transition duration-300 ease-in-out"
          >
            Acceder
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
         No tienes una cuenta?{" "}
          <a href="/register" className="text-white font-semibold underline">
            Registrate
          </a>
        </p>
      </div>
    </div>
  );
}
