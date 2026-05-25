import React from "react";
import { useTheme } from "styled-components";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import TitleDescription from "@/ui/TitleDescription";
import type { Project } from "@/features/projects/projects";
import {
  weatherCodeLabel,
  weatherCodeToIconKey,
  getRainbowProbability,
  type WeatherIconKey
} from "./openMeteo";
import type { Icon } from "@phosphor-icons/react";
import {
  SunIcon,
  MoonIcon,
  CloudSunIcon,
  CloudIcon,
  CloudFogIcon,
  CloudRainIcon,
  CloudLightningIcon,
  CloudSnowIcon,
  MapPinIcon,
  RainbowIcon,
  WindIcon,
  UmbrellaIcon,
  SunHorizonIcon,
  ThermometerIcon,
  DropIcon,
  GaugeIcon,
  CloudIcon as CloudCoverIcon,
  LeafIcon
} from "@phosphor-icons/react";
import {
  BigValue,
  CardBody,
  CardIconWrap,
  CardTitle,
  CenterBody,
  ChartFrame,
  ForecastList,
  ForecastRow,
  HeroMeta,
  HeroSummary,
  HeroTemp,
  HeroTop,
  HeroWeatherCard,
  HourlyItem,
  HourlyScroller,
  LocationText,
  MetricGrid,
  MetricPill,
  Muted,
  PageContainer,
  RangeBar,
  RangeFill,
  StatusBox,
  SunRow,
  TempRow,
  WeatherCard,
  WeatherGrid
} from "./LocalWeatherPage.styled";
import {
  formatFullTime,
  formatTime,
  formatWeekday,
  getAirQualityLabel,
  getHourlyForecast,
  getPossibleRainSoon,
  getTenDayForecast,
  getUvLevel,
  getWindDirectionLabel
} from "./localWeather.utils";
import { useLocalWeather } from "./useLocalWeather";

const WEATHER_ICONS: Record<WeatherIconKey, Icon> = {
  sun: SunIcon,
  moon: MoonIcon,
  "sun-cloud": CloudSunIcon,
  clouds: CloudIcon,
  "sun-haze": CloudFogIcon,
  "cloud-drizzle": CloudRainIcon,
  "cloud-sun-rain": CloudRainIcon,
  "cloud-bolt": CloudLightningIcon,
  "cloud-bolt-sun": CloudLightningIcon,
  "cloud-hail": CloudSnowIcon
};

const ICON_SIZE = 42;

interface LocalWeatherPageProps {
  project: Project;
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
  return <Icon size={size} aria-hidden />;
}

function WeatherTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <MetricPill>
      <strong>{label}</strong>
      {payload.map((item: any) => (
        <Muted key={item.dataKey}>{item.name}: {item.value}</Muted>
      ))}
    </MetricPill>
  );
}

