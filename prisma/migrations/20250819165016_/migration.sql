-- CreateTable
CREATE TABLE "apartments" (
    "apartment_id" SERIAL NOT NULL,
    "apartment_external_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "unit_id" TEXT,
    "debt" DECIMAL(65,30),
    "invoice_disabled" BOOLEAN NOT NULL DEFAULT false,
    "must_confirm" BOOLEAN NOT NULL DEFAULT false,
    "gaz_type" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("apartment_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" SERIAL NOT NULL,
    "account_external_id" INTEGER NOT NULL,
    "organization_name" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "address" TEXT,
    "type" TEXT,
    "debt" DECIMAL(65,30),
    "apartment_id" INTEGER NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "accruals" (
    "id" SERIAL NOT NULL,
    "period_name" TEXT,
    "period_id" INTEGER NOT NULL,
    "in_balance" DECIMAL(65,30),
    "total_sum" DECIMAL(65,30),
    "fine" DECIMAL(65,30),
    "to_pay" DECIMAL(65,30),
    "payed" DECIMAL(65,30),
    "invoice_exists" BOOLEAN,
    "account_external_id" INTEGER NOT NULL,
    "s3_invoice_url" TEXT,

    CONSTRAINT "accruals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsings" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parsings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsing_results" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,
    "step_id" INTEGER,
    "is_success" BOOLEAN NOT NULL DEFAULT false,
    "parsing_id" INTEGER,

    CONSTRAINT "parsing_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apartments_apartment_external_id_key" ON "apartments"("apartment_external_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_external_id_key" ON "accounts"("account_external_id");

-- CreateIndex
CREATE UNIQUE INDEX "accruals_s3_invoice_url_key" ON "accruals"("s3_invoice_url");

-- CreateIndex
CREATE UNIQUE INDEX "accruals_account_period_unique" ON "accruals"("account_external_id", "period_name");

-- CreateIndex
CREATE UNIQUE INDEX "steps_name_key" ON "steps"("name");

-- AddForeignKey
ALTER TABLE "accruals" ADD CONSTRAINT "accruals_account_external_id_fkey" FOREIGN KEY ("account_external_id") REFERENCES "accounts"("account_external_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsing_results" ADD CONSTRAINT "parsing_results_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsing_results" ADD CONSTRAINT "parsing_results_parsing_id_fkey" FOREIGN KEY ("parsing_id") REFERENCES "parsings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
