import DefaultLayout from "@/layouts/default";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
 
  Chip,
  Avatar
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import wallet from "./wallet.png";
import notepad from "./notepad.png";
import folder from "./folder.png";
import profile from "./profile.png";
import credentials from "./credentials.png";
import digital from "./digital.png"

import { Link } from 'react-router-dom';
export default function IndexPage() {
    const roadmap = [
        {
      name:  "CipherCore Model X (Current)",
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

  const testimonials = [
    {
      quote: "VaultX has revolutionized how I manage sensitive data. The encryption gives me peace of mind.",
      author: "Alex Johnson",
      role: "Security Engineer"
    },
    {
      quote: "Finally a vault solution that's both powerful and intuitive. The biometric access is flawless.",
      author: "Sarah Chen",
      role: "Fintech CEO"
    }
  ];

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center gap-6 py-12 md:py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent dark:from-purple-600/5 dark:to-transparent opacity-20"></div>
        
        <div className="inline-block max-w-4xl text-center justify-center relative z-10">
        <div className="mb-4 inline-block bg-violet-800/20 text-violet-400 px-4 py-2 rounded-full font-medium">
  Secure. Private. Yours.
</div>


          
          <h1 className={title({ size: "lg" })}>
  Your <span className={title({ color: "violet", size: "lg" })}>Digital Fortress</span>
</h1>

          
          <h2 className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
            Zero-knowledge encryption meets seamless access. Store, sync, and protect your digital life with military-grade security.
          </h2>
          
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/encrypt">
  <Button color="primary" size="lg" radius="full">
    Encrypt Now
  </Button>
</Link>

<Link to="/myvault">

            <Button variant="flat" size="lg" radius="full">
              My Vault
            </Button></Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 dark:text-white">
            Your Complete <span className="text-purple-600 dark:text-purple-400">Security Suite</span>
          </h2>
          <p className="text-default-500 max-w-2xl mx-auto">
            Six layers of protection for every aspect of your digital identity
          </p>
        </div>
 <Link to="/encrypt"> 
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

{/* HOW IT WORKS - CIPHERCORE MODEL X */}
<section className="py-16 bg-default-100/60 dark:bg-default-900/20">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold dark:text-white mb-2">
        How Zektra CipherCore Works
      </h2>
      <p className="text-default-500 max-w-2xl mx-auto">
        Every step from vault creation to final file access is powered by strong, independently verified cryptography—delivering zero-knowledge privacy at every stage.
      </p>
    </div>

    <div className="grid md:grid-cols-5 gap-6">
      {/* Step 1 */}
      <div className="flex flex-col items-center bg-white dark:bg-default-900 rounded-xl shadow p-5 border border-default-200 dark:border-default-800 h-full">
        <div className="text-violet-700 dark:text-violet-300 text-3xl font-bold mb-2">1</div>
        <div className="font-semibold text-lg mb-1">Vault Initialization</div>
        <div className="text-default-600 text-sm">
          On first setup, a <span className="font-medium text-violet-600">unique cryptographic vault key</span> is generated, never stored in plaintext. Only you possess the key to unlock your vault.
        </div>
      </div>
      {/* Step 2 */}
      <div className="flex flex-col items-center bg-white dark:bg-default-900 rounded-xl shadow p-5 border border-default-200 dark:border-default-800 h-full">
        <div className="text-violet-700 dark:text-violet-300 text-3xl font-bold mb-2">2</div>
        <div className="font-semibold text-lg mb-1">Key Derivation</div>
        <div className="text-default-600 text-sm">
          Your password is transformed into a strong secret using <span className="font-medium text-violet-600">Argon2id</span>—the world’s leading memory-hard key derivation algorithm.
        </div>
      </div>
      {/* Step 3 */}
      <div className="flex flex-col items-center bg-white dark:bg-default-900 rounded-xl shadow p-5 border border-default-200 dark:border-default-800 h-full">
        <div className="text-violet-700 dark:text-violet-300 text-3xl font-bold mb-2">3</div>
        <div className="font-semibold text-lg mb-1">Per-File Encryption</div>
        <div className="text-default-600 text-sm">
          Each file or note is instantly protected by its own AES-256-GCM key. Metadata—names, types, and tags—are encrypted with the same rigor for total privacy.
        </div>
      </div>
      {/* Step 4 */}
      <div className="flex flex-col items-center bg-white dark:bg-default-900 rounded-xl shadow p-5 border border-default-200 dark:border-default-800 h-full">
        <div className="text-violet-700 dark:text-violet-300 text-3xl font-bold mb-2">4</div>
        <div className="font-semibold text-lg mb-1">Zero-Knowledge Storage</div>
        <div className="text-default-600 text-sm">
          Only encrypted data ever leaves your device. <span className="font-medium text-violet-600">Zektra never sees your password or decrypted secrets</span>—even we can’t help you recover them.
        </div>
      </div>
      {/* Step 5 */}
      <div className="flex flex-col items-center bg-white dark:bg-default-900 rounded-xl shadow p-5 border border-default-200 dark:border-default-800 h-full">
        <div className="text-violet-700 dark:text-violet-300 text-3xl font-bold mb-2">5</div>
        <div className="font-semibold text-lg mb-1">Instant, Secure Access</div>
        <div className="text-default-600 text-sm">
          Access and decrypt your files from any device by re-entering your password—your vault key is reconstructed securely, never stored. Only you control your data, always.
        </div>
      </div>
    </div>
    <div className="text-center mt-12">
      <span className="inline-block bg-violet-100 dark:bg-violet-900 px-4 py-2 rounded-full font-medium text-violet-700 dark:text-violet-300">
        Every layer powered by actual cryptographic best-practice, audited by security experts.
      </span>
    </div>
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
      {/* FINAL CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-700 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Unbreakable Security?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Experience next-gen cryptographic protection. Absolute privacy. No backdoors. No compromises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button color="secondary" size="lg" radius="full" variant="shadow" className="shadow-lg">
                <Link to="/upgrade">Upgade to premium</Link>
            </Button>
            
          </div>
          <div className="mt-6 text-purple-200 text-xs">SOC 2 Type II • GDPR • HIPAA • No credit card required</div>
        </div>
      </section>
    </DefaultLayout>
  );
}