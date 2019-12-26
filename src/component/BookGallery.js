import React from 'react';
import { Row, Col, Card } from 'antd';

const gap = 12
const gutter = [gap, gap]

export default ({ bookList }) =>
	<Row type="flex" {...{ gutter }}>
		{
			bookList.map((book, index) =>
				<Col span={6} {...{ index }}>
					<Card type="inner" title={book.name}>
						<p>作者：{book.author}</p>
						<p>出版社：{book.press}</p>
					</Card>
				</Col>
			)
		}
	</Row>
