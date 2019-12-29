import { useContext } from 'react'
import App from '../App'

export default function useAppContext() {
	return useContext(App.Context)
}