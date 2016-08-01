# 名前
1. たまごアナリティクス(Tamago Analytics)
2. ソムリエちゃん(Little Sommelier)(英語)
3. ソムリエちゃん(La Sommeliette)(変形したフランス語・造語)

# 環境構築
## ユーザーの作成
```
# useradd -g t_analytics -p t_analytics t_analytics
```

## Postgresの設定
```sql
#psql -U postgres
create user t_analytics with password 'postgres'; -- ユーザーの新規登録
-- ALTER ROLE t_analytics WITH SUPERUSER CREATEDB CREATEROLE; -- 管理人権限付与
create database t_analytics owner t_analytics; -- DB作成
```

## [nvmのインストール](https://github.com/creationix/nvm)
```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
```

## node.jsのインストール
```sh
nvm install node
```

## 本レポジトリのダウンロード
```sh
git clone -b t_analytics https://github.com/TEMONA/rchecker.git
```

## 依頼パッケージのインストール
```sh
cd t_analytics
npm install

npm install forever -g
# foreverはsudoする必要があるかも
```

## データベースの作成
```sh
node rake_db.js
```

# アプリの起動
## 起動
```sh
forever start app.js
```

## Logの監視(例)
```
$ forever list
data:        uid  command                               script forever pid  id logfile                             uptime
data:    [0] pZf6 /usr/local/Cellar/node/5.8.0/bin/node app.js 2244    2245    /Users/jerrywdlee/.forever/pZf6.log 0:0:0:7.633

$ tail -f /Users/jerrywdlee/.forever/pZf6.log
```

## 終了
```sh
$ forever stop pZf6
#または
$ forever stopall
```
