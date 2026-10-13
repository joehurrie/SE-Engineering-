import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for Specialized Engineering...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (
    !adminEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail) ||
    adminEmail.endsWith("@example.com") ||
    !adminPassword ||
    adminPassword.length < 16 ||
    /replace-with|change-me|example|placeholder/i.test(adminPassword)
  ) {
    throw new Error("Set a real ADMIN_EMAIL and unique ADMIN_PASSWORD of at least 16 characters before seeding.");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: "SE Super Admin",
      role: "SUPER_ADMIN",
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "SE Super Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed SiteContent
  const contentItems = [
    {
      sectionKey: "home_hero",
      title: "Vertical Transportation Engineered for Excellence",
      subtitle: "Kenya's Premier Elevator & Lift Engineering Partner Since 2016",
      bodyText: "Specialized Engineering Kenya Ltd. delivers world-class elevator design, installation, modernization, and 24/7 preventative maintenance across commercial, residential, and industrial developments in East Africa.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1800&q=80",
    },
    {
      sectionKey: "about_intro",
      title: "Pioneering Lift Engineering in East Africa",
      subtitle: "Over 200+ Elevators Installed Across Nairobi and Beyond",
      bodyText: "Established in 2016 in Kilimani, Nairobi, Specialized Engineering Kenya Ltd. has grown to become the Top-1 elevator solutions partner for leading commercial developers, architects, and institutions. Our elite engineering team comprises over 30 certified professionals including seasoned technical specialists.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    },
    {
      sectionKey: "contact_info",
      title: "Contact Specialized Engineering Kenya Ltd.",
      subtitle: "Headquartered in Kilimani, Nairobi, Kenya",
      bodyText: "Alan: +254 (0)116 000100 | Ana: +254 (0)713 104907 | Email: specializedengineeringltd@gmail.com | Office: Kilimani Business Hub, Nairobi, Kenya.",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { sectionKey: item.sectionKey },
      update: item,
      create: item,
    });
  }
  console.log(`✅ SiteContent seeded (${contentItems.length} sections)`);

  // 3. Seed Elevator Products (8 SRS Categories)
  const elevatorProducts = [
    {
      category: "Home Lift",
      title: "Prestige Villa & Residential Home Lift",
      description: "Quiet, gearless compact residential elevator with custom glass or luxury timber cabin finishes, requiring minimal pit depth and overhead space.",
      specifications: JSON.stringify({
        capacity: "320kg - 450kg (3-5 Passengers)",
        speed: "0.4m/s - 1.0m/s",
        drive: "Gearless PMSM / MRL Traction",
        pitDepth: "300mm minimum",
        overhead: "2600mm",
      }),
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      category: "Passenger Elevator",
      title: "Commercial High-Rise Passenger Elevator",
      description: "High-capacity, smooth-ride passenger lifts engineered for commercial towers, hotels, and luxury multi-family developments with intelligent group dispatching.",
      specifications: JSON.stringify({
        capacity: "630kg - 1600kg (8-21 Passengers)",
        speed: "1.0m/s - 4.0m/s",
        drive: "Permanent Magnet Synchronous Machine (PMSM)",
        control: "Microprocessor VVVF Full Collective Group Control",
      }),
      imageUrl: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      category: "Escalator & Moving Walk",
      title: "Commercial Escalators & Horizontal Moving Walks",
      description: "Heavy-duty transit and retail escalators built with ultra-wear resistant steps, energy-saving radar sensors, and multi-tier emergency braking systems.",
      specifications: JSON.stringify({
        inclination: "30° or 35°",
        stepWidth: "800mm / 1000mm",
        ratedSpeed: "0.5m/s (Frequency inverter option)",
        trafficCapacity: "6,000 - 9,000 persons/hour",
      }),
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      category: "Panoramic Elevator",
      title: "Scenic Curved Glass Panoramic Elevator",
      description: "Architectural observation lift with laminated safety curved glass walls, circular or diamond car profile, offering 180° to 360° exterior city and atrium views.",
      specifications: JSON.stringify({
        capacity: "800kg - 1350kg (10-18 Passengers)",
        speed: "1.0m/s - 2.5m/s",
        carStyle: "Curved Glass / Hexagonal / Diamond",
        illumination: "Ambient LED Concealed Lighting",
      }),
      imageUrl: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      category: "Hospital Elevator",
      title: "Medical Stretcher & Bed Hospital Elevator",
      description: "Spacious, micro-leveling precision elevators designed specifically for medical facilities, hospital beds, delicate equipment, and intensive care transport.",
      specifications: JSON.stringify({
        capacity: "1600kg - 2500kg",
        speed: "1.0m/s - 2.0m/s",
        doorClearance: "1200mm - 1500mm Telescopic / Center Open",
        features: "Antibacterial finishes, Priority Medical Emergency Dispatch",
      }),
      imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
    {
      category: "Freight Elevator & Car Elevator",
      title: "Heavy Cargo & Automobile Transport Elevator",
      description: "Reinforced industrial-strength lifts with heavy diamond-plate flooring, anti-collision side bumpers, and double-side opening options for car parking towers.",
      specifications: JSON.stringify({
        capacity: "1000kg - 5000kg (Up to 10,000kg custom)",
        speed: "0.25m/s - 1.0m/s",
        flooring: "Reinforced Checkered Steel Plate",
        control: "PLC Industrial Solid-State Logic",
      }),
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
    {
      category: "Dumbwaiter",
      title: "Commercial & Hospitality Service Dumbwaiter",
      description: "Stainless steel grade 304 food and service dumbwaiters for restaurants, hotels, banks, and healthcare facilities with heating and multi-shelf configurations.",
      specifications: JSON.stringify({
        capacity: "100kg - 300kg",
        speed: "0.4m/s",
        material: "Food-Grade Stainless Steel SUS304",
        doors: "Bi-parting Vertical Sliding Shutter",
      }),
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
    {
      category: "Hydraulic Platform",
      title: "Scissor & Guide-Rail Hydraulic Cargo Platform",
      description: "Robust hydraulic loading dock lifts and wheelchair accessible vertical platforms featuring zero-overrun safety valves and overload sensors.",
      specifications: JSON.stringify({
        capacity: "500kg - 3000kg",
        travelHeight: "Up to 12 meters",
        power: "3-Phase 380V Hydraulic Power Unit",
        safety: "Explosion-proof hydraulic lock valve",
      }),
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
  ];

  // Clear and seed elevator products
  await prisma.elevatorProduct.deleteMany();
  for (const prod of elevatorProducts) {
    await prisma.elevatorProduct.create({ data: prod });
  }
  console.log(`✅ Elevator products seeded (${elevatorProducts.length} categories)`);

  // 4. Seed Lift Services (3 SRS Categories)
  const liftServices = [
    {
      category: "Spare Parts",
      title: "OEM Lift Components & Global Spare Parts Supply",
      description: "Complete inventory of authentic, factory-certified traction machines, door operators, inverter drives, safety gears, wire ropes, and electronic PC boards with expedited delivery across Kenya.",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
    },
    {
      category: "Lift Modernization",
      title: "Full Overhaul & Energy-Efficient Modernization",
      description: "Transform aging, high-energy-consuming elevator units into modern, whisper-quiet, and energy-saving systems with regenerative drives, state-of-the-art cabin aesthetics, and IoT diagnostics.",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    },
    {
      category: "Solution Customization",
      title: "Bespoke Engineering & Custom Architectural Design",
      description: "Custom shafts, non-standard cabin dimensions, curved glass observation panoramic elevators, and specialized industrial freight lift designs tailored to unique architectural requirements.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  await prisma.liftService.deleteMany();
  for (const srv of liftServices) {
    await prisma.liftService.create({ data: srv });
  }
  console.log(`✅ Lift services seeded (${liftServices.length} categories)`);

  // 5. Seed Projects (including SRS reference projects)
  const projects = [
    {
      projectName: "Alina Harbor Apartment",
      projectType: "Luxury Multi-Family Residential",
      elevatorCount: 4,
      location: "Kilimani, Nairobi",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      projectName: "Apple Tree Apartments",
      projectType: "Modern High-Rise Development",
      elevatorCount: 6,
      location: "Westlands, Nairobi",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      projectName: "Urban Oasis Towers",
      projectType: "Mixed-Use Commercial & Residential",
      elevatorCount: 8,
      location: "Kileleshwa, Nairobi",
      imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      projectName: "Zuri Villas Gated Community",
      projectType: "Exclusive Residential Private Villas",
      elevatorCount: 5,
      location: "Karen, Nairobi",
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      projectName: "Emerald Peak Commercial Center",
      projectType: "Grade-A Corporate Headquarters",
      elevatorCount: 6,
      location: "Upper Hill, Nairobi",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
  ];

  await prisma.project.deleteMany();
  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log(`✅ Projects seeded (${projects.length} portfolio items)`);

  // 6. Seed News Articles
  const newsArticles = [
    {
      title: "Specialized Engineering Celebrates 200+ Elevator Installations Milestone",
      slug: "se-celebrates-200-installations-milestone",
      content: "Since its establishment in Kilimani, Nairobi in 2016, Specialized Engineering Kenya Ltd. has rapidly ascended as the top-tier vertical transportation provider in the East African region. Crossing the 200-lift installation milestone underscores the engineering integrity and client trust forged over nearly a decade.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Energy Efficiency: Introducing Regenerative Drive Elevators to Kenya",
      slug: "introducing-regenerative-drive-elevators-kenya",
      content: "As green building standards gain momentum in Nairobi, Specialized Engineering is leading the transition toward regenerative PMSM traction systems that return up to 35% of power back into the building grid during braking phases.",
      imageUrl: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "24/7 Rapid Response: Elevating Preventative Maintenance in Commercial Towers",
      slug: "24-7-rapid-response-preventative-maintenance",
      content: "Uptime is critical for high-traffic buildings. SE announces an expanded fleet of dedicated technical response teams stationed across Kilimani, Westlands, and Upper Hill to ensure round-the-clock emergency assistance and automated periodic maintenance.",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  await prisma.newsArticle.deleteMany();
  for (const article of newsArticles) {
    await prisma.newsArticle.create({ data: article });
  }
  console.log(`✅ News articles seeded (${newsArticles.length} articles)`);

  // 7. Seed Sample Inquiry
  await prisma.inquiry.create({
    data: {
      name: "David Mwangi",
      email: "dmwangi@apexdevelopments.co.ke",
      phone: "+254 722 890 123",
      subject: "Passenger Elevator Quote for 12-Story Office Complex",
      message: "We are currently drafting the architectural tender for an upcoming 12-floor commercial tower in Upper Hill, Nairobi. We require quotation and shaft structural specifications for two 1000kg high-speed passenger elevators.",
      read: false,
    },
  });
  console.log(`✅ Sample inquiry seeded for testing`);

  console.log("✨ All seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
