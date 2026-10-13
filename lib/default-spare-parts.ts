export type SparePartProduct = {
  slug: string;
  title: string;
  description: string;
  specifications: string;
  imageUrl: string;
  galleryImages: string[];
};

const makeImages = (photoId: string) => [
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1200`,
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
];

export const defaultSpareParts: SparePartProduct[] = [
  {
    slug: "door-operator-kit",
    title: "Lift Door Operator Kit",
    description: "A replacement door operator assembly designed to support smooth, controlled opening and closing on compatible passenger lift systems.",
    specifications: '{"Application":"Passenger lifts","Includes":"Motor, controller and drive components","Supply":"Confirm compatibility before ordering"}',
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200",
    galleryImages: makeImages("photo-1581092335397-9583fe92d232"),
  },
  {
    slug: "lift-push-button-panel",
    title: "Lift Push Button Panel",
    description: "A durable lift control panel replacement for cabin or landing use, with button configuration selected to match the existing installation.",
    specifications: '{"Application":"Cabin or landing controls","Finish":"Stainless steel options","Configuration":"Custom floor and button layout"}',
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    galleryImages: makeImages("photo-1518770660439-4636190af475"),
  },
  {
    slug: "elevator-guide-shoe-set",
    title: "Elevator Guide Shoe Set",
    description: "Guide shoe components help maintain stable car travel along the guide rails. Confirm rail dimensions and lift model before requesting.",
    specifications: '{"Application":"Lift car or counterweight","Type":"Guide shoe assembly","Compatibility":"Model and rail dependent"}',
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
    galleryImages: makeImages("photo-1581092160562-40aa08e78837"),
  },
  {
    slug: "lift-safety-light-curtain",
    title: "Lift Door Safety Light Curtain",
    description: "A door protection sensor set that detects obstructions across the entrance and helps prevent doors from closing onto passengers.",
    specifications: '{"Application":"Automatic lift doors","Type":"Infrared multi-beam sensor","Fitment":"Confirm door opening dimensions"}',
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    galleryImages: makeImages("photo-1581091226825-a6a2a5aee158"),
  },
  {
    slug: "elevator-landing-door-lock",
    title: "Elevator Landing Door Lock",
    description: "A replacement landing door interlock component for compatible lift door systems. Selection and installation should be confirmed by a qualified technician.",
    specifications: '{"Application":"Landing door safety circuit","Type":"Door interlock assembly","Compatibility":"Lift and door model dependent"}',
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1200",
    galleryImages: makeImages("photo-1581092795360-fd1ca04f0952"),
  },
  {
    slug: "lift-emergency-battery",
    title: "Lift Emergency Backup Battery",
    description: "Backup battery components for compatible lift rescue and emergency return systems, selected to match the installed controller and power requirements.",
    specifications: '{"Application":"Emergency return / rescue","Supply":"Voltage and capacity dependent","Compatibility":"Verify controller model before ordering"}',
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200",
    galleryImages: makeImages("photo-1593941707882-a5bba14938c7"),
  },
];
