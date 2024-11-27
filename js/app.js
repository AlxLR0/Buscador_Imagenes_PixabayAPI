const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;
    
    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda');
        return
        
    }

    buscarImagenes();
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;
    //key y url sacada de la documentacion de https://pixabay.com/api/docs/
    const key = '47306313-b677a214d446f6d3710a4471c';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&${paginaActual}`;
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            console.log(totalPaginas);
            // console.log(resultado);
            mostrarImagenes(resultado.hits); //hits en pixabay son las imagnes que estan en la base de datos
        })


}

function mostrarImagenes(imagenes) {
    console.log(imagenes);

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //iterar sobre el arreglo de imagenes y construir el html
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL}= imagen; //todo esto se extrae del obj de la api

        resultado.innerHTML+=`
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white rounded">
                    <img class="w-full rounded-t" src="${previewURL}">
                    <div>
                        <p class="font-bold">${likes} <span class="font-light">Me gusta <i class="ri-heart-2-line"></i></span> </p>
                        <p class="font-bold">${views} <span class="font-light">Vistas <i class="ri-eye-fill"></i></span> </p>

                        <a
                         class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                         href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                           <i class="ri-image-fill"></i> Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `
    });

    //limpiar el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }


    //generamos el nuevo html
    imprimirPaginador();
    
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    // console.log(iterador.next());
    while (true) {
        const {value, done} = iterador.next();
        if(done) return;

        //caso contrario, genera un boton por cada elemento del generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina=value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mt-2','font-bold','m-1','rounded-full');

        boton.onclick = ()=>{
            paginaActual = value;
            // console.log(paginaActual);
            buscarImagenes();
            
        }
        paginacionDiv.appendChild(boton);
    }
}

//generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador (total){
    console.log(total);
    for (let i = 1; i <= total; i++) {
        yield i;//pausar y reanudar una función generadora. 
                // Yield es una construcción de JavaScript que permite que los generadores sean más flexibles y potentes que los objetos iterables.
                // Esto se debe a que yield puede devolver el resultado al exterior y pasar el valor dentro del generador.
    }
    
}


function calcularPaginas(total) {
    return parseInt(Math.ceil(total /registrosPorPagina));
}

function mostrarAlerta(mensaje) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "info",
        title: `${mensaje}`
      });
}