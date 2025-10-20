-- AlterTable
ALTER TABLE "devs" ADD COLUMN     "weekly_capacity" INTEGER NOT NULL DEFAULT 40;

-- CreateTable
CREATE TABLE "dev_week_allocations" (
    "id" TEXT NOT NULL,
    "dev_id" INTEGER NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "week_end" TIMESTAMP(3) NOT NULL,
    "allocation_type" TEXT NOT NULL,
    "allocation_percent" INTEGER NOT NULL DEFAULT 100,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dev_week_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dev_week_allocations_dev_id_idx" ON "dev_week_allocations"("dev_id");

-- CreateIndex
CREATE INDEX "dev_week_allocations_week_start_idx" ON "dev_week_allocations"("week_start");

-- CreateIndex
CREATE INDEX "dev_week_allocations_allocation_type_idx" ON "dev_week_allocations"("allocation_type");

-- CreateIndex
CREATE UNIQUE INDEX "dev_week_allocations_dev_id_week_start_allocation_type_key" ON "dev_week_allocations"("dev_id", "week_start", "allocation_type");

-- AddForeignKey
ALTER TABLE "dev_week_allocations" ADD CONSTRAINT "dev_week_allocations_dev_id_fkey" FOREIGN KEY ("dev_id") REFERENCES "devs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
