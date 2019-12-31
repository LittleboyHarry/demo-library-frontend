import React, { useState } from 'react'
import { useAsync, useDebounce } from 'react-use'
import { Descriptions, Badge, Result, Spin, Skeleton, Button, Icon, Popover, Row, Divider, Card, Popconfirm, message, Switch, notification } from 'antd'
import { useAppContext, useLoginState } from '../hook'
import { makeStyles } from '@material-ui/styles'
import { PageSegueEvent } from '../event'
import { PageKeys } from './'

const { Item } = Descriptions
const ButtonGroup = Button.Group

const useStyles = makeStyles({
	PinModifyBox: {
		background: '#f7f7f7',
		borderRadius: 4,
		marginTop: 24,
	},
	Gap: {
		height: '2rem'
	}
})

function deleteBook({ bookId, onFinish }) {
	const hideMessage = message.loading('服务器响应中..')
	fetch(`/api/books/${bookId}`, { method: 'DELETE' })
		.then(response => response.json())
		.then(code => {
			if (code === true) message.success('已删除')
			else return Promise.reject(new Error('服务器删除失败'))
		}).catch(reason => {
			notification.error({
				message: '删除失败',
				description: reason.toString()
			})
		}).finally(() => {
			hideMessage()
			onFinish()
		})
}

function ModifyBox({ pin = false, onTogglePin, bookId, bookName, borrowed, onToggleBorrowed }) {
	const { dispatch } = useAppContext()
	const styles = useStyles()
	const modifyTools = <Row type="flex" justify="space-around" style={{ width: 400 }}>
		<Switch
			checkedChildren="借出"
			unCheckedChildren="可借"
			checked={borrowed}
			onClick={onToggleBorrowed} />
		<Button type="primary" icon="edit" onClick={() => {
			dispatch(new PageSegueEvent({
				target: PageKeys.MODIFY,
				data: { bookId, bookName }
			}))
		}}>修改</Button>
		<Popconfirm
			title="这会永久删除图书信息"
			onConfirm={() => {
				deleteBook({
					bookId,
					onFinish: () => { dispatch(new PageSegueEvent({ target: PageKeys.EXPLORE })) }
				})
			}}
			okText="确定"
			okType="danger"
			trigger="click"
		>
			<Button type="danger" icon="close-circle" >删除记录</Button>
		</Popconfirm>
	</Row>

	return <>
		<Row type="flex" justify="center">
			<ButtonGroup>
				<Popover content={modifyTools} {...pin && { visible: false }}>
					<Button size="large" icon="form" {...pin && { disabled: true }}>
						管理
			</Button>
				</Popover>
				<Button size="large" {...pin && { type: 'primary' }} onClick={() => { if (onTogglePin) onTogglePin() }}>
					<Icon type="pushpin" />
				</Button>
			</ButtonGroup>
		</Row >
		<Row type="flex" justify="center">
			{
				pin &&
				<Card bordered={false} className={styles.PinModifyBox}>{modifyTools}</Card>
			}
		</Row>
	</>
}

export default function BookInfoPage({ loseFocus }) {
	const { browsingBookId: bookId } = useAppContext()
	const [pinModifyBox, setPinModifyBox] = useState(false)
	let { isAdmin } = useLoginState()
	const [fetching, setFetching] = useState(false)
	const [bookInfo, setBookInfo] = useState(null)
	const [borrowed, setBorrowed] = useState(null)
	const styles = useStyles()

	useAsync(async () => {
		if (!loseFocus && (bookId || bookId === 0)) {
			setFetching(true)
			const response = await fetch(`/api/books/${parseInt(bookId)}`)
			const data = await response.json()
			setBookInfo(data)
			if (data) setBorrowed(data.borrowed)
			setFetching(false)
		} else
			setFetching(false)
	}, [bookId, loseFocus])

	useDebounce(() => {
		if (bookInfo) {
			const formData = new FormData()
			formData.set('borrowed', borrowed)
			fetch(`/api/books/${bookId}`, {
				method: 'PUT',
				body: formData
			})
		}
	}, 200, [borrowed, bookInfo])

	return <Spin spinning={fetching}>
		<div className={styles.Gap} />
		<Skeleton active loading={fetching} paragraph={{ rows: 8 }}>
			{bookInfo
				? <>
					<Descriptions title={bookInfo.name}>
						<Item label="作者">{bookInfo.author}</Item>
						<Item label="出版社">{bookInfo.press}</Item>
						<Item label="ISBN">{bookInfo.isbn}</Item>
						<Item label="类别">{bookInfo.category}</Item>
						<Item label="库存">
							<Badge
								status={borrowed ? 'default' : 'success'}
								text={borrowed ? '被借出' : '可借阅'} />
						</Item>
					</Descriptions>
					{isAdmin && <>
						<Divider />
						<ModifyBox
							pin={pinModifyBox}
							onTogglePin={() => { setPinModifyBox(!pinModifyBox) }}
							onToggleBorrowed={() => { setBorrowed(!borrowed) }}
							{...{ bookId, borrowed, bookName: bookInfo.name }} />
					</>}
				</>
				: <Result
					status="404"
					title="查无此书"
					subTitle="图书馆书库更新了"
				/>
			}
		</Skeleton>
	</Spin>

}