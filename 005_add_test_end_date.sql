-- Migration to add end_date to tests table
-- This allows exams to be automatically hidden after they finish

alter table "public"."tests"
add column "end_date" timestamp with time zone;
