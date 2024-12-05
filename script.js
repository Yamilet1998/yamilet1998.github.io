// Seleccionar elementos del DOM (asegúrate de que existan en todas las páginas)
const botonesAgregar = document.querySelectorAll('.agregar'); // Botones "Agregar al carrito"
const carritoContenido = document.querySelector('.carrito-contenido ul'); // Lista del carrito (si existe en esta página)
const totalElement = document.querySelector('.mt-4 h3'); // Elemento del total (si existe en esta página)
const categoryFilter = document.getElementById('categoryFilter'); // Filtro de categorías
const productItems = document.querySelectorAll('.product-item'); // Todos los productos

// Inicializar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para filtrar productos por categoría
function filterProducts() {
    const selectedCategory = categoryFilter.value; // Obtenemos la categoría seleccionada

    productItems.forEach((item) => {
        const productCategory = item.getAttribute('data-category'); // Obtenemos la categoría del producto

        // Mostrar todos si se selecciona "all", de lo contrario, filtrar por categoría
        if (selectedCategory === 'all' || productCategory === selectedCategory) {
            item.style.display = 'block';  // Mostrar producto
        } else {
            item.style.display = 'none';   // Ocultar producto
        }
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
    const boton = event.target; // Botón presionado
    const producto = boton.getAttribute('data-producto'); // Nombre del producto
    const precio = parseFloat(boton.getAttribute('data-precio')); // Precio del producto

    // Buscar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.producto === producto);

    if (productoExistente) {
        // Si ya existe, incrementar la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregarlo como nuevo producto
        carrito.push({ producto, precio, cantidad: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el carrito visualmente (si aplica)
    actualizarCarrito();
}

// Función para actualizar el contenido del carrito (si el carrito está visible en esta página)
function actualizarCarrito() {
    if (!carritoContenido || !totalElement) return; // Si no hay elementos visibles del carrito, salir

    // Limpiar contenido actual del carrito
    carritoContenido.innerHTML = '';

    let total = 0; // Inicializar el total en 0

    // Recorrer los productos en el carrito
    carrito.forEach(item => {
        // Crear un nuevo elemento para cada producto
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            ${item.producto} - S/ ${item.precio.toFixed(2)} x ${item.cantidad}
            <button class="btn btn-danger btn-sm float-end" data-producto="${item.producto}">Eliminar</button>
        `;
        carritoContenido.appendChild(li);

        // Sumar el precio total del producto al total general
        total += item.precio * item.cantidad;
    });

    // Actualizar el total en la interfaz
    totalElement.textContent = `Total: S/ ${total.toFixed(2)}`;

    // Agregar evento de eliminación a los botones en el carrito
    const botonesEliminar = carritoContenido.querySelectorAll('.btn-danger');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', eliminarDelCarrito);
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(event) {
    const boton = event.target; // Botón presionado
    const producto = boton.getAttribute('data-producto'); // Nombre del producto a eliminar

    // Filtrar el carrito para eliminar el producto
    carrito = carrito.filter(item => item.producto !== producto);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el carrito visualmente
    actualizarCarrito();
}

// Cargar el carrito visualmente al iniciar la página (si aplica)
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    filterProducts(); // Inicializar el filtrado de productos al cargar la página
});

// Asignar el evento "click" a todos los botones "Agregar al carrito"
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
});

// Escuchar cambios en el filtro y ejecutar la función de filtrado
categoryFilter.addEventListener('change', filterProducts);
