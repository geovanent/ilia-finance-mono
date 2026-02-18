/**
 * Generates TypeScript from users.proto using protoc and ts-proto.
 * Requires protoc installed on the system.
 * Run: npm run generate:proto
 */
import { execSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const protoPath = join(__dirname, 'shared/grpc/users.proto');
const outDir = join(__dirname, 'shared/grpc/generated');

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

try {
  execSync(
    `npx protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=${outDir} --ts_proto_opt=esModuleInterop=true ${protoPath}`,
    { stdio: 'inherit', cwd: join(__dirname, '..') },
  );
  console.log('Proto generated successfully.');
} catch {
  console.warn(
    'generate-proto: protoc not found or failed. Using hand-written types.',
  );
}
