AFRAME.registerComponent('haptic-spatial-pattern', {
	schema: {
	  numRows: {type: 'int', default: 3},
	  numCols: {type: 'int', default: 3},
	  cellSize: {type: 'vec3', default: '1 1 0.1'},
	  cellColor: {type: 'color', default: '#fff'},
	  selectedColor: {type: 'color', default: '#000'},
	  duration: {type: 'number', default: 100},
	  intensity: {type: 'number', default: 0.5}
	},
  
	init: function () {
	  this.pattern = [];
	  this.selectedCell = null;
	  this.controller = null;
	  this.hapticActuator = null;
	  this.xKeyDown = false;
	  this.aKeyDown = false;
  
	  this.createGrid();
	  this.el.sceneEl.addEventListener('loaded', this.onSceneLoaded.bind(this));
	},
  
	createGrid: function () {
	  var numRows = this.data.numRows;
	  var numCols = this.data.numCols;
	  var cellSize = this.data.cellSize;
	  var cellColor = this.data.cellColor;
  
	  for (var i = 0; i < numRows; i++) {
		for (var j = 0; j < numCols; j++) {
		  var cell = document.createElement('a-box');
		  cell.setAttribute('position', {x: j * cellSize.x, y: i * cellSize.y, z: 0});
		  cell.setAttribute('color', cellColor);
		  cell.setAttribute('cursor-listener', true);
		  cell.addEventListener('click', this.onCellClick.bind(this));
		  this.el.appendChild(cell);
		}
	  }
	},
  
	onCellClick: function (event) {
	  if (this.selectedCell) {
		this.selectedCell.setAttribute('color', this.data.cellColor);
	  }
	  this.selectedCell = event.target;
	  this.selectedCell.setAttribute('color', this.data.selectedColor);
	  this.pattern.push(this.getCellIndex(this.selectedCell));
	},
  
	getCellIndex: function (cell) {
	  var numRows = this.data.numRows;
	  var numCols = this.data.numCols;
	  var cellSize = this.data.cellSize;
	  var x = Math.round(cell.getAttribute('position').x / cellSize.x);
	  var y = Math.round(cell.getAttribute('position').y / cellSize.y);
	  return y * numCols + x;
	},
  
	play: function () {
	  if (!this.hapticActuator) {
		console.warn('Haptic actuator not found.');
		return;
	  }
  
	  var intensity = this.data.intensity;
	  var duration = this.data.duration;
  
	  if (this.xKeyDown) {
		intensity += 0.25;
	  }
	  if (this.aKeyDown) {
		intensity -= 0.25;
	  }
  
	  intensity = Math.max(0, Math.min(1, intensity));
  
	  this.hapticActuator.playEffect('click', {intensity: intensity, duration: duration});
	},

	onSceneLoaded: function () {
		this.controller = null;
		this.hapticActuator = null;
		this.xKeyDown = false;
		this.aKeyDown = false;
	
		//this.tick();
	},
  
	tick: function (time, timeDelta) {
	  var controller = this.el.sceneEl.renderer.xr.getController(0);
	  if (controller !== this.controller) {
		this.controller = controller;
		this.hapticActuator = controller.input.hapticActuator;
	  }
  
	  var xKey = this.el.sceneEl.systems.keyboard.keys['KeyX'];
	  var aKey = this.el.sceneEl.systems.keyboard.keys['KeyA'];
  
	  this.xKeyDown = xKey.isDown;
	  this.aKeyDown = aKey.isDown;
  
	  var controllerButton = controller.input.getGamepadButton(0);
	  if (controllerButton.pressed) {
		this.play();
	  }
	}
  });
  