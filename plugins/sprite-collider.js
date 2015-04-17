import GameWindow from 'game-window';
import PIXI from 'pixi';

var bodies = [];

GameWindow.on('tick', function(){
  for(var i = bodies.length - 1; i >= 0; i--){
    for(var j = bodies.length - 1; j >= 0; j--){
      if (i != j){
        Collider.checkCollision(Collider.rect(bodies[i]), Collider.rect(bodies[j]));
      }
    }
  }
});

function inGroups(groupA, groupB){
  if (groupA===true || groupB===true) return true;
  for(var i = groupA.length - 1; i >=0; i--){
    for(var j = groupB.length - 1; j >=0; j--){
      if (groupA[i]===groupB[j]) return true;
    }
  }
  return false;
}

var Collider = {
  DETECTOR: 0,
  BODY: 1,
  addSprite: function(sprite, groups){
    if (!(groups instanceof Array) && !isNaN(groups)) groups = [groups];
    if (!(groups instanceof Array)) groups = true;
    bodies.push({
      sprite: sprite,
      groups: groups
    });
  },
  removeSprite: function(sprite){
    for (var i = bodies.length - 1; i >= 0; i--){
      if (bodies[i].sprite === sprite){
        bodies[i].remove = true;
        return true;
      }
    }

    return false;
  },
  checkCollision: function (a, b){
    var result = !( a.left >= b.right || a.right <= b.left || a.top >= b.bottom || a.bottom <= b.top) &&
                  inGroups(a.body.groups, b.body.groups) && !a.body.remove && !b.body.remove;

    if (result){
      if (typeof a.body.sprite.collide === 'function') a.body.sprite.collide.call(a.body.sprite, b);
      if (typeof b.body.sprite.collide === 'function') b.body.sprite.collide.call(b.body.sprite, a);
    }
    return result;
  },
  rect: function (body){
    var rect = { body: body };
    var sprite = body.sprite;
    var pos = sprite.toGlobal(new PIXI.Point(0, 0));
    var width = Math.abs(sprite.width * sprite.scale.x);
    var height = Math.abs(sprite.height * sprite.scale.y);

    rect.left = pos.x - width * sprite.anchor.x + width * Math.min(0, sprite.scale.x);
    rect.top = pos.y - height * sprite.anchor.y + height * Math.min(0, sprite.scale.y);
    rect.right = rect.left + width;
    rect.bottom = rect.top + height;
    return rect;
  }
};

export default Collider;