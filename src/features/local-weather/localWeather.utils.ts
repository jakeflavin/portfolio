import { weatherCodeLabel, type OpenMeteoForecast } from "./openMeteo";

export function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "numeric" });
  } catch {
    return iso;
  }
}

export function formatFullTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function formatWeekday(iso: string): string {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString([], { weekday: "long" });
  } catch {
    return iso;
  }
}

export function formatShortWeekday(iso: string): string {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString([], { weekday: "short" });
  } catch {
    return iso;
  }
}

export function getUvLevel(value: number): string {
  if (value <= 2) return "Low";
  if (value <= 5) return "Moderate";
  if (value <= 7) return "High";
  return "Very high";
}

export function getAirQualityLabel(value?: number): string {
  if (value == null) return "Unavailable";
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy for sensitive groups";
  if (value <= 200) return "Unhealthy";
  return "Very unhealthy";
}

export function getWindDirectionLabel(degrees?: number): string {
  if (degrees == null) return "Variable";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % directions.length];
}

export function getPossibleRainSoon(data: OpenMeteoForecast): {
  label: string;
  detail: string;
  probability: number;
} {
  const now = new Date(data.current.time).getTime();
  const nextHours = data.hourly.time
    .map((time, index) => ({
      time,
      index,
      timestamp: new Date(time).getTime(),
      probability: data.hourly.precipitation_probability[index] ?? 0,
      precipitation: data.hourly.precipitation[index] ?? 0
    }))
    .filter((hour) => hour.timestamp >= now)
    .slice(0, 6);

  const wetHour = nextHours.find((hour) => hour.probability >= 40 || hour.precipitation > 0);
  const maxProbability = Math.max(...nextHours.map((hour) => hour.probability), 0);

  if (!wetHour) {
    return {
      label: "Not soon",
      detail: `${maxProbability}% highest chance in the next 6 hours.`,
      probability: maxProbability
    };
  }

  return {
    label: "Possible",
    detail: `${wetHour.probability}% around ${formatTime(wetHour.time)}.`,
    probability: wetHour.probability
  };
}

export function getHourlyForecast(data: OpenMeteoForecast) {
  const now = new Date(data.current.time).getTime();
  return data.hourly.time
    .map((time, index) => ({
      time,
      label: formatTime(time),
      temperature: Math.round(data.hourly.temperature_2m[index] ?? 0),
      feelsLike: Math.round(data.hourly.apparent_temperature[index] ?? 0),
      precipitationProbability: data.hourly.precipitation_probability[index] ?? 0,
      weatherCode: data.hourly.weather_code[index] ?? 0,
      windSpeed: Math.round(data.hourly.wind_speed_10m[index] ?? 0)
    }))
    .filter((hour) => new Date(hour.time).getTime() >= now)
    .slice(0, 24);
}

export function getTenDayForecast(data: OpenMeteoForecast) {
  return data.daily.time.slice(0, 10).map((time, index) => ({
    time,
    day: index === 0 ? "Today" : formatShortWeekday(time),
    label: weatherCodeLabel(data.daily.weather_code[index] ?? 0),
    weatherCode: data.daily.weather_code[index] ?? 0,
    high: Math.round(data.daily.temperature_2m_max[index] ?? 0),
    low: Math.round(data.daily.temperature_2m_min[index] ?? 0),
    precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0
  }));
}
