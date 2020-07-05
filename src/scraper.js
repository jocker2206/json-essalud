const fetch = require('node-fetch');
const cheerio = require('cheerio');


const getDatos = async (ref = [], datos = []) => {

    let payload = {};

    try {
        await datos.filter((obj, index) => {
            let child = ref[index].childNodes[0] 
            // validar si hay hijos
            if (child.children) {
                payload[obj] = child.children[0].data;
            } else {
                payload[obj] = child.data;
            }
            // response
            return obj;
        });
    } catch (error) {
        payload = {};
    }

    // response datos 
    return payload;
}   


// petición al essalud
const search = async (dni) => {

    // cookie
    let cookie = "JSESSIONID=f2c768174335090b421faf79003a71bb00f35becafad1ee8156a9e44ab6c5702.e34SahmNbhaLay0LbxeRe0";
    // query
    let query = `pg=1&ll=Libreta%20Electoral%2FDNI&td=1&nd=${dni}&submit=Consultar&captchafield_doc=45257`;

    // api
    let html = await fetch(`http://ww4.essalud.gob.pe:7777/acredita/servlet/Ctrlwacre?${query}`, {
        method: 'POST',
        headers: {
            cookie
        }
    }).then(resData => resData.text())
    .then(res => res)
    .catch(err => null);

    // selector html
    const selector = cheerio.load(html);

    // obtener tabla
    const resTable = selector("body").find("form > table > tbody > tr");

    const resTr = resTable.find('.tdDetRigth');

    const datos = await getDatos(resTr, [
        "nombre_completo", 
        "numero_de_documento", 
        "tipo_de_asegurado", 
        "autogenerado", 
        "_", 
        "tipo_de_seguro",
        "centro_asistencial",
        "desde",
        "direccion",
        "hasta",
        "afiliado"
    ]);

    if (!Object.keys(datos).length) {
        return {
            success: false,
            message: `No se encontraron registros con el N° Documento: ${dni}`,
            data: {}
        }
    }

    return {
        success: true,
        message: "Datos encontrados!",
        data: datos
    };
}


module.exports = {
    searchDni: search
};