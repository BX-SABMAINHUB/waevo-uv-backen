/* Waevo UV Config */
self.__uv$config = {
    prefix: "/service/",
    // Con BareMux + Epoxy, el campo `bare` puede quedar vacío.
    // UV usa la conexión de BareMux automáticamente.
    bare: "/wisp/",
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: "/uv/uv.handler.js",
    bundle: "/uv/uv.bundle.js",
    config: "/uv/uv.config.js",
    sw: "/uv/uv.sw.js",
};
