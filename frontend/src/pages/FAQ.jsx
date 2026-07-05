const FAQS = [
  {
    q: 'What is NearU?',
    a: 'NearU is a platform to discover, review, and list local services — electricians, plumbers, laundry, tiffin providers, tutors, and more — near your current location.',
  },
  {
    q: 'Is NearU free to use?',
    a: 'Yes, browsing services, adding listings, and leaving reviews are all free.',
  },
  {
    q: 'How do I find services near me?',
    a: 'On the homepage, click "Find near me" and allow location access. You can adjust how far to search using the radius slider.',
  },
  {
    q: 'How do I become a vendor?',
    a: 'You can choose "Sign up as Vendor" when creating an account, or if you already have an account, go to your Profile page and click "Become a vendor" at any time — no need to create a new account.',
  },
  {
    q: 'Can I switch between being a User and a Vendor?',
    a: 'Yes. Every account starts as a regular user. You can upgrade to a vendor whenever you like from your Profile page, and your existing account details carry over.',
  },
  {
    q: 'How does the rating system work?',
    a: 'After using a service, logged-in users can leave a 1–5 star rating with an optional comment. A listing\'s average rating updates automatically as new reviews come in.',
  },
  {
    q: 'What if a listing looks wrong or spammy?',
    a: 'Click "Report this listing" on the service\'s detail page. Listings that receive multiple reports are automatically hidden pending review.',
  },
  {
    q: 'How is my location used?',
    a: 'Your location is only used in your browser to calculate distance and find nearby services. It is not stored permanently unless you choose to save it as part of your address.',
  },
];

export default function FAQ() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-ink mb-2 tracking-tight">Frequently asked questions</h1>
      <p className="text-sm text-ink/60 mb-8">Everything you need to know about using NearU.</p>

      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <details key={i} className="bg-white border border-hairline rounded-xl px-5 py-4 group">
            <summary className="font-medium text-sm text-ink cursor-pointer list-none flex items-center justify-between">
              {item.q}
              <span className="text-route font-mono text-xs group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-ink/70 mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}