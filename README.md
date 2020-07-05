

``` js
    
    // importamos la libreria js-essalud
    const { seachDni } = require('js-essalud');

    // ejecutamos la librería
    const main = async (dni) => {
        let datos = await searchDni(dni);

        // obtener respuesta
        console.log(datos);
    }

```

### output
```
{
    success: Boolean,
    message: String,
    data: Object
}

```