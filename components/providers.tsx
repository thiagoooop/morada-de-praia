
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        {hasMounted && <Toaster position="top-right" richColors />}
      </ThemeProvider>
    </SessionProvider>
  );
}
