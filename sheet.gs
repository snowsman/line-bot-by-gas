// 最後行に追加
function writeSheet(sheet, data) {
	var lrow = sheet.getLastRow() + 1;
	sheet.getRange(lrow, 1, data.length, data[0].length).setValues(data);
}

// 2行目以降全て取得
function getSheetAll(sheet) {
	var lrow = sheet.getLastRow();
	var res = sheet.getRange(2, 1, lrow - 1, 5).getValues();
	return res;
}

// リマインドを毎分探す
function searchTask() {
	var notices = [];
	var del_row = [];

	var tasks = getSheetAll(task_sheet);

	for (var i = 0; i < tasks.length; i++) {
		if (Moment.moment(tasks[i][0]).diff(Moment.moment(), "m") <= 0) {
			notices.push(tasks[i]);
			del_row.unshift(i + 2);
		}
	}

	if (del_row.length > 0) {
		// 下の行から削除
		del_row.forEach(function (e) {
			task_sheet.deleteRow(e);
		});


		// リマインダーを送る
		notices.forEach(function (e) {
			var send_obj = {
				"messages": getTxtObj("【リマインダー】\n" + e[3]),
				"to": e[2]
			};

			// group_idがある時
			if(e[1] != ""){
				send_obj.to = e[1];
			}

			var resp = sendData(send_obj, "push");

			// エラーログ
			if (Object.keys(JSON.parse(resp)).length != 0) {
				console.log("Response:\n", resp, ", \nRequest:\n", send_obj);
			}
		});
	}
}

var DEFALT_FORMAT = "YYYY/MM/DD HH:mm:ss";
var LINE_FORMAT = "YYYY-MM-DD[T]HH:mm";

// 時間の表記を変更
function dFormat(date, format, after_format) {
	if(!after_format) {
		after_format = DEFALT_FORMAT;
	}
	return Moment.moment(date, format).format(after_format);
}

// 時間の表記をLINE用に変更
function d2LFormat(date) {
	return Moment.moment(date).format(LINE_FORMAT);
}