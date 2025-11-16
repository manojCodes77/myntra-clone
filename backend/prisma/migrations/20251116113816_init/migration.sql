-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "original_price" INTEGER NOT NULL,
    "current_price" INTEGER NOT NULL,
    "discount_percentage" INTEGER NOT NULL,
    "return_period" INTEGER NOT NULL DEFAULT 14,
    "delivery_date" TEXT NOT NULL,
    "rating_stars" DOUBLE PRECISION NOT NULL,
    "rating_count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);
