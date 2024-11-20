class urlDB
{
    constructor(){
        
        /** @type {number} */
        this.total = -1;
        /** @type {string[]} */
        this._urls = [];
    }

    existsUrl(url){

        return this._urls.findIndex((element) => element == url);
    }

    /**
     * Adds a URL to the urls array.
     * @param {string} url - The URL to add.
     */
    addUrl(url){

        this._urls.push(url);
        this.total++;
        return this.total;
    }

    getUrl(index){

        if(Number(index) == NaN && (index >= total || index < 0))
        {
            throw new Error("Incorrect index or not found");
        }
        else
            return this._urls[index];
    }
}

module.exports = urlDB;