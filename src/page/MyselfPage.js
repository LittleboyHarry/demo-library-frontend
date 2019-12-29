import React, { useEffect } from 'react'
import { Button, message, Result } from 'antd'
import { useAppContext, useLoginState } from '../hook'
import { LogoutEvent, PageSegueEvent } from '../event'
import { PageKeys } from '../page'

const secondsJumpToLoginIf = 1.2

export default function MyselfPage({ loseFocus }) {
	const { login } = useLoginState()
	const { dispatch } = useAppContext()

	useEffect(() => {
		if (!loseFocus && !login) {
			const timer = setTimeout(() => {
				message.warning(`你尚未登陆，请先登录！`);
				dispatch(new PageSegueEvent({
					target: PageKeys.LOGIN
				}))
			}, secondsJumpToLoginIf * 1000)

			return () => {
				clearTimeout(timer)
				console.log('取消自动跳转登录页')
			}
		}
	}, [login, loseFocus, dispatch])

	return login
		? <div>
			'我自己的信息…………'
		<br />
			<Button onClick={() => {
				dispatch(new LogoutEvent())
				dispatch(new PageSegueEvent({
					target: PageKeys.LOGIN
				}))
			}}>模拟退出</Button>
		</div>
		: <Result
			status="info"
			title="你尚未登陆" />
}