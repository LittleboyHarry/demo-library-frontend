import React from 'react'
import { Button } from 'antd'
import { useAppContext } from '../hook'
import { LoginEvent, PageSegueEvent } from '../event'
import { PageKeys } from '../page'

export default function LoginPage() {
	const { dispatch } = useAppContext()

	return <div>
		123
		<Button onClick={() => {
			dispatch(new LoginEvent({
				username: '某人',
				isAdmin: true
			}))

			dispatch(new PageSegueEvent({
				target: PageKeys.MYSELF
			}))
		}}>虚拟登录</Button>
	</div>
}