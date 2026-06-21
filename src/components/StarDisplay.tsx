import { motion } from 'framer-motion';

interface StarDisplayProps {
  stars: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const sizes = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-5xl',
};

export default function StarDisplay({ stars, size = 'md', animate = false }: StarDisplayProps) {
  return (
    <div className="flex gap-1 items-center justify-center">
      {[1, 2, 3].map((n) => {
        const filled = n <= stars;
        return (
          <motion.span
            key={n}
            className={sizes[size]}
            initial={animate ? { scale: 0, rotate: -180, opacity: 0 } : false}
            animate={animate ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={animate ? { delay: n * 0.25, type: 'spring', stiffness: 200, damping: 12 } : {}}
          >
            {filled ? '⭐' : '☆'}
          </motion.span>
        );
      })}
    </div>
  );
}
