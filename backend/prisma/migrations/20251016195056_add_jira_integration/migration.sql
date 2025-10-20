-- CreateTable
CREATE TABLE "jira_integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jira_url" TEXT NOT NULL,
    "project_key" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "api_token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_sync_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jira_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jira_issues" (
    "id" TEXT NOT NULL,
    "jira_issue_id" TEXT NOT NULL,
    "jira_issue_key" TEXT NOT NULL,
    "integration_name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "issue_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT,
    "assignee_email" TEXT,
    "assignee_name" TEXT,
    "assigned_dev_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolution_date" TIMESTAMP(3),
    "time_to_first_response" INTEGER,
    "time_in_progress" INTEGER,
    "time_to_resolution" INTEGER,
    "estimated_hours" DOUBLE PRECISION,
    "logged_hours" DOUBLE PRECISION,
    "complexity" TEXT,
    "story_points" INTEGER,
    "labels" TEXT[],
    "components" TEXT[],
    "last_synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jira_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jira_integrations_name_key" ON "jira_integrations"("name");

-- CreateIndex
CREATE INDEX "jira_integrations_name_idx" ON "jira_integrations"("name");

-- CreateIndex
CREATE INDEX "jira_integrations_is_active_idx" ON "jira_integrations"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "jira_issues_jira_issue_key_key" ON "jira_issues"("jira_issue_key");

-- CreateIndex
CREATE INDEX "jira_issues_integration_name_idx" ON "jira_issues"("integration_name");

-- CreateIndex
CREATE INDEX "jira_issues_status_idx" ON "jira_issues"("status");

-- CreateIndex
CREATE INDEX "jira_issues_assignee_email_idx" ON "jira_issues"("assignee_email");

-- CreateIndex
CREATE INDEX "jira_issues_assigned_dev_id_idx" ON "jira_issues"("assigned_dev_id");

-- CreateIndex
CREATE INDEX "jira_issues_created_at_idx" ON "jira_issues"("created_at");

-- CreateIndex
CREATE INDEX "jira_issues_resolution_date_idx" ON "jira_issues"("resolution_date");
