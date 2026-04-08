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

interface AmapViewImplProps {
  landmarks: Landmark[];
  lang: string;
  onMapReady?: (map: any) => void;
}

export default function AmapViewImpl({ landmarks, lang, onMapReady }: AmapViewImplProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    let isMounted = true;

    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.InfoWindow'],
        });

        if (!isMounted || !mapContainer.current) return;

        mapInstance.current = new AMap.Map(mapContainer.current, {
          viewMode: '3D',
          zoom: 5,
          center: [116.397428, 39.90923],
          mapStyle: 'amap://styles/whitesmoke',
        });

        mapInstance.current.addControl(new AMap.Scale());
        mapInstance.current.addControl(new AMap.ToolBar({ position: { top: '110px', right: '40px' } }));
        mapInstance.current.addControl(new AMap.ControlBar({ position: { top: '10px', right: '10px' } }));

        if (onMapReady) {
          onMapReady(mapInstance.current);
        }

        landmarks.forEach(landmark => {
          const name = lang === 'en' ? landmark.en.name : landmark.zh.name;
          const marker = new AMap.Marker({
            position: new AMap.LngLat(landmark.coordinates.lng, landmark.coordinates.lat),
            title: name,
            label: {
              content: `<div style="background:white;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;color:#9e2016;border:1px solid #9e2016/20;">${name}</div>`,
              direction: 'top'
            }
          });

          marker.on('click', () => {
            const infoWindow = new AMap.InfoWindow({
              content: `
                <div style="padding:16px;font-family:sans-serif;background:white;border-radius:12px;min-width:200px;">
                  <h4 style="font-size:16px;font-weight:bold;margin-bottom:4px;color:#1b1c1a;">${name}</h4>
                  <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#1b1c1a/40;margin-bottom:12px;">${landmark.province}</p>
                  <a href="/${lang}/landmarks/${landmark.id}" style="display:inline-flex;align-items:center;gap:8px;background:#9e2016;color:white;padding:8px 16px;border-radius:8px;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;">
                    ${lang === 'en' ? 'Explore' : '探索'} →
                  </a>
                </div>
              `,
              offset: new AMap.Pixel(0, -30)
            });
            infoWindow.open(mapInstance.current, marker.getPosition());
          });

          mapInstance.current.add(marker);
        });

      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [landmarks, lang, onMapReady]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full bg-surface-variant/30"
      style={{ minHeight: '100%', minWidth: '100%' }}
    />
  );
}
