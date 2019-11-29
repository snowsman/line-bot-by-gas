// Textを返す
function getTxtObj(txt) {
	return [{
		type: "text",
		text: txt,
	}];
}

// 画像を返す
function getImgObj(img_urls) {
	var res = [];

	for (var e in img_urls) {
		res.push({
			"type": "image",
			"originalContentUrl": img_urls[e],
			"previewImageUrl": img_urls[e]
		});
	}

	return res;
}

// greetingの時
function getGreetingObj(txt) {
	return {
		"type": "flex",
		"altText": "This is a flex message.",
		"contents": {
			"type": "bubble",
			"body": {
				"type": "box",
				"layout": "vertical",
				"contents": [{
					"type": "text",
					"text": txt
				}]
			}
		}
	};
}


// Wikiの時
// keyword    : botで読み込んだ単語
// wiki_title : wikiのTitle
// res_txt    : 検索結果Text
// res_img    : 検索結果画像URL
function getWikiObj(keyword, wiki_title, res_txt, res_img) {
	var bgc_obj = {
		"backgroundColor": "#fff9f0",
	};

	var res_obj = {
		"type": "flex",
		"altText": "This is a flex message.",
		"contents": {
			"type": "bubble",
			"styles": {
				"hero": bgc_obj,
				"body": bgc_obj,
				"footer": bgc_obj,
			},
			"body": {
				"type": "box",
				"layout": "vertical",
				"contents": [{
					"type": "text",
					"text": wiki_title,
					"weight": "bold",
					"size": "md",
					"color": "#06487a",
					"action": {
						"type": "uri",
						"uri": encodeURI("https://ja.wikipedia.org/wiki/" + wiki_title),
					},
				}, {
					"type": "text",
					"text": res_txt,
					"wrap": true,
					"size": "sm",
					"margin": "sm",
				}],
			},
			"footer": {
				"type": "box",
				"layout": "vertical",
				"contents": [{
					"type": "button",
					"margin": "sm",
					"height": "sm",
					"action": {
						"type": "uri",
						"label": "「" + keyword + "」検索結果",
						"uri": encodeURI("https://www.google.com/search?q=" + keyword),
					}
				}],
			}
		}
	};

	if (res_img) {
		res_obj.contents.hero = {
			"type": "image",
			"url": res_img,
			"size": "full",
			"aspectMode": "cover",
			"action": {
				"type": "uri",
				"uri": encodeURI("https://ja.wikipedia.org/wiki/" + wiki_title),
			}
		};

	}

	return [res_obj];
}


// 日付選択表示
function getRemiObj(txt) {
	var query = "type=reminder&content=" + encodeURIComponent(txt);

	var res_obj = {
		"type": "flex",
		"altText": "This is a flex message.",
		"contents": {
			"type": "bubble",
			"body": {
				"type": "box",
				"layout": "vertical",
				"contents": [{
					"type": "text",
					"text": "【リマインド内容】",
					"weight": "bold",
					"size": "sm",
				}, {
					"type": "text",
					"text": txt,
					"wrap": true,
					"size": "md",
					"margin": "sm"
				}],
			},
			"footer": {
				"type": "box",
				"layout": "vertical",
				"spacing": "sm",
				"contents": [{
					"type": "button",
					"margin": "sm",
					"height": "sm",
					"action": {
						"type": "datetimepicker",
						"label": "日付を選択する",
						"data": query,
						"mode": "datetime",
						"min": d2LFormat()
					}
				}]
			}
		}
	};

	return [res_obj];
}


