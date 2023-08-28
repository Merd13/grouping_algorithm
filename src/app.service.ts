import { Injectable } from '@nestjs/common';
import { users } from './__mocks__/users';
import { userColleagueSessions } from './__mocks__/user-colleague-sessions';

@Injectable()
export class AppService {
  getHello(): any {
    return this.createGroups();
  }

  createGroups() {
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

      userMasterMap[user.id].metColleagues = userSessionsMapping[user.id];

      userMasterMap[user.id].unmet = users
        .map((colleague) => {
          if (user.id !== colleague.id) {
            const metColleagueIds = userMasterMap[user.id].metColleagues.map(
              (colleague) => colleague.colleagueId,
            );

            if (!metColleagueIds.includes(colleague.id)) {
              return {
                id: colleague.id,
                name: colleague.name,
              };
            }
          }
        })
        .filter(Boolean);

      userMasterMap[user.id].leastMetColleagues = userMasterMap[
        user.id
      ].metColleagues.sort(
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
    });

    // Step 4: Group users with unmet colleagues
    // users.forEach((user) => {
    //   const colleaguesData = userSessionsMapping[user.id];
    //   const unmetColleagues = colleaguesData.filter(
    //     (c) => c.sessionCount === 0,
    //   );

    //   if (unmetColleagues.length >= 2) {
    //     const group = {
    //       users: [
    //         user.id,
    //         unmetColleagues[0].colleague,
    //         unmetColleagues[1].colleague,
    //       ],
    //     };
    //     newGroups.push(group);
    //   }
    // });

    // // Step 5: Group users with least-met colleagues
    // users.forEach((user) => {
    //   if (newGroups.some((group) => group.users.includes(user.id))) return;

    //   const colleaguesData = userSessionsMapping[user.id];
    //   if (colleaguesData.length >= 2) {
    //     const group = {
    //       users: [
    //         user.id,
    //         colleaguesData[0].colleague,
    //         colleaguesData[1].colleague,
    //       ],
    //     };
    //     newGroups.push(group);
    //   }
    // });

    // // Step 6: Handle remaining users
    // const remainingUsers = users.filter(
    //   (user) => !newGroups.some((group) => group.users.includes(user.id)),
    // );
    // while (remainingUsers.length >= 3) {
    //   const group = {
    //     users: [
    //       remainingUsers.pop().id,
    //       remainingUsers.pop().id,
    //       remainingUsers.pop().id,
    //     ],
    //   };
    //   newGroups.push(group);
    // }
    return userMasterMap;
  }
}
