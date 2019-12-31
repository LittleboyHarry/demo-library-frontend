import React, { useState, useEffect } from 'react'
import { Spin, Button, message, notification, Typography } from 'antd'
import { useLoginState, useAppContext } from '../hook'
import { PageSegueEvent } from '../event'
import { PageKeys } from './'
import { BookForm } from '../component'
import { ObjectToFormData } from '../util'
import { useAsync } from 'react-use'

const jumpToLoginAfterSeconds = 3

function modifyBook({ bookId, data, onSuccess }) {
	const hideMessage = message.loading('服务器响应中..')
	fetch(`/api/books/${bookId}`, {
		method: 'PUT',
		body: ObjectToFormData(data)
	})
		.then(response => response.json())
		.then(code => {
			if (code === true) {
				notification.success({
					message: '已修改',
					duration: 3
				})
				onSuccess()
			}
			else return Promise.reject(new Error('服务器修改失败'))
		}).catch(reason => {
			notification.error({
				message: '修改失败',
				description: reason.toString()
			})
		}).finally(() => {
			hideMessage()
		})
}

export default function BookModifyPage({ loseFocus }) {
	const { modifyingBookId: bookId, dispatch } = useAppContext()
	let { isAdmin } = useLoginState()
	const [fetching, setFetching] = useState(false)
	const [bookInfo, setBookInfo] = useState(null)

	useEffect(() => {
		if (!loseFocus && !isAdmin)
			setTimeout(() => {
				dispatch(new PageSegueEvent({
					target: PageKeys.LOGIN
				}))
			}, jumpToLoginAfterSeconds * 1000)
	}, [loseFocus, isAdmin, dispatch])

	useAsync(async () => {
		if (isAdmin && !loseFocus && (bookId || bookId === 0)) {
			setFetching(true)
			const response = await fetch(`/api/books/${parseInt(bookId)}`)
			const data = await response.json()
			setBookInfo(data)
			setFetching(false)
		} else
			setFetching(false)
	}, [bookId, isAdmin])

	return <>
		<Spin spinning={fetching}>
			<Typography.Title level={2} style={{ fontWeight: 'normal' }} children="图书信息修改" />
			{!loseFocus && <BookForm
				submitButton={
					<Button type="primary" shape="round" icon="edit" size="large" >
						修改
				</Button>}
				rawBookInfo={bookInfo}
				onSubmit={(data) => {
					modifyBook({
						bookId, data, onSuccess: () => {
							dispatch(new PageSegueEvent({ target: PageKeys.EXPLORE }))
						}
					})
				}} />}
		</Spin>
	</>
}