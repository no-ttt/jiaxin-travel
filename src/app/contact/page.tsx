"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ContactForm from "@/components/contact/ContactForm";
import { toTripDetail } from "@/components/trip-detail/fromApi";
import { usePublicTrip } from "@/lib/api/hooks/useTrips";

function ContactPageContent() {
  const searchParams = useSearchParams();
  // tripId is the trip code passed by the detail page's 立即洽詢 button.
  const tripId = searchParams.get("tripId");
  const { data } = usePublicTrip(tripId);
  const trip = data ? toTripDetail(data) : null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <ContactForm trip={trip} />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}
