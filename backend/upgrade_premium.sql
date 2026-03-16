-- Upgrade brallamdelgado351@gmail.com a PREMIUM
-- Ejecuta en phpMyAdmin / MySQL Workbench (DB desde backend/.env MYSQL_DB)

-- 1. Backup (opcional)
CREATE TABLE subscriptions_backup AS SELECT * FROM subscriptions;

-- 2. Get user_id
SELECT id AS user_id FROM users WHERE email = 'brallamdelgado351@gmail.com';

-- 3. Clean old subs
DELETE FROM subscriptions WHERE user_id = (SELECT id FROM users WHERE email = 'brallamdelgado351@gmail.com');

-- 4. Premium sub (plan_id=2 from mysql.js)
INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status) VALUES
(
  (SELECT id FROM users WHERE email = 'brallamdelgado351@gmail.com'),
  2,
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 1 YEAR),
  'active'
);

-- 5. Verify
SELECT 
  s.id, s.status, s.end_date,
  p.name, p.search_limit 
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.user_id = (SELECT id FROM users WHERE email = 'brallamdelgado351@gmail.com');

-- 6. Reset Mongo searches (Mongo Compass/shell - replace USER_ID)
-- db.searchhistory.deleteMany({userId: 1});  -- use your user_id

-- ¡Listo! Login frontend + test search.
