import React, { useState } from 'react'
import { useAsync } from 'react-use'
import { Spin, List } from 'antd'
import { useAppContext } from '../hook'
import { SearchInput } from '../component'
import { PageSegueEvent } from '../event'
import { PageKeys } from '../page'

export default function SearchPage() {
	const { searchingValue, compactedLayout, dispatch } = useAppContext()
	const [resultList, setResultList] = useState([])
	const [searching, setSearching] = useState(false)
	useAsync(async () => {
		if (searchingValue) {
			setSearching(true)

			const params = new URLSearchParams()
			params.set('name', searchingValue)

			const response = await fetch(`/api/books?${params.toString()}`)
			const json = await response.json()

			setSearching(false)
			setResultList(json)
		} else {
			setSearching(false)
			setResultList([])
		}
	}, [searchingValue])

	return <div>
		{compactedLayout && <SearchInput />}
		<Spin tip="搜索中" spinning={searching}>
			{searchingValue
				&& <List
					itemLayout="horizontal"
					dataSource={resultList}
					renderItem={({ id, name, author, press, isbn, category }) => (
						<List.Item
							onClick={() => {
								dispatch(new PageSegueEvent({
									target: PageKeys.BOOK,
									data: { bookId: id, bookName: name }
								}))
							}}>
							<List.Item.Meta
								title={name}
								description={`出版社：${press} 作者：${author} ISBN：${isbn} 类别：${category}`}
							/>
						</List.Item>
					)}
				/>}
		</Spin>
		{
			!searchingValue &&
			<div>高级搜索</div>
		}
	</div>
}