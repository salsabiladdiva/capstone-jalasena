/* ================================================
   JALASENA - Ship Status Component
   ================================================
   Menampilkan informasi status kapal real-time
   ================================================ */

'use client';

import styles from './ShipStatus.module.css';

export default function ShipStatus({ shipCode, telemetry, ship }) {
  if (!telemetry) {
    return (
      <div className={styles.statusCard}>
        <div className={styles.loadingState}>
          <p>Menunggu data kapal...</p>
        </div>
      </div>
    );
  }

  const isSafe = telemetry.tilt_degree < 15;
  const isWarning = telemetry.tilt_degree >= 15 && telemetry.tilt_degree < 30;
  const isDanger = telemetry.tilt_degree >= 30;

  return (
    <div className={styles.statusCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Status Kapal</h3>
        <div className={`${styles.statusBadge} ${isDanger ? styles.danger : isWarning ? styles.warning : styles.safe}`}>
          <span className={styles.statusDot}></span>
          {isDanger ? 'BAHAYA' : isWarning ? 'PERINGATAN' : 'AMAN'}
        </div>
      </div>

      <div className={styles.shipInfo}>
        {ship && (
          <div className={styles.infoSection}>
            <h4 className={styles.infoTitle}>Informasi Kapal</h4>
            <div className={styles.infoRow}>
              <span className={styles.label}>Nama Kapal:</span>
              <span className={styles.value}>{ship.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Pemilik:</span>
              <span className={styles.value}>{ship.owner}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Kode:</span>
              <span className={styles.value} style={{ fontFamily: 'monospace' }}>{shipCode}</span>
            </div>
          </div>
        )}

        {telemetry && (
          <div className={styles.infoSection}>
            <h4 className={styles.infoTitle}>Telemetry Terkini</h4>
            
            {/* Kemiringan */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Kemiringan:</span>
              <span className={`${styles.value} ${isDanger ? styles.dangerText : isWarning ? styles.warningText : ''}`}>
                {telemetry.tilt_degree.toFixed(1)}°
              </span>
            </div>

            {/* Suhu */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Suhu Air:</span>
              <span className={styles.value}>{telemetry.temperature.toFixed(1)}°C</span>
            </div>

            {/* Kecepatan */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Kecepatan:</span>
              <span className={styles.value}>{telemetry.speed.toFixed(1)} knot</span>
            </div>

            {/* Status Berlayar */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${telemetry.is_moving ? styles.moving : styles.stopped}`}>
                {telemetry.is_moving ? '🚢 Berlayar' : '⚓ Berhenti'}
              </span>
            </div>

            {/* Posisi */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Posisi:</span>
              <span className={styles.value} style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}
              </span>
            </div>

            {/* Waktu Update */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Update:</span>
              <span className={styles.value}>
                {new Date(telemetry.timestamp).toLocaleTimeString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alert Status */}
      {isDanger && (
        <div className={styles.alertBox}>
          <strong>⚠️ PERINGATAN BAHAYA!</strong>
          <p>Kapal miring lebih dari 30°. Segera cek kondisi kapal Anda!</p>
        </div>
      )}
      
      {isWarning && (
        <div className={`${styles.alertBox} ${styles.warningBox}`}>
          <strong>⚠️ PERINGATAN</strong>
          <p>Kapal miring antara 15-30°. Perhatikan kondisi laut dan kapal.</p>
        </div>
      )}
    </div>
  );
}
