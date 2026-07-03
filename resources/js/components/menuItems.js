import {
  LayoutDashboard,
  Newspaper,
  Wallet,
  Users,
  Tag,
} from "lucide-react";

export const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Berita Manajement", href: "/admin/berita", icon: Newspaper },
  { name: "Keuangan", href: "/keuangan", icon: Wallet },
  { name: "Iklan Manajement", href: "/admin/iklan", icon: Tag },
  { name: "User Manajement", href: "/admin/user", icon: Users },
];