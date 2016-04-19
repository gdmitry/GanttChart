function prepareConfig(config) {
	config.tasks = config.tasks.map(function(task) {
		task.startDate = new Date(task.startDate).getTime();
		task.endDate = new Date(task.endDate).getTime();
		return task;
	});
	return config;
}

prepareConfig(config);

var module = (function (config) {
	var STRIPE_HEIGHT = 50,
	STRIPE_WIDTH = 80,
	FONT_SIZE = 14;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");	

	function getMaxLengthRow() {
		var tasks = config.tasks.slice(0, config.tasks.length);	
		tasks.sort(function(task1, task2) {
			var name1 = task1.name,
			 name2 = task2.name;
			return ctx.measureText(name1).width < ctx.measureText(name2).width;
		});
		return ctx.measureText(tasks[0].name).width;		
	}

	function getTimelineStart() {
		var tasks = config.tasks.slice(0, config.tasks.length);	
		tasks.sort(function(task1, task2) {
			return task1.startDate > task2.startDate;
		});	
		return tasks[0].startDate;
	}


	function getTimelineEnd() {
		var tasks = config.tasks.slice(0, config.tasks.length);	
		tasks.sort(function(task1, task2) {
			return task1.endDate < task2.endDate;
		});	
		return tasks[0].endDate;	
	}

	function getDateDifference(date1, date2) {
		var timeDiff = Math.abs(date2 - date1);
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		return diffDays;	
	}

	function getMonthName(date) {
		var monthNames = [
			  "Jan", "Feb", "Mar",
			  "Apr", "May", "June", "July",
			  "August", "Sept", "Oct",
			  "Nov", "Dec"
		];
		var monthIndex = date.getMonth();
		return (monthNames[monthIndex]);
	}

	function drawGrid() {
		var rows = config.tasks.length,
		maxLengthRow = getMaxLengthRow(),
		offsetY = 0,
		offsetX;

		// rows
		config.tasks.forEach(function(task, index) {			 
			ctx.fillStyle = !(index % 2) ? "#fcfcfc " : "#e6e6e6";
			ctx.fillRect(0, offsetY, 5000, STRIPE_HEIGHT);
			ctx.font = FONT_SIZE + "px Georgia";
			ctx.fillStyle = '#000';
			ctx.fillText(task.name, 10, offsetY  + (FONT_SIZE + STRIPE_HEIGHT )/2);
			offsetY += STRIPE_HEIGHT;			
		});
			
		var startTimeline = getTimelineStart(), endTimeline = getTimelineEnd();		

		//data
		offsetX = maxLengthRow*2 + 20;	
		offsetY = 5;	
		var stripLength;
		config.tasks.forEach(function(task) {	
			stripLength = getDateDifference(task.startDate, task.endDate) / config.deltaInDays * STRIPE_WIDTH; 	 
			offsetX =  maxLengthRow*2 + 20 + STRIPE_WIDTH*config.deltaInDays*getDateDifference(task.startDate, startTimeline);
			ctx.fillStyle = task.stripColor;	
			ctx.fillRect(offsetX, offsetY, stripLength, STRIPE_HEIGHT-10);		
			offsetY += STRIPE_HEIGHT;	
			
		});

		// columns
		offsetX = maxLengthRow*2 + 20;	
		var stripsNum = getDateDifference(startTimeline, endTimeline) / config.deltaInDays + 1;
		var time = new Date(startTimeline);
		while(stripsNum > 0) {			 
			ctx.beginPath();
			ctx.moveTo(offsetX, 0);
			ctx.lineTo(offsetX, offsetY);
			ctx.strokeStyle = "#a6a6a6";
			ctx.stroke();
			ctx.fillStyle = '#000';
			timeString = getMonthName(time) + " " + time.getDate();
			ctx.fillText(timeString, offsetX - (FONT_SIZE + ctx.measureText(timeString).width)/2, offsetY  + (FONT_SIZE + STRIPE_HEIGHT )/2);
			offsetX += STRIPE_WIDTH;
			stripsNum--;
			time.setDate(time.getDate() + config.deltaInDays);
		};		

		return maxLengthRow;
	}

	return {
		drawGrid: drawGrid
	};

}) (config);

module.drawGrid();


