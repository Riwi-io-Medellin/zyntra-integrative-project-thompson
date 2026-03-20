import { StoreCard } from '../StoreCard/StoreCard.js';


const storesData = [
  { 
    imgSrc: './src/components/img/pngwing.com.png', 
    name: 'Éxito', 
    desc: 'Precios WOW y ofertas diarias.' 
  },
  { 
    imgSrc: './src/components/img/Tiendas D1 Logo Vector.svg .png', 
    name: 'D1', 
    desc: 'Calidad alta a precios bajos.' 
  },
  { 
    imgSrc: './src/components/img/carulla.png', 
    name: 'Carulla', 
    desc: 'Frescura y productos premium.' 
  },
  { 
    imgSrc: './src/components/img/favpng_99471982f41cfd4e7e7db9b21bbcc94c.png', 
    name: 'Falabella', 
    desc: 'Todo lo que quieras.' 
  },
  { 
    imgSrc: './src/components/img/ktronix_logo.png', 
    name: 'Ktronix', 
    desc: 'En Ktronix vas a la fija.' 
  },
  { 
    imgSrc: './src/components/img/alkomprar_logo.png', 
    name: 'Alkomprar', 
    desc: 'Tecnología a tu alcance.' 
  },
  { 
    imgSrc: './src/components/img/pilatos_logo.png', 
    name: 'Pilatos', 
    desc: 'On the move.' 
  },
  { 
    imgSrc: './src/components/img/dafiti.png', 
    name: 'Dafiti', 
    desc: 'De las mejores marcas.' 
  },
  { 
    imgSrc: './src/components/img/gef-logo-png_seeklogo-59796.png', 
    name: 'Gef', 
    desc: 'La marca que conecta contigo.' 
  }
];

export function StoreGrid() {
  let gridHtml = `
    <main class="main-content" id="store-section">
      <div class="grid-container">
  `;

  storesData.forEach(store => {
    gridHtml += StoreCard(store);
  });

  gridHtml += `
      </div>
    </main>
  `;

  return gridHtml;
}

