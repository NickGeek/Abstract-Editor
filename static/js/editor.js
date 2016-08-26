var rendered = false;
$(document).ready(function() {
	var currentDocument = {
		id: 0,
		title: "",
		text: "",
	}

	var converter = new showdown.Converter({
		prefixHeaderId: true,
		parseImgDimensions: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		tables: true,
		tasklists: true,

	});


	var bring_nav = function() {
		if ($('nav').css('display') === "none") {
			$('nav').css('display', 'block');
		}
		else {
			$('nav').css('display', 'none');
		}
		$('.content').toggleClass('content__move');
		$('nav').toggleClass('nav__move');
	};

	function move(id) {
		$('section').removeClass('section__open');
		$('section#'+id).addClass('section__open');
		currentDocument.id = $('section#'+id).attr('dataID');
		currentDocument.title = $('section#'+id+' > .section--title').text();
		currentDocument.text = $('section#'+id+' > .section--text').text();
		updateTitle();
	}

	var go_to_section = function() {
		var id = $(this).attr('page');
		move(id);
		bring_nav();
	};

	$('.toggle').on('click', bring_nav);
	$('nav').find('button.page--button').on('click', go_to_section);


	/** Get the latest document number */
	function getLastID() {
		var lastID = 'document0';
		$('section').each(function(index) {
			lastID = this.id;
		});
		return parseInt(lastID.split('document')[1]);
	}

	function numPages() {
		var num = 0;
		$('section').each(function(index) {
			num++;
		});
		return num;
	}

	function updateTitle() {
		var raw = $('section.section__open > div.section--title').text();
		var title = $('<textarea />').html(raw).val();

		document.title = "{0} - Abstract Editor".format(title);
		currentDocument.title = title;
		var workspace = JSON.parse(localStorage.getItem("workspace"));
		workspace[currentDocument.id] = currentDocument;
		localStorage.setItem("workspace", JSON.stringify(workspace));
		var activePage = $('section.section__open');
		$('[page={0}]'.format(activePage[0].id)).html(title);
	}

	/** Text Input Handler */
	function textInput(key) {
		var workspace = JSON.parse(localStorage.getItem("workspace"));
		$('.section--title').off("input");
		$('.section--title').on("input", function() {
			updateTitle();
		});

		$('.section--text').off("keypress");
		$('.section--text').on("keypress", function(event) {
			var key = event.key;
			switch(key) {
				case "#":
					$('.section__open > .section--text').sendkeys("<h1>{selection}{mark}</h1>");
					event.preventDefault();
					break;
			}
			if (event.which === 13) {
				$('.section__open > .section--text').sendkeys("<br>\n");
			}
		});

		// 	if (event.which === 13) renderText(event, this);
			
		// 	//Save to local storage
		// 	workspace[currentDocument.id] = currentDocument;
		// 	localStorage.setItem("workspace", JSON.stringify(workspace));
		// }).on('keydown', function(event) {
		// 	if (event.which === 8) { //Backspace
		// 		var caretPos = $('section.section__open > div.section--text').caret('pos');
		// 		currentDocument.text = currentDocument.text.substring(0, caretPos-1) + currentDocument.text.substring(caretPos, currentDocument.text.length);
		// 	}
		// 	else if (event.which === 46) {

		// 	}
		// 	//Save to local storage
		// 	workspace[currentDocument.id] = currentDocument;
		// 	localStorage.setItem("workspace", JSON.stringify(workspace));
		// });
		$('.section--text').off("input");
		$('.section--text').on("input", function(event) {
			if (rendered) {
				currentDocument.text = $('.section__open > .section--text').html();
			}
			else {
				currentDocument.text = $('.section__open > .section--text').text();
			}

			//Save to local storage
			workspace[currentDocument.id] = currentDocument;
			localStorage.setItem("workspace", JSON.stringify(workspace));
		});

		// $('.section--text').off("keypress");
		// $('.section--text').on("keypress", function(event) {
		// 	// if (event.which === 13) renderText(event, this);
		// });
	}

	function renderText() {
		rendered = true;
		// var lines = $('.section__open > .section--text').contents();
		// if (lines.length > 0) {
		// 	lines[0] = lines[0].data; //Fix because the first line isn't wrapped in a div
		// }
		// for (var i = 1; i < lines.length; i++) {
		// 	var line = $(lines[i]).text();
		// 	lines[i] = line;
		// }
		// console.log(lines)

		//Get the current line
		// var txt = $('.section__open > .section--text')[0].innerText;
		// var pos = $('.section__open > .section--text').caret('pos');
		// var lines = txt.split('\n');

		// var currentLength = 0;
		// for (var i = 0; i < lines.length; i++) {
		// 	var line = lines[i];
		// 	if (pos > currentLength && pos <= currentLength+line.length) {
		// 		//Markdown the active line
		// 		if (i > 0) {

		// 			// console.log(converter.makeHtml(lines[i]));
		// 		}
		// 		else {

		// 		}

		// 		break;
		// 	}
		// 	currentLength += line.length;
		// }
		$('.section__open > .section--text').html($('.section__open > .section--text').text());
		console.log($('.section__open > .section--text').html());


		// currentDocument.text = $('.section__open > .section--text').html();
		// var workspace = JSON.parse(localStorage.getItem("workspace"));
		// workspace[currentDocument.id] = currentDocument;
		// localStorage.setItem("workspace", JSON.stringify(workspace));
	}

	function unrenderText() {
		rendered = false;
		var htmlLines = $('.section__open > .section--text').html().split("<br>");
		var html = "";
		console.log(htmlLines);
		for (var i = 0; i < htmlLines.length; i++) {
			var line = htmlLines[i];
			html += line+"<br>\n";
		}

		$('.section__open > .section--text').text(html);

		currentDocument.text = $('.section__open > .section--text').text();
		var workspace = JSON.parse(localStorage.getItem("workspace"));
		workspace[currentDocument.id] = currentDocument;
		localStorage.setItem("workspace", JSON.stringify(workspace));
	}

	/** New Document */
	function newDocument() {
		currentDocument.title = "Untitled Document";
		currentDocument.text = "";
		if (localStorage.getItem("workspace")) {
			currentDocument.id = JSON.parse(localStorage.getItem("workspace")).length;
		}
		else {
			currentDocument.id = 0;
		}
		var id = getLastID()+1
		var newHTML = "<section dataID='{1}' id='document{0}'>\
		<div class='section--title single-line' contenteditable='true' placeholder='Title'>Untitled Document</div>\
		<div class='section--text' contenteditable='true' placeholder='Start writing here...'></div>\
		</section>".format(id, currentDocument.id);
		$('#pages').append(newHTML);

		newHTML = "<li><button page='document{0}'>Untitled Document</button></li>".format(id);
		$('#nav-buttons').append(newHTML);
		$('nav').find('[page=document{0}]'.format(id)).on('click', go_to_section);

		move('document'+id);
		bring_nav();

		updateTitle();

		textInput();
	}

	/** New Document Button */
	$('#new').on('click', function() {
		newDocument();
		bring_nav();
	});

	/** Close Document */
	function closeDocument() {
		var workspace = JSON.parse(localStorage.getItem("workspace"));
		var dataID = $('.section__open').attr('dataID');
		workspace.splice(dataID, 1);
		localStorage.setItem("workspace", JSON.stringify(workspace));

		var currentID = parseInt($('.section__open')[0].id.split('document')[1]);
		$('.section__open').remove();
		$('nav').find('[page=document{0}]'.format(currentID)).parent().remove();

		if (numPages() === 0){
			newDocument();
		}
	}

	/** Open Document */
	function openDocument(doc) {
		var id = getLastID()+1
		currentDocument.title = doc.title;
		currentDocument.text = doc.text;

		var newHTML = "<section dataID='{3}' id='document{0}'>\
		<div class='section--title single-line' contenteditable='true' placeholder='Title'>{1}</div>\
		<div class='section--text' contenteditable='true' placeholder='Start writing here...'>{2}</div>\
		</section>".format(id, currentDocument.title, currentDocument.text, currentDocument.id);
		$('#pages').append(newHTML);

		newHTML = "<li><button page='document{0}'>{1}</button></li>".format(id, currentDocument.title);
		$('#nav-buttons').append(newHTML);
		$('nav').find('[page=document{0}]'.format(id)).on('click', go_to_section);

		move('document'+id);

		updateTitle();

		textInput();
		// renderText();
	}

	/** Close Document Button */
	$('#close').on('click', function() {
		closeDocument();
		bring_nav();
	});

	/** Keyboard Shortcuts */
	key('command+up, ctrl+up', function() {
		var newID = parseInt($('.section__open')[0].id.split('document')[1])-1;
		if (newID < 1) return;
		move('document'+newID);
	});

	key('command+down, ctrl+down', function() {
		var newID = parseInt($('.section__open')[0].id.split('document')[1])+1;
		if (!$('#document'+newID).length) return;
		move('document'+newID);
	});

	key('command+n, ctrl+n', function() {
		newDocument();
		bring_nav();
	});

	key('command+e, ctrl+e', function() {
		closeDocument();
		bring_nav();
	});

	key('command+enter, ctrl+enter', function() {
		renderText();
	});

	key('command+shift+enter, ctrl+shift+enter', function() {
		unrenderText();
	});

	key('esc', function() {
		bring_nav();
	});

	/** Load all pages in the workspace (from localstorage) */
	if (localStorage.getItem("workspace")) {
		var workspace = JSON.parse(localStorage.getItem("workspace"));
		if (workspace.length === 0) {
			newDocument();
			bring_nav();
			return;
		}

		for (var i = 0; i < workspace.length; i++) {
			var doc = workspace[i];
			currentDocument.id = i;

			openDocument(doc);
		}
	}
	else {
		localStorage.setItem("workspace", JSON.stringify([]));
		newDocument();
		bring_nav();
	}

	/** Startup code */
	$('nav').css('display', 'none');
});
