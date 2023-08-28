# Algorithm: Create groups of users

## Approach: One Group per User per Execution


## Description:
We want to create a program that receives a list of the users, a list of the previous groups and their creation date, and a user (participant) list, and per each user the count of sessions with all other users. Then it makes groups of 3 members each and groups the users. The program should try to group each user with the other users that haven’t met before. Until there’s no new user for a given user, then it will try to group the user with the other users that they have met least. And even between two options with the exact count, it prioritizes the one with the group's earliest creation date.

## Inputs:
- List of users
  Example:
  ```
  users = [ { id: 1, name: 'John' }, { id: 2, name: 'Doe' }, { id: 3, name: 'Smith' }, { id: 4, name: 'Jane' }, { id: 5, name: 'Mary' } ]
  ```

- List of previous groups `previousGroupings`, and the creation date time of the group
  Example:
  ```
  previousGroupings = [ { id: 1, name: 'Group 1', users: [1, 2, 3], creation: '2021-01-01T13:00:00Z', }, { id: 2, name: 'Group 2', users: [4, 5, 6], creation: '2021-04-01T18:00:00Z', } ]
  ```

User colleague session data
Example: userColleagueSessions = [ { user: 1, colleague: 2, sessionCount: 1, lastSession: '2021-01-01', }, { user: 1, colleague: 3, sessionCount: 1, lastSession: '2021-01-01', }]


## Output:
  List of groups, where each group contains 3 members/ users


## Steps:

1. Initialize a list for new groups: Create a list `newGroups` that will store the new groups.

2. Create a mapping for user sessions: Use the `userColleagueSessions` to build a dictionary where each key is a user, and the value is a list of tuples containing colleague, session count, and the earliest group creation date with that colleague.

3. Sort users by sessions: For each user, sort their colleague information by session count (ascending) and by the earliest creation date (ascending) in case of a tie.

4. Group users with unmet colleagues: Iterate through the list of users, and for each user, create a group with the first two unmet colleagues if possible. If a group is successfully created, add it to `newGroups` and continue with the next user.

5. Group users with least-met colleagues: If there are no unmet colleagues for a user, try to create a group with the first two colleagues that have the least session count and earliest creation date. Add the group to `newGroups` if successful.

6. Handle remaining users: If some users remain ungrouped, group them together as best as possible, following the same criteria. If necessary, modify existing groups or create new ones.

7. Return new groups: Return the `newGroups` list, which contains the newly created groups of users.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).