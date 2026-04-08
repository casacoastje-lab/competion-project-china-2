'use client';

import dynamic from 'next/dynamic';

const AmapViewComponent = dynamic(() => import('./AmapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#9e2016]/20 border-t-[#9e2016] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-sans text-[#1b1c1a]/40 uppercase tracking-widest">Loading Map...</p>
      </div>
    </div>
  ),
});

interface Landmark {
  id: string;
  province: string;
  coordinates: { lat: number; lng: number };
  en: { name: string };
  zh: { name: string };
}

interface AmapViewProps {
  landmarks: Landmark[];
  lang: string;
  onMapReady?: (map: any) => void;
}

export default function AmapView(props: AmapViewProps) {
  return <AmapViewComponent {...props} />;
}
