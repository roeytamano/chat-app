// https://cruip-tutorials.vercel.app/animated-gradient-border/
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function BorderAnimatedContainer({ children }: Props) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.cyan.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border  flex overflow-hidden">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;