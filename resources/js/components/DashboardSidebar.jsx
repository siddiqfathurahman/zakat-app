import { Link } from "@inertiajs/react";
import {
  LayoutDashboard,
  Newspaper,
  Wallet,
  Users,
  LogOut,
} from "lucide-react";


const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Keuangan", href: "/keuangan", icon: Wallet },
  { name: "User", href: "/admin/user", icon: Users },
];

export default function DashboardSidebar() {
  const isActive = (href) =>
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col bg-white shadow-sm">

      <div className="px-5 pb-4 pt-6">
        <img src="/logo-hijau.svg" alt="Masjid Al Anhar" className="h-16 w-auto" />
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
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
  );
}