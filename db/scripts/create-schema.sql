DROP TABLE IF EXISTS users;

CREATE TABLE users (
  	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	username VARCHAR(30) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	dob VARCHAR(50) NOT NULL,
	cityOfResidence VARCHAR(50) NOT NULL,
	phoneNumber VARCHAR(50) NOT NULL,
	metadata JSONB,
	role VARCHAR(50) DEFAULT 'user',
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE merchants (
  	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,	
	name VARCHAR(100) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	username VARCHAR(30) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	cityOfOperation VARCHAR(50) NOT NULL,
	phoneNumber VARCHAR(50) NOT NULL,
	metadata JSONB,
	role VARCHAR(50) DEFAULT 'merchant',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions(
  	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	merchant_id uuid NOT NULL,
	startsAt TIMESTAMP NOT NULL,
	endsAt TIMESTAMP NOT NULL,
	type DEFAULT WEEKLY VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (merchant_id) REFERENCES merchants(id),
);

CREATE TABLE bookings(
  	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	bookingRef VARCHAR NOT NULL,
	user_id uuid NOT NULL,
	session_id uuid NOT NULL,
	date VARCHAR(50) NOT NULL,
	startsAt VARCHAR(50) NOT NULL,
	endsAt VARCHAR(50) NOT NULL,
	notes VARCHAR(50) NOT NULL,
	title VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (session_id) REFERENCES sessions(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX merchants_idx_cityofoperation_id ON "merchants" ("cityofoperation","id");
CREATE INDEX sessions_idx_id ON "sessions" ("id");
