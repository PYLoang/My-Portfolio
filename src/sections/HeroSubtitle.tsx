import { AnimatePresence, motion } from 'framer-motion';

const LINES = [
  'I build delightful products with React, Angular, and a love for the details.',
  'Strong opinions on Angular — type-safe, structured, scalable.',
  'And React — for fluid, expressive, polished UIs.',
];

interface Props {
  progress: number;
}

export function HeroSubtitle({ progress }: Props) {
  // 0..0.33 -> line 0, 0.33..0.66 -> line 1, 0.66..1 -> line 2
  const idx = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  return (
    <div className="hero__subtitle-wrap">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="hero__subtitle"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {LINES[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
