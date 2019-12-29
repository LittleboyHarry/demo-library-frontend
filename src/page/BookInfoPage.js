import React from 'react'
import { Descriptions, Badge, Result, Spin, Skeleton } from 'antd'
import { useMockableJsonFetch, useAppContext, useLoginState } from '../hook'
import { getBookInfo } from '../MockData'

const { Item } = Descriptions

export default function BookInfoPage({ loseFocus }) {
	const { browsingBookId: bookId } = useAppContext()
	const { isAdmin } = useLoginState()
	const { loading, success, data: book } = useMockableJsonFetch({
		name: '获取图书信息',
		url: '/api/browser/book',
		body: {
			id: bookId
		},
		defaultData: null,
		mockData: getBookInfo(bookId),
		blocked: loseFocus
	}, [bookId])

	return <Spin spinning={loading}>
		<Skeleton active {...{ loading }} paragraph={{ rows: 8 }}>
			{success
				? book
					? <>
						<Descriptions title={book.name}>
							<Item label="作者">{book.author}</Item>
							<Item label="出版社">{book.press}</Item>
							<Item label="库存">
								<Badge status="processing" text="Running" />
							</Item>
						</Descriptions>
						{isAdmin && '管理员可以操作图书'}
					</>
					: <Result
						status="404"
						title="查无此书"
						subTitle="图书馆书库更新了"
					/>
				: <Result
					status="error"
					title="无效图书数据"
					subTitle="有问题可以进一步资讯管理员"
				/>
			}
		</Skeleton>
	</Spin>

}