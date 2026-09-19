"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ContactForm from "@/components/contact/ContactForm";
import { getTripDetail } from "@/components/trip-detail/data";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const trip = tripId ? getTripDetail(tripId) : null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAFA]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} />

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