// 画像検索
function getFlexImgObj(items) {
	var bubble_obj = {
		"type": "bubble",
		"size": "mega",
		"hero": {
			"type": "image",
			"url": "",
			"size": "full",
			"aspectMode": "fit",
			"aspectRatio": "1:1"
		},
		"body": {
			"type": "box",
			"layout": "vertical",
			"contents": [{
				"type": "text",
				"text": "",
				"size": "xl",
				"color": "#333333",
				"action": {
					"type": "uri",
					"uri": "",
				}
			}, {
				"type": "box",
				"layout": "baseline",
				"contents": [{
					"type": "text",
					"text": "",
					"color": "#a9a9a9",
					"size": "sm",
				}]
			}],
			"spacing": "xs",
			"paddingAll": "10px"
		}
	};

	var res_contents = [];

	for (var i = 0; i < items.length; i++) {
		// 値渡し
		var buf_bubble = JSON.parse(JSON.stringify(bubble_obj));

		// 画像はhttpsに強制的に書き換え
		buf_bubble.hero.url = items[i].link.replace(/^http:\/\//g, "https://");

		buf_bubble.body.contents[0].text = items[i].title;
		buf_bubble.body.contents[0].action.uri = items[i].image.contextLink;
		buf_bubble.body.contents[1].contents[0].text = items[i].displayLink;

		res_contents.push(buf_bubble);
	}

	var res_obj = {
		"type": "flex",
		"altText": "This is a flex message.",
		"contents": {
			"type": "carousel",
			"contents": res_contents
		}
	};

	return [res_obj];
}

// ヘルプ表示
function getHelpObj() {
	var bubble_obj = {
		"type": "bubble",
		"size": "kilo",
		"hero": {
			"type": "image",
			"url": "",
			"size": "full",
			"aspectMode": "cover",
			"aspectRatio": "3:2"
		},
		"body": {
			"type": "box",
			"layout": "vertical",
			"contents": [{
					"type": "text",
					"text": "",
					"weight": "bold",
					"size": "md",
					"wrap": true
				},
				{
					"type": "text",
					"text": "",
					"size": "xs",
					"color": "#555599",
					"margin": "sm",
					"wrap": true
				},
				{
					"type": "separator",
					"margin": "lg"
				},
				{
					"type": "text",
					"text": "",
					"size": "xs",
					"color": "#555555",
					"margin": "lg",
					"wrap": true
				},
				{
					"type": "text",
					"text": "",
					"wrap": true,
					"color": "#555599",
					"size": "xs",
					"flex": 5
				}
			],
			"spacing": "sm",
			"paddingAll": "13px"
		}
	};

	var help_list = [{
		"img_url": "xxx",
		"title": "機能名",
		"command": "コマンド",
		"eg": "【例】",
		"eg_command": "コマンド例"
	}, {
		"img_url": "xxx",
		"title": "リマインダー機能",
		"command": "bot [rem, remi, リマインダーなど] [内容] （※その後、時間を選択すると登録されます。）",
		"eg": "【例】「お迎え」とリマインド",
		"eg_command": "bot rem お迎え（※時間はその後選択）"
	}, {
		"img_url": "xxx",
		"title": "翻訳機能",
		"command": "bot [\"tra\", \"trans\", \"translate\" ,\"翻訳\", \"ほんやく\"のいずれか] [元言語(2文字) + 翻訳言語(2文字、日本語は省略可)] [文章]",
		"eg": "【例】 「This is a pen.」を英語から仏語に翻訳",
		"eg_command": "bot tra enfr This is a pen."
	}, {
		"img_url": "xxx",
		"title": "画像検索機能",
		"command": "bot [\"img\", \"image\", \"画像\", \"がぞう\"のいずれか] [単語]",
		"eg": "【例】Google画像検索で「りんご」を検索",
		"eg_command": "bot img りんご"
	}, {
		"img_url": "xxx",
		"title": "Wikipedia検索機能",
		"command": "bot [\"wiki\", \"wikipedia\", \"ウィキペディア\", \"ウィキ\", \"うぃきぺでぃあ\", \"うぃき\"のいずれか] [単語]",
		"eg": "【例】Wikipediaで「りんご」を検索",
		"eg_command": "bot wiki りんご"
	}, {
		"img_url": "xxx",
		"title": "計算機能",
		"command": "bot [\"calc\", \"cal\", \"calculation\", \"計算\" ,\"電卓\", \"けいさん\", \"でんたく\"のいずれか] [計算式]",
		"eg": "【例】「2^5 + 1」を計算",
		"eg_command": "bot calc 2^5+1"
	}, {
		"img_url": "xxx",
		"title": "乱数機能",
		"command": "bot [\"rnd\", \"rand\", \"random\" ,\"乱数\", \"らんすう\"のいずれか] [範囲開始] [範囲終了] [個数]",
		"eg": "【例】1以上10以下の乱数を3つ取得",
		"eg_command": "bot rnd 1 10 3"
	}];

	var res_contents = [];

	for (var i = 0; i < help_list.length; i++) {
		// 値渡し
		var buf_bubble = JSON.parse(JSON.stringify(bubble_obj));

		buf_bubble.hero.url = help_list[i].img_url;
		buf_bubble.body.contents[0].text = help_list[i].title;
		buf_bubble.body.contents[1].text = help_list[i].command;
		buf_bubble.body.contents[3].text = help_list[i].eg;
		buf_bubble.body.contents[4].text = help_list[i].eg_command;

		res_contents.push(buf_bubble);
	}

	var res_obj = {
		"type": "flex",
		"altText": "This is a flex message.",
		"contents": {
			"type": "carousel",
			"contents": res_contents
		}
	};

	return [res_obj];
}