const LocalWeatherPage: React.FC<LocalWeatherPageProps> = ({ project }) => {
  const theme = useTheme();
  const { airQuality, cityName, data, error, loading } = useLocalWeather();

  if (loading && !data) {
    return (
      <PageContainer>
        <TitleDescription title={project.title} description={project.description} />
        <StatusBox padding="md" variant="secondary" shadow="mdDown">Loading weather...</StatusBox>
      </PageContainer>
    );
  }

  if (error && !data) {
    return (
      <PageContainer>
        <TitleDescription title={project.title} description={project.description} />
        <StatusBox padding="md" variant="secondary" shadow="mdDown" $error>{error}</StatusBox>
      </PageContainer>
    );
  }

  const d = data!;
  const daily = d.daily;
  const hourly = getHourlyForecast(d);
  const tenDay = getTenDayForecast(d);
  const possibleRainSoon = getPossibleRainSoon(d);
  const precipProbMaxToday = daily.precipitation_probability_max[0] ?? 0;
  const tempMinToday = daily.temperature_2m_min[0];
  const tempMaxToday = daily.temperature_2m_max[0];
  const needsCoat =
    tempMinToday < 12 ||
    precipProbMaxToday >= 40 ||
    (d.current.precipitation ?? 0) > 0;
  const uvMaxToday = daily.uv_index_max[0] ?? 0;
  const willRain = precipProbMaxToday >= 50;
  const rainbowProbability = getRainbowProbability(
    precipProbMaxToday,
    daily.weather_code[0] ?? 0
  );
  const locationDisplay = cityName ?? d.timezone.replace(/_/g, " ");
  const airQualityValue = airQuality?.current.us_aqi ?? airQuality?.current.european_aqi;
  const minForecastTemp = Math.min(...tenDay.map((day) => day.low));
  const maxForecastTemp = Math.max(...tenDay.map((day) => day.high));
  const tempRange = Math.max(1, maxForecastTemp - minForecastTemp);

  return (
    <PageContainer>
      <TitleDescription title={project.title} description={project.description} />
      <WeatherGrid>
        <HeroWeatherCard padding="lg" variant="surface" shadow="md" interactive $span="hero">
          <HeroTop>
            <HeroSummary>
              <CardTitle>Current weather</CardTitle>
              <LocationText>{locationDisplay}</LocationText>
              <Muted>{weatherCodeLabel(d.current.weather_code)}</Muted>
              <HeroMeta>
                <span>H:{Math.round(tempMaxToday)}°</span>
                <span>L:{Math.round(tempMinToday)}°</span>
                <span>Feels like {Math.round(d.current.apparent_temperature)}°</span>
              </HeroMeta>
            </HeroSummary>
            <CardIconWrap>
              <WeatherIcon code={d.current.weather_code} isDay={d.current.is_day} size={64} />
            </CardIconWrap>
          </HeroTop>
          <HeroTemp>{Math.round(d.current.temperature_2m)}°</HeroTemp>
        </HeroWeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Location</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <MapPinIcon size={32} aria-hidden />
            </CardIconWrap>
            <LocationText>{locationDisplay}</LocationText>
            <Muted>{d.latitude.toFixed(2)}°, {d.longitude.toFixed(2)}°</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Possible rain soon</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <UmbrellaIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue $highlight={possibleRainSoon.probability >= 40}>
              {possibleRainSoon.label}
            </BigValue>
            <Muted>{possibleRainSoon.detail}</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Today</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <WeatherIcon code={daily.weather_code[0] ?? 0} isDay={d.current.is_day} />
            </CardIconWrap>
            <TempRow>{Math.round(tempMaxToday)}° <Muted>/ {Math.round(tempMinToday)}°</Muted></TempRow>
            <Muted>{weatherCodeLabel(daily.weather_code[0] ?? 0)}</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Tomorrow</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <WeatherIcon code={daily.weather_code[1] ?? 0} isDay={1} />
            </CardIconWrap>
            <TempRow>{Math.round(daily.temperature_2m_max[1])}° <Muted>/ {Math.round(daily.temperature_2m_min[1])}°</Muted></TempRow>
            <Muted>{formatWeekday(daily.time[1])}</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>{formatWeekday(daily.time[2])}</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <WeatherIcon code={daily.weather_code[2] ?? 0} isDay={1} />
            </CardIconWrap>
            <TempRow>{Math.round(daily.temperature_2m_max[2])}° <Muted>/ {Math.round(daily.temperature_2m_min[2])}°</Muted></TempRow>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="surface" shadow="md" interactive $span="wide">
          <CardTitle>Hourly forecast</CardTitle>
          <HourlyScroller>
            {hourly.slice(0, 12).map((hour) => (
              <HourlyItem key={hour.time}>
                <span>{hour.label}</span>
                <WeatherIcon code={hour.weatherCode} isDay={1} size={24} />
                <strong>{hour.temperature}°</strong>
                <Muted>{hour.precipitationProbability}%</Muted>
              </HourlyItem>
            ))}
          </HourlyScroller>
          <ChartFrame>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly.slice(0, 12)}>
                <CartesianGrid stroke={theme.colors.border} vertical={false} />
                <XAxis dataKey="label" stroke={theme.colors.muted} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<WeatherTooltip />} />
                <Bar
                  dataKey="precipitationProbability"
                  name="Rain %"
                  fill={theme.colors.primary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </WeatherCard>

        <WeatherCard padding="md" variant="surface" shadow="md" interactive $span="wide">
          <CardTitle>10 day forecast</CardTitle>
          <ForecastList>
            {tenDay.map((day) => {
              const start = ((day.low - minForecastTemp) / tempRange) * 100;
              const width = Math.max(8, ((day.high - day.low) / tempRange) * 100);
              return (
                <ForecastRow key={day.time}>
                  <strong>{day.day}</strong>
                  <WeatherIcon code={day.weatherCode} isDay={1} size={24} />
                  <RangeBar>
                    <RangeFill $start={start} $width={Math.min(width, 100 - start)} />
                  </RangeBar>
                  <span>{day.low}° / {day.high}°</span>
                </ForecastRow>
              );
            })}
          </ForecastList>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Air quality</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <LeafIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{airQualityValue ?? "—"}</BigValue>
            <Muted>{getAirQualityLabel(airQualityValue)}</Muted>
            {airQuality?.current.pm2_5 != null && <Muted>PM2.5 {airQuality.current.pm2_5}</Muted>}
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Precipitation</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <UmbrellaIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{precipProbMaxToday}%</BigValue>
            <Muted>Max probability today</Muted>
            {daily.precipitation_sum[0] != null && daily.precipitation_sum[0] > 0 && (
              <Muted>~{daily.precipitation_sum[0]} mm expected</Muted>
            )}
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Do you need a coat at the bus stop?</CardTitle>
          <CenterBody>
            <BigValue $highlight={needsCoat}>{needsCoat ? "Yes" : "No"}</BigValue>
            <Muted>
              {needsCoat
                ? "Chilly, rain likely, or wet - take a coat."
                : "Temperatures and rain chance are manageable."}
            </Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Rainbow probability</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <RainbowIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue $highlight={rainbowProbability !== "Low"}>{rainbowProbability}</BigValue>
            <Muted>
              {rainbowProbability === "Low"
                ? "Unlikely - need sun and rain together."
                : rainbowProbability === "Possible"
                  ? "Showers and some sun possible."
                  : "Good chance with showers and sun."}
            </Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>UV index today</CardTitle>
          <CenterBody>
            <BigValue>{uvMaxToday.toFixed(1)}</BigValue>
            <Muted>{getUvLevel(uvMaxToday)}</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="surface" shadow="md" interactive $span="wide">
          <CardTitle>Wind</CardTitle>
          <MetricGrid>
            <MetricPill>
              <Muted>Speed</Muted>
              <BigValue>{Math.round(d.current.wind_speed_10m ?? 0)}</BigValue>
              <Muted>km/h</Muted>
            </MetricPill>
            <MetricPill>
              <Muted>Direction</Muted>
              <BigValue>{getWindDirectionLabel(d.current.wind_direction_10m)}</BigValue>
              <Muted>{d.current.wind_direction_10m ?? "—"}°</Muted>
            </MetricPill>
            <MetricPill>
              <Muted>Gusts</Muted>
              <BigValue>{Math.round(d.current.wind_gusts_10m ?? 0)}</BigValue>
              <Muted>km/h</Muted>
            </MetricPill>
            <MetricPill>
              <Muted>Cloud cover</Muted>
              <BigValue>{d.current.cloud_cover ?? "—"}%</BigValue>
            </MetricPill>
          </MetricGrid>
          <ChartFrame>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourly.slice(0, 12)}>
                <CartesianGrid stroke={theme.colors.border} vertical={false} />
                <XAxis dataKey="label" stroke={theme.colors.muted} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<WeatherTooltip />} />
                <Line
                  type="monotone"
                  dataKey="windSpeed"
                  name="Wind"
                  stroke={theme.colors.primary}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Will it rain today?</CardTitle>
          <CenterBody>
            <BigValue $highlight={willRain}>{willRain ? "Likely" : "Unlikely"}</BigValue>
            <Muted>{precipProbMaxToday}% chance of precipitation</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Sunrise & sunset today</CardTitle>
          <CardBody>
            <SunRow>
              <SunHorizonIcon size={24} aria-hidden />
              <span>Sunrise</span>
              <strong>{formatFullTime(daily.sunrise[0])}</strong>
            </SunRow>
            <SunRow>
              <SunHorizonIcon size={24} mirrored aria-hidden />
              <span>Sunset</span>
              <strong>{formatFullTime(daily.sunset[0])}</strong>
            </SunRow>
          </CardBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Feels like</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <ThermometerIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{Math.round(d.current.apparent_temperature)}°</BigValue>
            <Muted>Current apparent temperature</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Humidity</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <DropIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{d.current.relative_humidity_2m}%</BigValue>
            <Muted>Relative humidity</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Pressure</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <GaugeIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{Math.round(d.current.pressure_msl ?? d.current.surface_pressure ?? 0)}</BigValue>
            <Muted>hPa</Muted>
          </CenterBody>
        </WeatherCard>

        <WeatherCard padding="md" variant="secondary" shadow="mdDown" interactive>
          <CardTitle>Cloud cover</CardTitle>
          <CenterBody>
            <CardIconWrap>
              <CloudCoverIcon size={32} aria-hidden />
            </CardIconWrap>
            <BigValue>{d.current.cloud_cover ?? "—"}%</BigValue>
            <Muted>Current sky coverage</Muted>
          </CenterBody>
        </WeatherCard>
      </WeatherGrid>
    </PageContainer>
  );
};

export default LocalWeatherPage;
