import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, fadeIn, scaleIn, staggerContainer } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn' | 'staggerContainer';
  delay?: number;
  threshold?: number;
  className?: string;
}

const animationVariants = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  scaleIn,
  staggerContainer,
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.1,
  className = '',
}) => {
  const { ref, controls } = useScrollAnimation(threshold);
  
  const variants = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
