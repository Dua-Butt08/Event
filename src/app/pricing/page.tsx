'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';

// Static data to prevent hydration issues
const pricingPlans = [
  {
    name: "Starter",
    icon: "🚀",
    description: "Perfect for small businesses getting started with AI marketing",
    monthlyPrice: 0,
    annualPrice: 0,
    gradient: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
    buttonStyle: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
    popular: false,
    cta: "Get Started Free",
    roi: "Save 10+ hours monthly",
    bestFor: "Solo entrepreneurs & startups",
    features: [
      "Access to all 5 form generators",
      "3 AI-generated strategies per month",
      "Basic templates and frameworks",
      "Email support",
      "Community access",
      "Mobile-responsive strategies",
      "Export to PDF/Word"
    ]
  },
  {
    name: "Professional",
    icon: "💼",
    description: "Ideal for growing businesses that need comprehensive marketing strategies",
    monthlyPrice: 49,
    annualPrice: 490,
    gradient: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
    buttonStyle: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white",
    popular: true,
    cta: "Start Professional",
    roi: "300% average ROI in 6 months",
    bestFor: "Growing businesses & agencies",
    features: [
      "Everything in Starter",
      "Unlimited AI-generated strategies",
      "Advanced customization options",
      "Priority email & chat support",
      "Integration with popular tools",
      "Team collaboration features",
      "Advanced analytics dashboard",
      "Custom branding options",
      "A/B testing capabilities"
    ]
  },
  {
    name: "Enterprise",
    icon: "🏢",
    description: "Custom solutions for large organizations with advanced needs",
    monthlyPrice: 199,
    annualPrice: 1990,
    gradient: "from-gold-500/10 to-gold-600/10 border-gold-500/20",
    buttonStyle: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white",
    popular: false,
    cta: "Contact Sales",
    roi: "500% ROI with dedicated support",
    bestFor: "Large enterprises & corporations",
    features: [
      "Everything in Professional",
      "Custom AI model training",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom integrations",
      "White-label solutions",
      "Advanced security features",
      "SLA guarantees",
      "Custom reporting",
      "On-premise deployment options"
    ]
  }
];

const faqs = [
  {
    question: "How does the AI-powered strategy generation work?",
    answer: "Our AI analyzes your business inputs, industry data, and market trends to create customized marketing strategies. It uses advanced natural language processing to generate actionable plans tailored to your specific goals and target audience."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. If you're on an annual plan, you'll continue to have access until the end of your billing period. We also offer a 14-day money-back guarantee for new subscribers."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide email support for all plans, with priority support for Professional users and 24/7 phone support for Enterprise customers. We also have an extensive knowledge base and community forum."
  },
  {
    question: "How accurate are the AI-generated strategies?",
    answer: "Our AI has been trained on thousands of successful marketing campaigns and is continuously updated with the latest marketing trends. Most customers see a 300-500% ROI within 6 months of implementation."
  },
  {
    question: "Can I integrate with my existing marketing tools?",
    answer: "Yes, our Professional and Enterprise plans include integrations with popular marketing tools like HubSpot, Mailchimp, Google Analytics, and many others. We're constantly adding new integrations."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, our Starter plan is completely free and includes access to all form generators with 3 AI-generated strategies per month. You can upgrade anytime to access more features."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechStart Inc.",
    avatar: "👩‍💼",
    content: "This AI platform transformed our marketing approach. We went from spending weeks on strategy development to having comprehensive plans in minutes.",
    metrics: "450% ROI increase"
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "GrowthCorp",
    avatar: "👨‍💼",
    content: "The quality of strategies generated is incredible. It's like having a senior marketing consultant available 24/7.",
    metrics: "300% lead generation boost"
  },
  {
    name: "Emily Rodriguez",
    role: "Founder",
    company: "StartupStudio",
    avatar: "👩‍🚀",
    content: "As a small business, we couldn't afford expensive marketing consultants. This platform levels the playing field completely.",
    metrics: "250% conversion improvement"
  }
];

