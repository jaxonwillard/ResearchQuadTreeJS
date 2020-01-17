
class Point{
     coordinates = [];
    constructor(coordinates){
        this.coordinates = coordinates
    }
    toString(){
        let toReturn = "[";
        for (let i=0; i<this.coordinates.length; i++){

            toReturn = toReturn.concat(this.coordinates[i] );
            if (i+1 !== this.coordinates.length){
                toReturn = toReturn.concat(", ")
            }
        }
        toReturn = toReturn.concat("]");
        return toReturn;

    }
    // compareTo(p){
    //     return this.coordinates[0] === p.coordinates[0] && this.coordinates[1] === p.coordinates[1] ;
    // }
    // print(){
    //     document.write( this.coordinates[0] + " " + this.coordinates[1]);
    // }
    // asString(){
    //     return "[" + this.coordinates[0] + "," + this.coordinates[1] + "]";
    // }
}

class Boundary{
    dimensionMins = [];
    dimensionMaxs = [];

    constructor(dimensionMins, dimensionMaxs){
        this.dimensionMaxs = dimensionMaxs;
        this.dimensionMins = dimensionMins;

    }
    contains(point){
        for (let i=0; i<point.coordinates.length; i++){
            if (point.coordinates[i] < this.dimensionMins[i] || point.coordinates[i] > this.dimensionMaxs[i])
                return false;
        }
        return true;
    }
}



class KTree{
    boundary;
    children = [];
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
        if (this.boundary.contains(point)) return;
        if (this.points.length < this.capacity && !this.isDivided) this.points.push(point);
        else {
            if (!this.isDivided) this.subdivide();
            this.children.forEach(child => child.insertPoint(point));
        }
        if (this.isDivided){
          this.points.forEach(p => this.children.forEach(child => child.insertPoint(p)));
          this.points = [];
        }
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

        this.northEast = new KTree(ne, this.capacity, this.pane);
        this.northWest = new KTree(nw, this.capacity, this.pane);
        this.southEast = new KTree(se, this.capacity, this.pane);
        this.southWest = new KTree(sw, this.capacity, this.pane);
        this.isDivided=true;
    }
    // printout(){
    //     return this.printoutHelper(this, "", "");
    // }
    // printoutHelper(tree, toReturn, recLevel){
    //     recLevel += "= ";
    //     if(tree.isDivided){
    //         toReturn += this.printoutHelper(tree.northEast, "", recLevel);
    //         toReturn += this.printoutHelper(tree.northWest, "", recLevel);
    //         toReturn += this.printoutHelper(tree.southEast, "", recLevel);
    //         toReturn += this.printoutHelper(tree.southWest, "", recLevel);
    //     }
    //     else {
    //         if (tree.points.length > 0) {toReturn+="<br />";}
    //         for (let p in tree.points){
    //             if (p < tree.points.length-1){
    //                 toReturn += recLevel + tree.points[p].asString() + "<br />";
    //             }
    //             else {toReturn += recLevel + tree.points[p].asString();}
    //         }
    //     }
    //     return toReturn;
    // }
    // setTraverseListHelper(){
    //     var traverseList = [];
    //     if (this.isDivided){
    //         for (let i in this.southWest.setTraverseListHelper()){
    //             traverseList.push(this.southWest.setTraverseListHelper()[i]);
    //         }
    //         for (let i in this.southEast.setTraverseListHelper()){
    //             traverseList.push(this.southEast.setTraverseListHelper()[i]);
    //         }
    //         for (let i in this.northWest.setTraverseListHelper()){
    //             traverseList.push(this.northWest.setTraverseListHelper()[i]);
    //         }
    //         for (let i in this.northEast.setTraverseListHelper()){
    //             traverseList.push(this.northEast.setTraverseListHelper()[i]);
    //         }
    //
    //     }
    //     for (let i in this.points){
    //         traverseList.push(this.points[i]);
    //     }
    //     return traverseList;
    // }
    // setTraverseList(){
    //     this.traverseList = this.setTraverseListHelper();
    // }

}

boundary = new Boundary([0,0,0,0], [4,4,4,4]);
let point = new Point([2,3,2,4]);
document.write(point);
document.write(boundary.contains(point));


// var boundary = new Boundary(0,0,500,500);
// var quadTree = new KTree(boundary, 1);

// quadTree.setTraverseList();
// for (let p in quadTree.traverseList){
//     document.write(quadTree.traverseList[p].asString() + "<br />")
// }

