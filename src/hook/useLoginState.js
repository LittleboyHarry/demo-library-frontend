import { useAppContext } from '../hook'

export default function useLoginState() {
	const { user } = useAppContext()

	return {
		login: Boolean(user),
		isAdmin: user ? user.isAdmin : false
	}
}