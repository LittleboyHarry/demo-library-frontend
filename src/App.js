import React, { useContext, useReducer, useEffect, useState } from 'react';
import { useAsync } from 'react-use'
import './App.css';
import { ConfigProvider as AntdConfigProvider, Layout, Typography, Menu, Button } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/styles';
import { useMockableJsonFetch } from './hook'
import { ExplorePage, CategoryPage, BookInfoPage } from './page'
import * as Event from './event'
import Debugger from './Debugger'
import * as Config from './Config'

//#region 初始化配置
moment.locale('zh-cn');
useMockableJsonFetch.enableMock = Config.enableMock
const { location, history } = window
//#endregion 初始化配置

const defaultPageKey = 'explore'
const pageMap = {
  explore: {
    name: '探索',
    component: ExplorePage
  },
  category: {
    name: '分类',
    component: CategoryPage,
  },
  book: {
    name: '图书详情',
    component: BookInfoPage
  }
}

//#region AppContext 和初始化
const AppContext = React.createContext();
const defaultContext = {
  title: null,
  user: null,
  compactedLayout: false,
  collapseSider: true,
  browsingBookId: null
}
const splitedPath = location.pathname.split('/');
const keyInUrl = splitedPath[1]
const possibleBookId = splitedPath[2]
defaultContext.pageKey = (keyInUrl in pageMap) ? keyInUrl : defaultPageKey
if (defaultContext.pageKey === 'book' && possibleBookId)
  defaultContext.browsingBookId = possibleBookId
//#endregion AppContext 和初始化

const useAppStyles = makeStyles({
  RootLayout: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  Header: {
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    '&>h1': {
      color: 'white',
      fontWeight: 'normal',
      fontSize: '1.2rem',
      marginBottom: '0',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      flexGrow: 1
    }
  },
  Sider: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0
  },
  UserButton: {
    margin: '0 1rem'
  }
})

//#region 事件处理器和 reducer
class ConfigLoadedEvent { constructor(data) { this.data = data } }
const handlerMapper = {
  [ConfigLoadedEvent]: (state, { data: { name } }) => {
    document.title = state.title = name
  },
  [Event.NavigationEvent]: (state, { key }) => {
    const newTitle = `${state.title} - ${pageMap[key].name}`
    if (state.pageKey in pageMap)
      history.replaceState({ pageKey: key }, `${state.title} - ${pageMap[key].name}`, `/${key}`)
    else
      history.pushState({ pageKey: key }, `${state.title} - ${pageMap[key].name}`, `/${key}`)

    document.title = newTitle
    state.pageKey = key
  },
  [Event.GoBackEvent]: (state, event) => {
    const { state: oldState } = history
    if (oldState) {
      const { bookId } = oldState
      if (bookId) state.browsingBookId = bookId
    }
    state.pageKey = oldState ? oldState.pageKey : defaultPageKey
  },
  [Event.AdminLoginEvent]: (state, event) => {
    state.user = {
      username: event.username
    }
  },
  [Event.AdminLogoutEvent]: (state, event) => {
    state.user = null
  },
  [Event.SiderCollapseEvent]: (state, event) => {
    state.collapseSider = event.collapse
  },
  [Event.BrowseBookEvent]: (state, event) => {
    const bookId = event.id
    history.pushState({ pageKey: 'book', bookId }, `bookId:${bookId}`, `/book/${bookId}`)


    state.browsingBookId = bookId
    state.pageKey = 'book'
  },
}

function eventReducer(oldState, event) {
  const listener = handlerMapper[event.constructor]
  const newState = { ...oldState }
  listener(newState, event)
  return newState
}
//#endregion 事件处理器和 reducer

//#region 引用的组件
function NavMenu({ inSider = false }) {
  const { pageKey, dispatch } = useContext(AppContext)

  const pageList = ['explore']
  if (Config.enableCategoryModule) pageList.push('category')

  return <Menu
    style={{ lineHeight: '64px' }}
    theme="dark"
    mode="horizontal"
    selectedKeys={[`${pageKey}`]}
    onClick={({ key }) => {
      dispatch(new Event.NavigationEvent(key))
    }}
    {...inSider && { mode: 'inline' }}
  >
    {
      pageList.map(key =>
        <Menu.Item key={key}>
          {pageMap[key].name}
        </Menu.Item>)
    }
  </Menu>
}

