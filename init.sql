CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  host_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE room_user_refs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL,
  user_id UUID NOT NULL,
  relation VARCHAR(30) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('text', 'image', 'file')),
  payload JSONB NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  deleted_at TIMESTAMP WITH TIME ZONE
);


INSERT INTO rooms (id, name, host_id) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Room_1', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Room_2', '550e8400-e29b-41d4-a716-446655440000'),
  ('123e4567-e89b-12d3-a456-426614174000', 'Room_3', '123e4567-e89b-12d3-a456-426614174000');

-- 插入用戶數據
INSERT INTO users (id, username, password) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Jay', 'hashed_password_1'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Jolin', 'hashed_password_2'),
  ('123e4567-e89b-12d3-a456-426614174000', 'Holly', 'hashed_password_3'),
  ('98765432-10fe-cba9-8765-4321fedcba98', 'Kuan', 'hashed_password_4'),
  ('abcdef12-3456-7890-abcd-ef1234567890', 'Gary', 'hashed_password_5'),
  ('c47bba54-3ec2-4e3d-99b1-9c2e03a4a1b7', 'Emma', 'hashed_password_6'),
  ('d5f1c4b0-1234-4321-a123-a1b2c3d4e5f6', 'Oliver', 'hashed_password_7'),
  ('ae0c5c32-a0d3-4928-a79e-4419b69cdba4', 'Sophia', 'hashed_password_8'),
  ('6ca534e4-64dc-408e-b57d-17b9aef5adb0', 'William', 'hashed_password_9');

-- Room 1
INSERT INTO room_user_refs (room_id, user_id, relation) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Contactor.me'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'c47bba54-3ec2-4e3d-99b1-9c2e03a4a1b7', 'Contactor.mother'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'd5f1c4b0-1234-4321-a123-a1b2c3d4e5f6', 'Contactor.father'),
  ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Contactor.me'),
  ('550e8400-e29b-41d4-a716-446655440000', '98765432-10fe-cba9-8765-4321fedcba98', 'Contactor.grandfather'),
  ('550e8400-e29b-41d4-a716-446655440000', 'abcdef12-3456-7890-abcd-ef1234567890', 'Teacher'),
  ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'Contactor.me'),
  ('123e4567-e89b-12d3-a456-426614174000', 'ae0c5c32-a0d3-4928-a79e-4419b69cdba4', 'Contactor.grandmother'),
  ('123e4567-e89b-12d3-a456-426614174000', '6ca534e4-64dc-408e-b57d-17b9aef5adb0', 'Contactor.uncle');



-- 插入消息數據
INSERT INTO messages (room_id, type, payload, created_by) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'text', '{"content": "Hello, Room 1!"}', '550e8400-e29b-41d4-a716-446655440000'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'image', '{"url": "http://example.com/image1.jpg", "caption": "Nice view"}', '123e4567-e89b-12d3-a456-426614174000'),
  ('550e8400-e29b-41d4-a716-446655440000', 'text', '{"content": "Welcome to Room 2"}', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('550e8400-e29b-41d4-a716-446655440000', 'file', '{"url": "http://example.com/document.pdf", "name": "Important Document"}', '98765432-10fe-cba9-8765-4321fedcba98'),
  ('123e4567-e89b-12d3-a456-426614174000', 'text', '{"content": "Room 3 is now open!"}', '550e8400-e29b-41d4-a716-446655440000'),
  ('123e4567-e89b-12d3-a456-426614174000', 'image', '{"url": "http://example.com/image2.jpg", "caption": "Group photo"}', 'abcdef12-3456-7890-abcd-ef1234567890');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_room_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();