import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { useAppContext } from '../hook'
import { Card, Typography, Skeleton, Empty, List } from 'antd';
import { makeStyles } from '@material-ui/styles'
import { PageSegueEvent } from '../event'
import { PageKeys } from '../page'

const useStyles = makeStyles({
	root: {
		userSelect: 'none',
		'&>h2': {
			fontWeight: 'normal',
			textAlign: 'center',
			margin: '1rem 0'
		}
	}
})

export default function BookGallery({ disabled = false }) {
	// TODO: 增加图书分页查询功能	
	const { dispatch } = useAppContext()
	const styles = useStyles()
	const [books, setBooks] = useState(null)

	useAsync(async () => {
		if (!disabled) {
			const response = await fetch('/api/books')
			setBooks(await response.json())
		}
	}, [disabled])

	return <div className={styles.root}>
		<Typography.Title level={2}>书库大全</Typography.Title>
		<Skeleton active loading={!books}>
			{
				books && books.length > 0
					? <List
						grid={{ gutter: 12, xs: 1, sm: 2, md: 3, lg: 4 }}
						dataSource={books}
						renderItem={({ id, name, author, press }) => (
							<List.Item
								children={
									<Card
										key={id}
										type="inner"
										style={{ cursor: 'pointer' }}
										onClick={() => {
											dispatch(new PageSegueEvent({
												target: PageKeys.BOOK,
												data: {
													bookId: id,
													bookName: name
												}
											}))
										}}
										title={
											<span title={name}>{name}</span>}
									>
										<p>作者：{author}</p>
										<p>出版社：{press}</p>
									</Card>
								} />
						)}
					/>
					: <Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ padding: '3rem 0' }}
						description="图生馆维护中 ……" />
			}
		</Skeleton>
	</div >
}
