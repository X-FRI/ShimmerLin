/**
 * 开发环境种子数据
 *
 * 注意:
 * 1. 鉴于可能存在的表间约束关系, 需要数据的添加顺序
 */

import { User } from "../generated/autumn-bot";
import * as autumnData from "./data";
import { PrismaClient } from "../generated/autumn-bot";
import { DBClient } from "./autumn-db-client";

// import chalk from "chalk";
const chalk = require("chalk");

function validateEnvironment() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("禁止在生产环境执行Seeding过程");
  }
}

type SeedResultLengthCheck = {
  resultLength: number;
  rawLength: number;
  passed: boolean;
};

function seedingResultLengthCheck(seedsConfig: {
  [x: string]: { result: any[]; raw: any[] };
}): {
  [x: string]: SeedResultLengthCheck;
} {
  // 检查seedsConfig中所有result的长度是否等于raw的长度, 并返回每一个seed的检查结果是否通过 { seedName: { resultLength, rawLength, passed: boolean } }
  const result = {};
  for (const [seedName, seed] of Object.entries(seedsConfig)) {
    result[seedName] = {
      resultLength: seed.result.length,
      rawLength: seed.raw.length,
      passed: seed.result.length === seed.raw.length,
    };
  }
  return result;
}

function outputSeedingResultLengthCheck(lengthChecks: {
  [x: string]: SeedResultLengthCheck;
}) {
  let successCount = 0;
  let failedCount = 0;

  console.log("=== Seeding长度检查 ===");

  for (const [seedName, seed] of Object.entries(lengthChecks)) {
    if (seed.passed) {
      successCount++;
    } else {
      failedCount++;
    }

    const checkStatus = seed.passed ? chalk.green("通过") : chalk.red("未通过");

    console.log(
      `${chalk.yellow(seedName.padEnd(50))}: ${checkStatus} ${seed.resultLength}/${seed.rawLength}`,
    );
  }

  console.log(`总计: ${successCount + failedCount}`);
  console.log(
    `成功: ${chalk.green(successCount)} 失败: ${chalk.red(failedCount)}`,
  );
}

const prisma = new PrismaClient();

async function main() {
  validateEnvironment();

  const dbClient = new DBClient(prisma);

  await dbClient.seedUsers(autumnData.usersRaw as unknown as User[]);

  // 获取seed summary
  const seedSummary = dbClient.getSeedSummary();
  console.log("\n=== Seed Summary ===\n");
  for (const summary of seedSummary) {
    const status = summary.success ? chalk.green("成功") : chalk.red("失败");
    const duration = `${summary.duration}ms`;
    console.log(
      `${status} ${chalk.yellow(summary.name.padEnd(50))}: ${duration} ${summary.count}`,
    );
    // 罗列详细检查
    for (const [checkName, check] of Object.entries(summary.checks)) {
      const checkStatus = check.passed
        ? chalk.green("通过")
        : chalk.red("未通过");
      console.log(
        `  ${chalk.yellow(checkName.padEnd(50))}: ${checkStatus} ${check.resultLength}/${check.rawLength}`,
      );
    }
  }

  // 检查Seeding结果长度
  // const lengthChecks = seedingResultLengthCheck(seeds);
  // 输出Seeding结果长度检查结果
  // outputSeedingResultLengthCheck(lengthChecks);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
