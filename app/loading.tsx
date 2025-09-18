import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 rounded-full mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2">Loading IdEinstein</h2>
        <p className="text-text/60">Where Ideas Take Shape...</p>
      </div>
    </div>
  );
}