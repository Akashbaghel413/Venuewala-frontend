import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'List Your Venue', href: '/onboarding/owner' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-12 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-bold text-white">
                Venue<span className="text-primary-400">wala</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              India's trusted platform for booking farmhouses, banquet halls,
              community centres, mandirs and more across Delhi NCR.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>support@venuewala.in</p>
              <p>+91 98765 43210</p>
              <p>New Delhi, India</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Venuewala. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
