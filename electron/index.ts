import { app, BrowserWindow, Notification, Menu, ipcMain   } from 'electron'
import path from 'path'
//app 控制应用程序的事件生命周期。
//BrowserWindow 创建并控制浏览器窗口。
 
let win: BrowserWindow | null;
//定义全局变量获取 窗口实例
 
const createWindow = () => {
    win = new BrowserWindow({
        //
        width: 400,
        height: 400,
        webPreferences: {
            devTools: true,
            contextIsolation: false,
            nodeIntegration: true
            //允许html页面上的javascipt代码访问nodejs 环境api代码的能力（与node集成的意思）
        },
        frame: false,
        transparent: true,
    })
    console.log(app.isPackaged, 'app.isPackaged')
    console.log(__dirname, '__dirname')
    if (app.isPackaged) {
        console.log(process.env.NODE_ENV)
        console.log(__dirname, '../dist/index.html')
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    } else {
        win.loadURL(`${process.env['VITE_DEV_SERVER_URL']}`)
    }
}
//isPackage 不好使换下面的
  //  if(process.env.NODE_ENV != 'development'){
      //  win.loadFile(path.join(__dirname, "../index.html"));
  //  }else{
        //win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SE//RVER_PORT']}`)
   // }
//在Electron完成初始化时被触发
const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'editMenu' }
  {
    label: '设置',
    submenu: [
      { label:'复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },

    ]
  },
  // { role: 'fileMenu' }
  {
    label: '退出',
    submenu: [
      isMac ? {label: '关闭', role: 'close' } : { label: '退出', role: 'quit' }
    ]
  }, 

]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if(process.platform != 'darwin'){
    app.quit()
  }
})
// app.on('activate', () => {
//   createWindow()
// })