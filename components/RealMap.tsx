"use client";
import { useEffect, useRef, useState } from "react";

const BILIRAN_CENTER: [number, number] = [11.5833, 124.4667];

// Coordinates placed ON actual roads in Naval, Biliran
// verified against OSM road network
const INCIDENT = {
  id: "INC-003",
  type: "Medical Emergency",
  latlng: [11.5791, 124.4625] as [number, number],  // Padre Iñigo St, Naval
};

const STATIONS = [
  {
    name: "PNP Naval Station",
    latlng: [11.5868, 124.4706] as [number, number],  // on Vicentillo St near PNP
    status: "En Route",
    color: "#3b82f6",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    name: "BFP Biliran",
    latlng: [11.5812, 124.4758] as [number, number],  // on Larrazabal road near BFP
    status: "On Scene",
    color: "#ef4444",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  },
];

const EVACUATION_CENTERS = [
  { name: "Naval Central School",        latlng: [11.5850, 124.4680] as [number, number] },
  { name: "Biliran National High School", latlng: [11.5820, 124.4730] as [number, number] },
];

// ── Incident type config ──────────────────────────────────────────────────────
export type IncidentType = "Fire" | "Flood" | "Medical" | "Accident" | "Crime" | "Other";

export const INCIDENT_TYPE_CONFIG: Record<IncidentType, { color: string; rgba: string; emoji: string }> = {
  Fire:     { color: "#f97316", rgba: "rgba(249,115,22,",  emoji: "🔥" },
  Flood:    { color: "#3b82f6", rgba: "rgba(59,130,246,",  emoji: "🌊" },
  Medical:  { color: "#ef4444", rgba: "rgba(239,68,68,",   emoji: "🏥" },
  Accident: { color: "#eab308", rgba: "rgba(234,179,8,",   emoji: "🚗" },
  Crime:    { color: "#9333ea", rgba: "rgba(147,51,234,",  emoji: "🚨" },
  Other:    { color: "#6b7280", rgba: "rgba(107,114,128,", emoji: "⚠️" },
};

// ── Heat data ─────────────────────────────────────────────────────────────────
export interface HeatPoint {
  latlng: [number, number];
  type: IncidentType;
  barangay: string;
  count: number;
}

