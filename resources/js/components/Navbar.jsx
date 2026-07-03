import { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { LogIn, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Berita", href: "/berita" },
  { label: "Qur'an Online", href: "/quran" },
  { label: "Zakat", href: "/zakat" },
  { label: "Qurban", href: "/qurban" },
];

// Hook: Auto Hide Navbar
function useAutoHideNavbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY.current;

      setScrolled(currentY > 10);

      if (currentY < 80) {
        setVisible(true);
      } else if (diff > 5) {
        setVisible(false);
      } else if (diff < -5) {
        setVisible(true);
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { visible, scrolled };
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();
  const { visible, scrolled } = useAutoHideNavbar();

  const isActive = (href) => {
    return url === href || url.startsWith(href + "/");
  };

  return (
    <>
      <div className="h-20" />
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white border-b transition-all duration-300 ease-in-out ${
          scrolled ? "border-gray-200 shadow-sm" : "border-transparent"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <nav className="content px-6 flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logo-hijau.svg"
              alt="Logo Masjid Al Anhar"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);

              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`text-[16px] transition-all duration-200 ${
                      active
                        ? "text-primary font-semibold border-b-2 border-primary pb-1"
                        : "text-primary hover:opacity-80"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-primary hover:opacity-90 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <span>Login</span>
            <LogIn className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden flex flex-col gap-1.5"
            aria-label="Open Menu"
          >
            <span className="w-6 h-0.5 bg-primary rounded-full" />
            <span className="w-6 h-0.5 bg-primary rounded-full" />
            <span className="w-6 h-0.5 bg-primary rounded-full" />
          </button>
        </nav>
      </header>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-5 py-4 border-b border-gray-100">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
            className="p-1 text-gray-500 hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="flex-1 px-5 py-2">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);

            return (
              <li
                key={label}
                className="border-b border-gray-100 last:border-none"
              >
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 text-base transition-colors ${
                    active
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-5 border-t border-gray-100">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white text-sm font-medium px-5 py-3 rounded-lg transition-all duration-200"
          >
            <span>Login</span>
            <LogIn className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;