function Header({ onShowSider }) {
  const { title, user, compactedLayout } = useContext(AppContext)

  const styles = useAppStyles()
  const hasLogin = Boolean(user)

  return <Layout.Header className={styles.Header}>
    {title ?
      <Typography.Title level={1}>{title}</Typography.Title>
      : <div style={{ flexGrow: 1 }} />
    }
    {!compactedLayout && <NavMenu />}
    {
      hasLogin
        ? compactedLayout
          ? <Button className={styles.UserButton} shape="circle" icon="user" />
          : <Button className={styles.UserButton} shape="round" icon="user">我</Button>
        : compactedLayout
          ? <Button className={styles.UserButton} ghost shape="circle" icon="login" />
          : <Button className={styles.UserButton} ghost shape="round" icon="login">管理员</Button>
    }
    {
      compactedLayout
      && <Button
        className={styles.CollapseButton}
        icon="menu-unfold"
        ghost
        type="link"
        onClick={onShowSider}
      />
    }
  </Layout.Header>
}

function Sider({ collapsed, breakpointListener, onCollapse }) {
  const { Sider: style } = useAppStyles()

  return <Layout.Sider
    className={style}
    breakpoint="sm"
    collapsed={collapsed}
    collapsedWidth={0}
    width="66vw"
    onBreakpoint={breakpointListener}
  >
    <Button icon="right" style={{ width: '100%', height: '64px' }} type="link" ghost onClick={onCollapse} />
    <NavMenu inSider />
  </Layout.Sider>
}

function ContentContainer({ currentPageKey, footer }) {
  return <div style={{
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Layout.Content style={{ padding: '1rem 3rem', flexGrow: 1, minHeight: 'auto' }}>
      {Array.from(Object.keys(pageMap)).map(key => {
        const PageComponent = pageMap[key].component
        const looking = key === currentPageKey
        return (<div key={key} {...!looking && { style: { display: 'none' } }}>
          <PageComponent isBackground={!looking} />
        </div>)
      })}
    </Layout.Content>
    {footer}
  </div>
}
//#endregion 引用的组件

function App() {
  const [state, dispatch] = useReducer(eventReducer, defaultContext)
  const [compactedLayout, setCompactedLayout] = useState(false)

  //#region 加载配置文件
  useAsync(async () => {
    const response = await fetch('/config.json')
    dispatch(new ConfigLoadedEvent(
      await response.json()
    ))
  }, [])
  //#endregion 加载配置文件

  const styles = useAppStyles()
  const { pageKey, collapseSider } = state

  useEffect(() => {
    window.addEventListener('popstate', () => {
      dispatch(new Event.GoBackEvent())
    })
  }, [])

  return <AntdConfigProvider locale={zhCN}>
    <AppContext.Provider value={{ ...state, compactedLayout, dispatch }}>
      <Layout className={styles.RootLayout}>
        <Layout onClick={() => { if (!collapseSider) dispatch(new Event.SiderCollapseEvent(true)) }}>
          <Header
            collapsed={collapseSider}
            onShowSider={() => { dispatch(new Event.SiderCollapseEvent(false)) }} />
          <ContentContainer
            currentPageKey={pageKey}
            footer={<Layout.Footer>
              某某大学版权所有
            </Layout.Footer>} />
        </Layout>
        <Sider
          collapsed={collapseSider}
          breakpointListener={broken => {
            if (!broken)
              dispatch(new Event.SiderCollapseEvent(true))
            setCompactedLayout(broken)
          }}
          onCollapse={() => { dispatch(new Event.SiderCollapseEvent(true)) }}
        />
      </Layout>
      {Config.showDebugger && <Debugger />}
    </AppContext.Provider>
  </AntdConfigProvider >
}

App.Context = AppContext
export default App;