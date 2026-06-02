import { Platform } from 'react-native'

// Para Expo Go no celular físico: troque pelo IP da sua máquina na rede local
// Ex: 'http://192.168.1.100:8000'
const API_URL = Platform.select({
  web:     'http://localhost:8000',
  ios:     'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
}) ?? 'http://localhost:8000'

export default API_URL
