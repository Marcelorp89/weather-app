import { useState } from "react";
import "./App.css";

function App() {
  const [ciudad, setCiudad] = useState("");
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const buscarClima = async () => {
    if (!ciudad.trim()) return;

    setCargando(true);
    setError(null);
    setClima(null);

    try {
      const respuesta = await fetch(`https://weather-app-backend-qhog.onrender.com/clima/${ciudad}`);
      const datos = await respuesta.json();

      if (datos.detail) {
        setError("Ciudad no encontrada 😕");
      } else {
        setClima(datos);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor 🔌");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") buscarClima();
  };

  const obtenerColorFondo = (temp) => {
    if (temp >= 25) return "linear-gradient(135deg, #e17055, #d63031)";
    if (temp >= 15) return "linear-gradient(135deg, #fdcb6e, #e17055)";
    if (temp >= 5)  return "linear-gradient(135deg, #74b9ff, #0984e3)";
    if (temp >= 0)  return "linear-gradient(135deg, #a29bfe, #022c4b)";
    return "linear-gradient(135deg, #dfe6e9, #2d3436)";
  };

  return (
    <div
      className="app"
      style={{ background: clima ? obtenerColorFondo(clima.temperatura) : "linear-gradient(300deg, #2c3e50, #3d5166)" }}
    >
      <h1>🌤️ Capas</h1>
      <p className="subtitulo">El clima, traducido a tu armario</p>

      <div className="buscador">
        <input
          type="text"
          placeholder="Ej: Santiago, Buenos Aires, Madrid..."
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={buscarClima}>Ver mis capas de hoy</button>
      </div>

      {cargando && <p className="mensaje">Leyendo el cielo... ⏳</p>}
      {error && <p className="mensaje error">{error}</p>}

      {clima ? (
        <div className="tarjeta">
          <h2>{clima.ciudad}</h2>
          <p className="temperatura">{clima.temperatura}°C</p>
          <p className="descripcion">{clima.descripcion}</p>

          <div className="detalles">
            <span>💧 Humedad: {clima.humedad}%</span>
            <span>💨 Viento: {clima.viento} m/s</span>
          </div>

          <div className="ropa">
            <h3>Capas sugiere</h3>
            <p>{clima.ropa}</p>
          </div>
        </div>
      ) : (
        !cargando && !error && (
          <div className="tarjeta vacia">
            <p className="icono-vacio">🌍</p>
            <p className="texto-vacio">Busca una ciudad y descubre cuántas capas necesitas hoy</p>
          </div>
        )
      )}

      <a
        href="https://manotech.cl"
        target="_blank"
        rel="noopener noreferrer"
        className="firma"
      >
        Elaborado por ManoTech
      </a>

    </div>
  );
}

export default App;
