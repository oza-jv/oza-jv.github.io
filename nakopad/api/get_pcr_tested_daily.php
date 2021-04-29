<?php
	// 厚生労働省のオープンデータから，CSVファイルを取得する
	// https://www.mhlw.go.jp/stf/covid-19/open-data.html

	mb_http_output('UTF-8');
	mb_internal_encoding('UTF-8');
	header('Content-Type: text/plain; charset=UTF-8');

	// PCR検査実施人数
	$result = file_get_contents('https://www.mhlw.go.jp/content/pcr_tested_daily.csv');
	print( $result );
?>
