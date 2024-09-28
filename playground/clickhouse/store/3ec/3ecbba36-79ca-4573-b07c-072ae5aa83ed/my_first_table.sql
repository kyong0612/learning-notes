ATTACH TABLE _ UUID '179f8ee3-606c-40b8-aba7-53011f5c54a3'
(
    `user_id` UInt32,
    `message` String,
    `timestamp` DateTime,
    `metric` Float32
)
ENGINE = MergeTree
PRIMARY KEY (user_id, timestamp)
ORDER BY (user_id, timestamp)
SETTINGS index_granularity = 8192
