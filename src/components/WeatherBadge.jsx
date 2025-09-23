import { useEffect, useState } from "react";
import i18n from "../i18n";

const FALLBACK = { lat: 28.6139, lon: 77.2090 }; // Delhi

export default function WeatherBadge() {
  const [state, setState] = useState({ loading: true });

  async function fetchWeather(lat, lon) {
    try {
      const lang = i18n.resolvedLanguage || "en";
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&lang=${lang}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Weather failed");
      setState({ loading: false, data });
    } catch (err) {
      setState({ loading: false, error: err.message });
    }
  }

  useEffect(() => {
    // try geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(FALLBACK.lat, FALLBACK.lon),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      fetchWeather(FALLBACK.lat, FALLBACK.lon);
    }
  }, []);

  // Re-fetch if language changes (for text localization later)
  useEffect(() => {
    const h = (lng) => {
      const d = state.data;
      if (d && d.lat && d.lon) fetchWeather(d.lat, d.lon);
    };
    i18n.on("languageChanged", h);
    return () => i18n.off("languageChanged", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data?.lat, state.data?.lon]);

  if (state.loading) {
    return <div className="weather-badge" aria-busy="true">…</div>;
  }
  if (state.error) {
    return <div className="weather-badge" title={state.error}>—</div>;
  }
  const { tempC, icon, text } = state.data || {};
  return (
    <div className="weather-badge" title={text}>
      <span className="ic">{icon || "🌤️"}</span>
      {typeof tempC === "number" ? <span className="t">{tempC}°</span> : <span className="t">—</span>}
    </div>
  );
}
