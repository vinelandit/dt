import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app,router}) => {
  app.use(router)
  console.log('fuck off',router)
})
