// Postで送られてくるデータ取得
function doPost(e) {
	var json = JSON.parse(e.postData.contents);

	// 返信する為のToken取得
	var reply_token = json.events[0].replyToken;
	if (typeof reply_token === "undefined") {
		return;
	}

	var type = json.events[0].type;
	if (typeof type === "undefined") {
		return;
	}

	var res = false;

	// ポストバックの時
	if (type == "postback") {
		res = processPostBack(json.events[0]);
	} else {
		// 送られたLINEメッセージを取得
		var user_msg = json.events[0].message.text;
		if (typeof user_msg === "undefined") {
			return;
		}

		// 各処理を行なった後の返信メッセージObject
		res = allocation(user_msg, json);
	}

	if (res) {
		// データを送信する
		resp = sendData({
			"messages": res,
			"replyToken": reply_token
		}, "reply");

		// エラーログ
		if (Object.keys(JSON.parse(resp)).length != 0) {
			console.log("Input:\n\'", user_msg, "\', \nResponse:\n", resp, ", \nRequest:\n", res);
		}
	}

	return ContentService.createTextOutput(JSON.stringify({
		"content": "post ok"
	})).setMimeType(ContentService.MimeType.JSON);
}


// 処理を振り分け、行なったものを返す
function allocation(user_msg, post_data) {
	var res = null;
	var split_msg = user_msg.split(/[\s ,、\r\n]+/m);
	var bot = split_msg[0].match(/^(bot|ぼっと|ボット|ﾎﾞｯﾄ)/im);

	// メッセージの最初がbotかどうか
	if (bot != null && split_msg.length >= 2) {
		var arg_msg = {
			"raw": user_msg,
			"splt": split_msg
		};

		// 乱数
		// 「bot 乱数 範囲開始 範囲終了 個数」形式
		if (split_msg[1].match(/(乱数|らんすう|rnd|rand|random)/gim) != null) {
			res = processRand(arg_msg);
		}

		// 翻訳
		// 「bot 翻訳 元言語 翻訳言語 文章」形式
		else if (split_msg[1].match(/(翻訳|ほんやく|tra|trans|translate)/im) != null) {
			res = processTranslate(arg_msg);
		}

		// Wikipedia
		// 「bot ウィキペディア 単語」形式
		else if (split_msg[1].match(/(ウィキペディア|ウィキ|うぃきぺでぃあ|うぃき|wiki|wikipedia)/im) != null) {
			res = processWiki(arg_msg);
		}

		// Google画像検索
		// 「bot 画像 単語」形式
		else if (split_msg[1].match(/(画像|がぞう|img|image)/im) != null) {
			res = processImg(arg_msg);
		}

		// 計算
		// 「bot 計算 数式」形式
		else if (split_msg[1].match(/(計算|電卓|けいさん|でんたく|cal|calc|calculation)/im) != null) {
			res = processMath(arg_msg);
		}

		// リマインダー
		// 「bot リマインダー」形式
		else if (split_msg[1].match(/(リマインダー|りまいんだー|rem|remi|reminder)/im) != null) {
			res = processRemi(arg_msg);
		}

		// ログ（デバッグ用）
		// 「bot log」形式
		else if (split_msg[1].match(/(log)/im) != null) {
			res = processLog(post_data);
		}

		// ヘルプ
		// 「bot (その他任意)」形式
		else {
			res = processHelp();
		}

	} else if (bot != null) {
		// ヘルプ
		// 「bot」のみなど
		res = processHelp();

	} else {
		// 定型文を返す
		// greeting_listはprocess.gsに存在
		for (var key in greeting_list) {
			if (user_msg == key) {
				res = greeting(key);
				break;
			}
		}
	}

	return res;
}


// データを送信する
function sendData(post_obj, send_type) {
	var resp = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/" + send_type, {
		"headers": {
			"Content-Type": "application/json; charset=UTF-8",
			"Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
		},
		"method": "post",
		"payload": JSON.stringify(post_obj),
		"muteHttpExceptions": true,
	});

	return resp;
}


// Debug用
function test_bot() {
	var user_msg = "bot 翻訳\r\n frja\r\n C'est bien!";
	var res = allocation(user_msg);
	Logger.log(res);
}