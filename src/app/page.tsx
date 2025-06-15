'use client'
import { ArrowRight, Bot, Zap, PlaneTakeoff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SalesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          <h1 className="text-5xl font-bold tracking-tight">
            Agentic AI for Business Valuation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your financial modeling with AI-powered autopilot, integrated tools, and digital associates.
          </p>
          <div className="flex items-center justify-center gap-4 mt-20">
            <Button
              onClick={() => router.push('/auth/signin')}
              variant="outline"
              className="px-8 py-3"
            >
              Sign in
            </Button>
            <Button
              onClick={() => router.push('/auth/signup')}
              className="bg-brand text-white px-8 py-3 hover:bg-brand/90"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <PlaneTakeoff className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Autopilot Financial Modeling</h3>
            <p className="text-muted-foreground">
              Fast build and iterate on sophisticated financial models including DCF, Market Multiple, and Complex Securities with AI assistance, while keeping full control.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Tool Integration</h3>
            <p className="text-muted-foreground">
              S&P Capital IQ, Bloomberg, Kroll Cost of Capital Navigator ... all essential datasets are easily accessible.
              <br />
              Internal search bot to quickly find the latest company information, news, etc and summarize for you.
              <br />
              Say goodbye to switching between 30 browser tabs.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Digital Associate</h3>
            <p className="text-muted-foreground">
              Iterate and reproduce financial reports with our digital associate.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-primary/5 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Valuation Process?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of financial modeling with our AI-powered solution
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="bg-brand text-white px-8 py-3 rounded-lg font-medium hover:bg-brand/90 transition-colors inline-flex items-center gap-2">
            Request a demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
