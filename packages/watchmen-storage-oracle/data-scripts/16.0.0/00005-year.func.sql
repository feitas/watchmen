CREATE OR REPLACE FUNCTION YEAR(a_date IN DATE)
    RETURN NUMBER
    IS
BEGIN
    RETURN EXTRACT(YEAR FROM a_date);
END;