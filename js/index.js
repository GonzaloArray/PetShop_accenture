try {
    const { createApp } = Vue

    createApp({
        data() {
            return {
                // Guardado de contenido
                productos: [],
                productoSeccion: {
                    medicamentos: [],
                    juguetes: [],
                },

                // filtro check
                categorias: [],
                productosBuscados: [],

                // filtro precio
                precioBuscados: [],
                precios: [450, 500],

                // backup
                backup: [],
                backupJuguete: [],
                backupMedicina: [],
                url: 'https://apipetshop.herokuapp.com/api/articulos',
                search: '',
                buscadorProducto: '',

                // Carrito de compra
                cesta: [],

                // Error Fetch
                error: false,

                //contacto
                seleccionado: [],

                // Adoptción
                perritosAdoptar: [
                    {
                        nombre: 'Chiky',
                        descripcion: 'Este animalito necesita de tu amor, comunicate con nosotros.',
                        telefono: '+54 9 11 23123221',
                        ciudad: 'Buenos Aires',
                        id: '1',
                        imagen: 'https://i.imgur.com/VI5FoK7.jpg',
                        tipo: "5 meses"
                    },
                    {
                        nombre: 'Lula',
                        descripcion: 'Este animalito necesita de tu amor, comunicate con nosotros.',
                        telefono: '+54 9 11 23123221',
                        ciudad: 'Buenos Aires',
                        id: '2',
                        imagen: 'https://i.imgur.com/JasYOI5.jpg',
                        tipo: "1 año"
                    },
                    {
                        nombre: 'Pochi y Misha',
                        descripcion: 'Este animalito necesita de tu amor, comunicate con nosotros.',
                        telefono: '+54 9 11 23123221',
                        ciudad: 'Buenos Aires',
                        id: '3',
                        imagen: 'https://i.imgur.com/1n8j3NK.jpg',
                        tipo: "3 y 4 años"
                    },
                    {
                        nombre: 'Poli',
                        descripcion: 'Este animalito necesita de tu amor, comunicate con nosotros.',
                        telefono: '+54 9 11 23123221',
                        ciudad: 'Buenos Aires',
                        id: '4',
                        imagen: 'https://i.imgur.com/FUVQqgm.jpg',
                        tipo: "2 años"
                    },
                ],
                adoptar: [],

                //tarjeta
                numerostarjeta: [],
                fechaexpiracion: [],
                codigoseguridad: [],
                cuotas: [],
                nombreyapellido: [],

                // Los primeros 4 productos
                primerosProductos: [],
                primerosProductosMedi: [],

                // Cuando compre
                productoSuccess: [],

                // Ultima compra
                ultimaCompra: []

            }
        },
        created() {
            this.traerDatos();
            if (JSON.parse(localStorage.getItem('carrito'))) {
                this.cesta = JSON.parse(localStorage.getItem('carrito'));
            }
            if (JSON.parse(localStorage.getItem('producto'))) {
                this.productoSuccess = JSON.parse(localStorage.getItem('producto'));
            }
            if (JSON.parse(localStorage.getItem('ultimaCompra'))) {
                this.ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
            }
        },
        mounted() {
        },
        methods: {
            traerDatos() {
                fetch(this.url).then(response => response.json())
                    .then(data => {
                        this.productos = data.response;

                        // Medicamentos
                        this.productoSeccion.medicamentos = this.productos.filter(event => event.tipo.toLowerCase() === "medicamento");

                        // Juguete
                        this.productoSeccion.juguetes = this.productos.filter(event => event.tipo.toLowerCase() === "juguete");


                        // Check para producto general
                        this.productos.forEach(event => {
                            if (!this.categorias.includes(event.tipo)) {
                                this.categorias.push(event.tipo)
                            }
                        });


                        this.backup = this.productos;
                        this.backupJuguete = this.productoSeccion.juguetes;
                        this.backupMedicina = this.productoSeccion.medicamentos;

                        // Primeros productos
                        this.primerosProductos = this.productoSeccion.juguetes.slice(0, 4);
                        this.primerosProductosMedi = this.productoSeccion.medicamentos.slice(0, 4);

                        // details
                        let id = new URLSearchParams(location.search).get('id');
                        this.adoptar = this.perritosAdoptar.find(element => element.id === id);

                    })
                    .catch(() => {
                        this.error = true;
                    })
            },
            agregarCesta(producto) {

                let prodExistente;
                let exitente = this.cesta.filter((item, index) => {
                    if (item.producto._id == producto._id) {
                        prodExistente = index;

                        return true;
                    } else {
                        return false;
                    }
                });

                if (exitente.length) {
                    this.cesta[prodExistente].cant++;
                    localStorage.setItem('carrito', JSON.stringify(this.cesta));
                    return;
                } else {
                    this.cesta.push({ producto: producto, cant: 1 })
                    localStorage.setItem('carrito', JSON.stringify(this.cesta));
                    return;
                }
            },
            quitarCesta(producto) {
                const valor = this.cesta.filter(element => {
                    if (element.producto._id == producto && element.cant >= 1) {
                        element.cant--;
                    }
                    return element;
                }).filter(element2 => element2.cant >= 1);

                this.cesta = valor;
                localStorage.setItem('carrito', JSON.stringify(this.cesta));
            },
            //Contact
            enviarsubmit() {

                Swal.fire({
                    icon: 'success',
                    title: 'Gracias por contactarnos',
                    text: 'El email se ha enviado correctamente',
                })

            },
            tomandoPedido() {
                this.productoSuccess = this.cesta;
                localStorage.setItem('producto', JSON.stringify(this.productoSuccess));

                this.ultimaCompra = this.productoSuccess.slice(0, 4);
                localStorage.setItem('ultimaCompra', JSON.stringify(this.ultimaCompra));

                console.log(this.ultimaCompra)


                let timerInterval
                Swal.fire({
                    title: 'Estamos procesando su pago, ya casi es tuyo!',
                    html: 'Los productos ya casi son tuyos.',
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        this.cesta = []
                        localStorage.setItem('carrito', JSON.stringify(this.cesta));

                        window.location.href = "./compraRealizada.html";

                    }
                })


            },
            llenarCarrito() {
                this.cesta = this.productoSuccess;
                localStorage.setItem('carrito', JSON.stringify(this.cesta));
            }
        },
        computed: {
            superFiltro() {
                let filtro1 = this.backup.filter(event => event.nombre.toLowerCase().includes(this.search.toLowerCase()));

                // Medicina
                let filtro1Medicine = this.backupMedicina.filter(event => event.nombre.toLowerCase().includes(this.search.toLowerCase()));

                // Juguetes
                let filtro1Juguete = this.backupJuguete.filter(event => event.nombre.toLowerCase().includes(this.search.toLowerCase()));



                let filtro2 = filtro1.filter(event => this.productosBuscados.includes(event.tipo)) || false;


                // filtro 3
                let filtro3;
                let filtro3Juguete;
                let filtro3Medicina;

                // filtro juguete
                filtro3Juguete = filtro1Juguete.filter(event => {
                    if (this.precioBuscados[0] === 450 && this.precioBuscados[1] !== 500) {
                        if (event.precio <= this.precioBuscados[0]) {
                            return event
                        }

                    } else if (this.precioBuscados[0] === 500 && this.precioBuscados[1] !== 450) {
                        if (event.precio >= this.precioBuscados[0] && event) {
                            return event
                        }
                    } else {
                        return event;
                    }
                })

                // Filtro medicina
                filtro3Medicina = filtro1Medicine.filter(event => {
                    if (this.precioBuscados[0] === 450 && this.precioBuscados[1] !== 500) {
                        if (event.precio <= this.precioBuscados[0]) {
                            return event
                        }

                    } else if (this.precioBuscados[0] === 500 && this.precioBuscados[1] !== 450) {
                        if (event.precio >= this.precioBuscados[0] && event) {
                            return event
                        }
                    } else {
                        return event;
                    }
                })

                // Condiciones de renderizado
                if (filtro3Juguete.length == 0 || filtro3Medicina.length == 0) {
                    this.productoSeccion.medicamentos = filtro1Medicine;
                    this.productoSeccion.juguetes = filtro1Juguete;
                } else {
                    this.productoSeccion.juguetes = filtro3Juguete;
                    this.productoSeccion.medicamentos = filtro3Medicina;
                }

                if (filtro2.length > 0) {
                    filtro3 = filtro2.filter(event => {
                        if (this.precioBuscados[0] === 450 && this.precioBuscados[1] !== 500) {
                            if (event.precio <= this.precioBuscados[0]) {
                                return event
                            }

                        } else if (this.precioBuscados[0] === 500 && this.precioBuscados[1] !== 450) {
                            if (event.precio >= this.precioBuscados[0] && event) {
                                return event
                            }
                        } else {
                            return event;
                        }
                    })

                } else {
                    filtro3 = filtro1.filter(event => {
                        if (this.precioBuscados[0] === 450 && this.precioBuscados[1] !== 500) {
                            if (event.precio <= this.precioBuscados[0]) {
                                return event
                            }

                        } else if (this.precioBuscados[0] === 500 && this.precioBuscados[1] !== 450) {
                            if (event.precio >= this.precioBuscados[0] && event) {
                                return event
                            }
                        } else {
                            return event;
                        }
                    })
                }


                if (filtro2.length > 0 && filtro3.length == 0) {
                    this.productos = filtro2;

                } else if (filtro3.length > 0) {
                    this.productos = filtro3;

                } else {
                    this.productos = filtro1;

                }
            },
            cestaTotal() {
                let suma = 0;
                for (key in this.cesta) {
                    suma = suma + (this.cesta[key].producto.precio * this.cesta[key].cant);
                }
                let valor = Number(suma);

                let text = valor.toLocaleString("es-AR");
                return text;
            },
            cantTotal() {
                let cant = 0;
                for (key in this.cesta) {
                    cant = cant + this.cesta[key].cant;
                }
                return cant;
            },

        }
    }).mount('#app')

} catch (error) {
    // window.location.href = "./error.html";
}


