import { useState, useEffect, useRef } from "react";

// ─── Icons (inline SVGs via Lucide-style components) ───────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const icons = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check: "M20 6L9 17l-5-5",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10m-3 0a3 3 0 106 0 3 3 0 00-6 0",
  clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  package: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z",
  x: "M18 6L6 18M6 6l12 12",
  bookOpen: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  cpu: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  stethoscope: "M4.5 12.5A7.5 7.5 0 0012 20a7.5 7.5 0 007.5-7.5M12 12V4.5M12 12a3 3 0 100-6 3 3 0 000 6z",
  chevronRight: "M9 18l6-6-6-6",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
};

const COLORS = {
  green: "#046A38",
  greenLight: "#057a42",
  greenPale: "#e8f5ee",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  gray800: "#1F2937",
  gray900: "#111827",
  red: "#EF4444",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CAMPUSES = ["NUST", "KUST", "FAST-NUCES", "King Edward Medical", "IBA Karachi", "LUMS"];

const MOCK_LISTINGS = [
  { id: 1, title: "Anatomy Atlas (Netter's) 7th Ed", price: 3200, condition: "A", campus: "NUST", seller: "Areeba K.", trust: 4.9, category: "Medical & Dental Kits", image: "📚", daysAgo: 1 },
  { id: 2, title: "Surgical Instrument Set – Complete", price: 18500, condition: "B", campus: "King Edward Medical", seller: "Zain A.", trust: 4.7, category: "Medical & Dental Kits", image: "🔬", daysAgo: 2 },
  { id: 3, title: "ACCA F3 Study Pack (BPP)", price: 1800, condition: "A", campus: "LUMS", seller: "Sara M.", trust: 5.0, category: "Exam Study Books", image: "📗", daysAgo: 1 },
  { id: 4, title: "Arduino Mega + Sensor Kit", price: 4500, condition: "A", campus: "FAST-NUCES", seller: "Hassan B.", trust: 4.8, category: "Engineering & CS Lab Tools", image: "⚡", daysAgo: 3 },
  { id: 5, title: "Oscilloscope – Hantek USB", price: 8200, condition: "B", campus: "NUST", seller: "Usman R.", trust: 4.6, category: "Engineering & CS Lab Tools", image: "📡", daysAgo: 5 },
  { id: 6, title: "Hostel Mattress (Single) + Sheets", price: 2100, condition: "B", campus: "IBA Karachi", seller: "Fatima Z.", trust: 4.9, category: "Hostel Items", image: "🛏️", daysAgo: 2 },
  { id: 7, title: "Dental Phantom Head Model", price: 12000, condition: "A", campus: "King Edward Medical", seller: "Ayesha N.", trust: 4.8, category: "Medical & Dental Kits", image: "🦷", daysAgo: 4 },
  { id: 8, title: "CA Intermediate Tax Module", price: 950, condition: "C", campus: "IBA Karachi", seller: "Omar S.", trust: 4.5, category: "Exam Study Books", image: "📘", daysAgo: 6 },
  { id: 9, title: "Raspberry Pi 4 (4GB RAM)", price: 11500, condition: "A", campus: "KUST", seller: "Bilal H.", trust: 4.7, category: "Engineering & CS Lab Tools", image: "💻", daysAgo: 1 },
  { id: 10, title: "Mini Fridge (120L) with warranty", price: 6800, condition: "B", campus: "NUST", seller: "Hina J.", trust: 4.9, category: "Hostel Items", image: "❄️", daysAgo: 3 },
];

const CATEGORIES = [
  { label: "All Items", icon: "📦" },
  { label: "Medical & Dental Kits", icon: "🩺" },
  { label: "Exam Study Books", icon: "📚" },
  { label: "Engineering & CS Lab Tools", icon: "⚙️" },
  { label: "Hostel Items", icon: "🏠" },
];

const SAFE_ZONES = {
  "NUST": "NUST Main Gate – Security Booth (Camera Monitored)",
  "KUST": "KUST Admin Block Lobby",
  "FAST-NUCES": "FAST-NUCES Library Entrance",
  "King Edward Medical": "KE Main Reception Desk",
  "IBA Karachi": "IBA Student Services Center",
  "LUMS": "LUMS Academic Block Foyer",
};

// ─── Shared Components ───────────────────────────────────────────────────────
function Badge({ grade }) {
  const colors = {
    A: { bg: "#DCFCE7", text: "#15803D", label: "Grade A – Mint" },
    B: { bg: "#FEF9C3", text: "#A16207", label: "Grade B – Good" },
    C: { bg: "#FEE2E2", text: "#B91C1C", label: "Grade C – Fair" },
  };
  const c = colors[grade] || colors.C;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>
      {c.label}
    </span>
  );
}

