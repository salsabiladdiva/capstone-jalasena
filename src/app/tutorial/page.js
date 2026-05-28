/* ================================================
   JALASENA - Halaman Tutorial
   ================================================
   Panduan penggunaan sistem JALASENA untuk nelayan
   ================================================ */

'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import styles from './tutorial.module.css';

export default function TutorialPage() {
  const steps = [
    {
      number: 1,
      title: 'Dapatkan Kode Ship ID',
      description: 'Hubungi pemerintah daerah atau lembaga perikanan setempat untuk mendapatkan kode Ship ID unik untuk kapal Anda. Kode ini akan digunakan untuk login ke sistem monitoring.',
      icon: '🆔',
    },
    {
      number: 2,
      title: 'Buka Halaman Deteksi Zona Ikan',
      description: 'Dari halaman utama, klik tombol "Mulai Deteksi Zona Ikan". Pilih jenis ikan yang ingin Anda cari (Kembung, Teri, atau Tongkol) dan tekan tombol "Cari".',
      icon: '🎯',
    },
    {
      number: 3,
      title: 'Lihat Zona Potensial di Peta',
      description: 'Sistem akan menampilkan marker di peta yang menunjukkan zona potensial ikan berdasarkan data satelit. Setiap marker memiliki informasi lengkap tentang koordinat, jarak, dan potensi tangkapan.',
      icon: '🗺️',
    },
    {
      number: 4,
      title: 'Navigasi ke Titik Ikan',
      description: 'Klik pada marker ikan yang ingin Anda tuju. Sistem akan menampilkan informasi detail dan tombol "Menuju ke Titik Ini". Tekan tombol tersebut untuk mengaktifkan navigasi GPS real-time.',
      icon: '🧭',
    },
    {
      number: 5,
      title: 'Monitoring Kondisi Kapal',
      description: 'Sebelum atau sesudah melaut, gunakan fitur "Login Monitoring" untuk memantau kondisi kapal secara real-time. Masukkan kode Ship ID Anda dan pantau grafik kemiringan serta status kapal.',
      icon: '📊',
    },
    {
      number: 6,
      title: 'Perhatikan Alert Bahaya',
      description: 'Sistem akan menampilkan popup peringatan jika kapal miring lebih dari 15°. Kondisi berbahaya (>30°) akan memicu alert dengan warna merah dan notifikasi suara. Segera ambil tindakan jika menerima peringatan ini.',
      icon: '⚠️',
    },
  ];

  const features = [
    {
      icon: '📡',
      title: 'Data Satelit Real-Time',
      description: 'Menggunakan data satelit Copernicus Marine Service untuk prediksi zona ikan yang akurat.',
    },
    {
      icon: '🛰️',
      title: 'GPS Navigation',
      description: 'Navigasi GPS presisi untuk membimbing kapal ke zona ikan yang dituju.',
    },
    {
      icon: '🚨',
      title: 'Alert Keselamatan',
      description: 'Peringatan otomatis saat kapal dalam kondisi berbahaya untuk mencegah kecelakaan.',
    },
    {
      icon: '📱',
      title: 'Interface User-Friendly',
      description: 'Desain yang sederhana dan mudah digunakan bahkan untuk pengguna yang tidak tech-savvy.',
    },
  ];

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {/* Header */}
        <section className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Panduan Penggunaan JALASENA</h1>
            <p className={styles.subtitle}>
              Pelajari cara menggunakan sistem prediksi zona ikan dan monitoring kapal JALASENA
            </p>
          </div>
        </section>

        {/* Feature Overview */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Fitur Utama</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className={styles.stepsSection}>
          <h2 className={styles.sectionTitle}>Panduan Langkah Demi Langkah</h2>
          <div className={styles.stepsContainer}>
            {steps.map((step, idx) => (
              <div key={idx} className={styles.stepCard}>
                <div className={styles.stepNumber}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <span className={styles.stepCount}>{step.number}</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
                {idx < steps.length - 1 && <div className={styles.stepConnector}></div>}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Pertanyaan Umum (FAQ)</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Apa itu JALASENA?</h4>
              <p className={styles.faqAnswer}>
                JALASENA adalah sistem terintegrasi yang membantu nelayan Indonesia menemukan zona potensial ikan menggunakan data satelit dan memantau kondisi keselamatan kapal secara real-time.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Bagaimana cara mendapatkan Ship ID?</h4>
              <p className={styles.faqAnswer}>
                Hubungi dinas kelautan dan perikanan setempat atau lembaga perikanan lokal Anda. Mereka akan memberikan kode Ship ID unik untuk kapal Anda.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Apakah sistem ini gratis?</h4>
              <p className={styles.faqAnswer}>
                Ya, JALASENA dikembangkan sebagai layanan publik untuk mendukung kesejahteraan dan keselamatan nelayan Indonesia. Sistem ini gratis untuk digunakan.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Berapa akurasi prediksi zona ikan?</h4>
              <p className={styles.faqAnswer}>
                Data yang kami gunakan berasal dari satelit Copernicus yang memiliki akurasi tinggi. Namun, kondisi laut yang dinamis dapat mempengaruhi hasil prediksi. Gunakan sistem ini sebagai panduan, bukan jaminan.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Apakah saya perlu koneksi internet untuk menggunakan sistem?</h4>
              <p className={styles.faqAnswer}>
                Ya, sistem membutuhkan koneksi internet yang stabil untuk mengakses peta, data zona ikan, dan streaming monitoring kapal secara real-time. Kami menyarankan menggunakan paket data atau koneksi WiFi yang cukup.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>Bagaimana jika saya tidak mengerti teknologi?</h4>
              <p className={styles.faqAnswer}>
                JALASENA dirancang dengan antarmuka yang user-friendly dan mudah dipahami. Jika ada kesulitan, Anda bisa menghubungi layanan pelanggan atau meminta bantuan dari nelayan lain yang sudah berpengalaman.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Siap Memulai?</h2>
          <p className={styles.ctaText}>
            Gunakan sistem JALASENA sekarang untuk meningkatkan produktivitas dan keselamatan melaut Anda.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/deteksi" className={styles.btnPrimary}>
              Mulai Deteksi Zona Ikan
            </Link>
            <Link href="/login" className={styles.btnSecondary}>
              Login Monitoring
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
