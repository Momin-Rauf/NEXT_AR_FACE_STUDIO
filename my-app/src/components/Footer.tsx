import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-white text-black">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        {/* Logo Section */}
        <div className="mb-6 flex flex-col items-start">
          <img src="/walee-logo.png" alt="Company Logo" className="w-32 h-auto mb-4" />
          <p className="text-sm font-light">© 2024 Your Company. All rights reserved.</p>
        </div>

        {/* Services Navigation */}
        <nav className="mb-6 flex gap-3 flex-col">
          <h6 className="footer-title text-lg font-semibold mb-4">Services</h6>
          <a className="font-light link link-hover hover:text-[#ff275b] transition duration-200">Branding</a>
          <a className="font-light link link-hover hover:text-[#ff275b] transition duration-200">Design</a>
          <a className="font-light link link-hover hover:text-[#ff275b] transition duration-200">Marketing</a>
          <a className="font-light link link-hover hover:text-[#ff275b] transition duration-200">Advertisement</a>
        </nav>

        {/* Company Navigation */}
        <nav className="mb-6 flex flex-col gap-3">
          <h6 className="footer-title text-lg font-semibold mb-4">Company</h6>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">About Us</a>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">Contact</a>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">Jobs</a>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">Press Kit</a>
        </nav>

        {/* Legal Navigation */}
        <nav className="mb-6 flex flex-col gap-3">
          <h6 className="footer-title text-lg font-semibold mb-4">Legal</h6>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">Terms of Use</a>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">Privacy Policy</a>
          <a className="link font-light link-hover hover:text-[#ff275b] transition duration-200">Cookie Policy</a>
        </nav>

        {/* Social Media Links */}
        <div className="mb-6 flex flex-col gap-4">
          <h6 className="footer-title text-lg font-semibold mb-4">Follow Us</h6>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-[#ff275b] transition duration-200">
              <FaFacebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-[#ff275b] transition duration-200">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-[#ff275b] transition duration-200">
              <FaInstagram size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-[#ff275b] transition duration-200">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
