type TeamPhoto = { image: string; caption: string };

const gridPositions = [
  "team-bento-photo-large",
  "team-bento-photo-top",
  "team-bento-photo-middle",
  "team-bento-photo-bottom",
];

// Fallback images if list is short
const fallbackPhotos: TeamPhoto[] = [
  {
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=85&w=1200",
    caption: "Engineering collaboration",
  },
  {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=900",
    caption: "Technical planning",
  },
  {
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=85&w=900",
    caption: "On-site engineering",
  },
  {
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=85&w=900",
    caption: "Service & maintenance",
  },
];

export default function AboutTeamBento({ photos }: { photos: TeamPhoto[] }) {
  // Filter out any photos with empty images
  const validPhotos = photos.filter((p) => Boolean(p.image && p.image.trim()));
  const activePhotos = validPhotos.length > 0 ? validPhotos : fallbackPhotos;

  // Pad to at least 4 photos so each bento grid has complete tiles
  const fullPhotos: TeamPhoto[] = [...activePhotos];
  while (fullPhotos.length < 4) {
    fullPhotos.push(fallbackPhotos[fullPhotos.length % fallbackPhotos.length]);
  }

  // Create two complementary bento chunks for visual variety:
  // Chunk 0: Standard layout (large image on left)
  const chunk0 = fullPhotos.slice(0, 4);
  // Chunk 1: Inverted layout (large image on right, with complementary photo order)
  const chunk1 = fullPhotos.length >= 8
    ? fullPhotos.slice(4, 8)
    : [fullPhotos[2], fullPhotos[3], fullPhotos[0], fullPhotos[1]];

  const bentoSets = [
    { items: chunk0, isInverted: false, id: "bento-a" },
    { items: chunk1, isInverted: true, id: "bento-b" },
  ];

  return (
    <div
      className="team-bento-marquee relative overflow-hidden py-4"
      role="region"
      aria-label="Engineering and operations team at work"
    >
      <div className="team-bento-track flex w-max gap-6">
        {/* Set 1 */}
        <div className="flex shrink-0 gap-6">
          {bentoSets.map((bento) => (
            <div
              key={`set1-${bento.id}`}
              className={`team-bento-grid shrink-0 ${bento.isInverted ? "team-bento-grid-inverted" : ""}`}
            >
              {bento.items.map((photo, index) => (
                <figure
                  key={`set1-${bento.id}-${index}-${photo.caption || index}`}
                  className={`team-bento-tile ${gridPositions[index]} group rounded-xl`}
                >
                  <img
                    src={photo.image}
                    alt={photo.caption || "Specialized Engineering Team"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {photo.caption && photo.caption.trim().length > 0 && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-4 pt-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ))}
        </div>

        {/* Set 2 (Identical clone for seamless continuous infinite marquee loop) */}
        <div className="flex shrink-0 gap-6" aria-hidden="true">
          {bentoSets.map((bento) => (
            <div
              key={`set2-${bento.id}`}
              className={`team-bento-grid shrink-0 ${bento.isInverted ? "team-bento-grid-inverted" : ""}`}
            >
              {bento.items.map((photo, index) => (
                <figure
                  key={`set2-${bento.id}-${index}-${photo.caption || index}`}
                  className={`team-bento-tile ${gridPositions[index]} group rounded-xl`}
                >
                  <img
                    src={photo.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {photo.caption && photo.caption.trim().length > 0 && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-4 pt-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
