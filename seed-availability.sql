-- Seed Coach Availability
-- Weekdays (Mon-Fri): 19:45 - 21:45 (7:45 PM - 9:45 PM)
-- Weekends (Sat-Sun): 09:00 - 16:30 (9:00 AM - 4:30 PM)

-- Clear existing availability for coach_id = 1
DELETE FROM coach_availability WHERE coach_id = 1;

-- Insert availability slots
-- Monday (1)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 1, '19:45', '21:45', true, NOW(), NOW());

-- Tuesday (2)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 2, '19:45', '21:45', true, NOW(), NOW());

-- Wednesday (3)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 3, '19:45', '21:45', true, NOW(), NOW());

-- Thursday (4)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 4, '19:45', '21:45', true, NOW(), NOW());

-- Friday (5)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 5, '19:45', '21:45', true, NOW(), NOW());

-- Saturday (6)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 6, '09:00', '16:30', true, NOW(), NOW());

-- Sunday (0)
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) 
VALUES (1, 0, '09:00', '16:30', true, NOW(), NOW());

-- Verify
SELECT * FROM coach_availability WHERE coach_id = 1 ORDER BY day_of_week;
