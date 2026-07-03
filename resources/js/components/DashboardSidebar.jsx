import { Link, usePage } from "@inertiajs/react";
import { LogOut, X } from "lucide-react";
import { menuItems } from "../components/menuItems";

export default function DashboardSidebar({ isOpen, onClose }) {
  const { url } = usePage();
  const isActive = (href) => url === href || url.startsWith(href + "/");

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-shrink-0 transform flex-col bg-white shadow-sm transition-transform duration-200 ease-in-out
        md:static md:z-auto md:w-56 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <img src="/logo-hijau.svg" alt="Masjid Al Anhar" className="h-16 w-auto" />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 md:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-100 px-3 py-4">
          <Link
            href="/logout"
            method="post"
            as="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}