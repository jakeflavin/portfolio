import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleDescription from "@/ui/TitleDescription";
import Surface, { StyledSurface } from "@/ui/Surface";
import DynamicColumnLayout from "@/ui/DynamicColumnLayout";
import type { Project } from "@/features/projects/projects";
import {
  fetchForecast,
  weatherCodeLabel,
  weatherCodeToIconKey,
  getRainbowProbability,
  type OpenMeteoForecast,
  type WeatherIconKey
} from "./openMeteo";
import SunIcon from "@/assets/icons/sun.svg?react";
import MoonIcon from "@/assets/icons/moon.svg?react";
import SunCloudIcon from "@/assets/icons/sun-cloud.svg?react";
import CloudsIcon from "@/assets/icons/clouds.svg?react";
import SunHazeIcon from "@/assets/icons/sun-haze.svg?react";
import CloudDrizzleIcon from "@/assets/icons/cloud-drizzle.svg?react";
import CloudSunRainIcon from "@/assets/icons/cloud-sun-rain.svg?react";
import CloudBoltIcon from "@/assets/icons/cloud-bolt.svg?react";
import CloudBoltSunIcon from "@/assets/icons/cloud-bolt-sun.svg?react";
import CloudHailIcon from "@/assets/icons/cloud-hail.svg?react";
import LocationDotIcon from "@/assets/icons/location-dot.svg?react";
import RainbowIcon from "@/assets/icons/rainbow.svg?react";
import WindIcon from "@/assets/icons/wind.svg?react";
import UmbrellaIcon from "@/assets/icons/umbrella.svg?react";
import SunriseIcon from "@/assets/icons/sunrise.svg?react";
import SunsetIcon from "@/assets/icons/sunset.svg?react";
import TemperatureHalfIcon from "@/assets/icons/temperature-half.svg?react";

const WEATHER_ICONS: Record<WeatherIconKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  sun: SunIcon,
  moon: MoonIcon,
  "sun-cloud": SunCloudIcon,
  clouds: CloudsIcon,
  "sun-haze": SunHazeIcon,
  "cloud-drizzle": CloudDrizzleIcon,
  "cloud-sun-rain": CloudSunRainIcon,
  "cloud-bolt": CloudBoltIcon,
  "cloud-bolt-sun": CloudBoltSunIcon,
  "cloud-hail": CloudHailIcon
};

const ICON_SIZE = 48;

const DEFAULT_LAT = 52.52;
const DEFAULT_LON = 13.41;

interface LocalWeatherPageProps {
  project: Project;
}

/** Format time string to HH:MM. */
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

/** Format date string to weekday. */
function formatWeekday(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString([], { weekday: "long" });
  } catch {
    return iso;
  }
}

function WeatherIcon({
  code,
  isDay,
  size = ICON_SIZE
}: {
  code: number;
  isDay: 0 | 1;
  size?: number;
}) {
  const key = weatherCodeToIconKey(code, isDay);
  const Icon = WEATHER_ICONS[key] ?? WEATHER_ICONS["sun-cloud"];
  return <Icon width={size} height={size} aria-hidden />;
}

/** Reverse geocode lat/lon to city name via Nominatim (OpenStreetMap). */
async function fetchCityName(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Portfolio-Weather-App" }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { address?: { city?: string; town?: string; village?: string; municipality?: string; county?: string } };
    const a = json.address;
    if (!a) return null;
    return a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? null;
  } catch {
    return null;
  }
}

