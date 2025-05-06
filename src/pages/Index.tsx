
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header / Navigation */}
      <header className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 7V4H6v3" />
              <path d="M18 20V10H6v10z" />
              <path d="M12 4v16" />
            </svg>
          </div>
          <span className="text-xl font-bold">SmartLoad</span>
        </div>
        <nav className="hidden space-x-4 md:block">
          <Button variant="link" asChild>
            <a href="#features">Features</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#how-it-works">How It Works</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#pricing">Pricing</a>
          </Button>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl py-12 text-center md:py-24">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Optimize Your Home's <span className="text-primary">Energy Usage</span>
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-xl text-muted-foreground">
          SmartLoad monitors and optimizes your home appliances in real-time,
          saving you money and reducing your carbon footprint.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/signup">Start Optimizing Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#how-it-works">Learn More</a>
          </Button>
        </div>
        
        {/* Hero Image */}
        <div className="mt-12">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
            <img
              src="https://placehold.co/1200x600/2563eb/ffffff?text=Smart+Load+Dashboard"
              alt="Smart Load Dashboard Preview"
              className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Smart Features for Smart Homes
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Real-Time Monitoring</h3>
              <p className="text-muted-foreground">
                Track energy consumption of each device in real-time. Know exactly
                which appliances are using power and how much.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16V4" />
                  <path d="M19 6l-7-2-7 2" />
                  <path d="M5 10l7 2 7-2" />
                  <path d="M5 14l7 2 7-2" />
                  <path d="M5 18l7 2 7-2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Smart Prioritization</h3>
              <p className="text-muted-foreground">
                Our system automatically categorizes your devices by priority,
                helping you identify which ones to optimize first.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                Receive tailored optimization tips based on your specific usage
                patterns and devices. Save energy without sacrificing comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            How SmartLoad Works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect Smart Plugs</h3>
              <p className="text-muted-foreground">
                Plug your appliances into our smart plugs and connect them to your WiFi.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Register Devices</h3>
              <p className="text-muted-foreground">
                Name each device and assign it to rooms through our intuitive dashboard.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Monitor Usage</h3>
              <p className="text-muted-foreground">
                Watch as the system tracks usage patterns and assigns priority tags.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                4
              </div>
              <h3 className="mb-2 text-xl font-semibold">Optimize & Save</h3>
              <p className="text-muted-foreground">
                Follow personalized recommendations to reduce energy usage and costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Basic</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Connect up to 5 devices
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  7-day data history
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="relative rounded-xl border border-primary bg-card p-6 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
              <h3 className="mb-2 text-xl font-bold">Premium</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Connect up to 15 devices
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  30-day data history
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Personalized recommendations
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$49.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Unlimited devices
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Premium analytics
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  1-year data history
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Custom API access
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-priority-low"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Dedicated support
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/signup">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Start Optimizing Your Energy Usage Today
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              Join thousands of smart homeowners who are saving energy and money 
              with SmartLoad's intelligent optimization system.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 7V4H6v3" />
                    <path d="M18 20V10H6v10z" />
                    <path d="M12 4v16" />
                  </svg>
                </div>
                <span className="text-xl font-bold">SmartLoad</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Intelligent energy optimization for modern homes.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  contact@smartload.com
                </li>
                <li className="text-sm text-muted-foreground">
                  123 Energy Street, Technology City
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SmartLoad. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
