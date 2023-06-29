const removeBoundaries = (data, headers)=>{
    const contentType = headers['content-type']
    const position = contentType.search("boundary=")
    const boundary = contentType.slice(position+9)

    return data.slice(Buffer.byteLength(boundary)+2, -(Buffer.byteLength(boundary)+6))
}

module.exports.removeBoundaries = removeBoundaries