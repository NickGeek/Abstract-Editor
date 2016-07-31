$(document).ready(function() {
	var bring_nav = function() {
		$('.content').toggleClass('content__move');
		$('nav').toggleClass('nav__move');
	};

	var go_to_section = function() {
		var id= $(this).attr('page');
		$('section').removeClass('section__open');
		$('section#'+id).addClass('section__open');
		bring_nav();
	};

	$('.toggle').on('click', bring_nav);
	$('nav').find('button.page--button').on('click', go_to_section);

	function move(id) {
		$('section').removeClass('section__open');
		$('section#'+id).addClass('section__open');
		updateTitle();
	}

	/** Get the latest document number */
	function getLastID() {
		var lastID = 'document0';
		$('section').each(function(index) {
			lastID = this.id;
		});
		return parseInt(lastID.split('document')[1]);
	}

	function updateTitle() {
		var raw = $('section.section__open > div.section--title').text();
		var title = $('<textarea />').html(raw).val();

		document.title = "{0} - Abstract Editor".format(title);
		var activePage = $('section.section__open');
		$('[page={0}]'.format(activePage[0].id)).html(title);
	}

	/** New Document */
	function newDocument() {
		var id = getLastID()+1
		var newHTML = "<section id='document{0}'>\
		<div class='section--title single-line' contenteditable='true' placeholder='Title'>Untitled Document</div>\
		<div class='section--text' contenteditable='true' placeholder='Start writing here...'></div>\
		</section>".format(id);
		$('#pages').append(newHTML);

		newHTML = "<li><button page='document{0}'>Untitled Document</button></li>".format(id);
		$('#nav-buttons').append(newHTML);
		$('nav').find('[page=document{0}]'.format(id)).on('click', go_to_section);

		move('document'+id);
		bring_nav();

		updateTitle();

		/** Title input handler */
		$('.section--title').off("input");
		$('.section--title').on("input", function() {
			updateTitle();
		});
	}
	newDocument();
	bring_nav();

	/** New Document Button */
	$('#new').on('click', function() {
		newDocument();
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
});