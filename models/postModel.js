// Data layer: all reading/writing of data/posts.json lives here.
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, '..', 'data', 'posts.json');

// Serialise writes so two requests can't overwrite each other's changes.
let queue = Promise.resolve();
function locked(task) {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
}

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return []; // no file yet -> no posts
    throw err;
  }
}

const writeAll = (posts) => fs.writeFile(FILE, JSON.stringify(posts, null, 2));

exports.findAll = readAll;

exports.findById = async (id) => (await readAll()).find((p) => p.id === id);

exports.create = ({ title, content, author, category }) =>
  locked(async () => {
    const posts = await readAll();
    const now = new Date().toISOString();
    const post = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category.trim(),
      createdAt: now,
      updatedAt: now
    };
    posts.push(post);
    await writeAll(posts);
    return post;
  });

exports.update = (id, changes) =>
  locked(async () => {
    const posts = await readAll();
    const post = posts.find((p) => p.id === id);
    if (!post) return null;

    for (const field of ['title', 'content', 'author', 'category']) {
      if (changes[field] !== undefined) post[field] = changes[field].trim();
    }
    post.updatedAt = new Date().toISOString();
    await writeAll(posts);
    return post;
  });

exports.remove = (id) =>
  locked(async () => {
    const posts = await readAll();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const [removed] = posts.splice(index, 1);
    await writeAll(posts);
    return removed;
  });
