import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  forceFinish?: boolean; // New prop to allow parent to force finish
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 30, 
  onComplete, 
  className,
  forceFinish = false 
}) => {
  const [displayLength, setDisplayLength] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  // Reset when text changes
  useEffect(() => {
    setDisplayLength(0);
    setIsDone(false);
  }, [text]);

  // Handle force finish from parent
  useEffect(() => {
    if (forceFinish && !isDone) {
        setDisplayLength(text.length);
        setIsDone(true);
    }
  }, [forceFinish, text.length, isDone]);

  // Timer Logic
  useEffect(() => {
    if (isDone) return;

    if (displayLength >= text.length) {
        setIsDone(true);
        return;
    }

    const timer = setTimeout(() => {
        setDisplayLength(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayLength, text.length, speed, isDone]);

  // Completion Trigger
  useEffect(() => {
      if (isDone && onComplete) {
          onComplete();
      }
  }, [isDone, onComplete]);

  return (
    <p 
      className={className}
      style={{ 
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        whiteSpace: 'pre-wrap', // Preserve line breaks
        wordBreak: 'break-word'
      }}
    >
      {text.slice(0, displayLength)}
      {!isDone && <span className="animate-pulse inline-block ml-1 text-red-500">_</span>}
    </p>
  );
};

export default Typewriter;