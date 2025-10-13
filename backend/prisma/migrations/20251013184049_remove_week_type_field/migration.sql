/*
  Warnings:

  - You are about to drop the column `week_type` on the `timeline_tasks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."timeline_tasks_week_type_idx";

-- AlterTable
ALTER TABLE "timeline_tasks" DROP COLUMN "week_type";

-- CreateIndex
CREATE INDEX "timeline_tasks_week_start_idx" ON "timeline_tasks"("week_start");

-- CreateIndex
CREATE INDEX "timeline_tasks_week_end_idx" ON "timeline_tasks"("week_end");
