
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className=" w-full bg-base-200">
      <div className=" bg-base-200 max-w-6xl  mx-auto">
      <footer className="footer bg-base-200 text-base-content py-10 px-7">
    <aside>
    <Link to={'/'} className="text-3xl font-bold">Bala Bebir</Link>
      <p>Müəllif hüquqları © {new Date().getFullYear()} <br/>Bütün hüquqlar qorunur Bala Bebir</p>
    </aside>
    <nav>
      <h6 className="footer-title">Servislər</h6>
      <Link to="/" className=" link-hover">İmtahanlar</Link>
      <Link to="/blog" className=" link-hover">Bloq</Link>
      
    </nav>
    <nav>
      <h6 className="footer-title">Faydalı Linklər</h6>
      <Link to='/aboutUs' className=" link-hover">Haqqımızda</Link>
      <Link to='/rewards' className=" link-hover">Hədiyyələr</Link>
      <Link to='/contact' className=" link-hover">Bizimlə Əlaqə</Link>
     
    </nav>
    <nav>
      <h6 className="footer-title">Dəstək</h6>
      <Link to='/termsOfUse' className="link-hover">İstifadə Şərtləri</Link>
      <Link to='/privacyPolicy' className="link-hover">Məxfilik Siyasəti</Link>
      <Link to='/paymentConditions' className="link-hover">Ödəniş Şərtləri və Qaydaları </Link>
      
    </nav>
  </footer>
          </div>
    </div>
  )
}

export default Footer