CREATE TABLE T_RESERVE (
    reserve_id int(12) NOT NULL AUTO_INCREMENT,
    date DATE COLLATE utf8_unicode_ci NOT NULL,
    T_1 int(12) COLLATE utf8_unicode_ci,
    T_2 int(12) COLLATE utf8_unicode_ci,
    T_3 int(12) COLLATE utf8_unicode_ci,
    T_4 int(12) COLLATE utf8_unicode_ci,
    T_5 int(12) COLLATE utf8_unicode_ci,
    T_6 int(12) COLLATE utf8_unicode_ci,
    T_7 int(12) COLLATE utf8_unicode_ci,
    T_8 int(12) COLLATE utf8_unicode_ci,
    T_9 int(12) COLLATE utf8_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (reserve_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci