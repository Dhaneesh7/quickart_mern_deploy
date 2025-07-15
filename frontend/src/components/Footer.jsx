// import ThemeToggle from "./ThemeToggle";
const Footer = ({theme}) => {
  return (
    <footer className={`bg-gray-800 text-white py-4 ${theme === 'dark' ? ' bg-gray-900 bg-opacity-90 text-white' : ' bg-blue-950 bg-opacity-70 text-white'}`}>
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <a href="/" className="text-white hover:text-gray-400 mx-2">Home</a>
          <a href="/about" className="text-white hover:text-gray-400 mx-2">About Us</a>
          {/* <a href="/contact" className="text-white hover:text-gray-400 mx-2">Contact</a>
          <a href="/privacy" className="text-white hover:text-gray-400 mx-2">Privacy Policy</a> */}
          </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} . All rights reserved.
        </p>
        
       
      </div>
    </footer>
  );
}
export default Footer;