import React, { useEffect, useState } from 'react';
import './App.css';

// --- Dynamic Data Mappings ---
const NAV_LINKS = [
  { label: 'Beranda', href: '#home' },
  { label: 'Kisah Kami', href: '#about' },
  { label: 'Koleksi Lengkap', href: '#products' },
  { label: 'Ulasan', href: '#testimonials' },
];

const PRODUCTS = [
  { id: 1, name: 'Gamis Abaya Elegan', price: 'Rp 399.000', image: '/gamis.jfif' },
  { id: 2, name: 'Kebaya Muslimah Modern', price: 'Rp 450.000', image: '/kebaya.jfif' },
  { id: 3, name: 'Niqab / Cadar Premium', price: 'Rp 89.000', image: '/cadar.jfif' },
  { id: 4, name: 'Halal Matte Lip Cream', price: 'Rp 89.000', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Kuteks Halal', price: 'Rp 55.000', image: '/kuku.jfif' },
  { id: 6, name: 'Bedak Flawless', price: 'Rp 189.000', image: '/bedak.jfif' },
  { id: 7, name: 'Mukena Travel Premium', price: 'Rp 275.000', image: '/mukena.webp' },
  { id: 8, name: 'Sajadah Eksklusif', price: 'Rp 210.000', image: '/sajadah.jfif' },
];

const TESTIMONIALS = [
  { id: 1, author: 'Siti Aisyah', text: 'Pashminanya sangat lembut dan mudah dibentuk. Makeup halalnya juga tahan lama walau dipakai wudu berkali-kali.', stars: '★★★★★' },
  { id: 2, author: 'Fatimah Z.', text: 'Gamis abayanya sangat elegan! Pas sekali untuk acara formal maupun santai. Sangat merekomendasikan mukena travelnya juga.', stars: '★★★★★' },
  { id: 3, author: 'Nadia', text: 'Cushionnya ringan dan menutupi noda dengan sempurna. Belanja semua perlengkapan muslimah jadi sangat praktis di satu tempat.', stars: '★★★★☆' },
];

const PRESS_LOGOS = ['HIJABERS MAG', 'MUSLIMAH DAILY', "ZALORA", 'HIJAB FASHION', 'HIJABERS MAG', 'MUSLIMAH DAILY', "ZALORA", 'HIJAB FASHION'];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  // Cart & Auth States - persistent using localStorage
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('aura-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura-user', JSON.stringify(user));
  }, [user]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
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
    setCart([]);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
    return total + price;
  }, 0);

  const formatPrice = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="brand-logo">AURA MUSLIMAH</div>
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </div>
          <div className="nav-actions">
            {user ? (
              <div className="user-info">
                <span className="user-greeting">Hai, {user.name}!</span>
                <button className="btn-logout" onClick={handleLogout} title="Keluar">Keluar</button>
              </div>
            ) : (
              <button className="btn-auth" onClick={() => setIsLoginOpen(true)}>Check In</button>
            )}
            <button className="btn-cart" onClick={() => setIsCartOpen(true)}>
              <span className="cart-icon">🛒</span>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Keanggunan Syar'i Masa Kini</h1>
          <p>Temukan harmoni sempurna dari busana modest, kosmetik halal bersertifikat, dan perlengkapan ibadah premium untuk melengkapi hari-hari indah Anda.</p>
          <a href="#products" className="btn btn-gold">Lihat Koleksi Kami</a>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="marquee-section">
        <div className="marquee-content">
          {PRESS_LOGOS.map((logo, index) => (
            <span key={index}>✿ AS SEEN IN {logo}</span>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="section about">
        <div className="container">
          <h2 className="section-title">Filosofi Aura</h2>
          <div className="about-content">
            <div className="about-image">
              <img src="about.jfif" alt="Aura Muslimah Filosofi" />
            </div>
            <div className="about-text">
              <h3>Kecantikan Dalam Balutan Ketaatan</h3>
              <p>Di Aura Muslimah, kami percaya bahwa Anda tidak perlu mengorbankan keyakinan untuk tampil menawan. Setiap produk dirancang dengan mengutamakan prinsip kenyamanan, *modesty* (kesopanan), dan kesucian (halal).</p>
              <p>Dari helai sutra hijab terbaik, formulasi kosmetik yang aman dan *wudu-friendly*, hingga sajadah yang menenangkan ibadah Anda, kami hadir untuk melengkapi perjalanan anggun Anda sebagai Muslimah modern.</p>
              <a href="#about" className="btn btn-primary">Baca Kisah Kami</a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section products">
        <div className="container">
          <h2 className="section-title">Koleksi Lengkap</h2>
          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <button className="btn btn-primary" onClick={() => addToCart(product)}>Tambah ke Keranjang</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <h2 className="section-title">Cerita Mereka</h2>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="stars">{testimonial.stars}</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">- {testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2>Bergabung dengan Klub VIP Aura</h2>
          <p>Dapatkan informasi diskon produk hijab terbaru, rilis makeup halal, dan bonus menarik khusus member.</p>

          {subscribed ? (
            <div className="vip-success">✿ Selamat Bergabung! Rahmat dan keanggunan menanti Anda.</div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Masukkan alamat email Anda..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Daftar Sekarang</button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h2>AURA MUSLIMAH</h2>
              <p>Mendefinisikan ulang kemewahan muslimah dengan mempertahankan batas-batas ketakwaan dan keanggunan sejati.</p>
            </div>
            <div className="footer-links">
              <h4>Jelajahi</h4>
              <ul>
                {NAV_LINKS.map(link => (
                  <li key={link.label}><a href={link.href}>{link.label}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-links">
              <h4>Bantuan</h4>
              <ul>
                <li><a href="#">Hubungi Kami</a></li>
                <li><a href="#">Pengiriman & Retur</a></li>
                <li><a href="#">Tanya Jawab (FAQ)</a></li>
                <li><a href="#">Sertifikasi Halal</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Aura Muslimah. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginOpen(false)}>&times;</button>
            <h2>Check In ke Aura</h2>
            <p>Silakan masuk untuk pengalaman belanja yang lebih personal.</p>
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={loginForm.email} 
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})} 
                  required 
                  placeholder="name@example.com"
                />
              </div>
              <div className="form-group">
                <label>Kata Sandi</label>
                <input 
                  type="password" 
                  value={loginForm.password} 
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
                  required 
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Masuk Sekarang</button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Keranjang Belanja</h3>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Keranjang Anda masih kosong.</p>
              <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>Mulai Belanja</button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                    <button className="remove-item" onClick={() => removeFromCart(item.cartId)}>Hapus</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button className="btn btn-gold btn-block" onClick={() => setIsCheckoutOpen(true)}>Lanjut ke Checkout</button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsCheckoutOpen(false)}>&times;</button>
            {orderSuccess ? (
              <div className="order-success">
                <div className="success-icon">✓</div>
                <h2>Pesanan Berhasil!</h2>
                <p>Terima kasih telah berbelanja di Aura Muslimah. Kami akan segera memproses pesanan Anda.</p>
              </div>
            ) : (
              <>
                <h2>Selesaikan Pesanan</h2>
                <div className="checkout-summary">
                  <p>Anda memesan {cart.length} item dengan total <strong>{formatPrice(cartTotal)}</strong></p>
                </div>
                <form onSubmit={handleCheckout} className="checkout-form">
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={checkoutForm.name} 
                      onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Alamat Pengiriman</label>
                    <textarea 
                      rows="3"
                      value={checkoutForm.address} 
                      onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} 
                      required 
                      placeholder="Contoh: Jl. Mawar No. 10, RT 02/RW 05, Kec. Menteng, Jakarta Pusat 10310"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      value={checkoutForm.phone} 
                      onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Buat Pesanan Sekarang</button>
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
