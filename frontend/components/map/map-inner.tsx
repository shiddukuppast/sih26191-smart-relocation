"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Habitation, SafeSite } from "@/types";
import { HazardBadge, PriorityBadge } from "@/components/shared/status-badge";
import { ArrowRight, Eye, ShieldCheck, Waves, Truck, Cross, School } from "lucide-react";

// Fix Leaflet default icon issues in bundler
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 11px;
        color: white;
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const redZoneIcon = createCustomIcon("#e11d48", "🔴");
const highRiskIcon = createCustomIcon("#f97316", "🟠");
const mediumRiskIcon = createCustomIcon("#f59e0b", "🟡");
const safeHabitationIcon = createCustomIcon("#06b6d4", "🟢");
const safeSiteIcon = createCustomIcon("#10b981", "🏠");
const hospitalIcon = createCustomIcon("#3b82f6", "🏥");
const schoolIcon = createCustomIcon("#8b5cf6", "🏫");

// Helper component to center map on selected point
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapInnerProps {
  habitations: Habitation[];
  safeSites: SafeSite[];
  selectedId?: string | null;
  layerVisibility: {
    hazardZones: boolean;
    habitations: boolean;
    safeSites: boolean;
    rivers: boolean;
    roads: boolean;
    hospitals: boolean;
    schools: boolean;
    satellite: boolean;
  };
}

// Sample coordinates for rivers and major roads in Karnataka Western Ghats
const CAUVERY_RIVER_SEGMENT: [number, number][] = [
  [12.3912, 75.5342], // Bhagamandala
  [12.4412, 75.6812],
  [12.4826, 75.7612], // Makkandur Slopes
  [12.5142, 75.7892], // Hattihole
  [12.4552, 75.9624], // Kushalnagar
];

const ARTERIAL_ROAD_SH88: [number, number][] = [
  [12.4189, 75.6984], // Monnangeri
  [12.4412, 75.7254], // Katakeri
  [12.4789, 75.8341], // Madikeri
  [12.6021, 75.8643], // Somwarpet
  [12.4552, 75.9624], // Kushalnagar
];

const SAMPLE_INFRASTRUCTURE = [
  { id: "HOSP-01", name: "Madikeri District Civil Hospital", type: "hospital", lat: 12.4244, lng: 75.7382 },
  { id: "HOSP-02", name: "Kushalnagar Community Health Center", type: "hospital", lat: 12.4612, lng: 75.9554 },
  { id: "SCHL-01", name: "Somwarpet Central Relief Shelter / High School", type: "school", lat: 12.5982, lng: 75.8712 },
  { id: "SCHL-02", name: "Suntikoppa Assembly Relief Center", type: "school", lat: 12.4812, lng: 75.8412 },
];

