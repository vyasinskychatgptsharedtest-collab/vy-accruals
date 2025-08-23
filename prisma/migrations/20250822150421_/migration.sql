/*
  Warnings:

  - The primary key for the `parsing_results` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "parsing_results" DROP CONSTRAINT "parsing_results_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "parsing_results_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "parsing_results_id_seq";
