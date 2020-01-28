
class Point {
    coordinates = [];
    constructor(coordinates) {
        this.coordinates = coordinates
    }
    toString() {
        let toReturn = "[";
        for (let i = 0; i < this.coordinates.length; i++) {

            toReturn = toReturn.concat(this.coordinates[i]);
            if (i + 1 !== this.coordinates.length) {
                toReturn = toReturn.concat(", ")
            }
        }
        toReturn = toReturn.concat("]");
        return toReturn;
    }
    equals(p) {
        for (let i = 0; i < this.coordinates.length; i++) {
            if (this.coordinates[i] !== p.coordinates[i]) {
                return false;
            }
        }
        return true;
    }
}
class Boundary {
    dimensionMins = [];
    dimensionMaxs = [];

    constructor(dimensionMins, dimensionMaxs) {
        this.dimensionMaxs = dimensionMaxs;
        this.dimensionMins = dimensionMins;

    }
    contains(point) {
        for (let i = 0; i < point.coordinates.length; i++) {
            if (point.coordinates[i] <= this.dimensionMins[i] || point.coordinates[i] > this.dimensionMaxs[i])
                return false;
        }
        return true;
    }
    toString() {
        let toReturn = "min [";
        for (let i = 0; i < this.dimensionMins.length; i++) {
            toReturn = toReturn.concat(this.dimensionMins[i]);
            if (i + 1 !== this.dimensionMins.length) {
                toReturn = toReturn.concat(", ")
            }
        }
        toReturn = toReturn.concat("] max [");
        for (let i = 0; i < this.dimensionMaxs.length; i++) {
            toReturn = toReturn.concat(this.dimensionMaxs[i]);
            if (i + 1 !== this.dimensionMaxs.length) {
                toReturn = toReturn.concat(", ")
            }
        }

        toReturn = toReturn.concat("]");
        return toReturn;
    }
}
class KTree {
    boundary;
    children = [];
    capacity;
    traverseList = [];
    points = [];
    isDivided = false;
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
    }

    giveToChildren(point) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].boundary.contains(point)) {
                this.children[i].insertPoint(point);
                break;
            }
            else if(i == this.children.length - 1) {
                console.log('No child received the point', point);
                console.log('My boundary was', this.boundary.toString());
                if(!this.boundary.contains(point)) {
                    console.log('houston we have a problem');
                }
                for(let j = 0; j < this.children.length; j++) {
                    console.log('Point not in child boundary', this.children[j].boundary.toString())
                }
            }
        }
    }

    insertPoint(point) {
        if (this.boundary.contains(point)) {
            if (this.isDivided) {
                this.giveToChildren(point)
            }
            else {
                this.points.push(point);
                if (this.points.length > this.capacity) {
                    this.subdivide();
                    for (let i = 0; i < this.points.length; i++) {
                        this.giveToChildren(this.points[i]);
                    }
                    this.points = [];
                    this.points.length = 0;
                }
            }
        } else {
            console.log('Error! Trying to insert ', point, this);
        }
    }

    getMaxDepth() {
        let maxChild = 0;
        for (let i = 0; i < this.children.length; i++) {
            maxChild = Math.max(maxChild, this.children[i].getMaxDepth());
        }
        return 1 + maxChild;
    }

    getNumPoints() {
        let total = this.points.length;
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] != null) {
                total += this.children[i].getNumPoints();
            }
        }
        return total;
    }

    getNumChildren() {
        let total = this.children.length;
        for(let i = 0; i < this.children.length; i++) {
            total += this.children[i].getNumChildren();
        }
        return total;
    }

    subdivide() {
        console.log('subdividing');
        for (let i = 0; i < 2 ** this.boundary.dimensionMins.length; i++) {
            let map = this.iterate(this.boundary.dimensionMins.length, i);
            let mins = [];
            let maxs = [];
            for (let j = 0; j < map.length; j++) {

                if (map[j] === "0") {
                    mins.splice(0, 0, this.boundary.dimensionMins[j]);
                    maxs.splice(0, 0, (this.boundary.dimensionMaxs[j] + this.boundary.dimensionMins[j]) / 2);
                }
                if (map[j] === "1") {
                    mins.splice(0, 0, (this.boundary.dimensionMaxs[j] + this.boundary.dimensionMins[j]) / 2);
                    maxs.splice(0, 0, this.boundary.dimensionMaxs[j]);
                }
            }
            this.children.push(new KTree(new Boundary(mins, maxs), this.capacity));
            // console.log('Just created a new boundary!', this.children[i])
        }
        this.isDivided = true;


    }
    iterate(dimensions, index) {
        let arr = [];
        let binary = (index >>> 0).toString(2);
        for (let i = 0; i < binary.length; i++) {
            arr.push(binary[i]);
        }
        arr = this.fillOutArray(arr, dimensions);
        return arr;
    }
    fillOutArray(arr, dimensions) {
        while (arr.length < dimensions) {
            arr.splice(0, 0, "0");
        }
        return arr;
    }
    setTraverseListHelper() {
        var traverseList = [];
        if (this.isDivided) {
            for (let child = 0; child < this.children.length; child++) {
                for (let i = 0; i < this.children[child].setTraverseListHelper().length; i++) {
                    traverseList.push(this.children[child].setTraverseListHelper()[i]);
                }
            }

        }
        for (let i = 0; i < this.points.length; i++) {
            traverseList.push(this.points[i]);
        }
        return traverseList;
    }
    setTraverseList() {
        this.traverseList = this.setTraverseListHelper();
    }

}
// let boundary = new Boundary([0, 0], [11, 11]);
let boundary = new Boundary([0, 0], [1.1, 1.1]);
let ktree = new KTree(boundary, 1);

