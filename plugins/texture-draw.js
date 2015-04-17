/**
 * PIXI Texture Draw
 * by @Ezelia - http://www.html5gamedevs.com/topic/518-hack-making-all-2d-drawing-functions-available-to-pixi/
 */

import PIXI from 'pixi';

export default function (cb) {
  var canvas = document.createElement('canvas');
  if (typeof cb == 'function') cb(canvas);
  return PIXI.Texture.fromCanvas(canvas);
};