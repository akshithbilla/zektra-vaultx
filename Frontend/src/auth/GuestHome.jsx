import DefaultLayout from "@/layouts/default";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import wallet from "../pages/wallet.png";
import notepad from "../pages/notepad.png";
import folder from "../pages/folder.png";
import profile from "../pages/profile.png";
import credentials from "../pages/credentials.png";
import digital from "../pages/digital.png";
import { Link } from "react-router-dom";

export default function Guest() {
  // Top Defense Feature Cards
  const securityMechanisms = [
    {
      title: "AES-256-GCM",
      description:
        "Enterprise authentication with 256-bit encryption and Galois/Counter Mode ensures uncompromised confidentiality and data integrity.",
      strength:
        "Military-grade security. Standard for financial and government systems.",
    },
    {
      title: "Argon2id KDF",
      description:
        "Memory-hard key derivation with high-resistance to modern computational attacks—including GPU and ASIC threats.",
      strength:
        "Unbreakable password defense. Winner of the Password Hashing Competition.",
    },
    {
      title: "Zero-Knowledge Isolation",
      description:
        "Nobody—including us—has access to your secrets. Keys are derived from your password and never stored or seen by the platform.",
      strength:
        "Only you can unlock your vault. Your privacy is mathematically enforced.",
    },
    {
      title: "Per-File Key Isolation",
      description:
        "Each item and document is secured with its own random encryption key, wrapped by a master vault key.",
      strength:
        "Even if one layer is somehow compromised, the rest remain protected.",
    },
    {
      title: "Tamper Evidence",
      description:
        "Authenticated encryption with per-item verification proves integrity and instantly detects any unauthorized changes.",
      strength:
        "Cryptographic authenticity—accepted globally as best practice for critical data.",
    },
    {
      title: "Secure Metadata Protection",
      description:
        "Not just files, but also names, types, and tags remain fully private behind cryptographic boundaries.",
      strength: "No accidental leaks. Absolute confidentiality at every layer.",
    },
  ];

  // Security Innovation: Tech Superiority (no code, creative copy)
  const techHighights = [
    {
      title: "Vault Initialization",
      description:
        "Every user’s vault is set up with a unique high-entropy cryptographic key. Your secret never leaves your device in plaintext—only encrypted keys ever reach the platform.",
    },
    {
      title: "Key Retrieval",
      description:
        "When you log in—even from a new device—your vault key is securely decrypted on-the-fly using your password (via Argon2id). The platform only ever sees ciphertext: your data, your key, your control.",
    },
    {
      title: "Adaptive Isolation",
      description:
        "Every file, note, and credential in your vault has a one-of-a-kind, randomly generated encryption key. Even a theoretical compromise of a file key never exposes your entire vault.",
    },
    {
      title: "Persistence-Free Key Storage",
      description:
        "Zektra never stores your decrypted vault key or master password. Not in the cloud, not on disk, not in memory—strict zero-knowledge enforced, always.",
    },
  ];

  const features = [
    {
      title: "Payment Wallet",
      subtitle: "Secure financial store",
      label: "Card Vault",
      icon: <img src={wallet} alt="vault icon" className="w-16 h-16 object-contain" />,
      status: "Coming Soon",
      color: "bg-purple-500/10 dark:bg-purple-400/10"
    },
    {
      title: "ID Sync",
      subtitle: "Digital identity protection",
      label: "Digital IDs",
      icon: <img src={digital} alt="vault icon" className="w-16 h-16 object-contain" />,
      status: "Coming Soon",
      color: "bg-blue-500/10 dark:bg-blue-400/10"
    },
    {
      title: "Info Vault",
      subtitle: "Encrypted notes storage",
      label: "Secure Notes",
      icon: <img src={notepad} alt="vault icon" className="w-16 h-16 object-contain" />,
      status: "Available Now",
      color: "bg-green-500/10 dark:bg-green-400/10"
    },
    {
      title: "Identity Capsule",
      subtitle: "Your complete digital profile",
      label: "Profile",
      icon: <img src={profile} alt="vault icon" className="w-16 h-16 object-contain" />,
      status: "Beta",
      color: "bg-pink-500/10 dark:bg-pink-400/10"
    },
    {
      title: "Key Locker",
      subtitle: "End-to-end encrypted passwords",
      label: "Credentials",
      icon: <img src={credentials} alt="vault icon" className="w-16 h-16 object-contain" />,
      status: "Available Now",
      color: "bg-yellow-500/10 dark:bg-yellow-400/10"
    },
    {
      title: "DocSafe",
      subtitle: "Private cloud storage",
      label: "Smart Storage",
      icon: <img src={folder} alt="vault icon" className="w-16 h-16 object-contain" />,
      status: "Available Now",
      color: "bg-red-500/10 dark:bg-red-400/10"
    },
  ];


  // Competitor table
  const comparisonFeatures = [
    {
      name: "Encryption Standard",
      zektra: "AES-256-GCM",
      hashicorp: "AES-256-CBC",
      nordlocker: "AES-256-GCM",
      proton: "AES-256-GCM",
      google: "AES-128 (server-side)"
    },
    {
      name: "Key Derivation",
      zektra: "Argon2id (memory-hard)",
      hashicorp: "PBKDF2",
      nordlocker: "Argon2",
      proton: "Argon2",
      google: "None (server-managed)"
    },
    {
      name: "Zero-Knowledge",
      zektra: "Full (user-controlled, always encrypted)",
      hashicorp: "Partial",
      nordlocker: "Full",
      proton: "Full",
      google: "None"
    },
    {
      name: "Key Isolation",
      zektra: "Per-file keys + vault key",
      hashicorp: "Single master key",
      nordlocker: "Per-file keys",
      proton: "Per-file keys",
      google: "None"
    },
    {
      name: "Tamper Protection",
      zektra: "GCM Authentication Tags",
      hashicorp: "HMAC",
      nordlocker: "GCM Tags",
      proton: "GCM Tags",
      google: "None"
    },
    {
      name: "Metadata Encryption",
      zektra: "Full (file names, types, etc)",
      hashicorp: "Partial",
      nordlocker: "Partial",
      proton: "Full",
      google: "None"
    }
  ];
// Roadmap / Upcoming Models
  const roadmap = [
        {
      name:  "Zektra VaultX (Current)",
      description: "First-grade production launch, per-file isolation, zero-knowledge, enterprise-grade cryptography.",
      launch: "Now",
    },
    {
      name:"CipherCore Genesis ",
      description: "Enterprise vault federation, delegated access, advanced secret sharing, multi-cloud storage.",
      launch: "Q4 2026",
      future: true,
    },
    {
      name: "CipherCore Nova",
      description: "AI-driven anomaly detection, organizational policy automation, post-quantum key material rollout.",
      launch: "Planning",
      future: true,
    }

  ];

    const comparisonFeaturess = [
    {
      name: "Encryption Standard",
      best: "Zektra / NordLocker / Proton",
      zektra: "AES-256-GCM ⭐",
      hashicorp: "AES-256-CBC",
      nordlocker: "AES-256-GCM ⭐",
      proton: "AES-256-GCM ⭐",
      google: "AES-128 (server-side)",
      note: "AES-256-GCM is modern and strongest; legacy CBC or AES-128 are less secure."
    },
    {
      name: "Key Derivation",
      best: "Zektra",
      zektra: "Argon2id (memory-hard) ⭐",
      hashicorp: "PBKDF2",
      nordlocker: "Argon2",
      proton: "Argon2",
      google: "None (server-managed)",
      note: "Argon2id (Zektra) provides maximum resistance to modern brute force and is Password Hashing Competition winner."
    },
    {
      name: "Zero-Knowledge",
      best: "Zektra / NordLocker / Proton",
      zektra: "Full (user-controlled) ⭐",
      hashicorp: "Partial",
      nordlocker: "Full ⭐",
      proton: "Full ⭐",
      google: "None",
      note: "Only Zektra/NordLocker/Proton never let the platform see plaintext data."
    },
    {
      name: "Key Isolation",
      best: "Zektra",
      zektra: "Per-file + vault key ⭐",
      hashicorp: "Single master key",
      nordlocker: "Per-file keys",
      proton: "Per-file keys",
      google: "None",
      note: "Zektra combines both per-file and unique vault keys for highest isolation."
    },
    {
      name: "Tamper Protection",
      best: "Zektra / NordLocker / Proton",
      zektra: "GCM Authentication Tags ⭐",
      hashicorp: "HMAC",
      nordlocker: "GCM Tags ⭐",
      proton: "GCM Tags ⭐",
      google: "None",
      note: "AES-GCM offers authenticated encryption for exact verification."
    },
    {
      name: "Metadata Encryption",
      best: "Zektra",
      zektra: "Full (names/types etc.) ⭐",
      hashicorp: "Partial",
      nordlocker: "Partial",
      proton: "Full",
      google: "None",
      note: "Zektra & Proton are industry leaders; Zektra does full metadata encryption by default."
    }
  ];
  return (
    <DefaultLayout>
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center gap-6 py-14 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent dark:from-purple-700/10 dark:to-transparent opacity-20"></div>
        <div className="max-w-3xl text-center relative z-10">
          <div className="mb-3 inline-block bg-violet-800/20 text-violet-400 px-4 py-2 rounded-full font-medium">
            Zektra CipherCore v2.0 <span className="opacity-70 mx-1">|</span> Next-Gen Vault 
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-3 text-black dark:text-white">
           
              <h1 className={title({ size: "lg" })}>
            Enterprise-Grade <br></br> <span className={title({ color: "violet", size: "lg" })}>Crypto Vault</span>
          </h1>
          </h1>
          <h2 className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
            The next-generation cryptographic security platform.<br />
            <span className="text-700 font-bold">AES-256-GCM</span>{", "}
            <span className="text-700 font-bold">Argon2id</span>{", "}
            and <span className="text-700 font-bold">zero-knowledge isolation</span> with
            <span className="text-600 font-bold mx-1">per-file encryption</span>.
          </h2> <br />
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button color="primary" size="lg" radius="full" className="shadow-lg">
                Launch Zektra
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="flat" size="lg" radius="full" className="border border-violet-300 dark:border-violet-700">
                Login
              </Button>
            </Link>
          </div> <br />
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Chip color="success" variant="dot">SOC 2 Compliant</Chip>
            <Chip color="warning" variant="dot">GDPR Ready</Chip>
            <Chip color="secondary" variant="dot">HIPAA Compatible</Chip>
          </div>
        </div>
      </section>

      {/* CRYPTOGRAPHIC DEFENSE CARDS */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 dark:text-white">
            Cryptographic Defense Mechanisms
          </h2>
          <p className="text-default-500 max-w-2xl mx-auto">
            Unmatched, multi-layered safeguards engineered for 21st-century digital risk.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {securityMechanisms.map((mechanism, index) => (
            <Card
              key={index}
              className="bg-white/90 dark:bg-default-900 border hover:shadow-xl transition-all duration-300 h-full border-default-200 dark:border-default-800"
              isHoverable
            >
              <CardHeader className="pb-0">
                <h3 className="text-lg font-bold mb-1 text-violet-700 dark:text-violet-400">
                  {mechanism.title}
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-default-600 mb-3 text-sm">{mechanism.description}</p>
                <div className="px-3 py-2 bg-default-100 dark:bg-default-800 rounded-lg">
                  <span className="text-xs font-semibold text-default-700 dark:text-default-300">Strength:</span>
                  <span className="text-xs text-default-600 ml-1">{mechanism.strength}</span>
                </div>
              </CardBody>
              <CardFooter>
                <Chip color="success" variant="flat" size="sm">
                  Active Protection
                </Chip>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>


     {/* FEATURE GRID */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold dark:text-white mb-2">Advanced Security Modules</h2>
          <p className="text-default-500 max-w-2xl mx-auto">
            Each Zektra module operates with multi-layer crypto boundaries for credentials, docs, vaults, and sensitive metadata.
          </p>
        </div> <Link to="/login">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              
              <Card 
                key={index}
                className={`${feature.color} hover:shadow-lg transition-all duration-300 h-full`}
                isHoverable
                isPressable
              >
                <CardHeader className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-black/20">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="text-sm text-default-500">{feature.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-xl font-bold dark:text-white">{feature.label}</p>
                </CardBody>
                <CardFooter className="flex justify-between items-center">
                  <Chip 
                    color={
                      feature.status === "Available Now" ? "success" : 
                      feature.status === "Beta" ? "warning" : "default"
                    }
                    variant="dot"
                  >
                    {feature.status}
                  </Chip>
                  <Button 
                    size="sm" 
                    radius="full" 
                    variant={feature.status === "Available Now" ? "solid" : "flat"}
                    color={feature.status === "Available Now" ? "primary" : "default"}
                  >
                    {feature.status === "Available Now" ? "Access Now" : "Notify Me"}
                  </Button>
                </CardFooter>
              </Card> 
            ))}
          </div></Link>
      </section>
      {/* TECHNICAL SUPERIORITY SECTION */}
      <section className="py-16 bg-default-100/60 dark:bg-default-900/10 border-y border-default-200 dark:border-default-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white mb-2">
              Technical Superiority
            </h2>
            <p className="text-default-500 max-w-2xl mx-auto">
              How Zektra’s architecture outperforms traditional security solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {techHighights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-default-900 p-8 rounded-xl shadow-md border border-default-200 dark:border-default-800 flex flex-col gap-2"
              >
                <div className="text-lg font-bold mb-1 text-violet-700 dark:text-violet-400">{item.title}</div>
                <div className="text-default-700 dark:text-default-400 text-base">{item.description}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="inline-block bg-violet-50 dark:bg-violet-900 px-4 py-2 rounded-full font-medium text-violet-700 dark:text-violet-300">
              Cryptographic Best Practices · NIST-Recommended · Multi-layer Key Defense
            </span>
          </div>
        </div>
      </section>

      {/* COMPETITOR TABLE */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold dark:text-white mb-3">Zektra vs Leading Security Platforms</h2>
          <p className="text-default-500">
            Unparalleled cryptographic features compared to the world's most trusted secure storage solutions.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table aria-label="Comparison table" className="min-w-full text-sm">
            <TableHeader>
              <TableColumn className="text-left font-bold bg-default-200 dark:bg-default-800">Feature</TableColumn>
              <TableColumn className="text-center font-bold bg-default-200 dark:bg-default-800">Zektra</TableColumn>
              <TableColumn className="text-center font-bold bg-default-200 dark:bg-default-800">HashiCorp Vault</TableColumn>
              <TableColumn className="text-center font-bold bg-default-200 dark:bg-default-800">NordLocker</TableColumn>
              <TableColumn className="text-center font-bold bg-default-200 dark:bg-default-800">Proton Drive</TableColumn>
              <TableColumn className="text-center font-bold bg-default-200 dark:bg-default-800">Google Drive</TableColumn>
            </TableHeader>
            <TableBody>
              {comparisonFeatures.map((feature, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold border-b border-default-200 dark:border-default-800">{feature.name}</TableCell>
                  <TableCell className="text-center font-bold text-violet-800 dark:text-violet-200 bg-violet-50/70 dark:bg-violet-950/60 border-b border-default-200 dark:border-default-800">
                    {feature.zektra}
                  </TableCell>
                  <TableCell className="text-center border-b border-default-200 dark:border-default-800">{feature.hashicorp}</TableCell>
                  <TableCell className="text-center border-b border-default-200 dark:border-default-800">{feature.nordlocker}</TableCell>
                  <TableCell className="text-center border-b border-default-200 dark:border-default-800">{feature.proton}</TableCell>
                  <TableCell className="text-center border-b border-default-200 dark:border-default-800">{feature.google}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 text-center text-default-500 text-xs">
          * Comparison based on public cryptographic specifications and architecture. Zektra implements full client-side zero-knowledge protection with per-item key isolation.
        </div>
              <div className="mt-6 max-w-3xl mx-auto">
          {comparisonFeaturess.map((f, i) => (
            <p key={i} className="text-xs text-default-400 mb-2"> <span className="font-semibold text-default-600">{f.name}:</span> {f.note}</p>
          ))}
        </div>
         
      </section>
{/* FUTURE ROADMAP */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold dark:text-white mb-2">Future Models Roadmap</h2>
          <p className="text-default-500 max-w-2xl mx-auto">
            See what’s next in the CipherCore product family for advanced teams and organizations.
          </p>
        </div>
        <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((item, idx) => (
            <Card key={idx}
                  className={`transition-all duration-300 h-full ${
                    item.future ? "bg-gray-50 dark:bg-black/20" : "bg-violet-50 dark:bg-violet-900"
                  } border border-default-200 dark:border-default-800`}>
              <CardHeader className="flex flex-col items-start mb-2">
                <h3 className="text-lg font-bold mb-0 text-violet-800 dark:text-violet-300">{item.name}</h3>
               <span className={`badge ${item.future ? "bg-blue-200 text-blue-700" : "bg-green-200 text-green-700"} px-2 rounded my-2 text-xs`}>
  {item.launch}
</span>

              </CardHeader>
              <CardBody>
                <p className="text-base text-default-700 dark:text-default-300">{item.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

{/* PAYMENT PLANS SECTION */}
<section className="py-16 px-4 max-w-5xl mx-auto w-full">
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold dark:text-white mb-2">Choose Your Plan</h2>
    <p className="text-default-500 max-w-xl mx-auto">
      Start with full cryptographic protection for free, or unlock next-level power and control with CipherCore Model X Premium.
    </p>
  </div>
  <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
    
    {/* FREE PLAN */}
    <Card className="h-full border border-default-200 dark:border-default-800 bg-white/95 dark:bg-default-900">
      <CardHeader className="flex flex-col items-center mb-2">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">Free</span>
        <span className="mt-2 text-4xl font-extrabold text-green-700 dark:text-green-400">₹0</span>
        <span className="mt-1 text-sm text-gray-500">Forever</span>
      </CardHeader>
      <CardBody>
        <ul className="mb-4 text-default-700 dark:text-default-400 space-y-2 text-left max-w-xs mx-auto">
          <li>· Access to AES-256-GCM cryptography</li>
          <li>· Per-file encryption, zero-knowledge vault</li>
          <li>· Notes, Passwords, and 2 file uploads</li>
          <li>· Full privacy and metadata encryption</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button
          size="md"
          radius="full"
          color="success"
          variant="solid"
          className="w-full font-semibold"
        >
           <Link to="/signup">Sign Up Free</Link>
        </Button>
      </CardFooter>
    </Card>
    
    {/* PREMIUM PLAN - MONTHLY */}
    <Card className="h-full border-2 border-violet-500 dark:border-violet-500 bg-violet-50/70 dark:bg-violet-950/70 shadow-lg ring-2 ring-violet-300">
      <CardHeader className="flex flex-col items-center mb-2">
        <span className="text-2xl font-bold text-violet-900 dark:text-violet-200">Premium</span>
        <span className="mt-2 text-4xl font-extrabold text-violet-700 dark:text-violet-400">₹299</span>
        <span className="mt-1 text-sm text-gray-500">per month</span>
        <span className="inline-block mt-3 px-2 py-1 bg-violet-100 text-violet-800 text-xs font-semibold rounded-full tracking-wide">
          CipherCore Model X
        </span>
      </CardHeader>
      <CardBody>
        <ul className="mb-4 text-default-700 dark:text-default-300 space-y-2 text-left max-w-xs mx-auto">
          <li>· All Free plan features <span className="ml-1 text-violet-700">+</span></li>
          <li>· Payment Wallet & Digital ID modules</li>
          <li>· Up to 5 files across all modules</li>
          <li>· Priority support and upgrades</li>
          <li>· Advanced vault control</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button
          size="md"
          radius="full"
          color="primary"
          variant="solid"
          className="w-full font-semibold"
        >
          <Link to="/login"> Upgrade Monthly</Link>
        </Button>
      </CardFooter>
    </Card>

    {/* PREMIUM PLAN - YEARLY */}
    <Card className="h-full border-2 border-violet-500 dark:border-violet-500 bg-violet-50/70 dark:bg-violet-950/70 shadow-lg ring-2 ring-violet-300">
      <CardHeader className="flex flex-col items-center mb-2">
        <span className="text-2xl font-bold text-violet-900 dark:text-violet-200">Premium</span>
        <span className="mt-2 text-4xl font-extrabold text-violet-700 dark:text-violet-400">₹2,999</span>
        <span className="mt-1 text-sm text-gray-500">per year</span>
        <span className="inline-block mt-3 px-2 py-1 bg-violet-100 text-violet-800 text-xs font-semibold rounded-full tracking-wide">
          CipherCore Model X
        </span>
      </CardHeader>
      <CardBody>
        <ul className="mb-4 text-default-700 dark:text-default-300 space-y-2 text-left max-w-xs mx-auto">
          <li>· All Free plan features <span className="ml-1 text-violet-700">+</span></li>
          <li>· Payment Wallet & Digital ID modules</li>
          <li>· Up to 5 files across all modules</li>
          <li>· Priority support and upgrades</li>
          <li>· Advanced vault control</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button
          size="md"
          radius="full"
          color="primary"
          variant="solid"
          className="w-full font-semibold"
        >
         <Link to="/login">Upgrade Yearly</Link>
        </Button>
      </CardFooter>
    </Card>
    
  </div> <br></br>
  <div className="mt-10 mb-2 text-center">
    <span className="inline-block bg-violet-50 dark:bg-violet-900 px-4 py-2 rounded-full font-medium text-violet-700 dark:text-violet-300">
      Transparent pricing. No hidden fees. Cancel anytime.
    </span>
  </div>
</section>


      {/* FINAL CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-700 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Unbreakable Security?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Experience quantum-ready cryptographic protection. Absolute privacy. No backdoors. No compromises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button color="secondary" size="lg" radius="full" variant="shadow" className="shadow-lg">
              Start Free Trial
            </Button>
            <Button color="default" size="lg" radius="full" variant="ghost" className="text-white border-white/20">
              Request Demo
            </Button>
          </div>
          <div className="mt-6 text-purple-200 text-xs">SOC 2 Type II • GDPR • HIPAA • No credit card required</div>
        </div>
      </section>
    </DefaultLayout>
  );
}
