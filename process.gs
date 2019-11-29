// 定型文を返す
function greeting(msg) {
	var reply_message = [greeting_list[msg]];

	// 返信メッセージ
	return reply_message.map(function (v) {
		return getGreetingObj(v);
	});
}

// 乱数を返す
function processRand(arg) {
	if (arg.splt.length >= 5) {
		var rnd_num = getRandNum(arg.splt[2], arg.splt[3], arg.splt[4]);
		var res = "[得られた乱数]\n";
		for (var e in rnd_num) {
			res += rnd_num[e] + "\n";
		}

		// 末尾の\nを削除
		return getTxtObj(res.slice(0, -1));
	} else {
		var err_msg = "乱数機能を利用するには以下の形式で入力してください。\n";
		err_msg += "bot [rnd, random, 乱数など] [最小の数] [最大の数] [個数]\n";
		err_msg += "e.g.)1以上10以下の乱数3つの場合\nbot rnd 1 10 3";
		return getTxtObj(err_msg);
	}
}

// start <= x <= fin の乱数をloop個取得する
function getRandNum(start, fin, loop) {
	var res = [];
	for (var i = 1; i <= loop; i++) {
		var mt = new MersenneTwister();
		var rnd = mt.nextInt(parseInt(start, 10), parseInt(fin, 10) + 1);
		res.push(String(rnd));
	}
	return res;
}


// 翻訳を返す
function processTranslate(arg) {
	// デフォルトは英語から日本語
	var lng = ["en", "ja"];
	var text = "";

	if (arg.splt[2] != null && arg.splt[3] != null) {
		if (arg.splt[2].length == 4) {
			// 指定言語が4文字の場合
			lng = [arg.splt[2].slice(0, 2), arg.splt[2].slice(2, 4)];
			text = arg.raw.slice(arg.raw.indexOf(arg.splt[3]));
		} else if (arg.splt[2].length == 2) {
			// 指定言語が2文字の場合
			lng[0] = arg.splt[2];
			text = arg.raw.slice(arg.raw.indexOf(arg.splt[3]));
		} else {
			text = arg.raw.slice(arg.raw.indexOf(arg.splt[3]));
		}
	} else {
		var err_msg = "翻訳機能を利用するには以下の形式で入力してください。\n";
		err_msg += "bot [tra, translate, 翻訳など] [元言語(2字)と翻訳言語(2字, 日本語の場合は省略可)] [任意の文など]\n";
		err_msg += "e.g.)bot tra en This is a pen.";
		return getTxtObj(err_msg);
	}

	// 全角を半角に
	for (var e in lng) {
		lng[e] = lng[e].replace(/[Ａ-Ｚａ-ｚ]/g, function (s) {
			return String.fromCharCode(s.charCodeAt(0) - 65248);
		});
	}

	try {
		var msg = LanguageApp.translate(text, lng[0], lng[1]);
	} catch (e) {
		console.log("Translate Error!\nInput: ", arg.raw, "\n", e);
		var msg = e.message;
	}

	return getTxtObj(msg);
}


// Wikipedia検索結果を返す
function processWiki(arg) {
	if (arg.splt[2] != null) {
		var keyword = arg.raw.slice(arg.raw.indexOf(arg.splt[2]));
		return searchWiki(keyword);
	} else {
		var err_msg = "Wikipedia検索機能を利用するには以下の形式で入力してください。\n";
		err_msg += "bot [wiki, wikipedia, うぃきなど] [検索単語など]\n";
		err_msg += "e.g.)bot wiki りんご";
		return getTxtObj(err_msg);
	}
}

