export const INITIAL_MENU_DATA = {
  restaurantName: "EPAZZOTE",
  subtitle: "Restaurante MEXICANO",
  printSettings: {
    size: 'a4',
    orientation: 'portrait',
    gridCols: 2, // Cuadrícula de 2 columnas por defecto
    gap: 20      // Espacio entre bloques
  },
  // Cada módulo ahora tiene un 'w' (width/colspan)
  layoutOrder: [
    { id: 'header', w: 2 },        // El header ocupa las 2 columnas
    { id: 'border-top', w: 2 },
    { id: 'sec-1', w: 1 },         // Las secciones ocupan 1 columna
    { id: 'sec-2', w: 1 },
    { id: 'border-bottom', w: 2 },
    { id: 'footer', w: 2 }
  ],
  sections: [
    {
      id: "sec-1",
      title: "DESAYUNOS",
      color: "#22d3ee",
      items: [{ id: "i1", name: "HUEVO REVUELTO C/ JAMON", price: 125, description: "Con frijol y pan." }]
    },
    {
      id: "sec-2",
      title: "BEBIDAS",
      color: "#f97316",
      items: [{ id: "b1", name: "COCA-COLA", price: 45, description: "" }]
    }
  ]
};