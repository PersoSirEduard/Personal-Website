// McGillCrest.jsx
// McGill's arms redrawn as an ink-and-sanguine engraving to match the site.
import { useId } from 'react';

const SHIELD = 'M 15 10 H 105 V 70 Q 105 115 60 135 Q 15 115 15 70 Z';
const CHIEF = 'M 15 10 H 105 V 50 L 87 36 L 73 50 L 60 36 L 47 50 L 33 36 L 15 50 Z';
// Martlet facing left (round head, raised wing, forked tail, no feet), drawn in a 23 x 15 box
const MARTLET = 'M 0 7.6 Q 1.5 4 4.5 4 Q 7 4.2 8.5 6 L 12 1 Q 13.5 0 14.5 1.5 Q 14 5 13 7 Q 16 7 18 8 L 23 7 L 20.5 10 L 23 13 L 17 11.5 Q 11 15 6 12.5 Q 2.5 10.5 1.2 8.6 Z';
const CROWN = 'M 0 9 L -1 2 L 3 6 L 6 0 L 9 6 L 13 2 L 12 9 Z';

function McGillCrest({ className = '' }) {
  const id = useId().replace(/:/g, '');
  const hatch = `crest-hatch-${id}`;
  const motto = `crest-motto-${id}`;

  return (
    <svg viewBox="0 0 120 146" className={className} role="img" aria-label="McGill University crest">
      <defs>
        <pattern id={hatch} width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="2.4" stroke="currentColor" strokeWidth="0.9" className="text-sanguine" />
        </pattern>
        <path id={motto} d="M 10 124.6 Q 60 154.6 110 124.6" />
      </defs>

      <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
        {/* Shield and hatched chief */}
        <path d={SHIELD} className="text-ink fill-vellum" strokeWidth="1.2" />
        <path d={CHIEF} fill={`url(#${hatch})`} stroke="none" />
        <path d="M 15 50 L 33 36 L 47 50 L 60 36 L 73 50 L 87 36 L 105 50" className="text-ink" strokeWidth="0.9" />

        {/* Crowns */}
        {[26, 82].map((x) => (
          <g key={x} transform={`translate(${x} 18)`} className="text-ink fill-vellum" strokeWidth="0.8">
            <path d={CROWN} />
            <path d="M 0 9 H 12 V 11 H 0 Z" />
            <circle cx="-1" cy="1.6" r="0.9" />
            <circle cx="6" cy="-0.4" r="0.9" />
            <circle cx="13" cy="1.6" r="0.9" />
          </g>
        ))}

        {/* Open book */}
        <g className="text-ink" strokeWidth="0.8">
          <path d="M 49 16 Q 54 14 60 16 Q 66 14 71 16 V 30 Q 66 28 60 30 Q 54 28 49 30 Z" className="fill-vellum" />
          <path d="M 60 16 V 30" />
          <path d="M 51.5 19.5 H 57.5 M 51.5 22.5 H 57.5 M 51.5 25.5 H 57.5 M 62.5 19.5 H 68.5 M 62.5 22.5 H 68.5 M 62.5 25.5 H 68.5" strokeWidth="0.5" />
        </g>

        {/* Martlets, two and one */}
        {[[26, 55], [67, 55], [46.5, 81]].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(1.2)`} strokeWidth="0.5">
            <path d={MARTLET} className="text-ink fill-sanguine" />
            <path d="M 9.5 7.5 Q 12.2 6.8 13 4" className="text-vellum" strokeWidth="0.45" />
            <circle cx="3.5" cy="6.4" r="0.6" className="fill-vellum" stroke="none" />
          </g>
        ))}

        {/* Motto ribbon, passing in front of the shield's point */}
        <g className="text-ink" strokeWidth="0.9">
          <path d="M 10 118 L 3 115.5 L 6.5 122.5 L 3 129.5 L 10 127 Z M 110 118 L 117 115.5 L 113.5 122.5 L 117 129.5 L 110 127 Z" className="fill-vellum" />
          <path d="M 10 118 Q 60 148 110 118 V 127 Q 60 157 10 127 Z" className="fill-vellum" />
        </g>
      </g>

      <text className="fill-ink" fontFamily='"EB Garamond", Georgia, serif' fontSize="5.2" letterSpacing="0.35">
        <textPath href={`#${motto}`} startOffset="50%" textAnchor="middle">GRANDESCUNT AUCTA LABORE</textPath>
      </text>
    </svg>
  );
}

export default McGillCrest;
