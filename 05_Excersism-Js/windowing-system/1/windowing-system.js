// @ts-check

/**
 * Implement the classes etc. that are needed to solve the
 * exercise in this file. Do not forget to export the entities
 * you defined so they are available for the tests.
 */

export function Size(width = 80, height = 60) {
  this.width = width;
  this.height = height;
}

Size.prototype.resize = function (newWidth, newHeight) {
  this.width = newWidth;
  this.height = newHeight;
};

export function Position(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

Position.prototype.move = function (newX, newY) {
  this.x = newX;
  this.y = newY;
};


export class ProgramWindow {
  constructor() {
    this.screenSize = new Size(800, 600);
    this.size = new Size();
    this.position = new Position();
  }

  resize(newSize){
    const minWidth = 1;
    const minHeight = 1;
    const maxWidth = this.screenSize.width - this.position.x;
    const maxHeight = this.screenSize.height - this.position.y;

    const width = Math.max(minWidth, Math.min(newSize.width, maxWidth));
    const height = Math.max(minHeight, Math.min(newSize.height, maxHeight));

    this.size.resize(width, height);
  }


  move(newPosition){
    const minX = 0 ;
    const minY = 0 ;
    const maxX = this.screenSize.width - this.size.width;
    const maxY = this.screenSize.height - this.size.height;

    const x = Math.max(minX, Math.min(newPosition.x, maxX));
    const y = Math.max(minY, Math.min(newPosition.y, maxY));

    this.position.move(x, y);
  }
}


export function changeWindow(programWindow) {
  programWindow.resize(new Size(400, 300));
  programWindow.move(new Position(100, 150));
  return programWindow;
}


