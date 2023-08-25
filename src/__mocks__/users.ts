export const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Doe' },
  { id: 3, name: 'Smith' },
  { id: 4, name: 'Jane' },
  { id: 5, name: 'Mary' },
  { id: 6, name: 'Peter' },
  { id: 7, name: 'Paul' },
  { id: 8, name: 'Mark' },
  { id: 9, name: 'Luke' },
  { id: 10, name: 'James' },
  // { id: 11, name: 'Jude' },
  // { id: 12, name: 'Thomas' },
  // { id: 13, name: 'Andrew' },
  // { id: 14, name: 'Philip' },
  // { id: 15, name: 'Bartholomew' },
  // { id: 16, name: 'Matthew' },
  // { id: 17, name: 'Simon' },
  // { id: 18, name: 'Thaddaeus' },
  // { id: 19, name: 'Judas' },
  // { id: 20, name: 'Matthias' },
];

export const usersMap = Object.fromEntries(
  users.map((user) => [user.id, user]),
);
