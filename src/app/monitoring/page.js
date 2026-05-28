/* ================================================
   JALASENA - Halaman Monitoring Dashboard
   ================================================
   Dashboard untuk monitoring kapal real-time
   Menampilkan:
   - Grafik kemiringan kapal
   - Info status kapal
   - Alert bahaya
   - Map posisi kapal
   ================================================ */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import MonitoringChart from '../../components/MonitoringChart';
import ShipStatus from '../../components/ShipStatus';
import DangerAlert from '../../components/DangerAlert';
import { fetchLatestTelemetry, createMonitoringSocket } from '@/lib/api';
import { STORAGE_KEYS, DUMMY_SHIPS } from '@/lib/constants';
import styles from './monitoring.module.css';

// Import peta secara dynamic (SSR disabled)
const FishMap = dynamic(() => import('../../components/FishMap'), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading}>
      <p>Memuat peta...</p>
    </div>
  ),
});

export default function MonitoringPage() {
  const router = useRouter();
  
  // State kapal dan telemetry
  const [shipCode, setShipCode] = useState('');
  const [ship, setShip] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State alert
  const [showDangerAlert, setShowDangerAlert] = useState(false);

  // --- Load ship code dari localStorage/sessionStorage saat mount ---
  useEffect(() => {
    const code = localStorage.getItem(STORAGE_KEYS.SHIP_ID) || 
                 sessionStorage.getItem('ship_code') ||
                 'SHIP001'; // Default ship untuk demo
    
    if (!code) {
      router.push('/login');
      return;
    }

    setShipCode(code);

    // Cari ship dari dummy data
    const foundShip = DUMMY_SHIPS.find(s => s.code === code);
    if (foundShip) {
      setShip(foundShip);
    }

    setIsLoading(false);
  }, [router]);

  // --- WebSocket untuk real-time telemetry ---
  useEffect(() => {
    if (!shipCode) return;

    // Ambil data telemetry awal
    fetchLatestTelemetry(shipCode)
      .then(data => {
        setTelemetry(data);
        setTelemetryHistory(prev => [...prev.slice(-29), data]);
      })
      .catch(err => {
        console.error('Error fetching telemetry:', err);
        setError('Gagal terhubung ke server');
      });

    // Setup WebSocket untuk data real-time
    const socket = createMonitoringSocket(
      shipCode,
      (data) => {
        setTelemetry(data);
        setTelemetryHistory(prev => [...prev.slice(-29), data]);
        
        // Trigger alert jika tilt > 15
        if (data.tilt_degree >= 15) {
          setShowDangerAlert(true);
        }
      },
      (err) => {
        console.error('WebSocket error:', err);
      }
    );

    return () => {
      if (socket) socket.close();
    };
  }, [shipCode]);

  // --- Handler logout ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.SHIP_ID);
    sessionStorage.removeItem('ship_code');
    router.push('/');
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Memuat monitoring dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!shipCode) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Navbar />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Monitoring Kapal</h1>
            <p className={styles.pageSubtitle}>
              Dashboard monitoring real-time untuk kapal {shipCode}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/deteksi" className={styles.btnSecondary}>
              ← Kembali ke Deteksi
            </Link>
            <button className={styles.btnLogout} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorBanner}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Column - Chart & Info */}
          <div className={styles.leftColumn}>
            {/* Chart */}
            <MonitoringChart data={telemetryHistory} />

            {/* Map */}
            <div className={styles.mapContainer}>
              {ship && (
                <FishMap
                  fishZones={[]}
                  userPosition={{ lat: ship.lat, lng: ship.lng }}
                  selectedZone={null}
                  isNavigating={false}
                />
              )}
            </div>
          </div>

          {/* Right Column - Status */}
          <div className={styles.rightColumn}>
            <ShipStatus shipCode={shipCode} telemetry={telemetry} ship={ship} />
          </div>
        </div>
      </div>

      {/* Danger Alert Modal */}
      <DangerAlert
        tilt={telemetry?.tilt_degree || 0}
        isVisible={showDangerAlert}
        onClose={() => setShowDangerAlert(false)}
      />
    </>
  );
}
