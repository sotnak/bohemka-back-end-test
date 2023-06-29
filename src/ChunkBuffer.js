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

    finish(){
        const res = this.buffer
        this.buffer = []
        return Buffer.from(res);
    }
}

module.exports=ChunkBuffer