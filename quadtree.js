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
        for (let p in this.points){
            if (this.points[p].compareTo(point)) return;
        }
        if (!this.boundary.contains(point)) return;
        if (this.points.length < this.capacity && !this.isDivided) this.points.push(point);
        else {
            if (!this.isDivided) this.subdivide();
            this.northEast.insertPoint(point);
            this.northWest.insertPoint(point);
            this.southEast.insertPoint(point);
            this.southWest.insertPoint(point);
        }
        if (this.isDivided){
            for (let p in this.points){
                this.northEast.insertPoint(this.points[p]);
                this.northWest.insertPoint(this.points[p]);
                this.southEast.insertPoint(this.points[p]);
                this.southWest.insertPoint(this.points[p]);
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
    printout(){
        return this.printoutHelper(this, "", "");
    }
    printoutHelper(tree, toReturn, recLevel){
        recLevel += "= ";
        if(tree.isDivided){
            toReturn += this.printoutHelper(tree.northEast, "", recLevel);
            toReturn += this.printoutHelper(tree.northWest, "", recLevel);
            toReturn += this.printoutHelper(tree.southEast, "", recLevel);
            toReturn += this.printoutHelper(tree.southWest, "", recLevel);
        }
        else {
            if (tree.points.length > 0) {toReturn+="<br />";}
            for (let p in tree.points){
                if (p < tree.points.length-1){
                    toReturn += recLevel + tree.points[p].asString() + "<br />";
                }
                else {toReturn += recLevel + tree.points[p].asString();}
            }
        }
        return toReturn;
    }
    setTraverseListHelper(){
        var traverseList = [];
        if (this.isDivided){
            for (let i in this.southWest.setTraverseListHelper()){
                traverseList.push(this.southWest.setTraverseListHelper()[i]);
            }
            for (let i in this.southEast.setTraverseListHelper()){
                traverseList.push(this.southEast.setTraverseListHelper()[i]);
            }
            for (let i in this.northWest.setTraverseListHelper()){
                traverseList.push(this.northWest.setTraverseListHelper()[i]);
            }
            for (let i in this.northEast.setTraverseListHelper()){
                traverseList.push(this.northEast.setTraverseListHelper()[i]);
            }

        }
        for (let i in this.points){
            traverseList.push(this.points[i]);
        }
        return traverseList;
    }
    setTraverseList(){
        this.traverseList = this.setTraverseListHelper();
    }

}

var boundary = new Boundary(0,0,500,500);
var quadTree = new QuadTree(boundary, 1);
var point4 = new Point(30, 30);
var point3 = new Point(20,400);
var point2 = new Point (20, 300);
var point1 = new Point(300,300);
var point = new Point(200,200);
quadTree.insertPoint(new Point(400,100));
quadTree.insertPoint(point4);
quadTree.insertPoint(point3);
quadTree.insertPoint(point2);
quadTree.insertPoint(point1);
quadTree.insertPoint(point);
quadTree.setTraverseList();
for (let p in quadTree.traverseList){
    document.write(quadTree.traverseList[p].asString() + "<br />")
}

