import React from 'react';

export const GrassBlockIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_2px_8px_rgba(0,230,118,0.4)] ${className}`}
    >
      {/* Top Face - Green Grass */}
      <polygon points="16,2 30,9 16,16 2,9" fill="#5cb836" />
      <polygon points="16,4 28,10 16,15 4,10" fill="#6bc93d" />
      <polygon points="10,6 16,9 13,11 7,8" fill="#7ed94e" />

      {/* Left Face - Dirt with grass fringe */}
      <polygon points="2,9 16,16 16,30 2,23" fill="#694d33" />
      {/* Left grass drape */}
      <polygon points="2,9 16,16 16,19 14,19 14,17 10,17 10,19 8,19 8,16 5,16 5,18 2,15" fill="#4d9929" />
      {/* Left dirt texture pixels */}
      <rect x="5" y="19" width="3" height="3" fill="#573e27" />
      <rect x="10" y="22" width="3" height="3" fill="#4b3520" />
      <rect x="6" y="24" width="2" height="2" fill="#7a5a3d" />

      {/* Right Face - Darker Dirt with grass fringe */}
      <polygon points="16,16 30,9 30,23 16,30" fill="#573e27" />
      {/* Right grass drape */}
      <polygon points="16,16 30,9 30,15 27,18 27,16 24,16 24,19 22,19 22,17 18,17 18,19 16,19" fill="#3f8021" />
      {/* Right dirt texture pixels */}
      <rect x="23" y="19" width="3" height="3" fill="#4b3520" />
      <rect x="18" y="22" width="3" height="3" fill="#694d33" />
      <rect x="24" y="24" width="2" height="2" fill="#7a5a3d" />
    </svg>
  );
};

export const NetcraftLogo: React.FC<{
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ showSubtitle = false, size = 'md', className = '' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl sm:text-2xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <GrassBlockIcon size={iconSize} />
      <div className="flex flex-col leading-none">
        <div className={`font-black font-heading tracking-wider ${textSize} text-white flex items-center`}>
          <span>NETCRAFT</span>
          <span className="text-[#00e676] drop-shadow-[0_0_12px_rgba(0,230,118,0.6)]">BR</span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-zinc-400 font-normal tracking-normal mt-1">
            Mais que um servidor, uma comunidade.
          </span>
        )}
      </div>
    </div>
  );
};
