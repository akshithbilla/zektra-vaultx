import {
  HomeIcon,
  ArrowUpTrayIcon ,
  CurrencyDollarIcon ,
  ServerIcon,
} from "@heroicons/react/24/outline";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
        {
      label: "Encrypt",
      href: "/Encrypt",
      icon: ArrowUpTrayIcon ,
    },
    {
      label: " My Vault",
      href: "/myvault",
      icon: ServerIcon,
    },

    {
      label: "Upgarde",
      href: "/upgrade",
      icon: CurrencyDollarIcon  ,
    },
    {/*
      label: "About",
      href: "/about",
    */}
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "My Data",
      href: "/docs",
    },
    {
      label: "Upload",
      href: "/blog",
    },
    {
      label: "Upgarde",
      href: "/upgrade",
      icon: CurrencyDollarIcon  ,
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
