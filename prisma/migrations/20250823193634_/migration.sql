/*
  Warnings:

  - A unique constraint covering the columns `[account_external_id,period_id]` on the table `accruals` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "accruals_account_period_unique";

-- CreateIndex
CREATE UNIQUE INDEX "accruals_account_period_unique" ON "accruals"("account_external_id", "period_id");
