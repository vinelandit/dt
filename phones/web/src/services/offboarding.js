import { useQuasar } from 'quasar'
const $q = useQuasar()

const offboarding = {
  unsetAlreadyPlayed: function() {
    $q.cookies.remove('already_played')
  },
  setAlreadyPlayed: function() {
    $q.cookies.set('already_played', 1)
  },
  hasPlayed: function() {
    return $q.cookies.has('already_played')
  }
}
export default offboarding