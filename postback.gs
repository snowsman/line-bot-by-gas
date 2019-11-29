// ポストバックを処理
function processPostBack(json) {
	var query = {};
	var pair = json.postback.data.split('&');
	for (var i = 0; pair[i]; i++) {
		var kv = pair[i].split('=');
		query[kv[0]] = kv[1];
	}

	if (query.type == "reminder") {
		var txt = decodeURIComponent(query.content);
		var date = dFormat(json.postback.params.datetime, LINE_FORMAT, "YYYY/MM/DD HH:mm");
		var u_id = json.source.userId;
		var g_id = "";

		if (json.source.groupId) {
			g_id = json.source.groupId;
		}

		writeSheet(task_sheet, [[date, g_id, u_id, txt, dFormat()]]);

		return getTxtObj(date + " にリマインダー登録完了!");
	} else {
		return false;
	}
}