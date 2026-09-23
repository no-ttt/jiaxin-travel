"use client";

import { use } from "react";
import TripEditor from "@/components/admin/trips/TripEditor";

export default function AdminTripEditorPage({ params }: PageProps<"/admin/dashboard/trips/[id]">) {
  const { id } = use(params);
  return <TripEditor tripId={id} />;
}
