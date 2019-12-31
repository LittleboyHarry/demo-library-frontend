import React from 'react'
import { Skeleton, Card, Empty, List } from 'antd';
import { useAppContext } from '../hook'

export default function CategoryPage({ loseFocus }) {
	const { categories } = useAppContext()

	return <Skeleton active loading={!categories}>
		{
			categories &&
				categories.length > 0
				? <List
					grid={{ gutter: 4, xs: 1, sm: 2 }}
					dataSource={categories}
					renderItem={({ index, name }) => (
						<List.Item>
							<Card>
								{index}
								{name}
							</Card>
						</List.Item>
					)}
				/>
				: <Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					style={{ padding: '3rem 0' }}
					description="图生馆维护中 ……" />
		}
	</Skeleton>
}