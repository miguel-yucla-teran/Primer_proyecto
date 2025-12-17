
$('#contenedor-alerta3').html(`
        <div class="alert alert-danger">
            <strong>Credencial:</strong> Email"admin" y contraseña:"12345"
            
        </div>
        
    `);
// <script></script> de index.html
$(document).ready(function() {
  $('#loginForm').submit(function(event) {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();

    // Verificar las credenciales
    if (username === 'admin' && password === '12345') {
      // Credenciales válidas, redirigir a la pantalla menu
      $('#contenedor-alerta1').html(`<div class="alert alert-sucess">
            <strong>✅  Correcto</strong> Redirigiendo a billetera.
        </div>
    `);
    setTimeout(() =>
      window.location.href = 'menu.html', 1500);
    } else {
      // Credenciales inválidas, mostrar mensaje de error
       $('#contenedor-alerta2').html(`
        <div class="alert alert-danger">
            <strong>❌ Error:</strong> Email o contraseña incorrectos.
            
        </div>
        
    `);
    setTimeout(function() {
        location.reload(); 
    }, 1500); 
    }
  });
});

// <script></script> de menu.html

$(document).ready(function() {
      // Cargar saldo real
      const saldo = localStorage.getItem('userBalance') || 60000;
      $('#balance').text(`$${parseInt(saldo).toLocaleString()}`);
      if(!localStorage.getItem('userBalance')) localStorage.setItem('userBalance', 60000);

      // Navegación con mensaje
      $('a.btn').on('click', function(e) {
        e.preventDefault();
        const destino = $(this).attr('href');
        const nombre = $(this).text();
        $('#mensajeArea').text(`✅ Redirigiendo a ${nombre}...`).css('color', 'white');
        setTimeout(() => window.location.href = destino, 1200);
      });
    });
    
    
// <script></script> de deposit.html

 $(document).ready(function() {
    // Cargar saldo al iniciar
    function cargarSaldo() {
        // Leer el saldo de LocalStorage (si no existe, usa 60000 como valor inicial)
        const saldoActual = parseInt(localStorage.getItem('userBalance')) || 60000;
        
        // Formatear el número a moneda para que se vea bien ($60,000.00)
        const formatoMoneda = new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: 'CLP' 
        }).format(saldoActual);

        // Actualizar el elemento H3 con ID 'balance'
        $('#balance').text(formatoMoneda);
    }

    
        // Llama a la función justo cuando la página termina de cargar
        cargarSaldo(); 

        $('#formDeposit').on('submit', function(e) {
            e.preventDefault();
            const monto = parseInt($('#deposito').val());

            if (monto > 0) {
                const saldoAnterior = parseInt(localStorage.getItem('userBalance')) || 60000;
                const nuevoSaldo = saldoAnterior + monto;
                
                localStorage.setItem('userBalance', nuevoSaldo);

                // Registrar movimiento
                const movs = JSON.parse(localStorage.getItem('movimientos')) || [];
                movs.unshift({ descripcion: "Depósito de dinero", monto: monto, fecha: new Date().toISOString() });
                localStorage.setItem('movimientos', JSON.stringify(movs));

                $('#contenedor-alerta1').html(`<div class="alert alert-sucess">
            <strong>✅  Bien</strong> Depositaste $${monto}
        </div>
    `);
    setTimeout(() =>
      window.location.href = 'menu.html', 2000);
            } else {
                $('#contenedor-alerta2').html(`
        <div class="alert alert-danger">
            <strong>❌ Error:</strong>  Ingrese un monto valido        
            </div>
        
    `);
    // Para recargar la pagina en cierto tiempo
    setTimeout(function() {
        location.reload(); 
    }, 1200); 
    }
        });
    });
    
    
