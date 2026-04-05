"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16">

        {/* TITLE */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mt-2">
            Tell us your requirement — we’ll build the solution.
          </p>
        </div>

        {/* FORM */}
        <form className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* SERVICE */}
          <div>
            <label className="text-sm font-medium">Service</label>
            <select className="w-full mt-1 px-4 py-2 border rounded-md">
              <option>AI Automation</option>
              <option>Website Development</option>
              <option>AI Agent Development</option>
              <option>Other</option>
            </select>
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              rows={4}
              placeholder="Describe your requirement..."
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-accent/90 transition"
          >
            Send Message
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
}