-- AlterTable
ALTER TABLE "demands" ADD COLUMN     "completed_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "demands_completed_at_idx" ON "demands"("completed_at");
