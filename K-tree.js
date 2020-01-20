
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
    isDivided = false;
    constructor(boundary, capacity){
        this.boundary = boundary;
        this.capacity = capacity;
    }

    // insertPoint(point) {
    //     document.write("<br>");
    //     if (!this.boundary.contains(point)) {
    //         document.write("doesnt contain");
    //         return; }
    //     document.write("contains");
    //     if (this.points.length < this.capacity && !this.isDivided)
    //         {this.points.push(point);}
    //     else {
    //         if (!this.isDivided) {this.subdivide();}
    //
    //         for (let child = 0; child < this.children.length; child++) {
    //             this.children[child].insertPoint(point);
    //         }
    //     }
    //     if (this.isDivided) {
    //         for (let i=0; i<this.points.length; i++){
    //             for (let j=0; j<this.children.length; j++){
    //                 this.children[j].insertPoint(this.points[i]);
    //             }
    //         }
    //         // this.points.forEach(p => this.children.forEach(child => child.insertPoint(p)));
    //         this.points.splice(0,this.points.length);
    //     }
    //
    // }
    insertPoint(point){

        if (!this.boundary.contains(point)) return;
        if (this.points.length < this.capacity && !this.isDivided) this.points.push(point);
        else {
            if (!this.isDivided) this.subdivide();
            for (let i=0; i<this.children.length; i++){
                this.children[i].insertPoint(point);
            }
        }
        if (this.isDivided){
            for (let p=0; p<this.points.length; p++){
                for (let i=0; i<this.children.length; i++){
                    this.children[i].insertPoint(this.points[p]);
                }
            }
            this.points = [];
        }
    }

    subdivide(){
        for (let i=0; i<2 ** this.boundary.dimensionMins.length ; i++){
            let map = this.iterate(this.boundary.dimensionMins.length, i);
            let mins = [];
            let maxs = [];
            for (let j=0; j<map.length; j++){

                if (map[j] === "0"){
                    mins.splice(0,0,this.boundary.dimensionMins[j]);
                    maxs.splice(0,0,(this.boundary.dimensionMaxs[j] + this.boundary.dimensionMins[j])/2);
                }
                if (map[j] === "1"){
                    mins.splice(0,0,(this.boundary.dimensionMaxs[j] + this.boundary.dimensionMins[j])/2);
                    maxs.splice(0,0,this.boundary.dimensionMaxs[j]);
                }
            }
            this.children.push(new KTree(new Boundary(mins, maxs)));
        }
        this.isDivided = true;


    }
    iterate(dimensions, index) {
            let arr = [];
            let binary = (index>>>0).toString(2);
            for (let i=0; i<binary.length; i++){
                arr.push(binary[i]);
            }
            arr = this.fillOutArray(arr, dimensions);
            return arr;
    }
    fillOutArray(arr, dimensions){
        while(arr.length < dimensions){
            arr.splice(0,0,"0");
        }
        return arr;
    }




}
class Iterate {
    iterate(dimensions) {
        for (let i = 0; i < 2 ** dimensions; i++) {
            let arr = [];
            let binary = (i>>>0).toString(2);
            for (let i=0; i<binary.length; i++){
                arr.push(binary[i]);
            }
            arr = this.fillOutArray(arr, dimensions);
            document.write(arr + "<br>");
        }
    }
    fillOutArray(arr, dimensions){
        while(arr.length < dimensions){
            arr.splice(0,0,0);
        }
        return arr;
    }
}
let boundary = new Boundary([0,0],[5,5]);
let ktree = new KTree(boundary, 1);
ktree.insertPoint(new Point([1,0]));
ktree.insertPoint(new Point([1,0]));



