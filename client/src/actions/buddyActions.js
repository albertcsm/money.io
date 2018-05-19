import { database } from '../firebaseApp.js';

export function fetchBuddies() {
  return dispatch => {
    var usersRef = database.ref('users');
    database.ref('groups/default/users').once('value')
      .then(snap => snap.val())
      .then(membersObject => Object.keys(membersObject).map(userId => 
        Object.assign(membersObject[userId], { id: userId })))
      .then(members => {
        const promises = [];
        members.forEach(member => promises.push(usersRef.child(member.id).once('value')));
        return Promise.all(promises).then(usernaps => {
          for (let i = 0; i < members.length; i++) {
            Object.assign(members[i], usernaps[i].val());
          }
          return members;
        });
      })
      .then(buddies => dispatch({ type: 'FETCH_BUDDIES', data: buddies }));
  };
};