# A股涨停监控 Android 客户端

这是 A股涨停监控系统的 Android 客户端开源工程，基于 Capacitor 将移动端 Web 页面打包为 APK。

## 项目定位

- 这是纯 Android 客户端 / WebView Shell。
- 后端服务、行情采集、AI 分析、代理配置、数据库和密钥不包含在本仓库中。
- APK 默认连接线上后端：`https://www.chinastock.top`。
- WebSocket 默认连接：`wss://www.chinastock.top/api/ws`。

## 目录结构

```text
.
├── android/                 # Capacitor 生成的 Android 原生工程
├── web/dist/                # 内置到 APK 的移动端静态页面
│   ├── app-config.js        # API / WebSocket 地址配置
│   ├── app-runtime.js       # 运行时 URL 处理
│   ├── index.html           # 首页
│   └── market.html          # 大盘分析页
├── capacitor.config.json    # Capacitor 配置
├── package.json             # Node / Capacitor 依赖和脚本
├── package-lock.json        # npm 锁文件
└── README.md
```

## 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本
- JDK 17 或更高 LTS 版本
- Android Studio
- Android SDK
- Windows、macOS 或 Linux 均可构建

当前工程已验证：

- Capacitor 6
- Android Gradle Plugin 8.2.1
- Gradle Wrapper 8.2.1
- JDK 21 LTS

## 首次准备

安装依赖：

```bash
npm install
```

同步 Web 资源到 Android 工程：

```bash
npm run android:sync
```

如果你修改了 `web/dist` 中的页面或配置，每次构建 APK 前都需要重新执行一次同步。

## 配置后端地址

默认配置文件：

```text
web/dist/app-config.js
```

默认内容：

```js
window.STOCK_MONITOR_APP_CONFIG = {
    API_BASE_URL: "https://www.chinastock.top",
    WS_BASE_URL: "wss://www.chinastock.top/api/ws"
};
```

如果你要连接自己的后端，可以修改这里的域名，然后执行：

```bash
npm run android:sync
```

## Windows 编译 Debug APK

确保 `JAVA_HOME` 指向 JDK 17 或更高版本。

PowerShell 示例：

```powershell
$env:JAVA_HOME = "D:\Program Files\Java\jdk-21.0.11"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
```

如果 Gradle 提示找不到 Android SDK，请创建：

```text
android/local.properties
```

写入你本机的 SDK 路径，例如：

```properties
sdk.dir=C:/Users/Administrator/AppData/Local/Android/Sdk
```

然后执行：

```powershell
npm run android:sync
Set-Location android
.\gradlew.bat assembleDebug
```

或在仓库根目录执行：

```powershell
npm run build:android:debug:windows
```

Debug APK 输出位置：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## macOS / Linux 编译 Debug APK

确保已安装 JDK 和 Android SDK，并设置好 `JAVA_HOME` / `ANDROID_HOME`。

```bash
npm install
npm run android:sync
cd android
./gradlew assembleDebug
```

或在仓库根目录执行：

```bash
npm run build:android:debug:unix
```

Debug APK 输出位置：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## 使用 Android Studio 编译

```bash
npm install
npm run android:sync
npm run android:open
```

Android Studio 打开后，可以直接运行或使用菜单构建 APK。

## 发布到 GitHub

如果要把当前目录作为独立仓库开源，可以在 `android-client` 目录执行：

```bash
git init
git add .
git commit -m "开源安卓客户端"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

发布前建议先根据你的实际授权意愿选择并添加开源许可证，例如 MIT、Apache-2.0 或 GPL。

## Release 签名包

本仓库不包含签名密钥。

正式发布前请自行生成 keystore，并在 Android Studio 或 Gradle 中配置签名。不要把 `.jks`、`.keystore`、密码或任何密钥文件提交到 GitHub。

## 常见问题

### 1. 构建后页面不是最新的

修改 `web/dist` 后忘记同步。执行：

```bash
npm run android:sync
```

然后重新构建。

### 2. JAVA_HOME is not set

安装 JDK 17 或更高 LTS 版本，并设置 `JAVA_HOME`。Windows 可在系统环境变量中永久配置。

### 3. SDK location not found

创建 `android/local.properties`，写入本机 Android SDK 路径：

```properties
sdk.dir=你的AndroidSdk路径
```

### 4. WebSocket 连接失败

确认后端反向代理支持 WebSocket Upgrade，并且 `wss://www.chinastock.top/api/ws` 可以从手机网络访问。

## 开源注意事项

- 本仓库只应包含客户端代码。
- 不要提交后端 `.env`、API Key、代理账号、数据库、日志和签名密钥。
- 如果更换后端域名，请只修改 `web/dist/app-config.js`。
