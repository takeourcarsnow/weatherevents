// Weather-related constants
export const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️',  // clear sky day
  '01n': '🌙',  // clear sky night
  '02d': '⛅',  // few clouds day
  '02n': '☁️',  // few clouds night
  '03d': '☁️',  // scattered clouds
  '03n': '☁️',
  '04d': '☁️',  // broken clouds
  '04n': '☁️',
  '09d': '🌧️',  // shower rain
  '09n': '🌧️',
  '10d': '🌦️',  // rain day
  '10n': '🌧️',  // rain night
  '11d': '⛈️',  // thunderstorm
  '11n': '⛈️',
  '13d': '🌨️',  // snow
  '13n': '🌨️',
  '50d': '🌫️',  // mist
  '50n': '🌫️',
};

export const WEATHER_BACKGROUNDS: Record<string, string> = {
  clear: 'from-blue-400 to-blue-600',
  clouds: 'from-gray-400 to-gray-600',
  rain: 'from-slate-500 to-slate-700',
  drizzle: 'from-slate-400 to-slate-600',
  thunderstorm: 'from-purple-700 to-slate-800',
  snow: 'from-blue-100 to-blue-300',
  mist: 'from-gray-300 to-gray-500',
  fog: 'from-gray-300 to-gray-500',
  haze: 'from-yellow-200 to-orange-300',
  dust: 'from-orange-300 to-orange-500',
  sand: 'from-yellow-400 to-orange-500',
  ash: 'from-gray-500 to-gray-700',
  squall: 'from-slate-600 to-slate-800',
  tornado: 'from-slate-700 to-slate-900',
};

export const WEATHER_MESSAGES: Record<string, string> = {
  clear: 'Perfect weather for outdoor activities!',
  clouds: 'Great weather for a walk or outdoor dining.',
  rain: 'Time for cozy indoor activities!',
  drizzle: 'Light rain - indoor activities recommended.',
  thunderstorm: 'Stay safe indoors and enjoy some entertainment.',
  snow: 'Beautiful snowy day - winter activities await!',
  mist: 'Low visibility - consider indoor options.',
  fog: 'Foggy conditions - indoor activities are safer.',
  haze: 'Hazy weather - light outdoor activities okay.',
  dust: 'Dusty conditions - stay indoors if possible.',
  sand: 'Sandy conditions - indoor activities recommended.',
  ash: 'Air quality concern - stay indoors.',
  squall: 'Gusty winds - indoor activities safer.',
  tornado: 'Severe weather - seek shelter immediately!',
};
