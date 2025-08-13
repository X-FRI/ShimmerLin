import { PrismaClient as ShimmerLinPrismaClient } from "../generated/shimmer-lin";

type SeedOperation = {
  name: string;
  startTime: Date;
  endTime?: Date;
  count: number | null;
  checks: {
    lengthCheck: {
      rawLength: number;
      resultLength: number;
      passed: boolean;
    };
  };
  success: boolean;
  error?: Error;
};

// Seeding fucntion class
export class DBClient {
  private dbClient: ShimmerLinPrismaClient;
  private seedOperations: SeedOperation[] = [];

  constructor(dbClient: ShimmerLinPrismaClient) {
    this.dbClient = dbClient;
  }

  private checkLength<T, K>(rawData: K[], resultLength: number) {
    return {
      rawLength: rawData.length,
      resultLength,
      passed: rawData.length === resultLength,
    };
  }

  private async trackSeedOperation<K>(
    name: string,
    rawData: K[],
    operation: () => Promise<number>,
  ): Promise<number> {
    const seedOperation: SeedOperation = {
      name,
      startTime: new Date(),
      count: 0,
      success: false,
      checks: {
        lengthCheck: {
          rawLength: rawData.length,
          resultLength: 0,
          passed: false,
        },
      },
    };

    try {
      const result = (await operation()) as number;
      seedOperation.success = true;
      seedOperation.count = result;
      seedOperation.checks.lengthCheck = this.checkLength(rawData, result);
      return result;
    } catch (error) {
      seedOperation.success = false;
      seedOperation.checks.lengthCheck = this.checkLength(rawData, 0);
      seedOperation.error = error as Error;
      throw error;
    } finally {
      seedOperation.endTime = new Date();
      this.seedOperations.push(seedOperation);
    }
  }

  // Add a method to get seed summary
  getSeedSummary() {
    return this.seedOperations.map((op) => ({
      name: op.name,
      duration: op.endTime ? op.endTime.getTime() - op.startTime.getTime() : 0,
      count: op.count,
      checks: op.checks,
      success: op.success,
      error: op.error?.message,
    }));
  }

  // E.g:
  // async seedUsers(users: User[]) {
  //   return this.trackSeedOperation("Users", users, async () => {
  //     const result = await this.dbClient.user.createMany({
  //       data: users,
  //     });
  //     return result.count;
  //   });
  // }
}
