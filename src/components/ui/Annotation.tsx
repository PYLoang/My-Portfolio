import './Annotation.css';

type Ink = 'blue' | 'red' | 'pencil';

interface BaseProps {
  ink?: Ink;
  className?: string;
  style?: React.CSSProperties;
}

function svgProps(ink: Ink) {
  return {
    className: `anno anno--${ink}`,
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

// Wobbly underline — hand-drawn single stroke
export function Underline({ ink = 'blue', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 7 C 30 3, 60 10, 90 6 S 150 9, 198 5"
        strokeWidth="4"
      />
    </svg>
  );
}

// Rough hand-drawn oval/circle around content
export function CircleMark({ ink = 'red', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 200 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 20 42 C 10 18, 70 8, 120 10 C 175 14, 195 30, 188 50 C 180 72, 110 76, 60 72 C 22 68, 14 56, 20 42 Z"
        strokeWidth="2"
      />
    </svg>
  );
}

// Curved arrow pointing down-right
export function Arrow({ ink = 'red', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <path d="M 10 12 C 30 25, 45 45, 58 62" strokeWidth="2" />
      <path d="M 58 62 L 48 56 M 58 62 L 54 50" strokeWidth="2" />
    </svg>
  );
}

// Five-point sketchy star
export function Star({ ink = 'pencil', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <path
        d="M 20 4 L 24 15 L 36 15 L 26 22 L 30 34 L 20 27 L 10 34 L 14 22 L 4 15 L 16 15 Z"
        strokeWidth="1.6"
      />
    </svg>
  );
}

// Checkmark
export function Check({ ink = 'pencil', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 40 30"
      aria-hidden="true"
    >
      <path d="M 4 16 C 8 18, 12 22, 16 26 C 22 18, 28 10, 36 4" strokeWidth="2" />
    </svg>
  );
}

// Smooth regular curve (arc)
export function Curve({ ink = 'blue', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M 5 50 Q 50 -5, 95 50" strokeWidth="2" />
    </svg>
  );
}

// Spiral — one-and-a-half turns
export function Spiral({ ink = 'pencil', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 60 60"
      aria-hidden="true"
    >
      <path
        d="M 30 30 m 0 -2 a 2 2 0 1 1 -0.1 0 m 4 0 a 6 6 0 1 1 -0.2 0 m 4 0 a 10 10 0 1 1 -0.3 0 m 4 0 a 14 14 0 1 1 -0.4 0"
        strokeWidth="1.6"
      />
    </svg>
  );
}

// Rough hand-drawn rectangle
export function Rectangle({ ink = 'blue', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 120 70"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 4 8 C 30 4, 80 6, 116 5 C 118 25, 117 50, 115 64 C 80 66, 40 65, 6 63 C 4 45, 3 24, 4 8 Z"
        strokeWidth="2"
      />
    </svg>
  );
}

// Loose squiggle
export function Squiggle({ ink = 'pencil', className = '', style }: BaseProps) {
  return (
    <svg
      {...svgProps(ink)}
      className={`${svgProps(ink).className} ${className}`}
      style={style}
      viewBox="0 0 120 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 2 10 C 12 2, 22 18, 32 10 S 52 2, 62 10 S 82 18, 92 10 S 112 2, 118 8"
        strokeWidth="1.6"
      />
    </svg>
  );
}
