import { Injectable } from '@nestjs/common';
// import { users } from './__mocks__/users';
import { userColleagueSessions } from './__mocks__/user-colleague-sessions';

@Injectable()
export class AppService {
  getHello(): string {
    this.createGroups();
    return 'Grouping people is fun!';
  }

  createGroups() {
    // Step 1: Initialize a list for new groups
    const newGroups = [];

    // Step 2: Create a mapping for user sessions
    const userSessionsMapping = {};
    userColleagueSessions.forEach((session) => {
      const { user, colleague, sessionCount, earliestGroupCreation } = session;
      if (!userSessionsMapping[user]) userSessionsMapping[user] = [];
      userSessionsMapping[user].push({
        colleague,
        sessionCount,
        earliestGroupCreation,
      });
    });

    // Step 3: Sort users by sessions
    Object.keys(userSessionsMapping).forEach((user) => {
      userSessionsMapping[user].sort(
        (
          a: { sessionCount: number; earliestGroupCreation: string },
          b: { sessionCount: number; earliestGroupCreation: string },
        ) => {
          if (a.sessionCount === b.sessionCount) {
            return (
              new Date(a.earliestGroupCreation).getTime() -
              new Date(b.earliestGroupCreation).getTime()
            );
          }
          return a.sessionCount - b.sessionCount;
        },
      );
    });

    return newGroups;
  }
}
