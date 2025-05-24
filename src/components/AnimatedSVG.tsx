
const AnimatedSVG = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width="600"
        height="400"
        viewBox="0 0 600 400"
        className="w-full h-full max-w-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circles */}
        <circle
          cx="150"
          cy="150"
          r="60"
          fill="rgba(99, 102, 241, 0.1)"
          className="animate-pulse"
        />
        <circle
          cx="450"
          cy="250"
          r="40"
          fill="rgba(139, 92, 246, 0.1)"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <circle
          cx="300"
          cy="100"
          r="30"
          fill="rgba(6, 182, 212, 0.1)"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />

        {/* Floating nodes */}
        <g className="animate-float">
          <circle cx="150" cy="150" r="20" fill="url(#gradient1)" className="animate-pulse-glow" />
          <circle cx="300" cy="200" r="15" fill="url(#gradient2)" />
          <circle cx="450" cy="150" r="18" fill="url(#gradient3)" />
        </g>

        {/* Connecting lines */}
        <g stroke="url(#lineGradient)" strokeWidth="2" fill="none" opacity="0.6">
          <line x1="150" y1="150" x2="300" y2="200">
            <animate attributeName="stroke-dasharray" values="0,400;400,400;400,0" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="300" y1="200" x2="450" y2="150">
            <animate attributeName="stroke-dasharray" values="0,400;400,400;400,0" dur="3s" begin="1s" repeatCount="indefinite" />
          </line>
          <line x1="150" y1="150" x2="450" y2="150">
            <animate attributeName="stroke-dasharray" values="0,400;400,400;400,0" dur="3s" begin="2s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Tech icons */}
        <g className="animate-float" style={{ animationDelay: '0.5s' }}>
          {/* React icon */}
          <g transform="translate(120, 120)">
            <circle cx="15" cy="15" r="3" fill="#61DAFB" />
            <ellipse cx="15" cy="15" rx="12" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none">
              <animateTransform attributeName="transform" type="rotate" values="0 15 15;360 15 15" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="15" cy="15" rx="12" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 15 15)">
              <animateTransform attributeName="transform" type="rotate" values="60 15 15;420 15 15" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="15" cy="15" rx="12" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(120 15 15)">
              <animateTransform attributeName="transform" type="rotate" values="120 15 15;480 15 15" dur="4s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* Code brackets */}
          <g transform="translate(420, 120)" fill="url(#gradient4)">
            <path d="M5 5 L1 10 L5 15" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M15 5 L19 10 L15 15" stroke="currentColor" strokeWidth="2" fill="none" />
            <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite" />
          </g>

          {/* Network nodes */}
          <g transform="translate(270, 170)">
            <circle cx="15" cy="15" r="2" fill="url(#gradient5)" />
            <circle cx="25" cy="10" r="2" fill="url(#gradient5)" />
            <circle cx="35" cy="20" r="2" fill="url(#gradient5)" />
            <circle cx="20" cy="25" r="2" fill="url(#gradient5)" />
            <line x1="15" y1="15" x2="25" y2="10" stroke="url(#gradient5)" strokeWidth="1" />
            <line x1="25" y1="10" x2="35" y2="20" stroke="url(#gradient5)" strokeWidth="1" />
            <line x1="35" y1="20" x2="20" y2="25" stroke="url(#gradient5)" strokeWidth="1" />
            <line x1="20" y1="25" x2="15" y2="15" stroke="url(#gradient5)" strokeWidth="1" />
          </g>
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedSVG;
