// PM2 Ecosystem Configuration File
// استفاده: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "samtamir.ir",
      script: "server.js",
      cwd: "/home/tamirban/samtamir.ir",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "8729",
        NEXT_PUBLIC_SITE_URL: "https://samtamir.ir",
        // سایر متغیرهای محیطی را از .env اضافه کنید
      },
      error_file: "/home/tamirban/.pm2/logs/samtamir.ir-error.log",
      out_file: "/home/tamirban/.pm2/logs/samtamir.ir-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};

