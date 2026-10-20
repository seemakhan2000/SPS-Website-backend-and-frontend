// components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

const contactItems = [
  {
    label: 'Call Us',
    value: '+301-337-2290',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
  },
  {
    label: 'Send us a Mail',
    value: 'support@spsnet.com',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    label: 'Opening Time',
    value: 'Mon - Sat: 7:00 - 17:00',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
];

const footerColumns = [
  {
    title: 'Our Services',
    links: [
      { href: '/services/cybersecurity', label: 'Cybersecurity' },
      { href: '/services/cloud', label: 'Cloud' },
      { href: '/services/ai-automation', label: 'AI & Automation' },
      { href: '/services/collaboration', label: 'Collaboration' },
      { href: '/services/collaboration/training', label: 'Training' },
    ],
  },
  {
    title: 'Verticals',
    links: [
      { href: '/verticals/public-sector', label: 'Public Sector' },
      { href: '/verticals/industrial', label: 'Industrials' },
      { href: '/verticals/healthcare', label: 'Healthcare' },
      { href: '/verticals/retail', label: 'Retail' },
      { href: '/verticals/energy', label: 'Energy' },
      { href: '/verticals/financial', label: 'Financial' },
    ],
  },
  {
    title: 'Activities',
    links: [
      { href: '/internship', label: 'Internship Program 2025' },
      { href: '/activities/webinars', label: 'Webinars' },
      { href: '/activities/workshops', label: 'Workshops' },
      { href: '/activities/special-interest-groups', label: 'Special Interest Groups' },
      { href: '/activities/training', label: 'Training' },
    ],
  },
  {
    title: 'SpinnLabs',
    links: [
      { href: '/spinnlabs/overview', label: 'Overview' },
      { href: '/spinnlabs/academia', label: 'Academia' },
      { href: '/spinnlabs/industry', label: 'Industry' },
      { href: '/spinnlabs/center-of-expertise', label: 'Centers of Expertise' },
      { href: '/spinnlabs/startups', label: 'Startups' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-blue-100">
      {/* subtle network-pattern backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #0a1e42 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating widget keyframes */}
      <style jsx global>{`
        @keyframes widgetFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .widget-float {
          animation: widgetFloat 4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative container mx-auto px-4 pt-12">
        {/* Top: Get in touch */}
        <div className="flex flex-col gap-8 pb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Get in Touch with us
            </h2>
            <p className="mt-1 text-slate-500">Software Productivity Strategist</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0a1e42]">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200" />

        {/* Main columns */}
        <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center">
              <Image
                src="/images/logo/logo-footer.webp"
                alt="Software Productivity Strategists, Inc."
                width={180}
                height={60}
                className="h-auto w-40 flex-shrink-0 object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Whether you are an entrepreneur looking for an engineering team or an enterprise
              pursuing digital transformation we can help you bring your vision to reality.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="relative">
              <h4 className="mb-4 text-lg font-bold text-[#0a1e42]">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-slate-600 transition-colors hover:text-[#0a1e42]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Floating "Have a Question?" widget */}
              {column.title === 'SpinnLabs' && (
                <div className="absolute -right-16 top-[50px] z-20 hidden 2xl:block">
                  <div className="widget-float relative pl-14 pt-6">
                    {/* Avatar */}
                    <div className="absolute left-0 -top-8 flex h-14 w-14 items-center justify-center rounded-2xl rounded-br-none bg-white p-2 shadow-lg">
                      <Image
                        src="/images/logo/men.webp"
                        alt="Farhan Akmal"
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl rounded-tl-none bg-white px-4 pb-3 pt-3 shadow-xl">
                      <span className="block text-sm font-normal text-slate-500">
                        Have a Question?
                      </span>
                      <a
                        href="mailto:info@spsnet.com"
                        className="block text-base font-medium text-blue-600 sm:text-lg"
                      >
                        spsnet.com
                      </a>
                      <span className="-mb-3 mt-1.5 table rounded-t-lg bg-[#0a1e42] px-3 py-1.5 text-sm font-medium text-white">
                        Farhan Akmal
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="text-sm text-slate-500">
              © {currentYear}{' '}
              <span className="font-medium text-slate-700">Software Productivity Strategist</span>
              . All Rights Reserved.
            </span>
            <div className="flex items-center space-x-6">
              <Link href="/privacy-policy" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                Terms of Service
              </Link>
              <Link href="/contact-us" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}