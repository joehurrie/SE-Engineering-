"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

type ProjectLocation = {
  id: number;
  projectName: string;
  location: string | null;
  latitude: number;
  longitude: number;
};

type MapInstance = {
  fitBounds: (bounds: BoundsInstance) => void;
};

type BoundsInstance = {
  extend: (position: { lat: number; lng: number }) => void;
};

type GoogleMapsApi = {
  Map: new (
    element: HTMLElement,
    options: {
      center: { lat: number; lng: number };
      zoom: number;
      mapTypeControl: boolean;
      streetViewControl: boolean;
      fullscreenControl: boolean;
    },
  ) => MapInstance;
  Marker: new (options: {
    map: MapInstance;
    position: { lat: number; lng: number };
    title: string;
  }) => unknown;
  LatLngBounds: new () => BoundsInstance;
};

declare global {
  interface Window {
    google?: { maps: GoogleMapsApi };
  }
}

const mapsScriptId = "google-maps-javascript-api";

type GoogleProjectsMapProps = {
  projects: ProjectLocation[];
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export default function GoogleProjectsMap({
  projects,
  title = "Work across the region",
  description = "Explore locations where our commissioned and active projects are making a difference.",
  buttonLabel = "View map",
  buttonHref = "#project-map",
}: GoogleProjectsMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (projects.length === 0 || !apiKey || !mapElementRef.current) return;

    let cancelled = false;
    const initializeMap = () => {
      if (cancelled || !mapElementRef.current || !window.google?.maps) return;

      const maps = window.google.maps;
      const bounds = new maps.LatLngBounds();
      const firstProject = projects[0];
      const map = new maps.Map(mapElementRef.current, {
        center: { lat: firstProject.latitude, lng: firstProject.longitude },
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      projects.forEach((project) => {
        const position = { lat: project.latitude, lng: project.longitude };
        bounds.extend(position);
        new maps.Marker({
          map,
          position,
          title: `${project.projectName}${project.location ? ` — ${project.location}` : ""}`,
        });
      });

      if (projects.length > 1) map.fitBounds(bounds);
    };

    const existingScript = document.getElementById(mapsScriptId) as HTMLScriptElement | null;
    if (window.google?.maps) {
      initializeMap();
    } else if (existingScript) {
      existingScript.addEventListener("load", initializeMap, { once: true });
      existingScript.addEventListener("error", () => setMapError("Google Maps could not be loaded."), { once: true });
    } else {
      const script = document.createElement("script");
      script.id = mapsScriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setMapError("Google Maps could not be loaded.");
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [apiKey, projects]);

  return (
    <section id="project-map" className="w-full border-b border-neutral-200 bg-[#F5F5F3] py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">
              Project locations
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-[#0F0F0F] sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              {description}
            </p>
          </div>
          <Link
            href={buttonHref}
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 transition-colors hover:text-[#2563EB]"
          >
            {buttonLabel} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center border border-neutral-200 bg-white px-6 text-center">
            <MapPin aria-hidden="true" className="h-8 w-8 text-[#2563EB]" />
            <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-600">
              Project markers will appear here when active projects have map coordinates set in the admin.
            </p>
          </div>
        ) : !apiKey ? (
          <div className="flex min-h-64 flex-col items-center justify-center border border-neutral-200 bg-white px-6 text-center">
            <MapPin aria-hidden="true" className="h-8 w-8 text-[#2563EB]" />
            <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-600">
              Add <code className="font-mono text-[#0F0F0F]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to the environment to enable the project map.
            </p>
          </div>
        ) : mapError ? (
          <p role="alert" className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {mapError}
          </p>
        ) : (
          <div
            ref={mapElementRef}
            aria-label="Map showing active project locations"
            role="region"
            className="min-h-[360px] w-full border border-neutral-200 bg-neutral-100 md:h-[520px]"
          />
        )}
      </div>
    </section>
  );
}
