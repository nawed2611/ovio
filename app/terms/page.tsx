'use client';

import Link from 'next/link';
import ShaderBackground from '@/components/ShaderBackground';

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Acceptance of Terms</h2>
              <p>By accessing and using this service, you accept and agree to be bound by these Terms of Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Use of Service</h2>
              <p>You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Subscription and Billing</h2>
              <p>Subscriptions are billed on a recurring basis. You authorize us to charge your payment method for the applicable fees. All payments are processed securely through Stripe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Cancellation</h2>
              <p>You may cancel your subscription at any time. Upon cancellation, you will continue to have access until the end of your current billing period.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Intellectual Property</h2>
              <p>All content, features, and functionality of the service are owned by us and protected by copyright and other intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Limitation of Liability</h2>
              <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Contact</h2>
              <p>For questions about these Terms of Service, contact us at support@ovio.com</p>
            </section>
          </div>
        </div>
      </div>
    </ShaderBackground>
  );
}

