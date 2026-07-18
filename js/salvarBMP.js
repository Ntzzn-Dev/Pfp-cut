
function canvasToBMP(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, w, h);
    const pixels = imgData.data;

    const rowSize = Math.floor((24 * w + 31) / 32) * 4; // alinhamento 4 bytes
    const dataSize = rowSize * h;
    const fileSize = 54 + dataSize;

    const buffer = new ArrayBuffer(fileSize);
    const dv = new DataView(buffer);

    let offset = 0;

    // HEADER
    dv.setUint8(offset++, 0x42); // B
    dv.setUint8(offset++, 0x4D); // M
    dv.setUint32(offset, fileSize, true); offset += 4; // tamanho do arquivo
    dv.setUint32(offset, 0, true); offset += 4; // reservado
    dv.setUint32(offset, 54, true); offset += 4; // offset dos dados

    // INFOHEADER
    dv.setUint32(offset, 40, true); offset += 4; // tamanho infoheader
    dv.setInt32(offset, w, true); offset += 4;
    dv.setInt32(offset, -h, true); offset += 4; // negativo para que a imagem não fique invertida
    dv.setUint16(offset, 1, true); offset += 2; // planos
    dv.setUint16(offset, 24, true); offset += 2; // 24 bits
    dv.setUint32(offset, 0, true); offset += 4; // sem compressão
    dv.setUint32(offset, dataSize, true); offset += 4;
    dv.setInt32(offset, 0, true); offset += 4; // px/m x
    dv.setInt32(offset, 0, true); offset += 4; // px/m y
    dv.setUint32(offset, 0, true); offset += 4; // cores importantes
    dv.setUint32(offset, 0, true); offset += 4; // cores usadas

    // DADOS
    const padding = rowSize - w * 3;
    let pos = 54;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            dv.setUint8(pos++, pixels[i + 2]); // B
            dv.setUint8(pos++, pixels[i + 1]); // G
            dv.setUint8(pos++, pixels[i]);     // R
        }
        pos += padding;
    }

    return new Blob([buffer], { type: "image/bmp" });
}