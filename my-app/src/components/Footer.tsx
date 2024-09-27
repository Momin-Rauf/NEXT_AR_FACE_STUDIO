

const Footer = () => {
 

  return (
    <footer className="footer gap-96   text-black bg-white">
 
  <nav className="text-xl" >
    <h6 className="footer-title">Services</h6>
    <a className=" font-light link link-hover">Branding</a>
    <a className=" font-light link link-hover">Design</a>
    <a className=" font-light link link-hover">Marketing</a>
    <a className=" font-light link link-hover">Advertisement</a>
  </nav>
  <nav className="text-xl" >
    <h6 className="footer-title">Company</h6>
    <a className="link font-light link-hover">About us</a>
    <a className="link font-light link-hover">Contact</a>
    <a className="link font-light link-hover">Jobs</a>
    <a className="link font-light link-hover">Press kit</a>
  </nav>
  <nav className="text-xl" >
    <h6 className="footer-title">Legal</h6>
    <a className="link font-light link-hover">Terms of use</a>
    <a className="link font-light link-hover">Privacy policy</a>
    <a className="link font-light link-hover">Cookie policy</a>
  </nav>
</footer>
     );
};

export default Footer;
