-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CourseType" ADD VALUE 'MOVE';
ALTER TYPE "CourseType" ADD VALUE 'SMART_CONTRACT';
ALTER TYPE "CourseType" ADD VALUE 'DEFI';
ALTER TYPE "CourseType" ADD VALUE 'NFT';
ALTER TYPE "CourseType" ADD VALUE 'SECURITY';
