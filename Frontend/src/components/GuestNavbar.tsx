import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import l from "../components/l.png"; // logo

type Model = {
  value: string;
  label: string;
  status: 'current' | 'coming' | 'planned';
  subtitle?: string;
  description?: string;
};

const models: Model[] = [
  {
    value: "model-x",
    label: "Zektra VaultX",
    status: "current",
    subtitle: "Now",
   
  },
  {
    value: "genesis",
    label: "CipherCore Genesis",
    status: "coming",
    subtitle: "Q4 2026",
   
  },
  {
    value: "nova",
    label: "CipherCore Nova",
    status: "planned",
    subtitle: "Planning",
    
  },
];

export const GuestNavbar = () => {
  const navigate = useNavigate();

  // State for selector, default to Model X
  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Left - Brand & Model Selector */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            href="/"
            className="flex justify-start items-center gap-1"
            color="foreground"
          >
            <img
              src={l}
              alt="VaultX Logo"
              className="w-10 h-10 object-contain"
              style={{ minWidth: "32px" }}
            />
          </Link>

          {/* Model Selector Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-default-900 shadow-sm font-semibold text-violet-700 dark:text-violet-200 hover:shadow-lg focus:outline-none"
            >
              {selectedModel.label}
              <span className="ml-1 text-xs font-medium bg-green-100 text-green-700 rounded px-2 py-0.5"
                style={{ display: selectedModel.status === "current" ? "inline" : "none" }}>
                Now
              </span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div className="z-20 absolute left-0 mt-1 min-w-[250px] w-max bg-white dark:bg-default-950 border border-gray-200 dark:border-default-800 shadow-xl rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
              {models.map((model) => (
                <div
                  key={model.value}
                  onClick={() => {
                    if (model.status === "current") {
                      setSelectedModel(model);
                    }
                  }}
                  className={`flex flex-col px-4 py-3 cursor-pointer rounded-lg
                    ${model.status !== "current" ? "opacity-60 cursor-not-allowed" : "hover:bg-violet-50 dark:hover:bg-violet-900"}
                    ${model.value === selectedModel.value ? "bg-violet-100 dark:bg-violet-800" : ""}
                  `}
                >
                  <span className={`font-bold text-[15px] ${
                    model.status === "current" ? "text-violet-700 dark:text-violet-300" : "text-gray-700 dark:text-gray-200"
                  }`}>
                    {model.label}
                    {model.status === "current" && (
                      <span className="ml-2 text-xs font-semibold bg-green-100 text-green-700 rounded px-1.5 py-0.5">Now</span>
                    )}
                    {model.status === "coming" && (
                      <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-700 rounded px-1.5 py-0.5">
                        Q4 2026
                      </span>
                    )}
                    {model.status === "planned" && (
                      <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-700 rounded px-1.5 py-0.5">
                        Planning
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {model.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Right */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden md:flex gap-2">
          <Button
            className="text-sm font-normal"
            onClick={() => navigate('/login')}
            variant="light"
          >
            Login
          </Button>
          <Button
            className="text-sm font-medium"
            onClick={() => navigate('/signup')}
            color="primary"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Icons */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <Button
              fullWidth
              onClick={() => navigate('/login')}
              variant="light"
              className="justify-start"
            >
              Login
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button
              fullWidth
              onClick={() => navigate('/signup')}
              color="primary"
              className="justify-start"
            >
              Sign Up
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
