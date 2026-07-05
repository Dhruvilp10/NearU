import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Note: this is a UI-only form for now — no backend endpoint sends this yet.
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-ink mb-2 tracking-tight">Contact us</h1>
      <p className="text-sm text-ink/60 mb-8">Have a question or found an issue? Reach out.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-ink/70">
            <Mail size={16} className="text-route" /> NearU_support@gmail.com
          </div>
          <div className="flex items-center gap-3 text-sm text-ink/70">
            <Phone size={16} className="text-route" /> +91 7827462221
          </div>
          <div className="flex items-center gap-3 text-sm text-ink/70">
            <MapPin size={16} className="text-route" /> Vadodara, Gujarat
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-hairline rounded-xl p-5 space-y-3">
          {sent ? (
            <p className="text-sm text-route">Thanks — we'll get back to you soon.</p>
          ) : (
            <>
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={update('name')}
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-route"
              />
              <input
                required
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={update('email')}
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-route"
              />
              <textarea
                required
                rows={3}
                placeholder="Your message"
                value={form.message}
                onChange={update('message')}
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-route resize-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-amber text-ink text-sm font-medium px-4 py-2.5 rounded-md hover:bg-amber/90"
              >
                <Send size={14} /> Send message
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}