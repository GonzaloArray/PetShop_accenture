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
            error: '',

            //contacto
            seleccionado: [],

            // Adoptción
            perritosAdoptar : [
                {
                    name: 'Chiky',
                    descripción: 'Este perrito fue encontrado en una plaza solo sin nadie que le de amor',
                    telefono: '+54 9 11 23123221',
                    ciudad: 'Buenos Aires',
                    id: '1',
                },
                {
                    name: 'Lula',
                    descripción: 'Este perrito fue encontrado en una plaza solo sin nadie que le de amor',
                    telefono: '+54 9 11 23123221',
                    ciudad: 'Buenos Aires',
                    id: '2',
                },
                {
                    name: 'Pochi y Misha',
                    descripción: 'Este perrito fue encontrado en una plaza solo sin nadie que le de amor',
                    telefono: '+54 9 11 23123221',
                    ciudad: 'Buenos Aires',
                    id: '3',
                },
                {
                    name: 'Poli',
                    descripción: 'Este perrito fue encontrado en una plaza solo sin nadie que le de amor',
                    telefono: '+54 9 11 23123221',
                    ciudad: 'Buenos Aires',
                    id: '4',
                },
            ]
        }
    },
    created() {
        this.traerDatos();
        if (JSON.parse(localStorage.getItem('carrito'))) {
            this.cesta = JSON.parse(localStorage.getItem('carrito'));
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

                })
                .catch(() => {
                    this.error = "There was an error, please try again later";
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
            }else{
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
            return suma;
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