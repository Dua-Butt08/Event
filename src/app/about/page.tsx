'use client';

import Link from 'next/link';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Static data to prevent hydration issues
const expertiseAreas = [
  {
    name: "Brand Strategy",
    role: "Core Expertise",
    bio: "Developing comprehensive brand positioning, messaging, and identity systems that resonate with target audiences.",
    icon: "🎯"
  },
  {
    name: "Digital Marketing",
    role: "Specialization", 
    bio: "Creating data-driven digital campaigns across social media, content marketing, and paid advertising channels.",
    icon: "📱"
  },
  {
    name: "Content Strategy",
    role: "Core Service",
    bio: "Crafting compelling narratives and content frameworks that engage audiences and drive conversions.",
    icon: "✍️"
  },
  {
    name: "Market Research",
    role: "Foundation",
    bio: "Deep-dive analysis of market trends, competitive landscapes, and consumer behavior insights.",
    icon: "🔍"
  },
  {
    name: "Campaign Management",
    role: "Execution",
    bio: "End-to-end campaign planning, execution, and optimization for maximum ROI and brand impact.",
    icon: "🚀"
  },
  {
    name: "Analytics & Insights",
    role: "Measurement",
    bio: "Performance tracking, data analysis, and strategic recommendations based on campaign metrics.",
    icon: "📊"
  }
];

const brandValues = [
  {
    title: "Strategic Thinking",
    description: "Every campaign begins with deep strategic analysis and clear objectives that align with business goals.",
    icon: "🎯"
  },
  {
    title: "Creative Excellence",
    description: "Compelling creative that cuts through the noise and connects emotionally with your target audience.",
    icon: "✨"
  },
  {
    title: "Data-Driven",
    description: "Decisions backed by thorough market research, consumer insights, and performance analytics.",
    icon: "📊"
  },
  {
    title: "Brand Authenticity",
    description: "Building genuine brand stories that reflect your values and resonate with your customers.",
    icon: "💎"
  },
  {
    title: "ROI Focus",
    description: "Every initiative is designed to deliver measurable results and sustainable business growth.",
    icon: "📈"
  },
  {
    title: "Long-term Partnership",
    description: "Building lasting relationships through consistent excellence and collaborative success.",
    icon: "🤝"
  }
];

const achievements = [
  { number: "50+", label: "Brands Launched" },
  { number: "200%", label: "Avg Growth" },
  { number: "98%", label: "Client Retention" },
  { number: "15+", label: "Industries" },
  { number: "5", label: "Years Experience" },
  { number: "24/7", label: "Dedication" }
];

const storyMilestones = [
  {
    title: "The Foundation",
    content: "My marketing journey began with a fascination for understanding what drives consumer behavior. After earning my degree in Marketing and Communications, I dove deep into the world of brand strategy and digital marketing.",
    highlight: "Working with startups and established companies alike, I discovered that the most successful brands aren't just selling products—they're creating meaningful connections with their audiences."
  },
  {
    title: "The Evolution", 
    content: "As digital marketing evolved, so did my approach. I embraced data analytics, social media strategy, and content marketing long before they became mainstream. This early adoption helped my clients stay ahead of the curve.",
    highlight: "Today, I combine traditional marketing wisdom with cutting-edge digital strategies to create campaigns that don't just reach audiences—they engage and convert them."
  },
  {
    title: "The Mission",
    content: "My mission is simple: help businesses build brands that matter. Whether you're a startup looking to make your mark or an established company ready to evolve, I'm here to guide your brand to its full potential.",
    highlight: "Let's create something extraordinary together—a brand that not only stands out in the marketplace but genuinely connects with the people who matter most to your business."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={0} />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4 sm:mb-6 bg-accent/20 text-accent border border-accent/30 px-4 sm:px-6 py-2 text-sm sm:text-lg rounded-full inline-block backdrop-blur-sm animate-pulse">
            👋 About Brody Lee
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight bg-gradient-to-r from-white via-accent to-accent-2 bg-clip-text text-transparent">
            Strategic Marketing
            <span className="block bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent">
              & Brand Development
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 mb-8">
            Crafting compelling brand narratives and data-driven marketing strategies 
            that connect with audiences and drive business growth.
          </p>
          
          {/* Key highlights */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm mb-8">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>5+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>50+ Brands Launched</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>200% Average Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>98% Client Retention</span>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl bg-gradient-to-r from-accent via-accent-2 to-accent hover:scale-105 transition-all duration-300">
                Work With Me
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/forms">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl border-accent/30 hover:bg-accent/10 hover:scale-105 transition-all duration-300">
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise Areas Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Areas of Expertise
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Comprehensive marketing services designed to build, grow, and strengthen your brand 
              in today's competitive marketplace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {expertiseAreas.map((area, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-accent/25"
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {area.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-accent font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                    {area.role}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {area.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values/Approach Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              My Approach
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              The core principles that drive successful marketing strategies and exceptional 
              brand experiences for every client.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {brandValues.map((value, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-accent/25"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground group-hover:text-accent transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Track Record Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Track Record
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Results that speak for themselves. Real numbers from real campaigns 
              that delivered measurable business impact.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {achievements.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-2xl p-6 lg:p-8 backdrop-blur-sm border border-accent/20 hover:border-accent/40 transition-all duration-300 group-hover:scale-105 hover:shadow-xl hover:shadow-accent/25">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium text-sm lg:text-base">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story/Journey Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              My Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From curiosity to expertise - the path that led to strategic marketing excellence.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {storyMilestones.map((milestone, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/25"
              >
                <CardContent className="p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-accent group-hover:text-accent-2 transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {milestone.content}
                  </p>
                  <div className="pl-6 border-l-4 border-accent/30">
                    <p className="text-lg text-foreground leading-relaxed italic">
                      {milestone.highlight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Certifications Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Technical proficiencies and strategic capabilities that drive successful campaigns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Creative Strategy</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Brand Identity Design</li>
                  <li>• Visual Storytelling</li>
                  <li>• Campaign Concepting</li>
                  <li>• Content Creation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Analytics & Data</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Google Analytics</li>
                  <li>• Facebook Insights</li>
                  <li>• Campaign Tracking</li>
                  <li>• ROI Analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Digital Platforms</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Social Media Ads</li>
                  <li>• Google Ads</li>
                  <li>• Email Marketing</li>
                  <li>• SEO Optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Strategy & Planning</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Market Research</li>
                  <li>• Competitive Analysis</li>
                  <li>• Target Audience</li>
                  <li>• Campaign Planning</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-accent/10 via-accent-2/10 to-accent/10 rounded-3xl p-12 backdrop-blur-sm border border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Ready to Elevate Your Brand?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Let's discuss how strategic marketing can transform your business. 
              Whether you need a complete brand overhaul or targeted campaign optimization, 
              I'm here to help you achieve your goals.
            </p>
            
            {/* Value propositions */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Free strategy consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">🚀</span>
                <span>Custom proposal within 48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span>Results-driven approach</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-6 rounded-2xl bg-gradient-to-r from-accent via-accent-2 to-accent hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/25 group-hover:shadow-xl">
                  Start a Project
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/forms">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 py-6 rounded-2xl border-accent/30 hover:bg-accent/10 hover:scale-105 transition-all duration-300">
                  View Work Examples
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔒</span>
                  <span>100% confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">📞</span>
                  <span>Direct access to me</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">💯</span>
                  <span>Satisfaction guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
