#!/usr/bin/env node
const { Command } = require('commander');
const pkg = require('./package.json');

const version = require('./src/version');
const rsync = require('./src/rsync');
const sourcemap = require('./src/sourcemap');
const backup = require('./src/backup');

const program = new Command();

// program.addHelpText('beforeAll', ``);

program.version(pkg.version, '-v, --version', '版本信息');
program.helpOption('-h, --help', '帮助信息');
program.usage('[command] [options]');

program
  .command('version')
  .description('生成当前项目 git 版本信息（构建前使用）')
  .action(() => {
    version();
  });

program
  .command('bak')
  .description('备份文件')
  .requiredOption('-a, --appId <appId>', 'dora系统中的项目唯一标识')
  .requiredOption('-u, --url <url>', 'dora 系统的备份上传接口')
  .action((options) => {
    console.log(options);
  });

program
  .command('map')
  .description('上传 sourcemap 到 dora 监控服务')
  .requiredOption('-a, --appId <appId>', 'dora系统中的项目唯一标识')
  .requiredOption('-u, --url <url>', 'dora系统中的项目唯一标识')
  .action((options) => {
    const { appId, url } = options;
    sourcemap({ appId, url });
  });

program
  .command('rsync')
  .description(`同步 build 资源发布到远程机器`) // (优化：先同步静态资源，再同步html文件)
  .requiredOption('-i, --ip <ip>', '服务器ip')
  .requiredOption('-u, --user <user>', '用户')
  .requiredOption('-b, --build <build>', 'build打包后的文件')
  .requiredOption('-r, --remoteDir <remoteDir>', 'web部署地址')
  // .option('-e, --exclude [exclude]', '排除文件', ".map")
  .action((options) => {
    const { ip, user, build, remoteDir } = options;
    rsync({ ip, user, build, remoteDir });
  });

program.addHelpText(
  'afterAll',
  `
--------------------------------
本工具配合 Dora 监控系统，使用效果更佳
`
);

program.parse(process.argv);