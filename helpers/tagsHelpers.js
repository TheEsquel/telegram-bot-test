module.exports = {
    getList: caption => {
        const items = caption.split(' ')
        console.log(caption);
        console.log(items);
        const tags = items.map(item => {
            if ([' ', '#', ','].contains(item[0])){
              return item.substring(1)
            }
            return item
        })
        return tags
    }
}
