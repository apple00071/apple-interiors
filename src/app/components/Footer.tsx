"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Footer link structure
const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Projects", href: "#projects" },
      { name: "Services", href: "#services" },
      { name: "Contact", href: "#contact" },
    ]
  },
  {
    title: "Contact Us",
    links: [
      { name: "Email: aravind.bandaru@appleinteriors.in", href: "mailto:aravind.bandaru@appleinteriors.in" },
      { name: "Phone: +91 9603 9603 37", href: "tel:+919603960337" },
      { name: "Phone: +91 40485 64775", href: "tel:+914048564775" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Logo and description */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-6">
              <div className="relative h-16 w-56">
                <Image
                  src="/images/New-logo.png"
                  alt="Apple Interiors Logo"
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Office Locations */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Head Office</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Maneesh Enclave, 1st floor,<br />
              Bhagya Nagar Phase 3, Sreenivasa Nagar,<br />
              Kukatpally, Hyderabad<br />
              Telangana - 500072
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-white">Designer Studio</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              H. No: LIG B-29, 1st floor,<br />
              Dr A S Rao Nagar<br />
              Opp SBI Kapra Branch,<br />
              Hyderabad - 500062
            </p>
          </div>

          {/* Quick Links and Legal */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {footerLinks.map((column, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold mb-4 text-white">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link 
                          href={link.href} 
                          className="text-white/70 hover:text-primary text-sm transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © {currentYear} Apple Interiors. All rights reserved.
          </p>
          <p className="text-white/60 text-sm mt-2 md:mt-0">
            Creating beautiful spaces that inspire
          </p>
        </div>
      </div>
    </footer>
  );
} 