# Brave Gym — Premium Gym Website
### Complete Project Specification & Build Document
**Stack:** React (Vite) + Node.js/Express + MongoDB · **Build environment:** Antigravity

---

## Table of Contents
1. Project Vision
2. Design System (Black & White Premium Theme)
3. Tech Stack
4. Site Map & Page Breakdown
5. Animation & Scroll Interaction Spec
6. User Dashboard Spec
7. Admin Dashboard Spec
8. Database Schema
9. API Endpoints
10. Auth & Security
11. Folder Structure
12. Starter Scripts
13. Third-Party Integrations
14. Deployment (Budget-Friendly)
15. Build Roadmap for Antigravity

---

## 1. Project Vision

Brave Gym is not a generic "fitness template" — it should feel like a boutique athletic brand (think: the visual weight of a Nike campaign page crossed with the precision of a Peloton product page). The site's entire personality comes from **contrast** — literally (black/white) and figuratively (raw effort vs. refined discipline) — and from the brand idea baked into the name itself: showing up and training hard takes courage. Let "brave" show up in the copy (headlines, CTAs, empty states) rather than just sitting in the logo.

**Primary goals:**
- Convert visitors into trial-class sign-ups / membership purchases
- Feel premium and editorial, not templated — no generic SaaS card grids, no stock "fitness gradient" look
- Showcase real motion — video, scroll choreography, and a coherent design language
- Give members a genuinely useful dashboard (bookings, progress, payments)
- Give staff a genuinely useful admin panel (schedules, revenue, content)

**Target users:** prospective members (public site), active members (user dashboard), gym staff/owner (admin dashboard), trainers (limited admin view).

---

## 2. Design System

### 2.1 Color Tokens

Avoid flat `#000000`/`#FFFFFF` everywhere — true black next to true white is harsh at scale. Use a graded monochrome palette instead:

| Token | Hex | Usage |
|---|---|---|
| `--gym-obsidian` | `#0D0D0D` | Primary background (dark sections) |
| `--gym-charcoal` | `#1A1A1A` | Elevated surfaces on dark bg (cards, nav) |
| `--gym-steel` | `#2E2E2E` | Borders/dividers on dark bg |
| `--gym-ash` | `#8C8C8C` | Secondary/muted text |
| `--gym-chalk` | `#F5F5F3` | Primary background (light sections) |
| `--gym-paper` | `#FFFFFF` | Elevated surfaces on light bg, primary text on dark |
| `--gym-ink` | `#111111` | Primary text on light bg |
| `--gym-chrome` | linear-gradient(135deg, `#C9C9C9`, `#FFFFFF`) | CTA hover states, active/highlight accents only |

Keep it strictly monochrome — the "chrome" gradient is the only permitted accent, reserved for interactive states (button hover, active nav link, progress bars). Don't introduce a color accent (no orange/green/blue) — that's what makes it read as premium rather than "template with the color swapped."

### 2.2 Typography

