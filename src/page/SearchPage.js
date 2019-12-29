import React from 'react'
import { useAppContext } from '../hook'
import { Input } from 'antd'

export default function SearchPage() {
	const { searchingValue, compactedLayout } = useAppContext()

	return <div>
		{compactedLayout && <Input />}
		正在搜索 {searchingValue}
	</div>
}