export default function MapInner({
  habitations,
  safeSites,
  selectedId,
  layerVisibility,
}: MapInnerProps) {
  const defaultCenter: [number, number] = [12.4826, 75.7612]; // Centered around Kodagu / HAB-1021
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [zoom, setZoom] = useState(11);

  // If a specific habitation or site is selected, center on it
  useEffect(() => {
    if (!selectedId) return;
    const hab = habitations.find((h) => h.habitationId === selectedId);
    if (hab) {
      setCenter([hab.latitude, hab.longitude]);
      setZoom(13);
      return;
    }
    const site = safeSites.find((s) => s.siteId === selectedId);
    if (site) {
      setCenter([site.latitude, site.longitude]);
      setZoom(13);
    }
  }, [selectedId, habitations, safeSites]);

  const tileUrl = layerVisibility.satellite
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const tileAttribution = layerVisibility.satellite
    ? "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    : '&copy; <a href="https://carto.com/">CARTO</a> | OpenStreetMap';

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[600px] rounded-xl overflow-hidden z-10"
    >
      <MapController center={center} zoom={zoom} />
      <TileLayer url={tileUrl} attribution={tileAttribution} />

      {/* 🔴 Hazard Red Zones / Flood buffer circles */}
      {layerVisibility.hazardZones &&
        habitations.map((h) => {
          const isRed = h.hazard.overall_hazard_level === 4;
          const isHigh = h.hazard.overall_hazard_level === 3;
          if (!isRed && !isHigh) return null;

          return (
            <Circle
              key={`zone-${h.habitationId}`}
              center={[h.latitude, h.longitude]}
              radius={isRed ? 1400 : 900}
              pathOptions={{
                color: isRed ? "#e11d48" : "#f97316",
                fillColor: isRed ? "#e11d48" : "#f97316",
                fillOpacity: isRed ? 0.25 : 0.15,
                weight: 2,
                dashArray: isRed ? "4, 4" : undefined,
              }}
            />
          );
        })}

      {/* 🌊 Rivers Layer */}
      {layerVisibility.rivers && (
        <Polyline
          positions={CAUVERY_RIVER_SEGMENT}
          pathOptions={{ color: "#38bdf8", weight: 4, opacity: 0.8 }}
        >
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-cyan-400">Cauvery River Basin Corridor</strong>
              <div className="text-slate-400">High flood discharge monitoring sector</div>
            </div>
          </Popup>
        </Polyline>
      )}

      {/* 🛣 Roads Layer */}
      {layerVisibility.roads && (
        <Polyline
          positions={ARTERIAL_ROAD_SH88}
          pathOptions={{ color: "#fbbf24", weight: 3, opacity: 0.7, dashArray: "6, 6" }}
        >
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-amber-400">State Highway 88 (Evacuation Arterial)</strong>
              <div className="text-slate-400">Designated primary transit corridor</div>
            </div>
          </Popup>
        </Polyline>
      )}

      {/* 🏥 Hospitals */}
      {layerVisibility.hospitals &&
        SAMPLE_INFRASTRUCTURE.filter((i) => i.type === "hospital").map((h) => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
            <Popup>
              <div className="p-1 text-xs">
                <strong className="text-blue-400">{h.name}</strong>
                <div className="text-slate-400">Emergency Medical Support Center</div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* 🏫 Schools */}
      {layerVisibility.schools &&
        SAMPLE_INFRASTRUCTURE.filter((i) => i.type === "school").map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={schoolIcon}>
            <Popup>
              <div className="p-1 text-xs">
                <strong className="text-purple-400">{s.name}</strong>
                <div className="text-slate-400">Designated Community Relief Shelter</div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* 🏘 Vulnerable Habitations */}
      {layerVisibility.habitations &&
        habitations.map((h) => {
          let icon = safeHabitationIcon;
          if (h.hazard.overall_hazard_level === 4) icon = redZoneIcon;
          else if (h.hazard.overall_hazard_level === 3) icon = highRiskIcon;
          else if (h.hazard.overall_hazard_level === 2) icon = mediumRiskIcon;

          return (
            <Marker key={h.habitationId} position={[h.latitude, h.longitude]} icon={icon}>
              <Popup>
                <div className="p-2 space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {h.habitationId}
                    </span>
                    <HazardBadge level={h.hazard.overall_hazard_level as any} size="sm" />
                  </div>

                  <div>
                    <div className="font-bold text-slate-100 text-xs">{h.name}</div>
                    <div className="text-[11px] text-slate-400">{h.village}, {h.district}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                    <div>
                      <span className="text-slate-500">Hazard Score:</span>
                      <div className="font-mono font-bold text-rose-400">
                        {h.hazard.overall_hazard_score}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Exposed Pop:</span>
                      <div className="font-mono font-bold text-slate-200">
                        {h.population.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Relocation Urgency:</span>
                    <PriorityBadge priority={h.priorityLevel} />
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <Link
                      href={`/dashboard/habitations/${h.habitationId}`}
                      className="w-full py-1.5 px-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition text-center shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Full Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {/* 🏠 Candidate Relocation Sites */}
      {layerVisibility.safeSites &&
        safeSites.map((s) => (
          <Marker key={s.siteId} position={[s.latitude, s.longitude]} icon={safeSiteIcon}>
            <Popup>
              <div className="p-2 space-y-2 min-w-[240px]">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {s.siteId}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    SAFE RELOCATION SITE
                  </span>
                </div>

                <div>
                  <div className="font-bold text-slate-100 text-xs">{s.name}</div>
                  <div className="text-[11px] text-slate-400">{s.district}</div>
                </div>

                <div className="space-y-1 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Capacity:</span>
                    <strong className="font-mono text-emerald-400">{s.availableCapacity} / {s.totalCapacity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Occupancy:</span>
                    <span className="font-mono text-slate-300">{s.currentPopulation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Road Connectivity:</span>
                    <span className="text-slate-200">{s.roadAccess}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hospital Access:</span>
                    <span className="text-slate-200">{s.hospitalAccess}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Water Availability:</span>
                    <span className="text-slate-200">{s.waterAvailability}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                    <span className="text-slate-400 font-semibold">Match Score:</span>
                    <strong className="font-mono text-cyan-400">{s.recommendationScore}/100</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <Link
                    href={`/dashboard/safe-sites/${s.siteId}`}
                    className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition text-center shadow"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    View Safe Site Dossier
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
