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
                objTarjeta: {
                numerostarjeta: [],
                fechaexpiracion: [],
                codigoseguridad: [],
                cuotas: [],
                nombreyapellido: [],
                tipodni: [],
                nrodni:[],
                },
                // //objetotarjeta
                // objtarjeta: {},

                // Los primeros 4 productos
                primerosProductos: [],
                primerosProductosMedi: [],

                // Cuando compre
                productoSuccess: [],

                // Ultima compra
                ultimaCompra: [],

                // Card Details Product
                cardProduct: [],

                valorCompra: 1,

                // Error seccion detailsCard
                errorCard: false,

                // Modal
                modal: false,

                // Favorito
                favorito: false,
                favoritosAdd: [],

                // Historial compra
                historialCompra: [],

                // Datalist
                datalist: "",

            }
        },
        created() {
            this.traerDatos();
            if (JSON.parse(localStorage.getItem('carrito'))) {
                this.cesta = JSON.parse(localStorage.getItem('carrito'));
            };
            if (JSON.parse(localStorage.getItem('producto'))) {
                this.productoSuccess = JSON.parse(localStorage.getItem('producto'));
            };
            if (JSON.parse(localStorage.getItem('ultimaCompra'))) {
                this.ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
            };
            if (JSON.parse(localStorage.getItem('favoritos'))) {
                this.favoritosAdd = JSON.parse(localStorage.getItem('favoritos'));
            };
            if (JSON.parse(localStorage.getItem('historialCompra'))) {
                this.historialCompra = JSON.parse(localStorage.getItem('historialCompra'));
            };
            this.datalist = "";
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
                        if (id !== null) {
                            this.cardProduct = this.productos.find(element => element._id === id);

                            const valor = this.cesta.filter(element => {
                                if (element.producto._id == this.cardProduct._id) {
                                    return element.producto;
                                }
                            })

                            if (valor.length > 0) {
                                this.cardProduct = valor[0].producto;
                            }

                        }

                        if (true) {
                            const valor = this.favoritosAdd.filter(favorito => {
                                if (favorito.product._id == this.cardProduct._id) {
                                    return true;
                                }
                            })
                            if (valor.length > 0) {
                                this.favorito = valor[0].fav;
                                return;
                            }
                            this.favorito = false;
                        }

                        console.log(this.datalist)

                    })
                    .catch((error) => {
                        this.error = true;
                    })
            },
            agregarCesta(producto, cant1) {

                this.modal = true
                setTimeout(() => {
                    this.modal = false;
                }, 2000);


                let prodExistente;
                let exitente = this.cesta.filter((item, index) => {
                    if (item.producto._id == producto._id) {
                        prodExistente = index;

                        return true;
                    } else {
                        return false;
                    }
                });

                if (exitente.length && cant1 > 1) {
                    this.cesta[prodExistente].cant = this.cesta[prodExistente].cant + cant1;
                    this.cesta[prodExistente].stock = this.cesta[prodExistente].stock - cant1;
                    localStorage.setItem('carrito', JSON.stringify(this.cesta));

                    return;

                } else if (exitente.length) {
                    this.cesta[prodExistente].cant++;
                    this.cesta[prodExistente].stock--;
                    localStorage.setItem('carrito', JSON.stringify(this.cesta));

                    return;

                } else if (cant1 > 1 && exitente.length == 0) {
                    producto.stock = producto.stock - cant1;
                    this.cesta.push({ producto: producto, cant: cant1 })
                    localStorage.setItem('carrito', JSON.stringify(this.cesta));

                    return;

                } else {
                    producto.stock = producto.stock--;
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

                // Ultima compra
                this.ultimaCompra = this.productoSuccess.slice(0, 4);
                localStorage.setItem('ultimaCompra', JSON.stringify(this.ultimaCompra));

                // Historial de compra
                this.historialCompra.push(this.productoSuccess);
                localStorage.setItem('historialCompra', JSON.stringify(this.historialCompra));


                // Datos tarjeta
                localStorage.setItem('datostarjeta', JSON.stringify(this.objTarjeta));

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
            },
            restarValor() {
                if (this.valorCompra > 1) {
                    this.valorCompra--;
                }
                return
            },
            sumarValor() {
                if (this.valorCompra < this.cardProduct.stock) {
                    this.valorCompra++;
                }
            },
            vaciarCarrito() {
                this.cesta = []
                localStorage.setItem('carrito', JSON.stringify(this.cesta));
            },

            // Suscripcion
            suscripcion() {
                Swal.fire({
                    title: 'Ingrese su correo electronico',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Enviar',
                    showLoaderOnConfirm: true,
                    preConfirm: (login) => {
                        return fetch(`//api.github.com/users/${login}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(response.statusText)
                                }
                                return response.json()
                            })
                            .catch(error => {
                                Swal.showValidationMessage(
                                    `Request failed: ${error}`
                                )
                            })
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: `${result.value.login} gracias por Suscribirte a 101Apatita`,
                        })
                    }
                })
            },

            // Agregar a fav
            agregarFav(product){
                this.favoritosAdd.push({product, fav: true});
                localStorage.setItem('favoritos', JSON.stringify(this.favoritosAdd));

                this.favorito = true;

            },
            eleminarFav(id){
                console.log("hola")
                const valor = this.favoritosAdd.filter(producto => producto.product._id !== id)
                this.favoritosAdd = valor;
                console.log(valor)
                localStorage.setItem('favoritos', JSON.stringify(valor));

                this.favorito = false;
            },
            dataList(){
                // datalist
                if (this.datalist.length > 0) {
                    const valor = this.productos.filter(element => element.nombre.toLowerCase().includes(this.datalist.toLowerCase()));
                    
                    if(valor.length > 0){
                        window.location.href = `./html/detailsCard.html?id=${valor[0]._id}`
                        return
                    }
                }
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

        },
    }).mount('#app')

} catch (error) {
    // window.location.href = "./error.html";
}


