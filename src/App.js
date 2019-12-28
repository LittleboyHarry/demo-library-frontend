import React, { useState, useEffect } from 'react';
import './App.css';
import { ConfigProvider as AntdConfigProvider, Layout, Typography } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { BookGallery } from './component'
import { useMockableJsonFetch } from './hook'
import Debugger from './Debugger'
moment.locale('zh-cn');

useMockableJsonFetch.enableMock = true

const AppContext = React.createContext();

function App() {
  const [account, setAccount] = useState(null)
  const [title, setTitle] = useState()
  useEffect(() => {
    (async () => {
      const response = await fetch('/config.json')
      const { title } = await response.json()
      document.title = title
      setTitle(title)
    })()
  }, [])

  return <AntdConfigProvider locale={zhCN}>
    <AppContext.Provider value={{
      account,
      setAccount,
      title
    }}>
      <Layout style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Layout.Header
          style={{
            userSelect: 'none',
            display: 'flex',
            alignItems:
              'center'
          }}>
          {title ?
            <Typography.Title level={1} style={{
              color: 'white',
              fontWeight: 'normal',
              fontSize: '1.2rem',
              marginBottom: '0',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flexGrow: 1
            }}>{title}</Typography.Title> :
            <div style={{ flexGrow: 1 }} />}


        </Layout.Header>
        <div style={{
          flexGrow: 1,
          overflowY: 'auto'
        }}>
          <Layout.Content style={{ padding: '1rem 3rem' }}>
            <BookGallery />
          </Layout.Content>
          <Layout.Footer>
            某某大学版权所有
          </Layout.Footer>
        </div>
      </Layout>
      <Debugger />
    </AppContext.Provider>
  </AntdConfigProvider>
}


App.Context = AppContext
export default App;