-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "ChangelogType" AS ENUM ('PLANNING', 'FEATURE', 'FIX', 'SECURITY', 'LEGAL', 'SEO', 'DATABASE', 'ADMIN', 'DEPLOYMENT');

-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('REQUEST_RECEIVED', 'WAITING_FOR_DEVICE', 'DEVICE_RECEIVED', 'DIAGNOSIS_IN_PROGRESS', 'QUOTE_SENT', 'WAITING_FOR_APPROVAL', 'APPROVED', 'IN_REPAIR', 'TESTING', 'READY_FOR_RETURN', 'SENT_TO_CUSTOMER', 'COMPLETED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('BUSINESS_IT', 'CONNECTIVITY', 'DIGITAL_PROJECT', 'GENERAL_CONTACT');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_REVIEW', 'QUESTIONS_SENT', 'QUOTE_SENT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('LAPTOP_CLEANING', 'THERMAL_CHECK', 'HEALTH_CHECK', 'BUSINESS_IT_MAINTENANCE', 'WEBSITE_MAINTENANCE');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('SCHEDULED', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UploadVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "group" TEXT NOT NULL DEFAULT 'general',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangelogEntry" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "type" "ChangelogType" NOT NULL DEFAULT 'FEATURE',
    "module" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "WorkStatus" NOT NULL DEFAULT 'DONE',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChangelogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "county" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "type" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairCase" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "customerId" TEXT,
    "deviceId" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'REQUEST_RECEIVED',
    "issueReported" TEXT NOT NULL,
    "diagnosis" TEXT,
    "workDone" TEXT,
    "partsUsed" TEXT,
    "publicNotes" TEXT,
    "internalNotes" TEXT,
    "courierInboundAwb" TEXT,
    "courierOutboundAwb" TEXT,
    "warrantyUntil" TIMESTAMP(3),
    "nextRecommendedService" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusUpdate" (
    "id" TEXT NOT NULL,
    "repairCaseId" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL,
    "publicNote" TEXT,
    "internalNote" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "repairCaseId" TEXT,
    "leadId" TEXT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "visibility" "UploadVisibility" NOT NULL DEFAULT 'PRIVATE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "repairCaseId" TEXT NOT NULL,
    "amount" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'RON',
    "description" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "repairCaseId" TEXT,
    "customerId" TEXT,
    "type" "ReminderType" NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "subject" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "type" "LeadType" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "customerId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "companyName" TEXT,
    "projectUrl" TEXT,
    "location" TEXT,
    "message" TEXT,
    "publicNotes" TEXT,
    "internalNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "ChangelogEntry_version_idx" ON "ChangelogEntry"("version");

-- CreateIndex
CREATE INDEX "ChangelogEntry_module_idx" ON "ChangelogEntry"("module");

-- CreateIndex
CREATE INDEX "ChangelogEntry_createdAt_idx" ON "ChangelogEntry"("createdAt");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Device_customerId_idx" ON "Device"("customerId");

-- CreateIndex
CREATE INDEX "Device_serialNumber_idx" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RepairCase_trackingId_key" ON "RepairCase"("trackingId");

-- CreateIndex
CREATE INDEX "RepairCase_trackingId_idx" ON "RepairCase"("trackingId");

-- CreateIndex
CREATE INDEX "RepairCase_status_idx" ON "RepairCase"("status");

-- CreateIndex
CREATE INDEX "RepairCase_createdAt_idx" ON "RepairCase"("createdAt");

-- CreateIndex
CREATE INDEX "StatusUpdate_repairCaseId_idx" ON "StatusUpdate"("repairCaseId");

-- CreateIndex
CREATE INDEX "StatusUpdate_createdAt_idx" ON "StatusUpdate"("createdAt");

-- CreateIndex
CREATE INDEX "UploadedFile_repairCaseId_idx" ON "UploadedFile"("repairCaseId");

-- CreateIndex
CREATE INDEX "UploadedFile_leadId_idx" ON "UploadedFile"("leadId");

-- CreateIndex
CREATE INDEX "Quote_repairCaseId_idx" ON "Quote"("repairCaseId");

-- CreateIndex
CREATE INDEX "Reminder_repairCaseId_idx" ON "Reminder"("repairCaseId");

-- CreateIndex
CREATE INDEX "Reminder_customerId_idx" ON "Reminder"("customerId");

-- CreateIndex
CREATE INDEX "Reminder_scheduledFor_idx" ON "Reminder"("scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_trackingId_key" ON "Lead"("trackingId");

-- CreateIndex
CREATE INDEX "Lead_trackingId_idx" ON "Lead"("trackingId");

-- CreateIndex
CREATE INDEX "Lead_type_idx" ON "Lead"("type");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "ChangelogEntry" ADD CONSTRAINT "ChangelogEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairCase" ADD CONSTRAINT "RepairCase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairCase" ADD CONSTRAINT "RepairCase_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusUpdate" ADD CONSTRAINT "StatusUpdate_repairCaseId_fkey" FOREIGN KEY ("repairCaseId") REFERENCES "RepairCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_repairCaseId_fkey" FOREIGN KEY ("repairCaseId") REFERENCES "RepairCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_repairCaseId_fkey" FOREIGN KEY ("repairCaseId") REFERENCES "RepairCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_repairCaseId_fkey" FOREIGN KEY ("repairCaseId") REFERENCES "RepairCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

