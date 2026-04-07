"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background text-muted-foreground">

      {/* FULL WIDTH */}
      <div className="w-full">

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

            {/* BRAND */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                MyRefrence<span className="text-red-500">.</span>
              </h3>

              <p>
                AI Agent Marketplace to automate workflows and solve real problems.
              </p>
            </div>

            {/* SERVICES */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                Services
              </h4>

              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-foreground">AI Automation Solutions</Link></li>
                <li><Link href="#" className="hover:text-foreground">Website Development</Link></li>
                <li><Link href="#" className="hover:text-foreground">AI Agent Development</Link></li>
                <li><Link href="#" className="hover:text-foreground">Workflow Automation (n8n)</Link></li>
                <li><Link href="#" className="hover:text-foreground">Resume & HR Automation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Custom Business Tools</Link></li>
              </ul>
            </div>

            {/* ABOUT */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                About
              </h4>

              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-foreground">Company</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                Legal
              </h4>

              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>

          {/* DIVIDER */}
          <div className="border-t border-border my-8"></div>

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p>© {new Date().getFullYear()} MyRefrence. All rights reserved.</p>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <p className="text-sm mb-2">
              Need a custom AI solution?
            </p>

            <Link
              href="/contact"
              className="text-accent font-medium hover:underline"
            >
              Contact us →
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}