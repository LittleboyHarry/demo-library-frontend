import React, { useReducer } from 'react'
import { useAsync } from 'react-use'
import { notification, Button, Icon } from 'antd'
import { makeStyles } from '@material-ui/styles';

const defaultParam = {
	method: 'get',
	body: null
}

function resultReducer(oldState, result) {
	switch (result.prototype) {
		case SuccessResult:
			return {
				loading: false,
				success: true,
				data: result.data
			}
		case FailureResult:
			return {
				loading: false,
				success: false,
				data: result.data
			}
		default:
			throw new Error('Invalid result!');
	}
}

const useCodeBlockStyle = makeStyles({
	root: {
		maxHeight: '5rem',
		backgroundColor: '#ffebeb',
		color: 'red',
		padding: '4px'
	}
})

function SuccessResult(data) {
	this.prototype = SuccessResult
	this.data = data
}

function FailureResult(defaultData) {
	this.prototype = FailureResult
	this.data = defaultData
}

const mockLoadingIcon = <Icon type="loading" style={{ color: '#108ee9' }} />
const placement = 'bottomRight'

function useMockableJsonFetch(name, param, defaultData = null, mock = null) {
	const { url, method, body } = { ...defaultParam, ...param }

	const [state, dispatch] = useReducer(resultReducer, {
		loading: true,
		success: false,
		data: defaultData
	})

	const codeBlockStyle = useCodeBlockStyle()

	useAsync(async () => {
		const startTimestamp = new Date()
		if (useMockableJsonFetch.enableMock) {
			const key = `request-${name}-${startTimestamp}-${Math.random()}`
			notification.open({
				message: `模拟请求 - ${name}`,
				description: '',
				icon: mockLoadingIcon,
				key,
				placement,
				btn:
					<Button.Group>
						<Button type="primary" size="small" onClick={() => {
							notification.close(key)
							dispatch(new SuccessResult(mock))
						}}>通过</Button>
						<Button type="danger" size="small" onClick={() => {
							notification.close(key)
							dispatch(new FailureResult(defaultData))
						}}>拦截</Button>
					</Button.Group>,
				duration: 0,
			})
		} else {
			try {
				const response = await fetch(url, { method, body })
				const json = await response.json()
				dispatch(new SuccessResult(json))
			} catch (error) {
				const durationSecond = Math.floor(((new Date()).getTime() - startTimestamp.getTime()) / 1000)
				notification.error({
					message: '发送网络请求异常',
					placement,
					description: (
						<div>
							请求操作 {name} 时，发生异常<br />
							持续时长：{Math.floor(durationSecond / 60)}分 {durationSecond % 60}秒<br />
							<p>详细异常：</p>
							<pre className={codeBlockStyle.root}>{`${error}`}</pre>
						</div>),
					duration: 0
				})
				dispatch(new FailureResult(defaultData))
			}
		}
	}, [body, mock])

	return state
}

useMockableJsonFetch.enableMock = false;

export default useMockableJsonFetch;