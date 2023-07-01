class ChunkBuffer{
    buffers = []
    threshold = 100000
    length = 0

    constructor(threshold) {
        this.threshold = threshold
    }

    push(x){
        this.length += x.length
        this.buffers.push(x);
    }

    getBuffers(len){
        let tmpLen = 0
        const res = []
        for (let i = 0; i<this.buffers.length; i++){
            const buff = this.buffers[i]
            tmpLen += buff.length

            if(tmpLen > len){
                const offset = tmpLen - len
                const keepBuff = buff.slice(-offset)
                res.push(buff.slice(0,-offset))

                const tmpBuffers = [keepBuff]
                tmpBuffers.push(...this.buffers.slice(i+1))
                this.buffers = tmpBuffers;
                this.length -= len
                return res;
            }

            res.push(buff)

            if(tmpLen === len){
                this.length -= len
                this.buffers = this.buffers.slice(i+1)
                return res;
            }

        }

        throw new Error('Not enough data')
    }

    runIfOverflown(fun){
        if(this.length > this.threshold){
            const buffs = this.getBuffers(this.threshold)
            fun(buffs)
            return true;
        }

        return false;
    }

    finish(fun){
        if(this.length > 0){
            const buffs = this.buffers
            this.buffers = []
            this.length = 0
            fun(buffs)
            return true;
        }

        return false;
    }
}

module.exports=ChunkBuffer