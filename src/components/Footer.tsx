"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-linear-to-r from-green-600 via-green-700 to-green-800 text-white mt-20"
    >
      <div className="w-[90%] md:w-[85%] max-w-7xl mx-auto pt-12 pb-8">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40 pb-10">
          {/* Column 1: Brand Info & Social Icons */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-wide">Snapcart</h2>
            <p className="text-sm text-green-100 leading-relaxed max-w-sm">
           Your ultimate shopping destination for premium quality products and swift delivery.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-green-500/30 hover:bg-white hover:text-green-700 rounded-full transition-all"
              >
                <FaFacebook size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-green-500/30 hover:bg-white hover:text-green-700 rounded-full transition-all"
              >
                <BsInstagram size={18} />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 bg-green-500/30 hover:bg-white hover:text-green-700 rounded-full transition-all"
              >
                <BsTwitter size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 bg-green-500/30 hover:bg-white hover:text-green-700 rounded-full transition-all"
              >
                <LiaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white hover:underline transition-all"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white hover:underline transition-all"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/my-orders"
                  className="hover:text-white hover:underline transition-all"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

       
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-3 text-green-100 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-green-300" />
                <span>+92 300 0000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-green-300" />
                <span>support@snapcart.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-green-300 mt-1" />
                <span>High Street (Main Market), Sahiwal, Punjab, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-green-200">
          © {new Date().getFullYear()} Snapcart. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
