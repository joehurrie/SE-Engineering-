type TeamPhoto = { image: string; caption: string };

const gridPositions = [
  "team-bento-photo-large",
  "team-bento-photo-top",
  "team-bento-photo-middle",
  "team-bento-photo-bottom",
];

export default function AboutTeamBento({ photos }: { photos: TeamPhoto[] }) {
  return (
    <div className="team-bento-marquee overflow-hidden" role="region" aria-label="Engineering and operations team at work">
      <div className="team-bento-track flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="team-bento-grid shrink-0"
            aria-hidden={copy === 1 || undefined}
          >
            {photos.map((photo, index) => (
              <figure key={`${copy}-${photo.caption}`} className={`team-bento-tile ${gridPositions[index]}`}>
                <img src={photo.image} alt={copy === 1 ? "" : photo.caption} className="h-full w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
