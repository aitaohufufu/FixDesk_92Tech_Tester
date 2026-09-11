
```bash
# set up
npm init playwright@latest

# node modules
npm install
# .env package
npm install dotenv --save-dev

# playwright & node re install (if error)
rm -rf node_modules package-lock.json
npm install
npx playwright install

# execute
npx playwright test --ui

# report
npx playwright show-report

```