export type Category = "Residential" | "Religious" | "Commercial" | "Interior";

export interface Project {
  slug: string;
  title: string;
  location: string;
  year: number;
  category: Category;
  cover: string;
}

export const projects: Project[] = [
  {
    slug: "av-villa",
    title: "AV Villa",
    location: "South India",
    year: 2025,
    category: "Residential",
    cover: "/work/av-villa.jpg",
  },
  {
    slug: "asan-hussain",
    title: "Asan Hussain Residence",
    location: "South India",
    year: 2023,
    category: "Residential",
    cover: "/work/asan-hussain.jpg",
  },
  {
    slug: "masjid-al-umar",
    title: "Masjid al-Umar",
    location: "South India",
    year: 2024,
    category: "Religious",
    cover: "/work/masjid-al-umar.jpg",
  },
  {
    slug: "kmh-food-court",
    title: "KMH Food Court",
    location: "South India",
    year: 2024,
    category: "Commercial",
    cover: "/work/kmh-food-court.jpg",
  },
  {
    slug: "bloom-apartment",
    title: "Bloom Apartment",
    location: "South India",
    year: 2024,
    category: "Residential",
    cover: "/work/bloom-apartment.jpg",
  },
  {
    slug: "ideal-landmark",
    title: "Ideal Landmark",
    location: "South India",
    year: 2024,
    category: "Commercial",
    cover: "/work/ideal-landmark.jpg",
  },
  {
    slug: "masjid-al-muhammadiyah",
    title: "Masjid al-Muhammadiyah",
    location: "South India",
    year: 2024,
    category: "Religious",
    cover: "/work/masjid-al-muhammadiyah.jpg",
  },
  {
    slug: "pet-hospital",
    title: "Pet Hospital",
    location: "South India",
    year: 2023,
    category: "Commercial",
    cover: "/work/pet-hospital.jpg",
  },
  {
    slug: "nowshath-ali",
    title: "Nowshath Ali Interiors",
    location: "South India",
    year: 2024,
    category: "Interior",
    cover: "/work/nowshath-ali.jpg",
  },
  {
    slug: "tanjore-priya",
    title: "Tanjore Priya Residence",
    location: "Thanjavur",
    year: 2024,
    category: "Residential",
    cover: "/work/tanjore-priya.jpg",
  },
  {
    slug: "shah-engineering",
    title: "Shah Engineering Office",
    location: "South India",
    year: 2024,
    category: "Commercial",
    cover: "/work/shah-engineering.jpg",
  },
  {
    slug: "jummah-masjid",
    title: "Jummah Masjid",
    location: "South India",
    year: 2024,
    category: "Religious",
    cover: "/work/jummah-masjid.jpg",
  },
];
