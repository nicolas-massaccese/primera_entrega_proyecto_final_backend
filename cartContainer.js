
const fs = require('fs');


class cartContainer {
    constructor (name) {
        this.path =`./${name}.txt`;
        this.cartCollection = [];
    };

    addCart = async (item) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);

        let newId = Object.keys(fileObj).length + 1;
        console.log(newId);
        const time = new Date().toLocaleString();
        this.cartCollection.push({id: newId, timestamp: time, ...item});
        console.log(this.cartCollection);

        fs.writeFileSync(`${this.path}`, JSON.stringify(this.cartCollection));
        return newId;
    };

    getCartById = async (id) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);

        const cart = fileObj.find(element => element.id === id);

        return cart ? cart : null;
    };

    updateCartById = async (id, newData) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);
        
        const index = fileObj.findIndex(element => element.id === id);
        
        if(index != -1){
            fileObj[index].timestamp = newData.timestamp;
            fileObj[index].products = newData.products;
        } else {
            fileObj[0].timestamp = newData.timestamp;
            fileObj[0].products = newData.products;
        }

        await fs.promises.writeFile(this.path, JSON.stringify(fileObj, null, 2));
    }

    getAll = async () => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);
        return fileObj;
    }

    deleteById = async (id) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);
        let deletedObj = null;

        const index = fileObj.findIndex(element => element.id === id);
        if(index != -1){
            deletedObj = fileObj.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(fileObj, null, 2));
        }
        return deletedObj;
    }

    deleteAll = async () => {
        await fs.promises.writeFile(this.path, '[]');
    }
}

module.exports = cartContainer;