export const HEAT_DATA: HeatPoint[] = [
  // 🚗 Naval Highway — Road Accident corridor
  { latlng: [11.5833, 124.4700], type: "Accident", barangay: "Naval Highway",     count: 18 },
  { latlng: [11.5845, 124.4715], type: "Accident", barangay: "Naval Highway",     count: 14 },
  { latlng: [11.5820, 124.4690], type: "Accident", barangay: "Naval Highway",     count: 11 },
  { latlng: [11.5838, 124.4708], type: "Accident", barangay: "Naval Highway",     count: 9  },
  { latlng: [11.5828, 124.4695], type: "Accident", barangay: "Naval Highway",     count: 7  },
  // 🔥 Brgy. Larrazabal — Fire-prone
  { latlng: [11.5810, 124.4760], type: "Fire",     barangay: "Brgy. Larrazabal",  count: 16 },
  { latlng: [11.5800, 124.4770], type: "Fire",     barangay: "Brgy. Larrazabal",  count: 13 },
  { latlng: [11.5815, 124.4750], type: "Fire",     barangay: "Brgy. Larrazabal",  count: 10 },
  { latlng: [11.5805, 124.4765], type: "Fire",     barangay: "Brgy. Larrazabal",  count: 8  },
  { latlng: [11.5818, 124.4758], type: "Fire",     barangay: "Brgy. Larrazabal",  count: 6  },
  { latlng: [11.5795, 124.4775], type: "Fire",     barangay: "Brgy. Larrazabal",  count: 5  },
  // 🏥 Brgy. Padre Iñigo — Medical
  { latlng: [11.5790, 124.4620], type: "Medical",  barangay: "Brgy. Padre Iñigo", count: 17 },
  { latlng: [11.5785, 124.4630], type: "Medical",  barangay: "Brgy. Padre Iñigo", count: 13 },
  { latlng: [11.5795, 124.4610], type: "Medical",  barangay: "Brgy. Padre Iñigo", count: 10 },
  { latlng: [11.5782, 124.4625], type: "Medical",  barangay: "Brgy. Padre Iñigo", count: 8  },
  { latlng: [11.5798, 124.4618], type: "Medical",  barangay: "Brgy. Padre Iñigo", count: 6  },
  // 🌊 Brgy. Sabang — Flood
  { latlng: [11.5760, 124.4640], type: "Flood",    barangay: "Brgy. Sabang",       count: 20 },
  { latlng: [11.5750, 124.4650], type: "Flood",    barangay: "Brgy. Sabang",       count: 16 },
  { latlng: [11.5770, 124.4635], type: "Flood",    barangay: "Brgy. Sabang",       count: 13 },
  { latlng: [11.5745, 124.4660], type: "Flood",    barangay: "Brgy. Sabang",       count: 10 },
  { latlng: [11.5755, 124.4645], type: "Flood",    barangay: "Brgy. Sabang",       count: 8  },
  { latlng: [11.5765, 124.4655], type: "Flood",    barangay: "Brgy. Sabang",       count: 6  },
  // 🚨 Brgy. Poblacion — Crime
  { latlng: [11.5855, 124.4680], type: "Crime",    barangay: "Brgy. Poblacion",    count: 12 },
  { latlng: [11.5860, 124.4670], type: "Crime",    barangay: "Brgy. Poblacion",    count: 9  },
  { latlng: [11.5850, 124.4688], type: "Crime",    barangay: "Brgy. Poblacion",    count: 7  },
  { latlng: [11.5865, 124.4675], type: "Crime",    barangay: "Brgy. Poblacion",    count: 5  },
  // 🌊 Brgy. Caraycaray — Flood
  { latlng: [11.5870, 124.4640], type: "Flood",    barangay: "Brgy. Caraycaray",   count: 14 },
  { latlng: [11.5880, 124.4630], type: "Flood",    barangay: "Brgy. Caraycaray",   count: 11 },
  { latlng: [11.5875, 124.4648], type: "Flood",    barangay: "Brgy. Caraycaray",   count: 8  },
  { latlng: [11.5885, 124.4638], type: "Flood",    barangay: "Brgy. Caraycaray",   count: 6  },
  // 🔥 Brgy. Libertad — Fire + Medical mix
  { latlng: [11.5830, 124.4650], type: "Fire",     barangay: "Brgy. Libertad",     count: 9  },
  { latlng: [11.5825, 124.4660], type: "Medical",  barangay: "Brgy. Libertad",     count: 7  },
  { latlng: [11.5835, 124.4655], type: "Fire",     barangay: "Brgy. Libertad",     count: 5  },
  // 🚗 Brgy. Calumpang — Accident junction
  { latlng: [11.5842, 124.4732], type: "Accident", barangay: "Brgy. Calumpang",    count: 10 },
  { latlng: [11.5848, 124.4740], type: "Accident", barangay: "Brgy. Calumpang",    count: 7  },
  { latlng: [11.5838, 124.4728], type: "Accident", barangay: "Brgy. Calumpang",    count: 5  },
  // 🏥 Brgy. Larrazabal — Medical secondary
  { latlng: [11.5808, 124.4745], type: "Medical",  barangay: "Brgy. Larrazabal",   count: 6  },
  { latlng: [11.5802, 124.4752], type: "Medical",  barangay: "Brgy. Larrazabal",   count: 4  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function etaLabel(durationSec: number, status: string) {
  if (status === "On Scene") return "Already on scene";
  const mins = Math.round(durationSec / 60);
  const now  = new Date();
  now.setMinutes(now.getMinutes() + mins);
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `~${mins} min · Arrives ${hh}:${mm}`;
}

function buildZoneSummary(points: HeatPoint[]) {
  const map = new Map<string, { total: number; types: Partial<Record<IncidentType, number>>; latlng: [number, number] }>();
  for (const p of points) {
    const existing = map.get(p.barangay);
    if (existing) {
      existing.total += p.count;
      existing.types[p.type] = (existing.types[p.type] ?? 0) + p.count;
    } else {
      map.set(p.barangay, { total: p.count, types: { [p.type]: p.count }, latlng: p.latlng });
    }
  }
  return map;
}

// ── Tile sources ──────────────────────────────────────────────────────────────
// Layer 1 — Satellite imagery (Esri World Imagery)
const SATELLITE_TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SATELLITE_ATTR = "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics";

// Layer 2 — Transparent labels on top (Esri World Boundaries and Places)
// This adds street names, barangay names, and place labels over the satellite photo.
const LABELS_TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

// Fallback — OpenStreetMap (used if Esri tiles fail at high zoom)
const OSM_TILE = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";

// ── Props ─────────────────────────────────────────────────────────────────────
interface RealMapProps {
  role: "resident" | "responder" | "admin";
  onNavigate: (screen: string) => void;
  heatmapActive?: boolean;
  heatFilter?: IncidentType | "All";
}

export default function RealMap({
  role,
  onNavigate,
  heatmapActive = false,
  heatFilter = "All",
}: RealMapProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<any>(null);
  const heatLayerRef   = useRef<any[]>([]);   // heat blobs
  const incidentLayerRef = useRef<any[]>([]);  // markers, routes, stations
  const [mapReady, setMapReady] = useState(false);

  // ── Show / hide incident layer based on heatmapActive ────────────────────
  useEffect(() => {
    incidentLayerRef.current.forEach(layer => {
      if (heatmapActive) {
        layer.remove();
      } else {
        const map = mapRef.current;
        if (map && !map.hasLayer(layer)) layer.addTo(map);
      }
    });
  }, [heatmapActive]);

  // ── Draw / clear heat blobs ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    heatLayerRef.current.forEach(c => c.remove());
    heatLayerRef.current = [];

    if (!heatmapActive) return;

    import("leaflet").then(L => {
      const filtered = heatFilter === "All"
        ? HEAT_DATA
        : HEAT_DATA.filter(p => p.type === heatFilter);

      const maxCount = Math.max(...filtered.map(p => p.count), 1);

      filtered.forEach(point => {
        const cfg       = INCIDENT_TYPE_CONFIG[point.type];
        const intensity = point.count / maxCount;

        // Three concentric rings — outer glow → mid → hot core
        const rings = [
          { r: 160 + intensity * 140, o: 0.08 + intensity * 0.07 },
          { r: 90  + intensity * 80,  o: 0.14 + intensity * 0.12 },
          { r: 40  + intensity * 50,  o: 0.28 + intensity * 0.22 },
        ];

        rings.forEach(ring => {
          const c = (L.circle as any)(point.latlng, {
            radius: ring.r, color: "transparent",
            fillColor: cfg.color, fillOpacity: ring.o,
            interactive: false,
          }).addTo(map);
          heatLayerRef.current.push(c);
        });

        // Transparent click target for popup
        const zoneSummary = buildZoneSummary(
          HEAT_DATA.filter(p => p.barangay === point.barangay)
        ).get(point.barangay);

        const clickCircle = (L.circle as any)(point.latlng, {
          radius: 40 + intensity * 50,
          color: "transparent", fillColor: "transparent", fillOpacity: 0,
          interactive: true,
        }).addTo(map);

        if (zoneSummary) {
          const dominant = Object.entries(zoneSummary.types)
            .sort((a, b) => (b[1] as number) - (a[1] as number))[0];
          const domType = dominant[0] as IncidentType;
          const domCfg  = INCIDENT_TYPE_CONFIG[domType];

          const rows = Object.entries(zoneSummary.types)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .map(([t, c]) => {
              const tc  = INCIDENT_TYPE_CONFIG[t as IncidentType];
              const pct = Math.round(((c as number) / zoneSummary.total) * 100);
              return `<div style="margin-bottom:5px">
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">
                  <span style="font-size:11px">${tc.emoji}</span>
                  <span style="flex:1;font-size:10px;color:#e5e7eb;font-weight:600">${t}</span>
                  <span style="font-size:10px;font-weight:800;color:${tc.color}">${c} reports</span>
                </div>
                <div style="height:4px;background:#374151;border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;background:${tc.color};border-radius:99px"></div>
                </div>
              </div>`;
            }).join("");

          const riskLabel =
            intensity >= 0.8 ? "🔴 Very High Risk" :
            intensity >= 0.6 ? "🟠 High Risk" :
            intensity >= 0.4 ? "🟡 Moderate Risk" : "🟢 Low Risk";

          clickCircle.bindPopup(`
            <div style="font-family:system-ui;min-width:190px;padding:2px;background:#1f2937;border-radius:12px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                <div style="width:38px;height:38px;border-radius:10px;background:${domCfg.color}33;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <span style="font-size:20px">${domCfg.emoji}</span>
                </div>
                <div>
                  <p style="font-size:12px;font-weight:900;color:#f9fafb;margin:0">${point.barangay}</p>
                  <p style="font-size:10px;color:${domCfg.color};font-weight:700;margin:0">${riskLabel}</p>
                </div>
              </div>
              <div style="background:#111827;border-radius:10px;padding:10px;margin-bottom:8px">
                <p style="font-size:9px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px">
                  Breakdown · ${zoneSummary.total} total reports
                </p>
                ${rows}
              </div>
              <p style="font-size:9px;color:#6b7280;margin:0;text-align:center">📊 ResQLink AI · Based on resident reports</p>
            </div>
          `);
        }

        heatLayerRef.current.push(clickCircle);
      });
    });
  }, [heatmapActive, heatFilter, mapReady]);

  // ── Initial map setup ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    if ((containerRef.current as any)._leaflet_id) {
      mapRef.current?.remove();
      mapRef.current = null;
    }

    let cancelled = false;

    import("leaflet").then(async L => {
      if (cancelled || !containerRef.current) return;
      if ((containerRef.current as any)._leaflet_id) return;

      const map = L.map(containerRef.current, {
        center: BILIRAN_CENTER,
        zoom: 15,
        zoomControl: false,    // we'll add it manually on the right
        attributionControl: true,
        maxZoom: 18,
      });
      mapRef.current = map;

      // Zoom control on the right so it doesn't clash with the left legend
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // ── Layer 1: Satellite imagery ──
      L.tileLayer(SATELLITE_TILE, {
        attribution: SATELLITE_ATTR,
        maxZoom: 18,
        maxNativeZoom: 18,
      }).addTo(map);

      // ── Layer 2: Transparent place labels on top ──
      // Adds street names, barangay names, municipality labels over the photo.
      L.tileLayer(LABELS_TILE, {
        attribution: "",
        maxZoom: 18,
        maxNativeZoom: 18,
        opacity: 1,
      }).addTo(map);

      // ── Helper: register a layer as part of the incident group ──
      const addIncident = (layer: any) => {
        incidentLayerRef.current.push(layer);
        layer.addTo(map);
        return layer;
      };

      // ── Incident marker ──
      const incidentIcon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:36px;height:36px">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(211,47,47,0.3);animation:ripple 1.5s infinite"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;background:#D32F2F;border:3px solid white;box-shadow:0 2px 10px rgba(211,47,47,0.7);display:flex;align-items:center;justify-content:center">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      addIncident(
        L.marker(INCIDENT.latlng, { icon: incidentIcon })
          .bindPopup(`
            <div style="font-family:system-ui;min-width:150px;padding:2px">
              <p style="font-size:11px;font-weight:900;color:#D32F2F;margin:0 0 2px">${INCIDENT.type}</p>
              <p style="font-size:10px;color:#888;margin:0 0 8px">${INCIDENT.id} · Brgy. Padre Iñigo</p>
              <button onclick="window.__resqNav('${role === "responder" ? "incident-management" : "incident-detail"}')"
                style="width:100%;background:#D32F2F;color:white;border:none;border-radius:8px;padding:5px;font-size:10px;font-weight:700;cursor:pointer">
                View Details →
              </button>
            </div>
          `)
      );

      // ── Station markers + road routes ──
      for (const station of STATIONS) {
        // Request route with waypoints=true so OSRM returns the snapped
        // road positions — we use those as the actual line start/end points
        // so the polyline is guaranteed to connect to both markers.
        const routeUrl =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${station.latlng[1]},${station.latlng[0]};` +
          `${INCIDENT.latlng[1]},${INCIDENT.latlng[0]}` +
          `?overview=full&geometries=geojson&steps=false`;

        // Default: straight line between the two markers
        let routeCoords: [number, number][] = [station.latlng, INCIDENT.latlng];
        let distKm = 0;
        let durationSec = 0;

        try {
          const res  = await fetch(routeUrl);
          const data = await res.json();
          if (data.code === "Ok" && data.routes?.[0]) {
            const route = data.routes[0];

            // GeoJSON coords are [lon, lat] — flip to Leaflet [lat, lon]
            const snapped: [number, number][] = route.geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]] as [number, number]
            );

            // OSRM snaps waypoints to the nearest road node.
            // Replace the first and last points with the actual marker positions
            // so the line visually starts and ends exactly at the icons.
            snapped[0] = station.latlng;
            snapped[snapped.length - 1] = INCIDENT.latlng;

            routeCoords = snapped;
            distKm      = route.distance / 1000;
            durationSec = route.duration;
          }
        } catch { /* network error — keep straight-line fallback */ }

        const eta = etaLabel(durationSec, station.status);

        addIncident(L.polyline(routeCoords, {
          color: station.color, weight: 5,
          dashArray: station.status === "On Scene" ? undefined : "12 8",
          opacity: 1,
          lineJoin: "round",
          lineCap: "round",
        }));

        // White outline underneath for contrast over satellite imagery
        addIncident(L.polyline(routeCoords, {
          color: "white", weight: 8,
          opacity: 0.25,
          lineJoin: "round",
          lineCap: "round",
          interactive: false,
        }));

        const midIdx   = Math.floor(routeCoords.length / 2);
        const midPoint = routeCoords[midIdx] ?? [
          (station.latlng[0] + INCIDENT.latlng[0]) / 2,
          (station.latlng[1] + INCIDENT.latlng[1]) / 2,
        ];

        addIncident(L.marker(midPoint, {
          icon: L.divIcon({
            className: "",
            html: `<div style="background:rgba(0,0,0,0.75);border:1.5px solid ${station.color};border-radius:8px;padding:3px 8px;font-size:9px;font-weight:700;color:${station.color};white-space:nowrap;backdrop-filter:blur(4px)">
              ${distKm > 0 ? distKm.toFixed(2) + " km · " : ""}${eta}
            </div>`,
            iconAnchor: [60, 10],
          }),
          interactive: false,
        }));

        addIncident(
          L.marker(station.latlng, {
            icon: L.divIcon({
              className: "",
              html: `<div style="width:32px;height:32px;border-radius:10px;background:${station.color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center">
                ${station.svg}
              </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          }).bindPopup(`
            <div style="font-family:system-ui;min-width:160px;padding:2px">
              <p style="font-size:11px;font-weight:900;color:#1a1a1a;margin:0 0 2px">${station.name}</p>
              <p style="font-size:10px;font-weight:700;color:${station.color};margin:0 0 4px">${station.status}</p>
              <p style="font-size:10px;color:#555;margin:0">📍 ${distKm > 0 ? distKm.toFixed(2) + " km" : "Calculating..."}</p>
              <p style="font-size:10px;color:#555;margin:3px 0 0">🕐 ${eta}</p>
            </div>
          `)
        );
      }

      // ── Evacuation centers ──
      EVACUATION_CENTERS.forEach(ec => {
        addIncident(
          L.marker(ec.latlng, {
            icon: L.divIcon({
              className: "",
              html: `<div style="width:28px;height:28px;border-radius:8px;background:#16a34a;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
          }).bindPopup(`<div style="font-family:system-ui;font-size:11px;font-weight:700;padding:2px">${ec.name}<br/><span style="color:#16a34a;font-size:10px">Evacuation Center · Open</span></div>`)
        );
      });

      // ── User location ──
      addIncident(
        L.marker([11.5833, 124.4650], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 5px rgba(59,130,246,0.35)"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        }).bindPopup(`<div style="font-family:system-ui;font-size:11px;font-weight:700;padding:2px">📍 Your Location</div>`)
      );

      (window as any).__resqNav = onNavigate;
      setMapReady(true);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        @keyframes ripple {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        /* Popup */
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
          padding: 4px !important;
          background: #fff !important;
        }
        .leaflet-popup-tip-container { display: none; }
        /* Zoom control — bottom right, dark glass */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.5) !important;
          border-radius: 10px !important;
          overflow: hidden;
          margin-bottom: 12px !important;
          margin-right: 10px !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15,23,42,0.85) !important;
          backdrop-filter: blur(6px) !important;
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          font-size: 18px !important;
          font-weight: 400 !important;
          color: #e2e8f0 !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(30,41,59,0.95) !important;
          color: white !important;
        }
        /* Attribution — tiny and unobtrusive */
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.45) !important;
          color: #64748b !important;
          font-size: 7px !important;
          backdrop-filter: blur(4px);
          border-radius: 4px 0 0 0 !important;
          padding: 2px 5px !important;
        }
        .leaflet-control-attribution a { color: #60a5fa !important; }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
