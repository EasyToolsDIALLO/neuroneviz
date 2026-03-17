-- CreateTable
CREATE TABLE "Architecture" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Architecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "architectureId" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "keyPoints" JSONB NOT NULL,
    "layers" JSONB NOT NULL,
    "advantages" JSONB NOT NULL,
    "disadvantages" JSONB NOT NULL,
    "useCases" JSONB NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulation" (
    "id" TEXT NOT NULL,
    "architectureId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defaultInput" JSONB NOT NULL,
    "steps" JSONB NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeImplementation" (
    "id" TEXT NOT NULL,
    "architectureId" TEXT NOT NULL,
    "framework" TEXT NOT NULL DEFAULT 'PyTorch',
    "language" TEXT NOT NULL DEFAULT 'python',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sections" JSONB NOT NULL,

    CONSTRAINT "CodeImplementation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FromScratch" (
    "id" TEXT NOT NULL,
    "architectureId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "formulas" JSONB NOT NULL,
    "implementation" TEXT NOT NULL,
    "steps" JSONB NOT NULL,

    CONSTRAINT "FromScratch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Architecture_slug_key" ON "Architecture"("slug");

-- CreateIndex
CREATE INDEX "Architecture_slug_idx" ON "Architecture"("slug");

-- CreateIndex
CREATE INDEX "Architecture_order_idx" ON "Architecture"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Concept_architectureId_key" ON "Concept"("architectureId");

-- CreateIndex
CREATE UNIQUE INDEX "Simulation_architectureId_key" ON "Simulation"("architectureId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeImplementation_architectureId_key" ON "CodeImplementation"("architectureId");

-- CreateIndex
CREATE UNIQUE INDEX "FromScratch_architectureId_key" ON "FromScratch"("architectureId");

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_architectureId_fkey" FOREIGN KEY ("architectureId") REFERENCES "Architecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_architectureId_fkey" FOREIGN KEY ("architectureId") REFERENCES "Architecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeImplementation" ADD CONSTRAINT "CodeImplementation_architectureId_fkey" FOREIGN KEY ("architectureId") REFERENCES "Architecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FromScratch" ADD CONSTRAINT "FromScratch_architectureId_fkey" FOREIGN KEY ("architectureId") REFERENCES "Architecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
