import type { CatalogItem } from '@/catalog/types';

const createPoolItems = (
  poolId: string,
  entries: Array<[id: string, label: string, notes?: string]>,
): CatalogItem[] =>
  entries.map(([id, label, notes]) => ({
    id,
    poolId,
    label,
    notes,
  }));

export const catalogItems = [
  ...createPoolItems('tent_main', [
    ['tent_main_body', 'Tienda principal'],
    ['tent_poles', 'Varillas'],
    ['tent_bag', 'Bolsa de transporte'],
  ]),
  ...createPoolItems('ground_rain_protection', [
    ['ground_tarp', 'Lona de suelo'],
    ['rainfly_main', 'Doble techo o cubierta de lluvia'],
  ]),
  ...createPoolItems('tent_setup_kit', [
    ['stakes_set', 'Juego de piquetas'],
    ['guy_lines', 'Vientos'],
    ['camp_mallet', 'Mazo'],
  ]),
  ...createPoolItems('shade_privacy', [
    ['shade_tarp', 'Toldo de sombra'],
    ['privacy_screen', 'Pantalla de privacidad'],
    ['extra_guylines', 'Vientos de refuerzo'],
  ]),
  ...createPoolItems('sleeping_bag', [
    ['sleeping_bag_main', 'Saco de dormir'],
    ['sleeping_bag_liner', 'Sábana saco'],
  ]),
  ...createPoolItems('sleeping_pad', [
    ['sleeping_pad_main', 'Colchoneta o aislante'],
    ['inflation_pump', 'Bomba o inflador'],
  ]),
  ...createPoolItems('camp_pillow', [
    ['camp_pillow_main', 'Almohada compacta'],
    ['pillow_cover', 'Funda de almohada'],
  ]),
  ...createPoolItems('comfort_bed', [
    ['light_sheet_set', 'Juego de sábanas ligero'],
    ['light_blanket', 'Manta ligera'],
  ]),
  ...createPoolItems('hammock', [
    ['hammock_main', 'Hamaca'],
    ['tree_straps', 'Cintas de sujeción'],
  ]),
  ...createPoolItems('stove', [['stove_main', 'Hornillo principal']]),
  ...createPoolItems('fuel', [['fuel_canister', 'Carga o cartucho de combustible']]),
  ...createPoolItems('fire_starting', [
    ['lighter_main', 'Mechero'],
    ['waterproof_matches', 'Cerillas impermeables'],
    ['fire_starters', 'Pastillas de encendido'],
  ]),
  ...createPoolItems('cookware_set', [
    ['pot_set', 'Juego de ollas'],
    ['pan_main', 'Sartén principal'],
  ]),
  ...createPoolItems('tableware_set', [
    ['plates_bowls', 'Platos y cuencos'],
    ['cups_set', 'Tazas o vasos'],
    ['cutlery_set', 'Cubiertos'],
  ]),
  ...createPoolItems('cooking_tools', [
    ['knife_board_set', 'Cuchillo y tabla'],
    ['spatula_tongs', 'Espátula y pinzas'],
    ['can_opener', 'Abrelatas o abridor'],
  ]),
  ...createPoolItems('coffee_tea_kit', [
    ['favorite_mug', 'Taza favorita'],
    ['coffee_press', 'Cafetera o filtro'],
    ['tea_bags', 'Té o café'],
  ]),
  ...createPoolItems('water_storage', [
    ['water_jerrycan', 'Garrafa de agua'],
    ['refill_bag', 'Bolsa de recarga'],
  ]),
  ...createPoolItems('personal_water_bottle', [
    ['water_bottle_main', 'Botella o cantimplora'],
  ]),
  ...createPoolItems('water_purification', [
    ['purification_tablets', 'Pastillas potabilizadoras'],
    ['filter_straw', 'Filtro o pajita filtrante'],
  ]),
  ...createPoolItems('cooler', [
    ['cooler_box', 'Nevera'],
    ['ice_packs', 'Acumuladores de frío'],
  ]),
  ...createPoolItems('main_food_supplies', [
    ['meal_plan', 'Plan de comidas'],
    ['breakfast_food', 'Desayunos'],
    ['main_meals', 'Comidas principales'],
  ]),
  ...createPoolItems('snacks_pack', [
    ['energy_bars', 'Barritas o snacks rápidos'],
    ['fruit_snacks', 'Fruta o snacks frescos'],
    ['nuts_pack', 'Frutos secos'],
  ]),
  ...createPoolItems('condiments_pack', [
    ['salt_pepper', 'Sal y pimienta'],
    ['oil_small', 'Aceite en formato pequeño'],
    ['sauce_pack', 'Salsas o aliños'],
  ]),
  ...createPoolItems('base_layers_spares', [
    ['socks_spares', 'Calcetines de recambio'],
    ['underwear_spares', 'Ropa interior de recambio'],
    ['tshirt_spares', 'Camisetas de recambio'],
  ]),
  ...createPoolItems('rain_protection', [
    ['rain_jacket', 'Chaqueta impermeable'],
    ['packable_rain_pants', 'Pantalón impermeable ligero'],
  ]),
  ...createPoolItems('insulation_layer', [
    ['fleece_layer', 'Forro o sudadera'],
    ['warm_midlayer', 'Capa de abrigo extra'],
  ]),
  ...createPoolItems('quick_dry_clothes', [
    ['quick_dry_top', 'Prenda superior de secado rápido'],
    ['quick_dry_bottom', 'Prenda inferior de secado rápido'],
  ]),
  ...createPoolItems('sleepwear', [['sleep_set', 'Pijama o ropa cómoda']]),
  ...createPoolItems('main_footwear', [['hiking_shoes', 'Calzado principal']]),
  ...createPoolItems('camp_footwear', [['camp_slides', 'Sandalias o chanclas de campamento']]),
  ...createPoolItems('sun_head_protection', [
    ['cap_or_hat', 'Gorra o sombrero'],
    ['sunglasses', 'Gafas de sol'],
  ]),
  ...createPoolItems('cold_accessories', [
    ['beanie', 'Gorro'],
    ['light_gloves', 'Guantes ligeros'],
  ]),
  ...createPoolItems('power_bank', [
    ['power_bank_main', 'Batería externa'],
    ['charging_cables', 'Cables de carga'],
  ]),
  ...createPoolItems('portable_power_station', [
    ['power_station_main', 'Estación de energía portátil'],
  ]),
  ...createPoolItems('portable_solar_panel', [
    ['solar_panel_foldable', 'Panel solar plegable'],
  ]),
  ...createPoolItems('headlamp', [
    ['headlamp_main', 'Frontal'],
    ['headlamp_batteries', 'Pilas o batería de recambio'],
  ]),
  ...createPoolItems('camp_lantern', [['lantern_main', 'Linterna de campamento']]),
  ...createPoolItems('flashlight_backup', [
    ['flashlight_main', 'Linterna de mano'],
    ['spare_batteries', 'Pilas de repuesto'],
  ]),
  ...createPoolItems('phone_offline_maps', [
    ['offline_maps_downloaded', 'Mapas offline descargados'],
    ['phone_cable', 'Cable del teléfono'],
  ]),
  ...createPoolItems('navigation_backup', [
    ['paper_map', 'Mapa en papel'],
    ['compass_main', 'Brújula'],
  ]),
  ...createPoolItems('first_aid', [['first_aid_pouch', 'Botiquín básico']]),
  ...createPoolItems('personal_medication', [
    ['daily_medication', 'Medicación habitual'],
    ['prescription_copy', 'Copia de receta o pauta'],
  ]),
  ...createPoolItems('sun_skin_protection', [
    ['sunscreen_main', 'Protector solar'],
    ['lip_balm', 'Protección labial'],
  ]),
  ...createPoolItems('insect_repellent', [
    ['repellent_spray', 'Repelente'],
    ['bite_relief', 'Calmante de picaduras'],
  ]),
  ...createPoolItems('multi_tool', [['multi_tool_main', 'Multiherramienta']]),
  ...createPoolItems('repair_kit', [
    ['repair_tape', 'Cinta de reparación'],
    ['patch_kit', 'Parches'],
    ['spare_cord', 'Cordino de repuesto'],
  ]),
  ...createPoolItems('camp_tools', [
    ['folding_shovel', 'Pala plegable'],
    ['camp_brush', 'Cepillo de limpieza'],
  ]),
  ...createPoolItems('emergency_signal', [
    ['emergency_whistle', 'Silbato'],
    ['emergency_blanket', 'Manta térmica'],
  ]),
  ...createPoolItems('fire_safety', [
    ['fire_gloves', 'Guantes resistentes'],
    ['extinguisher_small', 'Extintor o medida equivalente'],
  ]),
  ...createPoolItems('wash_kit', [
    ['soap_small', 'Jabón o gel'],
    ['face_wash', 'Limpieza facial'],
    ['deodorant', 'Desodorante'],
  ]),
  ...createPoolItems('dental_kit', [
    ['toothbrush_main', 'Cepillo de dientes'],
    ['toothpaste', 'Pasta dental'],
    ['dental_floss', 'Hilo dental'],
  ]),
  ...createPoolItems('quick_dry_towel', [
    ['quick_dry_towel_main', 'Toalla de secado rápido'],
  ]),
  ...createPoolItems('toilet_paper_tissues', [
    ['toilet_paper_main', 'Papel higiénico'],
    ['tissues_pack', 'Pañuelos'],
  ]),
  ...createPoolItems('sanitizer_wipes', [
    ['sanitizer_gel', 'Gel hidroalcohólico'],
    ['wet_wipes', 'Toallitas'],
  ]),
  ...createPoolItems('dishwashing_kit', [
    ['dish_soap', 'Jabón para vajilla'],
    ['sponge_main', 'Esponja'],
    ['wash_basin', 'Cubeta de lavado'],
  ]),
  ...createPoolItems('trash_bags', [['trash_bags_roll', 'Rollo de bolsas de basura']]),
  ...createPoolItems('foldable_trash_bin', [
    ['foldable_trash_bin_main', 'Cubo plegable'],
  ]),
  ...createPoolItems('identity_health_docs', [
    ['id_card', 'Documento de identidad'],
    ['health_card', 'Tarjeta sanitaria'],
  ]),
  ...createPoolItems('booking_permits', [
    ['booking_confirmation', 'Confirmación de reserva'],
    ['access_permit', 'Permisos de acceso'],
  ]),
  ...createPoolItems('cash_cards', [
    ['wallet_cash', 'Efectivo'],
    ['bank_cards', 'Tarjetas'],
    ['vehicle_keys', 'Llaves'],
  ]),
  ...createPoolItems('reading_pack', [['book_or_kindle', 'Libro o lector']]),
  ...createPoolItems('games_pack', [
    ['card_deck', 'Baraja'],
    ['compact_game', 'Juego compacto'],
  ]),
  ...createPoolItems('photo_observation', [
    ['camera_main', 'Cámara'],
    ['binoculars_main', 'Prismáticos'],
  ]),
  ...createPoolItems('journal_pack', [
    ['journal_notebook', 'Cuaderno'],
    ['pen_set', 'Bolígrafo'],
  ]),
  ...createPoolItems('fishing_pack', [
    ['fishing_rod_basic', 'Caña básica'],
    ['fishing_tackle', 'Accesorios de pesca'],
    ['fishing_permit_check', 'Permiso de pesca'],
  ]),
  ...createPoolItems('pet_food', [['pet_food_portions', 'Raciones de comida']]),
  ...createPoolItems('pet_bowl', [
    ['pet_food_bowl', 'Cuenco de comida'],
    ['pet_water_bowl', 'Cuenco de agua'],
  ]),
  ...createPoolItems('pet_leash', [
    ['pet_leash_main', 'Correa'],
    ['pet_harness', 'Arnés'],
  ]),
  ...createPoolItems('pet_rest_kit', [
    ['pet_blanket', 'Manta de mascota'],
    ['pet_bed', 'Cama o colchoneta'],
  ]),
  ...createPoolItems('pet_cleanup', [
    ['pet_waste_bags', 'Bolsas para recogida'],
    ['pet_towel', 'Toalla para mascota'],
  ]),
  ...createPoolItems('pet_medication', [
    ['pet_medication_dose', 'Medicación de mascota'],
  ]),
] satisfies CatalogItem[];
