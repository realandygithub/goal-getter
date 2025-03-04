# Goal-getter

Goal-getter is a web app that helps you achieve your goals by logging your daily activities and tracking your progress. You can set goals for yourself and see how you're doing.

## TODO

- [x] Make it deploy (vercel)
- [x] Scaffold basic ui with mock data
- [ ] Add a database (vercel postgres)
- [ ] Add authentication (clerk)
- [ ] Error management (sentry)
- [ ] Add a way to set goals
- [ ] Add a way to track progress
- [ ] Add a way to see leaderboard
- [ ] Analytics (posthog)
- [ ] Rate limiting (upstash)

## Project rules

- Use pnpm instead of npm for package management
- Avoid casting in typescript and try to use proper types from the @types library. Search in npm to find proper library under @types to use if necessary.
- Use latest docs from https://sdk.vercel.ai/docs for guidance on using the ai sdk library and use the latest version of the library.
- When fixing tests, make sure to reuse types defined in the actual component it is testing to fix linting errors.
