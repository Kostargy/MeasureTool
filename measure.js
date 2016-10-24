////////////////////////////////////////////////////////////////////////////////
// Mouse Handling
var allPaths, startingPoint, endingPoint, line;
function measureOnMouseDown(event) {
  if(!allPaths){
    allPaths = project.getItems({
      class: Path
    });
  }
  startingPoint = event.point;
}

function measureOnMouseDrag(event) {
    endingPoint = event.point;
    drawLine(startingPoint,endingPoint);
    createX(startingPoint);
    checkColl();
}

function drawLine(startingPoint, endingPoint) {
  line = new Path.Line(startingPoint, endingPoint).removeOnDrag().removeOnMove();
  line.strokeColor = 'blue';
  line.opacity = 0.7;
}


function checkColl() {
  var colPoints = [];
  for (var i = 0; i < allPaths.length; i++) {
    var intersections = line.getIntersections(allPaths[i]);
    for (var j = 0; j < intersections.length; j++) {
      //draw an X on collision points
        colPoints.push(intersections[j].point)
        createX(intersections[j].point);
    }
  }
  colPoints.sort();
  if (colPoints.length >=2) {
    if (colPoints.length >2) {
      drawBigDist(colPoints);
    }
    drawMiddle(colPoints);

  }
}

function createX(center) {
  var ex = center - 5;
  var ex2 = center + 5;
  var xPath = new Path(ex, ex2, center);
  xPath.strokeColor = 'red';
  //xPath.strokeWidth = 1;
  var xPath1 = xPath.clone();
  xPath1.rotate(90);
  var xItem = new Group(
    xPath,
    xPath1
  ).removeOnDrag().removeOnMove();
}

function drawMiddle(colPoints) {
  var smallDistanceCounter = 0;
  for (var i = 0; i < colPoints.length; i++) {
    if( i < colPoints.length-1){

      var middlePoint = (colPoints[i]+colPoints[i+1])/2;
      var middleLine = new Path.Line(colPoints[i], colPoints[i+1]);

      var lastPoint;
      if (middleLine.length < 50) {
        smallDistanceCounter++;
        lastPoint = middleLine.getNormalAt(middleLine.length / 2) * 40*smallDistanceCounter;//the end of the line
      }else {
        lastPoint = middleLine.getNormalAt(middleLine.length / 2) * 40;//the end of the line
      }

      middleLine = new Path.Line(middlePoint,middlePoint+lastPoint).removeOnDrag().removeOnMove();

      lText = new PointText(middlePoint+lastPoint).removeOnDrag().removeOnMove();
      lText.content = calculateLength(colPoints[i],colPoints[i+1])+ ' cm';
      lText.strokeColor = 'white';

      var textRect = new Path.Rectangle(lText.bounds).removeOnDrag().removeOnMove();
      textRect.moveBelow(lText);
      textRect.scaling = 1.2;
      textRect.fillColor = 'black';
      textRect.opacity = 0.5;
      middleLine.strokeColor = 'red';

    }
  }
}

function drawBigDist(colPoints) {
  var distance = 50;
  var firstPoint = colPoints[0];
  var lastPoint = colPoints[colPoints.length-1];

  var middlePoint = (firstPoint+lastPoint)/2;

  var firstLine = new Path.Line(firstPoint, lastPoint);
  var awayPoint = firstLine.getNormalAt(firstLine.length / 2) * distance;//the end of the line

  var firstLine1 = new Path.Line(firstPoint,firstPoint-awayPoint);
  var lastLine1 = new Path.Line(lastPoint,lastPoint-awayPoint);


  awayPoint = firstLine.getNormalAt(firstLine.length / 2) * (distance-3);
  //var lastAWayPoint = lastLine.getNormalAt(lastLine.length / 2)*27;
  firstLine = new Path.Line(firstPoint-awayPoint,lastPoint-awayPoint);
  awayPoint = firstLine.getNormalAt(firstLine.length / 2) * (distance+5);
  lText = new PointText(middlePoint-awayPoint).removeOnDrag().removeOnMove();
  lText.content = calculateLength(firstPoint,lastPoint)+ ' cm';
  lText.strokeColor = 'white';

  var textRect = new Path.Rectangle(lText.bounds);
  var bigGroup = new Group({
    children : [firstLine1,lastLine1,textRect,firstLine],
    strokeColor: 'blue'
  }).removeOnDrag().removeOnMove();
  bigGroup.moveBelow(lText);
  textRect.scaling = 1.2;
  textRect.opacity = 0.5;
  bigGroup.fillColor = 'blue';
  bigGroup.opacity = 0.7;

}

function calculateLength(point1, point2) {
  var vectorl = point2 - point1;
  vectorl = vectorl.length;
  var cm = vectorl/90*2.54;
  //return cm;
  return Math.floor( cm * 1000) / 1000;
}


window.app = {
    measure: new Tool({
        onMouseDown: measureOnMouseDown,
        onMouseDrag: measureOnMouseDrag
    })
};
