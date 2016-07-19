# DB作成
```sql
#psql -U postgres
create user t_analytics with password 'postgres'; -- ユーザーの新規登録
ALTER ROLE t_analytics WITH SUPERUSER CREATEDB CREATEROLE; -- 管理人権限付与
create database t_analytics owner t_analytics; -- DB作成
```
# Table作成
## admin_users（管理者）
```sql
CREATE TABLE admin_users (
                  id serial primary key, -- auto_increment
                  email text not null UNIQUE, -- 重複不可
                  name text,
                  password text,
                  auth_id int4,
                  created_at timestamp with time zone DEFAULT clock_timestamp(), -- create timestamp with zone
                  updated_at timestamp with time zone DEFAULT clock_timestamp(), -- now()はトランザクション時間
                  deleted bool not null default false);
```

## auths（権限）
```sql
CREATE TABLE auths (
                    id serial primary key,
                    auth text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## items（商品）
```sql
CREATE TABLE items (
                    id serial primary key,
                    item_code text not null, -- 商品番号
                    item_name text,
                    info_url text, -- 紹介ページ
                    purchase_url text, -- 購入URL
                    default_follow_up_trigger text,
                    default_auto_order_trigger text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

# recommend_usages（お勧めの使い方）
```sql
CREATE TABLE recommend_usages (
                    id serial primary key,
                    item_id int4,
                    open_per_morning int2 DEFAULT 0,
                    open_per_noon int2 DEFAULT 0,
                    open_per_night int2 DEFAULT 0,
                    open_per_day int2 DEFAULT 0,
                    if_slop int2, -- 最小二乗法の傾き使うか？
                    if_intercept int2, -- 最小二乗法の切片使うか?
                    if_chi_test int2, -- カイ二乗テスト使うか？
                    if_welch_t_test int2, -- ウェルチのt検定使うか？
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## usages（各デバイスごとの使い方の統計）
```sql
-- 毎日一回算出してここに保存
CREATE TABLE usages (
                    id serial primary key,
                    device_id int4,
                    open_per_morning int2 DEFAULT 0,
                    open_per_noon int2 DEFAULT 0,
                    open_per_night int2 DEFAULT 0,
                    open_per_day int2 DEFAULT 0,
                    slop float8,
                    intercept float8,
                    chi_test float8,
                    welch_t_test float8,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## customers（使用者）
```sql
CREATE TABLE customers (
                    id serial primary key,
                    name text,
                    ruby text, -- 読み方（振仮名）
                    mail text,
                    birthday date,
                    age_group_id int4, -- 年代
                    zip_code text,
                    address text,
                    tag text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## age_groups(年代・年齢層)
```sql
CREATE TABLE age_groups (
                    id serial primary key,
                    age_group text,
                    upper_to int4 not null default 9999, -- 上限
                    lower_to int4 not null default 0, -- 下限
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## device(デバイス)
```sql
CREATE TABLE devices (
                    id serial primary key,
                    uuid text,
                    rank_id int4,
                    if_in_delivering int2 default 0, -- 商品配送中フラグ
                    individual_follow_up_trigger text, -- 個別フォロアップトリガー
                    individual_auto_order_trigger text, -- 個別自動注文トリガー
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## ranks(デバイスごとのランク)
```sql
CREATE TABLE ranks (
                    id serial primary key,
                    rank text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## raw_data(生データ)
```sql
CREATE TABLE raw_datas (
                    id serial primary key,
                    uuid text,
                    device_id int4,
                    remain_lvl int8,
                    battery_lvl int8,
                    opened int2,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

# select系
# insert系
## auths(デフォルトの権限)
```sql
INSERT INTO auths (auth) VALUES ('god'),('admin'),('user');
-- 検査用
select * from auths where deleted <> true;
```

## age_groups(年代・年齢層)
```sql
INSERT INTO age_groups (age_group,upper_to,lower_to) VALUES
                       ('10代',19,0),
                       ('20代',29,20),
                       ('30代',39,30),
                       ('40代',49,40),
                       ('50代',59,50);
-- 検査用
select * from age_groups where deleted <> true;
```

# update系
```sql
update age_groups set age_group = '50代以上', upper_to = DEFAULT , updated_at = now() where age_group = '50代';
```
# delete系

# その他
## テーブルの削除
```sql
drop table table_name1, table_name2, … [CASCADE | RESTRICT];
```
