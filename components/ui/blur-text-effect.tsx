'use client';

import React, { useMemo } from 'react';

interface BlurTextEffectProps {
  children: string;
  className?: string;
  direction?: 'in' | 'out';
}

type Token = { char: string; index: number; isBreak?: boolean };

export const BlurTextEffect: React.FC<BlurTextEffectProps> = ({
  children,
  className = '',
  direction = 'in',
}) => {
  const groups = useMemo(() => {
    const segments = children.split(/( |\n)/);
    const result: Token[][] = [];
    let idx = 0;
    segments.forEach((seg) => {
      if (seg === '\n') {
        result.push([{ char: '\n', index: idx++, isBreak: true }]);
        return;
      }
      if (seg === ' ') {
        if (result.length > 0) {
          result[result.length - 1].push({ char: ' ', index: idx++ });
        }
        return;
      }
      if (!seg) return;
      const tokens: Token[] = [];
      for (const ch of seg) {
        tokens.push({ char: ch, index: idx++ });
      }
      result.push(tokens);
    });
    return result;
  }, [children]);

  const anim = direction === 'in' ? 'blurIn' : 'blurOut';

  return (
    <>
      <style>{`
        @keyframes blurIn {
          from { opacity: 0; transform: translateY(10px); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes blurOut {
          from { opacity: 1; transform: translateY(0); filter: blur(0px); }
          to { opacity: 0; transform: translateY(-10px); filter: blur(8px); }
        }
      `}</style>
      <span className={`inline ${className}`}>
        {groups.map((tokens, gi) => {
          if (tokens.length === 1 && tokens[0].isBreak) {
            return <br key={gi} />;
          }
          return (
            <span key={gi} className="inline-block whitespace-nowrap">
              {tokens.map((t) => (
                <span
                  key={t.index}
                  className="inline-block"
                  style={{
                    opacity: direction === 'in' ? 0 : 1,
                    animation: `${anim} 0.3s ${t.index * 0.015}s ease-out forwards`,
                  }}
                >
                  {t.char === ' ' ? ' ' : t.char}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </>
  );
};