const features = [
  { name: "AI Strategy Generation", starter: true, professional: true, enterprise: true },
  { name: "Form Templates", starter: true, professional: true, enterprise: true },
  { name: "PDF/Word Export", starter: true, professional: true, enterprise: true },
  { name: "Email Support", starter: true, professional: true, enterprise: true },
  { name: "Unlimited Strategies", starter: false, professional: true, enterprise: true },
  { name: "Advanced Customization", starter: false, professional: true, enterprise: true },
  { name: "Team Collaboration", starter: false, professional: true, enterprise: true },
  { name: "Priority Support", starter: false, professional: true, enterprise: true },
  { name: "Custom Integrations", starter: false, professional: false, enterprise: true },
  { name: "Dedicated Manager", starter: false, professional: false, enterprise: true },
  { name: "24/7 Phone Support", starter: false, professional: false, enterprise: true },
  { name: "White-label Solutions", starter: false, professional: false, enterprise: true }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={0} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 bg-gradient-to-r from-accent/20 to-accent-2/20 text-accent border border-accent/30 px-6 py-3 text-lg rounded-full inline-block backdrop-blur-sm animate-pulse">
            💼 Strategic Marketing Investment
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-accent to-accent-2 bg-clip-text text-transparent">
            Choose Your
            <span className="block bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent">
              Marketing Partnership
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
            AI-powered marketing strategy generation that delivers measurable results. 
            Join 500+ businesses already using our platform to scale their marketing.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <span className={`mr-4 text-lg ${!isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${isAnnual ? 'bg-accent' : 'bg-card'} shadow-lg hover:scale-105`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
                  isAnnual ? 'transform translate-x-9' : 'transform translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-4 text-lg ${isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <div className="ml-3 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                🎉 Save 17%
              </div>
            )}
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground text-sm mb-8">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>500+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>10,000+ Strategies Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>300% Average ROI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>14-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-gradient-to-b ${plan.gradient} backdrop-blur-sm border-border/50 hover:border-accent/60 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-accent/25 ${
                  plan.popular ? 'ring-2 ring-accent/50 scale-105 shadow-xl shadow-accent/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-accent to-accent-2 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      🎆 Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 relative">
                  <div className="flex items-center justify-center mb-6">
                    <div className="text-4xl p-4 rounded-2xl bg-gradient-to-r from-accent/20 to-accent-2/20 border border-accent/30 group-hover:scale-110 transition-transform duration-300">
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">{plan.name}</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">{plan.description}</p>
                  
                  <div className="mb-8">
                    {plan.monthlyPrice === 0 ? (
                      <div className="text-5xl font-bold text-foreground mb-2">
                        Free
                        <span className="text-lg text-muted-foreground font-normal block mt-2">
                          Get started today
                        </span>
                      </div>
                    ) : (
                      <>  
                        <div className="text-5xl font-bold text-foreground mb-2">
                          ${isAnnual ? Math.floor(plan.annualPrice / 12).toLocaleString() : plan.monthlyPrice.toLocaleString()}
                          <span className="text-lg text-muted-foreground font-normal">/month</span>
                        </div>
                        {isAnnual && plan.annualPrice > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Billed annually (${plan.annualPrice.toLocaleString()}/year)
                            {plan.monthlyPrice > 0 && (
                              <span className="ml-2 inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                                17% savings
                              </span>
                            )}
                          </div>
                        )}
                        {!isAnnual && plan.monthlyPrice > 0 && (
                          <div className="text-sm text-accent font-medium">
                            Save 17% with annual billing
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Value propositions */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-muted-foreground">{plan.roi}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-blue-400">🎯</span>
                      <span className="text-muted-foreground">{plan.bestFor}</span>
                    </div>
                  </div>
                  
                  {status === 'loading' ? (
                    <Button 
                      size="lg" 
                      className={`w-full text-lg py-6 rounded-2xl transition-all duration-300 shadow-lg ${plan.buttonStyle} group-hover:shadow-xl`}
                      disabled
                    >
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading...
                    </Button>
                  ) : status === 'authenticated' ? (
                    <Link href={plan.name === 'Starter' ? '/forms' : plan.name === 'Enterprise' ? '/contact' : '/forms'}>
                      <Button 
                        size="lg" 
                        className={`w-full text-lg py-6 rounded-2xl transition-all duration-300 shadow-lg ${plan.buttonStyle} group-hover:shadow-xl`}
                      >
                        {plan.cta}
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button 
                        size="lg" 
                        className={`w-full text-lg py-6 rounded-2xl transition-all duration-300 shadow-lg ${plan.buttonStyle} group-hover:shadow-xl`}
                      >
                        {plan.name === 'Starter' ? 'Get Started Free' : 'Sign In to Continue'}
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Button>
                    </Link>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-muted-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Compare Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that best fits your business needs and growth stage.
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border/50 bg-accent/5">
              <div className="font-semibold text-foreground">Features</div>
              <div className="text-center font-semibold text-foreground">Starter</div>
              <div className="text-center font-semibold text-foreground">Professional</div>
              <div className="text-center font-semibold text-foreground">Enterprise</div>
            </div>
            
            {features.map((feature, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-6 border-b border-border/20 hover:bg-accent/5 transition-colors">
                <div className="text-muted-foreground font-medium">{feature.name}</div>
                <div className="text-center">
                  {feature.starter ? (
                    <span className="text-green-400 text-xl">✓</span>
                  ) : (
                    <span className="text-muted-foreground text-xl">–</span>
                  )}
                </div>
                <div className="text-center">
                  {feature.professional ? (
                    <span className="text-green-400 text-xl">✓</span>
                  ) : (
                    <span className="text-muted-foreground text-xl">–</span>
                  )}
                </div>
                <div className="text-center">
                  {feature.enterprise ? (
                    <span className="text-green-400 text-xl">✓</span>
                  ) : (
                    <span className="text-muted-foreground text-xl">–</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our AI marketing platform.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/40 transition-all duration-300 group">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Still have questions?</p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-2xl border-accent/30 hover:bg-accent/10 hover:scale-105 transition-all duration-300">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real results from businesses that transformed their marketing with our AI platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-accent">{testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground leading-relaxed mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-accent/20">
                    <div className="inline-block bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      {testimonial.metrics}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-accent/10 via-accent-2/10 to-accent/10 rounded-3xl p-12 backdrop-blur-sm border border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Ready to 10x Your Marketing ROI?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join 500+ successful businesses using AI to generate marketing strategies that deliver 
              measurable results. Start with our free plan or upgrade for advanced features.
            </p>
            
            {/* Urgency and Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>500+ businesses trust us</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">🚀</span>
                <span>Average 300% ROI in 6 months</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span>Setup takes under 5 minutes</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              {status === 'authenticated' ? (
                <>
                  <Link href="/forms">
                    <Button size="lg" className="text-xl px-12 py-6 rounded-2xl bg-gradient-to-r from-accent via-accent-2 to-accent hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/25 group-hover:shadow-xl">
                      Start Generating Strategies
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="text-xl px-12 py-6 rounded-2xl border-accent/30 hover:bg-accent/10 hover:scale-105 transition-all duration-300">
                      Book Enterprise Demo
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="lg" className="text-xl px-12 py-6 rounded-2xl bg-gradient-to-r from-accent via-accent-2 to-accent hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/25 group-hover:shadow-xl">
                      Start Free - No Credit Card Required
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="text-xl px-12 py-6 rounded-2xl border-accent/30 hover:bg-accent/10 hover:scale-105 transition-all duration-300">
                      Schedule a Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Money Back Guarantee */}
            <div className="inline-flex items-center gap-3 bg-green-500/10 text-green-400 px-6 py-3 rounded-full border border-green-500/20 mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">14-Day Money Back Guarantee</span>
            </div>
            
            {/* Additional trust elements */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔒</span>
                  <span>Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🌐</span>
                  <span>24/7 global support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🚀</span>
                  <span>Instant setup & deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
