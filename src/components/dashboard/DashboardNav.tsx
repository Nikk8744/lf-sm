'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  BarChart3
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard/farmer",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/farmer/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/farmer/orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    href: "/dashboard/farmer/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/farmer/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              pathname === item.href ? "bg-gray-100 text-gray-900" : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}