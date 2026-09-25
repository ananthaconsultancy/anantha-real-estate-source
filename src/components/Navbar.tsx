import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "Projects", href: "/projects" },
    { name: "Commercials", href: "/commercials" },
    { name: "Services", href: "/services" },
    { name: "Property Intelligence", href: "/property-intelligence" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const activeLink = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 h-[76px] flex items-center gap-8">
        <Link to="/" className="shrink-0 flex items-center" aria-label="Anantha Real Estate home">
          <img src={logo} alt="Anantha Real Estate Consultancy" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        <nav className="hidden xl:flex items-center gap-6 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`relative py-7 text-[13px] font-semibold transition-colors ${
                activeLink(link.href)
                  ? "text-slate-950"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {link.name}
              {activeLink(link.href) && (
                <span className="absolute left-0 right-0 bottom-[17px] h-0.5 bg-slate-950" />
              )}
            </Link>
          ))}
        </nav>

        <Link
          to="/property-consultation"
          className="hidden xl:inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Get in Touch <ArrowRight size={16} />
        </Link>

        <button
          className="xl:hidden ml-auto p-2 rounded-xl text-slate-900"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-100 shadow-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3.5 text-sm font-semibold border-b border-slate-100 last:border-0 ${
                  activeLink(link.href) ? "text-slate-950" : "text-slate-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/property-consultation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white"
            >
              Get in Touch <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
