ALTER TABLE snowflake_workerid RENAME TO snowflake_competitive_workers;
ALTER TABLE snowflake_competitive_workers DROP CONSTRAINT snowflake_workerid_pk;