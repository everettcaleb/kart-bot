-- Racer
CREATE TABLE "Racers" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "skill" INTEGER NULL,
    PRIMARY KEY ("id")
);

-- Heat
CREATE TABLE "Heats" (
    "id" INTEGER NOT NULL,
    "desc" VARCHAR(100) NOT NULL,
    "winBy" VARCHAR(100) NULL,
    "date" TIMESTAMP NOT NULL,
    PRIMARY KEY ("id")
);

CREATE INDEX "IX_Heats_date"
ON "Heats" ("date");

-- HeatRacer
CREATE TABLE "HeatRacers" (
    "heatId" INTEGER NOT NULL REFERENCES "Heats",
    "racerId" INTEGER NOT NULL REFERENCES "Racers",
    "position" INTEGER NOT NULL,
    "bestLapTime" NUMERIC(10,4) NOT NULL,
    "gapTime" NUMERIC(10,4) NULL,
    "gapLaps" INTEGER NULL,
    "lapCount" INTEGER NULL,
    "averageLapTime" NUMERIC(10,4) NULL,
    "skill" INTEGER NULL,
    "skillDelta" INTEGER NULL,
    "kartNumber" INTEGER NULL,
    PRIMARY KEY ("heatId", "racerId"),
    CHECK ( "gapTime" IS NULL OR "gapLaps" IS NULL)
);

CREATE INDEX "IX_HeatRacers_heatId"
ON "HeatRacers" ("heatId");

CREATE INDEX "IX_HeatRacers_racerId"
ON "HeatRacers" ("racerId");

CREATE INDEX "IX_HeatRacers_kartNumber"
ON "HeatRacers" ("kartNumber")
WHERE "kartNumber" IS NOT NULL;

-- HeatRacerLap
CREATE TABLE "HeatRacerLaps" (
    "heatId" INTEGER NOT NULL REFERENCES "Heats",
    "racerId" INTEGER NOT NULL REFERENCES "Racers",
    "id" INTEGER NOT NULL,
    "time" NUMERIC(10,4) NOT NULL,
    "position" INTEGER NOT NULL,
    PRIMARY KEY ("heatId", "racerId", "id")
);

CREATE INDEX "IX_HeatRacerLaps_heatId"
ON "HeatRacerLaps" ("heatId");

CREATE INDEX "IX_HeatRacerLaps_racerId"
ON "HeatRacerLaps" ("racerId");

CREATE INDEX "IX_HeatRacerLaps_time"
ON "HeatRacerLaps" ("time");
