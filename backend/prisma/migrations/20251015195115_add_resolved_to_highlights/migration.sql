-- AlterTable
ALTER TABLE "highlights" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolved_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "highlights_resolved_idx" ON "highlights"("resolved");
