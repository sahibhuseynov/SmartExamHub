
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className=" w-full bg-base-200">
      <div className=" bg-base-200 max-w-6xl  mx-auto">
      <footer className="footer bg-base-200 text-base-content p-10">
    <aside>
    <Link to={'/'} className="text-3xl font-bold">Cirtdan</Link>
      <p>Müəllif hüquqları © {new Date().getFullYear()} <br/>Bütün hüquqlar qorunur Cirtdan</p>
    </aside>
    <nav>
      <h6 className="footer-title">Services</h6>
      <a className="link link-hover">Branding</a>
      <a className="link link-hover">Design</a>
      <a className="link link-hover">Marketing</a>
      <a className="link link-hover">Advertisement</a>
    </nav>
    <nav>
      <h6 className="footer-title">Company</h6>
      <a className="link link-hover">About us</a>
      <a className="link link-hover">Contact</a>
      <a className="link link-hover">Jobs</a>
      <a className="link link-hover">Press kit</a>
    </nav>
    <nav>
      <h6 className="footer-title">Legal</h6>
      <a className="link link-hover">Terms of use</a>
      <a className="link link-hover">Privacy policy</a>
      <a className="link link-hover">Cookie policy</a>
    </nav>
  </footer>
          </div>
    </div>
  )
}

export default Footer