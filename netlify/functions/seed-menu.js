// One-time seed function — populates menu_items from static data
// Call via: POST /.netlify/functions/seed-menu with x-admin-token header
const { createClient } = require('@supabase/supabase-js');

const MENU = [
  { id:'chuleta-buey',      name:'Chuletón de buey',     category:'carnes',   price:48,  weight:'1 kg',         description:'Madurado 45 días en cámara propia. Brasa lenta con sal Maldon y aceite de oliva virgen.',          badge:'Estrella de la casa', available:true },
  { id:'entrecot-angus',    name:'Entrecot Angus',        category:'carnes',   price:32,  weight:'400 g',        description:'Ternera Angus irlandesa. Jugosa, con grasa intramuscular perfectamente distribuida.',              badge:null,                  available:true },
  { id:'costillas-iberico', name:'Costillas ibéricas',    category:'carnes',   price:26,  weight:'800 g',        description:'Cerdo ibérico puro de bellota. Adobo suave de pimentón y ajo, 4 horas de marinado.',              badge:'Más pedido',          available:true },
  { id:'secreto-iberico',   name:'Secreto ibérico',       category:'carnes',   price:22,  weight:'350 g',        description:'Corte exclusivo del cerdo ibérico, entre la paleta y el lomo. Tierno e intenso.',                 badge:null,                  available:true },
  { id:'presa-iberica',     name:'Presa ibérica',         category:'carnes',   price:24,  weight:'300 g',        description:'Paleta del cerdo ibérico. Veteado perfecto, jugosa y con sabor profundo.',                        badge:null,                  available:true },
  { id:'pluma-iberica',     name:'Pluma ibérica',         category:'carnes',   price:21,  weight:'280 g',        description:'Del lomo alto del ibérico. Tierna y aromática en la brasa.',                                     badge:null,                  available:false },
  { id:'pollo-corral',      name:'Pollo de corral',       category:'aves',     price:18,  weight:'Medio pollo',  description:'Criado en libertad en Aragón. Marinado en hierbas, limón y ajo negro durante 24 horas.',          badge:null,                  available:true },
  { id:'pollo-entero',      name:'Pollo entero',          category:'aves',     price:32,  weight:'Pollo entero', description:'El mismo pollo de corral, entero. Para grupos o muy hambrientos.',                               badge:null,                  available:true },
  { id:'codornices',        name:'Codornices a la brasa', category:'aves',     price:16,  weight:'4 uds.',       description:'Maceradas en tomillo, romero y miel de romero silvestre.',                                       badge:null,                  available:true },
  { id:'verduras-temporada',name:'Verduras de temporada', category:'verduras', price:9,   weight:'Ración',       description:'Selección del mercado. Pimientos, calabacín, berenjena, cebolla.',                               badge:null,                  available:true },
  { id:'patatas-brasas',    name:'Patatas a la brasa',    category:'verduras', price:6,   weight:'Ración',       description:'Patatas nuevas, romero, sal gruesa. El acompañamiento perfecto.',                                badge:null,                  available:true },
  { id:'pan-cristal',       name:'Pan de cristal',        category:'verduras', price:3,   weight:'2 piezas',     description:'Pan artesano tostado a la brasa con aceite de oliva virgen extra.',                              badge:null,                  available:true },
  { id:'chimichurri',       name:'Salsa chimichurri',     category:'salsas',   price:2.5, weight:'60 ml',        description:'Perejil, ajo, orégano, vinagre de Jerez y aceite de oliva. Receta propia.',                      badge:null,                  available:true },
  { id:'mojo-picon',        name:'Mojo picón',            category:'salsas',   price:2.5, weight:'60 ml',        description:'Pimentón rojo, ajo, comino y aceite. Intensidad media.',                                         badge:null,                  available:true },
  { id:'alioli',            name:'Alioli casero',         category:'salsas',   price:2,   weight:'60 ml',        description:'Elaborado a mano. Sin conservantes.',                                                            badge:null,                  available:true },
];

exports.handler = async (event) => {
  const CORS = { 'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json' };
  if (event.httpMethod === 'OPTIONS') return { statusCode:200, headers:CORS, body:'' };

  const token = event.headers['x-admin-token'] || '';
  const valid = process.env.ADMIN_TOKEN || 'omg2025';
  if (token !== valid) return { statusCode:401, headers:CORS, body: JSON.stringify({ error:'Unauthorized' }) };

  try {
    const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error } = await sb.from('menu_items').upsert(MENU, { onConflict:'id' }).select('id');
    if (error) throw error;
    return { statusCode:200, headers:CORS, body: JSON.stringify({ ok:true, seeded: data?.length }) };
  } catch(err) {
    return { statusCode:500, headers:CORS, body: JSON.stringify({ error: err.message }) };
  }
};
