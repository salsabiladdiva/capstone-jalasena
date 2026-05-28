/* ================================================
   JALASENA - Navbar Component
   ================================================
   Navigasi utama yang tampil di semua halaman.
   - Transparent di landing page, solid saat scroll
   - Logo JALASENA di kiri
   - Button Login di kanan dengan warna accent
   - Hamburger menu untuk mobile
   ================================================ */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  // State untuk mengontrol efek scroll (navbar berubah jadi solid)
  const [scrolled, setScrolled] = useState(false);
  // State untuk hamburger menu di mobile
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Listener untuk mendeteksi scroll dan mengubah background navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}
    >
      <div className={styles.navbarInner}>
        {/* Logo JALASENA - klik untuk kembali ke landing page */}
        <Link href="/" className={styles.logo}>
          {/* SVG Logo Mark */}
          <svg
            className={styles.logoIcon}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lingkaran luar - representasi radar/satelit */}
            <circle cx="20" cy="20" r="18" stroke="#FF471D" strokeWidth="2.5" fill="none" />
            {/* Gelombang sinyal */}
            <path d="M12 20 Q16 12, 20 20 Q24 28, 28 20" stroke="#FF471D" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Titik pusat - posisi kapal */}
            <circle cx="20" cy="20" r="3" fill="#FF471D" />
          </svg>
          <span className={styles.logoText}>JALASENA</span>
        </Link>

        {/* Menu navigasi desktop */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="/deteksi" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Deteksi Ikan
          </Link>
          <Link href="/monitoring" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Monitoring
          </Link>
          <Link href="/tutorial" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Tutorial
          </Link>
          {/* Button Login dengan warna accent #FF471D */}
          <Link href="/login" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        </div>

        {/* Hamburger menu untuk tampilan mobile */}
        <button
          id="hamburger-menu"
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>
    </nav>
  );
}
