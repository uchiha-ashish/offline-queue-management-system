// kiosk.jsx — Customer Kiosk screens (tablet)
const { useState: useStateK } = React;

// ---------- shared kiosk shell ----------
function KioskShell({ children, onBack, footer }) {
  return (
    <div className="kiosk">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 56px 0' }}>
        {onBack
          ? <button className="k-link" onClick={onBack}><Icon name="arrowLeft" size={20} /> Back</button>
          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
              <Icon name="mapPin" size={16} /> Bandra Store
            </span>}
        <Wordmark size={26} />
      </div>
      <div className="kiosk-scroll fade-in" key={Math.random()}>{children}</div>
      {footer}
    </div>
  );
}

// ---------- numeric keypad ----------
function Keypad({ value, onChange, max = 10 }) {
  const press = (k) => {
    if (k === 'del') return onChange(value.slice(0, -1));
    if (value.length >= max) return;
    onChange(value + k);
  };
  const fmt = (v) => {
    if (!v) return null;
    const a = v.slice(0, 5), b = v.slice(5);
    return b ? `${a} ${b}` : a;
  };
  return (
    <div>
      <div className="phone-display" style={{ marginBottom: 28 }}>
        {value
          ? <><span>{fmt(value)}</span><span className="caret" /></>
          : <span className="ph-empty">Enter mobile number</span>}
      </div>
      <div className="keypad">
        {['1','2','3','4','5','6','7','8','9'].map(k =>
          <button key={k} className="key" onClick={() => press(k)}>{k}</button>)}
        <button className="key key--mute" onClick={() => press('del')}><Icon name="delete" size={26} /></button>
        <button className="key" onClick={() => press('0')}>0</button>
        <button className="key key--mute" style={{ visibility: 'hidden' }} />
      </div>
    </div>
  );
}

// ---------- the two-number output (3 variants) ----------
function OutputCore({ waitMin, rank, variant, statusText = "You're on track" }) {
  const StatusLine = () => (
    <div className="status-line"><span className="pulse" />{statusText}</div>
  );
  if (variant === 1) {
    // Balanced pair — two equal cards
    return (
      <div style={{ display: 'flex', gap: 18 }}>
        {[
          { big: waitMin, unit: 'minutes', label: 'Estimated wait' },
          { big: `#${rank}`, unit: 'in queue', label: 'Your position' },
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: '#fff', border: '1.5px solid var(--border-hairline)', borderRadius: 24, padding: '38px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--grey-700)' }}>{c.big}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 8 }}>{c.unit}</div>
            <div className="k-eyebrow" style={{ marginTop: 18 }}>{c.label}</div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === 2) {
    // Calm editorial — enormous number, rank as quiet line
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="k-eyebrow" style={{ marginBottom: 18 }}>Estimated wait</div>
        <div style={{ fontSize: 200, fontWeight: 800, lineHeight: 0.82, letterSpacing: '-0.05em', color: 'var(--grey-700)' }}>{waitMin}</div>
        <div className="hero-unit" style={{ fontSize: 34, marginTop: 8 }}>minutes</div>
        <div style={{ marginTop: 30, fontSize: 22, fontWeight: 700, color: 'var(--text-secondary)' }}>
          You're <span style={{ color: 'var(--green-600)', fontWeight: 800 }}>#{rank}</span> in the queue
        </div>
      </div>
    );
  }
  // variant 0 — Reassurance-first (default)
  return (
    <div>
      <StatusLine />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 18 }}>
        <span className="hero-number">{waitMin}</span>
        <span className="hero-unit" style={{ paddingBottom: 20 }}>min<br />estimated wait</span>
      </div>
      <div style={{ marginTop: 26 }}>
        <span className="rank-chip"><Icon name="users" size={22} style={{ color: 'var(--green-500)' }} /> #{rank} in queue</span>
      </div>
    </div>
  );
}

