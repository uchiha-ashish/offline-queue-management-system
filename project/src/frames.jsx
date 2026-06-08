// frames.jsx — device frames + scale-to-fit stage + small shared bits

const { useState, useEffect, useRef, useCallback } = React;

// Scales its fixed-size child to fit the available stage area.
function FitStage({ w, h, children }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const aw = el.clientWidth - 8;
      const ah = el.clientHeight - 8;
      setScale(Math.min(aw / w, ah / h, 1));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div ref={wrapRef} className="stage">
      <div className="fit" style={{ width: w, height: h, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function TabletFrame({ children }) {
  return (
    <div className="tablet">
      <span className="cam" />
      <div className="glass">{children}</div>
    </div>
  );
}

function WorkstationFrame({ url = 'queue.traya.health/coach', children }) {
  return (
    <div className="workstation">
      <div className="ws-chrome">
        <div className="ws-dots">
          <i style={{ background: '#F0655B' }} />
          <i style={{ background: '#F4BE4F' }} />
          <i style={{ background: '#62C554' }} />
        </div>
        <div className="ws-url">
          <Icon name="shield" size={13} stroke={2} style={{ color: 'var(--green-500)' }} />
          {url}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-tertiary)' }}>
          <Icon name="refresh" size={16} />
          <Icon name="dots" size={16} />
        </div>
      </div>
      <div className="ws-body">{children}</div>
    </div>
  );
}

function Avatar({ initials, size = 44, bg, color }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: bg, color }}>
      {initials}
    </span>
  );
}

// Wordmark text (no dark logo asset available — render as styled text)
function Wordmark({ size = 30 }) {
  return (
    <span className="k-wordmark" style={{ fontSize: size }}>
      traya<span className="dot">.</span>
    </span>
  );
}

Object.assign(window, { FitStage, TabletFrame, WorkstationFrame, Avatar, Wordmark });
