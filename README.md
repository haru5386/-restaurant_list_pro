# 我的餐廳清單
**一個使用 Node.js + Express 打造的餐廳美食網站。**

## 產品功能如下：
 * 使用者可以新增一家餐廳
 * 使用者可以瀏覽一家餐廳的詳細資訊
 * 使用者可以瀏覽全部所有餐廳
 * 使用者可以修改一家餐廳的資訊
 * 使用者可以刪除一家餐廳
 * 使用者可以照名字、地區、類別順序篩選排序
 
## 使用者認證系統
 * 使用者可以註冊帳號，註冊的資料包括：名字、email、密碼、確認密碼。其中 email 與密碼是必填欄位，但名字不是
 * 如果使用者已經註冊過、沒填寫必填欄位、或是密碼輸入錯誤，就註冊失敗，並回應給使用者錯誤訊息
 * 使用者也可以透過 Facebook Login 直接登入
 * Facebook Login Callback URL 需為 “http://localhost:3000/auth/facebook/callback”
 * 使用者的密碼要使用 bcrypt 來處理
 * 使用者必須登入才能使用餐廳清單，如果沒登入，會被導向登入頁面
 * 登入後，使用者可以建立並管理專屬他的一個餐廳清單
 * 使用者登出、註冊失敗、或登入失敗時，使用者都會在畫面上看到正確而清楚的系統訊息

## 環境建置：
 1. Mongodb
 2. Node.js
 
## 使用者預設資料：
1. 第一位使用者：
     * email: user1@example.com
     * password: 12345678

2. 第二位使用者：
     * email: user2@example.com
     * password: 12345678

## 下載方法：
 1. 打開終端機，Clone 此專案至本機電腦
 
```
git clone https://github.com/haru5386/-restaurant_list_pro
```

2. 進入存放此專案的資料夾

```
cd restaurant_list_pro
```

3. 安裝 npm 套件，

```
npm install
```

4. 加入種子資料

```
npm run seed
```

5. 啟動網頁伺服器

```
npm run dev
```

6. 顯示`Express is running on http://localhost:3000，mongodb connected`
   表示成功進入
