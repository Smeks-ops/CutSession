DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
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