"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-16 border-t border-border bg-white">

  {/* FULL WIDTH BACKGROUND */}
  <div className="w-full">

    {/* CENTERED CONTENT */}
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* TOP GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        {/* BRAND */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            MyRefrence<span className="text-red-500">.</span>
          </h3>
          <p className="text-muted-foreground">
            AI Agent Marketplace to automate workflows and solve real problems.
          </p>
        </div>

        {/* SERVICES */}
        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">AI Automation Solutions</Link></li>
            <li><Link href="#">Website Development</Link></li>
            <li><Link href="#">AI Agent Development</Link></li>
            <li><Link href="#">Workflow Automation (n8n)</Link></li>
            <li><Link href="#">Resume & HR Automation</Link></li>
            <li><Link href="#">Custom Business Tools</Link></li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h4 className="font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">Company</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Contact Us</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">Terms of Service</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-border my-8"></div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
        <p>© {new Date().getFullYear()} MyRefrence. All rights reserved.</p>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-2">
          Need a custom AI solution?
        </p>
        <Link href="/contact" className="text-accent font-medium hover:underline">
          Contact us →
        </Link>
      </div>

    </div>
  </div>
</footer>
    );
}