// Wikipediaから検索結果取得
function searchWiki(keyword) {
	// Googleで検索
	var url = "https://www.googleapis.com/customsearch/v1/?cx=" + GOOGLE_CSE_ID + "&key=" + GOOGLE_API_KEY + "&q=site%3Awikipedia.org+";
	url += encodeURIComponent(keyword);

	try {
		var resp = UrlFetchApp.fetch(url).getContentText();
		var res_items = JSON.parse(resp).items;

		var reg_exp = /https:\/\/ja\.wikipedia\.org\/wiki\/(.+?)(\/|)$/;
		var wiki_title = "";
		for (var e in res_items) {
			var reg_res = res_items[e].link.match(reg_exp);
			if (reg_res[1]) {
				wiki_title = reg_res[1];
				break;
			}
		}

		if (wiki_title == "") {
			throw new Error("Not found by google.");
		}

		var content_url = "https://ja.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=" + wiki_title;
		var content_json = UrlFetchApp.fetch(content_url).getContentText();
		content_json = JSON.parse(content_json);
		var pageid = content_json.parse.pageid;
		var content = content_json.parse.text["*"].match(/<p.*?>([\s\S]*?)<\/p>/im);

	} catch (e) {
		console.log("[", keyword, "] is not found. (searchWiki)\nError: ", e);
		return getTxtObj("単語が見つかりませんでした。");
	}

	if (content[1] != null) {
		var res_txt = content[1].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
	} else {
		return getTxtobj("本文が見つかりませんでした。");
	}

	var res_img = null;

	try {
		var img_url = "https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=images&titles=" + wiki_title;
		var img_json = UrlFetchApp.fetch(img_url).getContentText();
		var imgs = JSON.parse(img_json).query.pages[pageid].images;
		for (var elm in imgs) {
			var matched_tlt = imgs[elm].title.match(/:(.*jpg|.*jpeg|.*png|.*gif)$/i);
			if (matched_tlt != null) {
				res_img = encodeURI("https://commons.wikimedia.org/w/thumb.php?w=400&f=" + matched_tlt[1]);
				break;
			}
		}
	} catch (e) {
		// 画像が見つからなかった時
		console.log("Image of [", keyword, "] is not found. (searchWiki)\nError: ", e);
	}

	return getWikiObj(keyword, decodeURIComponent(wiki_title), res_txt, res_img);
}


// 画像検索
function processImg(arg) {
	if (arg.splt[2] != null) {
		var keyword = arg.raw.slice(arg.raw.indexOf(arg.splt[2]));
		return searchImg(keyword);
	} else {
		var err_msg = "画像検索機能を利用するには以下の形式で入力してください。\n";
		err_msg += "bot [img, image, 画像など] [検索単語など]\n";
		err_msg += "e.g.)bot img りんご";
		return getTxtObj(err_msg);
	}
}

// 画像を検索する
function searchImg(keyword) {
	var url = "https://www.googleapis.com/customsearch/v1/?searchType=image&cx=" + GOOGLE_CSE_ID + "&key=" + GOOGLE_API_KEY + "&q=";
	url += encodeURIComponent(keyword);

	try {
		var resp = UrlFetchApp.fetch(url, {
			"muteHttpExceptions": true
		}).getContentText();
		var res_items = JSON.parse(resp).items;

		if (!res_items) {
			throw new Error("Not found by google.");
		}

	} catch (e) {
		console.log("[", keyword, "] is not found. (searchImg)\nError: ", e);
		return getTxtObj("画像が見つかりませんでした。");
	}

	return getFlexImgObj(res_items);
}


// 計算
function processMath(arg) {
	try {
		var eqn = arg.raw.slice(arg.raw.indexOf(arg.splt[2]));
		var ans = UrlFetchApp.fetch("http://api.mathjs.org/v4/?expr=" + encodeURIComponent(eqn)).getContentText();
		return getTxtObj(ans);
	} catch (e) {
		console.log("Eqn of [", eqn, "] is not found. (processMath)\nError: ", e);

		var err_msg = "計算機能を利用するには以下の形式で入力してください。\n";
		err_msg += "bot [cal, calc, 計算など] [計算式]\n";
		err_msg += "e.g.)bot cal 1+10";
		return getTxtObj(err_msg);
	}
}

// ヘルプ
function processHelp() {
	return getHelpObj();
}

// リマインダー
function processRemi(arg) {
	if (arg.splt[2] != null) {
		text = arg.raw.slice(arg.raw.indexOf(arg.splt[2]));

		return getRemiObj(text);
	} else {
		var err_msg = "リマインダー機能を利用するには以下の形式で入力してください。\n";
		err_msg += "bot [rem, remi, リマインダーなど] [内容]\n";
		err_msg += "e.g.)bot rem お金を持っていく";
		return getTxtObj(err_msg);
	}
}

// ログ
function processLog(data) {
	writeSheet(log_sheet, [
		[dFormat(), JSON.stringify(data)]
	]);

	return getTxtObj("OK!");
}

// Debug用
function test_process() {
	var user_msg = "林檎";
	var res = searchWiki(user_msg);
	Logger.log(res);
}