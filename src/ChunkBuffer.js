class ChunkBuffer{
    buffer = []
    threshold

    constructor(threshold) {
        this.threshold = threshold
    }

    push(x){
        this.buffer.push(...x);
    }

    getIfOverflown(){
        if(this.buffer.length > this.threshold){
            return Buffer.from(this.buffer.splice(0,this.threshold));
        }
        return undefined;
    }

    runIfOverflown(fun){
        if(this.buffer.length > this.threshold){
            const buff = Buffer.from(this.buffer.splice(0,this.threshold));
            fun(buff)
            return true;
        }

        return false;
    }

    finish(fun){
        if(this.buffer.length > 0){
            const buff = Buffer.from(this.buffer.splice(0));
            fun(buff)
            return true;
        }

        return false;
    }
}

module.exports=ChunkBuffer