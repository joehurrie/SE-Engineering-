export type NewsArticleContent = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  category: string;
  img: string;
  featured: boolean;
};

export const defaultArticles: NewsArticleContent[] = [
  {
    slug: "talanta-hela-stadium-escalators",
    title: "Specialized Engineering Completes Talanta Hela Stadium Escalator Installation",
    excerpt:
      "Our team successfully installed and commissioned 10 heavy-duty escalators and moving walks at Talanta Hela Stadium, a landmark East African venue.",
    content: `A major public venue needs to move thousands of people safely and comfortably. Specialized Engineering has completed the installation and commissioning of ten heavy-duty escalators and moving walks at Talanta Hela Stadium.\n\nThe work included coordinating equipment delivery, installation, testing and handover. Each system was checked before commissioning to support reliable operation under busy event conditions.\n\nThe project reflects our team's experience in large-scale vertical transportation, from planning and installation through to ongoing service and maintenance.\n\nWe thank the project partners and site teams whose close coordination helped bring this installation to completion.`,
    publishedAt: "2023-11-15",
    category: "Project Update",
    img: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=1200",
    featured: true,
  },
  {
    slug: "xizi-partnership-expansion",
    title: "SE Kenya Strengthens XIZI Exclusive Supply Partnership Across East Africa",
    excerpt:
      "We are proud to announce an expanded exclusive supply agreement with international manufacturer XIZI, introducing smart regenerative traction drives to Nairobi.",
    content: `Specialized Engineering Kenya has expanded its exclusive supply partnership with XIZI, strengthening access to elevator systems and components for customers across East Africa.\n\nThe partnership brings a wider range of modern lift technologies to local projects, including energy-conscious drive systems. It also supports closer collaboration on technical selection, installation and after-sales service.\n\nFor building owners and project teams, working with a trusted manufacturing partner means clearer product support throughout the life of a lift—from specification and delivery to maintenance.\n\nWe look forward to supporting more projects in Kenya and the region through this continued relationship.`,
    publishedAt: "2023-09-08",
    category: "Corporate Partnership",
    img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  },
  {
    slug: "200-elevators-milestone",
    title: "Celebrating 200+ Operational Elevator Installations Across Kenya",
    excerpt:
      "A landmark achievement for our engineering corps as we crossed the 200 installation milestone, reflecting 8+ years of developer trust and safety excellence.",
    content: `We are proud to mark more than 200 elevator installations now operating across Kenya. Each installation represents a close partnership with a customer, careful engineering and the work of our installation and service teams.\n\nFrom residential buildings to commercial developments, every site brings its own requirements. Our teams work with clients to understand those needs, plan suitable systems and support each installation through commissioning.\n\nReaching this milestone is an opportunity to thank the building owners, consultants, contractors and colleagues who have trusted us with their projects.\n\nWe remain focused on dependable service throughout the life of every system we install.`,
    publishedAt: "2024-03-20",
    category: "Corporate Milestone",
    img: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=1200",
    featured: true,
  },
  {
    slug: "hospital-elevator-standards",
    title: "Medical-Grade Elevator Standards & Bed Transit Requirements in Kenya",
    excerpt:
      "A technical appraisal of the rigorous micro-leveling precision and emergency priority dispatch needed for modern healthcare facilities.",
    content: `Elevators in healthcare facilities must support the daily movement of patients, staff, beds and equipment. The right system begins with understanding how the building operates and how different departments use its lifts.\n\nCabin size, door clearances, smooth stopping and dependable operation all matter when moving beds and medical equipment. Emergency operating requirements and service planning should also be considered early in the project.\n\nWorking closely with healthcare teams, architects and contractors helps ensure the lift is suited to the building's real needs. A well-planned system can make essential journeys easier while supporting safe, reliable operation.\n\nOur engineering team can help assess requirements for new healthcare lifts and upgrades to existing systems.`,
    publishedAt: "2024-01-12",
    category: "Engineering Insight",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  },
  {
    slug: "elevator-modernization-benefits",
    title: "5 Key Indicators That Your Commercial Tower Elevator Requires Modernization",
    excerpt:
      "Discover how controller retrofits and VVVF drive modernizations reduce energy bills by up to 35% while virtually eliminating erratic floor stoppages.",
    content: `An older lift does not always need full replacement. Modernization can address recurring problems and make an existing system safer, more comfortable and more efficient.\n\nConsider an assessment if passengers are experiencing frequent breakdowns, long waits, rough starts or stops, or if spare parts are becoming difficult to source. Outdated controls, rising energy use and worn cabin interiors can also signal that an upgrade may be worthwhile.\n\nA modernization plan should start with an inspection of the equipment, the building's traffic needs and the condition of the lift shaft and cabin. The right scope may include new controls, drive equipment, door components or an interior refresh.\n\nA qualified lift team can explain the options, expected disruption and likely benefits before work begins.`,
    publishedAt: "2023-07-25",
    category: "Preventative Maintenance",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  },
];
