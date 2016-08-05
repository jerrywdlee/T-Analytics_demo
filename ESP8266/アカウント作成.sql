INSERT INTO customers ( name, ruby,sex_id, mail, birthday, age_group_id, tel,
                        zip_code, country, state, city, district, area,
                        location_lat, location_lng, tag ) VALUES
                      ( 'ESPデモ機', 'イーエスピーデモキ', 2,'espdemo@temona.co.jp', '2001-6-6',1, '03-4455-7452','1500002', '日本', '東京都', '渋谷区', '渋谷','２−１２−１９',
                        35.6586518, 139.7073775, '' )

                      イーエスピーデモキ	2	espdemo@temona.co.jp	2001-6-6	1	03-4455-7452	1500002		日本	東京都	渋谷区	渋谷	２−１２−１９	35.6586518	139.7073775

                      INSERT INTO devices (uuid, item_id, customer_id, rank_id, device_status_id, individual_follow_up_trigger_id, individual_auto_order_trigger_id)
                      VALUES ('test_esp_dev', 1, 6, 5, 2, 2, 1);
