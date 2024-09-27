DROP TABLE IF EXISTS users, tasks;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    picture TEXT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(8) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    priority VARCHAR(12) DEFAULT 'text-red-400',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_done INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id)
);