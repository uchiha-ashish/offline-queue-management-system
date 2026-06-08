export function Avatar({ initials, size = 44, bg, color }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: bg, color }}>
      {initials}
    </span>
  );
}

export function Wordmark({ size = 30 }) {
  return (
    <span className="k-wordmark" style={{ fontSize: size }}>
      traya<span className="dot">.</span>
    </span>
  );
}
