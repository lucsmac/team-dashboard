-- CreateTable
CREATE TABLE "devs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "seniority" TEXT NOT NULL,
    "last_week" TEXT,
    "this_week" TEXT,
    "next_week" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demands" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "assigned_devs" TEXT[],
    "value" TEXT,
    "details" TEXT,
    "links" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value_type" TEXT,
    "items" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "highlights" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "severity" TEXT,
    "achievement_date" TIMESTAMP(3),
    "demand_id" TEXT,
    "timeline_task_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_tasks" (
    "id" TEXT NOT NULL,
    "week_type" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "week_end" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'nao-iniciada',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "demand_id" TEXT,

    CONSTRAINT "timeline_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_task_assignments" (
    "id" TEXT NOT NULL,
    "timeline_task_id" TEXT NOT NULL,
    "dev_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_task_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "devs_role_idx" ON "devs"("role");

-- CreateIndex
CREATE INDEX "devs_seniority_idx" ON "devs"("seniority");

-- CreateIndex
CREATE INDEX "demands_category_idx" ON "demands"("category");

-- CreateIndex
CREATE INDEX "demands_status_idx" ON "demands"("status");

-- CreateIndex
CREATE INDEX "demands_stage_idx" ON "demands"("stage");

-- CreateIndex
CREATE INDEX "highlights_type_idx" ON "highlights"("type");

-- CreateIndex
CREATE INDEX "highlights_demand_id_idx" ON "highlights"("demand_id");

-- CreateIndex
CREATE INDEX "highlights_timeline_task_id_idx" ON "highlights"("timeline_task_id");

-- CreateIndex
CREATE INDEX "highlights_created_at_idx" ON "highlights"("created_at");

-- CreateIndex
CREATE INDEX "timeline_tasks_week_type_idx" ON "timeline_tasks"("week_type");

-- CreateIndex
CREATE INDEX "timeline_tasks_demand_id_idx" ON "timeline_tasks"("demand_id");

-- CreateIndex
CREATE INDEX "timeline_tasks_status_idx" ON "timeline_tasks"("status");

-- CreateIndex
CREATE INDEX "timeline_task_assignments_timeline_task_id_idx" ON "timeline_task_assignments"("timeline_task_id");

-- CreateIndex
CREATE INDEX "timeline_task_assignments_dev_id_idx" ON "timeline_task_assignments"("dev_id");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_task_assignments_timeline_task_id_dev_id_key" ON "timeline_task_assignments"("timeline_task_id", "dev_id");

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "demands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_timeline_task_id_fkey" FOREIGN KEY ("timeline_task_id") REFERENCES "timeline_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_tasks" ADD CONSTRAINT "timeline_tasks_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "demands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_task_assignments" ADD CONSTRAINT "timeline_task_assignments_timeline_task_id_fkey" FOREIGN KEY ("timeline_task_id") REFERENCES "timeline_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_task_assignments" ADD CONSTRAINT "timeline_task_assignments_dev_id_fkey" FOREIGN KEY ("dev_id") REFERENCES "devs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
