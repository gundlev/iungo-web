import firebaseUtils from '../utils/firebaseUtils'

export default function requireAuth(nextState, replaceState) {
  if (!firebaseUtils.isLoggedIn())
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
}
