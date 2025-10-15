-- AlterTable
ALTER TABLE "highlights" ADD COLUMN     "dev_ids" INTEGER[],
ADD COLUMN     "week_end" TIMESTAMP(3),
ADD COLUMN     "week_start" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "highlights_week_start_idx" ON "highlights"("week_start");

-- CreateIndex
CREATE INDEX "highlights_week_end_idx" ON "highlights"("week_end");
