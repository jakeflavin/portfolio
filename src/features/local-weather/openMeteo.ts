/**
 * Open-Meteo.com forecast API (no API key required).
 * @see https://open-meteo.com/en/docs
 */

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  precipitation: number;
  is_day: 0 | 1;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  wind_gusts_10m?: number;
  pressure_msl?: number;
  surface_pressure?: number;
  cloud_cover?: number;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  relative_humidity_2m: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  precipitation_sum: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: OpenMeteoCurrent;
  hourly: OpenMeteoHourly;
  daily: OpenMeteoDaily;
}

export interface OpenMeteoAirQualityCurrent {
  time: string;
  european_aqi?: number;
  us_aqi?: number;
  pm10?: number;
  pm2_5?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  ozone?: number;
}

export interface OpenMeteoAirQuality {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoAirQualityCurrent;
}

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const CURRENT_PARAMS =
  "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,surface_pressure,cloud_cover";
const HOURLY_PARAMS =
  "temperature_2m,apparent_temperature,precipitation_probability,precipitation,relative_humidity_2m,weather_code,wind_speed_10m";
const DAILY_PARAMS =
  "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max";
const AIR_QUALITY_PARAMS =
  "european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone";

export async function fetchForecast(lat: number, lon: number): Promise<OpenMeteoForecast> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    forecast_days: "10",
    timezone: "auto"
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

export async function fetchAirQuality(lat: number, lon: number): Promise<OpenMeteoAirQuality> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: AIR_QUALITY_PARAMS,
    timezone: "auto"
  });
  const res = await fetch(`${AIR_QUALITY_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo air quality error: ${res.status}`);
  return res.json();
}

/** WMO weather code to short label. */
export function weatherCodeLabel(code: number): string {
  const map: Record<number, string> = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Rain",
    65: "Heavy rain",
    80: "Rain showers",
    81: "Rain showers",
    82: "Violent showers",
    71: "Slight snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm + hail",
    99: "Thunderstorm + heavy hail"
  };
  return map[code] ?? "Unknown";
}

/** Icon key for mapping to SVG component (sun, sun-cloud, clouds, etc.). */
export type WeatherIconKey =
  | "sun"
  | "moon"
  | "sun-cloud"
  | "clouds"
  | "sun-haze"
  | "cloud-drizzle"
  | "cloud-sun-rain"
  | "cloud-bolt"
  | "cloud-bolt-sun"
  | "cloud-hail";

/** Map WMO code and is_day (1 = day) to icon key. */
export function weatherCodeToIconKey(code: number, isDay: 0 | 1): WeatherIconKey {
  const night = isDay === 0;
  if (code === 0) return night ? "moon" : "sun";
  if (code === 1 || code === 2) return "sun-cloud";
  if (code === 3) return "clouds";
  if (code === 45 || code === 48) return "sun-haze";
  if (code >= 51 && code <= 55) return "cloud-drizzle";
  if (code >= 61 && code <= 65 || code >= 80 && code <= 82) return "cloud-sun-rain";
  if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return "clouds";
  if (code === 95) return night ? "cloud-bolt" : "cloud-bolt-sun";
  if (code === 96 || code === 99) return "cloud-hail";
  return "sun-cloud";
}

/**
 * Heuristic rainbow probability (Open-Meteo has no rainbow API).
 * Rain showers + some sun = possible rainbow.
 */
export function getRainbowProbability(
  precipitationProbabilityMax: number,
  weatherCode: number
): "Low" | "Possible" | "Likely" {
  const isShowersOrRain = [2, 80, 81, 82, 61, 63, 65].includes(weatherCode);
  const hasSomeSun = [1, 2, 80, 81, 82].includes(weatherCode);
  const precip = precipitationProbabilityMax;

  if (hasSomeSun && precip >= 30 && precip <= 85) {
    return isShowersOrRain && precip >= 40 ? "Likely" : "Possible";
  }
  return "Low";
}
