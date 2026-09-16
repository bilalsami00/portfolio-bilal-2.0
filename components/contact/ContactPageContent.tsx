import { useState } from "react";
import { useFormik } from "formik";
import { siteAvailability, siteIdentity } from "../../data/site";
import { contactFaqItems } from "../../data/faq";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import SocialLinksRow from "../shared/SocialLinksRow";
import { Button } from "../shared/Button";
import ContactCtaBanner from "../shared/ContactCtaBanner";

type ContactFormValues = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
};

/**
 * Contact page: information, availability, form (client-only for now), FAQ.
 */
const ContactPageContent = () => {
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);

  const formik = useFormik<ContactFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
    onSubmit: (values, helpers) => {
      // Backend submission not implemented yet — keep UX honest.
      setSubmitNotice(
        `Thanks, ${
          values.fullName || "there"
        }. The form UI is ready; server submission is not wired yet. Please email ${
          siteIdentity.email
        } directly for now.`
      );
      helpers.setSubmitting(false);
    },
  });

  return (
    <>
      <section
        className="pt-12 pb-10 sm:pt-16"
        aria-labelledby="contact-hero-title"
      >
        <Container>
          <RevealOnScroll>
            <p className="section-eyebrow">Contact</p>
            <div className="crimson-mark mt-4 mb-5" />
            <h1
              id="contact-hero-title"
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-parchment-100 max-w-3xl"
            >
              Let’s open a channel
            </h1>
            <p className="section-copy mt-5">
              Whether you are hiring, collaborating, or exploring a product idea
              — send a clear note and I will respond with substance.
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      <section className="py-10 sm:py-14" aria-labelledby="contact-info-title">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <RevealOnScroll className="lg:col-span-5 space-y-5">
              <SectionHeading
                eyebrow="Direct lines"
                title="Contact information"
              />

              <div className="ink-panel p-6 space-y-4">
                <div>
                  <p className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                    Email
                  </p>
                  {siteIdentity.email.includes("replace") ||
                  siteIdentity.email.startsWith("[") ? (
                    <p className="mt-1 text-parchment-400">
                      {siteIdentity.email}
                    </p>
                  ) : (
                    <a
                      href={`mailto:${siteIdentity.email}`}
                      className="mt-1 inline-block text-parchment-100 hover:text-crimson-300 transition-colors"
                    >
                      {siteIdentity.email}
                    </a>
                  )}
                </div>
                <div>
                  <p className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                    Phone
                  </p>
                  {siteIdentity.phone.includes("replace") ||
                  siteIdentity.phone.startsWith("[") ? (
                    <p className="mt-1 text-parchment-400">
                      {siteIdentity.phone}
                    </p>
                  ) : (
                    <a
                      href={`tel:${siteIdentity.phone.replace(/[^\d+]/g, "")}`}
                      className="mt-1 inline-block text-parchment-100 hover:text-crimson-300 transition-colors"
                    >
                      {siteIdentity.phone}
                    </a>
                  )}
                </div>
                <div>
                  <p className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                    Location
                  </p>
                  <p className="mt-1 text-parchment-300">
                    {siteIdentity.location}
                  </p>
                </div>
              </div>

              <div className="ink-panel p-6">
                <p className="status-pill mb-4">
                  {siteAvailability.statusLabel}
                </p>
                <p className="text-sm text-parchment-400 leading-relaxed">
                  {siteAvailability.statusDetail}
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                  Social
                </p>
                <SocialLinksRow variant="all" />
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              delayClass="reveal-delay-2"
              className="lg:col-span-7"
            >
              <div className="ink-panel p-6 sm:p-8">
                <h2 className="font-display text-2xl text-parchment-100 font-bold">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-parchment-500">
                  Form submission is UI-only for now. Use email for guaranteed
                  delivery.
                </p>

                <form
                  className="mt-8 space-y-4"
                  onSubmit={formik.handleSubmit}
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label
                      htmlFor="contact-full-name"
                      className="block text-xs font-accent uppercase tracking-[0.16em] text-steel-400"
                    >
                      Full name
                      <input
                        id="contact-full-name"
                        className="contact-field mt-2"
                        name="fullName"
                        placeholder="Your full name"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        required
                      />
                    </label>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-accent uppercase tracking-[0.16em] text-steel-400"
                    >
                      Email
                      <input
                        id="contact-email"
                        className="contact-field mt-2"
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-accent uppercase tracking-[0.16em] text-steel-400"
                    >
                      Phone
                      <input
                        id="contact-phone"
                        className="contact-field mt-2"
                        name="phone"
                        placeholder="Phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                      />
                    </label>
                    <label
                      htmlFor="contact-company"
                      className="block text-xs font-accent uppercase tracking-[0.16em] text-steel-400"
                    >
                      Company
                      <input
                        id="contact-company"
                        className="contact-field mt-2"
                        name="company"
                        placeholder="Company (optional)"
                        value={formik.values.company}
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-accent uppercase tracking-[0.16em] text-steel-400"
                  >
                    Subject
                    <input
                      id="contact-subject"
                      className="contact-field mt-2"
                      name="subject"
                      placeholder="How can I help?"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      required
                    />
                  </label>

                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-accent uppercase tracking-[0.16em] text-steel-400"
                  >
                    Message
                    <textarea
                      id="contact-message"
                      className="contact-field mt-2 min-h-[140px] resize-y"
                      name="message"
                      placeholder="Tell me about the role, product, or problem..."
                      rows={5}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      required
                    />
                  </label>

                  {submitNotice && (
                    <p
                      className="text-sm text-amber-200/90 border border-amber-700/40 bg-amber-950/30 p-3"
                      role="status"
                    >
                      {submitNotice}
                    </p>
                  )}

                  <Button type="submit" disabled={formik.isSubmitting}>
                    Send message
                  </Button>
                </form>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      <section
        className="py-14 sm:py-16 bg-ink-950/40"
        aria-labelledby="contact-faq-title"
      >
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="FAQ"
              title="Common inquiries"
              description="Quick answers for recruiters and collaborators."
            />
          </RevealOnScroll>
          <div className="mt-8 space-y-4 max-w-3xl">
            {contactFaqItems.map((item, index) => (
              <RevealOnScroll
                key={item.id}
                delayClass={`reveal-delay-${(index % 4) + 1}`}
                className="ink-panel p-5 sm:p-6"
              >
                <h3 className="font-display text-lg text-parchment-100 font-bold">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm text-parchment-400 leading-relaxed">
                  {item.answer}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <ContactCtaBanner
        eyebrow="Prefer another path?"
        title="Browse the work, then return when ready."
        description="The projects archive and about profile are the fastest way to decide if we should talk."
      />
    </>
  );
};

export default ContactPageContent;
