-- DropForeignKey
ALTER TABLE "public"."timeline_tasks" DROP CONSTRAINT "timeline_tasks_demand_id_fkey";

-- AddForeignKey
ALTER TABLE "timeline_tasks" ADD CONSTRAINT "timeline_tasks_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
