/*
  Warnings:

  - The primary key for the `parsings` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "parsing_results" DROP CONSTRAINT "parsing_results_parsing_id_fkey";

-- AlterTable
ALTER TABLE "parsing_results" ALTER COLUMN "parsing_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "parsings" DROP CONSTRAINT "parsings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "parsings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "parsings_id_seq";

-- AddForeignKey
ALTER TABLE "parsing_results" ADD CONSTRAINT "parsing_results_parsing_id_fkey" FOREIGN KEY ("parsing_id") REFERENCES "parsings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
