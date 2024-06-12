

--@block
CREATE TABLE users_new (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--@block

INSERT INTO users_new(username, email, password)
VALUES
    ('Shrek', 'shrek@gmail.com', 'pozo'),
    ('Ebay', 'ebay@gmail.com', 'stream'),
    ('El Pepe', 'pepe@gmail.com', 'mamahuevo');