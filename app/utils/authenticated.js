import firebaseUtils from '../utils/firebaseUtils'

export default function requireAuth(nextState, replaceState) {
  if (!firebaseUtils.loggedInUser())
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
}
