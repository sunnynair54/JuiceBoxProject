// grab our client with destructuring from the export in index.js
const { client,
    getAllUsers,
    getAllPosts,
    getPostsByUser,
    getUserById,
    createUser,
    createPost,
    updateUser,
    updatePost
} = require('./index');


async function createInitialUsers() {
    try {
        // const albertTwo = await createUser({ username: 'albert', password: 'imposter_albert', name: 'Albert', location:'Chicago' });
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Albert Michaels', location: 'Chicago' });
        console.log(albert);

        const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra Johnson', location: 'Madison' });
        console.log(sandra);

        const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Glam Glamington', location: 'Glamsville' });
        console.log(glamgal);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}


async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active boolean DEFAULT true
        );
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id),
          title varchar(255) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags (
            id, SERIAL PRIMARY KEY,
            name, VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE post_tags(
            "postId", INTEGER REFERENCES posts(id),
            "tagId", INTEGER REFERENCES tags(id),
             Add a UNIQUE constraint on ("postId", "tagId")
        );
      `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
        await createPostTag(); 
        await addTagsToPost(); 
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log("Calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "New Title",
            content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);

        console.log("Finished database tests!");
    } catch (error) {
        console.log("Error during testDB");
        throw error;
    }
}

async function createInitialPosts() {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        console.log("Starting to create posts...");
        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them."
        });

        await createPost({
            authorId: sandra.id,
            title: "How does this work?",
            content: "Seriously, does this even do anything?"
        });

        await createPost({
            authorId: glamgal.id,
            title: "Living the Glam Life",
            content: "Do you even? I swear that half of you are posing."
        });
        console.log("Finished creating posts!");
    } catch (error) {
        console.log("Error creating posts!");
        throw error;
    }
}

async function createPostTag(postId, tagId) {
    try {
      await client.query(`
        INSERT INTO post_tags("postId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("postId", "tagId") DO NOTHING;
      `, [postId, tagId]);
    } catch (error) {
      throw error;
    }
  }

  async function addTagsToPost(postId, tagList) {
    try {
      const createPostTagPromises = tagList.map(
        tag => createPostTag(postId, tag.id)
      );
  
      await Promise.all(createPostTagPromises);
  
      return await getPostById(postId);
    } catch (error) {
      throw error;
    }
  }

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());