let oneBoundary = new Boundary([0, 0], [1, 1]);
if (oneBoundary.contains(new Point([1, 1]))) {
    console.log('boundaries contain their upper right');
}
if (oneBoundary.contains(new Point([0, 0]))) {
    console.log('boundaries contain their lower left');
}

let ind = 0;
for (let i = 1; i < 2; i++) {
    for (let j = 1; j < 10; j++) {
        // /*
        ktree.insertPoint(new Point([i / 10, j / 10]));
        console.log('Num points after insertion ' + ind + ': ' + ktree.getNumPoints());
        console.log('Num children after insertion ' + ind + ': ' + ktree.getNumChildren());
        ind++;
        // */
    }
}
/*
document.write("ind: " + ind + "<br>");
console.log('Num points before insertion: ', ktree.getNumPoints());
console.log('Num children before insertion: ', ktree.getNumChildren());
console.log('Max depth before insertion: ', ktree.getMaxDepth());
// console.log('Ktree: ', ktree);
ktree.insertPoint(new Point([.1, .1]));
console.log('Num points after first insertion: ', ktree.getNumPoints());
console.log('Num children after first insertion: ', ktree.getNumChildren());
console.log('Max depth after insertion: ', ktree.getMaxDepth());
// console.log('Ktree: ', ktree);
ktree.insertPoint(new Point([.9, .1]));
console.log('Num points after second insertion: ', ktree.getNumPoints());
console.log('Num children after second insertion: ', ktree.getNumChildren());
console.log('Max depth after insertion: ', ktree.getMaxDepth());
// console.log('Ktree: ', ktree);
ktree.insertPoint(new Point([.1,.9]));
console.log('Num points after third insertion: ', ktree.getNumPoints());
console.log('Num children after second insertion: ', ktree.getNumChildren());
console.log('Max depth after insertion: ', ktree.getMaxDepth());
/*
console.log('Ktree: ', ktree);
// */

ktree.setTraverseList();
document.write("traversal list: " + ktree.traverseList.length + "<br>");

for (let i = 0; i < ktree.traverseList.length; i++) {
    document.write(ktree.traverseList[i] + "<br>");
}










// printout(){
//     return this.printoutHelper(this, "", "");
// }
// printoutHelper(tree, toReturn, recLevel){
//     recLevel += "= ";
//     if(tree.isDivided){
//         for (let i=0; i<tree.children.length; i++){
//             toReturn += this.printoutHelper(tree.children[i]);
//         }
//     }
//     else {
//         if (tree.points.length > 0) {toReturn+="<br />";}
//         for (let p=0; p<tree.points.length; p++){
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



