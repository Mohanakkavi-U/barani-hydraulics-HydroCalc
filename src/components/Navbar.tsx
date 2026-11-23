import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Info, Phone } from 'lucide-react';

  /**
   * A navigation bar component.
   *
   * This component renders a navigation bar with a logo, home, about, and contact links.
   *
   * @return {JSX.Element} The navigation bar component.
   */
const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <img 
                  src="logo.png"
                  alt="Barani Hydraulics"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'logo.png'; // fallback to local logo
                  }}
                />
              </div>
              <span className="text-xl font-bold text-gray-800">BARANI HYDRAULICS</span>
            </Link>
          </div>
 
          <div className="flex space-x-4">
            <Link to="/" className="nav-link">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/about" className="nav-link">
              <Info size={20} />
              <span>About</span>
            </Link>
            <Link to="/contact" className="nav-link">
              <Phone size={20} />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;