/* ================================================
   JALASENA - API Helper Functions
   ================================================
   Fungsi-fungsi untuk berkomunikasi dengan backend
   Django REST Framework API.
   ================================================ */

import { API_BASE_URL, WS_BASE_URL, DUMMY_FISH_ZONES, DUMMY_SHIPS } from './constants';

// --- Flag untuk menggunakan data dummy (development) ---
// TODO: Set ke false saat backend sudah terhubung
const USE_DUMMY_DATA = true;

/**
 * Mengambil daftar zona ikan berdasarkan jenis ikan
 * @param {string} fishType - Jenis ikan (kembung, teri, tongkol)
 * @returns {Promise<Array>} Daftar zona ikan
 * 
 * TODO: Integrasi Copernicus Marine Service API
 * Saat ini menggunakan dummy data. Ketika backend sudah terhubung
 * dengan Copernicus, data akan real-time dari satelit.
 */
export async function fetchFishZones(fishType = '') {
  if (USE_DUMMY_DATA) {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (fishType) {
      return DUMMY_FISH_ZONES.filter(zone => zone.fish_type === fishType);
    }
    return DUMMY_FISH_ZONES;
  }

  try {
    const params = fishType ? `?type=${fishType}` : '';
    const response = await fetch(`${API_BASE_URL}/fish-zones/${params}`);
    
    if (!response.ok) throw new Error('Gagal mengambil data zona ikan');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching fish zones:', error);
    throw error;
  }
}

/**
 * Login dengan Ship ID Code
 * @param {string} shipCode - Kode unik kapal (misal: JLS-001)
 * @returns {Promise<Object>} Info kapal
 */
export async function loginWithShipCode(shipCode) {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ship = DUMMY_SHIPS.find(
      s => s.code.toLowerCase() === shipCode.toLowerCase()
    );
    
    if (!ship) {
      throw new Error('Kode Ship ID tidak ditemukan. Pastikan kode yang dimasukkan benar.');
    }
    
    return ship;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ship_code: shipCode }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login gagal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
}

/**
 * Mengambil data telemetry terbaru dari kapal
 * @param {string} shipCode - Kode kapal
 * @returns {Promise<Object>} Data telemetry terbaru
 */
export async function fetchLatestTelemetry(shipCode) {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulasi data telemetry real-time
    // TODO: Data ini akan diganti dari sensor fisik kapal
    // Sensor accelerometer/gyroscope mengirim data via IoT
    return generateDummyTelemetry(shipCode);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/ships/${shipCode}/telemetry/latest/`
    );
    
    if (!response.ok) throw new Error('Gagal mengambil data telemetry');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    throw error;
  }
}

/**
 * Mengambil histori telemetry kapal
 * @param {string} shipCode - Kode kapal
 * @returns {Promise<Array>} Histori data telemetry
 */
export async function fetchTelemetryHistory(shipCode) {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate 30 data points histori
    const history = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      history.push({
        timestamp: new Date(now - i * 10000).toISOString(),
        tilt_degree: Math.random() * 12 + Math.sin(i * 0.3) * 5,
        temperature: 28 + Math.random() * 2,
        speed: Math.random() * 8 + 2,
        latitude: -6.75 + Math.random() * 0.01,
        longitude: 110.42 + Math.random() * 0.01,
      });
    }
    return history;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/ships/${shipCode}/telemetry/`
    );
    
    if (!response.ok) throw new Error('Gagal mengambil histori telemetry');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching telemetry history:', error);
    throw error;
  }
}

/**
 * Membuat koneksi WebSocket untuk monitoring real-time
 * @param {string} shipCode - Kode kapal
 * @param {Function} onMessage - Callback saat menerima data
 * @param {Function} onError - Callback saat error
 * @returns {WebSocket} WebSocket instance
 * 
 * WebSocket digunakan untuk menerima data telemetry secara real-time
 * dari sensor kapal melalui backend Django Channels
 */
export function createMonitoringSocket(shipCode, onMessage, onError) {
  if (USE_DUMMY_DATA) {
    // Simulasi WebSocket dengan interval
    // Data akan ter-update setiap 3 detik
    const intervalId = setInterval(() => {
      const data = generateDummyTelemetry(shipCode);
      onMessage(data);
    }, 3000);

    // Return mock socket object
    return {
      close: () => clearInterval(intervalId),
      readyState: 1,
    };
  }

  const socket = new WebSocket(`${WS_BASE_URL}/monitoring/${shipCode}/`);
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  socket.onerror = (event) => {
    console.error('WebSocket error:', event);
    if (onError) onError(event);
  };
  
  return socket;
}

/**
 * Generate data telemetry dummy untuk simulasi
 * Simulasi data sensor accelerometer/gyroscope
 * 
 * TODO: Integrasi sensor IoT
 * Data sebenarnya akan dikirim dari:
 * 1. Sensor accelerometer (mengukur kemiringan kapal)
 * 2. Sensor GPS (posisi dan kecepatan)
 * 3. Sensor suhu air laut
 * Data dikirim via MQTT/HTTP ke backend Django
 */
function generateDummyTelemetry(shipCode) {
  const ship = DUMMY_SHIPS.find(s => s.code === shipCode) || DUMMY_SHIPS[0];
  
  // Simulasi kemiringan kapal (normal: 0-12°, kadang naik saat ombak besar)
  // Sesekali simulasi kondisi berbahaya untuk testing alert
  const randomSpike = Math.random() > 0.92; // 8% chance spike berbahaya
  const baseTilt = Math.random() * 10 + Math.sin(Date.now() / 2000) * 3;
  const tiltDegree = randomSpike ? baseTilt + 18 : baseTilt;

  return {
    ship_code: shipCode,
    timestamp: new Date().toISOString(),
    tilt_degree: Math.round(tiltDegree * 10) / 10,
    temperature: Math.round((28 + Math.random() * 2.5) * 10) / 10,
    speed: ship.is_moving ? Math.round((Math.random() * 6 + 3) * 10) / 10 : 0,
    latitude: ship.lat + (Math.random() - 0.5) * 0.005,
    longitude: ship.lng + (Math.random() - 0.5) * 0.005,
    is_moving: ship.is_moving,
  };
}

/**
 * Menghitung jarak antara dua titik koordinat (Haversine Formula)
 * @param {number} lat1 - Latitude titik 1
 * @param {number} lon1 - Longitude titik 1
 * @param {number} lat2 - Latitude titik 2
 * @param {number} lon2 - Longitude titik 2
 * @returns {number} Jarak dalam kilometer
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format jarak menjadi teks yang mudah dibaca
 * @param {number} distanceKm - Jarak dalam km
 * @returns {string} Teks jarak terformat
 */
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
