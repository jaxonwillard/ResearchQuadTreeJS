class CTPoint {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.userData = data;
    }
}
class Point{
     coordinates = [];
    constructor(x, y){
        this.coordinates[0] = x;
        this.coordinates[1] = y;
    }
    compareTo(p){
        return this.coordinates[0] === p.coordinates[0] && this.coordinates[1] === p.coordinates[1] ;
    }
    print(){
        document.write( this.coordinates[0] + " " + this.coordinates[1]);
    }
    asString(){
        return "[" + this.coordinates[0] + "," + this.coordinates[1] + "]";
    }
}

class Boundary{
    xy = [];
    wh = [];
    constructor(x,y,w,h){
        this.xy[0] = x;
        this.xy[1] = y;
        this.wh[0] = w;
        this.wh[1] = h;
    }
    contains(point){
        var px = point.coordinates[0];
        var py = point.coordinates[1];
        var bx = this.xy[0];
        var by = this.xy[1];
        var w = this.wh[0];
        var h = this.wh[1];
        return px >= bx && px < bx + w && py >= by && py < by + h;
}
}
class QuadTree{
    boundary;
    capacity;
    traverseList = [];
    points = [];
    northWest;
    northEast;
    southWest;
    southEast;
    isDivided = false;
    constructor(boundary, capacity){
        this.boundary = boundary;
        this.capacity = capacity;
    }
    insertPoint(point){
        for (p in this.points){
            if (p.compareTo(point)) return;
        }
        if (!this.boundary.contains(point)) return;
        if (this.points.length < this.capacity && !this.isDivided) this.points.push(point);
        else {
            if (!this.isDivided) subdivide();
            this.northEast.insertPoint(point);
            this.northWest.insertPoint(point);
            this.southEast.insertPoint(point);
            this.southWest.insertPoint(point);
        }
        if (this.isDivided){
            for (p in this.points){
                var tempP = this.points[p];
                this.northEast.insertPoint(point);
                this.northWest.insertPoint(point);
                this.southEast.insertPoint(point);
                this.southWest.insertPoint(point);
            }
            this.points = [];
        }
    }
    subdivide(){
        var x = this.boundary.xy[0];
        var y = this.boundary.xy[1];
        var w = this.boundary.wh[0];
        var h = this.boundary.wh[1];

        var nw = new Boundary(x, y, w/2, h/2);
        var ne = new Boundary(x+w/2, y, w/2, h/2);
        var sw = new Boundary(x, y+h/2, w/2, h/2);
        var se = new Boundary(x+w/2, y+h/2, w/2, h/2);

        this.northEast = new QuadTree(ne, this.capacity, this.pane);
        this.northWest = new QuadTree(nw, this.capacity, this.pane);
        this.southEast = new QuadTree(se, this.capacity, this.pane);
        this.southWest = new QuadTree(sw, this.capacity, this.pane);
        this.isDivided=true;
    }
    printout(tree, toReturn, recLevel){
        recLevel += "= ";
        if(tree.isDivided){
            toReturn += this.printout(tree.northEast, "", recLevel);
            toReturn += toReturn + this.printout(tree.northWest, "", recLevel);
            toReturn += toReturn + this.printout(tree.southEast, "", recLevel);
            toReturn += toReturn + this.printout(tree.southWest, "", recLevel);
        }
        else {
            if (tree.points.length > 0) {toReturn+="\n";}
            for (var p in tree.points){
                if (p < tree.points.length-1){
                    toReturn += recLevel + tree.points[p.asString()] + "\n";
                }
                else toReturn += recLevel + tree.points[p.asString()];
            }
        }
        return toReturn;
    }
}

var boundary = new Boundary(0,0,500,500);
var quadTree = new QuadTree(boundary, 1);
var point = new Point(200,200);
var point1 = new Point(300,300);
quadTree.insertPoint(point1);
quadTree.insertPoint(point);
// document.write(point.asString());
document.write(quadTree.printout(quadTree, "", ""));

