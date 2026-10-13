export type ProjectData = {
  id: number;
  projectName: string;
  category: string;
  projectType: string;
  description: string;
  elevatorCount: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  img: string;
  galleryImages: string[];
  featured: boolean;
  year?: string;
  status: string;
};

export const defaultProjects: ProjectData[] = [
  {
    id: 1,
    projectName: "Alina Harbor Apartment",
    category: "Residential",
    projectType: "Luxury Multi-Family Residential Towers",
    description: "A residential vertical transportation installation designed for dependable daily service across a multi-tower development.",
    elevatorCount: 12,
    location: "Kilimani, Nairobi",
    latitude: null,
    longitude: null,
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    galleryImages: [],
    featured: true,
    year: "2023",
    status: "ACTIVE",
  },
  {
    id: 2,
    projectName: "Apple Tree Apartments",
    category: "Commercial",
    projectType: "Commercial & Residential High-Rise",
    description: "Passenger elevator systems serving a high-rise development with a focus on smooth, reliable movement.",
    elevatorCount: 8,
    location: "Westlands, Nairobi",
    latitude: null,
    longitude: null,
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    galleryImages: [],
    featured: true,
    year: "2022",
    status: "COMMISSIONED",
  },
  {
    id: 3,
    projectName: "Urban Oasis Towers",
    category: "Commercial",
    projectType: "Mixed High-Speed Elevator & Escalator Systems",
    description: "A mixed-use tower installation combining high-speed passenger lifts and escalator systems.",
    elevatorCount: 6,
    location: "Upper Hill, Nairobi",
    latitude: null,
    longitude: null,
    img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200",
    galleryImages: [],
    featured: true,
    year: "2023",
    status: "ACTIVE",
  },
  {
    id: 4,
    projectName: "Zuri Villas Gated Community",
    category: "Residential",
    projectType: "Private Residential Glass Home Lifts",
    description: "Bespoke home lift solutions integrated into a private residential community.",
    elevatorCount: 4,
    location: "Karen, Nairobi",
    latitude: null,
    longitude: null,
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
    galleryImages: [],
    featured: false,
    year: "2021",
    status: "COMMISSIONED",
  },
  {
    id: 5,
    projectName: "Talanta Hela Complex",
    category: "Public / Transit",
    projectType: "Heavy-Duty Public Transit Escalator Installation",
    description: "Heavy-duty escalator installation built to support the flow and reliability needs of a public venue.",
    elevatorCount: 10,
    location: "Nairobi CBD",
    latitude: null,
    longitude: null,
    img: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=1200",
    galleryImages: [],
    featured: true,
    year: "2024",
    status: "ACTIVE",
  },
  {
    id: 6,
    projectName: "Greenpark Executive Offices",
    category: "Commercial",
    projectType: "Commercial Passenger Elevator Installation & Maintenance",
    description: "Passenger elevator installation and ongoing maintenance for a commercial office development.",
    elevatorCount: 16,
    location: "Thika Road Corridor",
    latitude: null,
    longitude: null,
    img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=1200",
    galleryImages: [],
    featured: false,
    year: "2024",
    status: "COMMISSIONED",
  },
];
