import { useState } from "react";
import { Alert, Button, CircularProgress, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import WbSunnyRounded from "@mui/icons-material/WbSunnyRounded";
import InfoBox from "./InfoBox";
import "./SearchBox.css";

function weatherError(status, message = "") {
  if (status === 404) return "We couldn't find that city. Check the spelling and try again.";
  if (status === 401) return "The OpenWeather API key is invalid or not active yet. Check your key and activation status.";
  if (status === 429) return "Weather service rate limit reached. Please wait a moment and try again.";
  if (status >= 500) return "The weather service is temporarily unavailable. Please try again shortly.";
  return message || "Unable to load weather right now. Please try again.";
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const query = city.trim();
    if (!query) {
      setError("Enter a city name to see its current weather.");
      return;
    }

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();
    if (!apiKey) {
      setError("Weather search is ready, but it needs your OpenWeather API key. In mini-project/.env, replace the placeholder with your key: VITE_OPENWEATHER_API_KEY=your_key. Save the file and restart the dev server.");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: query, appid: apiKey, units: "metric" });
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`, { signal: controller.signal });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The weather service returned an unreadable response. Please try again.");
      }
      if (!response.ok) throw new Error(weatherError(response.status, data.message));
      if (!data.main || !data.weather?.[0]) throw new Error("Weather data was incomplete. Please try again.");

      setWeatherInfo({
        city: data.name,
        country: data.sys?.country,
        temp: data.main.temp,
        humidity: data.main.humidity,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        feelsLike: data.main.feels_like,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        wind: data.wind?.speed,
        pressure: data.main.pressure,
        visibility: data.visibility,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        timezone: data.timezone ?? 0,
      });
    } catch (requestError) {
      if (requestError.name === "AbortError") setError("The request took too long. Check your connection and try again.");
      else if (requestError instanceof TypeError) setError("Couldn't reach the weather service. Check your internet connection and try again.");
      else setError(requestError.message || "Unable to load weather right now. Please try again.");
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <main className="weather-page">
      <div className="weather-shell">
        <header className="app-header">
          <div className="brand-mark" aria-hidden="true"><WbSunnyRounded /></div>
          <div><p className="eyebrow">YOUR WEATHER, SIMPLIFIED</p><h1>WeatherNow</h1></div>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <p className="intro-kicker">A little clarity for your day</p>
          <h2 id="page-title">Your daily weather,<br className="desktop-break" /> at a glance.</h2>
          <p className="intro-copy">Find current conditions and plan what comes next.</p>
        </section>

        <section className="search-panel" aria-label="Search weather by city">
          <form className="search-form" onSubmit={handleSubmit} noValidate>
            <TextField
              className="city-input"
              label="Search for a city"
              placeholder="e.g. Delhi, London, Tokyo"
              value={city}
              onChange={(event) => { setCity(event.target.value); if (error) setError(""); }}
              disabled={loading}
              fullWidth
              inputProps={{ "aria-label": "City name" }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }}
            />
            <Button className="search-button" variant="contained" type="submit" disabled={loading}>
              {loading ? <><CircularProgress size={18} color="inherit" aria-label="Loading weather" /> <span>Searching</span></> : "Search"}
            </Button>
          </form>
          {error && <Alert className="search-alert" severity="error" role="alert">{error}</Alert>}
        </section>

        {weatherInfo ? <InfoBox info={weatherInfo} /> : (
          <section className="empty-state" aria-live="polite">
            <div className="empty-art" aria-hidden="true"><WbSunnyRounded /></div>
            <h3>{loading ? "Finding your forecast" : "The world, right outside"}</h3>
            <p>{loading ? "Checking the latest conditions…" : "Search for a city to see its current weather and useful details."}</p>
          </section>
        )}
        <footer className="page-footer">Weather data provided by OpenWeather</footer>
      </div>
    </main>
  );
}
