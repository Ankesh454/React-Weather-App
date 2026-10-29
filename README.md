# WeatherNow

A responsive weather dashboard built with React, Vite, and Material UI. Search for a city to view its current conditions, temperature, humidity, wind, pressure, visibility, and local sunrise and sunset times.

Weather data comes from the [OpenWeather Current Weather API](https://openweathermap.org/current).

## Getting started

### Requirements

- Node.js and npm
- An OpenWeather API key

### Install dependencies

```bash
npm install
```

### Configure the API key

Create a `.env` file in this project directory and add your key:

```env
VITE_OPENWEATHER_API_KEY=your_actual_api_key
```

You can copy `.env.example` as a starting point, then replace its placeholder with your key. Restart the Vite server after changing `.env`.

Vite exposes variables prefixed with `VITE_` to browser code. Use a key intended for client-side use and configure any available usage restrictions with OpenWeather. Do not put private server credentials in this file.

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Features

- Search by city using the Search button or Enter.
- Loading, empty, and error states, including helpful messages for missing or invalid API keys.
- Metric weather data displayed in Celsius.
- Responsive layout and keyboard-visible focus states.

## Tech stack

- React
- Vite
- Material UI
- OpenWeather Current Weather API
