import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Footer = () => {
  // Keep handleExternalClick for social media links if they are not meant to be functional
  const handleExternalClick = (e) => {
    e.preventDefault();
    toast('This is a demo link.');
  };

  return (
    <footer className="bg-[var(--accent)] p-10 rounded-t-2xl w-full text-black mt-auto" aria-label="Footer Navigation">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <h4 className="text-lg font-bold text-white mb-3">BazzarNet</h4>
          <p className="text-sm text-gray-800">Your one-stop solution for shopping from local stores with fast doorstep delivery.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Company</h4>
          <Link to="/about" className="block hover:text-gray-100 text-sm mb-2" aria-label="About Us page">About Us</Link>
          <Link to="/faq" className="block hover:text-gray-100 text-sm mb-2" aria-label="Frequently Asked Questions page">FAQ</Link>
          <Link to="/careers" className="block hover:text-gray-100 text-sm" aria-label="Careers page">Careers</Link> {/* UPDATED */}
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Support</h4>
          <Link to="/help" className="block hover:text-gray-100 text-sm mb-2" aria-label="Help Center page">Help Center</Link> {/* UPDATED */}
          <Link to="/contact-us" className="block hover:text-gray-100 text-sm" aria-label="Contact Us page">Contact Us</Link> {/* UPDATED */}
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Legal</h4>
          <Link to="/privacy-policy" className="block hover:text-gray-100 text-sm mb-2" aria-label="Privacy Policy page">Privacy Policy</Link> {/* UPDATED */}
          <Link to="/terms-of-service" className="block hover:text-gray-100 text-sm" aria-label="Terms of Service page">Terms of Service</Link> {/* UPDATED */}
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-5 border-t border-black/20 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-800 mb-4 sm:mb-0">© 2025 BazzarNet. All rights reserved.</p>
        <div className="flex gap-5">
          <a href="#" onClick={handleExternalClick} className="text-xl hover:text-gray-100 transition-transform hover:scale-110" aria-label="Twitter (demo link)"><FontAwesomeIcon icon={faTwitter} aria-hidden="true" /></a>
          <a href="#" onClick={handleExternalClick} className="text-xl hover:text-gray-100 transition-transform hover:scale-110" aria-label="Facebook (demo link)"><FontAwesomeIcon icon={faFacebook} aria-hidden="true" /></a>
          <a href="#" onClick={handleExternalClick} className="text-xl hover:text-gray-100 transition-transform hover:scale-110" aria-label="Instagram (demo link)"><FontAwesomeIcon icon={faInstagram} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;