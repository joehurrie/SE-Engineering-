BEGIN;

CREATE TABLE IF NOT EXISTS "JobVacancy" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "employmentType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "JobVacancy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "JobApplication" (
  "id" SERIAL NOT NULL,
  "vacancyId" INTEGER,
  "vacancyTitle" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "portfolioUrl" TEXT,
  "message" TEXT NOT NULL,
  "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "JobVacancy_published_createdAt_idx"
  ON "JobVacancy"("published", "createdAt");
CREATE INDEX IF NOT EXISTS "JobApplication_createdAt_idx"
  ON "JobApplication"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'JobApplication_vacancyId_fkey'
  ) THEN
    ALTER TABLE "JobApplication"
      ADD CONSTRAINT "JobApplication_vacancyId_fkey"
      FOREIGN KEY ("vacancyId") REFERENCES "JobVacancy"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
