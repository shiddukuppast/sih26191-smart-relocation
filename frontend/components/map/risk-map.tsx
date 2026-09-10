"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Habitation, SafeSite } from "@/types";
import { MapSkeleton } from "@/components/shared/loading-skeleton";

const DynamicMapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface RiskMapProps {
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

export function RiskMap(props: RiskMapProps) {
  return <DynamicMapInner {...props} />;
}
