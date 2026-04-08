'use client';

import { useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

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

export default function AmapView({ landmarks, lang, onMapReady }: AmapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    AMapLoader.load({
      key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.InfoWindow'],
    })
      .then((AMap) => {
        if (!isMounted || !mapContainer.current) return;

        // Initialize Map
        mapInstance.current = new AMap.Map(mapContainer.current, {
          viewMode: '3D',
          zoom: 5,
          center: [116.397428, 39.90923], // Center on Beijing
          mapStyle: 'amap://styles/whitesmoke',
        });

        // Setup Controls
        mapInstance.current.addControl(new AMap.Scale());
        mapInstance.current.addControl(new AMap.ToolBar({ position: { top: '110px', right: '40px' } }));
        mapInstance.current.addControl(new AMap.ControlBar({ position: { top: '10px', right: '10px' } }));

        // Callback for parent component
        if (onMapReady) {
          onMapReady(mapInstance.current);
        }

        // Add Markers from Content
        landmarks.forEach(landmark => {
          const name = lang === 'en' ? landmark.en.name : landmark.zh.name;
          const marker = new AMap.Marker({
            position: new AMap.LngLat(landmark.coordinates.lng, landmark.coordinates.lat),
            title: name,
            label: {
              content: `<div className="bg-white px-2 py-1 rounded shadow-sm border border-primary/20 text-[10px] font-sans font-bold text-primary">${name}</div>`,
              direction: 'top'
            }
          });

          marker.on('click', () => {
             const infoWindow = new AMap.InfoWindow({
                content: `
                  <div class="p-4 font-sans bg-white rounded-xl">
                    <h4 class="font-serif font-black text-lg text-[#1b1c1a] mb-1">${name}</h4>
                    <p class="text-[10px] text-[#1b1c1a]/40 uppercase tracking-widest mb-4">${landmark.province}</p>
                    <a href="/${lang}/landmarks/${landmark.id}" class="inline-flex items-center gap-2 bg-[#9e2016] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#1b1c1a] transition-all">
                      ${lang === 'en' ? 'Explore History' : '探索历史'} →
                    </a>
                  </div>
                `,
                offset: new AMap.Pixel(0, -30)
             });
             infoWindow.open(mapInstance.current, marker.getPosition());
          });

          mapInstance.current.add(marker);
        });

      })
      .catch((e) => {
        console.error('AMap load failed:', e);
      });

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [landmarks, lang]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full bg-surface-variant/30"
      style={{ minHeight: '100%', minWidth: '100%' }}
    />
  );
}
