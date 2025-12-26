-- Check users
SELECT COUNT(*) as total_users FROM users;

-- Check subscriptions
SELECT 
  COUNT(*) as total_subscriptions,
  status,
  tier
FROM subscriptions 
GROUP BY status, tier;

-- Check sessions booked
SELECT COUNT(*) as total_sessions FROM sessions;

-- Check recent subscriptions
SELECT 
  id,
  userId,
  tier,
  status,
  createdAt,
  trialEnd,
  currentPeriodEnd
FROM subscriptions 
ORDER BY createdAt DESC 
LIMIT 10;
