import type { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Menu & Order | ODM Groove Hotel",
  description:
    "Browse our full menu — kitchen, bar, VIP bottle service, shisha, cocktails and more. Order directly and we'll serve you fresh at ODM Groove Hotel & Event Hall, Ijoko, Ogun State.",
  openGraph: {
    title: "Menu & Order | ODM Groove Hotel",
    description: "Food, drinks, VIP service and more — order directly from ODM Groove Hotel.",
    images: ["/odm-groove-hotel-exterior-daytime.jpg"],
  },
};

export default function MenuPage() {
  return <MenuClient />;
}
