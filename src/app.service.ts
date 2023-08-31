import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): any {
    return this.createGroups();
  }

  createGroups() {
    // Step 0: Read the users and userColleagueSessions from the JSON file
    const usersJSONPath = './src/__mocks__/users.json';
    const userColleagueSessionsJSONPath =
      './src/__mocks__/user-colleague-sessions.json';

    const userJsonString = fs.readFileSync(usersJSONPath, 'utf-8');
    const userColleagueSessionsJsonString = fs.readFileSync(
      userColleagueSessionsJSONPath,
      'utf-8',
    );
    const users = JSON.parse(userJsonString);
    const userColleagueSessions = JSON.parse(userColleagueSessionsJsonString);

    // Step 1: Initialize a list for new groups
    const newGroups = [];

    // Step 2 & 3: Create a mapping for user sessions and sort the users for least met
    const userSessionsMapping = users.reduce((acc, user) => {
      acc[user.id] = [];
      return acc;
    }, {});

    userColleagueSessions.forEach((session) => {
      const { user, colleague, sessionCount, lastSession } = session;

      // For user
      userSessionsMapping[user].push({
        colleagueId: colleague,
        colleagueName: users.find((u) => u.id === colleague)?.name,
        sessionCount,
        lastSession,
      });

      // TODO For Colleague
    });

    const userMasterMap = {};
    // loop over users and create a map of users with their colleagues
    users.forEach((user) => {
      if (!userMasterMap[user.id]) userMasterMap[user.id] = {};

      // ------ met colleagues in order of least met -------
      const metColleagues = userSessionsMapping[user.id].sort(
        (
          a: { sessionCount: number; latestSession: string },
          b: { sessionCount: number; latestSession: string },
        ) => {
          // TODO fix the sort by date
          if (a.sessionCount === b.sessionCount) {
            return (
              new Date(a.latestSession).getTime() -
              new Date(b.latestSession).getTime()
            );
          }
          return a.sessionCount - b.sessionCount;
        },
      );

      // ------ unmet colleagues -------
      const unmetColleagues = users
        .map((colleague) => {
          if (user.id !== colleague.id) {
            const metColleagueIds = metColleagues.map(
              (colleague) => colleague.colleagueId,
            );

            if (!metColleagueIds.includes(colleague.id)) {
              return {
                id: colleague.id,
                name: colleague.name,
                sessionCount: 0,
                latestSession: null,
              };
            }
          }
        })
        .filter(Boolean);

      // -------- colleagues in order of least met ------------
      userMasterMap[user.id].colleagues = [
        ...unmetColleagues,
        ...metColleagues,
      ];
    });

    // Step 4: Create groups
    const userNewGroupMap = {};
    Object.keys(userMasterMap).forEach((id) => {
      const userId = parseInt(id);
      console.log('-->', userMasterMap[userId]);
      // Check if user already have a group
      // If, yes, then skip
      // If, no, then create a group with two first colleagues
      if (!userNewGroupMap[userId]) {
        const user = userMasterMap[userId];

        if (user.colleagues.length && user.colleagues.length > 1) {
          const firstColleague = user.colleagues[0];
          const secondColleague = user.colleagues[1];

          // Create a new group
          const newGroup = {
            id: Math.floor(Math.random() * 1000),
            users: [userId, firstColleague.id, secondColleague.id],
            creation: new Date().toISOString(),
          };

          // Add the new group to the list of new groups
          newGroups.push(newGroup);

          // Add the group to the users' group map
          userNewGroupMap[userId] = newGroup.id;
          userNewGroupMap[firstColleague.id] = newGroup.id;
          userNewGroupMap[secondColleague.id] = newGroup.id;

          // Removed picked users from the user.colleagues list
          Object.keys(userMasterMap).forEach((uid) => {
            userMasterMap[uid].colleagues = userMasterMap[
              uid
            ].colleagues.filter(
              (colleague) =>
                colleague.id !== firstColleague.id &&
                colleague.id !== secondColleague.id &&
                colleague.id !== userId,
            );
          });
        }
      }
    });

    // Step 5: Handle remaining users

    // Step 6: Return the new groups and store the new groups

    //    // fs.writeFileSync(jsonPath, JSON.stringify(jsonData));

    return { userNewGroupMap, newGroups };
  }
}
