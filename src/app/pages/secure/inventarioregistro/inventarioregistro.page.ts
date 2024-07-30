import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventario-registro',
  templateUrl: 'inventarioregistro.page.html',
  styleUrls: ['inventarioregistro.page.scss'],
})
export class InventarioregistroPage implements OnInit {
  productId: string;
  initialQuantity: number;
  date: string;
  selectedPvp: string;
  productos: any[] = []; // Arreglo para almacenar los productos

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
    this.setCurrentDate();
  }

  loadProducts() {
    this.http.post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', { accion: 'cargar_productos' })
      .subscribe(
        (response) => {
          if (response.estado) {
            this.productos = response.datos;
          } else {
            console.error('Error al cargar productos:', response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
  }

  setCurrentDate() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.date = today;
  }

  onProductChange(event: any) {
    this.productId = event.detail.value;
    const product = this.productos.find(p => p.id === this.productId);
    if (product) {
      this.selectedPvp = product.pvp;
    }
  }

  saveProduct() {
    const datos = {
      accion: 'guardar_inventario',
      producto_id: this.productId,  // ID del producto
      cantidad_inicial: this.initialQuantity,  // Cantidad inicial
      fecha_registro: this.date,  // Fecha de registro
    };

    this.http.post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        (response) => {
          if (response.estado) {
            console.log('Datos guardados exitosamente:', response.mensaje);
          } else {
            console.error('Error al guardar los datos:', response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
  }
}