// <script></script> de sendmoney.html


  $(document).ready(function() {
      let seleccionado = null;
      
      // Función para mostrar el botón de enviar
      function mostrarBotonEnviar() {
          $('#btnEnviar').show(); // Muestra el botón
      }

      // Función para ocultar el botón de enviar
      function ocultarBotonEnviar() {
          $('#btnEnviar').hide(); // Oculta el botón por defecto
      }
      
      $('#searchContact').on('input', function() {
          const valor = $(this).val().toLowerCase(); // Lo que el usuario escribe
          
          $('#contactList li').filter(function() {
              // Compara el texto del contacto con la búsqueda
              const nombre = $(this).data('nombre').toLowerCase();
              $(this).toggle(nombre.indexOf(valor) > -1);
          });
      });

      function cargarContactos() {
          const guardados = JSON.parse(localStorage.getItem('contactosWallet')) || [];
          if(guardados.length > 0) {
              $('#contactList').empty();
              guardados.forEach(c => {
                  $('<li>').addClass('list-group-item').attr('data-nombre', c.nombre)
                      .html(`${c.nombre}<br><small>CBU: ${c.cbu} | ${c.banco}</small>`)
                      .appendTo('#contactList');
              });
          }
      }

      // Si click en un contacto el boton enviar aparece
      $('#contactList').on('click', '.list-group-item', function() {
          $('.list-group-item').removeClass('selected');
          $(this).addClass('selected');
          seleccionado = $(this).data('nombre');
          mostrarBotonEnviar(); // Llama a la función para mostrar el botón
      });

      $('#btnAgregar').on('click', function() {
          const n = prompt("Nombre:"), c = prompt("CBU:"), b = prompt("Banco:");
          if(n && c && b) {
              const list = JSON.parse(localStorage.getItem('contactosWallet')) || [];
              list.push({nombre: n, cbu: c, banco: b});
              localStorage.setItem('contactosWallet', JSON.stringify(list));
              cargarContactos();
          }
      });

      $('#btnEnviar').on('click', function() {
          if(!seleccionado) return alert("Seleccione un contacto");
          const monto = parseInt(prompt(`Monto para ${seleccionado}:`));
          const saldo = parseInt(localStorage.getItem('userBalance')) || 60000;

          if(monto > 0 && monto <= saldo) {
              localStorage.setItem('userBalance', saldo - monto);
              const movs = JSON.parse(localStorage.getItem('movimientos')) || [];
              movs.unshift({ descripcion: `Envío a ${seleccionado}`, monto: -monto, fecha: new Date().toISOString() });
              localStorage.setItem('movimientos', JSON.stringify(movs));
              $('#contenedor-alerta1').html(`<div class="alert alert-sucess">
                  <strong>✅  Tranferencia Exitosa</strong> Transferiste${monto}          </div>
              `);
              setTimeout(() =>
                  window.location.href = 'menu.html', 2000);
          } else {
              $('#contenedor-alerta2').html(`
                  <div class="alert alert-danger">
                      <strong>❌ Error:</strong>  Saldos insufuciente o monto invalido        
                  </div>
              `);
              setTimeout(function() {
                  location.reload(); 
              }, 1200); 
          }
      });

      cargarContactos();
      ocultarBotonEnviar(); // Oculta el botón al cargar la página inicialmente
});
// <script></script> de transactions.html
$(document).ready(function() {
    // 1. Cargar transacciones reales
    const listaTransacciones = JSON.parse(localStorage.getItem('movimientos')) || [];

    // Función mejorada para detectar el tipo (incluso en datos viejos)
    function obtenerTipoSegunDescripcion(movimiento) {
        // Si ya tiene tipo (movimientos nuevos), lo usamos
        if (movimiento.tipo) return movimiento.tipo;

        // Si no tiene tipo (movimientos viejos), analizamos el texto de la descripción
        const desc = movimiento.descripcion.toLowerCase();
        if (desc.includes('envío') || desc.includes('transferencia') || desc.includes('a ')) return 'transferencia';
        if (desc.includes('compra') || desc.includes('pago')) return 'compra';
        if (desc.includes('depósito') || desc.includes('carga') || movimiento.monto > 0) return 'deposito';
        
        return 'otros';
    }

    function getTipoTransaccionLegible(tipo) {
        const nombres = {
            'compra': 'Compra',
            'deposito': 'Depósito',
            'transferencia': 'Transferencia',
            'otros': '📝 Otro'
        };
        return nombres[tipo] || '📝 Movimiento';
    }

    function mostrarUltimosMovimientos(filtro = 'todos') {
        const $lista = $('#listaMovimientos');
        $lista.empty();

        const filtrados = listaTransacciones.filter(m => {
            const tipoDetectado = obtenerTipoSegunDescripcion(m);
            if (filtro === 'todos') return true;
            return tipoDetectado === filtro;
        });

        if (filtrados.length === 0) {
            $lista.append('<li class="list-group-item text-center">No hay movimientos para esta categoría</li>');
            return;
        }

        filtrados.forEach(m => {
            const tipoDetectado = obtenerTipoSegunDescripcion(m);
            const clase = m.monto > 0 ? 'text-success' : 'text-danger';
            const signo = m.monto > 0 ? '+' : '';
            const fecha = new Date(m.fecha).toLocaleDateString();

            $lista.append(`
                <li class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <span><strong>${getTipoTransaccionLegible(tipoDetectado)}</strong>: ${m.descripcion}</span>
                        <span class="${clase} font-weight-bold">${signo}$${Math.abs(m.monto)}</span>
                    </div>
                    <small class="text-muted">${fecha}</small>
                </li>
            `);
        });
    }

    // Evento del filtro
    $('#filtroTipo').on('change', function() {
        mostrarUltimosMovimientos($(this).val());
    });

    // Carga inicial
    mostrarUltimosMovimientos();
});

