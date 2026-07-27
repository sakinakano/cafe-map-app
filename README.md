# Cafe Map App ☕️

Googleマップ上でお気に入りのカフェを投稿・管理できるWebアプリです。

【URL】
https://cafe-map-app-git-main-sakinakanos-projects.vercel.app/

【テストアカウント】
メールアドレス：test@gmail.com
パスワード：test1234

---

# 使用技術

## フロントエンド

- Next.js 15
- React
- TypeScript
- Tailwind CSS

## バックエンド

- Supabase
  - Authentication
  - Database
  - Storage

## 地図

- Google Maps JavaScript API
- @vis.gl/react-google-maps

---

# 主な機能

## 認証

- 新規登録
- ログイン
- ログアウト

---

## カフェ投稿

- カフェを投稿
- 複数画像アップロード
- GoogleMapから位置取得
- 投稿編集
- 投稿削除

---

## GoogleMap

- カフェをピン表示
- ピンクリックで詳細表示
- 投稿画像を表示

---

## お気に入り

- お気に入り登録
- お気に入り解除
- お気に入り一覧

---

## マイページ

- プロフィール表示
- 名前変更
- アイコン画像変更
- 自分の投稿一覧

---

## 絞り込み

- 全件表示
- お気に入りのみ
- 自分の投稿のみ

---

# データベース設計

## users

|カラム|型|
|---|---|
|id|uuid|
|name|text|
|img_url|text|

---

## cafes

|カラム|型|
|---|---|
|id|uuid|
|user_id|uuid|
|name|text|
|address|text|
|latitude|float|
|longitude|float|
|description|text|
|image_urls|text[]|

---

## favorites

|カラム|型|
|---|---|
|id|uuid|
|user_id|uuid|
|cafe_id|uuid|

---

# 画面一覧

- トップページ
- ログイン
- カフェ投稿
- カフェ編集
- お気に入り一覧
- マイページ
- プロフィール編集

---

# 工夫した点

## 画像アップロード

画像はSupabase Storageへ保存し、
StorageのURLをDatabaseへ保存しています。

複数画像にも対応しています。

---

## お気に入り機能

favoritesテーブルを作成し、

```
ユーザー
    ↓
favorites
    ↓
カフェ
```

という中間テーブルで管理しています。

---

## GoogleMap

Google Maps APIを利用し、
データベースの緯度・経度から自動でピン表示しています。

---

## 今後追加予定

- コメント機能
- レビュー評価
- タグ検索
- ページング
- 無限スクロール
- Googleログイン
- カフェ検索
- レスポンシブ対応強化