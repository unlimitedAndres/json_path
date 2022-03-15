const pointer = require('json-pointer');

class Pointer {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
  }

  toString() {
    let s = '/' + this.name;
    if (this.parent) s = this.parent.toString() + s;
    return s;
  }

  get(obj) {
    // Looks up a JSON pointer in an object.
    return pointer.get(obj, this.toString());
  }

  set(obj, value) {
    // Sets a new value on object at the location described by pointer.
    // console.log('this.string() -> ', this.toString());
    pointer.set(obj, this.toString(), value);
  }

  remove(obj) {
    pointer.remove(obj, this.toString());
  }

  static from(path) {
    const paths = path.split('/').filter((e) => e.length);
    const pointers = [];
    paths.forEach((e, i) =>
      pointers.push(new Pointer(i > 0 ? pointers[i - 1] : false, e))
    );
    return pointers.pop();
  }
}

module.exports = Pointer;
