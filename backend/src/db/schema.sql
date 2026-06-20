CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  total_distance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE run_clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  avatar_url TEXT,
  cover_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  member_count INT DEFAULT 1,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE club_members (
  club_id UUID REFERENCES run_clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (club_id, user_id)
);

CREATE TABLE runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES run_clubs(id) ON DELETE SET NULL,
  title VARCHAR(100),
  distance DECIMAL(10,2),
  duration INT,
  pace DECIMAL(10,2),
  route JSONB,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES run_clubs(id) ON DELETE CASCADE,
  dm_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT message_target CHECK (
    (club_id IS NOT NULL AND dm_user_id IS NULL) OR
    (club_id IS NULL AND dm_user_id IS NOT NULL)
  )
);

CREATE TABLE club_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES run_clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  run_id UUID REFERENCES runs(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
