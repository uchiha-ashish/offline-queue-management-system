// app.jsx — shell: surface selector, screen picker, variations, frames
const { useState: useStateA } = React;

const KIOSK_SCREENS = [
  { id: 'idle', label: '1 · Idle / Home' },
  { id: 'phone', label: '2 · Phone entry' },
  { id: 'name', label: '3 · Name capture' },
  { id: 'ready', label: '4 · Coach ready now' },
  { id: 'output', label: '5 · Output — wait + rank' },
  { id: 'prebooked', label: '6 · Welcome back (pre-booked)' },
  { id: 'forfeit', label: '7 · Forfeited slot — rebook' },
  { id: 'status', label: '8 · Status check' },
  { id: 'cancel', label: '9 · Cancel a booking' },
  { id: 'no-coaches', label: '10 · No coaches available' },
  { id: 'fully-booked', label: '11 · Fully booked' },
];
const COACH_SCREENS = [
  { id: 'dashboard', label: '1 · Queue dashboard' },
  { id: 'callbacks', label: '2 · No-show call-backs' },
  { id: 'floor', label: '3 · Floor lead overview' },
];

const KIOSK_VARIANTS = ['Reassurance-first', 'Balanced pair', 'Calm editorial'];
const COACH_VARIANTS = ['List view', 'Board view'];

function App() {
  const [surface, setSurface] = useStateA('kiosk');
  const [kRoute, setKRoute] = useStateA('idle');
  const [cRoute, setCRoute] = useStateA('dashboard');
  const [kVar, setKVar] = useStateA(0);
  const [cVar, setCVar] = useStateA(0);

  const isKiosk = surface === 'kiosk';
  const screens = isKiosk ? KIOSK_SCREENS : COACH_SCREENS;
  const route = isKiosk ? kRoute : cRoute;
  const setRoute = isKiosk ? setKRoute : setCRoute;
  const variants = isKiosk ? KIOSK_VARIANTS : COACH_VARIANTS;
  const variant = isKiosk ? kVar : cVar;
  const setVariant = isKiosk ? setKVar : setCVar;

  // Picker shows the base screen even when on a sub-route
  const pickerVal = screens.some(s => s.id === route) ? route
    : (isKiosk ? (['stepout'].includes(route) ? 'output' : ['status-result'].includes(route) ? 'status' : ['cancel-confirm', 'cancel-done'].includes(route) ? 'cancel' : 'idle') : 'dashboard');

  // variation only meaningful on output-like / dashboard screens
  const showVar = isKiosk
    ? ['output', 'prebooked', 'forfeit', 'status-result'].includes(route)
    : route === 'dashboard';

  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand">traya<span className="tag">Queue</span></div>
        <div className="seg">
          <button className={isKiosk ? 'on' : ''} onClick={() => setSurface('kiosk')}>Customer Kiosk</button>
          <button className={!isKiosk ? 'on' : ''} onClick={() => setSurface('coach')}>Coach Platform</button>
        </div>

        <div className="screen-picker">
          {showVar && (
            <div className="var-toggle" style={{ marginRight: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Variant</span>
              <div className="seg" style={{ background: 'rgba(255,255,255,0.08)' }}>
                {variants.map((v, i) => (
                  <button key={v} className={variant === i ? 'on' : ''} style={{ fontSize: 11, padding: '6px 12px', textTransform: 'none', letterSpacing: 0 }} onClick={() => setVariant(i)}>{v}</button>
                ))}
              </div>
            </div>
          )}
          <label>Screen</label>
          <select value={pickerVal} onChange={e => setRoute(e.target.value)}>
            {screens.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {isKiosk ? (
        <FitStage w={820} h={1100}>
          <TabletFrame>
            <KioskApp route={kRoute} setRoute={setKRoute} variant={kVar} />
          </TabletFrame>
        </FitStage>
      ) : (
        <FitStage w={1240} h={1040}>
          <WorkstationFrame url="queue.traya.health/coach">
            <CoachApp route={cRoute} setRoute={setCRoute} variant={cVar} />
          </WorkstationFrame>
        </FitStage>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
