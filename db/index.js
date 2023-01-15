const { Client } = require('pg'); // imports the pg module
const { password } = require('pg/lib/defaults');


// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, username 
      FROM users;
    `);

    return rows;
}

async function getAllPosts() {
    const { rows } = await client.query(
        `SELECT id, authorId, title, content, active
      FROM posts;
    `);

    return rows;
}

async function getPostsByUser(userId) {
    try {
        const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);

        return rows;
    } catch (error) {
        throw error;
    }
}


async function getUserById(userId) {

    const { rows: users } = await client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${userId};
      `);

    if (rows) {
        !rows
        return null;
    }
    else (`
      DELETE password FROM rows
      INSERT INTO ${users} VAlUES ${posts}`
    )
    return users

}



async function createUser({ username, password, name, location }) {
    try {
        const { rows: user } = await client.query(` 
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);

        return user;
    } catch (error) {
        throw error;
    }
}

async function createPost({ authorId, title, content }) {
    try {
        const { rows: posts } = await client.query(` 
        INSERT INTO posts (authorId, title, content) 
        VALUES($1, $2, $3) 
        ON CONFLICT (authorId) DO NOTHING 
        RETURNING *;
      `, [authorId, title, content]);

        return posts;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [user] } = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    }
}


async function updatePost(id, fields = { title, content, active }) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [posts] } = await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        return posts;
    } catch (error) {
        throw error;
    }
}




module.exports = {
    client,
    getAllUsers,
    getAllPosts,
    getPostsByUser,
    getUserById,
    createUser,
    createPost,
    updateUser,
    updatePost
}