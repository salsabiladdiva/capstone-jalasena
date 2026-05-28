/* ================================================
   JALASENA - Landing Page (Hero Section)
   ================================================
   Halaman utama JALASENA dengan:
   - Background laut dengan overlay gradient
   - Judul "JALASENA" besar dan bold
   - Animasi satelit mengikuti gerakan kursor (parallax)
   - Animasi kapal bergerak di laut
   - Scan lines overlay (terinspirasi cargokite.com)
   - CTA buttons untuk Deteksi dan Login
   ================================================ */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from './page.module.css';

export default function LandingPage() {
  // --- Ref untuk elemen satelit (digerakkan oleh kursor) ---
  const satelliteRef = useRef(null);
  // --- Ref untuk container hero (area tracking mouse) ---
  const heroRef = useRef(null);
  // --- State posisi satelit (x, y) untuk smooth lerp ---
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  // --- State untuk animasi fade-in saat halaman dimuat ---
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Animasi Satelit Mengikuti Kursor ---
  // Satelit bergerak dengan efek parallax (lebih lambat dari kursor)
  // menggunakan lerp (linear interpolation) untuk gerakan smooth
  useEffect(() => {
    setIsLoaded(true);

    // Fungsi handle mouse move - update target posisi satelit
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      // Hitung posisi relatif kursor terhadap center hero
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Parallax intensity - satelit bergerak 20% dari gerakan kursor
      const intensity = 0.2;
      targetPos.current = {
        x: (mouseX - centerX) * intensity,
        y: (mouseY - centerY) * intensity,
      };
    };

    // Animation loop menggunakan requestAnimationFrame
    // Lerp smoothing membuat satelit bergerak halus mengejar kursor
    let animationFrameId;
    const animate = () => {
      // Lerp factor - semakin kecil semakin smooth (0.05 = sangat halus)
      const lerpFactor = 0.06;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (satelliteRef.current) {
        // Hitung rotasi satelit berdasarkan arah gerakan
        const angle = Math.atan2(
          targetPos.current.y - currentPos.current.y,
          targetPos.current.x - currentPos.current.x
        ) * (180 / Math.PI);

        satelliteRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) rotate(${angle * 0.3}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Navbar - transparan di landing, solid saat scroll */}
      <Navbar />

      {/* === HERO SECTION === */}
      <section ref={heroRef} className={styles.hero} id="hero-section">
        {/* Background gradient laut (CSS-based, tidak perlu gambar) */}
        <div className={styles.hero__background}>
          <div style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(45, 97, 135, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(13, 33, 55, 0.6) 0%, transparent 50%),
              linear-gradient(180deg, 
                #0a1628 0%, 
                #0d2137 20%, 
                #123a5c 40%, 
                #1a5276 55%, 
                #1a6e7a 65%,
                #1a5276 75%,
                #0d2137 90%, 
                #212121 100%
              )
            `,
            backgroundSize: '100% 100%',
          }} />
        </div>

        {/* Overlay gradient untuk keterbacaan teks */}
        <div className={styles.hero__overlay} />

        {/* Efek scan lines vertikal (terinspirasi cargokite.com) */}
        <div className={styles.hero__scanlines} />

        {/* --- ANIMASI SATELIT --- */}
        {/* Satelit yang mengikuti arah gerakan kursor dengan parallax */}
        <div ref={satelliteRef} className={styles.satellite} style={{ left: '18%', top: '35%' }}>
          {/* Efek glow di sekitar satelit */}
          <div className={styles.satellite__glow}></div>
          {/* SVG Satelit dengan panel surya yang bergerak */}
          <svg className={styles.satellite__body} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Panel surya kiri - animasi rotasi halus */}
            <g className={styles.satellite__panel}>
              <rect x="5" y="25" width="35" height="30" rx="2" fill="#3a5ba0" stroke="#5b7ec2" strokeWidth="1"/>
              {/* Grid panel surya */}
              <line x1="15" y1="25" x2="15" y2="55" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="25" y1="25" x2="25" y2="55" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="35" y1="25" x2="35" y2="55" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="5" y1="35" x2="40" y2="35" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="5" y1="45" x2="40" y2="45" stroke="#4a6db5" strokeWidth="0.5"/>
            </g>
            {/* Badan satelit */}
            <rect x="42" y="28" width="36" height="24" rx="4" fill="#c0c0c0" stroke="#e0e0e0" strokeWidth="1"/>
            {/* Antena satelit */}
            <line x1="60" y1="28" x2="60" y2="15" stroke="#e0e0e0" strokeWidth="1.5"/>
            <circle cx="60" cy="12" r="3" fill="#FF471D" opacity="0.9"/>
            {/* Lensa/sensor */}
            <circle cx="55" cy="40" r="4" fill="#2196F3" stroke="#42A5F5" strokeWidth="1"/>
            <circle cx="65" cy="40" r="3" fill="#1565C0"/>
            {/* Panel surya kanan */}
            <g className={styles.satellite__panel}>
              <rect x="80" y="25" width="35" height="30" rx="2" fill="#3a5ba0" stroke="#5b7ec2" strokeWidth="1"/>
              <line x1="90" y1="25" x2="90" y2="55" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="100" y1="25" x2="100" y2="55" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="110" y1="25" x2="110" y2="55" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="80" y1="35" x2="115" y2="35" stroke="#4a6db5" strokeWidth="0.5"/>
              <line x1="80" y1="45" x2="115" y2="45" stroke="#4a6db5" strokeWidth="0.5"/>
            </g>
            {/* Sinyal dari satelit - animasi pulse */}
            <circle cx="60" cy="12" r="8" fill="none" stroke="#FF471D" strokeWidth="0.5" opacity="0.5">
              <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="60" cy="12" r="14" fill="none" stroke="#FF471D" strokeWidth="0.3" opacity="0.3">
              <animate attributeName="r" values="14;28;14" dur="3s" begin="0.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" begin="0.5s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>

        {/* --- KONTEN HERO (Judul, Subtitle, Tombol) --- */}
        <div className={`${styles.hero__content} ${isLoaded ? styles.hero__contentVisible : ''}`}>
          {/* Judul utama "JALASENA" - tipografi bold */}
          <h1 className={styles.hero__title}>JALASENA</h1>
          {/* Garis accent oranye di bawah judul */}
          <div className={styles.hero__title_accent}></div>
          {/* Subtitle deskripsi sistem */}
          <p className={styles.hero__subtitle}>
            Sistem Terintegrasi Prediksi Wilayah Ikan
            <br />
            dan Peringatan Dini Kondisi Kapal
          </p>

          {/* Container tombol CTA */}
          <div className={styles.hero__cta}>
            {/* Tombol utama - menuju halaman deteksi zona ikan */}
            <Link href="/deteksi" className="btn-primary" id="btn-deteksi">
              Mulai Deteksi Zona Ikan
            </Link>
            {/* Tombol sekunder - menuju halaman login */}
            <Link href="/login" className="btn-secondary" id="btn-login-hero">
              Login Monitoring
            </Link>
          </div>
        </div>

        {/* --- ANIMASI KAPAL --- */}
        {/* Kapal yang bergerak naik-turun (bobbing) seolah berlayar */}
        <div className={styles.boat}>
          {/* SVG Kapal nelayan */}
          <svg className={styles.boat__body} viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Badan kapal - hull */}
            <path d="M20 65 L35 85 L105 85 L120 65 Z" fill="#8B4513" stroke="#A0522D" strokeWidth="1"/>
            {/* Dek kapal */}
            <rect x="40" y="55" width="60" height="12" rx="2" fill="#D2691E"/>
            {/* Kabin */}
            <rect x="55" y="38" width="30" height="18" rx="2" fill="#DEB887" stroke="#D2691E" strokeWidth="1"/>
            {/* Jendela kabin */}
            <rect x="60" y="42" width="8" height="6" rx="1" fill="#87CEEB" opacity="0.8"/>
            <rect x="72" y="42" width="8" height="6" rx="1" fill="#87CEEB" opacity="0.8"/>
            {/* Tiang */}
            <line x1="70" y1="38" x2="70" y2="15" stroke="#A0522D" strokeWidth="2"/>
            {/* Bendera */}
            <path d="M70 15 L85 20 L70 25 Z" fill="#FF471D"/>
            {/* Antena */}
            <line x1="75" y1="38" x2="80" y2="22" stroke="#808080" strokeWidth="1"/>
            {/* Light */}
            <circle cx="80" cy="22" r="2" fill="#FFD700">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>

          {/* Efek wake/jejak air di belakang kapal */}
          <div className={styles.boat__wake}>
            <div className={styles['boat__wake-line']}></div>
            <div className={styles['boat__wake-line']}></div>
            <div className={styles['boat__wake-line']}></div>
          </div>

          {/* Efek cahaya refleksi di air */}
          <div className={styles.boat__reflection}></div>
        </div>

        {/* --- SCROLL INDICATOR --- */}
        {/* Indikator untuk scroll ke bawah */}
        <div className={styles.hero__scroll_indicator}>
          <div className={styles['scroll-mouse']}>
            <div className={styles['scroll-mouse__wheel']}></div>
          </div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* === SECTION FITUR === */}
      <section style={{
        padding: '100px 0',
        background: 'var(--color-primary)',
        position: 'relative',
      }}>
        <div className="container">
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '2px',
            }}>
              Fitur <span style={{ color: 'var(--color-accent)' }}>Unggulan</span>
            </h2>
            <p style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--font-size-lg)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Teknologi canggih untuk mendukung keselamatan dan produktivitas nelayan Indonesia
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {/* Card 1 - Deteksi Zona Ikan */}
            <FeatureCard
              icon="🎯"
              title="Deteksi Zona Ikan"
              description="Peta interaktif menunjukkan titik potensial ikan berdasarkan data satelit Copernicus Marine Service"
              delay={0}
            />
            {/* Card 2 - Navigasi GPS */}
            <FeatureCard
              icon="🧭"
              title="Navigasi GPS"
              description="Panduan navigasi real-time menuju titik tangkapan ikan dengan informasi jarak dan kecepatan"
              delay={1}
            />
            {/* Card 3 - Monitoring Kapal */}
            <FeatureCard
              icon="📊"
              title="Monitoring Kapal"
              description="Dashboard monitoring kemiringan kapal real-time dengan peringatan dini bahaya terbalik"
              delay={2}
            />
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer style={{
        padding: '40px 0',
        borderTop: '1px solid var(--color-gray-800)',
        background: 'var(--color-primary)',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
            © 2026 JALASENA. Sistem Terintegrasi Prediksi Wilayah Ikan.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/tutorial" style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)', transition: 'color 0.3s' }}>
              Tutorial
            </Link>
            <Link href="/login" style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)', transition: 'color 0.3s' }}>
              Login
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

/**
 * Feature Card Component
 * Card yang menampilkan fitur unggulan dengan efek hover
 */
function FeatureCard({ icon, title, description, delay }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--color-gray-800), var(--color-gray-900))',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 30px',
        border: '1px solid var(--color-gray-700)',
        transition: 'all 0.4s ease',
        cursor: 'default',
        animation: `fadeInUp 0.6s ease ${delay * 0.15}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 71, 29, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--color-gray-700)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{
        fontSize: 'var(--font-size-xl)',
        fontWeight: 700,
        marginBottom: '12px',
        color: 'var(--color-white)',
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--color-gray-400)',
        fontSize: 'var(--font-size-md)',
        lineHeight: 1.7,
      }}>
        {description}
      </p>
    </div>
  );
}
