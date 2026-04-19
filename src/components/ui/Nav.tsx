import { useEffect, useState } from 'react';
import './Nav.css';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand">LOANG.</a>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <button
          className="nav__burger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="nav__drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            className="nav__close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
          <ul className="nav__drawer-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