const LocalWeatherPage: React.FC<LocalWeatherPageProps> = ({ project }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [data, setData] = useState<OpenMeteoForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async (lat: number, lon: number) => {
      try {
        const forecast = await fetchForecast(lat, lon);
        if (!cancelled) {
          setData(forecast);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load weather");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

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
    fetchForecast(coords.lat, coords.lon)
      .then((forecast) => {
        if (!cancelled) {
          setData(forecast);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load weather");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [coords?.lat, coords?.lon]);

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    fetchCityName(coords.lat, coords.lon).then((city) => {
      if (!cancelled) setCityName(city);
    });
    return () => {
      cancelled = true;
    };
  }, [coords?.lat, coords?.lon]);

  if (loading && !data) {
    return (
      <PageContainer>
        <TitleDescription title={project.title} description={project.description} />
        <StatusBox>Loading weather…</StatusBox>
      </PageContainer>
    );
  }

  if (error && !data) {
    return (
      <PageContainer>
        <TitleDescription title={project.title} description={project.description} />
        <StatusBox $error>{error}</StatusBox>
      </PageContainer>
    );
  }

  const d = data!;
  const daily = d.daily;
  const precipProbMaxToday = daily.precipitation_probability_max[0] ?? 0;
  const tempMinToday = daily.temperature_2m_min[0];
  const tempMaxToday = daily.temperature_2m_max[0];
  const needsCoat =
    tempMinToday < 12 ||
    precipProbMaxToday >= 40 ||
    (d.current.precipitation ?? 0) > 0;
  const uvMaxToday = daily.uv_index_max[0] ?? 0;
  const uvLevel =
    uvMaxToday <= 2 ? "Low" : uvMaxToday <= 5 ? "Moderate" : uvMaxToday <= 7 ? "High" : "Very high";
  const willRain = precipProbMaxToday >= 50;
  const rainbowProbability = getRainbowProbability(
    precipProbMaxToday,
    daily.weather_code[0] ?? 0
  );

  const locationDisplay = cityName ?? d.timezone.replace(/_/g, " ");

  return (
    <PageContainer>
      <TitleDescription title={project.title} description={project.description} />
      <DynamicColumnLayout>
        <WeatherCard>
          <CardTitle>Location</CardTitle>
          <CardBody>
            <CardIconWrap>
              <LocationDotIcon width={32} height={32} aria-hidden />
            </CardIconWrap>
            <LocationText>
              {locationDisplay}
            </LocationText>
            <Muted>
              {d.latitude.toFixed(2)}°, {d.longitude.toFixed(2)}°
            </Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Today</CardTitle>
          <CardBody>
            <CardIconWrap>
              <WeatherIcon code={daily.weather_code[0] ?? 0} isDay={d.current.is_day} />
            </CardIconWrap>
            <TempRow>
              <span>{tempMaxToday}°</span>
              <Muted> / {tempMinToday}°</Muted>
            </TempRow>
            <Muted>{weatherCodeLabel(daily.weather_code[0] ?? 0)}</Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Tomorrow</CardTitle>
          <CardBody>
            <CardIconWrap>
              <WeatherIcon code={daily.weather_code[1] ?? 0} isDay={1} />
            </CardIconWrap>
            <TempRow>
              <span>{daily.temperature_2m_max[1]}°</span>
              <Muted> / {daily.temperature_2m_min[1]}°</Muted>
            </TempRow>
            <Muted>{formatWeekday(daily.time[1])}</Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>{formatWeekday(daily.time[2])}</CardTitle>
          <CardBody>
            <CardIconWrap>
              <WeatherIcon code={daily.weather_code[2] ?? 0} isDay={1} />
            </CardIconWrap>
            <TempRow>
              <span>{daily.temperature_2m_max[2]}°</span>
              <Muted> / {daily.temperature_2m_min[2]}°</Muted>
            </TempRow>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Precipitation</CardTitle>
          <CardBody>
            <CardIconWrap>
              <UmbrellaIcon width={32} height={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{precipProbMaxToday}%</BigValue>
            <Muted>Max probability today</Muted>
            {daily.precipitation_sum[0] != null && daily.precipitation_sum[0] > 0 && (
              <Muted>~{daily.precipitation_sum[0]} mm expected</Muted>
            )}
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Do you need a coat at the bus stop?</CardTitle>
          <CardBody>
            <BigValue $highlight={needsCoat}>{needsCoat ? "Yes" : "No"}</BigValue>
            <Muted>
              {needsCoat
                ? "Chilly, rain likely, or wet — take a coat."
                : "Temperatures and rain chance are manageable."}
            </Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Rainbow probability</CardTitle>
          <CardBody>
            <CardIconWrap>
              <RainbowIcon width={32} height={32} aria-hidden />
            </CardIconWrap>
            <BigValue $highlight={rainbowProbability !== "Low"}>
              {rainbowProbability}
            </BigValue>
            <Muted>
              {rainbowProbability === "Low"
                ? "Unlikely — need sun and rain together."
                : rainbowProbability === "Possible"
                  ? "Showers and some sun possible."
                  : "Good chance with showers and sun."}
            </Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>UV index (today)</CardTitle>
          <CardBody>
            <BigValue>{uvMaxToday.toFixed(1)}</BigValue>
            <Muted>{uvLevel}</Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Wind</CardTitle>
          <CardBody>
            <CardIconWrap>
              <WindIcon width={32} height={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{d.current.wind_speed_10m ?? "—"} km/h</BigValue>
            <Muted>Current wind speed</Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Will it rain today?</CardTitle>
          <CardBody>
            <BigValue $highlight={willRain}>{willRain ? "Likely" : "Unlikely"}</BigValue>
            <Muted>{precipProbMaxToday}% chance of precipitation</Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Sunrise & sunset (today)</CardTitle>
          <CardBody>
            <SunRow>
              <SunriseIcon width={24} height={24} aria-hidden />
              <span>Sunrise</span>
              <strong>{formatTime(daily.sunrise[0])}</strong>
            </SunRow>
            <SunRow>
              <SunsetIcon width={24} height={24} aria-hidden />
              <span>Sunset</span>
              <strong>{formatTime(daily.sunset[0])}</strong>
            </SunRow>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Feels like</CardTitle>
          <CardBody>
            <CardIconWrap>
              <TemperatureHalfIcon width={32} height={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{d.current.apparent_temperature}°</BigValue>
            <Muted>Current apparent temperature</Muted>
          </CardBody>
        </WeatherCard>

        <WeatherCard>
          <CardTitle>Humidity</CardTitle>
          <CardBody>
            <BigValue>{d.current.relative_humidity_2m}%</BigValue>
            <Muted>Relative humidity</Muted>
          </CardBody>
        </WeatherCard>
      </DynamicColumnLayout>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  max-width: 100%;
`;

const StatusBox = styled(StyledSurface).attrs({
  $padding: "md",
  $variant: "secondary",
  $shadow: "mdDown"
})<{ $error?: boolean }>`
  color: ${({ theme, $error }) => ($error ? theme.colors.muted : theme.colors.text)};
  font-size: 0.9375rem;
  text-align: center;
  letter-spacing: 0.01em;
`;

const WeatherCard = styled(Surface).attrs({
  padding: "md",
  variant: "secondary",
  shadow: "mdDown",
  interactive: true
})`
  min-height: 140px;
  text-align: center;
`;

const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const CardIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};

  svg {
    flex-shrink: 0;
    fill: currentColor;
    stroke: currentColor;
  }
`;

const TempRow = styled.div`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const BigValue = styled.span<{ $highlight?: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.text};
`;

const Muted = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const LocationText = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SunRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    flex-shrink: 0;
    opacity: 0.9;
    fill: currentColor;
    stroke: currentColor;
  }

  strong {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
`;

export default LocalWeatherPage;
