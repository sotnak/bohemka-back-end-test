const reduceSize = (data, targetSize)=>{
    if(!targetSize) return data;

    const ratio = Math.ceil(data.length/targetSize)
    //console.log("resize ratio",ratio)

    if(ratio === 1) return data;

    const res = []

    for(let i = 0; i<data.length; i+= ratio){
        res.push(data[i])
    }

    return Buffer.from(res);
}

module.exports.reduceSize = reduceSize