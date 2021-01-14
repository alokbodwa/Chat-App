const users = [];

// Join users to chat
function userJoin(id,username,room){
    const user = { id, username, room };

    users.push(user);
    return user;
}

// /Get Current User
function getCurrentUser(id){
    const user = users.find(user => user.id === id );
    return user;
}

// function getUSersInSameRoom(room){
//     const UsersInTheSameRoom = users.filter(user => user.room === room);
// }

function userLeaves(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0]; // putting index 0 will return the deleted element
    }
}

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
}