// coach.jsx — Coach Platform screens (workstation)
const { useState: useS } = React;

const VISIT_TAG = (v) => v === 'first'
  ? <span className="tagb first">First visit</span>
  : <span className="tagb repeat">Repeat</span>;
const TYPE_TAG = (c) => {
  if (c.status === 'stepped-out') return <span className="tagb stepped"><Icon name="bell" size={11} /> Stepped out</span>;
  if (c.type === 'prebook') return <span className="tagb prebook"><Icon name="calendar" size={11} /> Pre-booked {c.prebookTime}</span>;
  return <span className="tagb walkin">Walk-in</span>;
};

// ---------- Override menu modal ----------
function OverrideSheet({ customer, onClose, onApply }) {
  const [picked, setPicked] = useS(null);
  const [reason, setReason] = useS('');
  const opts = [
    { id: 'moveup', icon: 'arrowUp', t: 'Move up in queue', d: 'Bump priority — elderly, infant, medical' },
    { id: 'extend', icon: 'clock', t: 'Extend their session', d: 'Push downstream queue back, auto-notify' },
    { id: 'reactivate', icon: 'refresh', t: 'Reactivate forfeited slot', d: 'Restore pre-booking to original position' },
    { id: 'resend', icon: 'message', t: 'Resend WhatsApp update', d: 'Re-trigger the latest queue message' },
    { id: 'remove', icon: 'ban', t: 'Remove from queue', d: 'Customer left or no longer waiting' },
  ];
  const reasons = {
    moveup: ['Elderly customer', 'Parent with infant', 'Medical priority', 'Staff discretion'],
    extend: ['Complex first consult', 'Additional concern raised', 'Scalp scan added'],
    reactivate: ['Valid delay reason', 'Traffic / transport', 'Coach was also late'],
    resend: ['Customer didn’t receive it', 'Number corrected', 'Customer requested'],
    remove: ['Customer left store', 'Duplicate entry', 'Booked elsewhere'],
  };
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="sheet-h">
          <div>
            <div className="rail-h" style={{ marginBottom: 4 }}>Override</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--grey-700)' }}>{customer.name}</div>
          </div>
          <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="sheet-b">
          {!picked ? opts.map(o => (
            <div key={o.id} className="ovr-item" onClick={() => setPicked(o.id)}>
              <span className="ic"><Icon name={o.icon} size={20} /></span>
              <div style={{ flex: 1 }}><div className="t">{o.t}</div><div className="d">{o.d}</div></div>
              <Icon name="chevronRight" size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
          )) : (
            <div className="fade-in">
              <button className="k-link" style={{ fontSize: 14, marginBottom: 14 }} onClick={() => { setPicked(null); setReason(''); }}>
                <Icon name="arrowLeft" size={16} /> {opts.find(o => o.id === picked).t}
              </button>
              <div className="field">
                <label>Reason code</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {reasons[picked].map(r => (
                    <button key={r} onClick={() => setReason(r)}
                      style={{ textAlign: 'left', padding: '13px 15px', borderRadius: 11, cursor: 'pointer', fontSize: 15, fontWeight: 600,
                        border: `1.5px solid ${reason === r ? 'var(--green-300)' : 'var(--border-hairline)'}`,
                        background: reason === r ? 'var(--green-25)' : '#fff', color: 'var(--grey-700)' }}>
                      {reason === r && <Icon name="check" size={15} stroke={2.6} style={{ color: 'var(--green-500)', marginRight: 8, verticalAlign: '-2px' }} />}
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="info-strip" style={{ fontSize: 13.5, padding: '12px 16px' }}>
                <img src="assets/whatsapp-logo.png" alt="" style={{ width: 18, height: 18, flex: '0 0 auto' }} />
                Affected customers are notified on WhatsApp automatically.
              </div>
              <button className="cbtn cbtn--primary cbtn--lg" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                disabled={!reason} onClick={() => onApply(picked, reason)}>
                Apply override
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Customer detail ----------
function CustomerDetail({ customer, onClose, onOverride }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ background: 'var(--green-25)', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar initials={customer.initials} size={56} bg="var(--green-100)" color="var(--green-700)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--grey-700)' }}>{customer.name}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>{VISIT_TAG(customer.visit)}{TYPE_TAG(customer)}</div>
          </div>
          <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="sheet-b">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            {[
              { l: 'Queue position', v: `#${customer.rank}` },
              { l: 'Est. wait', v: `${customer.waitMin} min` },
              { l: 'Phone', v: `+91 ${customer.phone}` },
              { l: 'Session length', v: `${customer.sessionLen} min` },
            ].map(s => (
              <div key={s.l} style={{ border: '1px solid var(--border-hairline)', borderRadius: 12, padding: '12px 14px' }}>
                <div className="k-eyebrow" style={{ fontSize: 11 }}>{s.l}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--grey-700)', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div className="rail-h">Communication log</div>
          <div style={{ marginBottom: 18 }}>
            {COMM_LOG.map((l, i) => (
              <div key={i} className="log-item">
                <span className="log-dot"><Icon name={l.icon} size={15} /></span>
                <div style={{ flex: 1 }}><div className="lt">{l.text}</div><div className="lm">{l.meta}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cbtn cbtn--lg" style={{ flex: 1, justifyContent: 'center' }}><img src="assets/whatsapp-logo.png" alt="" style={{ width: 18, height: 18 }} /> Resend</button>
            <button className="cbtn cbtn--lg" style={{ flex: 1, justifyContent: 'center' }}><Icon name="edit" size={16} /> Edit phone</button>
            <button className="cbtn cbtn--dark cbtn--lg" style={{ flex: 1.2, justifyContent: 'center' }} onClick={onOverride}><Icon name="dots" size={16} /> Override</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Manual check-in ----------
function ManualCheckin({ onClose, onDone }) {
  const [phone, setPhone] = useS('');
  const [name, setName] = useS('');
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-h">
          <div>
            <div className="rail-h" style={{ marginBottom: 4 }}>Manual check-in</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--grey-700)' }}>Add a customer to the queue</div>
          </div>
          <button className="x-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="sheet-b">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 0 }}>Use this when the kiosk is busy or a customer needs a hand. Creates a queue entry exactly like a self check-in.</p>
          <div className="field"><label>Mobile number</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98xxx xxxxx" /></div>
          <div className="field"><label>Name <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--text-muted)', fontWeight: 600 }}>(first-time only)</span></label><input value={name} onChange={e => setName(e.target.value)} placeholder="First name" /></div>
          <div className="field"><label>Visit type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Walk-in', 'Pre-booked'].map((t, i) => (
                <button key={t} style={{ flex: 1, padding: '12px', borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${i === 0 ? 'var(--green-300)' : 'var(--border-hairline)'}`, background: i === 0 ? 'var(--green-25)' : '#fff', color: 'var(--grey-700)' }}>{t}</button>
              ))}
            </div>
          </div>
          <button className="cbtn cbtn--primary cbtn--lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onDone}>
            <Icon name="userPlus" size={18} /> Add to queue
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main coach app ----------
function CoachApp({ route, setRoute, variant }) {
  const [queue, setQueue] = useS(INITIAL_QUEUE);
  const [avail, setAvail] = useS('available');
  const [detail, setDetail] = useS(null);
  const [override, setOverride] = useS(null);
  const [manual, setManual] = useS(false);
  const [toast, setToast] = useS(null);
  const [tasks, setTasks] = useS(CALLBACK_TASKS);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const current = queue.find(c => c.status === 'in-session');
  const rest = queue.filter(c => c.status !== 'in-session');

  const endSession = () => {
    setQueue(q => {
      const next = q.find(c => c.status === 'next');
      return q
        .filter(c => c.status !== 'in-session')
        .map(c => c.id === (next && next.id)
          ? { ...c, status: 'in-session', rank: 0, waitMin: 0, elapsed: 0 }
          : c)
        .map(c => c.status === 'in-session' ? c : { ...c, rank: Math.max(1, c.rank - 1), waitMin: Math.max(0, c.waitMin - (next ? next.sessionLen : 0)) })
        .map((c, i, arr) => {
          const waiting = arr.filter(x => x.status !== 'in-session');
          return c;
        });
    });
    // re-flag next
    setQueue(q => {
      const waiting = q.filter(c => c.status !== 'in-session').sort((a, b) => a.rank - b.rank);
      return q.map(c => c.status === 'in-session' ? c : { ...c, status: c.id === (waiting[0] && waiting[0].id) ? 'next' : (c.status === 'stepped-out' ? 'stepped-out' : 'waiting') });
    });
    flash('Session complete · next customer is up');
  };
  const extend = () => {
    setQueue(q => q.map(c => c.status === 'in-session' ? { ...c, sessionLen: c.sessionLen + 10 } : { ...c, waitMin: c.waitMin + 10 }));
    flash('Session extended +10 min · downstream notified on WhatsApp');
  };
  const moveUp = (id) => {
    setQueue(q => {
      const arr = [...q.filter(c => c.status !== 'in-session')].sort((a, b) => a.rank - b.rank);
      const i = arr.findIndex(c => c.id === id);
      if (i <= 0) return q;
      const r = arr[i].rank; arr[i].rank = arr[i - 1].rank; arr[i - 1].rank = r;
      const inSess = q.filter(c => c.status === 'in-session');
      const merged = [...inSess, ...arr].map(c => c.status === 'in-session' ? c : c);
      const waiting = arr.sort((a, b) => a.rank - b.rank);
      return merged.map(c => c.status === 'in-session' ? c : { ...c, status: c.id === waiting[0].id ? 'next' : (c.status === 'stepped-out' ? 'stepped-out' : 'waiting') });
    });
    flash('Moved up · affected customers notified on WhatsApp');
  };
  const applyOverride = (type, reason) => {
    setOverride(null);
    flash(`Override applied · ${reason} · WhatsApp sent`);
  };

  // ===== FLOOR LEAD =====
  if (route === 'floor') {
    return (
      <div className="coach-main" style={{ padding: '24px 28px 40px' }}>
        <CoachToast toast={toast} />
        <div className="coach-head">
          <div>
            <div className="coach-ttl ttl">Floor overview — Bandra Store</div>
            <div className="sub">Thursday, 5 June · 11:48 AM · 3 coaches on floor</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cbtn cbtn--lg" onClick={() => setRoute('dashboard')}><Icon name="grid" size={16} /> My queue</button>
          </div>
        </div>
        <div className="stat-row">
          <div className="stat"><div className="n">9</div><div className="l">In queue now</div></div>
          <div className="stat"><div className="n green">2</div><div className="l">In session</div></div>
          <div className="stat"><div className="n amber">1</div><div className="l">On break</div></div>
          <div className="stat"><div className="n">~31</div><div className="l">Avg wait (min)</div></div>
          <div className="stat"><div className="n red">2</div><div className="l">Call-backs due</div></div>
        </div>
        <div className="floor-grid">
          {COACHES.map(co => (
            <div key={co.id} className="floor-col">
              <div className="ch">
                <Avatar initials={co.initials} size={44} bg="var(--green-100)" color="var(--green-700)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--grey-700)' }}>{co.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>
                    <span className={`dot-status ${co.status === 'available' ? 'on' : co.status === 'break' ? 'brk' : 'off'}`} />
                    {co.status === 'available' ? `With ${co.current}` : co.status === 'break' ? 'On break' : 'Clocked out'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--grey-700)' }}>{co.queueLen}</div>
                  <div className="k-eyebrow" style={{ fontSize: 10 }}>waiting</div>
                </div>
              </div>
              <div className="cq">
                {FLOOR_QUEUES[co.id].map((p, i) => (
                  <div key={i} className="mini-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', width: 16 }}>{i + 1}</span>
                      <span className="mn">{p.name}</span>
                      {p.tag === 'prebook' && <span className="tagb prebook" style={{ fontSize: 9, padding: '2px 6px' }}>Pre-booked</span>}
                      {p.tag === 'stepped' && <span className="tagb stepped" style={{ fontSize: 9, padding: '2px 6px' }}>Stepped out</span>}
                    </div>
                    <span className="mw">~{p.wait}m</span>
                  </div>
                ))}
                {co.status === 'break' && (
                  <div className="info-strip amber" style={{ fontSize: 12.5, padding: '10px 12px', marginTop: 4 }}>
                    <Icon name="coffee" size={16} style={{ flex: '0 0 auto' }} /> Queue paused — not being assigned new customers.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="rail-card" style={{ marginTop: 22 }}>
          <div className="rail-h">Today's overrides &amp; activity</div>
          {ACTIVITY_LOG.map((a, i) => (
            <div key={i} className="log-item">
              <span className="log-dot"><Icon name={a.icon} size={15} /></span>
              <div style={{ flex: 1 }}><div className="lt">{a.text}</div><div className="lm">{a.meta}</div></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== CALL-BACK TASKS =====
  if (route === 'callbacks') {
    const open = tasks.filter(t => !t.done);
    return (
      <div className="coach-main">
        <CoachToast toast={toast} />
        <div className="coach-head">
          <div>
            <div className="coach-ttl ttl">No-show call-backs</div>
            <div className="sub">{open.length} open · grace window expired while a coach was free</div>
          </div>
          <button className="cbtn cbtn--lg" onClick={() => setRoute('dashboard')}><Icon name="arrowLeft" size={16} /> Back to queue</button>
        </div>
        {open.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-tertiary)' }}>
            <div style={{ width: 90, height: 90, margin: '0 auto 18px', borderRadius: 999, background: 'var(--green-50)', display: 'grid', placeItems: 'center', color: 'var(--green-500)' }}><Icon name="check" size={48} stroke={2.2} /></div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--grey-700)' }}>All caught up</div>
            <div style={{ fontSize: 15, marginTop: 6 }}>No pending call-backs right now.</div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
          {tasks.map(t => (
            <div key={t.id} style={{ background: '#fff', border: `1px solid ${t.done ? 'var(--border-faint)' : 'var(--signal-warning)'}`, borderRadius: 16, padding: 20, opacity: t.done ? 0.55 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar initials={t.initials} size={52} bg="var(--signal-warning-bg)" color="var(--signal-warning)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--grey-700)' }}>{t.name}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 3 }}>
                    Pre-booked {t.prebookTime} · grace ended {t.graceEndedAt} · +91 {t.phone}
                  </div>
                </div>
                {!t.done && <span className="tagb forfeit"><Icon name="alert" size={11} /> Forfeited</span>}
                {t.done && <span className="tagb repeat"><Icon name="check" size={11} /> Done</span>}
              </div>
              {!t.done && (
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="cbtn cbtn--primary cbtn--lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => flash(`Dialling +91 ${t.phone}…`)}><Icon name="phone" size={16} /> Call now</button>
                  <button className="cbtn cbtn--lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => flash('Re-booking restored to original slot')}><Icon name="refresh" size={16} /> Reactivate slot</button>
                  <button className="cbtn cbtn--lg" onClick={() => { setTasks(ts => ts.map(x => x.id === t.id ? { ...x, done: true } : x)); flash('Call-back logged'); }}><Icon name="check" size={16} /> Mark done</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== DASHBOARD (default) =====
  const isBoard = variant >= 1;
  return (
    <div className="coach">
      <CoachToast toast={toast} />
      <div className="coach-main">
        <div className="coach-head">
          <div>
            <div className="coach-ttl ttl">Your queue</div>
            <div className="sub">Coach Neha · Bandra Store · Thursday, 5 June · 11:48 AM</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cbtn cbtn--lg" onClick={() => setManual(true)}><Icon name="userPlus" size={16} /> Manual check-in</button>
            <button className="cbtn cbtn--lg" onClick={() => setRoute('floor')}><Icon name="grid" size={16} /> Floor view</button>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat"><div className="n">{rest.length}</div><div className="l">In queue</div></div>
          <div className="stat"><div className="n green">{current ? current.sessionLen - current.elapsed : 0}</div><div className="l">Min left now</div></div>
          <div className="stat"><div className="n">{rest.length ? rest[rest.length - 1].waitMin : 0}</div><div className="l">Longest wait</div></div>
          <div className="stat"><div className="n red" style={{ cursor: 'pointer' }} onClick={() => setRoute('callbacks')}>{tasks.filter(t => !t.done).length}</div><div className="l">Call-backs</div></div>
        </div>

        {/* current session */}
        {current && (
          <div className="session-card">
            <div className="live"><span className="pulse" /> In session</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar initials={current.initials} size={56} bg="#fff" color="var(--green-700)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--grey-700)' }}>{current.name}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>{VISIT_TAG(current.visit)}{TYPE_TAG(current)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--green-600)', lineHeight: 1 }}>{current.sessionLen - current.elapsed}<span style={{ fontSize: 16 }}> min</span></div>
                <div className="k-eyebrow" style={{ fontSize: 11, marginTop: 4 }}>remaining</div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>{current.elapsed} min elapsed</span><span>{current.sessionLen} min session</span>
              </div>
              <div className="timebar"><span style={{ width: `${(current.elapsed / current.sessionLen) * 100}%` }} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="cbtn cbtn--lg" onClick={extend}><Icon name="plus" size={16} /> Extend +10</button>
              <button className="cbtn cbtn--lg" onClick={() => flash('Remaining time adjusted')}><Icon name="clock" size={16} /> Adjust time</button>
              <button className="cbtn cbtn--dark cbtn--lg" style={{ marginLeft: 'auto' }} onClick={endSession}><Icon name="check" size={16} stroke={2.4} /> End session</button>
            </div>
          </div>
        )}

        {/* queue list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 12px' }}>
          <div className="rail-h" style={{ margin: 0 }}>Up next · {rest.length} waiting</div>
          {isBoard && <span className="caption">Board view</span>}
        </div>
        <div className="q-list">
          {rest.sort((a, b) => a.rank - b.rank).map(c => (
            <div key={c.id} className={`q-row ${c.status === 'next' ? 'next' : ''}`} onClick={() => setDetail(c)}>
              <span className="grip" onClick={e => e.stopPropagation()}><Icon name="grip" size={18} /></span>
              <span className="rank">#{c.rank}</span>
              <div>
                <div className="nm">{c.name}{c.status === 'next' && <span style={{ color: 'var(--green-600)', fontWeight: 800, fontSize: 12, marginLeft: 8, letterSpacing: '0.04em' }}>NEXT UP</span>}</div>
                <div className="meta">{VISIT_TAG(c.visit)}{TYPE_TAG(c)}<span>·</span><span><Icon name="clock" size={13} style={{ verticalAlign: '-2px' }} /> ~{c.waitMin} min</span></div>
              </div>
              <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                {c.status === 'next'
                  ? <button className="cbtn cbtn--primary" onClick={() => flash(`Session started with ${c.name}`)}><Icon name="play" size={14} fill="currentColor" stroke={0} /> Start session</button>
                  : <button className="cbtn" onClick={() => moveUp(c.id)}><Icon name="arrowUp" size={15} /> Move up</button>}
                <button className="cbtn" onClick={() => setOverride(c)}><Icon name="dots" size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* right rail */}
      <div className="coach-rail">
        <div className="rail-card">
          <div className="rail-h">My availability</div>
          <div className="avail-toggle">
            <button className={`available ${avail === 'available' ? 'on' : ''}`} onClick={() => { setAvail('available'); flash('You\'re available — queue assigning'); }}>
              <Icon name="check" size={18} /> Available
            </button>
            <button className={`break ${avail === 'break' ? 'on' : ''}`} onClick={() => { setAvail('break'); flash('On break — queue paused'); }}>
              <Icon name="coffee" size={18} /> Break
            </button>
            <button className={`off ${avail === 'off' ? 'on' : ''}`} onClick={() => { setAvail('off'); flash('Clocked out'); }}>
              <Icon name="power" size={18} /> Clock out
            </button>
          </div>
          {avail === 'break' && <div className="info-strip amber" style={{ fontSize: 12.5, padding: '11px 14px', marginTop: 12 }}><Icon name="info" size={16} style={{ flex: '0 0 auto' }} /> New customers won't be assigned to you until you're back.</div>}
        </div>

        <div className="rail-card">
          <div className="rail-h">Call-backs due</div>
          {tasks.filter(t => !t.done).map(t => (
            <div key={t.id} className="log-item" style={{ cursor: 'pointer' }} onClick={() => setRoute('callbacks')}>
              <span className="log-dot" style={{ background: 'var(--signal-warning-bg)', color: 'var(--signal-warning)' }}><Icon name="phone" size={15} /></span>
              <div style={{ flex: 1 }}><div className="lt">{t.name}</div><div className="lm">No-show {t.prebookTime} · tap to call</div></div>
            </div>
          ))}
          {tasks.filter(t => !t.done).length === 0 && <div className="caption">No call-backs pending.</div>}
        </div>

        <div className="rail-card" style={{ marginBottom: 0 }}>
          <div className="rail-h">Recent activity</div>
          {ACTIVITY_LOG.slice(0, 3).map((a, i) => (
            <div key={i} className="log-item">
              <span className="log-dot"><Icon name={a.icon} size={15} /></span>
              <div style={{ flex: 1 }}><div className="lt">{a.text}</div><div className="lm">{a.meta}</div></div>
            </div>
          ))}
        </div>
      </div>

      {detail && <CustomerDetail customer={detail} onClose={() => setDetail(null)} onOverride={() => { setOverride(detail); setDetail(null); }} />}
      {override && <OverrideSheet customer={override} onClose={() => setOverride(null)} onApply={applyOverride} />}
      {manual && <ManualCheckin onClose={() => setManual(false)} onDone={() => { setManual(false); flash('Customer added to queue'); }} />}
    </div>
  );
}

function CoachToast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 60,
      background: 'var(--grey-700)', color: '#fff', padding: '14px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-lg)', animation: 'fadeUp var(--dur-med) var(--ease-content)' }}>
      <Icon name="checkCircle" size={18} style={{ color: 'var(--green-200)' }} /> {toast}
    </div>
  );
}

Object.assign(window, { CoachApp });
