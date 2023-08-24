const db = require('../utils/database');

module.exports = class Product {

    constructor(id , title , imageURL , description , price) {
        this.title = title;
        this.id = id;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {

        return db.execute('INSERT INTO products (title , price , imageURL , description) VALUES (? , ? , ? , ?)' 
        , [this.title , this.price , this.imageURL , this.description]);
        
    }

    static fetchAll(cb) {
        return db.execute('SELECT * FROM products');
    }

    static findById(id , cb) {
        return db.execute('SELECT * FROM products WHERE products.id = ?' , [id]);
        
    }

    static deleteById(id) {
       
    }

};