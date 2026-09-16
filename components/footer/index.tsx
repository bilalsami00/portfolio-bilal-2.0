import Link from "next/link";
import { footerNavigation, routePaths } from "../../data/navigation";
import { siteIdentity } from "../../data/site";
import Container from "../shared/Container";
import SocialLinksRow from "../shared/SocialLinksRow";

/**
 * Professional footer with navigation, contact, and social links.
 */
const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-steel-700/40 bg-ink-950/80">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link
              href={routePaths.home}
              className="inline-flex items-center gap-3"
            >
              <img
                src={siteIdentity.logoImage}
                alt=""
                width={36}
                height={40}
                className="h-9 w-auto"
              />
              <span className="font-display text-xl font-bold text-parchment-100">
                {siteIdentity.fullName}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-parchment-400 leading-relaxed">
              {siteIdentity.tagline}
            </p>
            <SocialLinksRow variant="all" className="mt-6" />
          </div>

          <div className="md:col-span-3">
            <h2 className="font-accent text-xs uppercase tracking-[0.22em] text-crimson-400">
              Navigate
            </h2>
            <ul className="mt-4 space-y-2">
              {footerNavigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-parchment-300 hover:text-parchment-100 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="font-accent text-xs uppercase tracking-[0.22em] text-crimson-400">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                {siteIdentity.email.includes("replace") ||
                siteIdentity.email.startsWith("[") ? (
                  <span className="text-parchment-500">
                    {siteIdentity.email}
                  </span>
                ) : (
                  <a
                    href={`mailto:${siteIdentity.email}`}
                    className="text-parchment-300 hover:text-parchment-100 transition-colors"
                  >
                    {siteIdentity.email}
                  </a>
                )}
              </li>
              <li>
                {siteIdentity.phone.includes("replace") ||
                siteIdentity.phone.startsWith("[") ? (
                  <span className="text-parchment-500">
                    {siteIdentity.phone}
                  </span>
                ) : (
                  <a
                    href={`tel:${siteIdentity.phone.replace(/[^\d+]/g, "")}`}
                    className="text-parchment-300 hover:text-parchment-100 transition-colors"
                  >
                    {siteIdentity.phone}
                  </a>
                )}
              </li>
              <li className="text-parchment-500">{siteIdentity.location}</li>
            </ul>
          </div>
        </div>

        <div className="steel-rule my-10" />

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-steel-400 font-accent tracking-wide">
          <p>
            © {year} {siteIdentity.fullName}. All rights reserved.
          </p>
          <p>
            Built with disciplined craft · Inspired by dark ink atmospheres —
            not copyrighted art.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default SiteFooter;