- **Display / Headlines:** [Clash Display](https://www.fontshare.com/fonts/clash-display) (bold, geometric, editorial — free via Fontshare, self-hostable)
- **Body / UI:** [Satoshi](https://www.fontshare.com/fonts/satoshi) (clean humanist sans, pairs cleanly with Clash Display without competing)
- **Numerals/stats (optional third face):** Clash Display works fine for large numerals too — don't add a third typeface

Type scale (desktop, rem-based, 16px root):
| Role | Size | Weight | Line-height |
|---|---|---|---|
| Hero headline | 6–8rem (clamp) | 600 | 0.95 |
| Section headline | 3–3.5rem | 600 | 1.05 |
| Subhead | 1.5rem | 500 | 1.3 |
| Body | 1rem | 400 | 1.6 |
| Small/label | 0.8rem | 500 | 1.4 |

Line length: keep body copy under ~70 characters per line. No tracked-out all-caps eyebrow labels above every heading — use them only where they encode real structure (e.g., a class category tag).

### 2.3 Layout Concept

Asymmetric, editorial — not a centered SaaS-card grid.

```
┌─────────────────────────────────────────┐
│  BRAVE GYM   Programs Trainers Join   ⋮  │  ← thin nav, no box/shadow
├─────────────────────────────────────────┤
│                                           │
│   BE BRAVE.     [full-bleed hero video]  │  ← headline left-aligned,
│   TRAIN HARD.                            │    huge, overlapping the
│              [Book a trial →]            │    video edge
├─────────────────────────────────────────┤
│  01  02  03   ← horizontal marquee stats │  ← scrolls horizontally,
│  (500+ members / 40 classes / 12 coaches)│    driven by scroll position
├───────────────┬───────────────────────────┤
│  Large image  │  Programs copy + list    │  ← 60/40 asymmetric split,
│  (sticky)     │  (scrolls past the image)│    not a 3-col card grid
├───────────────┴───────────────────────────┤
│  Trainers — horizontal scroll gallery    │  ← drag/scroll sideways
├─────────────────────────────────────────┤
│  Full-width testimonial, huge quote mark │
├─────────────────────────────────────────┤
│  Footer — dark, minimal, large BRAVE GYM │
│  wordmark                                │
└─────────────────────────────────────────┘
```

Alignment: predominantly **left-aligned** text (editorial, confident), with the hero headline allowed to break the grid and overlap the video slightly for tension.

### 2.4 Motion Principles

Pick a few deliberate, choreographed moments rather than the generic "fade-and-slide-up on every section" pattern:

1. **One signature load-in:** hero video scales from 105%→100% with a 0.6s ease as the headline letters stagger in. This happens once, on first load only.
2. **Scroll-scrubbed stats marquee:** the "01/02/03" stats row translates horizontally tied directly to scroll position (not time-based), so it feels physically connected to the user's scroll.
3. **Sticky/pinned image reveal:** in the Programs section, the image pins in place while copy scrolls past it, with a clip-path mask reveal on the image itself.
4. **Horizontal drag-scroll gallery:** trainers and gallery sections scroll sideways, not the generic vertical card stack.
5. **Magnetic cursor on primary CTAs only** (not every button) — cursor is pulled slightly toward the button on hover, reinforcing which actions matter.

Respect `prefers-reduced-motion` — disable the scroll-scrub and parallax effects and fall back to simple opacity transitions when it's set.

---

## 3. Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (with the custom tokens above wired into `tailwind.config`)
- Framer Motion — component-level transitions (page transitions, modals, staggered lists)
- GSAP + ScrollTrigger — scroll-scrubbed/pinned effects (the marquee, sticky image reveal)
- Lenis — smooth-scroll wrapper so native scroll and GSAP stay in sync
- React Router v6
- TanStack Query — server state/caching for API calls
- React Hook Form + Zod — forms and validation
- Recharts — admin analytics charts
- Zustand — light global state (auth user, UI state)

**Backend**
- Node.js + Express
- MongoDB + Mongoose (flexible schema suits bookings/schedules well, and Atlas has a usable free tier)
- JWT (access + refresh tokens) + bcrypt
- Multer → Cloudinary (video/image upload + hosting/streaming)
- Nodemailer or Resend (transactional email — booking confirmations, password reset)
- Stripe (payments) — or a regional processor if Stripe isn't supported in your target market
- express-validator or Zod (server-side validation)
- helmet, express-rate-limit, cors (hardening)

---

## 4. Site Map & Page Breakdown

**Public site**
| Page | Purpose | Key sections |
|---|---|---|
| Home | Convert + set the brand tone | Hero video, stats marquee, programs preview, trainer preview, testimonial, CTA |
| Programs / Classes | Browse & filter class types | Filterable grid (strength, HIIT, yoga, boxing…), schedule preview |
| Trainers | Build trust | Horizontal scroll roster, trainer bio modal |
| Membership / Pricing | Convert to paid plan | Plan comparison, FAQ accordion |
| Gallery | Show the space & energy | Masonry/grid of images + autoplaying muted video clips |
| Blog | SEO + authority | List + single-post view |
| About | Brand story | Founder story, mission, facility photos |
| Contact | Lead capture | Form, map embed, hours |
| Login / Register | Auth entry | Split-screen form, social auth optional |

**Authenticated — User Dashboard** (`/dashboard/*`)
| Route | Purpose |
|---|---|
| `/dashboard` | Overview — membership status, next booked class, quick stats |
| `/dashboard/bookings` | Book a class, view upcoming/past bookings, cancel |
| `/dashboard/membership` | Current plan, renew/upgrade, billing history |
| `/dashboard/progress` | Optional workout log + progress photo uploads |
| `/dashboard/profile` | Edit profile, avatar, password, notification prefs |

**Authenticated — Admin Dashboard** (`/admin/*`)
| Route | Purpose |
|---|---|
| `/admin` | Overview — revenue, active members, bookings today, alerts |
| `/admin/members` | Search/filter/manage members, view membership status |
| `/admin/trainers` | Add/edit trainers, assign classes |
| `/admin/classes` | Create/edit class schedule, capacity, recurrence |
| `/admin/memberships` | Manage pricing plans |
| `/admin/payments` | Transaction log, revenue charts, export |
| `/admin/content` | Manage blog posts, gallery media, testimonials |
| `/admin/settings` | Gym info, hours, staff roles/permissions |

---

## 5. Animation & Scroll Interaction Spec

### Hero video
- Full-bleed `<video>`, muted, `autoplay`, `loop`, `playsinline`, with a poster frame for slow connections
- On mount: scale 1.05 → 1.0 over 700ms, headline text split into words/lines and staggered in via Framer Motion (`staggerChildren: 0.08`)
- On scroll past hero: video slightly darkens (overlay opacity 0 → 0.4) so the next section's text stays legible — driven by GSAP ScrollTrigger `scrub: true`

### Scroll-scrubbed video sequence (optional, high-impact)
For a genuinely "premium" scroll-driven video (Apple-style, image sequence scrubbed by scroll rather than a normal playing video):
1. Export the source video as a sequence of ~60–120 JPG/WebP frames
2. Preload frames onto a `<canvas>`
3. Map scroll progress (0–1) to the frame index and draw the matching frame each scroll tick

```js
gsap.to(frameState, {
  frame: totalFrames - 1,
  snap: "frame",
  scrollTrigger: {
    trigger: "#scroll-video-section",
    start: "top top",
    end: "+=3000",
    scrub: 0.5,
    pin: true,
  },
  onUpdate: () => drawFrame(frameState.frame),
});
```

Use this sparingly — one section, not the whole site (it's expensive to build and to load).

### Section reveals
Use `IntersectionObserver` (or Framer Motion's `whileInView`) for simple content reveals — opacity + 24px translate-Y, 400ms, `once: true`. Don't chain this on every single element; group content into deliberate blocks.

### Video-in-viewport playback (gallery)
Gallery/testimonial video clips should only play while scrolled into view, to save bandwidth and avoid a noisy page:

```js
const observer = new IntersectionObserver(
  ([entry]) => (entry.isIntersecting ? videoRef.current.play() : videoRef.current.pause()),
  { threshold: 0.5 }
);
```

---

## 6. User Dashboard Spec

**Overview widget set**
- Membership status card (plan name, renewal date, status badge)
- Next class card (name, trainer, time, "add to calendar")
- Quick stats (classes attended this month, streak)

**Bookings**
- Calendar or list view of the class schedule, filterable by category/trainer
- Book → capacity check → confirmation email
- Cancel (with a policy cutoff, e.g., "cancel up to 4 hours before")

**Membership**
- Current plan + feature list
- Upgrade/downgrade flow
- Billing history with downloadable receipts (PDF)

**Progress (optional but strong for a portfolio piece)**
- Manual workout log (exercise, sets/reps/weight, date)
- Progress photo upload with a before/after slider comparison
- Simple line chart of a chosen metric over time (Recharts)

**Profile**
- Avatar upload (Cloudinary), name/email/phone, password change, notification toggles

---

## 7. Admin Dashboard Spec

**Overview**
- Revenue this month (chart), active members count, new sign-ups, today's class occupancy
- Alerts: memberships expiring in 7 days, low-capacity classes, failed payments

**Members**
- Table: name, email, plan, status, join date — search + filter
- Detail drawer: booking history, payment history, manual status override

**Trainers**
- CRUD trainer profiles (bio, image, specialties, certifications)
- Assign to classes

**Classes/Schedule**
- CRUD classes: title, category, trainer, capacity, recurrence (weekly pattern), duration
- Calendar view of the full week

**Memberships (pricing plans)**
- CRUD plans: name, price, billing interval, feature list, "most popular" flag

**Payments**
- Transaction table with status/method/date, filterable, exportable to CSV
- Revenue-over-time chart, plan-mix breakdown chart

**Content**
- Blog: CRUD posts with a rich-text/markdown editor, cover image upload
- Gallery: upload/organize images & video clips into categories
- Testimonials: CRUD member testimonials

**Settings**
- Gym info (name, address, hours), staff accounts and role permissions (admin/manager/trainer)

**Access control:** admin routes gated by role middleware (`role: 'admin'`); trainers get a scoped-down view (their own classes/roster only), not full admin access.

---

## 8. Database Schema (MongoDB / Mongoose)

| Collection | Key fields |
|---|---|
| **users** | name, email, passwordHash, role (`user`/`trainer`/`admin`), avatarUrl, phone, membershipPlanId, membershipStatus (`active`/`expired`/`none`), membershipExpiry, joinDate, createdAt |
| **trainers** | userId (ref), bio, specialties[], certifications[], imageUrl, socialLinks |
| **classes** | title, description, category, trainerId (ref), schedule[] (day, startTime, durationMin), capacity, imageUrl/videoUrl |
| **bookings** | userId (ref), classId (ref), classDate, status (`confirmed`/`cancelled`/`completed`), createdAt |
| **membershipPlans** | name, price, billingInterval, features[], isPopular, isActive |
| **payments** | userId (ref), planId (ref), amount, method, status, providerTransactionId, createdAt |
| **blogPosts** | title, slug, content, coverImageUrl, authorId (ref), tags[], publishedAt |
| **testimonials** | userId (ref, optional), name, imageUrl, rating, message, beforeAfterImages[] |
| **galleryMedia** | type (`image`/`video`), url, category, caption |
| **notifications** | userId (ref), message, type, isRead, createdAt |

Example Mongoose model:

```js
// models/User.js
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "trainer", "admin"], default: "user" },
    avatarUrl: String,
    phone: String,
    membershipPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan" },
    membershipStatus: { type: String, enum: ["active", "expired", "none"], default: "none" },
    membershipExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

---

## 9. API Endpoints

```
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Users
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users            (admin)
PATCH  /api/users/:id        (admin)

Trainers
GET    /api/trainers
GET    /api/trainers/:id
POST   /api/trainers         (admin)
PATCH  /api/trainers/:id     (admin)
DELETE /api/trainers/:id     (admin)

Classes
GET    /api/classes
GET    /api/classes/:id
POST   /api/classes          (admin)
PATCH  /api/classes/:id      (admin)
DELETE /api/classes/:id      (admin)

Bookings
GET    /api/bookings/me
POST   /api/bookings
DELETE /api/bookings/:id
GET    /api/bookings         (admin)

Memberships
GET    /api/memberships
POST   /api/memberships      (admin)
PATCH  /api/memberships/:id  (admin)

Payments
POST   /api/payments/checkout
GET    /api/payments/me
GET    /api/payments         (admin)
POST   /api/payments/webhook (Stripe webhook)

Content
GET    /api/blog
GET    /api/blog/:slug
POST   /api/blog             (admin)
GET    /api/gallery
POST   /api/gallery          (admin)
GET    /api/testimonials
POST   /api/testimonials     (admin)

Admin analytics
GET    /api/admin/stats/overview
GET    /api/admin/stats/revenue
```

---

## 10. Auth & Security

- **JWT strategy:** short-lived access token (15 min) + long-lived refresh token (7 days) stored in an `httpOnly`, `secure`, `sameSite=strict` cookie — not `localStorage`, to reduce XSS token-theft risk
- **Password hashing:** bcrypt, 10–12 salt rounds
- **Role middleware:** `requireAuth`, `requireRole('admin')` guards on every protected route, checked server-side (never trust a client-side role check alone)
- **Secrets:** all API keys, DB URIs, and JWT secrets in `.env`, never committed — add `.env` to `.gitignore` from the very first commit
- **Rate limiting:** `express-rate-limit` on `/api/auth/*` to blunt brute-force attempts
- **Validation:** validate and sanitize every request body server-side (Zod/express-validator), even though the frontend also validates
- **CORS:** explicit allow-list of your frontend origin(s), not `*`
- **Headers:** `helmet()` for sensible security headers by default
- **Uploads:** validate file type/size before forwarding to Cloudinary; never trust the client-reported MIME type alone

---

## 11. Folder Structure

```
brave-gym/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/          (Button, Modal, Input, Loader)
│   │   │   ├── layout/          (Navbar, Footer)
│   │   │   ├── home/            (Hero, StatsMarquee, ProgramsPreview)
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── public/          (Home, Programs, Trainers, Pricing, Gallery, Blog, Contact)
│   │   │   ├── auth/            (Login, Register, ForgotPassword)
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── hooks/                (useAuth, useScrollAnimation)
│   │   ├── context/              (AuthContext)
│   │   ├── lib/                  (api client, gsap setup, lenis setup)
│   │   ├── styles/                (globals.css, tailwind.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/
    ├── src/
    │   ├── config/               (db.js, cloudinary.js)
    │   ├── models/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/           (auth.js, roleGuard.js, errorHandler.js)
    │   ├── utils/
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## 12. Starter Scripts

**Tailwind config — design tokens wired in**
```js
// client/tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0D0D0D",
        charcoal: "#1A1A1A",
        steel: "#2E2E2E",
        ash: "#8C8C8C",
        chalk: "#F5F5F3",
        paper: "#FFFFFF",
        ink: "#111111",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

**Hero section — Framer Motion stagger + video**
```jsx
// client/src/components/home/Hero.jsx
import { motion } from "framer-motion";

const headlineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const wordVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const words = ["BE", "BRAVE.", "TRAIN", "HARD."];
  return (
    <section className="relative h-screen overflow-hidden bg-obsidian">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        src="/media/hero-loop.mp4"
        poster="/media/hero-poster.jpg"
        autoPlay muted loop playsInline
      />
      <motion.h1
        className="relative z-10 font-display text-white text-[clamp(3rem,10vw,8rem)] leading-none pt-32 pl-8"
        initial="hidden" animate="visible" variants={headlineVariants}
      >
        {words.map((w) => (
          <motion.span key={w} className="inline-block overflow-hidden mr-4">
            <motion.span className="inline-block" variants={wordVariants}>{w}</motion.span>
          </motion.span>
        ))}
      </motion.h1>
    </section>
  );
}
```

**Express server entry**
```js
// server/src/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/classes", require("./routes/class.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use(require("./middleware/errorHandler"));

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Brave Gym API running on port ${process.env.PORT || 5000}`)
  );
});
```

**Auth middleware**
```js
// server/src/middleware/auth.js
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
```

---

## 13. Third-Party Integrations

| Service | Purpose | Free tier suitable for a student project? |
|---|---|---|
| MongoDB Atlas | Database | Yes — M0 free cluster |
| Cloudinary | Image/video hosting + streaming | Yes — generous free tier |
| Stripe | Payments (or a regional processor if Stripe isn't supported where you're launching) | Test mode is free |
| Resend / Nodemailer + Gmail | Transactional email | Yes |
| Vercel | Frontend hosting | Yes |
| Render / Railway | Backend hosting | Yes (free tier, cold starts on sleep) |

---

## 14. Deployment (Budget-Friendly Path)

1. **Frontend:** deploy `client/` to Vercel (auto-deploys from GitHub, free)
2. **Backend:** deploy `server/` to Render or Railway free tier
3. **Database:** MongoDB Atlas free M0 cluster
4. **Media:** Cloudinary free tier for all images/video
5. **Domain:** optional — a free `.vercel.app` subdomain is fine for a portfolio piece; a custom domain (e.g. `bravegym.com`) is ~$10–12/yr if you want one later
6. **Env vars:** set all secrets (JWT secrets, Mongo URI, Cloudinary keys, Stripe keys) directly in the Vercel/Render dashboard — never in the repo

---

## 15. Build Roadmap (suggested order for Antigravity)

Feed this document to Antigravity in phases rather than all at once — lock the design system first so every generated page stays consistent.

1. **Design system pass:** generate `tailwind.config.js`, base components (`Button`, `Navbar`, `Footer`), and confirm the color/type tokens look right before building any real page
2. **Public pages:** Home (hero + one or two sections) → Programs → Trainers → Pricing → Gallery → Blog → About → Contact
3. **Auth:** register/login pages + backend auth routes + JWT middleware
4. **User dashboard:** overview → bookings → membership → profile → (progress, if included)
5. **Admin dashboard:** overview → members → classes → trainers → payments → content
6. **Integrations:** Cloudinary uploads, Stripe checkout + webhook, email confirmations
7. **Polish pass:** animation timing review, responsive/mobile pass, `prefers-reduced-motion` fallback, Lighthouse performance/accessibility check
8. **Deploy:** Vercel + Render + Atlas, wire up env vars, smoke-test the full booking + payment flow end to end

---

*This document is meant to be handed to Antigravity section by section as a build brief — the tables and code snippets above are deliberately concrete enough to prompt against directly.*



Email: admin@bravegym.com
Password: braveAdmin2026
Role: Administrator / Gym Director
Access: Floor occupancy, revenue analytics, timetable scheduling, and member consultation orders.
🏋️ Member (User) Account (Access to /dashboard Member Hub)
Email: marcus.c@discipline.com
Password: athletePass123
Role: Athletic Member (Black Tier)
Access: Discipline streak, class bookings & cancellations, daily workout logger.