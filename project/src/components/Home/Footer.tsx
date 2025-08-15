import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin as LinkedIn,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useMouseFollower } from "../../contexts/MouseFollowerContext";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { setTalkText } = useMouseFollower();
  const currentYear = new Date().getFullYear();

  const scrollToServices = () => {
    const section = document.getElementById("services");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white mix-blend-overlay animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white mix-blend-overlay animate-float2"></div>
      </div>

      <div id="footer" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link 
              to="/" 
              className="flex items-center space-x-3"
              onMouseEnter={() => setTalkText("Your trusted service partner")}
              onMouseLeave={() => setTalkText(null)}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold">सेवासेतु</span>
            </Link>
            <p 
              className="text-gray-400 text-sm leading-relaxed"
              onMouseEnter={() => setTalkText("Quality services at your doorstep")}
              onMouseLeave={() => setTalkText(null)}
            >
              Your trusted partner for professional home services. Quality,
              convenience, and reliability at your doorstep.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={16} />, text: "Follow us on Facebook", url: "https://facebook.com" },
                { icon: <Twitter size={16} />, text: "Follow us on Twitter", url: "https://twitter.com" },
                { icon: <Instagram size={16} />, text: "Follow us on Instagram", url: "https://instagram.com" },
                { icon: <LinkedIn size={16} />, text: "Connect on LinkedIn", url: "https://linkedin.com" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-700 hover:border-white"
                  onMouseEnter={() => setTalkText(social.text)}
                  onMouseLeave={() => setTalkText(null)}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 
              className="text-lg font-semibold mb-6"
              onMouseEnter={() => setTalkText("Explore our services")}
              onMouseLeave={() => setTalkText(null)}
            >
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Home Cleaning",
                "Repairs & Maintenance",
                "Beauty & Wellness",
                "Electrical Services",
                "Plumbing",
                "Painting",
              ].map((service, index) => (
                <li key={index}>
                  <button
                    onClick={scrollToServices}
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={() => setTalkText(`Book ${service} service`)}
                    onMouseLeave={() => setTalkText(null)}
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 
              className="text-lg font-semibold mb-6"
              onMouseEnter={() => setTalkText("Learn about our company")}
              onMouseLeave={() => setTalkText(null)}
            >
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                  onMouseEnter={() => setTalkText("Our story and mission")}
                  onMouseLeave={() => setTalkText(null)}
                >
                  About Us
                </Link>
              </li>
              {[
                { text: "Careers", hover: "Join our team", link: "/about" },
                { text: "Press", hover: "Latest news about us", link: "/press" },
                { text: "Partners", hover: "Our trusted partners", link: "/partners" },
                { text: "Join as Provider", hover: "Become a service provider", link: "/provider" },
                { text: "Investor Relations", hover: "Information for investors", link: "/investors" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link}
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={() => setTalkText(item.hover)}
                    onMouseLeave={() => setTalkText(null)}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 
              className="text-lg font-semibold mb-6"
              onMouseEnter={() => setTalkText("Get in touch with us")}
              onMouseLeave={() => setTalkText(null)}
            >
              Contact Info
            </h3>
            <div className="space-y-4 text-sm">
              <div 
                className="flex items-center space-x-3"
                onMouseEnter={() => setTalkText("Call us anytime")}
                onMouseLeave={() => setTalkText(null)}
              >
                <Phone className="w-5 h-5 text-white" />
                <span className="text-gray-400">+91 7905361332, +91 7599015656</span>
              </div>
              <div 
                className="flex items-center space-x-3"
                onMouseEnter={() => setTalkText("Email us for inquiries")}
                onMouseLeave={() => setTalkText(null)}
              >
                <Mail className="w-5 h-5 text-white" />
                <span className="text-gray-400">contact@sewasetu.com</span>
              </div>
              <div 
                className="flex items-center space-x-3"
                onMouseEnter={() => setTalkText("Visit our headquarters")}
                onMouseLeave={() => setTalkText(null)}
              >
                <MapPin className="w-5 h-5 text-white" />
                <span className="text-gray-400">Gomtinagar, Lucknow, UP</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 
                className="font-medium mb-3"
                onMouseEnter={() => setTalkText("Get the latest updates")}
                onMouseLeave={() => setTalkText(null)}
              >
                Stay Updated
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-600 border border-gray-700"
                  onMouseEnter={() => setTalkText("Get news and offers")}
                  onMouseLeave={() => setTalkText(null)}
                />
                <button 
                  className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-r-lg transition-colors font-medium"
                  onMouseEnter={() => setTalkText("Subscribe to our newsletter")}
                  onMouseLeave={() => setTalkText(null)}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div 
              className="text-sm text-gray-400"
              onMouseEnter={() => setTalkText("All rights reserved")}
              onMouseLeave={() => setTalkText(null)}
            >
              © {currentYear} सेवासेतु. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              {[
                { text: "Privacy Policy", hover: "View our privacy policy", link: "/privacy" },
                { text: "Terms of Service", hover: "Read our terms of service", link: "/terms" },
                { text: "Cookie Policy", hover: "Learn about our cookie usage", link: "/cookies" }
              ].map((item, index) => (
                <Link 
                  key={index}
                  to={item.link}
                  className="text-gray-400 hover:text-white transition-colors"
                  onMouseEnter={() => setTalkText(item.hover)}
                  onMouseLeave={() => setTalkText(null)}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;