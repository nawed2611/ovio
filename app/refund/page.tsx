'use client';

import Link from 'next/link';
import ShaderBackground from '@/components/ShaderBackground';

export default function RefundPage() {
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
            Refund Policy
          </h1>

          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">14-Day Money-Back Guarantee</h2>
              <p>We offer a 14-day money-back guarantee on all subscription plans. If you're not satisfied with our service, you can request a full refund within 14 days of your initial purchase.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">How to Request a Refund</h2>
              <p>To request a refund, contact us at support@ovio.com with your account details and reason for the refund. We will process your request within 5-7 business days.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Refund Eligibility</h2>
              <p>Refunds are available for first-time subscribers within 14 days of initial purchase. Renewal charges are not eligible for refunds unless there was a billing error.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Processing Time</h2>
              <p>Once approved, refunds will be processed to your original payment method within 5-7 business days. Depending on your bank or card issuer, it may take additional time for the refund to appear in your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Cancellation vs Refund</h2>
              <p>Canceling your subscription stops future charges but does not automatically trigger a refund. You must explicitly request a refund within the eligible timeframe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
              <p>If you have questions about our refund policy, please contact us at support@ovio.com</p>
            </section>
          </div>
        </div>
      </div>
    </ShaderBackground>
  );
}

