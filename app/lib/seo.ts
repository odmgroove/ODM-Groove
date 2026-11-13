export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://odmgroove.vercel.app";

export const BUSINESS_INFO = {
  name: "ODM Groove Hotel & Event Hall",
  legalName: "ODM Groove Limited",
  rcNumber: "RC-7450366",
  description:
    "ODM Groove Limited is a premium boutique hotel, lodge, nightclub, and 200+ guest event hall in Ijoko Ogbayo (Ogba-Ayo), near Aboki-Ifa in Ifo LGA, Ogun State, Nigeria. Rooms from ₦30,000/night with free breakfast, WiFi, Netflix, DSTV, swimming pool, outdoor bar, and rooftop lounge.",
  phone: "+2347061514120",
  phoneDisplay: "+234 706 151 4120",
  email: "odmgroove@gmail.com",
  streetAddress: "Shonekan Street, Ola-Oparun, After Aboki Ifa Villa",
  locality: "Ijoko Ogbayo",
  region: "Ogun State",
  country: "NG",
  geo: {
    latitude: 6.8086802,
    longitude: 3.2651657,
  },
  mapsUrl:
    "https://www.google.com/maps/place/ODM+Groove/@6.8086802,3.2651657,16z",
  instagramUrl: "https://www.instagram.com/odm.groove",
  checkinTime: "14:00",
  checkoutTime: "12:00",
};

export type RoomSchemaInput = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
};

export function getRoomsOfferJsonLd(rooms: RoomSchemaInput[]) {
  if (rooms.length === 0) return null;
  const hotelId = `${SITE_URL}/#hotel`;

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "ODM Groove Hotel Rooms & Suites",
    url: `${SITE_URL}/#rooms`,
    itemListElement: rooms.map((room, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: room.name,
      price: room.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#rooms`,
      seller: { "@id": hotelId },
      itemOffered: {
        "@type": "HotelRoom",
        name: room.name,
        description: room.description,
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: room.capacity,
        },
      },
    })),
  };
}
export function getLandingJsonLd(rooms: RoomSchemaInput[] = []) {
  const hotelId = `${SITE_URL}/#hotel`;
  const websiteId = `${SITE_URL}/#website`;
  const venueId = `${SITE_URL}/#event-venue`;

  const hotelNode: Record<string, unknown> = {
    "@type": ["Hotel", "LocalBusiness"],
    "@id": hotelId,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.legalName,
    legalName: BUSINESS_INFO.legalName,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    image: [
      `${SITE_URL}/odm-groove-hotel-exterior-daytime.jpg`,
      `${SITE_URL}/odm-groove-hotel-front-view.jpg`,
      `${SITE_URL}/Room/odm-groove-hotel-room-30k-1.jpg`,
      `${SITE_URL}/Hall/odm-groove-event-hall-interior-view-1.jpg`,
    ],
    description: BUSINESS_INFO.description,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    hasMap: BUSINESS_INFO.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.streetAddress,
      addressLocality: BUSINESS_INFO.locality,
      addressRegion: BUSINESS_INFO.region,
      addressCountry: BUSINESS_INFO.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    priceRange: "₦30,000 - ₦50,000",
    currenciesAccepted: "NGN",
    paymentAccepted: "Cash, Bank Transfer, POS",
    checkinTime: BUSINESS_INFO.checkinTime,
    checkoutTime: BUSINESS_INFO.checkoutTime,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Swimming Pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Breakfast", value: true },
      { "@type": "LocationFeatureSpecification", name: "Netflix", value: true },
      { "@type": "LocationFeatureSpecification", name: "DSTV", value: true },
      { "@type": "LocationFeatureSpecification", name: "Event Hall", value: true },
      { "@type": "LocationFeatureSpecification", name: "Outdoor Bar", value: true },
      { "@type": "LocationFeatureSpecification", name: "Rooftop Lounge", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 Security", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free On-Site Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Snooker", value: true },
      { "@type": "LocationFeatureSpecification", name: "Nightclub", value: true },
      { "@type": "LocationFeatureSpecification", name: "VIP Lounge", value: true },
    ],
    areaServed: [
      { "@type": "Place", name: "Ijoko" },
      { "@type": "Place", name: "Ijoko Ogbayo" },
      { "@type": "Place", name: "Ogba-Ayo" },
      { "@type": "Place", name: "Aboki-Ifa" },
      { "@type": "Place", name: "Ifo, Ogun State" },
      { "@type": "Place", name: "Ogun State" },
      { "@type": "Place", name: "Sango Ota" },
      { "@type": "Place", name: "Agbado" },
    ],
    numberOfRooms: rooms.length > 0 ? rooms.length : 9,
    starRating: { "@type": "Rating", ratingValue: "4" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "124",
      bestRating: "5",
      worstRating: "1",
    },
    foundingDate: "2024",
    sameAs: [BUSINESS_INFO.instagramUrl],
    containsPlace: { "@id": venueId },
  };

  if (rooms.length > 0) {
    hotelNode.makesOffer = rooms.map((room) => ({
      "@type": "Offer",
      name: room.name,
      price: room.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#rooms`,
      itemOffered: {
        "@type": "HotelRoom",
        name: room.name,
        description: room.description,
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: room.capacity,
        },
      },
    }));
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${SITE_URL}/`,
        name: BUSINESS_INFO.name,
        publisher: { "@id": hotelId },
        inLanguage: "en-NG",
      },
      hotelNode,
      {
        "@type": "EventVenue",
        "@id": venueId,
        name: "ODM Groove Event Hall",
        description:
          "Versatile 200+ guest capacity event hall in Ijoko Ogbayo, Ogun State for weddings, corporate seminars, and celebrations.",
        url: `${SITE_URL}/#events`,
        maximumAttendeeCapacity: 200,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS_INFO.streetAddress,
          addressLocality: BUSINESS_INFO.locality,
          addressRegion: BUSINESS_INFO.region,
          addressCountry: BUSINESS_INFO.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS_INFO.geo.latitude,
          longitude: BUSINESS_INFO.geo.longitude,
        },
      },
    ],
  };
}
