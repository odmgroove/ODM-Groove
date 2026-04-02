"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import RoomsSection from "./components/RoomsSection";
import AmenitiesSection from "./components/AmenitiesSection";
import EventsSection from "./components/EventsSection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import BookingCTASection from "./components/BookingCTASection";
import Footer from "./components/Footer";
import AIChatWidget from "./components/AIChatWidget";
import BookingModal from "./components/BookingModal";
import EventAnnouncementModal from "./components/EventAnnouncementModal";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRoomType, setBookingRoomType] = useState("standard");

  useEffect(() => {
    const handleOpenBooking = (e: any) => {
      setBookingRoomType(e.detail || "standard");
      setIsBookingModalOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("open-booking-modal", handleOpenBooking);
    return () => window.removeEventListener("open-booking-modal", handleOpenBooking);
  }, []);

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <main className="min-h-screen selection:bg-[var(--gold)] selection:text-[var(--black)]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <HeroSection />
      <AboutSection />
      <RoomsSection />
      <AmenitiesSection />
      <EventsSection />
      <GallerySection />
      <TestimonialsSection />
      <FAQSection />
      <BookingCTASection />

      {/* Footer */}
      <Footer />

      {/* Event Announcement Modal — auto-shows for active upcoming events */}
      <EventAnnouncementModal />

      {/* Floating Elements (Client Components) */}
      <AIChatWidget />
      
      {/* Booking Modal Overlay */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={closeBookingModal} 
        defaultRoom={bookingRoomType} 
      />
    </main>
  );
}
