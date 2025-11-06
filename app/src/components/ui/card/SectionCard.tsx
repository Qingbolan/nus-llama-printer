import React from 'react';
import { motion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  icon?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  delay = 0,
  icon
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <SpotlightCard
        className="p-6 sm:p-8"
        aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center space-x-3 mb-6">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary">
              {icon}
            </div>
          )}
          <h3
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-xl sm:text-2xl font-bold text-theme-primary"
          >
            {title}
          </h3>
        </div>
        <div className="relative">
          {children}
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

export default SectionCard; 