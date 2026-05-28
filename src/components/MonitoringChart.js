/* ================================================
   JALASENA - Monitoring Chart Component
   ================================================
   Grafik real-time kemiringan kapal menggunakan
   Recharts untuk visualisasi data telemetry
   ================================================ */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import styles from './MonitoringChart.module.css';

export default function MonitoringChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chartEmpty}>
          <p>Menunggu data telemetry...</p>
        </div>
      </div>
    );
  }

  // Format data untuk Recharts
  const formattedData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString('id-ID'),
    tilt: parseFloat(item.tilt_degree.toFixed(1)),
    temperature: parseFloat(item.temperature.toFixed(1)),
    timestamp: item.timestamp,
  }));

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Grafik Kemiringan Kapal (Real-Time)</h3>
        <p className={styles.chartSubtitle}>
          Derajat kemiringan dalam 30 detik terakhir
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.1)"
            vertical={true}
          />
          <XAxis 
            dataKey="time" 
            stroke="var(--color-gray-500)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--color-gray-500)"
            style={{ fontSize: '12px' }}
            label={{ value: 'Derajat (°)', angle: -90, position: 'insideLeft' }}
          />
          
          {/* Threshold lines untuk warning dan danger */}
          <ReferenceLine 
            y={15} 
            stroke="var(--color-warning)" 
            strokeDasharray="5 5"
            label={{ value: 'Warning (15°)', position: 'right', fill: 'var(--color-warning)' }}
          />
          <ReferenceLine 
            y={30} 
            stroke="var(--color-danger)" 
            strokeDasharray="5 5"
            label={{ value: 'Danger (30°)', position: 'right', fill: 'var(--color-danger)' }}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(33, 33, 33, 0.9)',
              border: '1px solid var(--color-accent)',
              borderRadius: '8px',
              color: 'white',
            }}
            formatter={(value) => value.toFixed(1)}
            labelFormatter={(label) => `Waktu: ${label}`}
          />
          <Legend />
          
          {/* Line chart kemiringan kapal */}
          <Line
            type="monotone"
            dataKey="tilt"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={300}
            name="Kemiringan (°)"
          />
          
          {/* Line chart suhu (optional) */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-info)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={300}
            name="Suhu (°C)"
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Statistik */}
      <div className={styles.chartStats}>
        {data.length > 0 && (
          <>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tilt Saat Ini:</span>
              <span className={styles.statValue}>{data[data.length - 1].tilt_degree.toFixed(1)}°</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tilt Rata-rata:</span>
              <span className={styles.statValue}>
                {(data.reduce((sum, d) => sum + d.tilt_degree, 0) / data.length).toFixed(1)}°
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tilt Maksimal:</span>
              <span className={`${styles.statValue} ${Math.max(...data.map(d => d.tilt_degree)) > 15 ? styles.statWarning : ''}`}>
                {Math.max(...data.map(d => d.tilt_degree)).toFixed(1)}°
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
