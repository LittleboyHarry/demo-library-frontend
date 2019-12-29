import ExplorePage from './ExplorePage'
import CategoryPage from './CategoryPage'
import BookInfoPage from './BookInfoPage'
import SearchPage from './SearchPage'
import LoginPage from './LoginPage'
import MyselfPage from './MyselfPage'

export const PageKeys = {
	EXPLORE: 'explore',
	CATEGORY: 'category',
	BOOK: 'book',
	SEARCH: 'search',
	LOGIN: 'login',
	MYSELF: 'myself',
}
export const PageMap = {
	[PageKeys.EXPLORE]: {
		name: '探索',
		component: ExplorePage
	},
	[PageKeys.CATEGORY]: {
		name: '分类',
		component: CategoryPage,
	},
	[PageKeys.BOOK]: {
		name: '图书详情',
		component: BookInfoPage
	},
	[PageKeys.SEARCH]: {
		name: '搜索',
		component: SearchPage
	},
	[PageKeys.LOGIN]: {
		name: '登陆',
		component: LoginPage
	},
	[PageKeys.MYSELF]: {
		name: '关于我',
		component: MyselfPage
	},
}