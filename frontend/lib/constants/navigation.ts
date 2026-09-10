export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  badgeVariant?: "red" | "orange" | "neutral";
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    iconName: "LayoutDashboard",
  },
  {
    title: "Risk Map",
    href: "/dashboard/map",
    iconName: "Map",
    badge: "GIS",
    badgeVariant: "neutral",
  },
  {
    title: "Habitations",
    href: "/dashboard/habitations",
    iconName: "Building2",
  },
  {
    title: "Safe Sites",
    href: "/dashboard/safe-sites",
    iconName: "ShieldCheck",
  },
  {
    title: "Relocation",
    href: "/dashboard/relocation",
    iconName: "ArrowRightLeft",
  },
  {
    title: "Carrying Capacity",
    href: "/dashboard/capacity",
    iconName: "Boxes",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    iconName: "BarChart3",
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    iconName: "AlertTriangle",
    badge: "16",
    badgeVariant: "red",
  },
  {
    title: "Action Center",
    href: "/dashboard/actions",
    iconName: "Zap",
    badge: "37",
    badgeVariant: "orange",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    iconName: "Settings",
  },
];
