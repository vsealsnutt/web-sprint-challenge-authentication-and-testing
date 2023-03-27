const db = require('../../data/dbConfig');

async function add(user) {
    const [id] = await db('users').insert(user);
    return db('users').where('id', id).first();
}

function findById(id) {
    return db('users').where({ id }).first();
}

module.exports = {
    add,
    findById
}