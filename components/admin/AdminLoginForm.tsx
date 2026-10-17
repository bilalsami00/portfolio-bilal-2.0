import { FormEvent, useEffect, useRef, useState } from "react";
import { adminLoginSchema } from "../../utilities/schemas/adminLogin";
import { Button } from "../shared/Button";
import { AdminSignInResult, useAdminAuth } from "./AdminAuthProvider";

const MIN_FORM_DURATION_MS = 2000;
const MIN_TYPING_DURATION_MS = 800;
const SUBMIT_DEBOUNCE_MS = 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ATTEMPTS_KEY = "openfolio:mc-login-attempts";
const REMEMBERED_EMAIL_KEY = "openfolio:mc-email";

const readAttempts = (): number[] => {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : [];
  } catch {
    return [];
  }
};

/** Records an attempt; returns false once the window is exhausted. */
const registerAttempt = (): boolean => {
  const now = Date.now();
  const recent = readAttempts().filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify([...recent, now]));
  } catch {
    // Storage unavailable: fall back to the debounce only.
  }
  return true;
};

const failureMessages: Record<
  Exclude<AdminSignInResult, { ok: true }>["reason"],
  string
> = {
  invalid: "Unable to sign in with those credentials.",
  denied: "Unable to sign in with those credentials.",
  network: "Network unavailable. Check your connection and try again.",
  "rate-limited": "Too many attempts. Please wait a minute and try again.",
  "not-configured": "Admin sign-in is not configured.",
};

type AdminLoginFormProps = {
  disabled?: boolean;
  notice?: string | null;
};

const AdminLoginForm = ({ disabled = false, notice }: AdminLoginFormProps) => {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const mountedAtRef = useRef(Date.now());
  const typingStartedAtRef = useRef<number | null>(null);
  const lastSubmitAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
    try {
      const remembered = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (remembered) {
        setEmail(remembered);
        setRemember(true);
      }
    } catch {
      // Ignore storage access errors.
    }
  }, []);

  const markTyping = () => {
    if (typingStartedAtRef.current === null) {
      typingStartedAtRef.current = Date.now();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || submitting) return;

    const now = Date.now();
    if (now - lastSubmitAtRef.current < SUBMIT_DEBOUNCE_MS) return;
    lastSubmitAtRef.current = now;
    setError(null);

    const typingStartedAt = typingStartedAtRef.current;
    const tooFast =
      now - mountedAtRef.current < MIN_FORM_DURATION_MS ||
      (typingStartedAt !== null &&
        now - typingStartedAt < MIN_TYPING_DURATION_MS);
    if (honeypot || tooFast) {
      setError("Please take a moment and try again.");
      return;
    }

    const parsed = adminLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: { email?: string; password?: string } = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as "email" | "password";
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    if (!registerAttempt()) {
      setError(failureMessages["rate-limited"]);
      return;
    }

    setSubmitting(true);
    const result = await signIn(
      parsed.data.email,
      parsed.data.password,
      remember
    );
    setSubmitting(false);

    if (!result.ok) {
      setPassword("");
      setError(failureMessages[result.reason]);
      return;
    }

    try {
      if (remember) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, parsed.data.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch {
      // Ignore storage access errors.
    }
  };

  const labelClass =
    "mb-2 block text-xs font-accent uppercase tracking-[0.18em] text-steel-400";

  return (
    <form
      className="mt-8 ink-panel p-6 space-y-4"
      onSubmit={(event) => {
        handleSubmit(event).catch(() => {
          setSubmitting(false);
          setError(failureMessages.network);
        });
      }}
      noValidate
    >
      <div className="sr-only" aria-hidden>
        <label htmlFor="mission-control-website">
          Website
          <input
            id="mission-control-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>
      </div>

      <label className="block" htmlFor="mission-control-email">
        <span className={labelClass}>Email</span>
        <input
          id="mission-control-email"
          className="contact-field"
          type="email"
          name="email"
          autoComplete="username"
          placeholder="admin@example.com"
          value={email}
          onChange={(event) => {
            markTyping();
            setEmail(event.target.value);
          }}
          disabled={disabled || submitting}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? "mission-control-email-error" : undefined
          }
        />
        {fieldErrors.email && (
          <span
            id="mission-control-email-error"
            className="mt-1.5 block text-xs text-crimson-300"
          >
            {fieldErrors.email}
          </span>
        )}
      </label>

      <label className="block" htmlFor="mission-control-password">
        <span className={labelClass}>Password</span>
        <span className="relative block">
          <input
            id="mission-control-password"
            className="contact-field pr-20"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              markTyping();
              setPassword(event.target.value);
            }}
            disabled={disabled || submitting}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password
                ? "mission-control-password-error"
                : undefined
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 font-accent text-[0.7rem] uppercase tracking-[0.16em] text-steel-400 hover:text-parchment-100 transition-colors"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            disabled={disabled}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </span>
        {fieldErrors.password && (
          <span
            id="mission-control-password-error"
            className="mt-1.5 block text-xs text-crimson-300"
          >
            {fieldErrors.password}
          </span>
        )}
      </label>

      <label
        htmlFor="mission-control-remember"
        className="flex items-center gap-3 text-sm text-parchment-300 cursor-pointer select-none"
      >
        <input
          id="mission-control-remember"
          type="checkbox"
          className="h-4 w-4 accent-crimson-500"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          disabled={disabled || submitting}
        />
        Remember me on this device
      </label>

      {(error || notice) && (
        <p className="form-notice" role="alert">
          {error || notice}
        </p>
      )}

      <Button type="submit" disabled={disabled || submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
