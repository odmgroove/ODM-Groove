"use client";

import { useState, useEffect } from "react";
import AIChatWidget from "./AIChatWidget";
import BookingModal from "./BookingModal";
import HallEnquiryModal from "./HallEnquiryModal";
import EventAnnouncementModal from "./EventAnnouncementModal";

export default function HomeClientOverlays() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRoomType, setBookingRoomType] = useState("standard");
  const [isHallEnquiryModalOpen, setIsHallEnquiryModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setBookingRoomType(customEvent.detail || "standard");
      setIsBookingModalOpen(true);
      document.body.style.overflow = "hidden";
    };

    const handleOpenHallEnquiry = () => {
      setIsHallEnquiryModalOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("open-booking-modal", handleOpenBooking);
    window.addEventListener("open-hall-enquiry-modal", handleOpenHallEnquiry);

    return () => {
      window.removeEventListener("open-booking-modal", handleOpenBooking);
      window.removeEventListener("open-hall-enquiry-modal", handleOpenHallEnquiry);
    };
  }, []);

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <EventAnnouncementModal />
      <AIChatWidget />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        defaultRoom={bookingRoomType}
      />
      <HallEnquiryModal
        isOpen={isHallEnquiryModalOpen}
        onClose={() => {
          setIsHallEnquiryModalOpen(false);
          document.body.style.overflow = "auto";
        }}
      />
    </>
  );
}

