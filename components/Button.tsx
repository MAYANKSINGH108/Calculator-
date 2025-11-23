import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
  doubleWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '', 
  doubleWidth = false 
}) => {
  
  // Base styles: Glassy look, rounded corners, smooth transition
  const baseStyles = "relative group overflow-hidden rounded-2xl text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center select-none backdrop-blur-md";
  
  const variants = {
    // Standard number buttons: Dark glass
    default: "bg-white/[0.03] text-gray-200 hover:bg-white/[0.08] border border-white/[0.05] shadow-sm",
    
    // Primary operators: Gradient Indigo
    primary: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/20 hover:brightness-110",
    
    // Secondary operators: Lighter glass
    secondary: "bg-white/[0.08] text-indigo-300 hover:bg-white/[0.12] border border-white/[0.05]",
    
    // Accent/Equals: Gradient Rose/Orange or Cyan
    accent: "bg-gradient-to-br from-cyan-400 to-blue-500 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/20 hover:brightness-110",
    
    // Danger/Clear: Red/Rose gradient
    danger: "bg-gradient-to-br from-rose-500/80 to-red-600/80 text-white border border-rose-500/30 hover:brightness-110"
  };

  const widthClass = doubleWidth ? "col-span-2" : "col-span-1";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className} h-16 sm:h-20`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-white/10 to-transparent transition-opacity duration-300 pointer-events-none" />
      <span className="relative z-10">{label}</span>
    </button>
  );
};

export default Button;