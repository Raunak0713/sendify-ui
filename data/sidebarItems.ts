import { LayoutDashboard, FileText, CreditCard, Terminal } from "lucide-react";

export const sidebarItems = [
  {
    label: "Projects",
    icon: LayoutDashboard,
    link: "/dashboard/projects",
  },
  {
    label: "Docs",
    icon: FileText,
    link: "/dashboard/docs",
  },
  {
    label: "Billing",
    icon: CreditCard,
    link: "/dashboard/billing",
  },
  {
    label: "Playground",
    icon: Terminal,
    link: "/dashboard/playground",
  },
];
