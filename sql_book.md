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
                    default_follow_up_trigger_id int4,
                    default_auto_order_trigger_id int4,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

# recommend_usages（お勧めの使い方）
```sql
CREATE TABLE recommend_usages (
                    id serial primary key,
                    item_id int4,
                    open_per_morning float8 DEFAULT 0,
                    open_per_noon float8 DEFAULT 0,
                    open_per_night float8 DEFAULT 0,
                    open_per_day float8 DEFAULT 0,
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
                    open_per_morning float8 DEFAULT 0,
                    open_per_noon float8 DEFAULT 0,
                    open_per_night float8 DEFAULT 0,
                    open_per_day float8 DEFAULT 0,
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
                    sex_id int4,
                    mail text,
                    birthday date,
                    age_group_id int4, -- 年代
                    tel text,
                    zip_code text,
                    -- address text,
                    country text, -- 国
                    state text, -- 都道府県
                    city text, -- 市・区
                    district text, -- 町・村１(東京はここまで)
                    area text, -- 町・村２
                    location_lat float8, -- 緯度
                    location_lng float8, -- 経度
                    tag text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## sexes(性別の区分)
```sql
CREATE TABLE sexes (
                    id serial primary key,
                    sex text,
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
                    item_id int4,
                    customer_id int4,
                    rank_id int4,
                    device_status_id int2 default 1, -- 使用中？配送中？停止中？
                    individual_follow_up_trigger_id int4, -- 個別フォロアップトリガー
                    individual_auto_order_trigger_id int4, -- 個別自動注文トリガー
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## device_statuses(デバイス状態)
```sql
CREATE TABLE device_statuses (
                    id serial primary key,
                    device_status text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## follow_up_triggers(フォローアップトリガー)
```sql
CREATE TABLE follow_up_triggers (
                    id serial primary key,
                    param_1 text,
                    param_1_name text,
                    condition text,
                    condition_name text,
                    param_2 text,
                    param_2_name text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

## auto_order_triggers(自動注文トリガー)
```sql
CREATE TABLE auto_order_triggers (
                    id serial primary key,
                    param_1 text,
                    param_1_name text,
                    condition text,
                    condition_name text,
                    param_2 text,
                    param_2_name text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```


## ranks(ランクの区分)
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
                    raw_data text,
                    created_at timestamp with time zone DEFAULT clock_timestamp(),
                    updated_at timestamp with time zone DEFAULT clock_timestamp(),
                    deleted bool not null default false);
```

# select系
## 表示用デバイス一覧
```sql
SELECT dev.id, dev.uuid, item_id, item_code, item_name, customer_id, cu.name, cu.mail,
       rank, device_status,rd.remain_lvl,rd.battery_lvl,rd.opened,
       ft.param_1, ft.param_1_name, ft.condition, ft.condition_name, ft.param_2, ft.param_2_name,
       ot.param_1, ot.param_1_name, ot.condition, ot.condition_name, ot.param_2, ot.param_2_name,
       location_lat, location_lng, dev.created_at, rd.updated_at
       from devices as dev
LEFT JOIN items as i ON item_id = i.id
LEFT JOIN customers as cu ON customer_id = cu.id
LEFT JOIN ranks as r on rank_id = r.id
LEFT JOIN device_statuses as ds on device_status_id = ds.id
LEFT JOIN (SELECT * FROM (SELECT id, uuid,device_id, remain_lvl, battery_lvl, opened, updated_at, 
   row_number() over (partition by uuid order by updated_at DESC) as no
   FROM raw_datas) as raw WHERE no = 1) as rd  ON dev.uuid = rd.uuid
LEFT JOIN follow_up_triggers as ft on individual_follow_up_trigger_id = ft.id
LEFT JOIN auto_order_triggers as ot on individual_auto_order_trigger_id = ot.id
WHERE dev.deleted <> true and i.deleted <> true and cu.deleted <> true
      and r.deleted <> true and ds.deleted <> true and ft.deleted <> true and ot.deleted <> true
order by dev.updated_at desc;

```


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

## customers（使用者）
```sql
INSERT INTO customers ( name, ruby,sex_id, mail, birthday, age_group_id, tel,
                        zip_code, country, state, city, district, area,
                        location_lat, location_lng, tag ) VALUES
                      ( $1, $2, $3::int,$4, $5::date,$6::int, $7::text,
                        $8::text, $9, $10, $11, $12,
                        $13, $14::float, $15::float, $16 )
```
## デバイス

```sql
INSERT INTO devices (uuid, individual_follow_up_trigger, individual_auto_order_trigger, ) VALUES ($1::text, $2::text, $3::text);
```

## ランク
```sql
INSERT INTO ranks (rank) VALUES ($1::text);
```

## 生データ
```sql
INSERT INTO raw_datas (uuid, device_id, remain_lvl, battery_lvl, opened) VALUES ($1, $2::int, $3::int, $4::int, $5::int);
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
