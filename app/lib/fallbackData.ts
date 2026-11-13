const STD_DESC =
  "Our Standard Room offers all the comfort you need for a perfect stay — tastefully furnished with a plush bed, air conditioning, and smart TV. Wake up to a complimentary breakfast and enjoy seamless connectivity throughout your visit.";
const STD_FEATURES =
  "Free Daily Breakfast, High-Speed WiFi, Netflix & DSTV, Comfortable Bed, Air Conditioning, En-suite Bathroom, 24/7 Power Supply, Premium Toiletries, Wardrobe & Storage, Room Service";

const DLX_DESC =
  "Experience elevated luxury in our Deluxe Room — all the Standard benefits plus exclusive access to our stunning outdoor swimming pool. More space, premium toiletries, and a truly indulgent ambience perfect for that special staycation.";
const DLX_FEATURES =
  "Free Daily Breakfast, High-Speed WiFi, Netflix & DSTV, Pool Access Included, Spacious Layout, Swimming Pool Access, Air Conditioning, En-suite Bathroom, 24/7 Power Supply, Premium Toiletries, Wardrobe & Storage, Room Service";

export const FALLBACK_ROOMS = [
  { id: "cedar", name: "Cedar Room", price: 30000, capacity: 2, description: STD_DESC, features: STD_FEATURES, image: "/Room/odm-groove-hotel-room-30k-1.jpg", available: true },
  { id: "rosewood", name: "Rosewood Room", price: 30000, capacity: 2, description: STD_DESC, features: STD_FEATURES, image: "/Room/odm-groove-hotel-room-30k-1.jpg", available: true },
  { id: "marple", name: "Marple Room", price: 40000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-40k-1.jpg", available: true },
  { id: "cherry", name: "Cherry Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-50k-1.jpg", available: true },
  { id: "basswood", name: "Basswood Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-50k-1.jpg", available: true },
  { id: "pine", name: "Pine Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-50k-1.jpg", available: true },
  { id: "oak", name: "Oak Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-50k-1.jpg", available: true },
  { id: "walnut", name: "Walnut Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-50k-1.jpg", available: true },
  { id: "redwood", name: "Redwood Room", price: 50000, capacity: 2, description: DLX_DESC, features: DLX_FEATURES, image: "/Room/odm-groove-hotel-room-50k-1.jpg", available: true },
];

export const FALLBACK_FAQS = [
  { id: "faq-1", question: "Where is ODM Groove Hotel located?", answer: "We are located at Shonekan Street, Ola-Oparun, After Aboki Ifa Villa in Ijoko Ogbayo, Ogun State. Highly accessible, just a short drive from Lagos.", order: 0 },
  { id: "faq-2", question: "What are your check-in and check-out times?", answer: "Standard check-in time is from 2:00 PM, and check-out is at 12:00 PM (Noon). Early check-in or late check-out can be arranged subject to availability.", order: 1 },
  { id: "faq-3", question: "What is included in the room price?", answer: "Both our Standard (₦30,000) and Deluxe (₦50,000) rooms include free daily breakfast, high-speed WiFi, air conditioning, and a smart TV with Netflix & DSTV. Deluxe rooms also include free access to the swimming pool.", order: 2 },
  { id: "faq-4", question: "What is the capacity of the Event Hall?", answer: "Our versatile Event Hall can comfortably accommodate upwards of 200 guests, making it perfect for weddings, corporate seminars, birthday parties, and other grand celebrations.", order: 3 },
  { id: "faq-5", question: "Do you offer parking and security?", answer: "Yes, we provide ample free on-site parking for all our guests. The premises are heavily secured with 24/7 security personnel and surveillance systems.", order: 4 },
  { id: "faq-6", question: "How can I book a room or the event hall?", answer: "You can book directly by clicking any of the 'Book Now' buttons on this website, which will connect you to our reservations team via WhatsApp or Phone.", order: 5 },
];

