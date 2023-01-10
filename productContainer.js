
const fs = require('fs');


class Container {
    constructor (name) {
        this.path =`./${name}.txt`;
        this.id = 1;
        this.timestamp = new Date().toLocaleString();
        //fs.writeFileSync(`./${name}.txt`, '[]');
    }

    save = async (item) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);
        item.id = this.id;
        item.timestamp = this.timestamp;
        fileObj.push({ id: this.id, timestamp: this.timestamp, ...item, });
        await fs.promises.writeFile(this.path, JSON.stringify(fileObj, null, 2));
        this.id ++;

        return item.id;
    }

    getById = async (id) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);

        const item = fileObj.find(element => element.id === id);

        return item ? item : null;
    }

    updateById = async (id, newData) => {
        const fileContent = await fs.promises.readFile(this.path, 'utf-8');
        const fileObj = JSON.parse(fileContent);
        
        const index = fileObj.findIndex(element => element.id === id);
        
        fileObj[index].timestamp = newData.timestamp;
        fileObj[index].name = newData.name;
        fileObj[index].descripcion = newData.descripcion;
        fileObj[index].code = newData.code;
        fileObj[index].photo = newData.photo;
        fileObj[index].stock = newData.stock;

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

        const updatedFileObj = fileObj.filter(element => element.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(updatedFileObj, null, 2));
    }

    deleteAll = async () => {
        await fs.promises.writeFile(this.path, '[]');
    }
}

module.exports = Container;