// =========================================================
function KioskApp({ route, setRoute, variant }) {
  const [digits, setDigits] = useStateK('');
  const [name, setName] = useStateK('');
  const go = (r) => setRoute(r);

  // ---- IDLE / HOME ----
  if (route === 'idle') {
    return (
      <div className="kiosk">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '34px 56px 0' }}>
          <Wordmark size={30} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)' }}>
            <Icon name="mapPin" size={16} /> Bandra Store
          </span>
        </div>
        <div className="kiosk-scroll" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 56px' }}>
          <div className="fade-in">
            <div className="k-eyebrow" style={{ color: 'var(--green-600)' }}>Hair consultation · self check-in</div>
            <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--grey-700)', lineHeight: 1.04, margin: '14px 0 0' }}>
              Welcome.<br />Let's find the root cause<br />of your hair concern.
            </h1>
            <div style={{ display: 'flex', gap: 16, margin: '40px 0 44px' }}>
              <div style={{ flex: 1, background: 'var(--green-25)', borderRadius: 18, padding: '22px 24px' }}>
                <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--green-600)', lineHeight: 1 }}>5<span style={{ fontSize: 22 }}> min</span></div>
                <div className="k-eyebrow" style={{ marginTop: 10 }}>Shortest wait right now</div>
              </div>
              <div style={{ flex: 1, background: '#fff', border: '1.5px solid var(--border-hairline)', borderRadius: 18, padding: '22px 24px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 44, fontWeight: 800, color: 'var(--grey-700)', lineHeight: 1 }}>
                  <span className="status-line"><span className="pulse" /></span>2
                </div>
                <div className="k-eyebrow" style={{ marginTop: 10 }}>Coaches available</div>
              </div>
            </div>
            <button className="k-btn k-btn--primary" onClick={() => go('phone')}>
              Tap to check in <Icon name="arrowRight" size={26} stroke={2.2} />
            </button>
          </div>
        </div>
        <div className="k-footer">
          <button className="k-link" onClick={() => go('status')}><Icon name="refresh" size={18} /> Check my status</button>
          <button className="k-link" onClick={() => go('cancel')}><Icon name="x" size={18} /> Cancel a booking</button>
        </div>
      </div>
    );
  }

  // ---- PHONE ENTRY ----
  if (route === 'phone') {
    const valid = digits.length === 10;
    return (
      <KioskShell onBack={() => go('idle')}>
        <div className="k-pad">
          <div className="k-eyebrow">Step 1 of 2</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '10px 0 4px' }}>What's your mobile number?</h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 32px' }}>We use it to recognise you and send queue updates on WhatsApp.</p>
          <Keypad value={digits} onChange={setDigits} />
          <button className="k-btn k-btn--primary" disabled={!valid} style={{ marginTop: 30, opacity: valid ? 1 : 0.45 }}
            onClick={() => go(digits.startsWith('993') ? 'prebooked' : 'name')}>
            Continue <Icon name="arrowRight" size={24} stroke={2.2} />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <span className="wa-pill"><img src="assets/whatsapp-logo.png" alt="" /> Updates sent on WhatsApp</span>
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 22 }}>Tip — try a number starting <b>993…</b> to see a recognised pre-booking.</p>
        </div>
      </KioskShell>
    );
  }

  // ---- NAME CAPTURE (unrecognised) ----
  if (route === 'name') {
    return (
      <KioskShell onBack={() => go('phone')}>
        <div className="k-pad">
          <div className="k-eyebrow">Step 2 of 2 · New here</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '10px 0 4px' }}>And your name?</h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 28px' }}>We didn't find this number — no problem. Just your first name so a coach can greet you.</p>
          <div className="phone-display" style={{ justifyContent: 'flex-start', padding: '0 24px', fontSize: 30, letterSpacing: 0 }}>
            {name ? <span>{name}</span> : <span className="ph-empty">Your name</span>}<span className="caret" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 26 }}>
            {['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'].map(ch =>
              <button key={ch} className="key" style={{ height: 70, fontSize: 24 }} onClick={() => setName(name + ch)}>{ch}</button>)}
            <button className="key key--mute" style={{ height: 70, gridColumn: 'span 2' }} onClick={() => setName(name.slice(0, -1))}><Icon name="delete" size={24} /></button>
            <button className="key" style={{ height: 70, fontSize: 18, gridColumn: 'span 2' }} onClick={() => setName(name + ' ')}>space</button>
          </div>
          <button className="k-btn k-btn--primary" disabled={!name.trim()} style={{ marginTop: 28, opacity: name.trim() ? 1 : 0.45 }}
            onClick={() => go('ready')}>
            Check me in <Icon name="checkCircle" size={24} stroke={2.2} />
          </button>
        </div>
      </KioskShell>
    );
  }

  // ---- COACH READY NOW (use case 1) ----
  if (route === 'ready') {
    const who = name.trim() || 'there';
    return (
      <KioskShell>
        <div className="k-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 70 }}>
          <div style={{ width: 130, height: 130, borderRadius: 999, background: 'var(--green-50)', display: 'grid', placeItems: 'center', color: 'var(--green-500)' }}>
            <Icon name="checkCircle" size={72} stroke={1.6} />
          </div>
          <div className="status-line" style={{ marginTop: 28 }}><span className="pulse" />A coach is ready for you</div>
          <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '16px 0 8px' }}>Welcome, {who.split(' ')[0]}.</h1>
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 460, margin: 0 }}>No wait today. Please walk through to the <b style={{ color: 'var(--grey-700)' }}>consultation area</b> — your coach will take it from here.</p>
          <div className="info-strip" style={{ marginTop: 36, width: '100%' }}>
            <Icon name="heart" size={22} style={{ color: 'var(--green-500)', flex: '0 0 auto' }} />
            First consultations take around 40 minutes — we take the time to get your plan right.
          </div>
          <button className="k-btn k-btn--primary" style={{ marginTop: 30 }} onClick={() => go('idle')}>
            Done <Icon name="arrowRight" size={24} stroke={2.2} />
          </button>
        </div>
      </KioskShell>
    );
  }

  // ---- OUTPUT (wait + rank) ----
  if (route === 'output') {
    return (
      <KioskShell onBack={() => go('idle')}>
        <div className="k-pad">
          <div className="k-eyebrow" style={{ color: 'var(--green-600)' }}>You're checked in{name.trim() ? ` · ${name.split(' ')[0]}` : ''}</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '8px 0 30px' }}>Here's where things stand</h1>
          <OutputCore waitMin={32} rank={3} variant={variant} />
          <div className="info-strip" style={{ marginTop: 38 }}>
            <img src="assets/whatsapp-logo.png" alt="" style={{ width: 26, height: 26, flex: '0 0 auto' }} />
            We'll WhatsApp you about 10 minutes before your turn — no need to watch the clock.
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 26 }}>
            <button className="k-btn k-btn--dark" style={{ flex: 1, fontSize: 19 }} onClick={() => go('stepout')}>
              <Icon name="bell" size={22} /> Step out, notify me
            </button>
            <button className="k-btn k-btn--primary" style={{ flex: 1, fontSize: 19 }} onClick={() => go('idle')}>
              <Icon name="check" size={22} stroke={2.4} /> I'll wait here
            </button>
          </div>
        </div>
      </KioskShell>
    );
  }

  // ---- STEP OUT confirm ----
  if (route === 'stepout') {
    return (
      <KioskShell>
        <div className="k-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 80 }}>
          <div style={{ width: 130, height: 130, borderRadius: 999, background: '#E7F9EE', display: 'grid', placeItems: 'center' }}>
            <img src="assets/whatsapp-logo.png" alt="" style={{ width: 64, height: 64 }} />
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '28px 0 8px' }}>Go enjoy your time.</h1>
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 470, margin: 0 }}>You're still <b style={{ color: 'var(--grey-700)' }}>#3 in queue</b>. We'll message <b style={{ color: 'var(--grey-700)' }}>+91 90049 22107</b> about 10 minutes before your turn. Come back any time to check in.</p>
          <button className="k-btn k-btn--primary" style={{ marginTop: 38 }} onClick={() => go('idle')}>Got it</button>
        </div>
      </KioskShell>
    );
  }

  // ---- WELCOME BACK (pre-booked acknowledgment) ----
  if (route === 'prebooked') {
    return (
      <KioskShell onBack={() => go('phone')}>
        <div className="k-pad">
          <div className="k-eyebrow" style={{ color: 'var(--green-600)' }}>Recognised · pre-booked</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '8px 0 26px' }}>Welcome back, Anjali.</h1>
          <OutputCore waitMin={4} rank={1} variant={variant} statusText="Your slot is on track" />
          <div className="info-strip" style={{ marginTop: 36 }}>
            <Icon name="checkCircle" size={24} style={{ color: 'var(--green-500)', flex: '0 0 auto' }} stroke={2} />
            You're almost up. Please have a seat near the consultation area — we'll call you in shortly.
          </div>
          <button className="k-btn k-btn--primary" style={{ marginTop: 26 }} onClick={() => go('idle')}>I'll wait here</button>
        </div>
      </KioskShell>
    );
  }

  // ---- FORFEITED SLOT — REBOOK ----
  if (route === 'forfeit') {
    return (
      <KioskShell onBack={() => go('phone')}>
        <div className="k-pad">
          <div className="info-strip amber" style={{ marginBottom: 28 }}>
            <Icon name="clock" size={24} style={{ flex: '0 0 auto' }} />
            Your original 11:40 appointment has passed.
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '0 0 10px' }}>Let's get you back in line.</h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', margin: '0 0 30px' }}>No problem at all — we can add you to the current queue right now. Here's what that looks like:</p>
          <OutputCore waitMin={28} rank={4} variant={variant} statusText="Ready when you are" />
          <div style={{ display: 'flex', gap: 16, marginTop: 38 }}>
            <button className="k-btn k-btn--ghost" style={{ flex: 1 }} onClick={() => go('idle')}>Not now</button>
            <button className="k-btn k-btn--primary" style={{ flex: 1.4 }} onClick={() => go('output')}>
              <Icon name="check" size={22} stroke={2.4} /> Add me to the queue
            </button>
          </div>
        </div>
      </KioskShell>
    );
  }

  // ---- STATUS CHECK (returning customer) ----
  if (route === 'status') {
    const valid = digits.length === 10;
    return (
      <KioskShell onBack={() => { setDigits(''); go('idle'); }}>
        <div className="k-pad">
          <div className="k-eyebrow">Check my status</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '10px 0 4px' }}>Enter your number</h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 28px' }}>We'll show your current wait and position.</p>
          <Keypad value={digits} onChange={setDigits} />
          <button className="k-btn k-btn--primary" disabled={!valid} style={{ marginTop: 28, opacity: valid ? 1 : 0.45 }} onClick={() => go('status-result')}>
            Show my status <Icon name="arrowRight" size={24} stroke={2.2} />
          </button>
        </div>
      </KioskShell>
    );
  }
  if (route === 'status-result') {
    return (
      <KioskShell onBack={() => go('idle')}>
        <div className="k-pad">
          <div className="k-eyebrow" style={{ color: 'var(--green-600)' }}>Found you · Vikram</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '8px 0 30px' }}>You're on track.</h1>
          <OutputCore waitMin={18} rank={2} variant={variant} />
          <div className="info-strip" style={{ marginTop: 38 }}>
            <Icon name="sparkle" size={24} style={{ color: 'var(--green-500)', flex: '0 0 auto' }} />
            Moving along nicely — you've moved up one place since you checked in. Hang tight.
          </div>
          <button className="k-btn k-btn--primary" style={{ marginTop: 26 }} onClick={() => go('idle')}>Done</button>
        </div>
      </KioskShell>
    );
  }

  // ---- CANCEL FLOW ----
  if (route === 'cancel') {
    const valid = digits.length === 10;
    return (
      <KioskShell onBack={() => { setDigits(''); go('idle'); }}>
        <div className="k-pad">
          <div className="k-eyebrow">Cancel a booking</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '10px 0 4px' }}>Enter your number</h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 28px' }}>We'll find your booking so you can release it.</p>
          <Keypad value={digits} onChange={setDigits} />
          <button className="k-btn k-btn--danger" disabled={!valid} style={{ marginTop: 28, opacity: valid ? 1 : 0.45 }} onClick={() => go('cancel-confirm')}>
            Find my booking
          </button>
        </div>
      </KioskShell>
    );
  }
  if (route === 'cancel-confirm') {
    return (
      <KioskShell onBack={() => go('cancel')}>
        <div className="k-pad" style={{ paddingTop: 50 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '0 0 24px' }}>Cancel this booking?</h1>
          <div style={{ background: '#fff', border: '1.5px solid var(--border-hairline)', borderRadius: 18, padding: 24, display: 'flex', alignItems: 'center', gap: 18 }}>
            <Avatar initials="KR" size={56} bg="var(--green-100)" color="var(--green-700)" />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--grey-700)' }}>Kavya Reddy</div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 2 }}>Pre-booked · repeat visit · +91 70123 55980</div>
            </div>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '24px 0 30px' }}>This frees up the slot for someone else. You can always book again whenever you're ready.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="k-btn k-btn--ghost" style={{ flex: 1 }} onClick={() => go('idle')}>Keep it</button>
            <button className="k-btn k-btn--danger" style={{ flex: 1 }} onClick={() => go('cancel-done')}>Yes, cancel</button>
          </div>
        </div>
      </KioskShell>
    );
  }
  if (route === 'cancel-done') {
    return (
      <KioskShell>
        <div className="k-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 110 }}>
          <div style={{ width: 120, height: 120, borderRadius: 999, background: 'var(--green-50)', display: 'grid', placeItems: 'center', color: 'var(--green-500)' }}>
            <Icon name="check" size={64} stroke={2.4} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '28px 0 8px' }}>Booking released.</h1>
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 440, margin: 0 }}>All done. We hope to see you again soon — your hair journey is always worth coming back for.</p>
          <button className="k-btn k-btn--primary" style={{ marginTop: 38 }} onClick={() => { setDigits(''); go('idle'); }}>Done</button>
        </div>
      </KioskShell>
    );
  }

  // ---- NO COACHES AVAILABLE ----
  if (route === 'no-coaches') {
    return (
      <KioskShell onBack={() => go('idle')}>
        <div className="k-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 90 }}>
          <div style={{ width: 120, height: 120, borderRadius: 999, background: 'var(--pillar-derm-bg)', display: 'grid', placeItems: 'center', color: 'var(--pillar-derm-ink)' }}>
            <Icon name="users" size={60} stroke={1.6} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '28px 0 8px' }}>Please speak with our staff.</h1>
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 470, margin: 0 }}>Our coaches are with customers right now. A team member at the desk will take care of your check-in personally.</p>
          <div className="info-strip blue" style={{ marginTop: 36 }}>
            <Icon name="mapPin" size={22} style={{ flex: '0 0 auto' }} /> The welcome desk is just to your left.
          </div>
        </div>
      </KioskShell>
    );
  }

  // ---- FULLY BOOKED ----
  if (route === 'fully-booked') {
    return (
      <KioskShell onBack={() => go('idle')}>
        <div className="k-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 90 }}>
          <div style={{ width: 120, height: 120, borderRadius: 999, background: 'var(--sand-100)', display: 'grid', placeItems: 'center', color: 'var(--sand-500)' }}>
            <Icon name="calendar" size={58} stroke={1.6} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--grey-700)', margin: '28px 0 8px' }}>We're fully booked today.</h1>
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 470, margin: 0 }}>Every slot is taken — a sign of how much care each consultation gets. Please come back tomorrow, or book a slot from the Traya app.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
            <span className="wa-pill"><img src="assets/whatsapp-logo.png" alt="" /> Book your next visit on WhatsApp</span>
          </div>
        </div>
      </KioskShell>
    );
  }

  return null;
}

Object.assign(window, { KioskApp });
