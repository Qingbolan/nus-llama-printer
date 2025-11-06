import React, { useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  variant?: 'default' | 'strong' | 'thin';
  tintOpacity?: number;
  noise?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  variant = 'default',
  tintOpacity = 0.7,
  noise = true,
  ...restProps
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  // Glassmorphism variant configurations
  const variantConfig = {
    thin: {
      blur: 12,
      saturate: 140,
      tint: 0.5,
    },
    default: {
      blur: 30,
      saturate: 180,
      tint: 0.7,
    },
    strong: {
      blur: 50,
      saturate: 200,
      tint: 0.85,
    },
  };

  const config = variantConfig[variant];

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-white/[0.18] dark:border-white/[0.12] ${className}`}
      style={{
        position: 'relative',
        isolation: 'isolate',
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      }}
      {...restProps}
    >
      {/* Backdrop blur layer - glassmorphism effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          backdropFilter: `blur(${config.blur}px) saturate(${config.saturate}%)`,
          WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturate}%)`,
        }}
      />

      {/* Tint overlay with theme support */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          backgroundColor: `rgba(var(--acrylic-tint), ${tintOpacity * config.tint})`,
          mixBlendMode: 'normal',
        }}
      />

      {/* Luminosity layer for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Noise texture */}
      {noise && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] rounded-3xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            mixBlendMode: 'soft-light',
          }}
        />
      )}

      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out rounded-3xl"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
