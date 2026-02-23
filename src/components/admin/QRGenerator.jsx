import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

export const QRGenerator = ({ url, restaurantName }) => {
  const qrRef = useRef();

  const downloadQR = () => {
    // Buscamos el canvas dentro del div referenciado
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) {
      console.error("No se encontró el elemento canvas");
      return;
    }

    // Convertimos el canvas a una URL de imagen
    const pngUrl = canvas.toDataURL("image/png");
    
    // Creamos un link temporal para disparar la descarga
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Menu-${restaurantName || 'Epazzote'}.png`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 flex flex-col items-center gap-6 shadow-2xl">
      <div className="text-center">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-2">Acceso Digital</h3>
        <p className="text-[10px] text-zinc-500 uppercase">Escaneá para ver el menú en vivo</p>
      </div>

      {/* Referencia qrRef agregada al contenedor del canvas */}
      <div ref={qrRef} className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.2)]">
        <QRCodeCanvas 
          value={url} 
          size={200}
          level={"H"} 
          includeMargin={false}
          imageSettings={{
            src: "https://cdn-icons-png.flaticon.com/512/1046/1046771.png",
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      <div className="w-full space-y-2">
        <p className="text-[9px] text-zinc-600 font-mono text-center break-all mb-4 px-4">
          {url}
        </p>
        <Button 
          onClick={downloadQR}
          className="w-full bg-white text-black font-black text-[10px] uppercase flex gap-2 items-center justify-center py-3"
        >
          <Download size={14} /> Descargar QR para Mesa
        </Button>
      </div>
    </div>
  );
};