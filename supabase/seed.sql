-- Initial fleet. Run after schema.sql. Prices/deposits of the Hilux and Tank 300 are placeholders: edit them in /admin/cars.
insert into public.cars (slug,name,category,image,price_per_day,deposit,transmission,fuel,seats,ac,units,active) values
  ('gwm-tank-300','4x4 GWM Tank 300','4x4','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/tank_300_4x4.png',95,2000,'automatic','petrol',5,true,1,true),
  ('toyota-hilux-double-cabine','4x4 Toyota Hilux Double Cabine','4x4','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/qashqai1.jpg',90,2000,'manual','diesel',5,true,1,true),
  ('toyota-land-cruiser-7-places','4x4 Toyota Land Cruiser Auto 7 places','4x4','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/2toyota-cruiser.png',105,3000,'automatic','diesel',7,true,1,true),
  ('hyundai-i10','Hyundai i10','citadine','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_i10.jpg',20,600,'manual','petrol',5,true,2,true),
  ('peugeot-208','Peugeot 208','citadine','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_208.jpg',22,600,'manual','diesel',5,true,2,true),
  ('peugeot-301','Peugeot 301','citadine','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_1untitled_design.png',25,600,'manual','diesel',5,true,2,true),
  ('dacia-lodgy','Dacia Lodgy','citadine','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_1lodgy.jpg',45,1000,'manual','diesel',7,true,1,true),
  ('kia-seltos','Kia Seltos','midrange','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_kia-seltos.jpg',30,1000,'automatic','diesel',5,true,1,true),
  ('kia-sportage','Kia Sportage','midrange','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_sportage.jpg',49,1200,'automatic','diesel',5,true,1,true),
  ('hyundai-tucson','Hyundai Tucson','midrange','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_1tucson.jpg',50,1200,'automatic','diesel',5,true,1,true),
  ('volkswagen-t-roc','Volkswagen T-Roc','midrange','https://carrentmorocco.com/wp-content/plugins/vikrentcar/admin/resources/vthumb_t-roc.jpg',55,1200,'automatic','diesel',5,true,1,true)
on conflict (slug) do nothing;
