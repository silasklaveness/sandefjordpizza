import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">
              Sandefjord Pizza
            </h3>
            <p className="mb-4">
              Experience authentic Italian flavors with our diverse menu and
              exceptional service.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6 hover:text-yellow-400 transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6 hover:text-yellow-400 transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6 hover:text-yellow-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/reservations"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Reservations
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-yellow-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">
              Customer Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/account/login"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/account/register"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Registrer
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-yellow-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Peter Castbergs gate 9, 3210 Sandefjord</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-yellow-400" />
                <a
                  href="tel:+4733463050"
                  className="hover:text-yellow-400 transition-colors"
                >
                  +47 334 63 050
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow-400" />
                <a
                  href="mailto:info@sandefjordpizza.com"
                  className="hover:text-yellow-400 transition-colors"
                >
                  info@sandefjordpizza.com
                </a>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Mon-Sun: 11AM - 11PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}

        {/* Copyright and Additional Links */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Sandefjord Pizza. All rights reserved.</p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
