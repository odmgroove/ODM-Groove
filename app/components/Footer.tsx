import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--black)] border-t border-[var(--dark-border)] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
             
              <Link
            href="/#home"
            className="flex items-center gap-3 group"
            aria-label="ODM Groove - Go to Home"
          >
            
            <div className="flex flex-col gap-1 items-center justify-center leading-tight">
              <span className="relative inline-block w-24 h-4 md:w-36 md:h-6">
              <Image
                src="/logo.png"
                alt="ODM Groove Hotel logo"
                fill
                className="object-contain"
                priority
              />
            </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--warm-gray)] font-medium">
                Hotel & Event Hall
              </span>
            </div>
          </Link>
            </div>
            <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-6">
              A premium boutique hotel designed to bring luxury, comfort, and top-tier entertainment to Ijoko Ogbayo, Ogun State.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-[var(--dark)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://www.instagram.com/odm.groove" className="w-8 h-8 rounded-full bg-[var(--dark)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[var(--dark)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--off-white)] font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[var(--warm-gray)]">
              <li><Link href="#home" className="hover:text-[var(--gold)] transition-colors">Home</Link></li>
              <li><Link href="#about" className="hover:text-[var(--gold)] transition-colors">Our Story</Link></li>
              <li><Link href="#rooms" className="hover:text-[var(--gold)] transition-colors">Rooms & Rates</Link></li>
              <li><Link href="#events" className="hover:text-[var(--gold)] transition-colors">Event Hall</Link></li>
              <li><Link href="#gallery" className="hover:text-[var(--gold)] transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--off-white)] font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-[var(--warm-gray)]">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-2">
                  <span>
                    Shonekan Street, Ola-Oparun, <br />
                    After Aboki Ifa,<br />
                    Ijoko Ogbayo, Ogun State
                  </span>
                  <a href="https://www.google.com/maps/place/ODM+Groove/@6.807692,3.2610716,16.47z/data=!4m6!3m5!1s0x103b99001c162a33:0x16d368ac8dc110c!8m2!3d6.8086802!4d3.2651657!16s%2Fg%2F11wq32ncz_?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline text-sm inline-flex font-medium">
                    Get Directions &rarr;
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[var(--gold)] flex-shrink-0" />
                <a href="tel:+2347061514120" className="hover:text-[var(--gold)] transition-colors">+234 706 151 4120</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--gold)] flex-shrink-0" />
                <a href="mailto:odmgroove@gmail.com" className="hover:text-[var(--gold)] transition-colors">odmgroove@gmail.com</a>
              </li>
            </ul>
            
            {/* Map Embed */}
            
          </div>

          {/* Map/Newsletter Placeholder */}
          <div>
  <h4 className="text-[var(--off-white)] font-semibold mb-6">
    Location Map
  </h4>

  <div className="mt-6 w-full h-32 rounded-sm overflow-hidden border border-[var(--dark-border)] relative">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.118636566388!2d3.2625908!3d6.8086802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b99001c162a33%3A0x16d368ac8dc110c!2sODM%20Groove!5e0!3m2!1sen!2sng!4v1700000000000"
      className="absolute inset-0 w-full h-full"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

  <p className="text-[10px] text-[var(--warm-gray)] uppercase tracking-wider mt-3">
    RC-7450366 | ODM Groove Limited
  </p>
</div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--dark)] pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[var(--warm-gray)] gap-4">
          <p>© {currentYear} ODM Groove Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[var(--off-white)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[var(--off-white)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
