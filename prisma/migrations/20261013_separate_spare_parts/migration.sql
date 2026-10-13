BEGIN;

ALTER TABLE IF EXISTS "ElevatorProduct"
  ADD COLUMN IF NOT EXISTS "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE IF NOT EXISTS "SparePartProduct" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "specifications" TEXT,
  "imageUrl" TEXT NOT NULL,
  "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SparePartProduct_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SparePartProduct_slug_key"
  ON "SparePartProduct"("slug");

INSERT INTO "SparePartProduct" (
  "id",
  "slug",
  "title",
  "description",
  "specifications",
  "imageUrl",
  "galleryImages",
  "featured",
  "createdAt"
)
SELECT
  "id",
  COALESCE(
    NULLIF(trim(both '-' from regexp_replace(lower(btrim("title")), '[^a-z0-9]+', '-', 'g')), ''),
    'spare-part'
  ) || '-' || "id"::text,
  "title",
  "description",
  "specifications",
  "imageUrl",
  COALESCE("galleryImages", ARRAY[]::TEXT[]),
  "featured",
  "createdAt"
FROM "ElevatorProduct"
WHERE lower(btrim("category")) = 'spare parts'
ON CONFLICT ("id") DO NOTHING;

DELETE FROM "ElevatorProduct"
WHERE lower(btrim("category")) = 'spare parts';

SELECT setval(
  pg_get_serial_sequence('"SparePartProduct"', 'id'),
  COALESCE((SELECT MAX("id") FROM "SparePartProduct"), 1),
  EXISTS(SELECT 1 FROM "SparePartProduct")
);

COMMIT;
