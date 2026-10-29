import AirRounded from "@mui/icons-material/AirRounded";
import CompressRounded from "@mui/icons-material/CompressRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import WbTwilightRounded from "@mui/icons-material/WbTwilightRounded";
import "./InfoBox.css";

const round = (value) => Math.round(value);
const localTime = (timestamp, offset) => new Date((timestamp + offset) * 1000).toLocaleTimeString("en", { timeZone: "UTC", hour: "numeric", minute: "2-digit" });

function Metric({ icon, label, value }) {
  return <div className="metric-card"><div className="metric-icon" aria-hidden="true">{icon}</div><div><p className="metric-label">{label}</p><p className="metric-value">{value}</p></div></div>;
}

export default function InfoBox({ info }) {
  const iconUrl = `https://openweathermap.org/img/wn/${info.icon}@2x.png`;
  return (
    <section className="weather-results" aria-label={`Current weather in ${info.city}`} aria-live="polite">
      <article className="current-weather">
        <div className="current-topline"><span className="live-dot" /> CURRENT WEATHER</div>
        <div className="current-location">
          <h3>{info.city}{info.country ? `, ${info.country}` : ""}</h3>
          <p>{info.description}</p>
        </div>
        <div className="temperature-row">
          <img className="condition-icon" src={iconUrl} alt={info.condition} />
          <p className="temperature">{round(info.temp)}<span>°</span></p>
          <span className="temperature-unit">C</span>
        </div>
        <p className="feels-like">Feels like {round(info.feelsLike)}° <span>·</span> {info.condition}</p>
        <div className="high-low"><span>H {round(info.tempMax)}°</span><span>L {round(info.tempMin)}°</span><span>Humidity {info.humidity}%</span></div>
      </article>

      <div className="details-heading"><div><p className="eyebrow">THE DETAILS</p><h3>More for your day</h3></div><p className="units-note">Local conditions</p></div>
      <div className="metrics-grid">
        {info.wind != null && <Metric icon={<AirRounded />} label="Wind" value={`${info.wind} m/s`} />}
        {info.pressure != null && <Metric icon={<CompressRounded />} label="Pressure" value={`${info.pressure} hPa`} />}
        {info.visibility != null && <Metric icon={<VisibilityRounded />} label="Visibility" value={`${(info.visibility / 1000).toFixed(1)} km`} />}
        {info.sunrise != null && <Metric icon={<WbTwilightRounded />} label="Sunrise" value={localTime(info.sunrise, info.timezone)} />}
        {info.sunset != null && <Metric icon={<WbTwilightRounded />} label="Sunset" value={localTime(info.sunset, info.timezone)} />}
      </div>
    </section>
  );
}
