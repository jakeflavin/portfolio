import { useEffect, useState } from "react";
import {
  fetchAirQuality,
  fetchForecast,
  type OpenMeteoAirQuality,
  type OpenMeteoForecast
} from "./openMeteo";

const DEFAULT_LAT = 52.52;
const DEFAULT_LON = 13.41;

async function fetchCityName(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Portfolio-Weather-App" }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
      };
    };
    const address = json.address;
    if (!address) return null;
    return address.city ?? address.town ?? address.village ?? address.municipality ?? address.county ?? null;
  } catch {
    return null;
  }
}

export function useLocalWeather() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [data, setData] = useState<OpenMeteoForecast | null>(null);
  const [airQuality, setAirQuality] = useState<OpenMeteoAirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!cancelled) setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          if (!cancelled) setCoords({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
        }
      );
    } else {
      setCoords({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      fetchForecast(coords.lat, coords.lon),
      fetchAirQuality(coords.lat, coords.lon),
      fetchCityName(coords.lat, coords.lon)
    ]).then(([forecastResult, airResult, cityResult]) => {
      if (cancelled) return;

      if (forecastResult.status === "fulfilled") {
        setData(forecastResult.value);
        setError(null);
      } else {
        setError(forecastResult.reason instanceof Error ? forecastResult.reason.message : "Failed to load weather");
      }

      if (airResult.status === "fulfilled") {
        setAirQuality(airResult.value);
      }

      if (cityResult.status === "fulfilled") {
        setCityName(cityResult.value);
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [coords]);

  return {
    airQuality,
    cityName,
    data,
    error,
    loading
  };
}
