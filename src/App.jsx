import React, { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';

const NAV_LINKS = [
  { label: 'Beranda', href: '#home' },
  { label: 'Kisah Kami', href: '#about' },
  { label: 'Koleksi Lengkap', href: '#products' },
  { label: 'Ulasan', href: '#testimonials' },
];

const PRODUCTS = [
  { id: 1, name: 'Gamis Abaya Elegan', price: 'Rp 399.000', image: '/gamis.jfif', desc: 'Busana formal syar\'i dengan bahan premium yang nyaman dipakai seharian.' },
  { id: 2, name: 'Kebaya Muslimah Modern', price: 'Rp 450.000', image: '/kebaya.jfif', desc: 'Kebaya cantik dengan sentuhan modern, cocok untuk acara spesial Anda.' },
  { id: 3, name: 'Niqab / Cadar Premium', price: 'Rp 89.000', image: '/cadar.jfif', desc: 'Cadar lembut dengan bahan breathable, nyaman dan tetap stylish.' },
  { id: 4, name: 'Halal Matte Lip Cream', price: 'Rp 89.000', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop', desc: 'Lip cream halal dengan pigmentasi tinggi dan finish matte yang tahan lama.' },
  { id: 5, name: 'Kuteks Halal', price: 'Rp 55.000', image: '/kuku.jfif', desc: 'Kuteks halal breathable yang tetap cantik dan mudah dibersihkan.' },
  { id: 6, name: 'Bedak Flawless', price: 'Rp 189.000', image: '/bedak.jfif', desc: 'Bedak tabur halus dengan coverage sempurna untuk wajah cerah alami.' },
  { id: 7, name: 'Mukena Travel Premium', price: 'Rp 275.000', image: '/mukena.webp', desc: 'Mukena travel ringan dengan bahan satin premium, praktis dibawa kemana-mana.' },
  { id: 8, name: 'Sajadah Eksklusif', price: 'Rp 210.000', image: '/sajadah.jfif', desc: 'Sajadah empuk dengan motif elegan, menambah kenyamanan ibadah Anda.' },
];

const TESTIMONIALS = [
  { id: 1, author: 'Siti Aisyah', text: 'Pashminanya sangat lembut dan mudah dibentuk. Makeup halalnya juga tahan lama walau dipakai wudu berkali-kali.', stars: 5 },
  { id: 2, author: 'Fatimah Z.', text: 'Gamis abayanya sangat elegan! Pas sekali untuk acara formal maupun santai. Sangat merekomendasikan mukena travelnya juga.', stars: 5 },
  { id: 3, author: 'Nadia', text: 'Cushionnya ringan dan menutupi noda dengan sempurna. Belanja semua perlengkapan muslimah jadi sangat praktis di satu tempat.', stars: 4 },
];

const PRESS_LOGOS = ['HIJABERS MAG', 'MUSLIMAH DAILY', 'ZALORA', 'HIJAB FASHION', 'HIJABERS MAG', 'MUSLIMAH DAILY', 'ZALORA', 'HIJAB FASHION'];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function createParticles(e) {
  const colors = ['#C9A96E', '#8B1A1A', '#E8D5B7', '#C44536', '#FFD700'];
  const btn = e.target.closest('button');
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = 6 + Math.random() * 10;
    const dx = (Math.random() - 0.5) * 80;
    const dy = -(40 + Math.random() * 60);
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = (e.clientX - rect.left) + 'px';
    particle.style.top = (e.clientY - rect.top) + 'px';
    btn.appendChild(particle);
    setTimeout(() => particle.remove(), 800);
  }
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [cartBounce, setCartBounce] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('aura-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aura-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', phone: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);

      const sections = ['home', 'about', 'products', 'testimonials'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('aura-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  useEffect(() => {
    let timer;
    if (cartBounce) {
      timer = setTimeout(() => setCartBounce(''), 600);
    }
    return () => clearTimeout(timer);
  }, [cartBounce]);

  useEffect(() => {
    if (orderSuccess) {
      const particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 1.5 + Math.random() * 2,
          color: ['#C9A96E', '#8B1A1A', '#E8D5B7', '#FFD700', '#C44536'][Math.floor(Math.random() * 5)],
          size: 6 + Math.random() * 10,
        });
      }
      setConfetti(particles);
      const t = setTimeout(() => setConfetti([]), 4000);
      return () => clearTimeout(t);
    }
  }, [orderSuccess]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (product, e) => {
    if (e) {
      createParticles(e);
    }
    setCart((prev) => [...prev, { ...product, cartId: Date.now() }]);
    setCartBounce('bounce-in');
    toggleFlip(product.id);
    setTimeout(() => setIsCartOpen(true), 400);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ email: loginForm.email, name: loginForm.email.split('@')[0] });
    setIsLoginOpen(false);
    setLoginForm({ email: '', password: '' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aura-user');
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setCart([]);
    }, 3500);
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
    return total + price;
  }, 0);

  const formatPrice = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const starRenderer = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <>
      {/* Floating Ornaments */}
      <div className="floating-ornaments" aria-hidden="true">
        <div className="ornament o1">✿</div>
        <div className="ornament o2">◈</div>
        <div className="ornament o3">✿</div>
        <div className="ornament o4">◇</div>
        <div className="ornament o5">✿</div>
      </div>

      {/* Confetti */}
      {confetti.length > 0 && (
        <div className="confetti-container">
          {confetti.map((p) => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                backgroundColor: p.color,
                width: p.size + 'px',
                height: p.size + 'px',
              }}
            />
          ))}
        </div>
      )}

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="brand-logo">
            <span className="logo-icon">✿</span> AURA MUSLIMAH
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={activeSection === link.href.slice(1) ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
                <span className="nav-indicator" />
              </a>
            ))}
          </div>

          <div className="nav-actions">
            {user ? (
              <div className="user-info">
                <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                <button className="btn-logout" onClick={handleLogout} title="Keluar">Keluar</button>
              </div>
            ) : (
              <button className="btn-auth" onClick={() => setIsLoginOpen(true)}>
                <span className="btn-auth-dot" /> Masuk
              </button>
            )}
            <button
              className={`btn-cart ${cartBounce}`}
              onClick={() => setIsCartOpen(true)}
              aria-label="Buka keranjang"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
            <button
              className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu navigasi"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="hero-particle" style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}>✿</div>
          ))}
        </div>
        <div className="hero-content reveal">
          <div className="hero-badge">Koleksi Terbaru 2026</div>
          <h1>Keanggunan Syar'i Masa Kini</h1>
          <div className="hero-divider" />
          <p>Temukan harmoni sempurna dari busana modest, kosmetik halal bersertifikat, dan perlengkapan ibadah premium untuk melengkapi hari-hari indah Anda.</p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-gold">
              <span>Lihat Koleksi Kami</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#about" className="btn btn-outline">Tentang Kami</a>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-content">
            {PRESS_LOGOS.map((logo, index) => (
              <span key={index}>
                <span className="marquee-icon">✿</span> AS SEEN IN {logo}
              </span>
            ))}
          </div>
          <div className="marquee-content">
            {PRESS_LOGOS.map((logo, index) => (
              <span key={`dup-${index}`}>
                <span className="marquee-icon">✿</span> AS SEEN IN {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="section about">
        <div className="container">
          <h2 className="section-title reveal">
            <span className="title-ornament">✿</span>
            Filosofi Aura
          </h2>
          <div className="about-content">
            <div className="about-image reveal">
              <div className="image-frame">
                <img src="/about.jfif" alt="Aura Muslimah Filosofi" />
                <div className="image-shine" />
              </div>
              <div className="about-floating-badge">
                <span className="badge-icon">✦</span>
                <span>Since 2024</span>
              </div>
            </div>
            <div className="about-text reveal">
              <h3>Kecantikan Dalam Balutan Ketaatan</h3>
              <p>Di Aura Muslimah, kami percaya bahwa Anda tidak perlu mengorbankan keyakinan untuk tampil menawan. Setiap produk dirancang dengan mengutamakan prinsip kenyamanan, <em>modesty</em> (kesopanan), dan kesucian (halal).</p>
              <p>Dari helai sutra hijab terbaik, formulasi kosmetik yang aman dan <em>wudu-friendly</em>, hingga sajadah yang menenangkan ibadah Anda, kami hadir untuk melengkapi perjalanan anggun Anda sebagai Muslimah modern.</p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Produk Terjual</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Puas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Halal</span>
                </div>
              </div>
              <button className="btn btn-primary btn-ripple">
                <span>Baca Kisah Kami</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section products">
        <div className="container">
          <h2 className="section-title reveal">
            <span className="title-ornament">✿</span>
            Koleksi Lengkap
          </h2>
          <p className="section-subtitle reveal">Setiap produk dipilih dengan cinta untuk kecantikan dan kenyamanan Anda</p>
          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className={`product-card reveal ${flippedCards[product.id] ? 'is-flipped' : ''}`}
              >
                <div className="card-inner">
                  <div className="card-front" onClick={() => toggleFlip(product.id)}>
                    <div className="product-image">
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <div className="image-overlay" />
                      <button className="flip-trigger" aria-label="Lihat detail">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 12 17 9 14"/><polyline points="15 10 12 7 9 10"/></svg>
                      </button>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">{product.price}</p>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="back-content">
                      <h3>{product.name}</h3>
                      <p className="back-desc">{product.desc}</p>
                      <p className="back-price">{product.price}</p>
                      <button
                        className="btn btn-primary btn-add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, e);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah ke Keranjang
                      </button>
                      <button
                        className="btn-flip-back"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlip(product.id);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
                        Kembali
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-flip-hint">
                  <span>{flippedCards[product.id] ? 'Balikkan' : 'Ketuk untuk detail'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <h2 className="section-title reveal">
            <span className="title-ornament">✿</span>
            Cerita Mereka
          </h2>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="testimonial-quote">"</div>
                <div className="stars">{starRenderer(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.author[0]}</div>
                  <span>- {t.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-bg-pattern" />
        <div className="container">
          <div className="newsletter-content reveal">
            <div className="newsletter-icon">✿</div>
            <h2>Bergabung dengan Klub VIP Aura</h2>
            <p>Dapatkan informasi diskon produk hijab terbaru, rilis makeup halal, dan bonus menarik khusus member.</p>
            {subscribed ? (
              <div className="vip-success">
                <span className="vip-check">✓</span>
                Selamat Bergabung! Rahmat dan keanggunan menanti Anda.
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <div className="newsletter-input-wrap">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Daftar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand reveal">
              <h2><span className="footer-logo-icon">✿</span> AURA MUSLIMAH</h2>
              <p>Mendefinisikan ulang kemewahan muslimah dengan mempertahankan batas-batas ketakwaan dan keanggunan sejati.</p>
              <div className="footer-social">
                <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                <a href="#" aria-label="Shopee"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12c0-2 2-4 4-4s4 2 4 4"/><path d="M8 12h8"/></svg></a>
                <a href="#" aria-label="Tokopedia"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></a>
              </div>
            </div>
            <div className="footer-links reveal">
              <h4>Jelajahi</h4>
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.label}><a href={link.href}>⟶ {link.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-links reveal">
              <h4>Bantuan</h4>
              <ul>
                <li><a href="#">⟶ Hubungi Kami</a></li>
                <li><a href="#">⟶ Pengiriman & Retur</a></li>
                <li><a href="#">⟶ Tanya Jawab (FAQ)</a></li>
                <li><a href="#">⟶ Sertifikasi Halal</a></li>
              </ul>
            </div>
            <div className="footer-links reveal">
              <h4>Jam Operasional</h4>
              <ul className="footer-hours">
                <li>Sen - Jum: 08:00 - 21:00</li>
                <li>Sabtu: 09:00 - 18:00</li>
                <li>Minggu: 10:00 - 16:00</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Aura Muslimah. Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="footer-tagline">Dibuat dengan cinta untuk setiap Muslimah di Indonesia ✿</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="modal-icon">✿</div>
            <h2>Check In ke Aura</h2>
            <p>Silakan masuk untuk pengalaman belanja yang lebih personal.</p>
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required placeholder="name@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Kata Sandi</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-ripple">
                Masuk Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Keranjang Belanja
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </h3>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <p>Keranjang Anda masih kosong.</p>
              <p className="empty-cart-hint">Yuk, mulai belanja produk-produk favorit Anda!</p>
              <button className="btn btn-gold" onClick={() => setIsCartOpen(false)}>Mulai Belanja</button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">{item.price}</p>
                    <button className="remove-item" onClick={() => removeFromCart(item.cartId)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total Pesanan</span>
              <span className="total-amount">{formatPrice(cartTotal)}</span>
            </div>
            <button className="btn btn-gold btn-block btn-ripple" onClick={() => setIsCheckoutOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Lanjut ke Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsCheckoutOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {orderSuccess ? (
              <div className="order-success">
                <div className="success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2>Pesanan Berhasil!</h2>
                <p>Terima kasih telah berbelanja di Aura Muslimah. Kami akan segera memproses pesanan Anda.</p>
                <div className="success-sparkle">✿</div>
              </div>
            ) : (
              <>
                <div className="checkout-header">
                  <div className="checkout-step active">1</div>
                  <div className="checkout-step-line" />
                  <div className="checkout-step">2</div>
                  <div className="checkout-step-line" />
                  <div className="checkout-step">3</div>
                </div>
                <h2>Selesaikan Pesanan</h2>
                <div className="checkout-summary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  <span>Anda memesan <strong>{cart.length} item</strong> dengan total <strong>{formatPrice(cartTotal)}</strong></span>
                </div>
                <form onSubmit={handleCheckout} className="checkout-form">
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input type="text" value={checkoutForm.name} onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })} required placeholder="Nama lengkap Anda" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Alamat Pengiriman</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <textarea rows="3" value={checkoutForm.address} onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })} required placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nomor WhatsApp</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <input type="tel" value={checkoutForm.phone} onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} required placeholder="08xxxxxxxxxx" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-ripple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Buat Pesanan Sekarang
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
