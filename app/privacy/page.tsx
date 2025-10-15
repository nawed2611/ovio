'use client';

import Link from 'next/link';
import ShaderBackground from '@/components/ShaderBackground';

export default function PrivacyPage() {
  return (
    <ShaderBackground>
      <div className="min-h-screen flex flex-col">
        <div className="relative z-20 px-4 py-12 max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-block text-white/80 hover:text-white mb-8 transition-colors"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Information We Collect</h2>
              <p>We collect information you provide directly to us, including name, email address, and payment information when you use our services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. Payment processing is handled securely through Stripe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Third-Party Services</h2>
              <p>We use third-party services like Stripe for payment processing. These services have their own privacy policies governing the use of your information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at support@ovio.com</p>
            </section>
          </div>
        </div>
      </div>
    </ShaderBackground>
  );
}

