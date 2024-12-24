import { Component, inject, Input, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
//import { Cliente, OrdenCompra, Producto } from "src/app/shared/models";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Productos } from '../shop/productos.interface'; 
import { Cliente } from '../shop/cliente.interface';
import { ShopService } from 'src/app/views/shopping/shop/shop.service';
import { CommonService } from '../../../services/common.service';
import { fakerES_MX as faker } from "@faker-js/faker";
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'
import { Subscription } from 'rxjs';
import moment from 'moment';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  @ViewChild('modalSearch', { static: false }) modalSearch!: ElementRef
  @ViewChild('modalWallet', { static: false }) modalWallet!: ElementRef
  public router = inject(Router)
  private modalService = inject(NgbModal)
  /* @Input() */ //public orden!: OrdenCompra

  public items: { product: Productos, cantidad: number }[] = [];
  public cliente: Cliente[] = [];
  public itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private clienteSubscription!: Subscription;

  private walletSubscription!: Subscription
  private searchSubscription!: Subscription

  sinObservacion: boolean = false

  totalProductos: any = 0
  
  filter: any = {};
  paginate: any;
  lista_productos: any[] = [];
  orden: any= [];


  constructor( private service: ShopService,private toastr: ToastrService, private commonService:CommonService) { 

    this.walletSubscription = this.commonService.wallet.asObservable().subscribe(() => {
      this.modalService.open(this.modalWallet, { size: 'lg', centered: true })
    })
    this.searchSubscription = this.commonService.search.asObservable().subscribe(() => {
     this.modalService.open(this.modalSearch, { size: 'xl', windowClass: 'transparent-modal' })
      //this.modalService.open(this.modalSearch, { size: '', windowClass: 'transparent-modal modal-medium-large' })
      
    }
    
    )
      this.service.pedido$.subscribe(
        (res)=>{
          console.log(res)

          if(res.data.length > 0){
            res.data.forEach((e:any) => {
              e.product.cantidad = e.cantidad
            });
            this.items = res.data
          }else{
            this.items = []
          }
         
          if(this.items.length > 0){
            console.log(this.items)
            
            this.totalPorProducto()
          }else{
            // this.vmButtons[0].showimg= false
            // this.vmButtons[1].showimg= true
          }
        }
      )

      this.service.cliente$.subscribe(
        (res)=>{
          console.log(res)
          this.orden = res
        }
      )
    }
  ngOnInit(): void {
    // const cliente: Cliente = {
    //   nombre: faker.person.fullName(),
    //   direccion: faker.location.streetAddress(),
    //   telefono: faker.phone.number(),
    //   email: faker.internet.email()
    // }
    // const detalles = faker.helpers.multiple(this.createRandomProduct, { count: faker.number.int({min: 3, max: 10}) })
    // const subtotal = detalles.reduce((acc: number, curr: Producto) => acc + parseFloat(curr.precio_oferta as string), 0)
    // const iva = subtotal * 0.15
    // const total = subtotal + iva
    // this.orden = {
    //   cliente,
    //   detalles,
    //   subtotal,
    //   subtotal_0: 0,
    //   subtotal_iva: subtotal,
    //   iva,
    //   total,
    //   descuento: 0,
    //   transporte: 0,
    //   total_cobro: total
    // }


    //MIGRADO DE PEDIDOS
    this.orden = {
      nombre: '',
      cedula: '',
      direccion: '',
      observacion: '',
      cliente_email: '',
      cliente_telefono: '',
      detalles: [],
      subtotal: 0,
      descuento: 0,
      total: 0,
      porcentaje_iva: 15, 
      iva: 0,
      total_con_impuesto:0,
      estado: 'PENDIENTE',
      fecha: moment().format('YYYY-MM-DD'),
      tipo_documento: 'COTIZACION',
    }

    this.items = this.service.getItems();
    console.log(this.items )
   
    
    if(this.items.length > 0){
      this.items.forEach((item) => {
        // Verificar que item.product.fotos no esté vacío y que fotos[0].recurso exista
        if (item.product && item.product.fotos && item.product.fotos.length > 0) {
          item.product.foto1 = item.product.fotos[0].recurso;
        }
      });
     
      this.totalPorProducto()
    }else{
    //  this.vmButtons[0].showimg= false
    //  this.vmButtons[1].showimg= true
    }
   
    
    console.log(this.items)
    this.itemsCountSubscription = this.service.getItemsCount().subscribe(count => {
      console.log(count)
      this.itemCount = count;
    });
    this.clienteSubscription = this.service.getCliente().subscribe(clienteArray => {
      if (clienteArray && clienteArray.length > 0) {
        const cliente = clienteArray[0];  
        console.log(cliente.nombre);      
        
        // Asignar valores a la orden
        this.orden.nombre = cliente.nombre;
        this.orden.cedula = cliente.cedula;
        this.orden.direccion = cliente.direccion;
        this.orden.observacion = cliente.observacion;
        this.orden.cliente_email = cliente.cliente_email;
        this.orden.cliente_telefono = cliente.cliente_telefono;
      }
    });
   
   

    this.filter = {
      busqueda:'',
      filterControl: ""
    }
    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

  handleUpdateQuantity = (quantity: number) => {
    console.log(quantity);
    
  }

  // createRandomProduct = (): Producto => {
  //   const imagenNumber: number = Math.floor(Math.random() * 6) + 1
  //   const precio: number = parseFloat(faker.commerce.price())
  //   const oferta: boolean = faker.datatype.boolean({probability: 0.75})
  //   const descuento = (Math.floor(Math.random() * 25) + 1)
  //   const precio_oferta = oferta ? precio / (1 + (descuento / 100)) : precio
  //   return {
  //     id: faker.database.mongodbObjectId(),
  //     nombre: faker.commerce.productName(),
  //     codigo: faker.commerce.isbn(),
  //     descripcion: faker.commerce.productDescription(),
  //     precio,
  //     oferta,
  //     descuento,
  //     precio_oferta,
  //     stock: faker.number.int({min: 1000, max: 65000}),
  //     imagen: `assets/images/productos/repuesto-${imagenNumber}.png`,
  //   }
  // }

  ngOnDestroy() {
    if (this.itemsCountSubscription) {
      this.itemsCountSubscription.unsubscribe();
    }
    if (this.clienteSubscription) {
      this.clienteSubscription.unsubscribe();
    }
  }


  async validaOrdenPedido() {
    console.log('aqui')
    let resp = await this.validaDataGlobal().then((respuesta) => {
      console.log(respuesta)
      if(respuesta) {
        if(this.items.length != 0){
          for(let i=0; i<this.items.length;i++) {
            if (this.items[i].product?.cantidad  == undefined || this.items[i].product?.cantidad  == 0) 
              {
              this.toastr.info("El producto "+ this.items[i].product?.nombre +' no puede tener cantidad 0');
              return
            }else if(this.items[i].product?.precio1  == undefined || this.items[i].product?.precio1  == '0'){
              this.toastr.info("El producto "+ this.items[i].product?.nombre +' no puede tener precio 0');
              return
            }
          }
        }else if(this.orden.observacion == '' || this.orden.observacion == undefined){
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "¿Desea guardar sin Observación?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
            }).then((result:any) => {
                this.guardarOrdenPedido(); 
            });
             
        }else{
          this.guardarOrdenPedido(); 
        }
         
      }
    });
  
    // this.validaDataGlobal().then(async () => {
    
    //   if (this.orden.observacion == '' || this.orden.observacion == undefined ) {
    //     const result = await Swal.fire({
    //       titleText: 'Atención!',
    //       text: 'No agregó una Observación desea Continuar?',
    //       showCancelButton: true,
    //       cancelButtonText: 'Cancelar',
    //       confirmButtonText: 'Continuar'
    //     })

    //     if (result.isConfirmed) {
    //       this.guardarOrdenPedido(); 
    //     }
    //   }

    // }).catch((err) => {
    //   console.log(err);
    //   this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    // });
  }


 

   validaDataGlobal() {
    
    let flag = false;
    let sinObservacion = false;
    return new Promise((resolve, reject) => {
  
      if (
        this.orden.nombre == '' ||
        this.orden.nombre == undefined 
      ){
        this.toastr.info("Debe ingresar un Nombre del Cliente");
        flag = true;
      }else if(
        this.orden.cedula == '' ||
        this.orden.cedula == undefined 
      ) {
        this.toastr.info("Debe ingresar una Cédula o Ruc del Cliente");
        flag = true;
      }else if(
        this.orden.direccion == '' ||
        this.orden.direccion == undefined 
      ) {
        this.toastr.info("Debe ingresar una Dirección");
        flag = true;
      }
      else if(
        this.orden.cliente_email == '' ||
        this.orden.cliente_email == undefined 
      ) {
        this.toastr.info("Debe ingresar una Dirección de Correo");
        flag = true;
      }

        
     
      !flag ? resolve(true) : resolve(false);
    })
  }


  guardarOrdenPedido() {
    let sinObservacion = false
   let  mensaje = ''
    if (
      this.orden.nombre == '' ||
      this.orden.nombre == undefined 
    ){
      mensaje += "Debe ingresar un Nombre del Cliente";
      
    }else if(
      this.orden.cedula == '' ||
      this.orden.cedula == undefined 
    ) {
      mensaje += "Debe ingresar una Cédula o Ruc del Cliente";
   
    }else if(
      this.orden.direccion == '' ||
      this.orden.direccion == undefined 
    ) {
      mensaje +="Debe ingresar una Dirección";
     
    }
    else if(
      this.orden.cliente_email == '' ||
      this.orden.cliente_email == undefined 
    ) {
      mensaje +="Debe ingresar una Dirección de Correo";
     
    }else if(
      this.orden.cliente_telefono == '' ||
      this.orden.cliente_telefono == undefined 
    ) {
      mensaje +="Debe ingresar un  Teléfono";
     
    }
    else if(this.items.length != 0){
      for(let i=0; i<this.items.length;i++) {
        if (this.items[i].product?.cantidad  == undefined || this.items[i].product?.cantidad  == 0) 
          {
            mensaje +="El producto "+ this.items[i].product?.nombre +' no puede tener cantidad 0';
         
        }else if(this.items[i].product?.precio1  == undefined || this.items[i].product?.precio1  == '0'){
          mensaje +="El producto "+ this.items[i].product?.nombre +' no puede tener precio 0';
         
        }
      }
    } 

    // if(this.orden.observacion == "" || this.orden.observacion == undefined){

    //   Swal.fire({
    //     icon: "warning",
    //     title: "¡Atención!",
    //     text: "¿Desea guardar sin Observación?",
    //     showCloseButton: true,
    //     showCancelButton: true,
    //     showConfirmButton: true,
    //     cancelButtonText: "Cancelar",
    //     confirmButtonText: "Aceptar",
    //     cancelButtonColor: '#F86C6B',
    //     confirmButtonColor: '#4DBD74',
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         sinObservacion = false
    //       }else{
    //         sinObservacion = true
    //       }
    //     });
    // }
      
    
    if(mensaje.length > 0){
      this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
      return;
    }else{

      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea guardar esta orden de pedido?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
        }).then((result: any) => {
            if (result.isConfirmed) {
             // this.mensajeSpiner = "Guardando Orden de Pedido...";
             // this.lcargando.ctlSpinner(true);
              this.items.forEach(e => {
                const productSinFotos = { ...e.product };
                delete productSinFotos.fotos;
                this.orden.detalles.push(productSinFotos);
              });
              // this.items.forEach(e => {
                
                
              //   this.orden.detalles.push(e.product)
              // })
              //let id_empresa =this.dataUser.id_empresa;
             // const  $url_reporting_serve = environment.ReportingUrl + "crm_cotizacion.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa="+id_empresa+"&id_documento=@ptrIdDocumento";
          
              let data = {
                documento: this.orden,
                //url_reporting_serve: $url_reporting_serve,
                //id_empresa: this.dataUser.id_empresa
              }
               
                console.log(data)
                this.service.setOrdenPedido(data).subscribe(
                    (res) => {
                       // console.log(res);
                        if (res["status"] == 1) {
                        //this.needRefresh = true;
                        //this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "success",
                            title: "Orden de Pedido generada con éxito",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        }).then((result:any) => {
                          if (result.isConfirmed) {
                           // this.uploadFile();
                            //this.needRefresh = true;
  
                            this.closeModal();
                          }else{
                            
                            this.closeModal();
                          }
                        });
                           this.service.pedido$.emit({val: 'GUARDAR', data: this.items})
                           this.service.clearCart();
                        
                        } else {
                        //this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        });
                        }
                    },
                        (error) => {
                            //this.lcargando.ctlSpinner(false);
                            this.toastr.info(error.error.message);
                    }
                )
          }
      });
    }
  }


  increaseQuantity(product: Productos,index:number) {
    this.service.addToCart(product);
  }
  
  decreaseQuantity(product: Productos) {
    const existingItem = this.items.find(item => item.product.id_producto === product.id_producto);
    console.log(existingItem)
    if (existingItem && existingItem.cantidad > 1) {
      existingItem.cantidad -= 1;
      this.service.updateItemsCount();
    } else {
      this.items = this.items.filter(item => item.product.id_producto !== product.id_producto);
      this.service.updateItemsCount();
    }
   }

   generarOrden(){

   }

   totalPorProducto(){
    //const totalCount = this.items.reduce((total, item) => total + item.product.precio1, 0);

    this.items.forEach(item => {
      item.product.subtotal = parseFloat(item.product.precio1) * Number(item.product.cantidad);
      item.product.descuento = parseFloat(item.product.precio1) * Number(item.product.cantidad) * Number(item.product.porcentaje) / 100;
      item.product.total = item.product.subtotal -  Number(item.product.descuento);
      item.product.transporte = 0;
      item.product.subtotal_iva = item.product.codigo_impuesto_iva == 2 ? parseFloat(item.product.precio1) * Number(item.product.cantidad): 0
      item.product.subtotal_0 = item.product.codigo_impuesto_iva != 2 ? parseFloat(item.product.precio1) * Number(item.product.cantidad): 0
      this.totalProductos += parseFloat(item.product.precio1) * Number(item.product.cantidad);
    });

  

   }
   totalOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.total, 0);
    this.orden.total= totalCount
    return totalCount;
   }
    subtotalOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.subtotal, 0);
    this.orden.subtotal= totalCount
    return totalCount;
   }
   subtotalIvaOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.subtotal_iva, 0);
    this.orden.subtotal_iva= totalCount
    return totalCount;
   }
   subtotalCeroOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.subtotal_0, 0);
    this.orden.subtotal_0= totalCount
    return totalCount;
   }
   descuentoOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.descuento, 0);
    this.orden.descuento= totalCount
    return totalCount;
   }
   totalIvaOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.iva, 0);
    this.orden.iva= totalCount
    return totalCount;
   }

   totalFinalOrden(){
    const totalCount = this.items.reduce((total, item) => total + item.product.total_final, 0);
    this.orden.total_con_impuesto= totalCount
    return totalCount;
   }
   
   totalTransporte(){
    const totalCount = this.items.reduce((total, item) => total + item.product.transporte, 0);
    this.orden.transporte= totalCount
    return totalCount;
   }
   totalDescuento(event: any, i: number) {

   
  
    this.items.forEach(item => {
      item.product.subtotal = parseFloat(item.product.precio1) * Number(item.product.cantidad);
      item.product.descuento = parseFloat(item.product.precio1) * Number(item.product.cantidad) * Number(item.product.porcentaje) / 100;
      item.product.total = item.product.subtotal -  Number(item.product.descuento);
      item.product.iva = item.product.total *  0.15;
      item.product.total_final = item.product.total + item.product.iva;
      item.product.total_final += item.product.total + item.product.iva;

      if (item.product.codigo_impuesto_iva == 2) {
        item.product.subtotal_iva += item.product.subtotal -  Number(item.product.descuento);// Suma al subtotal con IVA
      } else {
        item.product.subtotal_0 += item.product.subtotal -  Number(item.product.descuento); // Suma al subtotal sin IVA
      }
      this.totalProductos += parseFloat(item.product.precio1) * Number(item.product.cantidad);
    });
    

  }

  calculoIva() {
    this.items.forEach(item => {
      item.product.iva = item.product.total *  0.15;
    });
    this.calculoTotalFinal();
  }
  calculoTotalFinal() {
    this.items.forEach(item => {
      item.product.total_final = item.product.total + item.product.iva;
    });
  }

   closeModal() {
    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
    //this.productoSrv.productos$.emit({refrescar:this.needRefresh,id:this.producto.id_producto})

    this.service.pedido$.emit({val: 'CERRAR', data: this.items})
    this.service.agregarClienteDesdeCarrito(this.orden)
    //this.activeModal.dismiss();//COMENTADO
  }
 
  incrementarCantidad(product: Productos, index: number) {

    this.service.agregarDesdeCarrito(product);
    this.calculoIva();
  }
  disminuirCantidad(product: Productos, index: number) {

    this.service.disminuirDesdeCarrito(product);
    this.calculoIva();
    
  }

  eliminarProducto(id_producto: any,index:number){
    console.log(index)
    this.service.eliminarDesdeCarrito(id_producto,index);
    
  }

  validarEmail(valor:any) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  onlyNumber(event: any): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

   validateEmail(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toLowerCase();
  
    // Remove any character that's not allowed in an email address
    value = value.replace(/[^a-z0-9@._-]/g, '');
  
    // Apply basic email structure (username@domain.com)
    const parts = value.split('@');
    if (parts.length > 1) {
      const domain = parts.pop() || '';
      const username = parts.join('@');
      
      const domainParts = domain.split('.');
      if (domainParts.length > 1) {
        const tld = domainParts.pop() || '';
        const domainName = domainParts.join('.');
        value = `${username}@${domainName}.${tld}`;
      } else {
        value = `${username}@${domain}`;
      }
    }
  
    // Update input value
    input.value = value;
  
    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const isValid = emailRegex.test(value);

    if(!isValid){
       this.toastr.warning("El email es invalido")
       return
    }
  
    // You can use this boolean for form validation or to show/hide error messages
    console.log('Is valid email:', isValid);
  }
 
}
