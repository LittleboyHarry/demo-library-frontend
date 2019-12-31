import React from 'react'
import { useReducer } from "react";
import * as Event from './event'
import { PageKeys, PageMap } from './page'
import { enableCategoryModule } from './Config'

const { location, history } = window

function isObjectInList(object, list) {
	return list.indexOf(object) !== -1
}

// 默认页面
export const defaultPageKey = PageKeys.EXPLORE
// 导航页面
export const navPageList = [PageKeys.EXPLORE]
if (enableCategoryModule) navPageList.push(PageKeys.CATEGORY)

//#region AppContext 和初始化
const AppContext = React.createContext();
export default AppContext

const defaultContext = {
	title: null,
	user: null,
	compactedLayout: false,
	collapseSider: true,
	showDrawer: false,
	browsingBookId: null,
	searchingValue: '',
	globalWaiting: false,
	modifyingBookId: null,
	categories: null
}
const splitedPath = location.pathname.split('/');
const keyInUrl = splitedPath[1]
const possibleBookId = splitedPath[2]
defaultContext.pageKey = (keyInUrl in PageMap) ? keyInUrl : defaultPageKey
if (defaultContext.pageKey === PageKeys.BOOK && possibleBookId)
	defaultContext.browsingBookId = possibleBookId
//#endregion AppContext 和初始化


function changeStateByPageSegueEvent(state, event) {
	switch (event.targetPageKey) {
		case PageKeys.EXPLORE:
			document.title = `${state.title}`
			break;
		case PageKeys.CATEGORY:
			document.title = `${state.title} - 分类`
			break;
		case PageKeys.BOOK: {
			const { bookId, bookName } = event.data
			state.browsingBookId = bookId
			document.title = `《${bookName}》介绍`
		} break;
		case PageKeys.SEARCH:
			state.searchingValue = event.data.value
			break;
		case PageKeys.LOGIN:
			document.title = `登陆${state.title}`
			break;
		case PageKeys.MYSELF:
			document.title = `登陆${state.title}`
			break;
		case PageKeys.RECORED_NEW:
			document.title = `录入新书`
			break;
		case PageKeys.MODIFY: {
			const { bookId, bookName } = event.data
			state.modifyingBookId = bookId
			document.title = `正在修改《${bookName}》`
		} break;
		default:
			throw new Error('跳转到程序无法解析的页面')
	}
	state.pageKey = event.targetPageKey
}

const handlerMapper = {
	[Event.ConfigLoadedEvent]: (state, { data: { name, categories } }) => {
		document.title = state.title = name
		state.categories = categories
	},
	[Event.GoBackEvent]: (state, event) => {
		const { state: oldEvent } = history
		if (oldEvent)
			changeStateByPageSegueEvent(state, oldEvent)
		else
			state.pageKey = defaultPageKey
	},
	[Event.ShowDrawerEvent]: (state, event) => {
		state.showDrawer = event.open
	},
	[Event.PageSegueEvent]: (state, event) => {
		const currentPageKey = state.pageKey
		const { targetPageKey } = event

		//#region 历史记录更新
		switch (targetPageKey) {
			case PageKeys.BOOK:
				const { bookId } = event.data
				history.pushState(event, null, `/${targetPageKey}/${bookId}`)
				break;
			case PageKeys.SEARCH:
			case PageKeys.RECORED_NEW:
			case PageKeys.MODIFY:
				// 不计入历史记录
				break;
			default:
				if (currentPageKey !== targetPageKey) {
					if (
						isObjectInList(targetPageKey, navPageList) &&
						isObjectInList(currentPageKey, navPageList)
					)
						history.replaceState(event, null, `/${targetPageKey}`)
					else
						history.pushState(event, null, `/${targetPageKey}`)
				} // else do nothing
		}
		//#endregion 历史记录更新

		changeStateByPageSegueEvent(state, event)
	},
	[Event.LoginEvent]: (state, event) => {
		state.user = event.user
	},
	[Event.LogoutEvent]: (state, event) => {
		state.user = null
	},
	[Event.ResponsiveEvent]: (state, event) => {
		state.compactedLayout = event.compacted
	},
}

function eventReducer(oldState, event) {
	const listener = handlerMapper[event.constructor]
	const newState = { ...oldState }
	listener(newState, event)
	return newState
}

export function useAppState() {
	const [state, dispatch] = useReducer(eventReducer, defaultContext)
	return { ...state, dispatch }
}