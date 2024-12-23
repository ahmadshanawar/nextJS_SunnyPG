import Camera from "../../../public/images/camera.png";
import Furniture from "../../../public/images/furniture.png";
import Power from "../../../public/images/power.png";
import Security from "../../../public/images/security.png";
import Washroom from "../../../public/images/washroom.png";
import Water from "../../../public/images/water.png";
import Wifi from "../../../public/images/wifi.png";
import Image from "next/image";

export const featuresData = [
  {
    title: "Attached Washrooms",
    subtext: "Private and hygienic restrooms for comfort.",
    image: <Image src={Washroom} alt="CCTV Camera" className="w-full h-full" />,
  },
  {
    title: "Lodging Furniture",
    subtext: "Comfortable and modern living arrangements.",
    image: <Image src={Furniture} alt="CCTV Camera" className="w-full h-full" />,
  },
  {
    title: "CCTV Camera",
    subtext: "24/7 surveillance for your safety.",
    image: <Image src={Camera} alt="CCTV Camera" className="w-full h-full" />,
  },
  {
    title: "Power Backup",
    subtext: "Uninterrupted power supply with heavy inverter.",
    image: <Image src={Power} alt="CCTV Camera" className="w-full h-full" />,
  },
  {
    title: "Wi-Fi Up to 40 Mbps",
    subtext: "High-speed internet for seamless connectivity.",
    image: <Image src={Wifi} alt="CCTV Camera" className="w-full h-full" />,
  },
  {
    title: "RO Water Cooler Purifier",
    subtext: "Pure and safe drinking water, always!",
    image: <Image src={Water} alt="CCTV Camera" className="w-full h-full" />,
  },
  {
    title: "27x7 Manned Security",
    subtext:
      "A person will be available for safty security and any help required at all times.",
    image: <Image src={Security} alt="CCTV Camera" className="w-full h-full" />,
  },
];
