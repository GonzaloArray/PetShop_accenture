const { createApp } = Vue

createApp({
    data() {
        return {
            productos: [],
            categorias: [],
            productosBuscados: [],
            precioBuscados: [],
            precios: [450, 500],
            backup: [],
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            search: '',

        }
    },
    created() {
        this.traerDatos();

    },
    mounted() {
    },
    methods: {
        traerDatos() {
            fetch(this.url).then(response => response.json())
                .then(data => {
                    this.productos = data.response;

                    this.productos.forEach(event => {
                        if (!this.categorias.includes(event.tipo)) {
                            this.categorias.push(event.tipo)
                        }
                    });

                    this.backup = this.productos;

                })
                .catch(() => {
                    this.error = "There was an error, please try again later";
                })
        }

    },
    computed: {
        superFiltro() {
            let filtro1 = this.backup.filter(event => event.nombre.toLowerCase().includes(this.search.toLowerCase()));

            let filtro2 = filtro1.filter(event => this.productosBuscados.includes(event.tipo));
            let filtro3;
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

            console.log(filtro3)

            if (filtro2.length > 0 && filtro3.length == 0) {
                this.productos = filtro2;

            } else if (filtro3.length > 0) {
                this.productos = filtro3;

            } else {
                this.productos = filtro1;

            }
        },

    }
}).mount('#app')