'use client';

import Link from 'next/link';
import ShaderBackground from '@/components/ShaderBackground';

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      'Up to 10 videos per month',
      'HD quality exports',
      'Basic templates',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For serious creators',
    features: [
      'Unlimited videos',
      '4K quality exports',
      'All premium templates',
      'Priority support',
      'Custom branding',
      'Advanced editing tools',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and businesses',
    features: [
      'Everything in Pro',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];
export default function PricingPage() {

  return (
    <ShaderBackground>
      <div className="h-[95vh] flex flex-col">
        <div className="relative z-20 px-4 py-12">
            <div className="text-center mb-12">
              <Link 
                href="/" 
                className="inline-block text-white/80 hover:text-white mb-8 transition-colors"
              >
                ← Back to Home
              </Link>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Simple, transparent <span className="font-black italic">pricing</span>
              </h1>
              <p className="text-xl text-white/80 font-semibold max-w-2xl mx-auto">
                Choose the plan that works best for you
              </p>
            </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border ${
                    plan.popular
                      ? 'border-white/40 shadow-2xl scale-105'
                      : 'border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-black px-4 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-white/70 text-sm font-medium">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-white/70 text-lg font-medium">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title>Checkmark</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-white/90 text-sm font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                      plan.popular
                        ? 'bg-white text-black'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-white/70 text-sm font-medium">
                All plans include a 14-day money-back guarantee. No questions asked.
              </p>
            </div>
        </div>
      </div>
    </ShaderBackground>
  );
}
