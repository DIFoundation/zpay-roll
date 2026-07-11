import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
} from "lucide-react";

import { ROUTES } from "./routes";

export const navigation = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Payroll",
    href: ROUTES.PAYROLL,
    icon: CreditCard,
  },
  {
    title: "Wallets",
    href: ROUTES.WALLETS,
    icon: Wallet,
  },
  {
    title: "Transactions",
    href: ROUTES.TRANSACTIONS,
    icon: Receipt,
  },
  {
    title: "Analytics",
    href: ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];