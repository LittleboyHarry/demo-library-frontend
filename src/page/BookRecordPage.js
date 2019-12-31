import React, { useEffect, createRef } from 'react'
import { Result, Button, message, notification, Typography } from 'antd'
import { useLoginState, useAppContext } from '../hook'
import { PageSegueEvent } from '../event'
import { PageKeys } from './'
import { BookForm } from '../component'
import { ObjectToFormData } from '../util'

const jumpToLoginAfterSeconds = 3

function addBook({ data, onSuccess }) {
	const hideMessage = message.loading('服务器响应中..')
	fetch(`/api/books`, {
		method: 'POST',
		body: ObjectToFormData(data)
	})
		.then(response => response.json())
		.then(code => {
			if (code === true) {
				notification.success({
					message: '已添加',
					duration: 2
				})
				onSuccess()
			}
			else return Promise.reject(new Error('服务器添加失败'))
		}).catch(reason => {
			notification.error({
				message: '添加失败',
				description: reason.toString()
			})
		}).finally(() => {
			hideMessage()
		})
}

export default function BookRecordPage({ loseFocus }) {
	let { isAdmin } = useLoginState()
	const { dispatch } = useAppContext()

	useEffect(() => {
		if (!loseFocus && !isAdmin)
			setTimeout(() => {
				dispatch(new PageSegueEvent({
					target: PageKeys.LOGIN
				}))
			}, jumpToLoginAfterSeconds * 1000)
	}, [loseFocus, isAdmin, dispatch])

	const formRef = createRef()

	return isAdmin
		? <>
			<Typography.Title level={2} style={{ fontWeight: 'normal' }} children="录入新书" />
			{!loseFocus && <BookForm
				submitButton={
					<Button type="primary" shape="round" icon="check" size="large" >
						提交
				</Button>}
				onSubmit={(data) => {
					addBook({ data, onSuccess: () => { formRef.current.form.resetFields() } })
				}}
				wrappedComponentRef={formRef} />}
		</>
		: <Result
			status="warning"
			title="需要管理员登陆，才能录入图书"
		/>
}