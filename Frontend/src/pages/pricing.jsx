import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Avatar,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

// SVG Icon for checklist
const CheckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    duration: "forever",
    description: "Essential protection for everyone",
    features: [
      "All core cryptographic vault modules",
      "Zero-knowledge privacy",
      "Per-file AES-256-GCM encryption",
      "Store passwords, notes, profile",
      "Up to 2 files total",
      "Full metadata & file name encryption",
    ],
    color: "bg-white dark:bg-default-900 border-violet-200 dark:border-default-600",
    popular: false,
  },
  {
    name: "Premium Monthly",
    price: "₹299",
    duration: "per month",
    description: "Unlock the power of CipherCore Model X",
    features: [
      "Everything in Free, plus:",
      "Payment Wallet & Digital ID modules",
      "Up to 5 files (across all vaults)",
      "All current and future modules unlocked",
      "Advanced secure sharing (upcoming)",
      "Priority support",
      "Early access to roadmap launches",
    ],
    color: "bg-violet-50/80 dark:bg-violet-950/80 border-2 border-violet-600 dark:border-violet-500 shadow-xl",
    popular: true,
  },
  {
    name: "Premium Yearly",
    price: "₹2999",
    duration: "per year",
    description: "Save more with annual billing",
    features: [
      "Everything in Premium Monthly",
      "12 months for the price of 10",
      "Payment Wallet & Digital ID modules",
      "Up to 5 files (across all vaults)",
      "All current and future modules unlocked",
      "Advanced secure sharing (upcoming)",
      "Priority support",
      "Early access to roadmap launches",
    ],
    color: "bg-violet-50/80 dark:bg-violet-950/80 border-2 border-violet-600 dark:border-violet-500 shadow-xl",
    popular: false,
  },
];

const featureComparison = [
  {
    name: "Core Crypto Modules",
    free: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumMonthly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumYearly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
  },
  {
    name: "Payment Wallet Module",
    free: <span className="text-gray-400">—</span>,
    premiumMonthly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumYearly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
  },
  {
    name: "Digital ID Vault",
    free: <span className="text-gray-400">—</span>,
    premiumMonthly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumYearly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
  },
  {
    name: "Files Allowed",
    free: "2",
    premiumMonthly: "5",
    premiumYearly: "5",
  },
  {
    name: "Password & Notes",
    free: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumMonthly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumYearly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
  },
  {
    name: "Metadata Encryption",
    free: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumMonthly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumYearly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
  },
  {
    name: "Advanced Sharing (roadmap)",
    free: <span className="text-gray-400">—</span>,
    premiumMonthly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
    premiumYearly: <CheckIcon className="w-5 h-5 text-violet-600 mx-auto" />,
  },
  {
    name: "Support",
    free: "Standard",
    premiumMonthly: "Priority",
    premiumYearly: "Priority",
  },
  {
    name: "Billing",
    free: "N/A",
    premiumMonthly: "Monthly",
    premiumYearly: "Yearly (Save 16%)",
  },
];

export default function PricingPage() {
  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-4 inline-block bg-violet-800/20 text-violet-400 px-4 py-2 rounded-full font-medium">
            CipherCore Model X  |  Premium Launch
          </div>
          <h1 className={title({ size: "lg" })}>
            Premium <span className={title({ color: "violet", size: "lg" })}>Plans</span>
          </h1>
          <h2 className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
            Zero-knowledge encryption, per-file key isolation, and next-gen cryptography—get started free, or upgrade for advanced power.
          </h2>
        </section>

        {/* Plans */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, idx) => (
            <Card
              key={idx}
              className={`h-full relative ${plan.color} ${plan.popular ? "ring-2 ring-violet-300 dark:ring-violet-700 z-10" : ""}`}
              isHoverable
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-violet-700 text-white px-3 py-1 rounded-full text-xs tracking-wide font-bold shadow-md z-10">
                  Most Popular
                </span>
              )} <br />
              <CardHeader className="flex flex-col items-center pb-0">
                <span className="text-2xl font-bold text-violet-900 dark:text-violet-200">{plan.name}</span>
                <span className="mt-2 text-4xl font-extrabold text-violet-700 dark:text-violet-400">
                  {plan.price}
                </span>
                <span className="mt-1 text-sm text-gray-500">{plan.duration}</span>
                <p className="mt-4 text-default-500 dark:text-default-300">{plan.description}</p>
              </CardHeader>
              <CardBody>
                <ul className="mb-4 text-default-700 dark:text-default-300 space-y-2 text-left max-w-xs mx-auto">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <CheckIcon className="w-4 h-4 text-violet-700 mt-1 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                <Button
  color={plan.popular ? "primary" : "secondary"}
  size="lg"
  radius="full"
  variant={plan.popular ? "solid" : "flat"}
  className="w-full"
  onClick={() => {
    if (plan.name !== "Free") {
      alert("Payments are currently under review with Razorpay. Please try again later.");
    } else {
      // Optional: handle free plan logic here
      console.log("Joining Free Plan");
    }
  }}
>
  {plan.name === "Free" ? "Join Free" : `Upgrade to ${plan.name}`}
</Button>

              </CardFooter>
            </Card>
          ))}
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">
              Compare <span className="text-purple-600 dark:text-purple-400">Plans</span>
            </h2>
            <p className="text-default-500 max-w-xl mx-auto">
              Secure file vaults, notes, and secrets—see what each plan unlocks.
            </p>
          </div>
          <div className="bg-white dark:bg-default-900 rounded-xl shadow-sm overflow-x-auto border border-default-200 dark:border-default-700">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-default-200 dark:border-default-700 bg-default-100 dark:bg-default-800">
                  <th className="text-left py-4 px-6 font-semibold text-default-900 dark:text-white">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-default-900 dark:text-white">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-default-900 dark:text-white">Premium Monthly</th>
                  <th className="text-center py-4 px-6 font-semibold text-default-900 dark:text-white">Premium Yearly</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-default-200 dark:border-default-700 ${
                      idx % 2 === 0 ? "bg-default-50/50 dark:bg-default-800/20" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-medium dark:text-default-300">{feature.name}</td>
                    <td className="text-center py-4 px-6 dark:text-default-300">{feature.free}</td>
                    <td className="text-center py-4 px-6 dark:text-default-300">{feature.premiumMonthly}</td>
                    <td className="text-center py-4 px-6 dark:text-default-300">{feature.premiumYearly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-2xl p-8">
            <Avatar
              isBordered
              color="secondary"
              size="lg"
              className="mx-auto mb-4"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              }
            />
            <h2 className="text-2xl font-bold mb-2">Need help choosing a plan?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Reach out to our team for advice on upgrading or maximizing your CipherCore Model X experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button color="secondary" size="lg" radius="full" variant="shadow">
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}