function TrustBadge({ score }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: COLORS.amber }}>
      ⭐ {score.toFixed(1)}
    </span>
  );
}

function ContactGuard({ children }) {
  const [warn, setWarn] = useState(false);
  const phonePattern = /(\d[\s\-]?){10,}|03\d{9}|whatsapp|whtsp|wa\.me|phone|contact me/i;

  function handleChange(e) {
    if (phonePattern.test(e.target.value)) {
      setWarn(true);
      setTimeout(() => setWarn(false), 5000);
    }
  }

  return (
    <div>
      {warn && (
        <div style={{
          background: COLORS.amberLight, border: `1.5px solid ${COLORS.amber}`,
          borderRadius: 10, padding: "10px 14px", marginBottom: 8,
          fontSize: 13, color: "#92400E", display: "flex", alignItems: "center", gap: 8
        }}>
          <Icon d={icons.alertTriangle} size={16} />
          <strong>Stay safe!</strong> Sharing contacts publicly voids your PKR 680 escrow insurance. All deals stay digital.
        </div>
      )}
      {children(handleChange)}
    </div>
  );
}

function SafetyButton({ campus }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: COLORS.red, color: "#fff",
          border: "none", borderRadius: 10, padding: "10px 18px",
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8
        }}
      >
        <Icon d={icons.alertTriangle} size={16} /> Report Unsafe Situation
      </button>
      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: 28, maxWidth: 380, width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 20, marginBottom: 4 }}>🚨</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORS.red }}>Emergency Alert</h3>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.gray400 }}>
                <Icon d={icons.x} size={20} />
              </button>
            </div>
            <p style={{ color: COLORS.gray600, fontSize: 14, marginBottom: 18 }}>
              Your safety is our priority. Use one of these options immediately:
            </p>
            <a
              href="https://wa.me/923001234567?text=🚨SOS: I need help at a PureCycle meetup"
              target="_blank" rel="noreferrer"
              style={{
                display: "block", background: "#25D366", color: "#fff",
                borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 14,
                textDecoration: "none", textAlign: "center", marginBottom: 10
              }}
            >
              📲 WhatsApp PureCycle SOS
            </a>
            <button
              style={{
                display: "block", width: "100%", background: COLORS.red, color: "#fff",
                border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700,
                fontSize: 14, cursor: "pointer", marginBottom: 10
              }}
              onClick={() => { alert("SOS Alert sent to PureCycle Safety Team! Help is on the way."); setOpen(false); }}
            >
              🆘 Trigger SOS Alert
            </button>
            <p style={{ fontSize: 12, color: COLORS.gray400, textAlign: "center", margin: 0 }}>
              Campus location: {campus || "Unknown"} – All meetups are camera-monitored.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page 1: Landing ─────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: COLORS.gray900 }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 1px 0 #E5E7EB" : "none",
        transition: "all 0.3s", padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: COLORS.green, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>PureCycle</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setPage("auth")} style={{
            background: "none", border: `1.5px solid ${COLORS.green}`, color: COLORS.green,
            borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", fontSize: 14
          }}>Log In</button>
          <button onClick={() => setPage("auth")} style={{
            background: COLORS.green, color: "#fff", border: "none",
            borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", fontSize: 14
          }}>Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.green} 0%, #034d29 100%)`,
        color: "#fff", padding: "80px 24px 100px", textAlign: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: 99,
            padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24, letterSpacing: 0.5
          }}>
            🇵🇰 Pakistan's First Verified Student Marketplace
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 900,
            lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-1.5px"
          }}>
            Buy & sell on your campus.
          </h1>
          <p style={{ fontSize: 20, opacity: 0.85, marginBottom: 36, fontWeight: 400 }}>
            Your campus. Your community. Your marketplace.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("auth")} style={{
              background: "#fff", color: COLORS.green, border: "none",
              borderRadius: 12, padding: "14px 32px", fontWeight: 800, fontSize: 16,
              cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}>
              Browse Market →
            </button>
            <button onClick={() => setPage("auth")} style={{
              background: COLORS.amber, color: "#1c1c1c", border: "none",
              borderRadius: 12, padding: "14px 32px", fontWeight: 800, fontSize: 16,
              cursor: "pointer"
            }}>
              🎓 Start Selling (Requires .edu.pk)
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, opacity: 0.65 }}>
            No sign-up fee · University-verified only · Escrow-protected payments
          </p>
        </div>
      </section>

      {/* Stats banner */}
      <div style={{ background: COLORS.gray900, color: "#fff", padding: "20px 24px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", display: "flex",
          justifyContent: "space-around", flexWrap: "wrap", gap: 20
        }}>
          {[
            ["6 Pilot Campuses", "Active & growing"],
            ["PKR 0 Listing Fees", "Free to post"],
            ["PKR 680 Coverage", "Escrow insurance"],
            ["100% .edu.pk Verified", "No outsiders"],
          ].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 20, color: "#4ADE80" }}>{n}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem / Solution */}
      <section style={{ padding: "80px 24px", background: COLORS.gray50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: COLORS.green, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>The Problem We Solve</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.5px", margin: "8px 0" }}>
              Students overpay. Seniors throw away.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 700, margin: "0 auto" }}>
            {[
              { icon: "🩺", title: "Medical Kit", problem: "PKR 40,000+ new", solution: "PKR 18,500 on PureCycle" },
              { icon: "📚", title: "ACCA Study Pack", problem: "PKR 8,000+ new", solution: "PKR 1,800 on PureCycle" },
              { icon: "⚡", title: "Arduino Lab Kit", problem: "PKR 9,500+ new", solution: "PKR 4,500 on PureCycle" },
              { icon: "🦷", title: "Dental Phantom Head", problem: "PKR 25,000+ new", solution: "PKR 12,000 on PureCycle" },
            ].map(item => (
              <div key={item.title} style={{
                background: "#fff", borderRadius: 16, padding: 24,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB"
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.title}</div>
                <div style={{
                  fontSize: 12, color: COLORS.red, background: "#FEE2E2",
                  padding: "3px 10px", borderRadius: 99, display: "inline-block", marginBottom: 6
                }}>❌ {item.problem}</div>
                <div style={{
                  fontSize: 12, color: "#15803D", background: "#DCFCE7",
                  padding: "3px 10px", borderRadius: 99, display: "inline-block", marginLeft: 4
                }}>✅ {item.solution}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: COLORS.green, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>How PureCycle Works</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.5px", margin: "8px 0" }}>
              Four steps to a safe trade
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { step: "01", icon: "📸", title: "List or Browse", desc: "Upload items in seconds. Photos, price, condition — done." },
              { step: "02", icon: "🎓", title: "Verify Identity", desc: "Sign up with your .edu.pk email. OTP-confirmed. No outsiders." },
              { step: "03", icon: "💳", title: "Pay Safely", desc: "Payment held in EasyPaisa/JazzCash escrow until handover." },
              { step: "04", icon: "🤝", title: "Meet & Enter PIN", desc: "Hand over at Campus Safe Zone. Buyer shares PIN. Funds release instantly." },
            ].map(item => (
              <div key={item.step} style={{
                position: "relative", background: COLORS.gray50,
                borderRadius: 18, padding: "28px 22px", border: "1px solid #E5E7EB"
              }}>
                <div style={{
                  position: "absolute", top: -14, left: 22, background: COLORS.green,
                  color: "#fff", fontWeight: 900, fontSize: 12, padding: "4px 12px",
                  borderRadius: 99, letterSpacing: 1
                }}>{item.step}</div>
                <div style={{ fontSize: 32, marginBottom: 14, marginTop: 8 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ color: COLORS.gray600, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.green} 0%, #034d29 100%)`,
        padding: "64px 24px", textAlign: "center", color: "#fff"
      }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
          Join your campus marketplace today.
        </h2>
        <p style={{ opacity: 0.8, marginBottom: 32, fontSize: 16 }}>Pilot campuses: NUST · KUST · FAST-NUCES · King Edward · IBA · LUMS</p>
        <button onClick={() => setPage("auth")} style={{
          background: "#fff", color: COLORS.green, border: "none",
          borderRadius: 12, padding: "16px 40px", fontWeight: 900, fontSize: 18, cursor: "pointer"
        }}>
          Create Free Account →
        </button>
      </section>
    </div>
  );
}

// ─── Page 2: Auth ─────────────────────────────────────────────────────────────
function AuthPage({ setPage, setUser }) {
  const [step, setStep] = useState("email"); // email → otp → campus
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const otpRefs = useRef([]);
  const [shake, setShake] = useState(false);

  function validateEmail() {
    if (!email.endsWith(".edu.pk")) {
      setEmailError("Only .edu.pk university emails are allowed on PureCycle.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return false;
    }
    setEmailError("");
    return true;
  }

  function handleEmailSubmit() {
    if (validateEmail()) setStep("otp");
  }

  function handleOtpChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  }

  function handleOtpSubmit() {
    if (otp.join("").length === 6) setStep("campus");
  }

  function handleCampusFinish() {
    if (!selectedCampus) return;
    setUser({ email, campus: selectedCampus });
    setPage("marketplace");
  }

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.gray50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#fff", borderRadius: 14, padding: "12px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
          }}>
            <div style={{
              width: 36, height: 36, background: COLORS.green, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900
            }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>PureCycle</span>
          </div>
        </div>

        <div style={{
          background: "#fff", borderRadius: 20, padding: "36px 32px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB"
        }}>
          {step === "email" && (
            <>
              <h2 style={{ fontWeight: 900, fontSize: 24, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Join your campus</h2>
              <p style={{ color: COLORS.gray600, fontSize: 14, marginBottom: 28 }}>Verified .edu.pk emails only — your campus, your community.</p>

              <div style={{ marginBottom: 6 }}>
                <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>University Email</label>
                <input
                  type="email"
                  placeholder="yourname@uni.edu.pk"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                  style={{
                    width: "100%", padding: "12px 14px", fontSize: 15,
                    border: `2px solid ${emailError ? COLORS.red : "#E5E7EB"}`,
                    borderRadius: 10, outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit",
                    animation: shake ? "shake 0.4s" : "none"
                  }}
                />
                {emailError && (
                  <div style={{
                    marginTop: 8, background: "#FEE2E2", border: "1px solid #FECACA",
                    borderRadius: 8, padding: "8px 12px", fontSize: 13, color: COLORS.red,
                    display: "flex", alignItems: "center", gap: 6
                  }}>
                    <Icon d={icons.alertTriangle} size={14} /> {emailError}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12, marginBottom: 24, padding: "10px 14px", background: COLORS.greenPale, borderRadius: 10, fontSize: 13, color: "#166534" }}>
                <strong>🔒 Campus-Only Access:</strong> We verify your .edu.pk email to ensure a safe, trusted community.
              </div>

              <button onClick={handleEmailSubmit} style={{
                width: "100%", background: COLORS.green, color: "#fff", border: "none",
                borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer"
              }}>
                Continue with University Email →
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: COLORS.gray400, marginTop: 16 }}>
                Already have an account?{" "}
                <span onClick={() => {}} style={{ color: COLORS.green, cursor: "pointer", fontWeight: 600 }}>Sign In</span>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 style={{ fontWeight: 900, fontSize: 24, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Verify your email</h2>
              <p style={{ color: COLORS.gray600, fontSize: 14, marginBottom: 28 }}>
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    style={{
                      width: 46, height: 54, textAlign: "center", fontSize: 22,
                      fontWeight: 800, border: `2px solid ${digit ? COLORS.green : "#E5E7EB"}`,
                      borderRadius: 10, outline: "none", fontFamily: "inherit",
                      transition: "border-color 0.2s"
                    }}
                  />
                ))}
              </div>
              <button onClick={handleOtpSubmit} disabled={otp.join("").length < 6}
                style={{
                  width: "100%", background: otp.join("").length === 6 ? COLORS.green : COLORS.gray200,
                  color: otp.join("").length === 6 ? "#fff" : COLORS.gray400,
                  border: "none", borderRadius: 10, padding: "14px",
                  fontWeight: 700, fontSize: 15, cursor: otp.join("").length === 6 ? "pointer" : "default",
                  transition: "all 0.2s"
                }}>
                Verify OTP →
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: COLORS.gray400, marginTop: 16 }}>
                Didn't get a code? <span style={{ color: COLORS.green, cursor: "pointer", fontWeight: 600 }}>Resend</span>
              </p>
              <p style={{ textAlign: "center", fontSize: 12, color: COLORS.gray400, marginTop: 6 }}>
                (Demo: enter any 6 digits)
              </p>
            </>
          )}

          {step === "campus" && (
            <>
              <h2 style={{ fontWeight: 900, fontSize: 24, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Select your campus</h2>
              <p style={{ color: COLORS.gray600, fontSize: 14, marginBottom: 24 }}>Your feed will show listings from your campus by default.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                {CAMPUSES.map(c => (
                  <button key={c} onClick={() => setSelectedCampus(c)} style={{
                    background: selectedCampus === c ? COLORS.greenPale : "#fff",
                    border: `2px solid ${selectedCampus === c ? COLORS.green : "#E5E7EB"}`,
                    borderRadius: 10, padding: "12px 10px", fontSize: 13,
                    fontWeight: selectedCampus === c ? 700 : 500,
                    color: selectedCampus === c ? COLORS.green : COLORS.gray800,
                    cursor: "pointer", textAlign: "center", transition: "all 0.15s"
                  }}>
                    🎓 {c}
                  </button>
                ))}
              </div>
              <button onClick={handleCampusFinish} disabled={!selectedCampus} style={{
                width: "100%", background: selectedCampus ? COLORS.green : COLORS.gray200,
                color: selectedCampus ? "#fff" : COLORS.gray400,
                border: "none", borderRadius: 10, padding: "14px",
                fontWeight: 700, fontSize: 15,
                cursor: selectedCampus ? "pointer" : "default"
              }}>
                Enter Marketplace →
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: COLORS.gray400, marginTop: 20 }}>
          PureCycle is exclusively for verified university students.<br />
          By signing up you agree to our Community Guidelines.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

// ─── Page 3: Marketplace Feed ─────────────────────────────────────────────────
function MarketplacePage({ user, setPage, setSelectedItem }) {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [campusFilter, setCampusFilter] = useState(user?.campus || "All");

  const filtered = MOCK_LISTINGS.filter(item => {
    const matchesCat = activeCategory === "All Items" || item.category === activeCategory;
    const matchesCampus = campusFilter === "All" || item.campus === campusFilter;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesCampus && matchesSearch;
  });

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.gray50, minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
        boxShadow: "0 1px 0 #E5E7EB", padding: "12px 20px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
            <div style={{
              width: 32, height: 32, background: COLORS.green, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14
            }}>P</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>PureCycle</div>
              <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: -2 }}>🎓 {user?.campus}</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 360 }}>
            <Icon d={icons.search} size={16} className="search-icon" style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.gray400
            }} />
            <input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px 9px 36px",
                border: "1.5px solid #E5E7EB", borderRadius: 10,
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit"
              }}
            />
          </div>

          {/* Campus filter */}
          <select
            value={campusFilter}
            onChange={e => setCampusFilter(e.target.value)}
            style={{
              padding: "9px 14px", border: "1.5px solid #E5E7EB", borderRadius: 10,
              fontSize: 13, fontWeight: 600, background: "#fff", color: COLORS.gray800,
              cursor: "pointer", outline: "none", fontFamily: "inherit"
            }}
          >
            <option value="All">All Campuses</option>
            {CAMPUSES.map(c => <option key={c}>{c}</option>)}
          </select>

          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10,
              padding: "9px 12px", cursor: "pointer", color: COLORS.gray600
            }}>
              <Icon d={icons.bell} size={18} />
            </button>
            <button style={{
              background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10,
              padding: "9px 12px", cursor: "pointer", color: COLORS.gray600
            }}>
              <Icon d={icons.user} size={18} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {/* Campus banner */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.green}, #034d29)`,
          borderRadius: 16, padding: "20px 24px", color: "#fff",
          marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
        }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
              Your Campus Feed
            </div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>🎓 {user?.campus}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              {filtered.length} items available near you
            </div>
          </div>
          <button style={{
            background: COLORS.amber, color: "#1c1c1c", border: "none",
            borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <Icon d={icons.plus} size={16} /> List an Item
          </button>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 28 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.label} onClick={() => setActiveCategory(cat.label)} style={{
              whiteSpace: "nowrap", padding: "9px 18px",
              background: activeCategory === cat.label ? COLORS.green : "#fff",
              color: activeCategory === cat.label ? "#fff" : COLORS.gray700,
              border: `1.5px solid ${activeCategory === cat.label ? COLORS.green : "#E5E7EB"}`,
              borderRadius: 99, fontWeight: 600, fontSize: 13, cursor: "pointer",
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6
            }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.gray400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>No listings match your filters</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Try a different campus or category</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20
          }}>
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => { setSelectedItem(item); setPage("transaction"); }}
                style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden",
                  border: "1px solid #E5E7EB", cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "transform 0.15s, box-shadow 0.15s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                {/* Image area */}
                <div style={{
                  height: 140, background: `linear-gradient(135deg, ${COLORS.greenPale}, #d1fae5)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 56, position: "relative"
                }}>
                  {item.image}
                  <div style={{
                    position: "absolute", top: 10, right: 10
                  }}>
                    <Badge grade={item.condition} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px 16px 18px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.green, marginBottom: 10 }}>
                    PKR {item.price.toLocaleString()}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 10, borderTop: "1px solid #F3F4F6"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 26, height: 26, background: COLORS.greenPale, borderRadius: 99,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                        fontWeight: 700, color: COLORS.green
                      }}>
                        {item.seller[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{item.seller}</div>
                        <div style={{ fontSize: 11, color: COLORS.gray400 }}>{item.campus}</div>
                      </div>
                    </div>
                    <TrustBadge score={item.trust} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray400 }}>
                    🕐 {item.daysAgo === 1 ? "1 day ago" : `${item.daysAgo} days ago`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        background: COLORS.green, color: "#fff", border: "none",
        borderRadius: 99, padding: "16px 22px",
        fontWeight: 800, fontSize: 15, cursor: "pointer",
        boxShadow: "0 6px 24px rgba(4,106,56,0.45)",
        display: "flex", alignItems: "center", gap: 10,
        transition: "transform 0.15s"
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <Icon d={icons.plus} size={20} /> List an Item
      </button>
    </div>
  );
}

// ─── Page 4: Secure Transaction ───────────────────────────────────────────────
function TransactionPage({ user, item, setPage }) {
  const [view, setView] = useState("detail"); // detail → buyer → seller
  const [pin] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours
  const [sellerPin, setSellerPin] = useState("");
  const [released, setReleased] = useState(false);
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (view !== "buyer") return;
    const t = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, [view]);

  const fmtTime = s => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const platformFee = Math.round(item.price * 0.10);
  const sellerPayout = item.price - platformFee;

  if (!item) return null;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.gray50, minHeight: "100vh" }}>
      {/* Nav */}
      <div style={{
        background: "#fff", boxShadow: "0 1px 0 #E5E7EB",
        padding: "14px 20px", display: "flex", alignItems: "center", gap: 16
      }}>
        <button onClick={() => view === "detail" ? setPage("marketplace") : setView("detail")} style={{
          background: "none", border: "1.5px solid #E5E7EB", borderRadius: 8,
          padding: "7px 12px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: COLORS.gray700
        }}>
          ← Back
        </button>
        <div style={{ fontWeight: 800, fontSize: 16 }}>
          {view === "detail" ? "Item Details" : view === "buyer" ? "🔐 Secure Transaction Hub" : "💰 Collect Payout"}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <SafetyButton campus={user?.campus} />
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px" }}>

        {/* ── Detail View ── */}
        {view === "detail" && (
          <>
            <div style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB", marginBottom: 20
            }}>
              {/* Hero image */}
              <div style={{
                height: 200, background: `linear-gradient(135deg, ${COLORS.greenPale}, #d1fae5)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80
              }}>
                {item.image}
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  <Badge grade={item.condition} />
                  <span style={{
                    fontSize: 12, background: COLORS.greenPale, color: COLORS.green,
                    padding: "2px 10px", borderRadius: 99, fontWeight: 600
                  }}>
                    🎓 {item.campus}
                  </span>
                </div>
                <h2 style={{ fontWeight: 900, fontSize: 22, margin: "0 0 8px", letterSpacing: "-0.5px" }}>{item.title}</h2>
                <div style={{ fontWeight: 900, fontSize: 30, color: COLORS.green, marginBottom: 16 }}>
                  PKR {item.price.toLocaleString()}
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", background: COLORS.gray50, borderRadius: 12, marginBottom: 20
                }}>
                  <div style={{
                    width: 44, height: 44, background: COLORS.greenPale, borderRadius: 99,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 900, color: COLORS.green
                  }}>
                    {item.seller[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{item.seller}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray400 }}>Verified {item.campus} Student</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <TrustBadge score={item.trust} />
                    <div style={{ fontSize: 11, color: COLORS.gray400, textAlign: "right" }}>Trust Score</div>
                  </div>
                </div>

                {/* Escrow info */}
                <div style={{
                  background: COLORS.amberLight, border: `1px solid ${COLORS.amber}`,
                  borderRadius: 12, padding: "14px 16px", marginBottom: 20,
                  display: "flex", gap: 10
                }}>
                  <Icon d={icons.shield} size={20} style={{ color: "#B45309", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#92400E" }}>Escrow Protected</div>
                    <div style={{ fontSize: 12, color: "#B45309", marginTop: 2 }}>
                      Your payment (PKR {item.price.toLocaleString()}) is held safely until physical handover at a Campus Safe Zone. Platform fee: 10%.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setView("buyer")} style={{
                    flex: 2, background: COLORS.green, color: "#fff", border: "none",
                    borderRadius: 12, padding: "15px", fontWeight: 800, fontSize: 16,
                    cursor: "pointer"
                  }}>
                    🔐 Secure Buy with Escrow
                  </button>
                  <button onClick={() => setView("seller")} style={{
                    flex: 1, background: "#fff", color: COLORS.green,
                    border: `2px solid ${COLORS.green}`,
                    borderRadius: 12, padding: "15px", fontWeight: 700, fontSize: 14,
                    cursor: "pointer"
                  }}>
                    I'm the Seller
                  </button>
                </div>
              </div>
            </div>

            {/* Contact guard demo */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>💬 Ask a Question</h3>
              <ContactGuard>
                {(onChange) => (
                  <textarea
                    placeholder="Ask about condition, availability... (Contact info is blocked for your safety)"
                    onChange={onChange}
                    style={{
                      width: "100%", height: 80, padding: "10px 12px",
                      border: "1.5px solid #E5E7EB", borderRadius: 10,
                      fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                )}
              </ContactGuard>
              <button style={{
                background: COLORS.green, color: "#fff", border: "none",
                borderRadius: 8, padding: "9px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer",
                marginTop: 8, display: "flex", alignItems: "center", gap: 6
              }}>
                <Icon d={icons.send} size={14} /> Send Message
              </button>
            </div>
          </>
        )}

        {/* ── Buyer View ── */}
        {view === "buyer" && (
          <>
            <div style={{
              background: "#fff", borderRadius: 20, padding: 28,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB", marginBottom: 20
            }}>
              <div style={{
                textAlign: "center", padding: "20px 0 28px",
                borderBottom: "1px solid #F3F4F6", marginBottom: 24
              }}>
                <div style={{
                  display: "inline-block", background: COLORS.greenPale,
                  borderRadius: 99, padding: "8px 20px", fontSize: 13, fontWeight: 700,
                  color: COLORS.green, marginBottom: 16
                }}>
                  ✅ Payment Held in Escrow
                </div>
                <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Your 6-Digit Secure PIN</div>
                <p style={{ color: COLORS.gray600, fontSize: 14, margin: "0 0 24px" }}>
                  Show this PIN to the seller <strong>only after</strong> physical handover at the Safe Zone.
                </p>

                {/* PIN display */}
                <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                  {pin.split("").map((d, i) => (
                    <div key={i} style={{
                      width: 52, height: 64, background: COLORS.gray900, color: "#4ADE80",
                      borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: 28, fontFamily: "monospace",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                    }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Timer */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: timeLeft < 300 ? "#FEE2E2" : COLORS.amberLight,
                  border: `1px solid ${timeLeft < 300 ? COLORS.red : COLORS.amber}`,
                  borderRadius: 10, padding: "8px 16px",
                  color: timeLeft < 300 ? COLORS.red : "#92400E", fontWeight: 700, fontSize: 16
                }}>
                  <Icon d={icons.clock} size={18} />
                  PIN expires in {fmtTime(timeLeft)}
                </div>
              </div>

              {/* Meeting location */}
              <div style={{
                background: COLORS.greenPale, borderRadius: 14, padding: "16px 18px", marginBottom: 20
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Icon d={icons.mapPin} size={20} style={{ color: COLORS.green, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.green, marginBottom: 2 }}>
                      Campus Safe Zone — Locked Meetup Location
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.gray800 }}>
                      {SAFE_ZONES[item.campus] || SAFE_ZONES["NUST"]}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>
                      📹 24/7 camera monitored · Security personnel on-site
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Follow these steps:</div>
                {[
                  "Head to the Campus Safe Zone location above.",
                  "Inspect the item carefully before handing over any PIN.",
                  "If satisfied, reveal your 6-digit PIN to the seller.",
                  "Seller enters PIN — your escrow releases instantly.",
                  "Both parties leave with confirmation SMS."
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{
                      width: 22, height: 22, background: COLORS.green, color: "#fff",
                      borderRadius: 99, fontSize: 11, fontWeight: 800, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray700, paddingTop: 2 }}>{step}</div>
                  </div>
                ))}
              </div>

              <SafetyButton campus={item.campus} />
            </div>

            <div style={{
              background: COLORS.gray900, color: "#fff", borderRadius: 14, padding: "14px 18px",
              fontSize: 13, display: "flex", gap: 10, alignItems: "center"
            }}>
              <Icon d={icons.lock} size={16} style={{ color: "#4ADE80", flexShrink: 0 }} />
              Your payment of <strong>PKR {item.price.toLocaleString()}</strong> is secured by EasyPaisa/JazzCash escrow until PIN verification. Never release the PIN before receiving your item.
            </div>
          </>
        )}

        {/* ── Seller View ── */}
        {view === "seller" && (
          <div style={{
            background: "#fff", borderRadius: 20, padding: 28,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB"
          }}>
            {!released ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
                  <h2 style={{ fontWeight: 900, fontSize: 22, margin: "0 0 8px" }}>Collect Your Payout</h2>
                  <p style={{ color: COLORS.gray600, fontSize: 14, margin: 0 }}>
                    After physically handing over the item at the Safe Zone, ask the buyer for their 6-digit PIN.
                  </p>
                </div>

                {/* Payout breakdown */}
                <div style={{
                  background: COLORS.gray50, borderRadius: 14, padding: "18px 20px", marginBottom: 24
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Payout Summary</div>
                  {[
                    ["Item Sale Price", `PKR ${item.price.toLocaleString()}`],
                    ["Platform Fee (10%)", `– PKR ${platformFee.toLocaleString()}`],
                  ].map(([label, val]) => (
                    <div key={label} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: 14, marginBottom: 8, color: COLORS.gray700
                    }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1.5px solid #E5E7EB", paddingTop: 10, marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 800, fontSize: 16 }}>You Receive</span>
                    <span style={{ fontWeight: 900, fontSize: 18, color: COLORS.green }}>PKR {sellerPayout.toLocaleString()}</span>
                  </div>
                </div>

                {/* PIN input */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 700, fontSize: 14, display: "block", marginBottom: 8 }}>
                    Enter Buyer's 6-Digit PIN
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="_ _ _ _ _ _"
                    value={sellerPin}
                    onChange={e => { setSellerPin(e.target.value.replace(/\D/g, "")); setPinError(""); }}
                    style={{
                      width: "100%", padding: "16px", fontSize: 28, fontWeight: 900,
                      letterSpacing: "0.5em", textAlign: "center",
                      border: `2px solid ${pinError ? COLORS.red : sellerPin.length === 6 ? COLORS.green : "#E5E7EB"}`,
                      borderRadius: 12, outline: "none", fontFamily: "monospace",
                      boxSizing: "border-box", transition: "border-color 0.2s"
                    }}
                  />
                  {pinError && (
                    <div style={{
                      marginTop: 8, background: "#FEE2E2", borderRadius: 8,
                      padding: "8px 12px", fontSize: 13, color: COLORS.red,
                      display: "flex", gap: 6, alignItems: "center"
                    }}>
                      <Icon d={icons.alertTriangle} size={14} /> {pinError}
                    </div>
                  )}
                </div>

                <button
                  disabled={sellerPin.length < 6}
                  onClick={() => {
                    if (sellerPin === pin) {
                      setReleased(true);
                    } else {
                      setPinError("Incorrect PIN. Ask the buyer to confirm the PIN again.");
                    }
                  }}
                  style={{
                    width: "100%", background: sellerPin.length === 6 ? COLORS.green : COLORS.gray200,
                    color: sellerPin.length === 6 ? "#fff" : COLORS.gray400,
                    border: "none", borderRadius: 12, padding: "15px",
                    fontWeight: 800, fontSize: 16, cursor: sellerPin.length === 6 ? "pointer" : "default",
                    transition: "all 0.2s", marginBottom: 12
                  }}>
                  ✅ Verify & Release Funds
                </button>
                <p style={{ fontSize: 12, color: COLORS.gray400, textAlign: "center" }}>
                  (Demo: PIN is <strong>{pin}</strong>)
                </p>

                <div style={{ marginTop: 16 }}>
                  <SafetyButton campus={item.campus} />
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontWeight: 900, fontSize: 24, margin: "0 0 10px", color: COLORS.green }}>
                  Funds Released!
                </h2>
                <p style={{ color: COLORS.gray600, fontSize: 15, marginBottom: 24 }}>
                  PKR <strong style={{ color: COLORS.green }}>{sellerPayout.toLocaleString()}</strong> has been sent to your EasyPaisa/JazzCash wallet.
                </p>
                <div style={{
                  background: COLORS.greenPale, borderRadius: 14, padding: "16px 20px", textAlign: "left", marginBottom: 24
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.green }}>Transaction Summary</div>
                  {[
                    ["Item", item.title],
                    ["Sale Price", `PKR ${item.price.toLocaleString()}`],
                    ["Platform Fee", `PKR ${platformFee.toLocaleString()}`],
                    ["Your Payout", `PKR ${sellerPayout.toLocaleString()}`],
                    ["Status", "✅ Completed"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: COLORS.gray600 }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPage("marketplace")} style={{
                  background: COLORS.green, color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer"
                }}>
                  Back to Marketplace
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing"); // landing | auth | marketplace | transaction
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "auth" && <AuthPage setPage={setPage} setUser={setUser} />}
      {page === "marketplace" && (
        <MarketplacePage user={user} setPage={setPage} setSelectedItem={setSelectedItem} />
      )}
      {page === "transaction" && selectedItem && (
        <TransactionPage user={user} item={selectedItem} setPage={setPage} />
      )}
    </div>
  );
}
