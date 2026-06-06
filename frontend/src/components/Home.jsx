import { useEffect, useRef, useState } from "react";
import { Search, MapPin, Droplets, Cloud, Compass, AlertCircle } from "lucide-react";
import image from '../assets/image.png';

function RainCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initDrops();
    };

    const createDrop = (randomY = false) => ({
      x: Math.random() * (canvas.width + 200) - 100,
      y: randomY ? Math.random() * canvas.height : -Math.random() * canvas.height * 0.4,
      length: Math.random() * 36 + 24,
      speed: Math.random() * 5 + 9,
      drift: Math.random() * 1.1 + 0.35,
      opacity: Math.random() * 0.22 + 0.06,
      width: Math.random() * 2.0 + 0.6,
    });

    const initDrops = () => {
      dropsRef.current = Array.from({ length: 110 }, () => createDrop(true));
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach((drop, i) => {
        const tailX = drop.x - drop.drift * (drop.length / drop.speed) * 0.55;
        const tailY = drop.y + drop.length;

        const gradient = ctx.createLinearGradient(drop.x, drop.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(195, 222, 242, ${drop.opacity * 0.28})`);
        gradient.addColorStop(0.3, `rgba(205, 228, 246, ${drop.opacity})`);
        gradient.addColorStop(1, `rgba(175, 208, 235, 0)`);

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = drop.width;
        ctx.lineCap = "round";
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= drop.drift * 0.5;

        if (drop.y - drop.length > canvas.height || drop.x < -100) {
          dropsRef.current[i] = createDrop(false);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

export default function RainyScene() {
  const [loaded, setLoaded] = useState(false);
  const [inputCity, setInputCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!inputCity.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: inputCity }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setWeatherData(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#08100d",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Background Road Image */}
        <img
          src={image}
          alt="Rainy countryside road"
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(0.6) saturate(0.9) contrast(1.04)",
            display: "block",
          }}
        />

        {/* Overcast blue tint overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(30, 50, 75, 0.2)",
            pointerEvents: "none",
          }}
        />

        {/* Canvas animated raindrops overlay */}
        {loaded && <RainCanvas />}

        {/* GLASSMORPHIC CONTAINER CARD OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md backdrop-blur-xl bg-zinc-950/40 border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-white flex flex-col gap-6">
            
            {/* Search Section */}
            <form onSubmit={handlePredict} className="flex gap-2">
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="Enter City (e.g. London)..."
                className="flex-grow bg-white/10 border border-white/10 text-sm rounded-2xl py-2.5 px-4 text-white placeholder-white/50 focus:outline-none focus:border-white/30 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-3 bg-white/20 hover:bg-white/30 active:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 flex gap-2 items-center text-xs text-red-300">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Weather Metrics display */}
            {weatherData ? (
              <div className="flex flex-col gap-5">
                {/* Location & Temp */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-1.5">
                      <MapPin size={18} className="text-white/60" />
                      {weatherData.city}
                    </h2>
                    <p className="text-xs text-white/55 capitalize mt-0.5">{weatherData.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-light tracking-tight">{weatherData.temp}°</span>
                    <span className="text-sm align-top">C</span>
                  </div>
                </div>

                {/* Prediction Output */}
                <div 
                  className="rounded-2xl p-4 flex flex-col gap-2 border" 
                  style={{ 
                    backgroundColor: `${weatherData.prediction.color}15`, 
                    borderColor: `${weatherData.prediction.color}40` 
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Rain Probability</span>
                    <span 
                      className="text-lg font-bold"
                      style={{ color: weatherData.prediction.color }}
                    >
                      {weatherData.prediction.probability}%
                    </span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${weatherData.prediction.probability}%`, 
                        backgroundColor: weatherData.prediction.color 
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-white/60 font-medium mt-1">
                    Risk Assessment: {weatherData.prediction.classification}
                  </span>
                </div>

                {/* Weather Variables Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1">
                    <Droplets size={16} className="text-white/40" />
                    <span className="text-[10px] text-white/50">Humidity</span>
                    <span className="font-semibold">{weatherData.humidity}%</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1">
                    <Compass size={16} className="text-white/40" />
                    <span className="text-[10px] text-white/50">Pressure</span>
                    <span className="font-semibold">{weatherData.pressure} hPa</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1">
                    <Cloud size={16} className="text-white/40" />
                    <span className="text-[10px] text-white/50">Cloud Cover</span>
                    <span className="font-semibold">{weatherData.clouds}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center text-white/40">
                <Cloud size={32} className="animate-bounce mb-2" />
                <p className="text-sm font-medium">No telemetry loaded</p>
                <p className="text-[11px] text-white/30 mt-1">Submit a city above to inspect atmospheric rain index</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
