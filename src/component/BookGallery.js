import React from 'react';
import { useMockableJsonFetch } from './../hook'
import { Row, Col, Card, Typography, Skeleton, Button, Result, Empty } from 'antd';

const gap = 12
const gutter = [gap, gap]

function makeRepeated(arr, repeats) {
	return Array.from({ length: repeats }, () => arr).flat()
}

const exampleBookList = makeRepeated([
	{
		name: '教你做人',
		author: '贾鱼村',
		press: '清清大学出版社'
	}, {
		name: '修仙日记',
		author: '风清扬',
		press: '电子手工业出版社'
	}, {
		name: '做男人如何保护好自己的发际线',
		author: '扫地增',
		press: '人人邮电出版社'
	}, {
		name: '大学没压力',
		author: '混世膜王',
		press: '轮子出版社'
	}], 4)



export default function () {
	// TODO: 增加图书分页查询功能	

	const { loading, success, data } = useMockableJsonFetch('所有图书', {
		url: '/api/book/get',
	}, [], exampleBookList)

	return <div style={{ userSelect: 'none' }}>
		<Typography.Title level={2} children="书库大全" style={{ textAlign: 'center' }} />
		<Skeleton active {...{ loading }}>
			{
				success ?
					data.length > 0 ?
						<Row type="flex" {...{ gutter }}>
							{
								data.map((book, key) =>
									<Col span={6} {...{ key }}>
										<Card type="inner" title={book.name}>
											<p>作者：{book.author}</p>
											<p>出版社：{book.press}</p>
										</Card>
									</Col>
								)
							}
						</Row>
						: <Empty style={{padding:'3rem 0'}} description="图生馆维护中 ……"/>
					: <Result
						status="error"
						title="网络异常"
						subTitle="请稍后重试"
						extra={
							<Button type="primary" icon="refresh" onClick={()=>{location.reload()}}>
								刷新
					  </Button>}
					/>
			}
		</Skeleton>
	</div >
}
