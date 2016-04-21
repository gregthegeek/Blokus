$(".playerInfo").hover(function(e){
	var p = $(this).attr('id').slice(-1);
	$(this).css("background-color",colors[p]);
	hovering = p;
	drawGrid();
	if (mode == "positioning") drawCurPiece();
},function(e){
	var p = $(this).attr('id').slice(-1);
	if (p != curPlayer || !gameStarted) {
		$(this).css("background-color","white");
	}
	hovering = 0;
	drawGrid();
	if (mode == "positioning") drawCurPiece();
});


function setCursor(newCursor) {
	$("#board").css("cursor",newCursor);
}
function fixCursor() {
	if (mode == "notYourTurn") {
		setCursor("default");
	}
	else if (mode == "relaxing") {
		if (curMouseX > supplyLeftEdge && curMouseX < supplyLeftEdge + 3*6*size2) 
			setCursor("move");
		else setCursor("default");
	}
	else if (mode == "dragging") {
		setCursor("move");
	}
	else if (mode == "positioning") {
		if ((curMouseX > supplyLeftEdge && curMouseX < supplyLeftEdge + 3*6*size2) 
				|| mouseOnPiece())
			setCursor("move");
		else setCursor("default");
	}
}

$("#board").mousemove(function(e){
	
	curMouseX = getMousePos(board,e).x;
	curMouseY = board.height - getMousePos(board,e).y;
	
	if (mode == "dragging") {
		curPieceX = Math.floor(curMouseX/SIZE);
		curPieceY = Math.floor(curMouseY/SIZE);
		drawGrid();
		drawCurPiece();
	}
	
	fixCursor();
});

$("#board").mousedown(function(e){
	
	if (mode == "positioning" && mouseOnPiece()) {
		mode = "dragging";
		$("i").hide();
		return;
	}
	if ((mode != "notYourTurn") &&
			(curMouseX > supplyLeftEdge && curMouseX < supplyLeftEdge + 3*6*size2)) {
		var supplyX = Math.floor((curMouseX - supplyLeftEdge)/(6*size2));
		var supplyY = Math.floor(curMouseY/(6*size2));
		var newPiece = supplyX + 3*supplyY;
		if (remainingPieces[curPlayer][newPiece] == 0) return;
		curPiece = newPiece;
		curPieceX = Math.floor(curMouseX/SIZE);
		curPieceY = Math.floor(curMouseY/SIZE);
		drawGrid();
		drawCurPiece();
		mode = "dragging";
		
		$("i").hide();
		rotate = [1,0,0,1,1];
	}
});

function toGrid(x) {
	return Math.floor(x/SIZE)*SIZE;
}

$("#board").mouseup(function(e){
	if (mode == "dragging") {
		$("#board").css("cursor","default");
		if (curMouseX < 20*SIZE) {
			mode = "positioning";
			$("i").show();
			$("i").css("position","absolute");
			$("i").css("left",(toGrid(e.clientX)-48)+"px");
			
			displaySubmit(); 
			
			$("#rot-right").css("top",(toGrid(e.clientY)-SIZE-10)+"px");
			$("#rot-left").css("top",(toGrid(e.clientY)-10)+"px");
			$("#flip-vert").css("top",(toGrid(e.clientY)+SIZE-10)+"px");
			$("#flip-horiz").css("top",(toGrid(e.clientY)+2*SIZE-10)+"px");
			$("#submit").css("top",(toGrid(e.clientY) + 3*SIZE-10)+"px");
			
			curPieceX = Math.floor(curMouseX/SIZE);
			curPieceY = Math.floor(curMouseY/SIZE);
		}
		else {
			mode = "relaxing";
			drawGrid();
		}
	}
});

$("#rot-left").on('click', function() {
	if (rotate[4]) rotate = rotLeft(rotate);
	else rotate = rotRight(rotate);
	drawGrid();
	drawCurPiece();
	displaySubmit(); 
});

$("#rot-right").on('click', function() {
	if (!rotate[4]) rotate = rotLeft(rotate);
	else rotate = rotRight(rotate);
	drawGrid();
	drawCurPiece();
	displaySubmit(); 
});

$("#flip-vert").on('click', function() {
	rotate = flipVert(rotate);
	drawGrid();
	drawCurPiece();
	displaySubmit(); 
});

$("#flip-horiz").on('click', function() {
	rotate = flipHoriz(rotate);
	drawGrid();
	drawCurPiece();
	displaySubmit(); 
});

function displaySubmit() {
	if (isLegal()) {
		$("#submit").show();
	}
	else {
		$("#submit").hide();
	}
}

function isColor(color,row,column) {
	if (row < 0 || column < 0 || row >= 20 || column >= 20) return false;
	return (grid[row][column] == color);
}

function isLegal() {
	var locs = orient(curPiece);
	 
	 for (i = 0; i < locs.length/2; i++) {
	 	var row =  grid.length-1-(curPieceY+locs[2*i+1]);
	 	var col = curPieceX+locs[2*i];
	 
	 	if (row < 0 || row >= 20 || col < 0 || col >= 20) {
	 		return false;
	 	}
		if (grid[row][col] != 0) {
			return false;
		}
		
	}
	if (score(curPlayer) == 0) {
		for (i = 0; i < locs.length/2; i++) {
	 		var row =  grid.length-1-(curPieceY+locs[2*i+1]);
	 		var col = curPieceX+locs[2*i];
	 		if (curPlayer == 1 && row == 0 && col == 0) return true;
	 		if (curPlayer == 2 && row == 0 && col == 19) return true;
	 		if (curPlayer == 3 && row == 19 && col == 19) return true;
	 		if (curPlayer == 4 && row == 19 && col == 0) return true;
	 	}
	 	return false;
	}
	
	for (i = 0; i < locs.length/2; i++) {
	 	var row =  grid.length-1-(curPieceY+locs[2*i+1]);
	 	var col = curPieceX+locs[2*i];
	 	
		if (isColor(curPlayer,row + 1,col) || 
			isColor(curPlayer,row - 1,col) || 
			isColor(curPlayer,row,col + 1) || 
			isColor(curPlayer,row,col - 1))
				return false;
	}
	for (i = 0; i < locs.length/2; i++) {
	 	var row =  grid.length-1-(curPieceY+locs[2*i+1]);
	 	var col = curPieceX+locs[2*i];
	 	
		if (isColor(curPlayer,row + 1,col + 1) || 
			isColor(curPlayer,row + 1,col - 1) || 
			isColor(curPlayer,row - 1,col + 1) || 
			isColor(curPlayer,row - 1,col - 1)) 
				return true;	
	}
	return false;
}

function submitMove() {
	var locs = orient(curPiece);
	for (i = 0; i < locs.length/2; i++) {
		grid[grid.length-1-(curPieceY+locs[2*i+1])][curPieceX+locs[2*i]] = curPlayer;
	}
	remainingPieces[curPlayer][curPiece] = 0;
	$("#playerScore"+curPlayer).html(score(curPlayer));
	
	startNewTurn(true);
}

$("#submit").on('click', function() {
	console.log( {
	    piece: curPiece,
	    orientation: getOrientation(rotate),
	    x: curPieceX,
	    y: curPieceY
  	});
	$.post(url+"/move", {
	    piece: curPiece,
	    orientation: getOrientation(rotate),
	    x: curPieceX,
	    y: curPieceY
  	},
  	function(data) {console.log(data);} );
	
});
