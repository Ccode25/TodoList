
CREATE TABLE users(
id SERIAL PRIMARY KEY,
name TEXT UNIQUE NOT NULL
);

CREATE TABLE items(
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
user_id INTEGER REFERENCES users(id)
);

INSERT INTO users (name)
VALUES ('Aeron');

INSERT INTO items (title, user_id)
VALUES ('Cooking', 1);

SELECT *
FROM users
JOIN items
ON users.id = user_id;